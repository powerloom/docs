---
sidebar_position: 3
---

# DSV Validator Nodes

:::caution Status: Pending

🔲 Epoch release stopped (June 16, 2026 at 12:00 noon UTC)

🔲 Pending validator rewards (days 91–104) distributed

:::

## To our DSV validators

You have been running validator nodes for 104 days, keeping the DSV network alive in production and helping prove that decentralized sequencing works. Thank you for believing in what we were building.

## What you should do

### 1. Turn off your validator

After epoch release is stopped on **June 16, 2026 at 12:00 noon UTC**, you can shut down your DSV validator node. No further submissions will be expected and there is no penalty for going offline.

```bash
./dsv.sh stop
```

### 2. Burn your node to recover your funds

Burn your validator node on the ValidatorState contract to recover the POWER you paid at mint (`nodePrice`).

- [**Contract**: `0x85573B2CF313315364FB4332f8eabc55321F201A`](https://explorer-v2.powerloom.network/address/0x85573B2CF313315364FB4332f8eabc55321F201A) (Powerloom L2, chain ID 7869)
- Call `burnNode(nodeId)` then `claimNodeTokens(nodeId)` to recover your funds.
- There is no cooldown. Burn and claim immediately.
- **Deadline**: The Powerloom chain shuts down on **July 21, 2026 at 6:00 AM UTC**. Burn before then or your funds will be unrecoverable.

### 3. Pending validator rewards (days 91–104)

Validator rewards for days 91 through 104 will be distributed to node owners within the next 48 hours of the announcement. These are separate from snapshotter slot rewards (which are claimed via [mint.powerloom.network](https://mint.powerloom.network)).

Validator rewards are attributed off-chain based on on-chain submission activity (VPA batch submissions, priority assignments) and distributed directly to the owner address registered for each node ID.

## Timeline

| Action | When |
|--------|------|
| Shut down validator | Any time now |
| Burn node & recover funds | Now through July 21, 2026 |
| Pending rewards (days 91–104) distributed | Within 48 hours of announcement |
| Powerloom chain shutdown | July 21, 2026 at 6:00 AM UTC |

## Context

For operational metrics and network performance during the DSV mainnet run, see [Stability & Scale](/dsv-mainnet/stability-and-scale).
