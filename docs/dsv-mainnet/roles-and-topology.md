---
sidebar_position: 2
title: Roles and Topology
---

# Roles and Topology

DSV mainnet is a multi-role network. The important thing to understand is that it replaces the centralized sequencer deployment model of Protocol v2 with a distributed sequencer-validator topology. Each role has a narrow job, and the pipeline works because those jobs compose cleanly.

## Core roles

| Role | What it does | Why it exists |
|------|---------------|---------------|
| Snapshotter lite node | Builds market-specific snapshots from source-chain state transitions | Keeps data collection distributed across many node operators |
| Local collector | Receives snapshots from compute modules and publishes them into the libp2p mesh | Decouples snapshot creation from network transport |
| DSV validator | Receives, validates, deduplicates, and aggregates submissions | Turns raw submissions into deterministic consensus outputs |
| IPFS | Stores batch payloads and finalized batch artifacts | Keeps large batch payloads off-chain while preserving content-addressed integrity |
| `ProtocolState` contract | Exposes protocol-wide read and write entrypoints | Provides the canonical contract interface for batch submission and CID lookup |
| `DataMarket` contract | Holds finalized snapshot state for a specific market | Namespaces epochs, finalized project CIDs, and validator-facing market parameters |
| VPA (Validator Priority Assignment) | Determines which validator can submit first for a given epoch | Prevents submission races while preserving decentralized participation |

## Network topology at a glance

The network has three planes operating together:

1. **Data production plane**: snapshotters and local collectors produce market data.
2. **Consensus plane**: validators ingest the stream, compute majority outcomes, and converge on a batch.
3. **Settlement plane**: the winning validator submits the consensus batch on-chain, where consumers can verify it later.

That separation is what lets Powerloom scale high-frequency data without storing raw intermediate traffic in protocol state.

## P2P transport

At the transport layer, DSV relies on libp2p discovery plus gossipsub propagation.

Two topic families matter most for the live BDS mainnet market:

- Snapshot submissions: `/powerloom/dsv-mainnet-bds/snapshot-submissions/all`
- Discovery / mesh-formation topic family under the same prefix

The local collector also uses a rendezvous point so peers can recover connectivity without depending on a single static host list. In the published BDS mainnet setup, that rendezvous point is `powerloom-dsv-mainnet-bds`.

## Validator-side components

A validator is not one opaque binary. The DSV pipeline is composed of cooperating services:

| Component | Responsibility |
|-----------|----------------|
| P2P gateway | Subscribes to gossipsub topics and writes raw submissions into the processing queue |
| Dequeuer | Validates EIP-712 signatures, deduplicates submissions, and stores epoch-scoped state |
| Event monitor | Tracks `EpochReleased` events and submission windows from contract state |
| Finalizer workers | Compute per-project majority CIDs and create batch parts |
| Aggregator Level 1 | Produces the validator's local finalized batch and publishes its IPFS CID |
| Aggregator Level 2 | Collects batches from multiple validators and computes network consensus |
| VPA client | Checks submission priority and performs on-chain batch submission when eligible |

## Geographic distribution and mesh behavior

The transport layer is designed for geographically distributed operators rather than a single region or a single data-center cluster.

Operationally, the mesh is treated as healthy only when peers are present on both discovery and submissions topics. The published local-collector health model defines:

- **healthy**: both topics have at least 2 peers,
- **degraded**: one or both topics have fewer than 2 peers,
- **pruned**: one or both topics have 0 peers.

That is a useful design detail because it shows DSV is not merely "P2P" in name. The operator tooling is explicitly built around mesh-state visibility.

## A concrete BDS mainnet topology snapshot

The public BDS mainnet setup guide exposes a representative healthy mesh sample from a live collector session:

- `peer_count=5` on the submissions topic,
- `total_connected=162`,
- `uptime_seconds=40110`.

Those values are not a protocol guarantee, but they are exactly the kind of operational signal you want from a production network: peer depth, total connectivity, and long-lived session uptime are all measurable rather than implied.

## Why the topology matters

Powerloom's differentiator is not that it has a sequencer, a validator, or IPFS. Many systems have some version of those words.

The differentiator is the topology:

- data collection happens at the edge,
- transport happens over a mesh,
- consensus happens in two stages,
- state commitment is reduced to canonical outputs, and
- verification stays available to anyone with an RPC endpoint.

That combination is what makes DSV a data protocol instead of a centralized API with blockchain branding.

## Continue Reading

- [`Protocol Workflow`](./protocol-workflow.md)
- [`On-Chain Submission and Verification`](./onchain-submission-and-verification.md)
