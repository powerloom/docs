---
sidebar_position: 1
title: Diagnostics and Cleanup
---

# Diagnostics and Cleanup

The lite node as well as the multi node setup comes with a diagnostic and cleanup script. This script will check for any previous instances of the lite node, local collector, stale images and networks.

```bash
   ./diagnose.sh
```

The following output may vary depending on whether you have run snapshotter node(s) before this setup or not.

```
./diagnose.sh
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
snapshotter-lite-v2-xxx1-mainnet-UNISWAPV2-ETH
snapshotter-lite-local-collector-xxx1-mainnet-UNISWAPV2-ETH
snapshotter-lite-v2-xxx2-mainnet-UNISWAPV2-ETH
```
If you want to cleanup the existing containers, follow along to the next section

## Cleanup[optional]

:::tip
This is particularly useful if you find your nodes are not running as expected and want a fresh start.
:::


### Stop and remove all powerloom containers


If the diagnostic script finds any running containers tagged with `snapshotter-lite`, it will ask you if you want to stop and remove them.

Select `y` at the following prompt and you see some logs like the following:

```
Would you like to stop and remove existing Powerloom containers? (y/n): y 

Stopping running containers... (timeout: 30s per container)
Attempting to stop container snapshotter-lite-v2-xxx1-mainnet-UNISWAPV2-ETH...
snapshotter-lite-v2-xxx1-mainnet-UNISWAPV2-ETH
Attempting to stop container snapshotter-lite-local-collector-xxx1-mainnet-UNISWAPV2-ETH...
snapshotter-lite-local-collector-xxx1-mainnet-UNISWAPV2-ETH

Removing containers...
Removing container snapshotter-lite-v2-xxx1-mainnet-UNISWAPV2-ETH...
Removing container snapshotter-lite-local-collector-xxx1-mainnet-UNISWAPV2-ETH...

Removing container snapshotter-lite-v2-xxx2-mainnet-UNISWAPV2-ETH...
```


### Remove all Docker subnets assigned to the snapshotter-lite containers

Enter `y` at the following prompt and you see some logs like the following:

```
Would you like to remove existing Powerloom networks? (y/n): y

Removing networks...
snapshotter-lite-v2-xxx1-mainnet-UNISWAPV2-ETH
snapshotter-lite-v2-xxx2-mainnet-UNISWAPV2-ETH
✅ Networks removed
```

### Cleanup stale images and networks and cache

:::warning
This is a cleanup step that removes all stale images, networks and cache from Docker. Proceed only if all other attempts at running the node have failed after following our guides.
:::

Enter `y` at the following prompt and you see some logs like the following. Press `y` again at the end to confirm with Docker.

```
Would you like to remove unused Docker resources (only unused images, networks, and cache)? (y/n): y 

Removing unused Docker resources...

Running docker network prune...

Running docker system prune...
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all images without at least one container associated to them
  - all build cache

Are you sure you want to continue? [y/N] y

Deleted Images:
untagged: ghcr.io/powerloom/snapshotter-lite-v2:latest
untagged: ghcr.io/powerloom/snapshotter-lite-v2@sha256:15e05050bbf1473a3b4345a188c44bb37fb343f89d24f9ce731e3c3df190ec98
deleted: sha256:33d723744d4cb306c9be663247464f497698682fb0d577290831114b825bc84a

Total reclaimed space: 1.614GB
✅ Cleanup complete

✅ Diagnostic check complete
```