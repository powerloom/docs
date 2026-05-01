---
sidebar_position: 1
title: Diagnostics and Cleanup
---

# Diagnostics and Cleanup

The snapshotter CLI includes diagnostics and cleanup commands for snapshotter lite deployments. It checks Docker availability, system resources, network connectivity, port availability, and existing snapshotter containers.

```bash
powerloom-snapshotter-cli diagnose
```

The following output may vary depending on whether you have run snapshotter node(s) before this setup or not.

```
powerloom-snapshotter-cli diagnose
🔍 Starting Powerloom Node Diagnostics...

📦 Checking Docker installation...
✅ Docker is installed and running

🐳 Checking docker-compose...
✅ Docker Compose is available

🔌 Checking default ports...
⚠️ Port 8002 is in use
✅ Next available Core API port: 8003
⚠️ Port 50051 is in use
✅ Next available Collector port: 50052

🔍 Checking existing Powerloom containers...
Found existing Powerloom containers:
snapshotter-lite-v2-xxx1-mainnet-BDS_MAINNET_UNISWAPV3-ETH
snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH
snapshotter-lite-v2-xxx2-mainnet-BDS_MAINNET_UNISWAPV3-ETH
```
If you want to cleanup the existing containers, follow along to the next section

## Cleanup[optional]

:::tip
This is particularly useful if you find your nodes are not running as expected and want a fresh start.
:::


### Stop and remove all powerloom containers


To clean up existing deployments, run:

```bash
powerloom-snapshotter-cli diagnose --clean --force
```

The CLI stops and removes matching snapshotter lite containers and local collectors, then removes associated Docker networks where safe.

```
Stopping running containers... (timeout: 30s per container)
Attempting to stop container snapshotter-lite-v2-xxx1-mainnet-BDS_MAINNET_UNISWAPV3-ETH...
snapshotter-lite-v2-xxx1-mainnet-BDS_MAINNET_UNISWAPV3-ETH
Attempting to stop container snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH...
snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH

Removing containers...
Removing container snapshotter-lite-v2-xxx1-mainnet-BDS_MAINNET_UNISWAPV3-ETH...
Removing container snapshotter-lite-local-collector-mainnet-BDS_MAINNET_UNISWAPV3-ETH...

Removing networks...
✅ Cleanup complete
```

### Cleanup stale images and networks and cache

:::warning
This is a cleanup step that removes all stale images, networks and cache from Docker. Proceed only if all other attempts at running the node have failed after following our guides.
:::

If cleanup still leaves stale Docker resources, use Docker's own prune commands after confirming no unrelated containers/images are needed:

```bash
docker network prune
docker system prune
```

Docker will ask for confirmation before removing unused resources.