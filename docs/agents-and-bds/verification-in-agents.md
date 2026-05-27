---
sidebar_position: 7
title: Verification in Agent Workflows
---

# Verification in Agent Workflows

Every BDS response from a supported route includes a `verification` object. This object gives the agent the information needed to confirm that the payload maps to a CID finalized on-chain by the DSV network — without trusting the API operator.

This is the trust hook for agent consumers. Alerts and analytics derived from BDS data carry a cryptographic receipt, not just an API response.

## The `verification` object

BDS routes such as the all-trades snapshot and the SSE stream attach `verification` alongside the data:

```json
{
  "epoch": 24785718,
  "snapshot": { "...trade data..." },
  "verification": {
    "cid": "bafkreib6h6au6hyv3hnx3wmbysu4lcoouah2yicst3nwnwndpcw2yxxrta",
    "epochId": 24785718,
    "projectId": "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH",
    "protocolState": "0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a",
    "dataMarket": "0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a"
  }
}
```

## Checking the receipt

Call `ProtocolState.maxSnapshotsCid(dataMarket, projectId, epochId)` on the Powerloom anchor chain. If the returned CID matches `verification.cid`, the API served the finalized content reference for that project and epoch.

This read goes to the Powerloom anchor chain (`https://rpc-v2.powerloom.network`), not to Ethereum mainnet.

## Checking via MCP: `verify_data_provenance`

The hosted MCP server (`bds-mcp-server`) and the local stdio MCP server (`bds-agent mcp`) both expose a `verify_data_provenance` tool. Pass the fields from the `verification` object:

```json
{
  "cid": "bafkrei...",
  "epoch_id": 24785718,
  "project_id": "allTradesSnapshot:0x26...",
  "data_market": "0x26..."
}
```

The tool executes the `eth_call` server-side and returns whether the CID matches. In `powerloom-bds-univ3`, the DeFi Analyst recipe calls this on a configurable cadence and includes the result in each report.

## Checking in `bds-agent run`: `verify: true`

For headless recipe execution, set `verify: true` in the YAML recipe. The runner calls `maxSnapshotsCid` against `POWERLOOM_PROTOCOL_STATE` using the RPC at `POWERLOOM_RPC_URL` (or profile default set by `bds-agent config init`). A CID mismatch triggers a console warning and routes an alert with `rule: verification` to your configured sinks.

```yaml
verify: true
```

No additional configuration is needed if you ran `bds-agent config init` — it writes the BDS mainnet defaults for `powerloom_rpc_url`, `powerloom_protocol_state`, and `powerloom_data_market`.

## Including provenance in alerts

Agent-emitted alerts should include the full `verification` block rather than summarizing it. Including the raw `cid`, `epochId`, and `projectId` lets downstream consumers run the same `maxSnapshotsCid` check themselves. Paraphrasing or omitting this data removes the verifiability property from the alert.

An executable provenance note looks like:

```
Whale alert: $250,000 WBTC/USDC swap
epoch: 24785718
cid: bafkreib6h6au6hyv3hnx3wmbysu4lcoouah2yicst3nwnwndpcw2yxxrta
project: allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH
verify: cast call 0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a \
  "maxSnapshotsCid(address,string,uint256)(string,uint8)" \
  0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a \
  "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH" \
  24785718 \
  --rpc-url https://rpc-v2.powerloom.network
```

## Related pages

- [`Verification Pattern`](/bds-data-market/verification-pattern) — the JSON contract and Python/TypeScript examples
- [`On-Chain Submission and Verification`](/dsv-mainnet/onchain-submission-and-verification) — the ProtocolState contract reference
- [`OpenClaw & Hosted MCP`](./openclaw-and-mcp.md)
- [`bds-agent` (headless CLI)](./bds-agent-headless.md)
