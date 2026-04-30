---
sidebar_position: 6
title: Stability and Scale
---

# Stability and Scale

This page presents operational signals from the live BDS mainnet market. All figures are derived from on-chain events, copied epoch tallies, or direct measurement of the production network.

## Network at a Glance

The BDS mainnet market has been running on Ethereum mainnet for **58 days** (as of this writing). The measurement window below covers the **first 30 days** of production operation.

![DSV Network Health Timeline](/images/bds-agentic-workflow/dsv-mainnet-operations/dsv_network_health_timeline.png)

*Figure 1: Daily batch submission completion rate over the first 30 days of production. The network maintained 97.70% completion across 217,295 total epochs.*

### Key Production Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Total epochs assigned | 217,295 | On-chain priority assignments (Day 1-30) |
| Epochs with submissions | 212,297 | Snapshot batch submitted events |
| Completion rate | **97.70%** | Derived from above |
| Missed epochs | 4,998 | Gaps in submission coverage |
| Median end-to-end latency | **89 seconds** | Priority assignment to on-chain finalization |
| Mean latency | 88 seconds | Same measurement window |
| P95 latency | 138 seconds | Tail latency measurement |
| Full steady-state days | 26 of 30 | Days at 7,200 epoch cadence |

The 2.3% gap in coverage clustered around brief restart windows rather than being evenly distributed. Once a validator commits to submitting a batch, it completes 99.01% of the time.

---

## Validator Performance

Six validator nodes maintained 22 or more consecutive days of operation during the measurement window.

![Validator Network Constellation](/images/bds-agentic-workflow/dsv-mainnet-operations/dsv_validator_constellation.png)

*Figure 2: Validator node constellation showing completion rates and active days. Node size indicates total submissions; color indicates reliability tier.*

### Stable Validators (22+ days active)

| Node | Active Days | Completion Rate | Total Submitted |
|------|-------------|-----------------|-----------------|
| Node 1 | 30/30 (100%) | 99.87% | 29,670 |
| Node 5 | 30/30 (100%) | 99.90% | 49,717 |
| Node 4 | 29/30 (96.7%) | 99.20% | 27,252 |
| Node 3 | 28/30 (93.3%) | 97.42% | 33,827 |
| Node 10 | 26/30 (86.7%) | 98.01% | 27,690 |
| Node 11 | 22/30 (73.3%) | 98.79% | 25,319 |

*Three additional transient nodes participated for shorter periods during operator testing and rotation.*

Across the six stable long-running nodes, the aggregate completion rate was **98.95% over 193,475 total submissions**.

---

## Submission Latency

Latency is measured from priority assignment (validator selected for epoch) to on-chain finalization (batch submission confirmed).

![Batch Submission Latency](/images/bds-agentic-workflow/dsv-mainnet-operations/dsv_latency_heatmap.png)

*Figure 3: Latency distribution by hour of day. The density plot shows 212,297 submissions with median 89s, mean 88s, and P95 138s.*

The heatmap reveals consistent latency patterns across all hours, with no significant degradation during any specific time window. This indicates stable validator infrastructure and reliable RPC connectivity throughout the measurement period.

---

## Epoch Coverage Pattern

The coverage matrix shows submission activity across all epochs in the 30-day window.

![Epoch Coverage Matrix](/images/bds-agentic-workflow/dsv-mainnet-operations/dsv_epoch_coverage_matrix.png)

*Figure 4: Day-by-epoch-block coverage matrix. Bright green indicates high submission counts; dark cells indicate gaps. The matrix shows sustained coverage with isolated gaps clustering around operational transitions.*

The matrix demonstrates that gaps were not random failures but clustered around specific operational events (node restarts, configuration updates). The network recovered full coverage within hours of any interruption.

---

## Snapshotter Participation

A separate measurement of 1,811 epochs (April 17–24) shows the snapshotter layer participation:

| Metric | Value |
|--------|-------|
| Unique eligible nodes per day | 2,970 – 3,047 |
| Median eligible nodes per epoch | 305 |
| Active validators per epoch | 3–5 (median 4) |
| Minimum validators observed | 3 (every measured epoch) |

![Snapshotter Slot Activity](/images/bds-agentic-workflow/dsv-mainnet-operations/dsv_slot_distribution_radial.png)

*Figure 5: Radial distribution of slot activity from sampled epochs. The visualization shows 3,078 total slots with activity levels categorized by submission count.*

The slot distribution shows broad participation across the slot ID space (0–8191), with no concentration that would indicate centralization or collusion patterns.

---

## What These Figures Show

### Continuous cadence under pressure

BDS mainnet processes one-block epochs on Ethereum mainnet. This creates continuous pressure on transport, aggregation, and finalization rather than allowing activity to concentrate into infrequent batch windows. The 97.70% completion rate across 217K epochs demonstrates sustained operation under this pressure.

### Observable mesh health

The published local-collector setup includes explicit health states:

- `healthy` when both discovery and submission topics have at least 2 peers
- `degraded` when one side falls below threshold
- `pruned` when one side has 0 peers

These definitions make mesh health observable rather than assumed. The live measurements show 5 healthy submission-topic peers and 162 total connected peers in sampled collector logs.

### Measurable validator participation

The network shows:

- **3 to 5 validators** present per tallied epoch
- **~3,000 eligible nodes** receiving rewards daily
- **98.95% aggregate completion** across stable validators
- **99.01% completion rate** once submission commitment is made

This provides concrete evidence of multi-validator participation at production scale.

---

## Competitive Position

Many data products can show a dashboard. The DSV network can show:

- Published epoch workflow with timing guarantees
- Market-scoped on-chain finalization
- Public verification calls for exact finalized CIDs
- Operator-visible mesh health thresholds
- Validator-priority-controlled settlement
- 58 days of sustained production history

That combination is what makes DSV interesting as a production system rather than a theoretical architecture.

---

## Related Pages

- [`On-Chain Submission and Verification`](./onchain-submission-and-verification.md)
- [`Why DSV Exists`](./why-dsv-exists.md)

---

## Methodology and Reproducibility

All figures are derived from:

1. **On-chain events** on Powerloom mainnet (chain 7869)
2. **Copied epoch tallies** from `snapshot-activity-tracker-updater` (1,811 epochs)
3. **Validator activity analysis** from `dsv-validator-activity` scripts (30-day window)

Contract addresses and full methodology: [github.com/powerloom/curated-datamarkets](https://github.com/powerloom/curated-datamarkets)

Last updated: 2026-04-30
