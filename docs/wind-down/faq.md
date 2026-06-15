---
sidebar_position: 11
---

# FAQ

## Why is Powerloom shutting down?

After reviewing the project's path forward, we concluded that Powerloom no longer has a sustainable basis to continue operating, maintaining, and growing the network responsibly. This decision was not made lightly. For further context, see the [wind-down announcement blog post](https://blog.powerloom.io/wind-down).

## Is the shutdown immediate?

No. Powerloom is following an orderly wind-down with published dates for each milestone. See the [Wind-Down Timeline](/wind-down/timeline) for the full schedule.

## Should I keep running my node?

Epoch release stops on **June 16, 2026 at 12:00 noon UTC**. After that, no rewards will accrue and running your node will only cost you infrastructure fees. Stop your node with:

```bash
powerloom-snapshotter-cli diagnose --clean --force
```

Then burn your node and claim your tokens back via [mint.powerloom.network](https://mint.powerloom.network). See [Node Management](/wind-down/node-onboarding) and [Snapshotter Rewards](/wind-down/snapshotter-rewards) for details.

## What happens to pending rewards?

Claims are always available on [mint.powerloom.network](https://mint.powerloom.network) for as long as the dashboard is up, which is until **July 16, 2026 at 6:00 AM UTC**. Claim before then. See [Reward Claims](/wind-down/reward-claims).

## What happens to staked POWER or node slots?

Unstake your POWER at [mint.powerloom.network/staking](https://mint.powerloom.network/staking). There is no cooldown, and the withdrawal of your unstaked POWER is immediate. Staking rewards are claimable from the same page. Then bridge your POWER out of the chain via [bridge-v2.powerloom.network](https://bridge-v2.powerloom.network) before the chain shuts down. See [Staked POWER](/wind-down/staked-power).

## What happens to POWER?

The POWER token exists on Ethereum mainnet at [`0x429F0d8233e517f9acf6F0C8293BF35804063a83`](https://etherscan.io/token/0x429F0d8233e517f9acf6F0C8293BF35804063a83). It is an ERC-20 token and will continue to exist on Ethereum regardless of the wind-down. Make sure to bridge any POWER out of the Powerloom chain via [bridge-v2.powerloom.network](https://bridge-v2.powerloom.network) before the chain shuts down on July 21, 2026.

## Will the APIs and BDS remain available?

No. All APIs, BDS, resolver node, metering service, MCP endpoints, and agent infrastructure go offline on **June 16, 2026 at 12:00 noon UTC** (right after epoch release stops). See [APIs, BDS & Hosted Services](/wind-down/apis-and-services) for the full list.

## Will dashboards and claim interfaces stay online?

[mint.powerloom.network](https://mint.powerloom.network) remains available until **July 16, 2026 at 6:00 AM UTC**. Use it to claim rewards, unstake, and burn nodes before then. See [mint.powerloom.network](/wind-down/dashboards).

## Will contracts remain live?

Deployed smart contracts on Ethereum and the Powerloom chain are immutable and will remain accessible on-chain indefinitely. However, Powerloom-operated frontends, indexers, and APIs will be wound down. See [Contracts, Bridges & On-chain Components](/wind-down/contracts-and-bridges).

## Will the docs and GitHub repositories stay online?

Documentation and repositories will be maintained during the wind-down and then archived. See [Docs & GitHub Repositories](/wind-down/docs-and-repos) for details.

## How do I avoid scams?

Powerloom will never ask for your seed phrase or private key. There is no private claim link, emergency migration, surprise airdrop, or DM-based support process. Use only official Powerloom links listed in the [Wind-Down Timeline](/wind-down/timeline#security-warning).
