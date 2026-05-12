---
sidebar_position: 3
title: Metering & API Keys
---

import LiveCreditPlans from '@site/src/components/LiveCreditPlans';

# Metering & API Keys

Hosted access to the BDS market is metered. Every `/mpp/...` call against the full-node resolver deducts credits from your balance. The API key you receive after signup is the Bearer token for both direct HTTP access and the hosted MCP server.

:::note
Check the [Architecture](/agents-and-bds/overview#architecture) page for a diagram of the metering service and API key flow.
:::

**Implementation:** [`powerloom/bds-agenthub-billing-metering`](https://github.com/powerloom/bds-agenthub-billing-metering)

## Plans and credit balance

List available plans (no key required). The embed below fetches the live metering service response when this page loads, so it stays aligned with the deployed plan table.

```bash
curl -sS https://bds-metering.powerloom.io/credits/plans
```

<LiveCreditPlans />

Check your balance:

```bash
GET https://bds-metering.powerloom.io/credits/balance
Authorization: Bearer sk_live_...
```

Or via CLI:

```bash
bds-agent credits balance
```

## Signup

All signup paths lead to the same metering service at `https://bds-metering.powerloom.io/metering`.

### Browser signup (free — 2 credits included)

:::tip Free credits — no strings
The 2 free credits work identically to paid credits. Same API, same verification objects, same key format. If you want to explore what BDS data looks like before committing any tokens, this is the fastest path.
:::

You can sign up directly in the browser at [`bds-metering.powerloom.io/metering`](https://bds-metering.powerloom.io/metering) — no CLI required. Enter your email and agent name, complete Cloudflare Turnstile verification, and your API key is displayed immediately.

![Browser signup — enter email and agent name, then open verification](/images/bds-agentic-workflow/browser-signup-verify-pending.jpeg)

![Turnstile verification — solve the challenge and accept Terms of Service](/images/bds-agentic-workflow/browser-signup-turnstile-verify.png)

![API key delivered — copy it now, shown only once in this flow](/images/bds-agentic-workflow/browser-signup-api-key-ready.png)

Alternatively, use the CLI: `bds-agent signup` runs the same device flow from the terminal.

:::info
For complete CLI instructions, see the [Headless Agentic CLI for BDS](/agents-and-bds/bds-agent-headless#browser-signup-free--2-credits-included) page.
:::

**What you can do with 2 free credits:**

- **Headless** — `bds-agent query`, `bds-agent run` against any pre-packaged recipe, or direct `curl` against `/mpp/...` routes. See [Quickstart Path B](/agents-and-bds/quickstart#path-b---bds-agent-cli).
- **OpenClaw, no wallet** — paste your `sk_live_...` into the [free-key one-shot prompt](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/09-openclaw-one-shot-free-key.md) and the agent installs the `powerloom-bds-univ3` skill, wires the key, and creates a Whale Radar cron with onchain verification in every alert. See [Quickstart Path A](/agents-and-bds/quickstart#path-a---openclaw-one-shot-free-key).
- **Hosted MCP, any framework** — point Claude Code, Cursor, LangGraph, CrewAI, or any SSE-MCP-capable client at `https://bds-mcp.powerloom.io/sse` with `Authorization: Bearer sk_live_...`. See [OpenClaw & Hosted MCP](/agents-and-bds/openclaw-and-mcp).

The same `sk_live_...` works across all three surfaces. Top up with native $POWER (or any supported plan token) when the 2 credits run out — see [Top-up](#top-up) below; no re-onboarding required.

### Pay-signup (agent-first, no browser)

For automated or headless signup, use the pay-signup API directly. This requires a funded EVM wallet.

**HTTP flow:**

1. `GET /credits/plans` — discover available plans: `id`, `chain_id`, `token_symbol`, `payment_kind` (`erc20` or `native_value`).
2. `POST /signup/pay/quote` — supply `agent_name`, `plan_id`, `chain_id`, `token_symbol`, `payer_address`. Returns `signup_nonce`, `recipient`, `amount_atomic`.
3. Pay on-chain — transfer tokens to `recipient` for `amount_atomic` (ERC-20 or native per `payment_kind`).
4. `POST /signup/pay/claim` — supply `signup_nonce` and `tx_hash`. Returns `api_key`.

**Using `bds-agent`:**

```bash
bds-agent credits plans
bds-agent credits setup-evm          # saves wallet creds to profile
bds-agent signup-pay \
  --plan-id <id> \
  --chain-id <chain> \
  --token-symbol <SYMBOL>
bds-agent credits balance
```

The `bds-agent` CLI is a reference client for the same HTTP flow; both paths issue an identical `sk_live_...` key.

### Rotate a lost API key (pay-signup wallet)

This only applies if you created your account with **pay-signup** (on-chain payment). The server stores your wallet as `payer_address` and never stores the raw API secret.

**How the server knows it is you**

1. You request a **challenge**: `POST /api-key/recover/challenge` with `{ "address": "0x..." }`. The server checks that a non-revoked API key exists for that `payer_address`.
2. It returns a **single-use `nonce`**, an **exact `message` string** (includes your address, nonce, expiry, and terms URL), and persists that message server-side.
3. You sign **`message`** with the **EIP-191** wallet flow (`personal_sign` / `signMessage`). A valid signature for that address is treated as proof of control of the pay-signup wallet.
4. You submit **`POST /api-key/recover/verify`** with `{ "address", "nonce", "signature" }`. The service verifies the signature against the **stored** challenge text, then replaces `api_key_hash` with a new key and returns the new `sk_live_...` once. The previous key stops working immediately.

Email/browser signup keys are **not** tied to `payer_address`; use normal signup support flows for those accounts.

**OpenClaw and other MCP users**

The hosted MCP server only accepts an existing Bearer key; it does not run the rotation HTTP flow for you. After you rotate, update `POWERLOOM_API_KEY` (or your client config) with the new `sk_live_...`.

**Script (Node, metering repo)**

From a checkout of [`powerloom/bds-agenthub-billing-metering`](https://github.com/powerloom/bds-agenthub-billing-metering):

```bash
npm install
METERING_BASE_URL=https://bds-metering.powerloom.io \
WALLET_PRIVATE_KEY=0x... \
npm run rotate-api-key
```

The script prints the new key on stdout. Use `--base-url=https://...` instead of `METERING_BASE_URL` if you prefer.

**Agents**

Any agent that already holds the pay-signup wallet can automate the same two POSTs plus `signMessage`; there is no separate MCP tool for rotation today.

### Pay-signup with OpenClaw

If you use OpenClaw and want autonomous wallet-funded onboarding (50 $POWER for the launch plan = 10 credits + 2 bonus = 12 total), the [`powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3) skill ships a one-shot prompt that installs the skill, runs `signup-pay.mjs` against your wallet, claims the API key, wires env, and creates a Whale Radar cron — all from a single message.

:::tip No wallet yet? Start free.
You don't need a wallet to use OpenClaw with this skill. Run [`bds-agent signup`](#browser-signup-free--2-credits-included) for a free `sk_live_...` (2 credits, browser device flow) and use the [free-key one-shot prompt](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/09-openclaw-one-shot-free-key.md) instead. Same skill, same cron, same verification — no on-chain payment.
:::

The first step is to install the skill from ClawHub, and is a subset of the [one-shot prompt](https://github.com/powerloom/powerloom-bds-univ3/blob/main/references/08-openclaw-one-shot.md) for installing the skill and running the pay-signup and cron setup.

You can copy the same prompt from the skill page by selecting the "Copy Prompt" button on the skill page. with the option to `Install & Setup` instead of `Install Only`.

![ClawHub powerloom-bds-univ3 skill installation and pay-signup flow](/images/bds-agentic-workflow/clawhub-skill-prompt.png)

You will be prompted just once most likely to only provide the private key of the wallet you want to use for the pay-signup.

:::tip
* We recommend using burner wallets  for the pay-signup and topup to avoid any risk of losing funds.
* It is always a good idea to setup a micro top-up and dispatcher service to fund and topup such wallets automatically.
:::

#### Successfully installed and setup

![Successfully installed and setup](/images/bds-agentic-workflow/openclaw-automated-install.png)


## Top-up

Top-up adds credits to an existing key without creating a new account. It uses the same on-chain payment pattern as pay-signup.

#### Top-up with OpenClaw

If you use OpenClaw, you can use the OpenClaw skill to topup credits.


![Topup with OpenClaw](/images/bds-agentic-workflow/openclaw-topup.png)

**HTTP:**

```
POST /credits/topup
Authorization: Bearer sk_live_...
{ "plan_id": "...", "chain_id": "...", "tx_hash": "0x..." }
```

**CLI:**

```bash
bds-agent credits setup-evm           # if not already saved
bds-agent credits topup
```

The `powerloom-bds-univ3` skill also ships `node scripts/credits-topup.mjs` for Node-only environments — same gate as `signup-pay.mjs`: `--dry-run`, then **`--yes`** on the broadcast invocation (preferred over persisting confirmation env vars in OpenClaw); CI may use `POWERLOOM_CREDITS_TOPUP_CONFIRM=yes` once.

## How credits are consumed

Credits are deducted when the full-node resolver processes a metered `/mpp/...` request. This happens whether the request comes from:

- a direct HTTP call with `Authorization: Bearer`,
- the hosted MCP server forwarding a tool call on your behalf, or
- `bds-agent run` executing a YAML recipe.

The hosted MCP server does not apply a separate charge layer. It forwards your Bearer token to the resolver, which applies the standard metering deduction. MCP tool access is gated by the same key and balance state.

A balance at or below zero causes the resolver to return `402`. The hosted MCP server propagates this back to the MCP client. Scripts in `powerloom-bds-univ3` call `get_credit_balance` before each recipe run to surface this before it becomes a mid-run 402.

## POWER token discount

Credit plans priced in POWER (the Powerloom coordination token) carry a bulk discount relative to USDC plans. See `GET /credits/plans` for the current price matrix across available chains and token symbols.
