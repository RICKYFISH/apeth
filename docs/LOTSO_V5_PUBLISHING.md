# LOTSO V5: private website trial

**Superseded for the website integration:** the user identified the existing **LOTSO Companion V4** in a screenshot on 19 October 2026. Follow [LOTSO_DASHBOARD_PUBLISHING.md](LOTSO_DASHBOARD_PUBLISHING.md). Keep the V5 tool only as unused preparation; do not use it to replace the working V4 dashboard.

This earlier V5 investigation is preparation only: there is no live dashboard, scheduled upload, login system or payment integration in this change.

## What was checked on 19 October 2026

- Two V5 exports exist: `FINAL_OUTPUT/LOTSO_MATCH_CENTRE_V5` and `FINAL_OUTPUT/LOTSO_MATCH_CENTRE/V5`.
- The latter contains the newer orange/blue Companion V5 interface. Its manifest records a build on 10 October, 358 fixtures and fixture dates ending on 15 October. This is not a current export for 19 October.
- V5 already loads a manifest and one fixture JSON file at a time, making it suitable for private web hosting.
- `RUN_LOTSO_V5_JOB.py odds` updates bounded core odds without rebuilding the browser export. The script explicitly reserves broader attachment and relinking for maintenance. Do not turn maintenance into a frequent odds-monitoring job.
- `RUN_LOTSO_V5_JOB.py dashboard` relinks the player pool, builds the browser export and runs V5 acceptance checks. This mode does not itself attach every fresh player-market source.
- The V5 notes, review decisions and bet log use browser local storage. They are not synchronised across devices or a verified performance ledger.

## Intended daily flow

Keep the existing successful PC pulls and locked analytics rules. After the appropriate source attachment and V5 rebuild have passed their own checks, stage a new snapshot, upload it to private storage and switch the dashboard to it only when every required file is present. Preserve the previous complete release if any step fails.

The serving application must check access for **both the dashboard and every data request**. Use `dashboard.daft-a-peth.com` with a LOTSO link from the main site once hosting and authentication are verified. Do not publish reports or fixture JSON to this public GitHub repository or Astro's assets folder.

Data should be addressed within an immutable release. An authenticated release route must keep its manifest and fixture requests on that same release even during an update. Authenticated responses must not leak through a shared public cache.

## Preparing a snapshot

`tools/prepare_lotso_v5.py` reads an already-built export. It never runs a pull, changes a source file, uploads data or alters a schedule. It rejects exports older than 48 hours, missing fixture files, mismatched fixture identities, unsafe file paths, empty manifests and existing destination folders. It produces a new complete folder and checksum inventory before declaring success.

Example from a terminal in the website repository, using your actual local project location:

```powershell
py tools/prepare_lotso_v5.py --source "C:\path\to\LOTSO_PORTABLE_COMPLETE\FINAL_OUTPUT\LOTSO_MATCH_CENTRE\V5" --destination "C:\LOTSO_PRIVATE_EXPORTS\release-20261019-01"
```

The newer interface expects `DAFT_A_PETH_COMPANION.png` in the source folder's parent. The tool copies that logo and adapts its link. The separate Season Strength dashboard is explicitly marked as not included; its dependencies need separate review before publication. Machine database paths and manifest source lists are removed. This does not make fixture data public-safe: the full release remains private.

**Build age is not odds age.** Source capture times and coverage must also pass pipeline checks before upload. This tool checks packaging consistency, not analytics correctness or market completeness. A freshly rebuilt export can still contain old odds.

## Still required before activation

1. Inspect the actual Windows scheduled tasks and latest job reports to identify the successful daily pull and source-attachment sequence. The synced schedule-redirection file is not evidence of which tasks Windows currently enables.
2. Rebuild and QA V5 from current attached sources. Verify the expected export path and current fixtures locally. Do not run a second pull or full rebuild merely to test web hosting.
3. Configure private Cloudflare storage, an authenticated serving application and an upload credential restricted to the required destination. Keep credentials outside this repository and never send them in chat.
4. Implement uploads and release switching, then test interrupted uploads, failed pulls, stale snapshots and denied unauthenticated data access.
5. Add the post-success upload step to the verified PC job; verify it from an actual completed run before calling updates automatic.
6. Add the main-site navigation link only when the private dashboard is reachable.

For paid access later, add member accounts and subscription entitlement checks. Build a separate durable pre-kickoff selection/results ledger for the long-term trial; the existing local free-text bet log does not calculate or verify ROI. Check data redistribution rights and payment-provider eligibility before charging.
