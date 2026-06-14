---
sidebar_position: 1
---

# Architecture
The Snapshotter Peer is designed with a modular and highly configurable architecture, allowing for easy customization and seamless integration with a diverse set of data markets.

![Modular architecture of the Snapshotter](/images/submodule_architecture.png)

## Snapshotter Core

This foundational component defines all the essential interfaces and handles a wide range of tasks, from listening to epoch release events to distributing tasks and managing snapshot submissions. Read more about it in the detailed section on its [components](/Protocol/Specifications/Snapshotter/components).

## Data Market Specifics

Market-specific logic for generating snapshots and related configuration is pulled in by the node's build and run scripts at runtime. Lite and full-node deployments use this mechanism to bind the node to the compute and config modules required by a given data market.

* DEXs like Uniswap v2, Quickswap
* Bridges like bungee.exchange, Owlto finance
* Lending markets like Aave and Compound 

The architecture has been designed to facilitate the seamless interchange of configuration and modules. Adapting the system to different markets is handled by selecting the compute and config repositories, branches, and commits that the setup scripts pull during deployment.

You can observe market-specific modules in the [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/) and [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/) repos:

#### Snapshotter Computes
* `eth_uniswapv2`: Pooler implementation for the Uniswap v2 dashboard
* `eth_uniswapv2_lite`: Pooler implementation for the Uniswap v2 dashboard but without the calculation of complex aggregate data points from scratch.
* `eth_uniswapv3`: Pooler implementation for the Uniswap v3 dashboard
* `aave`: Pooler implementation for the Aave v3 dashboard
* `aave-lite`: Pooler implementation for the Aave v3 dashboard but without the calculation of complex aggregate data points from scratch.
* `zkevm_quests`: Implementation for Quests on Polygon zkEVM

#### Snapshotter Configs
* `eth_uniswapv2_5_pairs`: Pooler lite mode config with only 5 chosen Uniswap v2 pair contracts
* `eth_uniswapv2`: Pooler config with only 180 Uniswap v2 pair contracts
* `eth_uniswapv3`: Pooler config with 46 Uniswap v3 pool contracts
* `aave`: Pooler config with all Aave v3 asset contracts
* `aave-lite`: Pooler config to be used with the aave-lite compute branch
* `zkevm_quests`: Config for Quests on Polygon zkEVM

### Configuration Files

Configuration files are pulled from [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/) into the node's `/config` directory during setup. They define project types, specify paths for individual compute modules, and manage data-market settings.

### Compute Modules

The computation logic is pulled from [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/) into the node runtime during setup. These modules drive snapshot generation for specific project types and markets.

## Building Your Own Data Market
Working on a new data market starts with writing a compute module and adding the corresponding configuration.

# Useful Links

* [Snapshot Generation Specifications](/Protocol/Specifications/Snapshotter/snapshot-build)
* [Data Markets and Sources](/Protocol/data-sources)
* [Composition of Snapshots and Higher-Order Datapoints](/Protocol/data-composition)
