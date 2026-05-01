---
sidebar_position: 2
title: Quickstart
---

# Quickstart: first BDS agent

This quickstart covers both paths from zero to a running agent. Choose one:

| Path | Best when |
|------|-----------|
| **A — OpenClaw one-shot** | You are in OpenClaw; the agent handles install, pay-signup, and cron setup from a single prompt |
| **B — `bds-agent-py`** | You are running headless or in an external orchestration environment |

Both paths use wallet-funded pay-signup — no manual browser step is required to get started.

---

## Path A — OpenClaw one-shot

![ClawHub card for the Powerloom Uniswap V3 timeseries data skill](/images/bds-agentic-workflow/clawhub-powerloom-bds-univ3-skill.png)

### What you need

- 🦞 An OpenClaw environment
- `node` (v20+) available in the agent's shell
- A funded EVM wallet: POWER (native, chain 7869) for the `launch_10_pl_power_cgt` plan
- Your wallet's `EVM_PRIVATE_KEY`, `EVM_RPC_URL` (`https://rpc-v2.powerloom.network`), `EVM_CHAIN_ID` (`7869`)
- Optional: Telegram bot token and chat ID for alert delivery

### Run the one-shot

[Paste the following](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/08-openclaw-one-shot.md) as a single message to OpenClaw. It installs the skill, runs `scripts/signup-pay.mjs` to do a headless wallet-funded pay-signup, wires the resulting API key into OpenClaw config, and creates a Whale Radar cron job.

```
Install the skill "🦄 Powerloom Uniswap V3 timeseries data" (powerloom-bds-univ3) from ClawHub.
After install, run npm install in the skill directory.

Then set up pay-signup and a whale radar cron. Details:

1. PLAN: launch_10_pl_power_cgt (POWER native on chain 7869, rpc-v2.powerloom.network)
2. The user provides a private key for the payer wallet — run `node scripts/signup-pay.mjs` for pay-signup.
   `signup-pay.mjs` uses `quote.payment_kind`: `native_value` → `sendTransaction({ value })`; `erc20` → `token.transfer()`.
3. After signup, set the `sk_live_...` API key and all six env vars in OpenClaw under
   `skills.entries.powerloom-bds-univ3.env.*`:
   `EVM_PRIVATE_KEY`, `EVM_RPC_URL`, `EVM_CHAIN_ID`, `PLAN_ID`, `TOKEN_SYMBOL`, `POWERLOOM_API_KEY`.
   If the schema expects strings, pass `EVM_CHAIN_ID` as a quoted string (e.g. `"7869"`).
4. `scripts/whale-cron.mjs` should:
   - Use `lib/mcp.mjs` `callTool()` for all MCP calls (SSE handshake, not raw HTTP).
   - Use `lib/trade-utils.mjs` `flattenAllTradesFromSnapshot()` to parse the snapshot.
   - Response shape: `result.data.tradeData` = `{ poolAddr: { trades: [...] } }`.
   - Resolve pool token names with `bds_mpp_pool_pool_address_metadata` per unknown pool;
     cache in `.powerloom/pool-metadata-cache.json` (override with `WHALE_CRON_POOL_CACHE`).
   - Verification: `result.data.verification` = `{ cid, epochId, projectId }` — surface in alerts.
   - Telegram: `parse_mode: MarkdownV2` with full escaping, or plain-text fallback.
   - If the script is missing or broken, rebuild using the skill's `lib/*` helpers only.
5. Create an OpenClaw cron job:
   - Name: "Whale Radar"
   - Schedule: every 15s (`--every 15s`)
   - Timeout: 90s (`--timeout 90000`)
   - Session: isolated (`--session isolated`)
   - Flags: `--no-deliver`, `--light-context`
   - Message: a shell command that `cd`s to the skill dir, sets env inline
     (`POWERLOOM_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `BDS_MCP_CALL_TIMEOUT_MS=120000`,
     `WHALE_CRON_THRESHOLD=10000`), then runs `node scripts/whale-cron.mjs`.
   - Telegram: read `botToken` from OpenClaw `channels.telegram` / config; chat id from user or config.
6. Before the first run: `rm -f .powerloom/whale-cron-state.json` if you need a clean epoch cursor.
   Keep `.powerloom/pool-metadata-cache.json` across reinstalls unless debugging metadata.
7. Set WHALE_CRON_STATE_FILE and WHALE_CRON_POOL_CACHE to paths outside the skill directory
   (e.g. in the workspace root) so they survive `openclaw skills install --force`.

Constraints:
- Do NOT use `bds_mpp_stream_allTrades` for this cron — use `bds_mpp_snapshot_allTrades` only.
- Do NOT run the tracker as a background process — use OpenClaw cron only.
- Do NOT show "???" for unknown tokens — resolve via the metadata tool or show the address.
```

### What the agent does

OpenClaw works through the prompt sequentially. The key automated steps:

**Pay-signup via `node scripts/signup-pay.mjs`** — the script POSTs a quote, broadcasts the native POWER transfer on chain 7869, then claims the API key:

```
[signup-pay] payment_kind=native_value → send native/CGT value to recipient
Submitted tx 0x4a3f...
{
  "api_key": "sk_live_...",
  "org_id": "org_...",
  "credit_balance": 100,
  "plan_id": "launch_10_pl_power_cgt",
  "tx_hash": "0x4a3f...",
  "chain_id": 7869,
  "notice": "Export: export POWERLOOM_API_KEY=<api_key> (do not commit keys)."
}
```

**Env vars wired into OpenClaw config** — all six are set under `skills.entries.powerloom-bds-univ3.env.*`:
`EVM_PRIVATE_KEY`, `EVM_RPC_URL`, `EVM_CHAIN_ID`, `PLAN_ID`, `TOKEN_SYMBOL`, `POWERLOOM_API_KEY`.

![OpenClaw automated agent setup](/images/bds-agentic-workflow/openclaw-automated-install.png)

**Cron created** — `openclaw cron add` registers the Whale Radar cron. From that point, every 15 seconds the cron fires `node scripts/whale-cron.mjs`, which fetches a finalized all-trades snapshot via `bds_mpp_snapshot_allTrades`, filters swaps above the configured USD threshold, and dispatches alerts to Telegram.

![OpenClaw whale cron setup completed](/images/bds-agentic-workflow/openclaw-cronjob-setup-complete.png)

Each alert includes the `verification` block from `result.data.verification`:

```
🐳 Whale alert: WBTC → USDC  $245,000

Pool: 0x99ac8cA7087fA4A2A1FB6357269965A2014ABc17
Epoch: 24785719
✅ Verified on-chain
   cid: bafkrei...
   project: allTradesSnapshot:0x26c4...
```

![OpenClaw whale cron alert](/images/bds-agentic-workflow/openclaw-cronjob-whale-alert.png)

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| `payment_mismatch` from `signup-pay.mjs` | Ensure `payment_kind === "native_value"` branch uses `sendTransaction({ to, value })` not `token.transfer()`. This is already handled in the shipped script. |
| `401` on first cron run | `POWERLOOM_API_KEY` was not set in the cron env — verify the six vars are wired under `skills.entries.powerloom-bds-univ3.env.*` |
| Timeout on `bds_mpp_snapshot_allTrades` | Set `BDS_MCP_CALL_TIMEOUT_MS=120000` in the cron message; 60s default may be too short under epoch backlog |
| "???" token names | Pool metadata cache not built yet; first run resolves all unknown pools via `bds_mpp_pool_pool_address_metadata` |

---

## Path B — `bds-agent-py`

### What you need

- Python 3.12+, `uv` installed
- A clone of [github.com/powerloom/bds-agent-py](https://github.com/powerloom/bds-agent-py)
- A funded EVM wallet on chain 7869

### Install and configure

```bash
uv tool install .           # from a clone of bds-agent-py
bds-agent credits plans     # browse available plans
```

### Pay-signup

```bash
bds-agent credits setup-evm
# prompts for EVM_PRIVATE_KEY, EVM_RPC_URL, EVM_CHAIN_ID
# writes ~/.config/bds-agent/profiles/<profile>.evm.env

bds-agent signup-pay \
  --plan-id launch_10_pl_power_cgt \
  --chain-id 7869 \
  --token-symbol POWER
```

The CLI prints the quote, asks for confirmation, then broadcasts and claims:

```
Pay-signup quote  plan=launch_10_pl_power_cgt  chain_id=7869
  Send 10000000000000000000 wei (chain native / CGT) to treasury 0x...
  From: 0x<your-wallet>  (expires: 2026-04-27T14:30:00Z)
Broadcast native transfer now? [Y/n]:
tx 0x4a3f...  — claiming API key…

╭── Ready ──────────────────────────────────────────────╮
│ ✓ You are signed in. API key saved securely.          │
│ Profile  default                                      │
│ Organization  org_...                                 │
│ Credentials  ~/.config/bds-agent/profiles/default.json│
╰───────────────────────────────────────────────────────╯
```

### Set BDS defaults and verify

```bash
bds-agent config init       # writes bds_base_url, catalog URL, verification defaults
bds-agent credits balance   # confirm key is live and balance is non-zero
```

`config init` output:

```
╭── ✓ Defaults applied ─────────────────────────────────────────────────────╮
│  Profile  ~/.config/bds-agent/profiles/default.json                       │
│                                                                            │
│  Setting                           Value                                  │
│  Snapshotter base URL              https://bds.powerloom.io/api           │
│  Endpoints catalog (JSON)          https://raw.githubusercontent.com/...  │
│  Powerloom chain JSON-RPC          https://rpc-v2.powerloom.network/      │
│  ProtocolState contract            0x1d0e010Ff11b781CA1dE34BD25a0037...   │
│  DataMarket contract               0x26c44e5CcEB7Fe69Cffc933838CF402...   │
╰────────────────────────────────────────────────────────────────────────────╯
```

### Run a query or a recipe

**Natural language query** (no MCP server needed):

```bash
bds-agent query "Top 5 Uniswap V3 swaps by USD volume in the last epoch"
```

**Generate a YAML recipe from a description:**

```bash
bds-agent create "Alert when any single swap exceeds \$100k"
```

**Execute a recipe with on-chain verification:**

```bash
bds-agent run ./whale-alert.yaml    # verify: true in the YAML triggers maxSnapshotsCid check
```

### Device/browser signup (alternative to pay-signup)

If you prefer not to use a wallet directly:

```bash
export BDS_AGENT_SIGNUP_URL=https://bds-metering.powerloom.io
bds-agent signup
```

The CLI prints a browser URL and a user code, then waits:

```
────────── BDS agent signup ──────────
Email user@example.com  ·  Agent my-bds-agent

╭── Verify your device ──────────────────────────────────╮
│ Open this link in your browser                         │
│                                                        │
│ https://bds-metering.powerloom.io/verify?token=...     │
│                                                        │
│ Enter this code when the page asks                     │
│ ╭──────────────╮                                       │
│ │  ABCD-1234   │                                       │
│ ╰──────────────╯                                       │
╰── Complete verification in browser, then return here ──╯

⣾ Waiting for you to finish in the browser… (Ctrl+C to cancel)
```

After browser verification, the key is saved and the same `bds-agent config init` / `bds-agent credits balance` flow applies.

---

## Next steps

- Understand the credit model: [`Metering & API Keys`](./metering-and-api-keys.md)
- MCP tool reference and other recipes: [`OpenClaw & Hosted MCP`](./openclaw-and-mcp.md)
- Headless YAML recipes and LLM backends: [`bds-agent-py`](./bds-agent-headless.md)
- Verify a payload on-chain: [`Verification in Agent Workflows`](./verification-in-agents.md)
