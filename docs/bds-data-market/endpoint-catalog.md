---
sidebar_position: 3
title: Endpoint Catalog
---

# Endpoint Catalog

This page documents the current Uniswap V3 route surface served by the snapshotter full-node resolver and exposed publicly through metered `/mpp/...` routes.

The route handlers live in the snapshotter full-node resolver implementation: [`powerloom/snapshotter-core-edge`](https://github.com/powerloom/snapshotter-core-edge). The hosted MCP server and agent clients consume the same route catalog through [`powerloom/bds-mcp-server`](https://github.com/powerloom/bds-mcp-server), [`powerloom/powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3), and [`powerloom/bds-agent-py`](https://github.com/powerloom/bds-agent-py).

For public integrations, treat `/mpp/...` as the canonical consumption path. Some deployments may expose equivalent non-metered aliases without the `/mpp` prefix, but those are not the product surface for hosted BDS access.

## Route families

| Area | Metered route family | Purpose |
|------|----------------------|---------|
| Pool metadata | `/mpp/pool/{pool_address}/metadata` | Pool configuration and descriptive metadata |
| Token pools | `/mpp/token/{token_address}/pools` | Pools associated with a token |
| ETH price | `/mpp/ethPrice`, `/mpp/ethPrice/{block_number}` | ETH reference price snapshots |
| Token price in pool | `/mpp/token/price/{token}/{pool}`, `/mpp/token/price/{token}/{pool}/{block_number}` | Pool-scoped token pricing |
| Base all pools | `/mpp/snapshot/base_all_pools/{token_address}` | Base snapshot view across pools for a token |
| Base snapshot | `/mpp/snapshot/base/{pool_address}`, `/mpp/snapshot/base/{pool_address}/{block_number}` | Pool state snapshot |
| Trades snapshot | `/mpp/snapshot/trades/{pool_address}`, `/mpp/snapshot/trades/{pool_address}/{block_number}` | Trade snapshot for one pool |
| All trades | `/mpp/snapshot/allTrades`, `/mpp/snapshot/allTrades/{block_number}` | Aggregated all-trades snapshot |
| Streaming all trades | `/mpp/stream/allTrades`, `/mpp/stream/allTrades?from_epoch={block_number}` | SSE stream of finalized all-trades data |
| Token prices all | `/mpp/tokenPrices/all/{token_address}`, `/mpp/tokenPrices/all/{token_address}/{block_number}` | Token pricing across supported pools |
| Trade volume | `/mpp/tradeVolume/...`, `/mpp/tradeVolumeAllPools/...` | Volume views over windows and scopes |
| Pool trades window | `/mpp/poolTrades/...` | Windowed trade retrieval for a pool |
| Time series | `/mpp/timeSeries/...` | Derived time-series views |
| Daily active | `/mpp/dailyActiveTokens`, `/mpp/dailyActivePools` | Daily activity summaries |

## Core consumption patterns

### Per-epoch snapshot read

Use a snapshot route when you want a finalized response for a specific epoch or block.

Examples:

- `/mpp/snapshot/allTrades/{block_number}`
- `/mpp/snapshot/base/{pool_address}/{block_number}`
- `/mpp/snapshot/trades/{pool_address}/{block_number}`

This is the primary consumption pattern for deterministic agent and application workflows.

### Latest finalized read

Use a route without the explicit epoch when you want the latest finalized result currently available from the full-node resolver.

Examples:

- `/mpp/snapshot/allTrades`
- `/mpp/ethPrice`

These routes are convenient, but they still follow finalized-state availability rather than raw source-chain head state.

### Streaming consumption

Use `/mpp/stream/allTrades` when you want a long-lived feed of finalized all-trades events. This is served over Server-Sent Events and can optionally resume from a given epoch with `from_epoch`.

## Authentication and metering

In hosted BDS deployments, `/mpp/...` routes are protected and metered by [`powerloom/bds-agenthub-billing-metering`](https://github.com/powerloom/bds-agenthub-billing-metering).

The current product direction is:

- **Bearer API key** authentication,
- credit deduction before the route is served,
- optional SSE access through the same metered surface.

For public consumers, the main practical rule is simple: if you are integrating with BDS as a product, target the `/mpp/...` routes and expect authenticated access.

## Scope note

This catalog documents the current Uniswap V3 BDS market surface. As additional BDS markets launch, this section should either grow market-specific catalogs or split them into separate per-market references.

## Related pages

- [`What BDS Is`](./what-bds-is.md)
- [`Snapshotter Full Node as Resolver`](./snapshotter-full-node-as-resolver.md)
- [`Verification Pattern`](./verification-pattern.md)
