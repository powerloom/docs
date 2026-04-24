---
sidebar_position: 3
title: Endpoint Catalog
---

# Endpoint Catalog

This page documents the current BDS Uniswap V3 market surface exposed through metered `/mpp/...` routes.

The marketed product surface is the metered one. Some deployments may also expose equivalent free routes without the `/mpp` prefix, but public BDS integrations should treat `/mpp/...` as the canonical consumption path.

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

Use a route without the explicit epoch when you want the latest finalized result currently available on the serving node.

Examples:

- `/mpp/snapshot/allTrades`
- `/mpp/ethPrice`

These routes are convenient, but they still follow finalized-state availability rather than raw source-chain head state.

### Streaming consumption

Use `/mpp/stream/allTrades` when you want a long-lived feed of finalized all-trades events. This is served over Server-Sent Events and can optionally resume from a given epoch with `from_epoch`.

## Authentication and metering

In hosted BDS deployments, `/mpp/...` routes are protected and metered.

The current product direction is:

- **Bearer API key** authentication,
- credit deduction before the route is served,
- optional SSE access through the same metered surface.

For public consumers, the main practical rule is simple: if you are integrating with BDS as a product, target the `/mpp/...` routes and expect authenticated access.

## Scope note

This catalog documents the current Uniswap V3 BDS market surface. As additional BDS markets are launched, this section should either grow market-specific catalogs or split them into separate per-market references.

## Related pages

- [`What BDS Is`](./what-bds-is.md)
- [`Snapshotter Full Node as Resolver`](./snapshotter-full-node-as-resolver.md)
- [`Verification Pattern`](./verification-pattern.md)
