---
sidebar_position: 5
title: Aeon Whale Radar (GitHub Actions)
---

# Aeon Whale Radar — GitHub Actions Setup

Run verified Uniswap V3 whale alerts on a schedule using [Aeon](https://github.com/aaronjmars/aeon) + the [aeon-skills](https://github.com/powerloom/aeon-skills) package. Python prefetch owns BDS fetch and epoch cursor; the LLM only dispatches pre-built alerts via `./notify`. No VPS, no MCP server, no cron server.

**Skill repository:** [github.com/powerloom/aeon-skills](https://github.com/powerloom/aeon-skills)

---

## What you get

- Per-block BDS snapshot catch-up (`GET /mpp/snapshot/allTrades/{block}`)
- Deterministic cursor in `memory/powerloom-bds-state.json` (auto-committed)
- LLM only dispatches pre-built alerts — no sandbox fetch, no cursor hallucination
- OpenClaw `whale-cron.mjs` parity, adapted for GitHub Actions
- Alerts delivered to Telegram, Discord, or Slack via Aeon `./notify`

## Prerequisites

1. A GitHub account
2. BDS API key (`sk_live_...`) from [metering signup](./metering-and-api-keys.md#browser-signup-free--2-credits-included) (2 free credits)
3. At least one notify channel (Telegram bot token + chat ID, Discord webhook, or Slack webhook)

---

## Step 1 — Fork Aeon and enable Actions

Go to [github.com/aaronjmars/aeon](https://github.com/aaronjmars/aeon) and click **Fork**. Clone your fork locally.

GitHub disables Actions on new forks by default. Go to your fork → **Settings → Actions → General** and enable workflow runs:

![Enable GitHub Actions on the Aeon fork — Settings → Actions → General, allow workflows](/images/bds-agentic-workflow/aeon-fork-enable-actions.png)

---

## Step 2 — Install the powerloom-bds skill

Clone the skill repo and run the installer against your Aeon fork:

```bash
git clone https://github.com/powerloom/aeon-skills.git
cd your-aeon-fork   # must contain aeon.yml at repo root

/path/to/aeon-skills/install-into-aeon.sh
```

**Usage note:** The script defaults to `$(pwd)` when no argument is given — so **cd into your Aeon fork first**, or pass the fork path explicitly:

```bash
/path/to/aeon-skills/install-into-aeon.sh /path/to/your-aeon-fork
```

This copies:

| Source | Destination |
|--------|-------------|
| `powerloom-bds/` | `skills/powerloom-bds/` |
| 5 scripts | `scripts/prefetch-bds.sh`, `fetch-bds-epochs.py`, `bds_normalize.py`, `process-bds-skill.py`, `postprocess-bds.sh` |

It also runs `patch-aeon-fork.sh` (`.gitignore`, workflow env, commit allowlist).

---

## Step 3 — Enable the skill in aeon.yml

Open `aeon.yml` in your fork root. Under `skills:`, add:

```yaml
  powerloom-bds: { enabled: true, schedule: "*/5 * * * *" }
```

The schedule is cron syntax. `*/5` runs every 5 minutes, but Aeon's scheduler dedup typically gives you an effective ~15 minute cadence, which is fine for whale radar.

![aeon.yml with powerloom-bds skill enabled — add the skill entry under the skills block](/images/bds-agentic-workflow/aeon-yml-skill-enabled.png)

---

## Step 4 — Set GitHub secrets

In your fork: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Required | Value |
|--------|----------|-------|
| `BDS_API_KEY` | **Yes** | `sk_live_...` from [metering signup](./metering-and-api-keys.md#browser-signup-free--2-credits-included) |
| `TELEGRAM_BOT_TOKEN` | For TG alerts | Your Telegram bot token from @BotFather |
| `TELEGRAM_CHAT_ID` | For TG alerts | Target chat ID (use @userchatidbot to find it) |
| `DISCORD_WEBHOOK_URL` | For Discord | Webhook URL from your Discord channel settings |

If you want Telegram alerts, set both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. For Discord, set `DISCORD_WEBHOOK_URL`. For Slack, set `SLACK_WEBHOOK_URL`. At least one notify channel is required, otherwise alerts go nowhere.

![GitHub secrets configured in the Aeon fork — BDS_API_KEY plus Telegram bot token and chat ID](/images/bds-agentic-workflow/aeon-fork-github-secrets.png)

:::note
Vanilla Aeon does **not** pass `BDS_API_KEY` into the prefetch step automatically. The `patch-aeon-fork.sh` script (run by the installer) adds it to the workflow env block. If you skipped patching, add this under the prefetch step in `.github/workflows/aeon.yml`:

```yaml
          BDS_API_KEY: ${{ secrets.BDS_API_KEY }}
```
:::

---

## Step 5 — Optional: configure whale threshold

```bash
cp templates/powerloom-bds.yml.example memory/powerloom-bds.yml
```

Edit `thresholds.whale_usd` (default `25000`). Lower values (e.g. `5000`) produce more alerts; higher values filter to larger trades only. If the file is missing, prefetch creates a default at `whale_usd: 25000`.

---

## Step 6 — Commit and push

```bash
git add skills/powerloom-bds scripts/prefetch-bds.sh scripts/fetch-bds-epochs.py \
        scripts/bds_normalize.py scripts/process-bds-skill.py scripts/postprocess-bds.sh \
        .gitignore aeon.yml
# include .github/workflows/aeon.yml if patch-aeon-fork changed it
git commit -m "Add powerloom-bds whale radar skill"
git push
```

Ensure `.bds-cache/` is **not** tracked (ephemeral, wiped each run).

---

## Step 7 — Verify first run

Go to **Actions → aeon** workflow in your fork and trigger a run (or wait for cron). Select the `powerloom-bds` skill run and check the logs.

Healthy prefetch output:

```
Cursor lastStreamEpoch=25185635 → fetch from block 25185636
Fetched 5 snapshot(s): 25185636 - 25185640
process-bds-skill: epochs=5 trades=82 alerts=27 cursor=25185640
```

First run with no cursor fetches the **latest finalized epoch only**. Subsequent runs catch up block-by-block (max 100 per run). Silent runs ("no alerts") are normal when no swap exceeds your threshold.

![First successful Aeon run — prefetch log shows fetched snapshots, trades, and alerts count](/images/bds-agentic-workflow/aeon-first-run-healthy.png)

![Successful Aeon run — Telegram alerts delivered](/images/bds-agentic-workflow/aeon-first-run-telegram-alerts.png)

---

## Fetch model

The prefetch script calls:

```http
GET /mpp/snapshot/allTrades/{block_number}
Authorization: Bearer sk_live_...
```

It loops from `lastStreamEpoch + 1` through the latest finalized block (cap 100 blocks per run). This is the same per-block catch-up model as OpenClaw `whale-cron.mjs`.

**Do not use** query param forms like `/mpp/snapshot/allTrades?from_epoch=N` — the API catalog does not support them for this use case.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `BDS_API_KEY not set` in prefetch | Add the secret in fork Settings; ensure `patch-aeon-fork.sh` ran or add env mapping manually in `.github/workflows/aeon.yml` |
| `Fetched N snapshots` but `trades=0` always | Wrong API path — must be `/mpp/snapshot/allTrades/{block}`, not `?from_epoch=` |
| Cursor never advances | Add `memory/powerloom-bds-state.json` to workflow auto-commit allowlist (patch script does this) |
| Telegram formatting broken | Use the shipped alert template (project slug only in verification footer) |
| Alerts with gaps / years apart | Tip-only sampling bug — reinstall scripts from aeon-skills |

---

## Comparison with OpenClaw whale-cron

| | OpenClaw `whale-cron.mjs` | Aeon `powerloom-bds` |
|--|---------------------------|----------------------|
| Runtime | VPS / local OpenClaw | GitHub Actions |
| Fetch | MCP `bds_mpp_snapshot_allTrades/{block}` | Prefetch `GET /mpp/snapshot/allTrades/{block}` |
| Cursor | `.powerloom/whale-cron-state.json` | `memory/powerloom-bds-state.json` (git-committed) |
| Agent role | Node script only | Python prefetch + LLM notify dispatch |
| Infrastructure | Your server | GitHub (free for public repos) |

Both use **per-block snapshot catch-up**. Both produce alerts with the same verification block (CID + epoch + project slug).

---

## Re-sync after aeon-skills updates

```bash
cd your-aeon-fork
/path/to/aeon-skills/install-into-aeon.sh
git diff   # review, commit, push
```

---

## Related pages

- [`Metering & API Keys`](./metering-and-api-keys.md)
- [`Quickstart`](./quickstart.md)
- [`OpenClaw & Hosted MCP`](./openclaw-and-mcp.md)
- [`Verification in Agent Workflows`](./verification-in-agents.md)
- [aeon-skills repository](https://github.com/powerloom/aeon-skills)
