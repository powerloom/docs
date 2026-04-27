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

Discover the practical application of Powerloom through our various dashboard implementations. This latest release of Pooler is a powerhouse for Uniswap V2, Uniswap V3, and Aave V3 analytics, offering comprehensive data aggregations and flexibility to extend to more use cases. 

[UniswapV2 Dashboard](https://uniswapv2.powerloom.io)
[UniswapV3 Dashboard](https://uniswapv3.powerloom.io)
[AaveV3 Dashboard](https://aave-v3.powerloom.io/)

---

## Building with Powerloom

To begin using the Powerloom Protocol, you need to understand the workflow and architecture of the system. This involves familiarizing yourself with the different components and how they interact within the protocol.
The best way to start is by exploring the [existing-implementations](/category/existing-implementations), understanding how they work, and how you can leverage them to [build your own use cases](/category/building-a-new-use-case).

### Utilizing Existing Implementations to Build Your Data Application

The data generated by the Powerloom Protocol is decentralized and accessible to everyone, and it is not always easy to understand how to use it. 
To make it easier for developers, each snapshotter node comes with a set of APIs that can be used to access the data. These are easy to use and can be employed to build data applications such as dashboards, bots, aggregators, and insights trackers.

## Walkthrough

We've been working on the Powerloom Protocol for quite some time now, and the protocol has evolved significantly. We have a detailed walkthrough of our network, how it functions, and how one can leverage the power of data using Powerloom. You can watch these technical community calls:

### Technical Community Call #1
<iframe width="560" height="315" src="https://www.youtube.com/embed/kTTmu3vhuEY?si=cD_mDEH0ohUy0n9x" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Technical Community Call #2
<iframe width="560" height="315" src="https://www.youtube.com/embed/irRFUWtnfpw?si=BFAEfpNa2B_ahc3g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Something Missing?
If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please [file an issue for us](https://github.com/powerloom/docs) or email us at support@powerloom.io.
