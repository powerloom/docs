---
sidebar_position: 2
---

# Node Management

:::info

❗️ New node minting disabled

❗️ New staking disabled

✅ Node burn (no cooldown) available

:::

## Current Status

No new nodes can be minted. No new staking positions can be opened. These operations are permanently disabled as part of the wind-down.

## Wind-down checklist for node operators and stakers

Work through these in order. Step 1 runs on your own node host; steps 2 to 5 are on-chain actions you perform from the dashboard and bridge.

1. **Stop your snapshotter node**. After epoch release stops on **June 16, 2026 at 12:00 noon UTC**, there is no reason to keep running. From your snapshotter host:

   ```bash
   powerloom-snapshotter-cli diagnose --clean --force
   ```

2. **Claim your pending snapshotter rewards** at [mint.powerloom.network](https://mint.powerloom.network). See [Reward Claims](/wind-down/reward-claims).

3. **Burn your snapshotter node and claim your tokens back** at [mint.powerloom.network](https://mint.powerloom.network). No cooldown, the burn and claim are immediate.

4. **Unstake and withdraw your staked POWER** at [mint.powerloom.network/staking](https://mint.powerloom.network/staking). No cooldown, the withdrawal is immediate. Claim any staking rewards from the same page. See [Staked POWER](/wind-down/staked-power).

5. **Bridge your POWER out of the Powerloom chain** via [bridge-v2.powerloom.network](https://bridge-v2.powerloom.network).

:::tip Deadlines

- Complete steps 2 to 4 before [mint.powerloom.network](https://mint.powerloom.network) goes offline on **July 16, 2026 at 6:00 AM UTC**.
- Complete the bridge (step 5) before the Powerloom chain shuts down on **July 21, 2026 at 6:00 AM UTC**.

:::

## Minting, staking & burning

- New node minting is **disabled**. No new node slots can be created.
- New staking is **disabled**. No additional POWER can be staked.
- The cooldown period for node burns has been removed. You can burn your node and claim your tokens back immediately (step 3 above).
