---
sidebar_position: 3
---

# Snapshotter Rewards

:::caution Status: Complete

🛑 Epoch release stopped

🛑 Rewards accrual stopped

:::

## Current Status

Epoch release was stopped on **Tuesday, June 16, 2026 at 12:00 noon UTC**. This occurred after Day 104 ended and a few epochs into Day 105.

No new epochs have been released since this point and reward accrual stopped immediately.

## What this means

- Rewards accrued normally for all eligible snapshotters until epoch release was stopped on June 16, 2026 at 12:00 noon UTC.
- No further epochs have been released and no further rewards have been generated.
- Pending unclaimed rewards had to be claimed before the dashboard went offline on July 16, 2026. See [Reward Claims](/wind-down/reward-claims).

## What you should do

- **Stop your snapshotter node** if it is still running. There is no reward accrual since June 16, 2026.
  ```bash
  powerloom-snapshotter-cli diagnose --clean --force
  ```
- Reward claims and node burns via the dashboard are **closed** as of July 16, 2026. See [Reward Claims](/wind-down/reward-claims) and [Node Management](/wind-down/node-onboarding).
- If you hold POWER on the Powerloom chain, [bridge](https://bridge-v2.powerloom.network) it before the chain shuts down on July 21, 2026.
