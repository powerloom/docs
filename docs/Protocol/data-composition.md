---
sidebar_position: 4
---

# Snapshot Composition

The protocol state collects finalized snapshots for incremental epochs against contracts configured as data sources. These snapshots can be further composed using either one or a combination of the following strategies:

- Primitives like map-reduce, summation, filter, etc.
- A specific span of epochs to denote a time period (e.g., 24 hours).
- And anything else you can think of...!

## Single Project Composition

We can compose snapshots on top of base snapshots for a single contract.

![Single Project Composition](/images/single_project_composition.png)

## Multiple Projects Composition

As defined by the data sources configuration, the protocol state collects snapshots across multiple smart contracts that can be further composed according to the strategies outlined at the beginning of this page.

![Multiple Projects Snapshots](/images/multi_projects_snapshots.png)

## Higher-Order Aggregations

A market can generate higher-order aggregation datasets by:

- Combining individual snapshots of trade volume and fees across multiple pair contracts.
- Spanning a specific set of epochs that satisfy a time duration (e.g., 24 hours).

Since all snapshots are finalized on an epoch basis, you can weave together snapshots across multiple contracts and accurately derive complex data compositions without approximations.

![Multiple Projects Composition](/images/multi_projects_composition.png)

### Dependency Graph

All of this is controlled by the dependency graph specified in the data market's configuration of data sources.

![Data Composition Dependency Graph](/images/DependencyDataComposition.png)
