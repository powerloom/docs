---
sidebar_position: 1
title: Why DSV Exists
---

# Why DSV Exists

Powerloom's first protocol iterations proved that high-frequency, consensus-backed data markets were possible, but they also made the scaling bottlenecks impossible to ignore.

The original architecture relied on direct submission flows that were workable at smaller scale and during earlier testnets. As the network matured, two problems became structural:

1. **Protocol-state bloat.** Base snapshot submissions for thousands of project IDs were being committed into protocol state even though those raw submissions only needed to exist until consensus was reached.
2. **Relayer drop-offs at scale.** Snapshotters could sign their submissions correctly and still lose them in the delivery path once the system crossed sustained high-volume throughput.

## The scaling pressure DSV had to solve

The public `Protocol v2` overview already documents the two hard constraints that forced the architecture upgrade:

- Powerloom was operating at **more than 1 million snapshot submission transactions per day**.
- At that scale, the relayer-driven flow saw **more than 5% of transactions dropped** in stressed periods.

Those numbers matter because Powerloom is not a low-frequency oracle network. The system exists to serve time-series data products where late or missing snapshots compound into worse downstream data.

If a market is tracking Ethereum mainnet block by block, every missing submission increases the risk that:

- a batch finalizes late,
- a composed dataset inherits stale inputs, or
- consumers have to trust fallback infrastructure instead of protocol consensus.

That is exactly the failure mode DSV is designed to remove.

## What changed with DSV

DSV replaces the single-path submission model to a sequencer with a network that separates **data propagation**, **batch consensus**, and **on-chain anchoring** into distinct stages:

- Snapshotters continue building market-specific snapshots.
- The local collector pushes those submissions into a libp2p mesh instead of only depending on direct relayer delivery.
- Validator nodes collect, validate, deduplicate, and aggregate submissions off-chain.
- Consensus output is uploaded to IPFS and only the final canonical references are anchored on-chain.

This changes the cost profile of the protocol in a useful way: the chain stores the information needed to verify the result, while the high-volume intermediate traffic stays off-chain.

## Why this is a continuation of Protocol v2

DSV is not a separate protocol. It is the continuation of the same design direction introduced in [`Protocol v2`](/Protocol/Protocol_v2/overview.md):

- batched submissions instead of per-snapshot chain writes,
- explicit validator participation,
- IPFS-backed batch payloads, and
- smart-contract state designed around finalized outputs rather than raw transport.

If you have already read the older [`Protocol v2 overview`](/Protocol/Protocol_v2/overview.md), think of DSV mainnet as the production-grade version of that upgrade path: the same idea, but now expressed as a decentralized sequencer-validator network with live data markets.

## What DSV optimizes for

DSV is opinionated about the problem it is solving. It is built to support:

- **continuous epoch releases** for fast-moving markets,
- **majority-based agreement** over per-project snapshot CIDs,
- **verifiable finalization** through on-chain contract state, and
- **data reuse** so later compute modules can build on prior finalized outputs.

That is why the rest of this section goes deeper than a marketing overview. The moat is architectural: the network is only interesting if you can trace the full path from snapshot build to an independently verifiable finalized CID.

## Continue Reading

- [`Roles and Topology`](./roles-and-topology.md)
- [`Protocol Workflow`](./protocol-workflow.md)
- [`On-Chain Submission and Verification`](./onchain-submission-and-verification.md)
