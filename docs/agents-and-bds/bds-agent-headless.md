---
sidebar_position: 5
title: bds-agent-py
---

# `bds-agent-py` — Headless Orchestration

`bds-agent-py` is an agentic CLI for consuming BDS data without relying on a local MCP subprocess. It calls the BDS HTTP API directly, translates natural-language queries to YAML recipes, and supports wallet-funded automated signup and top-up.

**Repository:** [github.com/powerloom/bds-agent-py](https://github.com/powerloom/bds-agent-py)

## SKILL.md — framework-neutral orchestration directives

`bds-agent-py` ships a `SKILL.md` at the repository root. It is a single self-contained file that any orchestrator, autonomous agent, or IDE can fetch at session start to learn the full CLI surface, metering HTTP flow, environment variables, and common mistakes — without reading the full `USER_GUIDE.md`.

```bash
curl -sL https://raw.githubusercontent.com/powerloom/bds-agent-py/main/SKILL.md
```

`SKILL.md` covers:

- Session bootstrap (install, version check)
- Metering HTTP as the primary surface: `GET /credits/plans` → pay-signup → `GET /credits/balance` → `POST /credits/topup`
- Full CLI command table with one-line purpose per command
- Environment variables and profile precedence (short form; `USER_GUIDE.md` has full tables)
- Key distinction to avoid broken setups: the metering origin (`BDS_AGENT_SIGNUP_URL`, default `https://bds-metering.powerloom.io`) is **not** the same as the BDS data origin (`BDS_BASE_URL`, e.g. `https://bds.powerloom.io/api`)
- Hosted MCP context: `bds-agent mcp` is **stdio only**; the hosted SSE server at `https://bds-mcp.powerloom.io/sse` is a separate service
- Common mistakes section (URL confusion, MCP stdout pollution, catalog setup, pay-signup field matching)
- Canonical resource links

For the full operator reference, installation tables, and precedence rules: [`docs/USER_GUIDE.md`](https://github.com/powerloom/bds-agent-py/blob/main/docs/USER_GUIDE.md).

## When to choose this path

- You are integrating into an external orchestration framework (LangGraph, CrewAI, custom agent loop) where spawning a child MCP process is not practical.
- You want a wallet-funded agent that can sign up, pay for credits, and top up without human intervention.
- You prefer YAML-driven recipe execution over tool-per-call MCP patterns.
- You are running in a sandboxed or CI-style environment.

For OpenClaw users who want guided onboarding and MCP tools, see [`OpenClaw & Hosted MCP`](./openclaw-and-mcp.md) instead.

## Install

```bash
uv tool install .    # from a clone of bds-agent-py
```

This places `bds-agent` on your `PATH`. For project-local use without global install:

```bash
uv sync
uv run bds-agent ...
```

## Signup and credits

`bds-agent-py` uses the same metering service as all other BDS paths (`https://bds-metering.powerloom.io`).

**Browser signup:**

```bash
export BDS_AGENT_SIGNUP_URL=https://bds-metering.powerloom.io
bds-agent signup
```

Enter email and agent name when prompted, then complete browser verification. The CLI saves the resulting `sk_live_...` key to `~/.config/bds-agent/profiles/<profile>.json`.

**Pay-signup (no browser, wallet only):**

```bash
bds-agent credits plans
bds-agent credits setup-evm
bds-agent signup-pay --plan-id <id> --chain-id <chain> --token-symbol <SYMBOL>
bds-agent credits balance
```

The `setup-evm` step writes wallet credentials to `~/.config/bds-agent/profiles/<profile>.evm.env`. The `signup-pay` step executes the on-chain payment and claims the API key in a single command.

**Top-up an existing key:**

```bash
bds-agent credits topup
```

## Profile and configuration

After signup, run initial config to write BDS defaults to the active profile:

```bash
bds-agent config init
```

This sets `bds_base_url` (the BDS HTTP API origin), the endpoint catalog URL, and Powerloom chain verification defaults. It does not overwrite keys that are already set.

Inspect the active profile:

```bash
bds-agent config show
```

## Consuming data: query, create, run

`bds-agent-py` provides three commands for consuming BDS data. None of these require an MCP server.

### `bds-agent query` — natural language to HTTP

Translate a natural-language question into a BDS API call and return the result:

```bash
bds-agent query "What are the largest Uniswap V3 trades in the last epoch?"
```

The CLI resolves the appropriate `/mpp/...` route from the endpoint catalog, executes the call with your API key, and returns the response. Add `-x` to print the constructed HTTP request before executing.

### `bds-agent create` — natural language to YAML recipe

Generate a YAML recipe file from a description:

```bash
bds-agent create "Alert me when a single swap exceeds $100k on any indexed pool"
```

This writes a recipe YAML file you can review and run with `bds-agent run`.

### `bds-agent run` — execute a YAML recipe

```bash
bds-agent run ./whale-alert.yaml
```

A recipe YAML specifies the data source endpoint, rules (filters, thresholds), and sinks (Telegram, Discord, stdout). The runner executes the recipe statelessly on each invocation, which makes it well-suited for cron-style scheduled runs.

For on-chain verification of each response, set `verify: true` in the recipe. The runner will call `ProtocolState.maxSnapshotsCid` to confirm the returned CID matches the finalized state. See [`Verification in Agent Workflows`](./verification-in-agents.md) for detail.

## LLM backend (for `query` and `create`)

`bds-agent query` and `bds-agent create` require an LLM backend to translate natural language. The CLI auto-detects from API keys in the environment:

| Env var | Backend used |
|---------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic Messages API |
| `OPENAI_API_KEY` | OpenAI Chat Completions |
| Auto | Local Ollama if running |

Override explicitly:

```bash
bds-agent llm use anthropic
bds-agent llm ping          # smoke test
```

`bds-agent run` on an existing recipe does **not** require an LLM backend.

## MCP stdio (optional)

`bds-agent` can also expose BDS tools as a local MCP stdio server:

```bash
bds-agent mcp
```

This is the stdio equivalent of the hosted `bds-mcp-server` and works with Cursor, Claude Desktop, and similar clients that start MCP servers as subprocesses. It uses the same endpoint catalog and API key as `bds-agent run`.

The key difference from the hosted server:

| | `bds-agent mcp` (stdio) | Hosted `bds-mcp-server` |
|--|---|---|
| Transport | stdio (child process) | HTTP SSE |
| Deploy | Client starts the process | Runs as a service |
| Env | Profile / env in the child | Bearer header on every HTTP request |

For laptop use in Cursor or Claude Code, the stdio path is adequate. For agents running in remote environments or frameworks that cannot spawn child processes, use the hosted server.

## Related pages

- [`Metering & API Keys`](./metering-and-api-keys.md)
- [`Quickstart`](./quickstart.md) (Path A — OpenClaw)
- [`Verification in Agent Workflows`](./verification-in-agents.md)
