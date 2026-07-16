---
sidebar_position: 11
---

# FAQ

## Why is Powerloom shutting down?

After reviewing the project's path forward, we concluded that Powerloom no longer has a sustainable basis to continue operating, maintaining, and growing the network responsibly. This decision was not made lightly. For further context, see the [wind-down announcement blog post](https://blog.powerloom.io/wind-down).

## Is the shutdown immediate?

No. Powerloom followed an orderly wind-down with published dates for each milestone. Most milestones are now complete. The remaining action is to bridge any assets off the Powerloom chain before **July 21, 2026 at 6:00 AM UTC**. See the [Wind-Down Timeline](/wind-down/timeline) for the full schedule.

## Should I keep running my node?

No. Epoch release stopped on **June 16, 2026 at 12:00 noon UTC**. Running your node beyond that point only incurred infrastructure costs with no reward accrual. If your node is still running, stop it with:

```bash
powerloom-snapshotter-cli diagnose --clean --force
```

The dashboard for burning nodes and claiming tokens went offline on **July 16, 2026**. See [Node Management](/wind-down/node-onboarding) and [Snapshotter Rewards](/wind-down/snapshotter-rewards) for details.

## What happens to pending rewards?

Reward claims were available on [mint.powerloom.network](https://mint.powerloom.network) until **July 16, 2026 at 6:00 AM UTC**. The dashboard has been shut down permanently. Rewards not claimed before the deadline cannot be recovered. See [Reward Claims](/wind-down/reward-claims).

## What happens to staked POWER or node slots?

Unstaking and node burns were available via the dashboard until **July 16, 2026 at 6:00 AM UTC**. These actions are no longer possible. POWER and node slot funds not recovered before the deadline cannot be recovered. See [Staked POWER](/wind-down/staked-power) and [Node Management](/wind-down/node-onboarding).

## I missed the July 16 deadline. Can I still recover?

No. The dashboard was the only path for claims, unstaking, and node burns. These actions cannot be recovered through the dashboard or direct contract interaction.

If you already hold POWER on the Powerloom chain, you can still [bridge](https://bridge-v2.powerloom.network) it out before the chain shuts down on July 21, 2026.

## What happens to POWER?

The POWER token exists on Ethereum mainnet at [`0x429F0d8233e517f9acf6F0C8293BF35804063a83`](https://etherscan.io/token/0x429F0d8233e517f9acf6F0C8293BF35804063a83). It is an ERC-20 token and will continue to exist on Ethereum regardless of the wind-down. If you still hold POWER on the Powerloom chain, bridge it via [bridge-v2.powerloom.network](https://bridge-v2.powerloom.network) before the chain shuts down on July 21, 2026.

## Will the APIs and BDS remain available?

No. All APIs, BDS, resolver node, metering service, MCP endpoints, and agent infrastructure went offline on **June 16, 2026 at 12:00 noon UTC** (right after epoch release stopped). See [APIs, BDS & Hosted Services](/wind-down/apis-and-services) for the full list.

## Will dashboards and claim interfaces stay online?

No. [mint.powerloom.network](https://mint.powerloom.network) was available until **July 16, 2026 at 6:00 AM UTC** and has been shut down permanently. See [mint.powerloom.network](/wind-down/dashboards).

## Will contracts remain live?

Deployed smart contracts on Ethereum will remain accessible on-chain indefinitely. Contracts on the Powerloom chain will become inaccessible when the chain shuts down on **July 21, 2026 at 6:00 AM UTC**. Powerloom-operated frontends, indexers, and APIs have been wound down. See [Contracts, Bridges & On-chain Components](/wind-down/contracts-and-bridges).

## Will the docs and GitHub repositories stay online?

Documentation and repositories were archived during the wind-down. The docs site remains online for reference. See [Docs & GitHub Repositories](/wind-down/docs-and-repos) for details.

## How do I avoid scams?

Powerloom will never ask for your seed phrase or private key. There is no private claim link, emergency migration, surprise airdrop, or DM-based support process. Use only official Powerloom links listed in the [Wind-Down Timeline](/wind-down/timeline#security-warning).
