# LOTSO Companion V4: website integration target

## Confirmed interface

The user identified their intended dashboard in a screenshot on 19 October 2026:

- Heading: **DAFT A PETH / LOTSO COMPANION V4**.
- Local address: `http://127.0.0.1:8876/LOTSO_MATCH_CENTRE.html?view=angles`.
- Existing filters include date, league and game. The screenshot shows Tomorrow, UEFA Champions League and All games.
- Existing tabs include Overview, Quick scan, Markets, Streaks, Leaders, Conceded & produced, Price disparity, Model value, Angles, Team news and Set pieces & xG.
- The visible results-coverage block is dated 19 October. This timestamp is not proof that all odds or every data source are current.

This selection supersedes the previous V5 choice. The stale V5 export and its packaging tool are **not** the source for the website. Do not rebuild V5 as a prerequisite for publishing the selected V4 interface.

## Integration approach

Preserve the selected interface, its working reports, filters, specialist views and locked analytics rules. The PC remains the pull runner. Package the completed V4 output only after its existing checks pass, upload it privately, then make that complete release available through an authenticated dashboard linked from Daft-a-Peth. Keep the previous complete release if a pull or upload fails.

The synced candidate is `FINAL_OUTPUT/LOTSO_MATCH_CENTRE/LOTSO_MATCH_CENTRE.html`. Its source refers to multiple generated JavaScript data files and patches. A static HTML upload alone will not reproduce the working dashboard. Confirm this is the exact directory served by the local port-8876 launcher before wiring any uploader.

Inspect the actual local server and all active dependencies. The inspected candidate calls `/api/notes` and `/api/lineups`; these need equivalent authenticated online services if those features are retained. Browser-local data will not automatically migrate or synchronise across devices. Keep private user notes separate from shared report data and restrict edits appropriately.

Several linked data files are very large. Establish which files are active and how they load before choosing an initial hosting package. Preserve existing market logic; optimise delivery in a separate, verified change. Protect the HTML and all report/data requests, and keep uploaded data out of the public GitHub repository and Astro assets.

## Activation gates

1. Confirm the port-8876 server's root directory and working API routes from the launcher/server code.
2. Identify the successful PC pull/report sequence and its completion signal without enabling additional pulls.
3. Inventory active V4 dependencies, including generated filenames, nested dashboards and server endpoints. Validate capture times and coverage, not just file modification times.
4. Configure private hosting and access; verify unauthenticated HTML and data requests are denied.
5. Stage and upload an immutable complete release, test filters and key views, then add a post-success uploader to the verified PC job.
6. Verify a real daily update before calling the integration automatic. Add the main-site link when the private dashboard is reachable.

No dashboard has been deployed, no uploader has been connected, and no PC schedules have been changed by the documentation/preparation work.

For the later paid-access stage, add member accounts, entitlement checks and an eligible payment provider. Preserve timestamped pre-kickoff selections and settled outcomes in a durable results ledger for the long-term trial.
