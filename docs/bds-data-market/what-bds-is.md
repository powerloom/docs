---
sidebar_position: 1
title: What BDS Is
---

# What BDS Is

Blockchain Data Services (BDS) is the first production data market to leverage Powerloom's decentralized sequencer-validator network.

For the current mainnet deployment, BDS serves structured Uniswap V3 data from Ethereum mainnet through an HTTP API and agent-facing metered routes.

The important distinction is that BDS should not be read as a thin dashboard backend. It is the public product surface for a live Powerloom data market: finalized outputs are produced by the protocol, and BDS makes them consumable by applications and agents.

![BDS serving path from DSV-finalized data through a full-node resolver to multiple consumption surfaces](/img/bds-serving-hero.svg)

## What the market serves today

The current BDS mainnet market is focused on Uniswap V3 on Ethereum mainnet. Its API surface includes:

- per-epoch snapshots,
- all-trades snapshots,
- base snapshots,
- trades snapshots,
- token and pool metadata,
- trade volume,
- time-series views,
- and daily-active summaries.

The metered product surface is exposed under `/mpp/...` routes. Those routes are the primary public consumption path for hosted access, agents, and API-key-based usage.

## Why BDS exists

DSV solves protocol-side finalization. BDS solves product-side consumption.

That means BDS is responsible for turning:

- finalized project CIDs,
- IPFS-addressed payloads,
- and market-specific compute outputs

into an interface that applications and agents can query directly.

Without that layer, consumers would have to:

- query contract state directly,
- resolve CIDs themselves,
- fetch and decode raw payloads from IPFS,
- and reconstruct useful application-level structures for every request.

BDS keeps the verification path intact while removing that operational burden from the consumer.

It also reflects a broader product shift for Powerloom. Instead of exposing only fixed dashboard-style surfaces, BDS turns finalized protocol data into a reusable market that can serve:

- direct HTTP integrations,
- agent frameworks,
- MCP-backed toolchains,
- and verification-aware applications that need structured DeFi data without depending on a proprietary indexer.

## Current market scope

The current BDS deployment is intentionally opinionated.

- **Source chain:** Ethereum mainnet
- **Current market:** Uniswap V3
- **Anchor chain:** Powerloom mainnet, where `ProtocolState` and the market contract store finalized references
- **Primary consumption path:** `/mpp/...` HTTP routes with Bearer-authenticated metering

This should be read as the first live market, not the limit of the protocol. The broader Powerloom model is still market-oriented: BDS is one concrete market implementation over the DSV finalization layer.

The current deployment starts with Uniswap V3, but the market model is not limited to static reference feeds. The protocol and serving model are designed so new data markets can be added without turning every new market into a one-off product stack.

## Response model

BDS routes expose two broad kinds of outputs:

1. **Direct snapshot reads**: fetch one finalized snapshot or a stream of finalized snapshots for a project and epoch.
2. **Derived views**: compute-friendly responses such as time series, trade volume windows, token prices, or pool activity, all built from finalized underlying snapshot data.

For the all-trades path, BDS also includes a `verification` object in the response so the consumer can independently check that the returned payload maps back to the CID finalized on-chain.

## Why the market is useful

BDS turns DSV from protocol infrastructure into something directly usable by:

- dashboards,
- analytics systems,
- monitoring agents,
- trading and alerting workflows,
- and any application that needs structured, finalized market data without trusting a proprietary indexer.

The value proposition is therefore not only "API access." It is:

- dynamic market data,
- structured responses derived from finalized snapshots,
- independent verifiability,
- and a serving surface that can scale from one query to large numbers of agent consumers.

## Related pages

- [`Why DSV Exists`](/dsv-mainnet/why-dsv-exists)
- [`Snapshotter Full Node as Resolver`](./snapshotter-full-node-as-resolver.md)
- [`Endpoint Catalog`](./endpoint-catalog.md)
- [`Verification Pattern`](./verification-pattern.md)
