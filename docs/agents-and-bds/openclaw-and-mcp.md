---
sidebar_position: 4
title: OpenClaw & Hosted MCP
---

# OpenClaw + `powerloom-bds-univ3` + Hosted MCP

This page describes the MCP-first consumption path: installing the published ClawHub skill and connecting through the hosted MCP server.

## The hosted MCP server

The Powerloom BDS MCP server is a persistent HTTP service that exposes BDS data as MCP tools over SSE transport.

| Property | Value |
|----------|-------|
| Default endpoint | `https://bds-mcp.powerloom.io/sse` |
| Repository | [`powerloom/bds-mcp-server`](https://github.com/powerloom/bds-mcp-server) |
| Transport | MCP SSE (`GET /sse` + `POST /messages/`) |
| Auth | `Authorization: Bearer <your Powerloom API key>` on every request |
| Health check | `GET https://bds-mcp.powerloom.io/health` |

The key you use here is the same `sk_live_...` key from [Metering & API Keys](./metering-and-api-keys.md).

## What the server exposes

**Catalog tools** — one MCP tool per `/mpp/...` route in the BDS endpoint catalog. Tool names begin with `bds_`. Most are **snapshot** tools (bounded `GET`-style routes). The catalog may also expose **streaming** trade tools for advanced direct use; the **`powerloom-bds-univ3` skill does not call those** — its shipped scripts only use snapshot MCP calls so runs stay compatible with cron and agent sandboxes.

**Fixed tools:**

| Tool | Purpose |
|------|---------|
| `verify_data_provenance` | Check that a `cid`, `epoch_id`, and `project_id` match what is finalized on-chain in `ProtocolState.maxSnapshotsCid` |
| `get_credit_balance` | Return the current balance and rate-limit state for the authenticated key |

The server validates your key on every SSE connection and on every `/messages/` POST. A zero or exhausted balance returns 402 before any tool is executed.

## The `powerloom-bds-univ3` ClawHub skill

The skill wraps the hosted MCP server with opinionated recipes and a guided onboarding flow. It is published on ClawHub under the name `powerloom-bds-univ3`.

**Install:**

```
clawhub install powerloom-bds-univ3
```

**ClawHub:** [clawhub.ai/powerloom-bot/powerloom-bds-univ3](https://clawhub.ai/powerloom-bot/powerloom-bds-univ3)

**Repository:** [github.com/powerloom/powerloom-bds-univ3](https://github.com/powerloom/powerloom-bds-univ3)

### OpenClaw-assisted setup — two one-shot prompts

The skill ships two parallel one-shot prompts. Both gather inputs from you in chat upfront (API key + Telegram dispatch), then install the skill, wire env, and create a Whale Radar cron.

| Variant | Use when | Reference |
|---------|----------|-----------|
| **Free-key cron** | You already have an `sk_live_...` from `bds-agent signup` (2 free credits, no wallet). | [`references/09-openclaw-one-shot-free-key.md`](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/09-openclaw-one-shot-free-key.md) |
| **Pay-signup + cron** | You want autonomous wallet-funded onboarding for a 10-credit plan (50 $POWER + 2 bonus = 12 total) in the same prompt. | [`references/08-openclaw-one-shot.md`](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/08-openclaw-one-shot.md) |

**Video (free-key path):** [Setup Openclaw with free BDS API key](https://www.youtube.com/watch?v=FxQ96bgoi5s) · [BDS & Agents playlist](https://www.youtube.com/playlist?list=PLbymeirG9WMz3j7IRgrvZ9IW04e4hIgHK)

**Default to the free-key variant** unless you explicitly want the on-chain payment in the same prompt — the free path costs nothing, gets you to verified data immediately, and the same `sk_live_...` can be topped up later via [Top-up](./metering-and-api-keys.md#top-up).

:::tip
The full inlined prompts and step-by-step walkthroughs live on the [Quickstart](./quickstart.md) page (Path A free-key + wallet-funded upgrade sub-section).
:::

### Shipped recipes

All recipes use **bounded snapshot** MCP tools only (e.g. `bds_mpp_snapshot_allTrades`, `bds_mpp_snapshot_trades_pool_address`). None of them drive streaming trade consumption.

| Recipe | Script | Notes |
|--------|--------|--------|
| Whale Radar (cron, all pools) | `node scripts/whale-cron.mjs` | **Recommended** for scheduled ticks: one-shot batches, exits when done |
| Whale Radar (fixed pools) | `node scripts/whale-radar.mjs` | **Default:** one round over configured pools, then exits; **`--daemon`** for repeat |
| Token-Flow | `node scripts/token-flow.mjs --token 0x...` | **Default:** one round per resolved pool, then exits; **`--daemon`** for repeat |
| Autonomous DeFi Analyst | `node scripts/defi-analyst.mjs` | One bounded round (multi- or single-pool per recipe); add **`--daemon`** only for local repeat loops |

For OpenClaw cron jobs, use **`whale-cron.mjs`** or **`whale-radar.mjs` / `token-flow.mjs` / `defi-analyst.mjs` without `--daemon`** so each process exits after one bounded round.

### Required and optional environment variables

Skill env vars use the **`POWERLOOM_`** prefix. Only **`POWERLOOM_API_KEY`** is mandatory at install time; everything else sits in `optional_env` in the skill's `SKILL.md` schema.

| Variable | When required | Purpose |
|----------|---------------|---------|
| `POWERLOOM_API_KEY` | **Always** — only mandatory env | `sk_live_...` from `bds-agent signup` (free path) or the `signup-pay.mjs` claim output (wallet path) |
| `POWERLOOM_TELEGRAM_BOT_TOKEN` | Optional — Telegram dispatch | Set if you want alerts in Telegram (paired with chat id below) |
| `POWERLOOM_TELEGRAM_CHAT_ID` | Optional — Telegram dispatch | Target chat for the bot |
| `POWERLOOM_DISCORD_WEBHOOK_URL` | Optional — Discord dispatch | Webhook for Discord alerts |
| `POWERLOOM_MCP_URL` | Optional — transport override | Defaults to `https://bds-mcp.powerloom.io/sse` |
| `POWERLOOM_BDS_MCP_CALL_TIMEOUT_MS` | Optional — per-tool timeout in ms | Default `60000`; raise to `120000` if large snapshots time out under epoch backlog |
| `POWERLOOM_EVM_PRIVATE_KEY` | Wallet-funded path only | Payer wallet (use a **burner**); read by `scripts/signup-pay.mjs` and `scripts/credits-topup.mjs` |
| `POWERLOOM_EVM_RPC_URL` | Wallet-funded path only | JSON-RPC for the chain (e.g. `https://rpc-v2.powerloom.network`) |
| `POWERLOOM_EVM_CHAIN_ID` | Wallet-funded path only | Must match the plan's `chain_id` (e.g. `7869` for POWER) |
| `POWERLOOM_PLAN_ID` | Wallet-funded path only | e.g. `launch_10_pl_power_cgt` from `GET /credits/plans` |
| `POWERLOOM_TOKEN_SYMBOL` | Wallet-funded path only | Must match plan's `token_symbol` (e.g. `POWER`) |

The free-key one-shot prompt skips every "Wallet-funded path only" var entirely — `whale-cron.mjs` reads only `POWERLOOM_API_KEY` (+ optional Telegram envs) at runtime. See the skill's [`SKILL.md`](https://github.com/powerloom/powerloom-bds-univ3/blob/main/SKILL.md) and [Metering & API Keys](./metering-and-api-keys.md) for the authoritative list.

### Pre-flight credit check

Before each recipe run:

```bash
node scripts/ensure-credits.mjs
```

This calls `get_credit_balance` and exits non-zero if the balance is zero or the key is invalid, so a 402 mid-run does not silently stall the recipe.

## Connecting from other MCP clients

The hosted server works with any client that supports SSE MCP transport:

| Client | How |
|--------|-----|
| Claude Code | `claude mcp add --transport sse --header "Authorization: Bearer <key>" bds https://bds-mcp.powerloom.io/sse` |
| Cursor | Add a remote MCP entry with the SSE URL and the Authorization header |
| LangGraph / CrewAI | Use their MCP adapter with the SSE URL and Bearer header on all requests |

## Composition

`powerloom-bds-univ3` is designed as the data side of a brain + arms composition pattern. It provides DSV-verified Uniswap V3 data; pair it with an execution skill (swap, dispatch, portfolio management) in ClawHub to build end-to-end workflows. Each composition retains the same on-chain provenance guarantees on the data side.

## Related pages

- [`Metering & API Keys`](./metering-and-api-keys.md)
- [`Quickstart`](./quickstart.md)
- [`Verification in Agent Workflows`](./verification-in-agents.md)
