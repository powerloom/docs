---
sidebar_position: 0
---

# Powerloom Docs

Powerloom serves verified decentralized data to agents, applications, and operators.

The current production path starts with **BDS**, a live Uniswap V3 data market on Ethereum mainnet. Snapshotter nodes produce market snapshots, the decentralized sequencer-validator network finalizes canonical CIDs, and a full-node resolver exposes the data through metered HTTP routes, OpenClaw/MCP tooling, and a headless agent CLI.

::::info
**Start with the current mainnet path:**

1. **[Agents & BDS](/category/agents--bds)** — use verified BDS data from OpenClaw, hosted MCP, or `bds-agent-py`.
2. **[BDS Data Market](/category/bds-data-market)** — understand the live Uniswap V3 market, resolver API, endpoint catalog, and verification model.
3. **[DSV Mainnet](/category/dsv-mainnet)** — trace how the decentralized sequencer-validator network finalizes market data.
::::

## Verified Data for Agents

BDS is built for direct consumption by agents. The data is not just an API response from a hosted service. Supported responses include a `verification` object containing the finalized CID, epoch, project ID, protocol state contract, and data market contract.

Agents can verify provenance by checking:

```solidity
ProtocolState.maxSnapshotsCid(dataMarket, projectId, epochId)
```

That means alerts, reports, and automated workflows can carry a proof path back to DSV-finalized state instead of trusting the API operator.

## Frictionless Onboarding

There are two first-class ways to get started:

- **OpenClaw + ClawHub:** install the published [`powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3) skill, connect to the hosted MCP server, and run recipes such as Whale Radar or Autonomous DeFi Analyst.
- **Headless agent CLI:** use [`bds-agent-py`](https://github.com/powerloom/bds-agent-py) for programmatic signup, top-up, query generation, recipe execution, and verification without an MCP process.

Both paths use the same substrate: wallet-funded signup, Bearer API keys, metered `/mpp/...` routes, and BDS responses with verification metadata.

Start here: [Quickstart: first BDS agent](/agents-and-bds/quickstart).

## What BDS Serves Today

The current BDS mainnet market serves structured Uniswap V3 data from Ethereum mainnet through a snapshotter full-node resolver. The route surface includes:

- per-epoch and latest finalized snapshots,
- all-trades, base, and trades snapshots,
- token and pool metadata,
- token prices and trade volume views,
- time-series routes,
- daily-active summaries,
- and SSE streaming for finalized all-trades data.

For route details, see the [Endpoint Catalog](/bds-data-market/endpoint-catalog). For how the resolver fits into the protocol, see [Snapshotter Full Node as Resolver](/bds-data-market/snapshotter-full-node-as-resolver).

## The Network Behind It

BDS runs on DSV Mainnet, Powerloom's decentralized sequencer-validator network. DSV replaces the old centralized sequencer boundary with validator nodes that collect, validate, deduplicate, aggregate, upload consensus outputs to IPFS, and anchor canonical references on-chain.

The first production operating window gives concrete signals:

- **58 days** of BDS mainnet operation as of the latest published update,
- **217,295** assigned epochs in the first 30-day measurement window,
- **97.70%** completion across those epochs,
- **89 seconds** median end-to-end latency from priority assignment to on-chain finalization,
- **98.95%** aggregate completion across stable long-running validators,
- about **3,000 eligible nodes** receiving rewards daily,
- and sampled collector logs showing a healthy mesh with 5 submission-topic peers and 162 total connected peers.

Read the full measurement page: [Stability and Scale](/dsv-mainnet/stability-and-scale).

## Build and Operate

Powerloom exposes different entry points depending on what you are trying to do:

- **Consume verified data:** start with [Agents & BDS](/category/agents--bds).
- **Understand the live data market:** read [What Is BDS?](/bds-data-market/what-bds-is).
- **Verify provenance:** use [Verification in Agent Workflows](/agents-and-bds/verification-in-agents).
- **Run a BDS snapshotter slot:** follow [Snapshotter Lite V2 Setup](/build-with-powerloom/snapshotter-node/lite-node-v2/getting-started).
- **Operate resolver/full-node infrastructure:** review [Snapshotter Core Edge](/build-with-powerloom/snapshotter-node/full-node/getting-started).
- **Understand DSV finalization:** begin with [Why DSV Exists](/dsv-mainnet/why-dsv-exists).

## Repositories

- Powerloom GitHub: [github.com/powerloom](https://github.com/powerloom)
- Snapshotter full-node resolver: [`powerloom/snapshotter-core-edge`](https://github.com/powerloom/snapshotter-core-edge)
- Snapshotter lite node: [`powerloom/snapshotter-lite-v2`](https://github.com/powerloom/snapshotter-lite-v2)
- DSV validator network: [`powerloom/snapshot-sequencer-validator`](https://github.com/powerloom/snapshot-sequencer-validator)
- OpenClaw skill: [`powerloom/powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3)
- Headless agent CLI: [`powerloom/bds-agent-py`](https://github.com/powerloom/bds-agent-py)

## Community

Stay updated with the Powerloom team and community on [Discord](https://discord.com/invite/powerloom), [X](https://x.com/powerloom), and [GitHub](https://github.com/powerloom).
---
sidebar_position: 0
---
# Introduction 

Powerloom Protocol is a decentralized data protocol primarily designed to meet the growing data requirements of smart contract-based applications, including DeFi, games, and other user-centric platforms. It incentivizes participating peers to achieve consensus on state transitions and event emission observations across multiple smart contracts.

By utilizing data compositions on smaller, consensus-reached data units, Powerloom stands as a peer-validated and accurate information source, empowering rich data applications such as dashboards, bots, aggregators, and insights trackers.

![Powerloom Workflow](/images/protocol_workflow.png)

:::info
**Three-layer read path for the current mainnet:**

1. **[DSV Mainnet](/category/dsv-mainnet)** — the decentralized sequencer-validator network that finalizes all data, writes CIDs on-chain, and enforces economic accountability.
2. **[BDS Data Market](/category/bds-data-market)** — the first production market built on DSV; a metered HTTP API serving structured Uniswap V3 data with embedded verification metadata.
3. **[Agents & BDS](/category/agents--bds)** — how agents consume BDS data through metered access, API keys, the OpenClaw/ClawHub skill, or the headless `bds-agent-py` CLI.
:::

:::tip
**Powerloom in a nutshell:** Powerloom is analogous to a decentralized library catalog for blockchain data.

The "snapshotters" are like librarians who continually observe shelves of books (smart contracts), cataloging additions or removals of books, changes in existing books, and notes added by readers in book margins (events).
:::

If you are a developer looking to build a data dashboard, DEX aggregator, or any web3 application that requires data, Powerloom offers out-of-the-box features to assist you in focusing on building robust applications while simultaneously addressing the data aspect. 

Here are some key features of Powerloom:

**Decentralized Data:** Powerloom allows developers to build applications on top of decentralized, consensus-backed data, enhancing reliability and transparency.

**Real-Time Data:** The snapshotter network provides real-time data updates as transactions occur on the blockchain, enabling applications that require live data.

**Time-series Queries:** Datasets are available across precise time periods captured in epochs, which can be further filtered and composed to serve specific use cases. This is useful for analytics and tracking trends.

**Flexible Data Models:** Developers can contribute to data markets by building their own use cases and contributing to the "data markets" to track what's most valuable for their specific use case, beyond basic transactions.

**Modular and Extensible:** Powerloom has a modular architecture that makes it easy for developers to add support for new data sources, transform data, and build on top of existing data pipelines.

:::info
Stay updated with all the latest news from the Powerloom team and the community by joining our [Discord](https://discord.com/invite/powerloom).
:::

## Roles in the Powerloom Ecosystem
The Powerloom ecosystem consists of six different roles that work together to provide trusted and consensus-backed data to applications.

### Snapshotter
A Snapshotter is a node that captures crucial on-chain data transitions and event emissions. Snapshotter nodes are the backbone of the Powerloom ecosystem. They are responsible for capturing data from the blockchain and storing it in a decentralized manner. To become a snapshotter node, a node must stake a certain amount of Powerloom tokens. Snapshotter nodes are incentivized to capture data by receiving rewards in the form of Powerloom tokens for their work.

### Validator
Validators are responsible for validating blocks and securing the Prost Chain. To become a validator node, a node must stake a certain amount of Powerloom tokens. Validators are incentivized to validate blocks by receiving rewards in the form of Powerloom tokens for their work.

### Curator
Curators are responsible for building new use cases, keeping current data market implementations up to date, and ensuring that data markets are healthy. Curators are incentivized to work through various grants, bounties, and initiatives run by the Powerloom Foundation initially and later by market participants.

### Signaller
A Signaller is a node that signals the importance of different data markets, ensuring that snapshotter resources are allocated to the most important data markets. Signallers are incentivized to signal by receiving rewards in the form of Powerloom tokens for their work.

### Consumer
Consumers are the end-users of the data, using it to build applications like dashboards, bots, aggregators, and insights trackers. Consumers need to pay a fee in the form of Powerloom tokens to keep their data market active and to access the data.

### Watchmen
Watchmen are entities responsible for the accuracy of the data. They ensure that the data is accurate and that snapshotter nodes are not malicious. Watchmen can challenge the data, and if it's found to be inaccurate, the snapshotter node that provided the data will be penalized, and the watchman will be rewarded. However, since this is additional work for the network, it's important that watchmen only challenge the data when they are sure it's inaccurate. Watchmen need to stake a certain amount of Powerloom tokens to challenge the data, and if they are found to be wrong, their stake will be slashed. Watchmen are incentivized to challenge the data by receiving rewards in the form of Powerloom tokens for their work.

---
## See Powerloom in Action :rocket:

The current mainnet access path begins with the [BDS Data Market](/category/bds-data-market), where DSV-finalized Uniswap V3 data is served through metered HTTP routes with verification metadata.

[Powerloom BDS Dashboard](https://bds.powerloom.io/)

---

## Building with Powerloom

To begin using the Powerloom Protocol, start with the [DSV Mainnet](/category/dsv-mainnet) architecture, the [BDS Data Market](/category/bds-data-market), and the [Agents & BDS](/category/agents--bds) access guides.

### Consuming Verified BDS Data

BDS is the first step in opening up Powerloom data access through stable, metered APIs and agent-friendly tooling. The data is produced by snapshotter nodes, finalized by DSV, and served by a snapshotter full-node resolver.

## Walkthrough

We've been working on the Powerloom Protocol for quite some time now, and the protocol has evolved significantly. We have a detailed walkthrough of our network, how it functions, and how one can leverage the power of data using Powerloom. You can watch these technical community calls:

### Technical Community Call #1
<iframe width="560" height="315" src="https://www.youtube.com/embed/kTTmu3vhuEY?si=cD_mDEH0ohUy0n9x" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Technical Community Call #2
<iframe width="560" height="315" src="https://www.youtube.com/embed/irRFUWtnfpw?si=BFAEfpNa2B_ahc3g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Something Missing?
If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please [file an issue for us](https://github.com/powerloom/docs) or email us at support@powerloom.io.
