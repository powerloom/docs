---
sidebar_position: 3
title: Endpoint Catalog
---

import LiveTimeseriesMultiplier from '@site/src/components/LiveTimeseriesMultiplier';

# Endpoint Catalog

This page documents the current Uniswap V3 route surface served by the snapshotter full-node resolver and exposed publicly through metered `/mpp/...` routes.

The **machine-readable** endpoint catalog (paths, HTTP methods, parameters, metering flags) for this BDS market is maintained in the compute package repo as [`api/endpoints.json`](https://github.com/powerloom/snapshotter-computes/blob/bds_eth_uniswapv3_core/api/endpoints.json) on branch [`bds_eth_uniswapv3_core`](https://github.com/powerloom/snapshotter-computes/tree/bds_eth_uniswapv3_core) in [`powerloom/snapshotter-computes`](https://github.com/powerloom/snapshotter-computes). That file is the single catalog source for the full-node resolver, [`powerloom/bds-mcp-server`](https://github.com/powerloom/bds-mcp-server), [`powerloom/powerloom-bds-univ3`](https://github.com/powerloom/powerloom-bds-univ3), and the headless [`bds-agent`](https://pypi.org/project/bds-agent/) CLI ([`powerloom/bds-agent-py`](https://github.com/powerloom/bds-agent-py)). Route handlers are implemented in the snapshotter full-node stack ([`powerloom/snapshotter-core-edge`](https://github.com/powerloom/snapshotter-core-edge) and related deployments).

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

## Credit weights

Metered routes are **not** billed at one flat rate. Each entry in [`api/endpoints.json`](https://github.com/powerloom/snapshotter-computes/blob/bds_eth_uniswapv3_core/api/endpoints.json) carries a **`credit_weight`** multiplier, and the resolver (core-edge full node) debits **`CREDIT_PER_EPOCH × credit_weight`** per request before serving it. SSE streams bill a flat session rate (`CREDIT_PER_STREAM_SESSION`; weight ignored), and an unmatched route defaults to weight **1**. See [Metering & API Keys → Debit formula](/agents-and-bds/metering-and-api-keys#debit-formula) for base rates and worked examples.

The weights below mirror catalog **version 2** for the BDS Uniswap V3 market; `api/endpoints.json` is the single source of truth — verify against the live file before relying on a value.

| Metered route | `credit_weight` |
|---------------|-----------------|
| `/mpp/pool/{pool_address}/metadata` | 1 |
| `/mpp/token/{token_address}/pools` | 1 |
| `/mpp/ethPrice` | 5 |
| `/mpp/ethPrice/{block_number}` | 10 |
| `/mpp/token/price/{token_address}/{pool_address}` | 5 |
| `/mpp/token/price/{token_address}/{pool_address}/{block_number}` | 10 |
| `/mpp/snapshot/base_all_pools/{token_address}` | 1 |
| `/mpp/snapshot/base/{pool_address}` | 1 |
| `/mpp/snapshot/base/{pool_address}/{block_number}` | 1 |
| `/mpp/snapshot/trades/{pool_address}` | 1 |
| `/mpp/snapshot/trades/{pool_address}/{block_number}` | 1 |
| `/mpp/snapshot/allTrades` | 1 |
| `/mpp/snapshot/allTrades/{block_number}` | 1 |
| `/mpp/stream/allTrades` | flat stream session rate |
| `/mpp/tokenPrices/all/{token_address}` | 10 |
| `/mpp/tokenPrices/all/{token_address}/{block_number}` | 10 |
| `/mpp/tradeVolumeAllPools/{token_address}/{time_interval}` | 1 |
| `/mpp/tradeVolume/{pool_address}/{time_interval}` | 1 |
| `/mpp/poolTrades/{pool_address}/{start_timestamp}/{end_timestamp}` | 1 |
| `/mpp/timeSeries/{token_address}/{pool_address}/{time_interval}/{step_seconds}` | 5 × lookback multiplier (see below) |
| `/mpp/dailyActiveTokens` | 1 |
| `/mpp/dailyActivePools` | 1 |

### Time series lookback multiplier

`/mpp/timeSeries/...` is the one route whose cost is **not** captured by the static `credit_weight` alone. On top of its base weight of **5**, the resolver applies a **lookback multiplier** determined by the `time_interval` parameter (how far back the window reaches). Effective debit = **`CREDIT_PER_EPOCH × 5 × multiplier`**. This reflects the number of historical snapshots the resolver must walk to serve the window; for real-time use, per-block `/mpp/token/price/.../{block_number}` is cheaper and more precise.

The tiers are defined in the catalog (`billing_modifier` on the time series route) and load live below:

<LiveTimeseriesMultiplier />

So `/mpp/timeSeries/.../3600/144` (1-hour lookback) costs 5 × 4 = **20×** the base epoch rate; a 24-hour window costs **640×**. The multiplier is keyed off `time_interval` (the lookback seconds), not `step_seconds`.

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
