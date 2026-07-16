---
sidebar_position: 3
---

# DSV Validator Nodes

:::caution Status: Complete

🛑 Epoch release stopped (June 16, 2026 at 12:00 noon UTC)

✅ Pending validator rewards (days 91–104) distributed

🔒 Node burn closed (dashboard offline July 16, 2026)

:::

## To our DSV validators

You have been running validator nodes for 104 days, keeping the DSV network alive in production and helping prove that decentralized sequencing works. Thank you for believing in what we were building.

## What you should do

### 1. Turn off your validator

Epoch release stopped on **June 16, 2026 at 12:00 noon UTC**. If your validator is still running, shut it down. No further submissions are expected and there is no penalty for going offline.

```bash
./dsv.sh stop
```

### 2. Recover your funds

Validator node burns and fund recovery were handled through the same dashboard path as snapshotter nodes. [mint.powerloom.network](https://mint.powerloom.network) went offline on **July 16, 2026 at 6:00 AM UTC**. Funds not recovered before the deadline cannot be recovered.

### 3. Pending validator rewards (days 91–104)

Validator rewards for days 91 through 104 were distributed to node owners within 48 hours of the announcement. These were separate from snapshotter slot rewards (which were claimed via the dashboard before it shut down).

Validator rewards were attributed off-chain based on on-chain submission activity (VPA batch submissions, priority assignments) and distributed directly to the owner address registered for each node ID.

## Timeline

| Action | Status |
|--------|--------|
| Shut down validator | Complete — validators should be offline |
| Burn node & recover funds | Closed — deadline was July 16, 2026 |
| Pending rewards (days 91–104) distributed | Complete |
| Powerloom chain shutdown | July 21, 2026 at 6:00 AM UTC |

If you still hold POWER on the Powerloom chain, [bridge](https://bridge-v2.powerloom.network) it before the chain shuts down. See [Contracts, Bridges & On-chain Components](/wind-down/contracts-and-bridges).

## Context

For operational metrics and network performance during the DSV mainnet run, see [Stability & Scale](/dsv-mainnet/stability-and-scale).
