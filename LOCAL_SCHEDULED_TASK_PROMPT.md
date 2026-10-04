Continue the Nomad Estate redesign and Rust-migration project from where the last session stopped. This is an unattended scheduled run, so don't wait for answers: make the most reasonable choice, note it in PROGRESS.md, and keep going.

Working folder: D:\Desktop\NomadEstate. It holds four git repos: nomad-estate, nomad-estate-database-api, nomad-estate-ai-api, nomad-estate-database-schema-visualizer.

1. In each repo, run `git fetch origin`. Make sure branch `redesign` is checked out, then `git pull --rebase origin redesign`.
   - If a repo has uncommitted changes that are not yours, don't touch them. Skip that repo and note it in the session log.
2. Read nomad-estate\PROGRESS.md (master plan, binding decisions, heartbeat/lock rule, session log). Read the PROGRESS.md in the other three repos too. Also read nomad-estate\CLAUDE_CODE_HANDOFF_PROMPT.md for the full design system, plan and verification rules. Everything in it is binding.
3. Lock check: if "Last heartbeat" in nomad-estate\PROGRESS.md is less than 45 minutes old, another session is working. Stop immediately without changing anything, and say so in one line.
4. If every step in all four PROGRESS.md files is checked, say so in one line and stop.
5. Otherwise:
   - Set "Last heartbeat" to the current Europe/Bucharest time with the note "local scheduled run". Commit it and push it.
   - Take the first unchecked step (Part A, the UI, before Part B, the Rust backend) and work through it, step after step.
   - Keep the heartbeat fresh: update and push it at least every 30 minutes.
6. Verify everything before you push:
   - Frontend: `npm run typecheck` and `npm run build`.
   - Screenshots: use scripts/mock-api.mjs and scripts/screens.mjs (create them if they don't exist yet, as the handoff prompt describes). Take light AND dark screenshots at desktop and mobile sizes, and look at each one yourself before moving on.
   - Rust: `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`.
7. Commits:
   - Commit small, with conventional-commit messages.
   - Push to `redesign` only. Never push to main, stable or current. Never force-push. Never merge into main.
   - Run `git pull --rebase origin redesign` before every push.
   - Update the checkboxes, the heartbeat and a dated "Session log" entry in PROGRESS.md in the same commits as the work.
8. Never commit .env files or secrets. Never delete files I created.
9. Before you stop for any reason (finished, out of budget or context, an error you can't fix), make sure nomad-estate\PROGRESS.md says exactly where you stopped and what the next step is. Then give a 3-line summary: what got done, anything that needs my decision, and whether the build is green.
