---
sidebar_position: 4
title: On-Chain Submission and Verification
---

# On-Chain Submission and Verification

The point of DSV is not just to move data through a decentralized network. The point is to finish with a state transition that any consumer can verify independently.

For BDS mainnet, that verification path is already concrete.

## Contracts used by the live BDS mainnet market

| Contract | Address | Role |
|----------|---------|------|
| `ProtocolState` | [`0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a`](https://explorer-v2.powerloom.network/address/0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a?tab=read_write_proxy) | Canonical protocol entrypoint for validator submissions and CID reads |
| `DataMarket` | [`0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a`](https://explorer-v2.powerloom.network/address/0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a?tab=read_write_proxy) | Market-scoped storage for finalized snapshot CIDs and epoch state |

The public Powerloom RPC for this anchor chain is [`https://rpc-v2.powerloom.network`](https://rpc-v2.powerloom.network).

## Which function submits consensus on-chain

The validator-side submission entrypoint is:

```solidity
function submitSubmissionBatch(
    PowerloomDataMarket dataMarket,
    string memory batchCid,
    uint256 epochId,
    string[] memory projectIds,
    string[] memory snapshotCids,
    bytes32 finalizedCidsRootHash
) external
```

This function lives on `ProtocolState`. It does two important things:

1. verifies that the submitting validator is currently allowed to submit for that `dataMarket` and `epochId` through VPA, and
2. forwards the batch into the underlying `DataMarket`, which persists the finalized project-level CID state.

In other words, `ProtocolState` is the public control surface, while `DataMarket` is where the market-specific finalized outputs are stored.

## Which fields matter

The submission bundle contains three pieces of information consumers should care about:

| Field | Meaning |
|-------|---------|
| `batchCid` | IPFS CID of the uploaded batch payload |
| `projectIds[]` | Ordered list of projects included in the batch |
| `snapshotCids[]` | Finalized CID for each corresponding project in the same order |
| `finalizedCidsRootHash` | Merkle root over the finalized CIDs used for integrity and attestation checks |

Once the call succeeds, the consumer-facing state becomes the per-project finalized CID stored for that epoch.

## The verification read path

The verification function a consumer cares about is:

```solidity
function maxSnapshotsCid(
    PowerloomDataMarket dataMarket,
    string memory projectId,
    uint256 epochId
) public view returns (string memory, SnapshotStatus)
```

Call it on `ProtocolState`, passing the target `DataMarket` as the first argument.

For a finalized response, the function returns:

- the canonical IPFS CID for that `(dataMarket, projectId, epochId)`, and
- the snapshot status enum for that record.

## What a BDS client verifies

BDS resolver/full node/API responses include a `verification` object with exactly the fields needed to reproduce this check:

```json
{
  "cid": "bafkrei...",
  "epochId": 24785718,
  "projectId": "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH",
  "protocolState": "0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a",
  "dataMarket": "0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a"
}
```

An independent verifier only has to:

1. call `ProtocolState.maxSnapshotsCid(dataMarket, projectId, epochId)`,
2. compare the returned CID to `verification.cid`, and
3. optionally fetch the IPFS content behind that CID if they want to validate the payload itself.

## Example with `cast`

Any JSON-RPC client can do this with `eth_call`. Using `cast` is the most readable example:

```bash
cast call \
  0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a \
  "maxSnapshotsCid(address,string,uint256)(string,uint8)" \
  0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a \
  "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH" \
  24785718 \
  --rpc-url https://rpc-v2.powerloom.network
```

If the returned CID matches the BDS response's `verification.cid`, the consumer has proven that the API served the same content reference the protocol finalized on-chain.

## What not to use

Do not use `lastFinalizedSnapshot` to verify content. That field gives you the latest finalized **epoch number** for a project, not the finalized **CID** for a specific epoch.

For content provenance, the canonical check is always `maxSnapshotsCid(dataMarket, projectId, epochId)`.

## Verification model in plain English

Powerloom does not ask the consumer to trust a dashboard, a hosted API, or a Foundation-run indexer.

The trust model is:

- the network reaches consensus on a project CID,
- the validator with current priority anchors that result on-chain,
- the consumer replays a read against `ProtocolState`,
- the CID either matches or it does not.

That is the core property that turns DSV output into verifiable data rather than API-delivered opinion.

## Related pages

- [`Protocol Workflow`](./protocol-workflow.md)
- [`Stability and Scale`](./stability-and-scale.md)
