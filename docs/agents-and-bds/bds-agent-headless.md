---
sidebar_position: 6
title: Headless Agentic CLI for BDS
---

# `bds-agent` — Headless Orchestration

`bds-agent` is an agentic CLI for consuming BDS market data without relying on a local MCP subprocess. It calls the metered full-node resolver routes directly, translates natural-language queries to YAML recipes, and supports wallet-funded automated signup and top-up.

Its implementation is available at [github.com/powerloom/bds-agent-py](https://github.com/powerloom/bds-agent-py). The published package on PyPI is [`bds-agent`](https://pypi.org/project/bds-agent/).

---

## Install

**Preferred — PyPI**

With **`pip`** (use a virtual environment when your system Python is managed — for example `python -m venv .venv && source .venv/bin/activate` before install):

```bash
pip install bds-agent
```

Or with **[`uv`](https://docs.astral.sh/uv/)** — installs from PyPI into an isolated tool environment (similar to **pipx**) and places `bds-agent` on your `PATH` (often `~/.local/bin`):

```bash
uv tool install bds-agent
```

After an upgrade, refresh with `uv tool install --force bds-agent` if the CLI version looks stale. Confirm either install with `bds-agent --help`.

**From source (contributing, or when you need the bundled `examples/` tree)**

```bash
git clone https://github.com/powerloom/bds-agent-py.git
cd bds-agent-py
uv sync
uv tool install .
```

This places `bds-agent` on your `PATH`. For project-local use without global install:

```bash
uv sync
uv run bds-agent ...
```

**Summary of steps:**

1. List available plans
2. Setup EVM wallet credentials
3. Pay for credits
4. Check balance
5. Setup LLM backend
6. Test run and execute a query
7. Run a recipe with verification
8. Optionally, top-up credits

## Signup and credits

`bds-agent` uses the same metering service as all other BDS paths (`https://bds-metering.powerloom.io`).

:::info
Reference: [`Metering & API Keys`](./metering-and-api-keys.md)
:::

### CLI signup (free — 2 credits included)

```bash
bds-agent signup
```

The CLI prompts for email and agent name, opens the browser verification page, waits for you to complete Turnstile, then saves the API key to `~/.config/bds-agent/profiles/<profile>.json`.

![Step 1: BDS agent signup initiate with CLI](/images/bds-agentic-workflow/bds-agent-cli/1-bds-agent-signup.png)
![Step 2: CLI signup complete — API key saved to profile](/images/bds-agentic-workflow/bds-agent-cli/4-agent-cli-signup-complete.png)

**Every signup receives 2 free credits** — no wallet, no payment, no tokens required.



### Automated pay-signup (no browser, wallet only)

```bash
bds-agent credits plans
bds-agent credits setup-evm
bds-agent signup-pay --plan-id <id> --chain-id <chain> --token-symbol <SYMBOL>
bds-agent credits balance
```

1. The plans are returned from the metering service and look like this:

![Example of plans returned from the metering service](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-plans.png)

:::tip
It is recommended to sign up with plans that use $POWER as the payment token on Powerloom mainnet chain as it is the most efficient way to pay for credits and is often heavily discounted because of the low gas fees and processing overhead without requiring bridging of tokens on Powerloom mainnet.
:::

2. The `setup-evm` step writes wallet credentials to `~/.config/bds-agent/profiles/<profile>.evm.env`. The `signup-pay` step executes the on-chain payment and claims the API key in a single command.

:::warning
There is a `setup-tempo` command as well to pay for credits using a [Tempo](https://tempo.xyz/) wallet that is not supported fully yet on their mainnet. Please use the `setup-evm` command instead.
:::

For example, to pay by $POWER on Powerloom mainnet, which is an EVM chain with chain id 7869, we set it up with a private key of a funded wallet. The rest of the prompts can be left to their defaults by pressing Enter, as noted in the `[default]` prompts.

![Example of setup-evm step](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-setup-evm.png)


3. The `signup-pay` step executes the on-chain payment and claims the API key in a single command. Here we use the `launch_10_pl_power_cgt` plan, which is a 10 credit plan that costs 50 $POWER at the time of writing this guide.

![Example of signup-pay step](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-signup-pay.png)

4. Check the balance to see the credits available.

:::note
On every signup, you receive 2 free credits. And the above payment of 50 $POWER adds 10 credits to your balance. So you have 12 credits available.
:::

![Example of balance check](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-balance.png)


## Profile and configuration

After signup, run initial config to write BDS defaults to the active profile:

```bash
bds-agent config init
```

This sets `bds_base_url` (the full-node resolver HTTP origin), the endpoint catalog URL (resolved from the BDS market’s [`endpoints.json` in snapshotter-computes](https://github.com/powerloom/snapshotter-computes/blob/bds_eth_uniswapv3_core/api/endpoints.json)), and Powerloom chain verification defaults. It does not overwrite keys that are already set.

![Example of config init](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-config-init.png)

Inspect the active profile:

```bash
bds-agent config show
```

![Example of config show](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-config-show.png)

## LLM backend (for `query` and `create`)

`bds-agent query` and `bds-agent create` require an LLM backend to translate natural language. The CLI auto-detects from API keys in the environment:

### Available LLM backends

- `anthropic` - Anthropic Messages API
- `openai` - OpenAI Chat Completions
- `ollama` - Local Ollama if running
- `local` - Local GGUF
- `apfel` - Apple Intelligence

```
bds-agent llm list
  anthropic     ready
  openai        not configured
  ollama        not configured
  local         not configured
  apfel         not configured
```

:::note
At the time of writing this guide, only the `anthropic` and local `ollama` backend is supported.
:::

### Setting the LLM backend

```bash
bds-agent llm setup anthropic
bds-agent llm use anthropic
```

Once the backend is set, you can test it by running:

```bash
bds-agent llm ping
```
![Example of llm setup](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-llm-setup.png)
![Example of llm ping](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-llm-use-ping.png)

:::note
`bds-agent run` on an existing recipe does **not** require an LLM backend.
:::

## Consuming data: query, create, run

`bds-agent` provides three commands for consuming BDS data. None of these require an MCP server.

### `bds-agent query` — natural language to HTTP

Translate a natural-language question into a resolver route call and return the result:

```bash
bds-agent query "trade volume of pool 0xc7bBeC68d12a0d1830360F8Ec58fA599bA1b0e9b which is WETH/USDT in last hour" --execute
```

The agent will then translate the natural language question into a resolver route call and return the result as well if the `--execute` flag is set.

![Example of query](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-query-execute.png)

:::note
Presently, the credit balances are not returned by the resolver node. So you will need to check the balance after the query is executed.
:::

```bash
bds-agent credits balance

╭────────────────────────────────────────────────────────────────── Credits ───────────────────────────────────────────────────────────────────╮
│                                                                                                                                              │
│   Organization             org_4e07c1db5a4380439ac64b15                                                                                      │
│   Balance                  11.998611111111112                                                                                                │
│   Used (lifetime)          0.001388888888888889                                                                                              │
│   Purchased (lifetime)     10                                                                                                                │
│   Rate limits              60 req/min · 1000 req/day                                                                                         │
│                                                                                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

You can observe the credit balance has been decremented by the credit cost of the query. 1 credit = 7200 epochs worth of data. Refer to the [Metering & API Keys](/agents-and-bds/metering-and-api-keys#how-credits-are-consumed) page for more details.

### `bds-agent create` — natural language to YAML recipe

Generate a YAML recipe file from a description:

```bash
bds-agent create "Alert me when a single swap exceeds $1k on any indexed pool"

✓ Wrote /Users/anomit/workspace/gen-yaml/large-swap-alerts.yaml
Run with: bds-agent run /Users/anomit/workspace/gen-yaml/large-swap-alerts.yaml  (optional: --profile NAME)
```

This writes a recipe YAML file within the `gen-yaml` directory that you can review and run with `bds-agent run`.

A recipe YAML specifies the data source endpoint, rules (filters, thresholds), and sinks (Telegram, Discord, stdout). The runner executes the recipe statelessly on each invocation, which makes it well-suited for cron-style scheduled runs.

For on-chain verification of each response, set `verify: true` in the recipe. The runner will call `ProtocolState.maxSnapshotsCid` to confirm the returned CID matches the finalized state. See [`Verification in Agent Workflows`](./verification-in-agents.md) for detail.


### `bds-agent run` — execute a YAML recipe

:::tip
Run the recipe with the `--profile` flag to specify the profile to use. Without it, the calls to the resolver node will fail as the API key is not set. In the following example, we use the `bds-test11` profile which was created in the [Automated pay-signup](#automated-pay-signup-no-browser-wallet-only) section.
:::

```bash
bds-agent run gen-yaml/large-swap-alerts.yaml --profile bds-test11
```

![Example of run](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-run.png)

### Executing pre-packaged recipes

The [`bds-agent-py` repository](https://github.com/powerloom/bds-agent-py) ships sample recipes under `examples/`. If you installed from PyPI only, fetch an example file instead of cloning:

```bash
curl -sLO https://raw.githubusercontent.com/powerloom/bds-agent-py/main/examples/dex-alerts.yaml
bds-agent run dex-alerts.yaml --profile bds-test11
```

From a source checkout:

```bash
cd bds-agent-py
bds-agent run examples/dex-alerts.yaml --profile bds-test11
```

The bundled recipe [`examples/dex-alerts.yaml`](https://github.com/powerloom/bds-agent-py/blob/main/examples/dex-alerts.yaml) streams indexed DEX swaps and applies two alert rules. Environment and profile follow the same pattern as elsewhere in this guide (`BDS_BASE_URL`, `BDS_AGENT_PROFILE`).

| Area | YAML / value | What it does |
|------|----------------|--------------|
| **Source** | `type: bds_stream` | Subscribes to the BDS **SSE** stream (live trade payloads per epoch). |
| | `endpoint: /mpp/stream/allTrades` | All indexed pools’ swap stream. |
| | `base_url: ${BDS_BASE_URL}` | Resolver / data API origin. |
| **Auth** | `profile: ${BDS_AGENT_PROFILE}` | API key via the named profile. |
| **Sinks** | `stdout` | Prints alerts to the terminal; replace with Discord/Telegram sinks in your own copy if needed. |
| **Verification** | `verify: false` | Skips ProtocolState CID checks per batch (faster for demos). Set `verify: true` for finalized-state verification—see [Verification in Agent Workflows](./verification-in-agents.md). |
| **Lifecycle** | `reconnect: true`, `reconnect_delay: 5` | After stream errors, wait **5** seconds and reconnect. |
| | `max_reconnects: 0` | In this recipe schema, **`0` = unlimited** reconnect attempts after errors. |

**Rules:** Each rule runs **independently** per pool; **either** rule **or both** can emit alerts in the same epoch when conditions match.

| Rule | Parameters | Behavior |
|------|------------|----------|
| **`min_usd`** | `threshold: 50000` | Emits when **any single swap** is **≥ $50,000** USD (largest qualifying trade is reported). |
| **`volume_spike`** | `multiplier: 3.0`, `window_epochs: 10` | Emits when a **pool’s** epoch volume is **≥ 3×** the rolling average of its **previous 10** epochs (**per pool**). |

![Example of running a pre-packaged recipe](/images/bds-agentic-workflow/bds-agent-cli/automated/bds-agent-run-pre-packaged.png)

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

## SKILL.md — framework-neutral orchestration directives

`bds-agent` ships a `SKILL.md` at the repository root. It is a single self-contained file that any orchestrator, autonomous agent, or IDE can fetch at session start to learn the full CLI surface, metering HTTP flow, environment variables, and common mistakes — without reading the full `USER_GUIDE.md`.

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

### When to choose this path

- You are integrating into an external orchestration framework (LangGraph, CrewAI, custom agent loop) where spawning a child MCP process is not practical.
- You want a wallet-funded agent that can sign up, pay for credits, and top up without human intervention.
- You prefer YAML-driven recipe execution over tool-per-call MCP patterns.
- You are running in a sandboxed or CI-style environment.

For OpenClaw users who want guided onboarding and MCP tools, see [`OpenClaw & Hosted MCP`](./openclaw-and-mcp.md) instead.


## Related pages

- [`Metering & API Keys`](./metering-and-api-keys.md)
- [`Quickstart`](./quickstart.md) (Path A — OpenClaw)
- [`Verification in Agent Workflows`](./verification-in-agents.md)
