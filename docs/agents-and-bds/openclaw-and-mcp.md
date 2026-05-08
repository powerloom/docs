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

### OpenClaw-assisted setup

When `POWERLOOM_API_KEY` is not set, OpenClaw surfaces the signup link and can guide through the metering signup and key configuration without manual steps. For copy-paste instructions ready for OpenClaw's one-shot setup flow, see `references/08-openclaw-one-shot.md` in the skill repository.


:::tip
Check the [Quickstart](./quickstart.md) page for a copy-paste prompt to install the skill, set up pay-signup, and configure the API key in OpenClaw.
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

Skill env vars use the **`POWERLOOM_`** prefix. Examples:

| Variable | Required | Purpose |
|----------|----------|---------|
| `POWERLOOM_API_KEY` | Yes | `sk_live_...` from metering signup |
| `POWERLOOM_MCP_URL` | No | Override MCP endpoint (default `https://bds-mcp.powerloom.io/sse`) |
| `POWERLOOM_TELEGRAM_BOT_TOKEN` | No | Telegram dispatch |
| `POWERLOOM_TELEGRAM_CHAT_ID` | No | Telegram target chat |
| `POWERLOOM_DISCORD_WEBHOOK_URL` | No | Discord dispatch |
| `POWERLOOM_BDS_MCP_CALL_TIMEOUT_MS` | No | Per-tool timeout in ms (default `60000`; raise e.g. to `120000` if large snapshots time out) |

Pay-signup hosts may also require `POWERLOOM_EVM_PRIVATE_KEY`, `POWERLOOM_EVM_RPC_URL`, `POWERLOOM_EVM_CHAIN_ID`, `POWERLOOM_PLAN_ID`, and `POWERLOOM_TOKEN_SYMBOL` — see the skill’s `SKILL.md` and [Metering & API Keys](./metering-and-api-keys.md).

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
