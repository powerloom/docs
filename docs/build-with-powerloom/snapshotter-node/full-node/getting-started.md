---
sidebar_position: 2
---
# Getting Started

Snapshotter (Full Node) has a complex architecture with multiple moving parts. The easiest way to get started is by using the Docker-based setup, recommended for most users.

:::info
#### You can use Powerloom to build extensive data applications. Our Devnet is live. Read more about Devnet [here](../../devnet/getting-started.md) 
:::

## System Requirements

1. Latest version of `docker` (`>= 20.10.21`) and `docker-compose` (`>= v2.13.0`)

2. At least 4 core CPU, 8GB RAM, and 50GB SSD - make sure to choose the correct spec when deploying to Github Codespaces.

3. IPFS node
    - While we have __included__ a node in our autobuild Docker setup, IPFS daemon can hog __*a lot*__ of resources - it is not recommended to run this on a personal computer unless you have a strong internet connection and dedicated CPU+RAM.
  
    - 3rd party IPFS services that provide default IPFS interface like Infura are now supported.

4. RPC URL for `Ethereum mainnet` or the chain you're working on. 

:::note 
RPC usage can depend on your use case. If your use case is complicated and needs to make a lot of RPC calls, it is recommended to run your own RPC node instead of using third-party RPC services as it can be expensive.

In any case, it is highly recommended to signup with one of these providers to at least track usage even if you aren't on a paid plan: [Alchemy](https://alchemy.com/?r=15ce6db6d0a109d5), [Infura](https://infura.io), [Quicknode](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3491854-f4a458), etc. Please reach out to us if none of the options are viable.
:::


## Running the Node
Whether you are developing your own application or extending our existing use cases, setting up your Snapshotter node is a crucial step. Follow the process outlined below to ensure a smooth setup:

### For Snapshotters (Existing Use Cases)

1. **Cloning the Deploy Repo** - Clone the repository against the respective branch (main by default). Open the terminal and run the below command to clone the deploy repo in a directory named `powerloom_deploy`. 
    ```bash
    git clone https://github.com/powerloom/deploy.git --single-branch powerloom_deploy --branch main && cd powerloom_deploy
    ```

2. **Configuring The Node** - Copy `env.example` to `.env`.
   - Ensure the following required variables are filled:
     - `SOURCE_RPC_URL`: The URL for the source RPC (Remote Procedure Call) service.
     - `SIGNER_ACCOUNT_ADDRESS`: The address of the signer account.
     - `SIGNER_ACCOUNT_PRIVATE_KEY`: The private key corresponding to the signer account address.
   - Optionally, you may also set the following variables:
     - `PROST_RPC_URL`: The URL for the PROST RPC service.
     - `IPFS_URL`: The URL for the IPFS (InterPlanetary File System) service in HTTP(s) (e.g. `https://ipfs.infura.io:5001`) multiaddr format (e.g. `/dns4/ipfs.infura.io/tcp/5001/https`)
     - `IPFS_API_KEY`: The API key for the IPFS service (if required).
     - `IPFS_API_SECRET`: The API secret for the IPFS service (if required).
     - `PROTOCOL_STATE_CONTRACT`: The contract address for the protocol state.
     - `RELAYER_HOST`: The host address for the relayer.
     - `SLACK_REPORTING_URL`: The URL for reporting to Slack.
     - `POWERLOOM_REPORTING_URL`: The URL for reporting to Powerloom.
     - `WEB3_STORAGE_TOKEN`: The token for Web3.Storage. You can generate or retrieve this token from your [API tokens page](https://web3.storage/tokens/?create=true) after signing up for a free plan at web3.storage.

3. **Running the Node** - Run  `./build.sh` (ideally in a `screen`) to start the Snapshotter Node

   

### For Developers (New Use Cases)
Extending existing use cases or building your own use cases requires a slightly different setup. Follow the process outlined below to ensure a smooth setup:


1. **Forking the Computes and Config templates** - For an optimized development process, it's recommended to fork the templates for [snapshotter-computes](https://github.com/powerloom/snapshotter-computes) and [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/). Our system utilizes the Git submodule architecture to manage these components efficiently. For a deeper understanding of how these elements integrate and function within our larger system, please refer to our [architecture documentation](../architecture.md). This approach ensures a streamlined and cohesive development workflow.

   - Snapshotter Configs: https://github.com/powerloom/snapshotter-configs
   - Snapshotter Computes: https://github.com/powerloom/snapshotter-computes

   Once the above branches are forked, you should have the above two repositories in your profile. 

2. **Cloning the Deploy Repo** - Clone the repository against the testnet branch. Open the terminal and run the below command to clone the deploy repo in a directory named `powerloom_deploy`. 

    ```bash
    git clone https://github.com/powerloom/deploy.git --single-branch powerloom_deploy --branch better_dev_workflow && cd powerloom_deploy
    ```
3. **Configuring The Node** - When you are in the deploy repo's directory, create a new file `.env`.

    Copy `env.example` to `.env`.

    - Ensure the following required variables are filled:

    - `SOURCE_RPC_URL`: The URL for the Ethereum RPC (Local node/Infura/Alchemy) service.
    - `SIGNER_ACCOUNT_ADDRESS`: The address of the signer account. This is your whitelisted address on the protocol. **Using a burner account is highly recommended**
    - `SIGNER_ACCOUNT_PRIVATE_KEY`: The private key corresponding to the signer account address.
    - Configure `SNAPSHOT_CONFIG_REPO` and `SNAPSHOT_CONFIG_REPO_BRANCH` to point to your forked snapshotter-configs repository.
    - Configure `SNAPSHOTTER_COMPUTE_REPO` and `SNAPSHOTTER_COMPUTE_REPO_BRANCH` to point to your forked snapshotter-computes repository.
    - Optionally, you may also set the following variables:
        - `PROST_RPC_URL`: The URL for the PROST RPC service.
        - `PROTOCOL_STATE_CONTRACT`: The contract address for the protocol state.
        - `RELAYER_HOST`: The host address for the relayer.
        - `NAMESPACE`: The unique key used to identify your project namespace around which all consensus activity takes place.
        - `POWERLOOM_REPORTING_URL`: The URL for reporting to Powerloom.
        - `PROST_CHAIN_ID`: The chain ID for the PROST RPC service.
        - `IPFS_URL`: The URL for the IPFS (InterPlanetary File System) service in HTTP(s) (e.g. `https://ipfs.infura.io:5001`) multiaddr format (e.g. `/dns4/ipfs.infura.io/tcp/5001/https`)
        - `IPFS_API_KEY`: The API key for the IPFS service (if required).
        - `IPFS_API_SECRET`: The API secret for the IPFS service (if required).
        - `SLACK_REPORTING_URL`: The URL for reporting to Slack.
        - `WEB3_STORAGE_TOKEN`: The token for Web3.Storage. You can generate or retrieve this token from your [API tokens page](https://web3.storage/tokens/?create=true) after signing up for a free plan at web3.storage.

4. **Setting up the codebase** - Setup codebase by running `bootstrap.sh` command.
   
   In the terminal, you can run the following command:
   
   ```bash
   ./bootstrap.sh
   ```

   :::note
   This is a one time step and resets the codebase to the latest version of the branch. If you have made any changes to the codebase, make sure to commit them before running this command. You need to run this command only once after cloning the repository.
   :::

- **Running the Node** - Run  `./build.sh` (ideally in a `screen`) to start the Snapshotter Node


## Troubleshooting Errors

If the `.env` is filled up correctly, all services will execute one by one. The logs do fill up quickly. So, remember to [safely detach](https://linuxize.com/post/how-to-use-linux-screen/) from the screen when not using it. If you see the following error, 
    
    powerloom_depoy-pooler-1           | Snapshotter identity check failed on protocol smart contract
    powerloom_depoy-pooler-1 exited with code 1
    
your Snapshotter address is not registered. Make sure you have registered for our [devnet program](https://airtable.com/appr3wKRsn4VoOvpi/pagxxT6QcL0OwGH0e/form) and your burner wallet has been added. 

Refer to our [troubleshooting guide](./troubleshooting.md) if you encounter any other issues with your node.

## Stopping the Node
1. To shutdown services, just press `Ctrl+C` (and again to force).

:::note
If you don't keep services running for extended periods of time, this will affect consensus and we may be forced to deactivate your snapshotter account.
:::

2. If you see issues with data, you can do a clean *reset* by running the following command before restarting step 1:

    `docker-compose --profile ipfs down --volumes`
