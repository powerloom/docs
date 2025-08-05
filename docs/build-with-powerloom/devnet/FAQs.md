### What is Devnet?
Devnet is a network for developers to build and test blockchain apps. It provides a sandbox environment for experimenting with ideas like data dashboards. You can create your own snapshotting logic, write the data application, and use these snapshots without needing consensus from other nodes. The devnet runs on its own dedicated Powerloom chain, eliminating the need for external testnet tokens.

### Why do I need to mint a Devnet Slot?
Minting a Devnet slot reserves your space on the Devnet and gives you a Slot ID, which is required for setting up your Snapshotter Node. The minting process is done at https://devnet-mint.powerloom.dev.
    
### Are there any costs associated with minting the devnet slot?
No, minting a devnet slot is free. The devnet uses the Powerloom devnet chain, and you can get free tokens from the faucet at https://devnet-faucet.powerloom.dev if needed.
    
### Where can I mint the Devnet slot?
To mint a Devnet slot, visit https://devnet-mint.powerloom.dev, connect your wallet, and follow the instructions to mint your slot. No testnet ETH required - it's free on the Powerloom devnet chain!
    
### What is a Snapshotter node?

Snapshotter peers are participants in the Powerloom network who run Snapshotter Nodes which capture and verify data snapshots at predetermined intervals or epochs.
    
### How do you check the Slot ID of your minted devnet slot?
You can locate your Slot ID by visiting the dashboard at https://devnet-mint.powerloom.dev. This same dashboard also serves as your snapshotter monitoring interface where you can track your node's performance.
    
### What are the system requirements for running the Snapshotter node?
The node requires at least 4 GB of RAM, a minimum of 2 CPU cores, 40 GB of disk space, and Python 3.11 or higher. Docker is also recommended with specific version requirements.
    
### What versions of Docker and docker-compose are required for the node setup?
The latest version of `docker` (`>= 20.10.21`) and `docker-compose` (`>= v2.13.0`). If your system hasn't installed docker, please follow the guide [here](https://www.baeldung.com/ops/docker-install-windows-linux-mac).
    
### How do I configure the .env file for my Snapshotter node?
To configure the environment variables, follow these steps:
  1. Copy env.example to .env by running `cp env.example .env`
  2. Fill in the required variables in .env `SOURCE_RPC_URL`, `SIGNER_ACCOUNT_ADDRESS`, `SIGNER_ACCOUNT_PRIVATE_KEY`, `SLOT_ID`, `PROTOCOL_STATE_CONTRACT`.

### Where can I find documentation on Snapshotter Configs and Computes?
You can find the documentation for Snapshotter Configs and Computes in the [docs](/build-with-powerloom/snapshotter-node/architecture/#configuration-files). The pooler computes and config files for the Uniswap V2 use case are found in [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/tree/eth_uniswapv2) and [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/tree/eth_uniswapv2).
    
### What is RPC? 
In blockchain, RPC (Remote Procedure Calls) nodes allow users and apps to interact with the blockchain without network details. The `RPCHelper` in `utils/rpc.py` simplifies snapshot generation & data extraction from the blockchain state.

### What RPC services are recommended for use?
You can use any Ethereum Mainnet RPC provider, such as Infura, Alchemy, or Quicknode. Remember that your choice may depend on your specific use case and RPC usage requirements.
    
### What types of OS can I use to run the Snapshotter node?
You can use the macOS, Linux, or Windows to run the Snapshotter node. For more details on setting up and running the node, visit [here](/build-with-powerloom/devnet/getting-started).
    
### What is a burner wallet and how do you generate one? 
A burner/disposable wallet is a type of cryptocurrency wallet that is designed for temporary use. Burner wallets are often used for small transactions or events where security and long-term storage are not priorities.

:::tip 
**Note:** Do not use your NFT minting wallet to run the Snapshotter lite node. The safest approach is to generate and assign a burner wallet using tools like [Vanity-ETH](https://vanity-eth.tk/) and [Powerloom Burner Wallet Generator](https://snapshotter-dashboard.powerloom.network/burner)
:::

### What security measures should I consider when creating a burner wallet?
When creating a burner wallet, prioritize security by managing private keys securely, limiting funds stored, performing offline transactions, regularly backing up data, ensuring a secure environment, using trusted sources, considering multi-signature wallets, and staying informed about security practices.
    
### How do I deploy my Snapshotter node once the environment is configured?
After configuring the environment variables, set the powerloom_deploy codebase by running the `bootstrap.sh` command in the terminal. Developers may use different shells, such as bash or zsh.

:::info 
**Note**: This is a one-time step that resets the `powerloom_deploy` codebase to the latest version of the `devnet` branch. After completing this one-time setup, you'll be ready to dive into the codebase and start building amazing data applications!
:::

### What data source chains are supported?
For data collection, we support Ethereum Mainnet. The devnet itself runs on the dedicated Powerloom devnet chain.
    
### What steps should I follow to perform a clean reset of my node?
You can do a clean **reset** by running the following command before restarting.
```markdown
    docker-compose --profile ipfs down --volumes
```
or
```markdown
    docker compose --profile ipfs down --volumes
```
    
### How can I stop the node?
To shut down services, use the keyboard shortcut **`Ctrl + C`** on macOS/Linux or **`Ctrl + Break`** on Windows. Run the provided Docker command before restarting the node setup for a clean reset.
    
### Can we run the setup on different languages?
Yes, you can run the setup in different languages. The Snapshotter node is a complex system with multiple components written in different languages. Pooler is a Python program, while Audit Protocol is coded in Go. Since Pooler and Audit Protocol communicate via RabbitMQ, either component can be ported to different languages, making the Snapshotter node accessible to developers unfamiliar with Python or Go.
    
### What is the purpose of the PROTOCOL_STATE_CONTRACT variable?
This PROTOCOL_STATE_CONTRACT variable specifies the protocol state's contract address. Different protocol state contracts depend on the data source contract's chain and the Epoch size of that chain that developers prefer. 

Currently, there are options for Epoch sizes of 1 and 10, where epoch size 1 is better for real-time use cases, while 10 is more suitable for aggregated dataset use cases like data dashboards, giving developers the flexibility to experiment with different scenarios.

### What is the Relayer Host?
The Relayer Host is the URL for the relayer, a specialized node within the decentralized network, used in the Powerloom Protocol Chain. 
Powerloom operates relayers that handle transactions that submit snapshots to the protocol state contract on behalf of snapshotter nodes. 
This ensures they do not have to spend gas fees to submit snapshots on the Powerloom protocol chain, aka Prost.

### How do I check if my node is running?
To check if your node is running actively, navigate to https://devnet-mint.powerloom.dev. This dashboard shows both your minted slots and real-time node status, allowing you to monitor your snapshotter's performance.
    
### Where can I seek help if I encounter issues not covered in the troubleshooting section?
Refer to the troubleshooting section of the documentation for common solutions or reach out to the Powerloom team on [Discord](https://discord.com/invite/powerloom) for further assistance.
    
### Is there a community forum or Discord channel for Powerloom developers?
Yes, we have a Discord channel for Powerloom developers. Here’s the link, [Powerloom Discord](https://discord.com/invite/powerloom). 
  
### How can I stay updated on new features?
You can follow us on [X(Twitter)](https://x.com/Powerloom) and also join the community on [Discord](https://discord.com/invite/powerloom) to stay updated on new feature releases. 
        
### Are there any additional steps for setting up the node on Windows?
Yes, setting up the node on Windows requires Docker and the Windows Subsystem for Linux (WSL). Follow the provided guide for detailed instructions on setting up WSL and Docker on your Windows system.
