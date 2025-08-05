---
sidebar_position: 2
---

# Epoch

An epoch denotes a range of block heights on the data source blockchain where smart contract applications run and whose data we are interested in.

All peers synchronize and achieve consensus around incremental epochs according to their specific responsibilities. For example, snapshotter peers reach consensus around snapshots—base and aggregate—per epoch. This information gets finalized into the protocol state as snapshot datasets available as content identifiers on decentralized storage mediums like IPFS and Filecoin.

![Epoch](/images/Epoch.png)

The size of an epoch is configurable, referred to as `size(E)`.

## Epoch Generator

The epoch generator is a trusted service that keeps track of the head of the chain as it moves ahead and a marker `h₀` against the max block height from the last released epoch.

This makes the beginning of the next epoch, `h₁ = h₀ + 1`.

Once the head of the chain has moved sufficiently ahead so that an epoch can be published, an epoch finalization service takes into account the following factors:

- Chain reorganization reports where the reorganized limits are a subset of the epoch qualified to be published.
- A configurable 'offset' from the bleeding edge of the chain.

Then, it publishes an epoch `(h₁, h₂)` so that `h₂ - h₁ + 1 == size(E)`. The next epoch is then tracked from `h₂ + 1`.

![Epoch Release Process](https://raw.githubusercontent.com/Powerloom/onchain-consensus/phase2/docs/images/epoch_generator.png)

## State Transitions

For every `epochId`, the following sequence of states represents the lifecycle of a 'project' from its release until a snapshot is finalized after reaching consensus on the protocol.

Snapshotter nodes participate in these states according to the data sources configured by the data markets they are part of. The status of these states can be further diagnosed using their internal APIs.

### 1. `EPOCH_RELEASED`

This state signifies that an epoch has been released on the protocol by the [epoch generator service](#epoch-generator).

### 2. `PRELOAD`

This state is considered successful once all the preloading dependencies specified in each project type's preloader configuration are satisfied.

### 3. `SNAPSHOT_BUILD`

This state is considered successful when the snapshot data structure is computed and prepared for submission to the protocol for consensus. This applies to both base and aggregate snapshots.

### 4. `SNAPSHOT_SUBMIT_PAYLOAD_COMMIT`

This is an internal state specific to snapshotter implementations. In this state, the snapshot-building worker processes queue up the snapshots with the Payload Commit Service after a successful `STATE_BUILD`.

### 5. `RELAYER_SEND`

In this state, the Payload Commit Service has sent the snapshot to a transaction relayer for submission to the protocol state contract.

### 6. `SNAPSHOT_FINALIZE`

In this state, the snapshot is finalized on the protocol.

## Force Consensus Service 

The Force Consensus service is an optional mechanism that can be run by anyone in the network. It is designed to trigger consensus checks for projects that didn't reach consensus automatically with a 51% majority within the submission window. This service will force consensus, if possible, if the project submissions meet all internal criteria for consensus after the submission window has closed.

The Force Consensus service operates slightly differently than the Epoch Generator and is heavily optimized to handle a large number of projects. The sequence diagram explaining the flow is given below.

![Force consensus mechanism](https://raw.githubusercontent.com/Powerloom/onchain-consensus/feat/force_consensus_only_relevant_projects/docs/images/force_consensus.png)

- [Epoch Generator Source Code on Github](https://github.com/powerloom/onchain-consensus/blob/63d09aa9ab1d98a2fed55e05b7760c12692fea83/epoch_generator.py)
