---
sidebar_position: 1
---

# Setup and Extension

This section will help you set up a full node to participate in the Powerloom Aave V3 data market and run your personal dashboard. At the end of this guide, you will find instructions on extending the current Aave V3 implementation with additional data points.

## Full Node Setup

:::tip
Prerequisite: Ensure that the minimum requirements are met by the system on which it is to be deployed, which is located under the **System Requirements** section of the [Full Node - Getting Started](/build-with-powerloom/snapshotter-node/full-node/getting-started.md) page.
:::

1. **Cloning the Deploy Repo** - Clone the repository against the `aave` branch. Open the terminal and run the below command to clone the deploy repo in a directory named `powerloom_deploy`. 
    ```bash
    git clone https://github.com/powerloom/deploy.git --single-branch powerloom_deploy --branch aave && cd powerloom_deploy
    ```

2. **Configuring The Node** - Copy `env.example` to `.env`.
- Ensure the following required variables are filled:
     - `SOURCE_RPC_URL`: The URL for the Ethereum RPC (Local node/Infura/Alchemy) service.
     - `SIGNER_ACCOUNT_ADDRESS`: The address of the signer account. This is your whitelisted address on the protocol. **Using a burner account is highly recommended**
     - `SIGNER_ACCOUNT_PRIVATE_KEY`: The private key corresponding to the signer account address.
     - `PROST_RPC_URL`: The URL for the PROST RPC service.
     - `PROTOCOL_STATE_CONTRACT`: The contract address for the protocol state.
     - `RELAYER_HOST`: The host address for the relayer.
     - `NAMESPACE`: The unique key used to identify your project namespace
     - `PROST_CHAIN_ID`: The chain ID for the PROST RPC service.
   - Optionally, you may also set the following variables:
     around which all consensus activity takes place.
     - `POWERLOOM_REPORTING_URL`: The URL for reporting to Powerloom.
     - `IPFS_URL`: The URL for the IPFS (InterPlanetary File System) service in HTTP(s) (e.g. `https://ipfs.infura.io:5001`) multiaddr format (e.g. `/dns/ipfs.infura.io/tcp/5001/https`)
     - `IPFS_API_KEY`: The API key for the IPFS service (if required).
     - `IPFS_API_SECRET`: The API secret for the IPFS service (if required).
     - `SLACK_REPORTING_URL`: The URL for reporting to Slack.
     - `WEB3_STORAGE_TOKEN`: The token for Web3.Storage. You can generate or retrieve this token from your [API tokens page](https://web3.storage/tokens/?create=true) after signing up for a free plan at web3.storage.

3. **Running The Node**
- Run the following command (ideally in a `screen`) and follow the instructions.
    ```bash
    ./build.sh
    ```

4. **Displaying the Dashboard**
- Once all of the services are up and running, the front-end can be accessed via [Pooler Frontend](https://github.com/powerloom/pooler-frontend/tree/aave) to see an Aave V3 summary data dashboard similar to the [Powerloom Aave V3 Dasboard](https://aave-v3.powerloom.io/).
    - The front-end does not come packaged as part of the Aave deploy repository and will need to be run separately. The Front-end deployment instructions can be found [here](https://github.com/powerloom/pooler-frontend/tree/aave?tab=readme-ov-file#powerloom-pooler-product).
    - The dashboard's `Synced by` section displays the time of the last snapshot taken, indicating if your snapshotting is falling behind.

## Extending the Aave V3 Implementation

:::tip
This section will utilize core concepts explained in the [Closer Look at Snapshots](/build-with-powerloom/use-cases/existing-implementations/uniswap-dashboard/closer-look-at-snapshots) section. It is strongly recommended that you review this page before extending the Aave use case.
:::

### Development Node Setup

1. **Forking the Computes and Config templates** - For an optimized development process, it's recommended to fork the templates [snapshotter-computes](https://github.com/powerloom/snapshotter-computes/tree/aave) and [snapshotter-configs](https://github.com/powerloom/snapshotter-configs/tree/aave). Our system utilizes the Git submodule architecture to manage these components efficiently. For a deeper understanding of how these elements integrate and function within our larger system, please refer to our [architecture documentation](/build-with-powerloom/snapshotter-node/architecture.md). This approach ensures a streamlined and cohesive development workflow.

   - Aave V3 Snapshotter Configs: https://github.com/powerloom/snapshotter-computes/tree/aave
   - Aave V3 Snapshotter Computes: https://github.com/powerloom/snapshotter-configs/tree/aave

   Once the above branches are forked, you should have the two repositories in your profile. 

2. **Deploy the Development Node** - Detailed instructions for configuring the Aave V3 use case for development can be found in the [Powerloom Deploy](https://github.com/powerloom/deploy/tree/aave?tab=readme-ov-file#instructions-for-code-contributors) GitHub repository.

    - Ensure that the correct Config and Computes submodules are provided in the `SNAPSHOT_CONFIG_REPO` and `SNAPSHOTTER_COMPUTE_REPO` entries in the `.env` file. These must be changed if you have chosen to fork the submodule repositories as they are set to the Powerloom URLs by default. Additionally, ensure the correct branch names are provided in `SNAPSHOT_CONFIG_REPO_BRANCH` and `SNAPSHOTTER_COMPUTE_REPO_BRANCH` entries if they have been changed.

3. **Run the Node** - It is recommended to run the full node before any extensions are made to ensure the setup is done properly.
    ```bash
    ./build-dev.sh
    ```
    
### Preloaders

Most on-chain data used by the current Aave V3 use case is retrieved using [Preloaders](docs/Protocol/Specifications/Snapshotter/preloading.md). These processors run before the base snapshots and are computed to reduce redundant queries on the Aave Smart Contracts. The Aave protocol stores data for *all* assets in their Smart Contracts, so preloaders are particularly useful when gathering data for this use case. Any base snapshot extension of the current implementation may find that the required on-chain data has already been gathered by a preloader. See the [Snapshot Generation](/Protocol/Specifications/Snapshotter/snapshot-build.md) page for more information on "how base snapshots are built".

There are two important preloaders to be aware of:

1. **Bulk Asset Data Preloader**
```python reference
https://github.com/powerloom/snapshotter-computes/blob/aave/utils/preloaders/asset_data/preloader.py#L10-L34
```

2. **Bulk Events Preloader**
```python reference
https://github.com/powerloom/snapshotter-computes/blob/aave/utils/preloaders/volume_events/preloader.py#L9-L33
```

Both of these preloaders retrieve on-chain data and then store it locally in Redis for [later use](https://github.com/powerloom/snapshotter-computes/blob/aave/utils/core.py#L93-L121) by the base snapshot processors' `compute` functions. The data models describing the data gathered by the `BulkAssetDataPreloader` can be found [here](https://github.com/powerloom/snapshotter-computes/blob/aave/utils/models/data_models.py#L9-L45). The list of event emissions gathered by the `BulkVolumeEventsPreloader` can be found [here](https://github.com/powerloom/snapshotter-computes/blob/aave/utils/models/data_models.py#L9-L45).

Visit the [Data Points](/build-with-powerloom/use-cases/existing-implementations/aavev3-dashboard/data-points.md) section for a complete list of currently available base snapshots. 

### Adding an Aggregate Snapshot

For this example, we will add a 6-hour volume-by-action aggregate using the 24-hour volume aggregate as a reference. The data for the 24-hour volume aggregate is already retrieved by the `BulkVolumeEventsPreloader` and processed using the `AggregateSupplyVolumeProcessor` as seen in this [compute](https://github.com/powerloom/snapshotter-computes/blob/aave/aggregate/single_aave_volume_24h.py#L108).

1. **Create the Aggregation Worker Processor**:

    In the `aggregate/` directory of your forked `snapshotter-computes` repository, create a Python file containing your new processor.
    - Name the file something like `single_aave_volume_6h.py`
    - For now, this will be used as a placeholder and filled in with the processor's logic in later steps.
    - Visit the Aggregate Snapshots section of the [Snapshot Generation](/Protocol/Specifications/Snapshotter/snapshot-build.md) page for more information on Aggregate Processors

2. **Configure Aggregation Worker**:

   In the `aggregator.json` file of your forked `snapshotter-configs` repository, add a new entry for your aggregation worker class. This class will be responsible for handling the new data aggregation task.
   - Define the `project_type` as something like `single_aave_volume_6h`.
   - Set `aggregate_on` to `SingleProject` since we will extend the current SingleProject 24-hour implementation.
   - Under `processor`, specify the module and class name of your new processor created in Step 1.

    ```json 
    {
    "config": [
        // ... existing configurations ...
        {
        "project_type": "single_aave_volume_6h",
        "aggregate_on": "SingleProject",
        "processor": {
            "module": "snapshotter.modules.computes.aggregate.single_aave_volume_6h",
            "class_name": "AggregateSupplyVolumeProcessor"
        }
        }
        // ... additional configurations ...
    ]
    }
    ```

3. **Modify the Processor Logic**:

    Modify the data collection logic to concentrate on a 6-hour time span (`epochId`). Refer to the existing 24-hour aggregation example for guidance on structuring your logic. The 24-hour aggregate currently collects data for all core Aave V3 "actions" that can be taken on-chain. You may continue to collect data for all action's events, or you may choose to focus on a single action. Keep in mind that you will need to create a new data model in the `utils/message_models.py` file in your `snapshotter-computes` fork if you choose to change the snapshot data. See the [`AaveVolumeAggregateSnapshot`](https://github.com/powerloom/snapshotter-computes/blob/aave/utils/models/message_models.py#L101-L107) for reference.

4. **Testing and Validation**:

   After implementation, rigorously test your new feature to ensure accuracy and efficiency. Validate that the data collected aligns with your intended 6-hour aggregation of each asset's volume-by-action.

5. **Commit and Share Your Work**:

   Once your implementation is complete and tested, commit your changes to your implementation branch. Share your work with the community by creating a pull request to the `aave` Computes repository, if desired.

