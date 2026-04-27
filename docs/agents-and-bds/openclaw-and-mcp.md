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
| Transport | MCP SSE (`GET /sse` + `POST /messages/`) |
| Auth | `Authorization: Bearer <your Powerloom API key>` on every request |
| Health check | `GET https://bds-mcp.powerloom.io/health` |

The key you use here is the same `sk_live_...` key from [Metering & API Keys](./metering-and-api-keys.md).

## What the server exposes

**Catalog tools** — one MCP tool per `/mpp/...` route in the BDS endpoint catalog. Tool names begin with `bds_`. Most are snapshot tools (`GET` routes); `bds_mpp_stream_allTrades` is the one SSE upstream route.

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

**Repository:** [github.com/powerloom/powerloom-bds-univ3](https://github.com/powerloom/powerloom-bds-univ3)

### OpenClaw-assisted setup

When `POWERLOOM_API_KEY` is not set, OpenClaw surfaces the signup link and can guide through the metering signup and key configuration without manual steps. For copy-paste instructions ready for OpenClaw's one-shot setup flow, see `references/08-openclaw-one-shot.md` in the skill repository.

### Shipped recipes

| Recipe | Script | Mode |
|--------|--------|------|
| Whale Radar | `node scripts/whale-cron.mjs` | Bounded one-shot per cron tick (recommended for scheduled runs) |
| Whale Radar stream | `node scripts/whale-radar.mjs` | Long-running SSE stream (use for continuous background consumers) |
| Token-Flow | `node scripts/token-flow.mjs --token 0x...` | All swaps for a token across all indexed pools |
| Autonomous DeFi Analyst | `node scripts/defi-analyst.mjs` | Multi-pool analytics with narration and sampled on-chain verification |

For scheduled or cron-style deployments, prefer `whale-cron.mjs` over the SSE stream variant. The stream keeps a persistent connection open and is a poor fit for start-stop heartbeats.

### Required and optional environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POWERLOOM_API_KEY` | Yes | `sk_live_...` from metering signup |
| `POWERLOOM_MCP_URL` | No | Override MCP endpoint (default `https://bds-mcp.powerloom.io/sse`) |
| `TELEGRAM_BOT_TOKEN` | No | Whale Radar and DeFi Analyst Telegram dispatch |
| `TELEGRAM_CHAT_ID` | No | Telegram target chat |
| `DISCORD_WEBHOOK_URL` | No | Discord dispatch |
| `BDS_MCP_CALL_TIMEOUT_MS` | No | Per-tool call timeout in ms (default `60000`; raise to `120000` for `bds_mpp_stream_allTrades` with `max_events=50` under backlog) |

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
