---
sidebar_position: 2
title: Snapshotter CLI
---

# Powerloom Snapshotter CLI

The Powerloom Snapshotter CLI (`powerloom-snapshotter-cli`) is a command-line tool that simplifies the process of configuring, deploying, and managing multiple snapshotter instances across different chains and data markets.

:::tip
The CLI is specifically designed to manage multiple snapshotter instances and replaces the legacy manual setup. It is also perfect for running single snapshotter instances and can safely replace the [single node setup](/build-with-powerloom/snapshotter-node/lite-node-v2/getting-started).
:::

## 📖 Overview

### ✨ Key Features

- 🚀 **Easy Configuration**: Set up credentials and settings for different chain/market combinations
- 📦 **Multi-Instance Management**: Deploy and manage multiple snapshotter instances
- 🔍 **Instance Monitoring**: View status, logs, and diagnostics for running instances
- 🐚 **Interactive Shell**: Fast command execution with history support
- 🔐 **Secure Credential Storage**: Namespaced environment files for different configurations
- 🏗️ **Identity Management**: Generate and manage signer identities

### 🔄 Command Aliases

The CLI provides multiple command aliases for convenience:
- `powerloom-snapshotter-cli` - Full command name
- `snapshotter` - Short alias

Both commands are equivalent and can be used interchangeably throughout this documentation.

## 🛠️ Installation {#installation}

### 📦 Using Pre-built Binaries (Recommended)

1. Download the latest binary for your platform from the [releases page](https://github.com/powerloom/snapshotter-lite-multi-setup/releases):
   - Linux x86_64: `powerloom-snapshotter-cli-linux-amd64`
   - Linux ARM64: `powerloom-snapshotter-cli-linux-arm64`
   - macOS ARM64 (Apple Silicon): `powerloom-snapshotter-cli-macos-arm64`

2. Make the binary executable:
   ```bash
   chmod +x powerloom-snapshotter-cli-*
   ```

3. Move to a directory in your PATH:
   ```bash
   # Use the full name
   sudo mv powerloom-snapshotter-cli-* /usr/local/bin/powerloom-snapshotter-cli

   # Or use a shorter alias for convenience
   sudo mv powerloom-snapshotter-cli-* /usr/local/bin/snapshotter
   ```

### 📥 From PyPI Package

```bash
# Install using uv (recommended)
uv tool install powerloom-snapshotter-cli

# Or install using pipx
pipx install powerloom-snapshotter-cli
```

## 🚀 Quick Start

### 🪄 Interactive Shell Mode (Recommended)

The CLI has a startup time when running individual commands. We strongly recommend using the **interactive shell mode** for a much faster and smoother experience:

```bash
# Start the interactive shell
powerloom-snapshotter-cli shell

# Now run commands instantly without delays:
powerloom-snapshotter> list
powerloom-snapshotter> configure
powerloom-snapshotter> deploy
powerloom-snapshotter> status
```

:::tip Why Use Shell Mode?
- ⚡ **Instant command execution** - No startup delay between commands
- 📝 **Command history** - Use arrow keys to navigate previous commands
- 🔄 **Persistent session** - Maintains context between commands
- 🎯 **Better workflow** - Run multiple operations smoothly
:::

### ⌨️ Alternative: Individual Commands

If you prefer to run individual commands:

```bash
# Configure credentials
powerloom-snapshotter-cli configure --env mainnet --market BDS_MAINNET_UNISWAPV3

# Deploy snapshotter instances
powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3

# Check status
powerloom-snapshotter-cli status

```

### 🔍 Example Workflow

Here's a typical workflow for setting up a snapshotter node using the interactive shell:

```bash
# Start the interactive shell
powerloom-snapshotter-cli shell

# Show all available data markets and protocol chains
powerloom-snapshotter> list

# In the shell, configure credentials (interactive prompts will guide you)
powerloom-snapshotter> configure

# Deploy your snapshotter instances
powerloom-snapshotter> deploy

# Show status of deployed snapshotter instances (screen sessions and Docker containers). Optionally filter by environment and/or data market.
powerloom-snapshotter> status

# Exit when done
powerloom-snapshotter> exit
```

## 💻 Core Commands

### 📋 Show all available data markets and protocol chains

**Shell mode:**
```bash
powerloom-snapshotter> list
```

**Command line mode:**
```bash
powerloom-snapshotter-cli list
```

### ⚙️ Configure credentials for deployments

Set up credentials and settings for a specific chain and data market combination.

**Shell mode:**
```bash
# Interactive configuration (prompts for all values)
powerloom-snapshotter> configure
```

**Command line mode:**
```bash
# Interactive configuration
powerloom-snapshotter-cli configure

# With all options specified
powerloom-snapshotter-cli configure --env mainnet --market BDS_MAINNET_UNISWAPV3 --wallet 0x123...
```

**Options:**
- `--env, -e`: Powerloom chain name (for BDS Mainnet, use `mainnet`)
- `--market, -m`: Data market name (for BDS Mainnet, use `BDS_MAINNET_UNISWAPV3`)
- `--wallet, -w`: Wallet address holding the slots
- `--signer, -s`: Signer account address
- `--signer-key, -k`: Signer account private key
- `--source-rpc, -r`: Source chain RPC URL
- `--powerloom-rpc, -p`: Powerloom RPC URL

### 🚀 Deploy snapshotter nodes

Deploy snapshotter nodes for specified environment and data markets.

**Shell mode:**
```bash
# Interactive deployment (prompts for environment and market)
powerloom-snapshotter> deploy
```

**Command line mode:**
```bash
# Deploy all slots for a market
powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3

# Deploy specific slots
powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3 --slot 123 --slot 456

# Deploy BDS Mainnet
powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3
```

### 📊 Show deployment status

Show status of deployed snapshotter instances (screen sessions and Docker containers). Optionally filter by environment and/or data market.

**Shell mode:**
```bash
powerloom-snapshotter> status
```

**Command line mode:**
```bash
powerloom-snapshotter-cli status
```

Output shows:
- Instance name
- Status (Active/Inactive)
- Docker container status
- Process details


### 🔧 Diagnose and cleanup

Run diagnostics on the system and check requirements.

**Shell mode:**
```bash
# Run diagnostics
powerloom-snapshotter> diagnose
```

**Command line mode:**
```bash
# Run diagnostics
powerloom-snapshotter-cli diagnose

# Clean up existing deployments
powerloom-snapshotter-cli diagnose --clean --force
```

Checks include:
- Python version
- System resources (CPU, memory, disk)
- Docker installation and status
- Network connectivity
- Required port availability

### 🔑 Manage credentials

Manage signer identities and other credentials configured against a specific environment and data market.

**Shell mode:**
```bash
# Show summary of all available identities
powerloom-snapshotter> identity list

# Show details of a specific identity
powerloom-snapshotter> identity show --env mainnet --market BDS_MAINNET_UNISWAPV3
```

**Command line mode:**
```bash
# Show summary of all available identities
powerloom-snapshotter-cli identity list

# Show details of a specific identity
powerloom-snapshotter-cli identity show --env mainnet --market BDS_MAINNET_UNISWAPV3
```

## 📝 Credentials Management: Internals

### 📁 Configuration Files

Configuration files are stored in `~/.powerloom-snapshotter-cli/envs/` with the naming convention:
```
.env.{chain}.{market}.{source_chain}
```

Example: `.env.mainnet.bds_mainnet_uniswapv3.eth_mainnet`

### 🔐 Environment Variables

Each configuration file contains:
- `WALLET_HOLDER_ADDRESS`: Address holding slot NFTs
- `SIGNER_ACCOUNT_ADDRESS`: Address used for signing snapshots
- `SIGNER_ACCOUNT_PRIVATE_KEY`: Private key for signer account
- `SOURCE_RPC_URL`: RPC endpoint for source blockchain
- `POWERLOOM_RPC_URL`: Powerloom protocol RPC endpoint


### 📊 Comparison with Manual Setup

| Feature | Manual Setup | CLI |
|---------|-------------|-----|
| Multiple slots | Requires multiple repositories | Single command deployment |
| Configuration | Manual `.env` file editing | Interactive configuration |
| Monitoring | Check each instance separately | Unified `list` command |
| Updates | Update each repository | Single CLI update |

## ❓ Troubleshooting

### 🐛 Common Issues

#### "Docker daemon is not running"
Start Docker Desktop or the Docker service:
```bash
# Linux
sudo systemctl start docker
```

#### "No slots found for wallet"
Verify that:
- The wallet address owns slots on the specified chain
- You're using the correct chain (devnet vs mainnet)
- The RPC URL is accessible

#### "Screen session already exists"
Clean up existing sessions:
```bash
powerloom-snapshotter-cli diagnose --clean --force
```

## 🔄 Migration from Manual Setup

If you're currently running snapshotter nodes manually, here's how to migrate to the CLI:

1. **Stop and cleanup existing nodes**:
   ```bash
   powerloom-snapshotter-cli diagnose --clean --force
   ```

2. **Install the CLI** (see [Installation section](#installation) above)

3. **Configure using the CLI**:
   ```bash
   powerloom-snapshotter-cli configure --env mainnet --market BDS_MAINNET_UNISWAPV3
   ```

4. **Deploy using the CLI**:
   ```bash
   powerloom-snapshotter-cli deploy --env mainnet --market BDS_MAINNET_UNISWAPV3
   ```

The CLI will handle all your slots automatically and provide better management capabilities.

## 🔗 Additional Resources

- [GitHub Repository: Dive into the technical details, file issues, and contribute](https://github.com/powerloom/snapshotter-lite-multi-setup)
- [DSV Mainnet Snapshotter Lite V2 Setup](/build-with-powerloom/snapshotter-node/lite-node-v2/getting-started)
- [Monitoring and Troubleshooting](/build-with-powerloom/snapshotter-node/lite-node-v2/monitoring)
- [Discord Support: Join our community and get help](https://discord.gg/powerloom)