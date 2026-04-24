---
sidebar_position: 0
---

# Overview

:::info
This page documents the Protocol v2 upgrade path and its historical architecture framing. For the live decentralized sequencer-validator network, see [`DSV Mainnet`](/category/dsv-mainnet), especially [`Why DSV Exists`](/dsv-mainnet/why-dsv-exists) and [`Protocol Workflow`](/dsv-mainnet/protocol-workflow).
:::


## Necessity of an upgrade

After running multiple iterations of our incentivized testnets, inclding the latest version that engaged 5000+ Snapshotter Lite nodes, we gathered valuable metrics and data on the performance of the initial approach of our protocol.

### Protocol State Bloat

The snapshot submissions were so far resolved on a Solidity smart contract deployed on the Prost chain that acts as the consensus and reward mechanism for peers participating in the protocol. 

This causes a state bloat of submissions for base snapshots for thousands of project IDs across 5000+ nodes, for every epoch. For a real time data market that updates every second, that is 86400 epochs in a day. Once the consensus on these snapshots have been validated, the data included in them becomes part of the higher order, composed datapoints and can be safely discarded from the chain state.

:::info
Learn more:

* [Protocol State: V2](/Protocol/Specifications/state-v2.md)
* [Snapshot Generation](/Protocol/Specifications/Snapshotter/snapshot-build.md)
* [Introduction to Snapshotting consensus](/build-with-powerloom/snapshotter-node/introduction)
* [Accessing datasets on which consensus has been reached](/build-with-powerloom/snapshotter-node/data)
:::

### Relayer transaction and chain infrastructure failures

The above approach required the snapshotter peers to send out their submissions to the contract as an EIP-712 signed message object. This mechanism allowed us to trustlessly operate an infrastructure of relayers that would receive these submissions as HTTP POST requests and ultimately commit to the chain as EVM transactions. But at a scale of operation that exceeded 1 million snapshot submission transactions per day, this would often result in a significant percentage (>5%) of transactions being dropped along with other operational issues with maintaining the chain at a continuously running state.

### Composed snapshots finality

A combination of the above couple of issues also affects the [composability principle](/Protocol/data-composition.md) of building higher order snapshots. Dropped transactions and increased delays in confirmation times of snapshot submissions ultimately affect the aggregate data points that power complex use cases like the [Uniswap V2 dashboard](/build-with-powerloom/use-cases/existing-implementations/uniswap-dashboard/) and [Aave V3 dashboard](/build-with-powerloom/use-cases/existing-implementations/aavev3-dashboard/).


## Upgraded workflow

The next iteration of the Powerloom Testnet and the upcoming Mainnet Alpha feature new components that are:

* more accessible geographically
* scalable
* contribute to faster finality of composed snapshots

![new architecture workflow](/images/new_architecture_workflow.png)

It notably features the following components that make this possible.

### Local collector: Snapshotter node

The snapshotter node replaces the [payload commit service](/Protocol/Specifications/Snapshotter/payload-commit-service.md) component with a faster grpc based service referred to as local collector. As the name suggests, it acts as a collection point for a stream of large number of [snapshots being built out](/Protocol/Specifications/Snapshotter/snapshot-build.md) by the compute modules as specified in its configuration.

It is responsible for reliably submitting all the generated snapshots to the sequencers via circuit relay nodes.

### Sequencer

The sequencer is a vital component in the upgraded workflow of the protocol. It batches submissions from multiple snapshotters within the active time window of an epoch, uploads them to IPFS and anchors the proof for the same on the protocol state contract. 

* [Read more: Offchain sequencer](./sequencer.md)

### libp2p circuit relay nodes

The snapshot collector is ultimately able to submit snapshots to the sequencer component referenced above thanks to nodes that implement the [libp2p circuit relay protocol](https://docs.libp2p.io/concepts/nat/circuit-relay/).

* [Read more: Circuit relay nodes](./relay.md)

### Validator

The upgraded protocol now supports validation on snapshot batches as submitted by the sequencer. The validators submit attestations for the fact that finalized snapshots across projects as reported by the sequencer are correct.

* [Read more: Validator](./validator.md)