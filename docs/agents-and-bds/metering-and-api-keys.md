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

All signup paths lead to the same metering service at `https://bds-metering.powerloom.io`.

### Browser signup (free — 2 credits included)

**Via CLI:**

```bash
bds-agent signup
```

This will initially ask you for your email and agent name, then ask you to head to [bds-metering.powerloom.io/metering](https://bds-metering.powerloom.io/metering) and fill up the device code as shown in the terminal.

![Step 1: BDS agent signup initiate with CLI](/images/bds-agentic-workflow/bds-agent-cli/1-bds-agent-signup.png)
![Step 2: Open turnstile verification in browser](/images/bds-agentic-workflow/bds-agent-cli/2-browser-verify-turnstile.png)


Once you have completed the verification, return to the agent CLI. It would have confirmed the signup with the metering service and created a new profile with the API key saved to `~/.config/bds-agent/profiles/<profile>.json`.

![Step 3: Enter user code and complete verification](/images/bds-agentic-workflow/bds-agent-cli/3-browser-verification-complete.png)
![Step 4: Copy API key and save to profile](/images/bds-agentic-workflow/bds-agent-cli/4-agent-cli-signup-complete.png)


**Every browser signup receives 2 free credits** — no wallet, no payment, no tokens required. This is enough to make API calls against the metered BDS endpoints and see verified responses with full provenance (`cid`, `epochId`, `projectId`).

:::tip Free credits — no strings
The 2 free credits work identically to paid credits. Same API, same verification objects, same key format. If you want to explore what BDS data looks like before committing any tokens, this is the fastest path.
:::

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

### Pay-signup with OpenClaw

If you use OpenClaw, you can use the OpenClaw skill to signup and topup credits.

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

The `powerloom-bds-univ3` skill also ships `node scripts/credits-topup.mjs` for Node-only environments.

## How credits are consumed

Credits are deducted when the full-node resolver processes a metered `/mpp/...` request. This happens whether the request comes from:

- a direct HTTP call with `Authorization: Bearer`,
- the hosted MCP server forwarding a tool call on your behalf, or
- `bds-agent run` executing a YAML recipe.

The hosted MCP server does not apply a separate charge layer. It forwards your Bearer token to the resolver, which applies the standard metering deduction. MCP tool access is gated by the same key and balance state.

A balance at or below zero causes the resolver to return `402`. The hosted MCP server propagates this back to the MCP client. Scripts in `powerloom-bds-univ3` call `get_credit_balance` before each recipe run to surface this before it becomes a mid-run 402.

## POWER token discount

Credit plans priced in POWER (the Powerloom coordination token) carry a bulk discount relative to USDC plans. See `GET /credits/plans` for the current price matrix across available chains and token symbols.
