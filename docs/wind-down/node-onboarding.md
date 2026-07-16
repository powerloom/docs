---
sidebar_position: 2
---

# Node Management

:::info

❗️ New node minting disabled

❗️ New staking disabled

🔒 Node burn closed (dashboard offline July 16, 2026)

:::

## Current Status

No new nodes can be minted. No new staking positions can be opened. These operations are permanently disabled as part of the wind-down.

[mint.powerloom.network](https://mint.powerloom.network) went offline on **July 16, 2026 at 6:00 AM UTC**. Node burns, reward claims, and unstaking are no longer possible through the dashboard. The Powerloom chain was shut down on **July 21, 2026 at 6:00 AM UTC**.

## Wind-down checklist for node operators and stakers

All steps are now closed.

1. **Stop your snapshotter node** (if still running). Epoch release stopped on **June 16, 2026 at 12:00 noon UTC**; there is no reason to keep running. From your snapshotter host:

   ```bash
   powerloom-snapshotter-cli diagnose --clean --force
   ```

2. **Claim pending snapshotter rewards** — **Closed.** The dashboard went offline July 16, 2026. See [Reward Claims](/wind-down/reward-claims).

3. **Burn your snapshotter node and claim your tokens back** — **Closed.** See [Reward Claims](/wind-down/reward-claims).

4. **Unstake and withdraw your staked POWER** — **Closed.** See [Staked POWER](/wind-down/staked-power).

5. **Bridge your POWER out of the Powerloom chain** — **Closed.** The chain and bridge shut down July 21, 2026. See [Contracts, Bridges & On-chain Components](/wind-down/contracts-and-bridges).

:::warning Missed a deadline?

The dashboard was the only path for claims, unstaking, and node burns (deadline: July 16, 2026). The bridge was the only path for moving assets off the Powerloom chain (deadline: July 21, 2026). Assets not recovered before these dates cannot be recovered.

:::

## Minting, staking & burning

- New node minting is **disabled**. No new node slots can be created.
- New staking is **disabled**. No additional POWER can be staked.
- Node burns are **closed**. The dashboard went offline on July 16, 2026.
