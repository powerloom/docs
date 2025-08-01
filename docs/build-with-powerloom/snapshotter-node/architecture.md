---
sidebar_position: 1
---

# Architecture
The Snapshotter Peer is designed with a modular and highly configurable architecture, allowing for easy customization and seamless integration with a diverse set of data markets.

![Submodule architecture of the Snapshotter](/images/submodule_architecture.png)

## Snapshotter Core

This foundational component defines all the essential interfaces and handles a wide range of tasks, from listening to epoch release events to distributing tasks and managing snapshot submissions. Read more about it in the detailed section on its [components](/Protocol/Specifications/Snapshotter/components).

## Data Market Specifics

Use case-specific logic for generating snapshots and other configurations are available as [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules), which can be pulled in as desired. Currently, you can find diverse use cases that serve customized datapoints and track activity across multiple data source chains like Ethereum Mainnet, Polygon zkEVM, Polygon PoS, etc.

* DEXs like Uniswap v2, Quickswap
* Bridges like bungee.exchange, Owlto finance
* Lending markets like Aave and Compound 

The architecture has been designed to facilitate the seamless interchange of configuration and modules. Adapting the system to different use cases is as straightforward as changing a Git branch.

You can observe the corresponding branches within [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/) and [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/) repos:

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

Configuration files, located in the `/config` directory and linked to [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/) repo, play a pivotal role in defining project types, specifying paths for individual compute modules, and managing various project-related settings.

### Compute Modules

The heart of the system resides in the `snapshotter/modules` directory, linked to [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/), where the actual computation logic for each project type is defined. These modules drive the snapshot generation process for specific project types.

## Building Your Own Use Case
Working on a new use case is as simple as writing a new compute module and adding a new configuration file. Instructions to get started in `build-dev.sh` mode are available in the [Deploy repo](https://github.com/powerloom/deploy/tree/devnet).

# Useful Links

* [Snapshot Generation Specifications](/Protocol/Specifications/Snapshotter/snapshot-build)
* [Data Markets and Sources](/Protocol/data-sources)
* [Composition of Snapshots and Higher-Order Datapoints](/Protocol/data-composition)
