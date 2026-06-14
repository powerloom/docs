---
sidebar_position: 1
title: What Is BDS?
---

# What is BDS?

![BDS consumption path from DSV-finalized data through a full-node resolver to multiple consumption surfaces](/images/bds-agentic-workflow/bds-resolver-use-cases-web.jpg)

Blockchain Data Services (BDS) is the first production data market running on Powerloom's decentralized sequencer-validator network.

For the current mainnet deployment, the market is Uniswap V3 on Ethereum mainnet. Snapshotter nodes produce market-specific snapshots, DSV validators finalize those snapshots into canonical CIDs, and a participating snapshotter full node serves the HTTP API that consumers use today.

That full node is the resolver for the market. It translates higher-level API requests into the lower-level protocol objects that Powerloom actually finalizes: project IDs, epochs, finalized CIDs, and IPFS-addressed payloads. It also maintains cache-aware serving paths so applications such as the hosted Uniswap V3 frontend at [`bds.powerloom.io`](https://bds.powerloom.io) and agent workflows can consume the data without resolving every CID manually.

Helpful glossary:

- **BDS data market**: the live Uniswap V3 market on Powerloom, including snapshotter lite nodes, the full-node resolver, DSV validators, and on-chain market state.
- **BDS API**: the HTTP surface currently served by a snapshotter full node participating in that market.
- **Metered `/mpp/...` routes**: the hosted product surface for API-key-based usage, agents, and applications.
- **Agent access layer**: OpenClaw, hosted MCP, and the `bds-agent` CLI (`pip install bds-agent` or `uv tool install bds-agent`) that consume the same metered routes.

> [!NOTE] Head over to the [Agents & BDS Overview](/agents-and-bds/overview) for a more detailed explanation of how agents consume BDS data through metered access, OpenClaw/MCP, or the headless CLI, and how the BDS API fits into the overall BDS data market.


## What the market serves today

The current BDS mainnet market is focused on Uniswap V3 on Ethereum mainnet. The full-node resolver currently serves:

- per-epoch snapshots,
- all-trades snapshots,
- base snapshots,
- trades snapshots,
- token and pool metadata,
- trade volume,
- time-series views,
- and daily-active summaries.

The hosted metered product surface is exposed under `/mpp/...` routes. Those routes are the primary public consumption path for hosted access, agents, and API-key-based usage.

## Why BDS exists

DSV solves protocol-side finalization. The BDS full-node resolver solves product-side consumption for the live market.

That means the full-node resolver is responsible for turning:

- finalized project CIDs,
- IPFS-addressed payloads,
- and market-specific compute outputs

into an interface that applications and agents can query directly.

Without that layer, consumers would have to:

- query contract state directly,
- resolve CIDs themselves,
- fetch and decode raw payloads from IPFS,
- and reconstruct useful application-level structures for every request.

The resolver keeps the verification path intact while removing that operational burden from the consumer.

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
- **Resolver / serving layer:** a snapshotter full node participating in the BDS market
- **Primary hosted consumption path:** `/mpp/...` HTTP routes with Bearer-authenticated metering

This should be read as the first live market, not the limit of the protocol. The broader Powerloom model is still market-oriented: BDS is one concrete market implementation over the DSV finalization layer.

The current deployment starts with Uniswap V3, but the market model is not limited to static reference feeds. The protocol and serving model are designed so new data markets can be added without turning every new market into a one-off product stack.

## Implementation repositories

| Component | Repository |
|-----------|------------|
| Snapshotter full node / BDS resolver | [`powerloom/snapshotter-core-edge`](https://github.com/powerloom/snapshotter-core-edge) |
| Snapshotter lite node | [`powerloom/snapshotter-lite-v2`](https://github.com/powerloom/snapshotter-lite-v2) |
| DSV validator network | [`powerloom/snapshot-sequencer-validator`](https://github.com/powerloom/snapshot-sequencer-validator) |
| Metering, credits, API keys, pay-signup | [`powerloom/bds-agenthub-billing-metering`](https://github.com/powerloom/bds-agenthub-billing-metering) |
| Hosted MCP server | [`powerloom/bds-mcp-server`](https://github.com/powerloom/bds-mcp-server) |
| OpenClaw skill and recipes | [`powerloom/powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3) |
| Headless agent CLI | [`bds-agent` on PyPI](https://pypi.org/project/bds-agent/) · [`powerloom/bds-agent-py`](https://github.com/powerloom/bds-agent-py) |

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
- [`Agents & BDS — Overview`](/category/agents--bds) — how agents consume BDS data through metered access, OpenClaw/MCP, or the headless CLI
