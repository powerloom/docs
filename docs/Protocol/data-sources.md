---
sidebar_position: 3
title: Data Markets and Sources
---

# Data Markets

Snapshotters generate snapshots, both base and higher order, as per the data sources _defined by the data markets they participate in_. Each data market maintains its [specific protocol state](/Protocol/Specifications/state-v2.md) concerning the submission, calculation, and finalization of such snapshots.

The data sources defined by a market can be static or dynamic, depending on the use case at hand.

## Static Data Sources

Static data sources are useful when a market tracks a known set of contracts. In the current BDS market, snapshotter nodes track active Uniswap V3 pools on Ethereum mainnet and submit market-specific snapshots for DSV finalization.

You can explore an older static configuration example in the [`snapshotter-configs`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/projects.example.json#L1-L11) repository.

```json reference
https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/projects.example.json#L1-L11
```

The `projects` field in the above configuration snippet represents contract addresses that are tracked, and snapshots are generated for those contracts. To further understand how snapshots on these contracts are tracked, refer to the section on [Project Types and IDs](#project-types-and-ids).

## Dynamic Data Sources

In situations where data sources are constantly changing or numerous, making it impractical to maintain an extensive list, the data sources need not be explicitly defined in the configuration.

Instead, the snapshotter implementation operates in ['bulk mode'](/Protocol/Specifications/Snapshotter/snapshot-build#data-source-specification-bulk-mode). The data source configuration specifies computation modules that utilize general-purpose [preloaded](/Protocol/Specifications/Snapshotter/preloading) datasets to filter transactions, event logs, etc., on contract addresses of interest. This is where the signaling of data sources comes into play.

```json reference
https://github.com/powerloom/snapshotter-configs/blob/39e4713cdd96fff99d100f1dea7fb7332df9e491/projects.example.json#L1-L28
```

### Data Source Signaling

Data sources can be dynamically added to the contract based on the role of certain peers in the ecosystem known as 'signalers.' This is a pivotal aspect of the Powerloom Protocol ecosystem, separate from snapshotting, and is on track to be decentralized. The decentralization will take into account on-chain activity, market forces, and accommodate a demand-driven, dynamic data ecosystem.

In the current implementation of a use case that tracks wallet activity for Quests on Polygon zkEVM, such wallets are added from a data feed supplied by Merkle. The feed consists of wallets that sign up on their platform. Only these wallet addresses are of interest to the Quest platform on Merkle for tracking activities across DEXs and asset bridges.

Read more about it in the [snapshotter specs of the bulk node](/Protocol/Specifications/Snapshotter/snapshot-build#data-source-specification-bulk-mode).

![Merkle Data Source Signaling](/images/data_source_signaling_example.png)

## Project Types and IDs

All data sources are tracked with a project ID on the protocol. Think of it as a stream of datasets, finalized by consensus against [each epoch released](/Protocol/Specifications/Epoch#1-epoch_released) on the protocol.

Find more details in the [specifications of snapshot generation](/Protocol/Specifications/Snapshotter/snapshot-build).

## Useful Links and Concepts

* [Modular Architecture of Use Case-Specific Snapshotter Implementations](/build-with-powerloom/snapshotter-node/architecture)
