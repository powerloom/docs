---
sidebar_position: 6
title: Stability and Scale
---

# Stability and Scale

This page summarizes currently publishable operational signals for the live BDS mainnet market. It uses figures that can be traced to published setup guides, contract-facing configuration, or copied tally outputs from production monitoring.

## What the current published numbers show

| Metric | Published value | Source context |
|--------|-----------------|----------------|
| Submission window | `45s` | DSV consensus flow for BDS mainnet |
| Aggregation window | `30s` | Level 2 aggregation window |
| Copied epoch tally sample | `1811` epochs | `snapshot-activity-tracker-updater` tallies copied from deployment |
| Tally coverage window | `2026-04-17` to `2026-04-24` | Timestamp range inside copied BDS mainnet tallies |
| Validators per tallied epoch | Avg `4.09`, median `4`, range `3-5` | Copied BDS epoch tallies |
| Eligible nodes per tallied epoch | Avg `284.58`, median `305`, p95 `330`, max `355` | Copied BDS epoch tallies |
| Eligible nodes receiving rewards per day | `~3000/day` | Current BDS mainnet day-level reward tally as of 2026-04-24 |
| Healthy submissions-topic peers in sample | `5` | Live collector log sample |
| Total connected peers in same sample | `162` | Live collector log sample |
| Sample collector uptime | `40110s` | Live collector log sample |

Together, these figures show that the network exposes measurable signals for:

- epoch timing,
- validator participation,
- mesh health,
- total live connectivity, and
- long-lived session operation.

## What we can say confidently today

### The network is built for continuous cadence

For the live BDS mainnet market, the source chain is Ethereum mainnet and the market processes one-block epochs. That means the system is designed around continuous releases rather than periodic batch jobs.

This operating model places continuous pressure on transport, aggregation, and finalization rather than concentrating activity into infrequent batch windows.

### Mesh health is observable, not assumed

The published local-collector setup includes explicit health states:

- `healthy` when both discovery and submission topics have at least 2 peers,
- `degraded` when one side falls below that threshold,
- `pruned` when one side has 0 peers.

These definitions make mesh health observable through explicit thresholds rather than informal operator judgment.

### Validator participation is already measurable


- **3 to 5 validators** present per tallied epoch,
- an average of **4.09 validators** per tallied epoch,
- **284.58 eligible nodes** per tallied epoch on average,
- a median of **305** eligible nodes per tallied epoch,
- a **p95 of 330** eligible nodes per tallied epoch,
- and a current day-level reward view of roughly **3000 eligible nodes receiving rewards per day** for the BDS mainnet market.

This is a stronger basis than an isolated sample. It shows sustained multi-validator participation across a large production epoch range and a substantially larger reward-eligible snapshotter base than the early mainnet-alpha period.

The scope distinction is important: the `284.58` figure is an **epoch-level** average from copied per-epoch tallies, while the `~3000/day` figure is a **day-level** reward tally for the same market as of 2026-04-24.

## What the copied tally sample also shows

The copied epoch tallies also show a clear participation pattern:

- `validator1`, `validator4`, and `validator5` are the validators consistently associated with batch CIDs across essentially the entire copied sample,
- `validator3` and `validator11` appear in validator summaries across subsets of the range without corresponding batch CID presence in those tallies,
- and the validator-count distribution across the sample is `523` epochs with `3` validators, `603` with `4`, and `685` with `5`.

This distribution is useful because it reflects the observed participation envelope directly rather than presenting the network as a fixed five-validator configuration in every epoch.

The main operational takeaway is straightforward: the network has enough structure and enough observability to describe participation breadth with concrete epoch-level evidence.

## Why this still matters competitively

Many data products can show a dashboard. Far fewer can show:

- a published epoch workflow,
- market-scoped on-chain finalization,
- a public verification call for the exact finalized CID,
- operator-visible mesh health,
- and validator-priority-controlled settlement.

That combination is what makes DSV interesting even while the public metrics surface is still maturing.

## What to expect from future revisions

This page should eventually add public-facing values for:

- sequencer or validator uptime by period,
- attestation coverage by epoch range,
- successful on-chain finalization rate,
- median and p95 end-to-end finalization latency,
- mesh peer depth over time.

Until those dashboards are published, this page should remain limited to evidenced numbers from copied tally outputs, block explorers, or published monitoring surfaces.

## Related pages

- [`On-Chain Submission and Verification`](./onchain-submission-and-verification.md)
- [`No Parallel Exists`](./no-parallel-exists.md)
