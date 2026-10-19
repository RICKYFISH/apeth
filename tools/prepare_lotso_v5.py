#!/usr/bin/env python3
"""Validate and stage a LOTSO V5 browser export. Never runs pulls or uploads data."""
import argparse
import hashlib
import json
import shutil
import tempfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath


def read_json(path):
    with path.open(encoding="utf-8-sig") as stream:
        return json.load(stream)


def prepare(source, destination, max_age_hours=48):
    source, destination = source.resolve(), destination.resolve()
    repo = Path(__file__).resolve().parents[1]
    if destination == repo or repo in destination.parents:
        raise ValueError("Choose a destination outside this public website repository.")
    if destination == source or source in destination.parents or destination in source.parents:
        raise ValueError("Source and destination must be separate, non-nested folders.")
    if destination.exists():
        raise ValueError("Destination already exists. Use a new snapshot folder.")
    manifest = read_json(source / "manifest.json")
    if manifest.get("schema") != "LOTSO_V5_BROWSER_1":
        raise ValueError("Unsupported V5 manifest schema.")
    built = datetime.fromisoformat(manifest["built_at"].replace("Z", "+00:00"))
    if built.tzinfo is None:
        raise ValueError("Manifest build time must include a timezone.")
    age_hours = (datetime.now(timezone.utc) - built).total_seconds() / 3600
    if not 0 < max_age_hours <= 48:
        raise ValueError("Freshness limit must be greater than zero and at most 48 hours.")
    if age_hours < -0.25 or age_hours > max_age_hours:
        raise ValueError("V5 export is stale or has an invalid future build time. Rebuild V5 first.")
    fixtures = manifest.get("fixtures")
    if not isinstance(fixtures, list) or not fixtures:
        raise ValueError("Manifest has no fixtures; refusing to replace a working dashboard.")
    html = (source / "LOTSO_MATCH_CENTRE_V5.html").read_text(encoding="utf-8-sig")
    logo = source.parent / "DAFT_A_PETH_COMPANION.png"
    if not logo.is_file():
        raise ValueError("Missing companion logo beside the V5 folder.")
    html = html.replace("../DAFT_A_PETH_COMPANION.png", "DAFT_A_PETH_COMPANION.png")
    # Season strength is a separate dashboard with its own data dependencies.
    # Do not advertise a broken or unauthenticated link in the private package.
    html = html.replace("const SEASON_PAGE='../LOTSO_SEASON_STRENGTH.html';", "const SEASON_PAGE='#season-not-published';")
    html = html.replace('<a href="${SEASON_PAGE}">Open season-strength dashboard</a>',
                        '<span>Season-strength dashboard is not included in this trial export.</span>')
    paths, seen = [], set()
    for fixture in fixtures:
        name = fixture.get("data_file", "")
        path = PurePosixPath(name)
        if (not name or "\\" in name or path.is_absolute() or ".." in path.parts
                or path.parts[0] != "data" or path.suffix != ".json"):
            raise ValueError("Unsafe fixture data path in manifest.")
        local = (source / name).resolve()
        if source not in local.parents:
            raise ValueError("Fixture data escapes the source folder.")
        payload = read_json(local)
        if payload.get("fixture", {}).get("fixture_id") != fixture.get("fixture_id"):
            raise ValueError("Fixture identity does not match its manifest entry.")
        if fixture.get("fixture_id") in seen:
            raise ValueError("Duplicate fixture ID.")
        seen.add(fixture["fixture_id"])
        paths.append((name, local))
    # These internal machine/source paths are not needed by the browser.
    manifest.pop("database", None)
    manifest.pop("database_mtime", None)
    for fixture in fixtures:
        fixture.pop("source_list", None)
    destination.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".lotso-stage-", dir=destination.parent))
    try:
        (staging / "index.html").write_text(html, encoding="utf-8")
        shutil.copyfile(logo, staging / logo.name)
        (staging / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")
        for name, local in paths:
            target = staging / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(local, target)
        files = [{"path": str(p.relative_to(staging)), "bytes": p.stat().st_size,
                  "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
                 for p in sorted(staging.rglob("*")) if p.is_file()]
        report = {"status": "STAGED_NOT_UPLOADED", "built_at": manifest["built_at"],
                  "prepared_at": datetime.now(timezone.utc).isoformat(),
                  "fixture_count": len(fixtures), "files": files,
                  "notes": "Notes, reviews and bet log remain browser-local. Build time does not prove odds freshness."}
        (staging / "release.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
        staging.rename(destination)
    finally:
        if staging.exists():
            shutil.rmtree(staging)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Folder containing V5 HTML and manifest.json")
    parser.add_argument("--destination", type=Path, required=True, help="New private snapshot folder outside the website repo")
    parser.add_argument("--max-age-hours", type=float, default=48)
    args = parser.parse_args()
    try:
        report = prepare(args.source, args.destination, args.max_age_hours)
    except (ValueError, KeyError, TypeError, OSError) as exc:
        parser.exit(1, "Not staged: {}\n".format(exc))
    print("Staged {} fixtures. No upload performed. Output: {}".format(report["fixture_count"], args.destination))


if __name__ == "__main__":
    main()
