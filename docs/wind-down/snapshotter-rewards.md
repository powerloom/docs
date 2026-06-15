---
sidebar_position: 3
---

# Snapshotter Rewards

:::caution Status: Pending

🔲 Epoch release stopped

🔲 Rewards accrual stopped

:::

## Current Status

Epoch release will be stopped on **Tuesday, June 16, 2026 at 12:00 noon UTC**. This occurs after Day 104 ends and a few epochs into Day 105.

From this point forward, no new epochs will be released and reward accrual stops immediately.

## What this means

- Rewards will accrue normally for all eligible snapshotters until epoch release is stopped on June 16, 2026 at 12:00 noon UTC.
- After this point, no further epochs will be released and no further rewards will be generated.
- Pending unclaimed rewards remain claimable. See [Reward Claims](/wind-down/reward-claims) for instructions.

## What you should do

- Continue running your node if you want to earn rewards until June 16, 2026 at 12:00 noon UTC.
- After that time, shut down your snapshotter node. Running it beyond this point will incur infrastructure costs with no reward accrual.
  ```bash
  powerloom-snapshotter-cli diagnose --clean --force
  ```
- Burn your node and claim your tokens back via [Node Management](/wind-down/node-onboarding).
- Make sure to claim your rewards before the claim deadline. See [Reward Claims](/wind-down/reward-claims).
