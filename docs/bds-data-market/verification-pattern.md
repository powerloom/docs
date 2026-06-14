---
sidebar_position: 4
title: Verification Pattern
---

# Verification Pattern

BDS responses can include enough metadata for the consumer to verify that the API payload matches the snapshot CID finalized by the Powerloom protocol.

This is the core trust property of the market. The API is convenient, but it is not meant to be the root of trust.

## Verification object

For supported routes such as the all-trades snapshot and SSE stream, BDS returns a `verification` object alongside the data:

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

## What the check proves

The consumer can call:

`ProtocolState.maxSnapshotsCid(dataMarket, projectId, epochId)`

If the returned CID matches `verification.cid`, the API served the same finalized content reference recorded by the protocol for that project and epoch.

This proves:

- the response maps back to finalized protocol state,
- the CID the API returned is not arbitrary,
- and the operator is not asking the consumer to trust a private database as the source of truth.

## Contract pair for the live BDS market

| Contract | Address |
|----------|---------|
| `ProtocolState` | `0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a` |
| `DataMarket` | `0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a` |

RPC reads for verification should go to the Powerloom anchor chain where `ProtocolState` is deployed, not to Ethereum mainnet.

## Python example

```python
from web3 import Web3

PROTOCOL_STATE_ABI = [
    {
        "name": "maxSnapshotsCid",
        "type": "function",
        "inputs": [
            {"name": "dataMarket", "type": "address"},
            {"name": "projectId", "type": "string"},
            {"name": "epochId", "type": "uint256"},
        ],
        "outputs": [
            {"name": "", "type": "string"},
            {"name": "", "type": "uint8"},
        ],
        "stateMutability": "view",
    }
]

w3 = Web3(Web3.HTTPProvider("https://rpc-v2.powerloom.network"))
contract = w3.eth.contract(
    address=Web3.to_checksum_address("0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a"),
    abi=PROTOCOL_STATE_ABI,
)

verification = {
    "cid": "bafkrei...",
    "epochId": 24785718,
    "projectId": "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH",
    "dataMarket": "0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a",
}

on_chain_cid, status = contract.functions.maxSnapshotsCid(
    verification["dataMarket"],
    verification["projectId"],
    verification["epochId"],
).call()

assert on_chain_cid == verification["cid"]
print("verified", status)
```

## TypeScript example

```ts
import { ethers } from "ethers";

const abi = [
  "function maxSnapshotsCid(address dataMarket, string projectId, uint256 epochId) view returns (string, uint8)",
];

const provider = new ethers.JsonRpcProvider("https://rpc-v2.powerloom.network");
const contract = new ethers.Contract(
  "0x1d0e010Ff11b781CA1dE34BD25a0037203e25E2a",
  abi,
  provider,
);

const verification = {
  cid: "bafkrei...",
  epochId: 24785718,
  projectId:
    "allTradesSnapshot:0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a:mainnet-BDS_MAINNET_UNISWAPV3-ETH",
  dataMarket: "0x26c44e5CcEB7Fe69Cffc933838CF40286b2dc01a",
};

const [onChainCid, status] = await contract.maxSnapshotsCid(
  verification.dataMarket,
  verification.projectId,
  verification.epochId,
);

if (onChainCid !== verification.cid) {
  throw new Error("verification mismatch");
}

console.log("verified", status);
```

## Operational note

`lastFinalizedSnapshot` is not the right read for payload verification. It gives you the latest finalized epoch for a project, not the finalized CID for a specific epoch. For provenance checks, the canonical read is `maxSnapshotsCid(...)`.

## Related pages

- [`On-Chain Submission and Verification`](/dsv-mainnet/onchain-submission-and-verification)
- [`What BDS Is`](./what-bds-is.md)
- [`Snapshotter Full Node as Resolver`](./snapshotter-full-node-as-resolver.md)
