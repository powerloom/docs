---
sidebar_position: 2
title: Monitoring and Troubleshooting
---

# Monitoring and Troubleshooting

This section covers the snapshotter CLI-based workflow for checking, debugging, and reconfiguring Snapshotter Lite V2 deployments.

## Confirm Node Activity

### Snapshotter Dashboard

Use the [Snapshotter Dashboard](https://mint.powerloom.network/) to verify whether your slot is actively submitting snapshots.

### Telegram Reporting Bot

Snapshotter Lite nodes can send Telegram messages when issues arise during snapshotting. See [Telegram Bot Setup](/build-with-powerloom/snapshotter-node/lite-node-v2/telegram-bot-setup) for setup instructions.

### Slot Monitoring Service

The Powerloom Slot Monitoring Service provides webhook-based notifications through platforms like Slack and Discord. See [Slot Monitoring Setup](/build-with-powerloom/snapshotter-node/lite-node-v2/slot-monitoring-setup) for configuration instructions.

## CLI Status Check

Use the snapshotter CLI to check deployed screen sessions and Docker containers:

```bash
powerloom-snapshotter-cli status
```

You can also use shell mode:

```bash
powerloom-snapshotter-cli shell
powerloom-snapshotter> status
```

## Docker Container Checks

To inspect running containers directly:

```bash
docker ps | grep -iE 'mainnet|collector'
```

For a BDS Mainnet slot such as `1234`, you should see containers similar to:

```bash
snapshotter-lite-v2-1234-mainnet-BDS_MAINNET_UNISWAPV3-ETH
snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH
```

Check snapshotter logs with:

```bash
docker logs snapshotter-lite-v2-1234-mainnet-BDS_MAINNET_UNISWAPV3-ETH -n 500
```

Check local collector mesh publication logs with:

```bash
docker logs snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH -n 100 2>&1 | grep -i 'mesh'
```

## Screen Session Checks

The CLI starts screen sessions for deployed snapshotter processes. List sessions with:

```bash
screen -ls
```

Attach to a slot session with:

```bash
screen -r pl_mainnet_bds_mainnet_uniswapv3_1234
```

Replace `1234` with your slot ID.

## Diagnostics and Cleanup

Run diagnostics with:

```bash
powerloom-snapshotter-cli diagnose
```

Clean up existing deployments with:

```bash
powerloom-snapshotter-cli diagnose --clean --force
```

For detailed usage instructions, see [Diagnostics](/build-with-powerloom/snapshotter-node/lite-node-v2/diagnostics).

## Reconfigure a Deployment

Re-run `configure` to update signer details, RPC URLs, Telegram chat ID, or collector settings for the BDS Mainnet market:

```bash
powerloom-snapshotter-cli configure --env mainnet --market BDS_MAINNET_UNISWAPV3
```

Then redeploy:

```bash
powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3
```

## RPC URL Issues

If the node reports source-chain RPC errors, rerun the configuration step and provide a working Ethereum mainnet RPC URL. Reliable providers include Infura, Alchemy, QuickNode, and Ankr.

## Additional Support

If you have followed these troubleshooting steps and still encounter issues, contact us on [Discord](https://discord.com/invite/powerloom).
