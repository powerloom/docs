---
sidebar_position: 0
---

# System Design

![Snapshotter Components](/images/snapshotter-node-system-design.png)

## System Event Detector

The System Event Detector tracks events triggered on the protocol state contract running on the anchor chain and forwards them to a callback queue with the appropriate routing key, depending on the event signature and type, among other information.

## Process Hub Core

The Process Hub Core, defined in [`process_hub_core.py`](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/process_hub_core.py), serves as the primary process manager in the snapshotter.
- Operated by the CLI tool [`processhub_cmd.py`](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/processhub_cmd.py), it is responsible for starting and managing the `SystemEventDetector` and `ProcessorDistributor` processes.
- Additionally, it spawns the base snapshot and aggregator workers required for processing tasks from the `powerloom-backend-callback` queue. The number of workers and their configuration path can be adjusted in [`config/settings.json`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/settings.example.json).

## Processor Distributor
The Processor Distributor, defined in [`processor_distributor.py`](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/processor_distributor.py), is initiated using the `processhub_cmd.py` CLI.
- It loads the preloader, base snapshotting, and aggregator config information from the settings file.
- It reads the events forwarded by the event detector to the `f'powerloom-event-detector:{settings.namespace}:{settings.instance_id}'` RabbitMQ queue bound to a topic exchange as configured in `settings.rabbitmq.setup.event_detector.exchange`([code-ref: RabbitMQ exchanges and queue setup in pooler](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/init_rabbitmq.py)).
- It creates and distributes processing messages based on the preloader configuration present in `config/preloader.json`, the project configuration present in [`config/projects.json`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/projects.example.json), and [`config/aggregator.json`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/aggregator.example.json).
  - For [`EpochReleased` events](/Protocol/Specifications/Epoch#1-epoch_released), it forwards such messages to base snapshot builders for data source contracts as configured in `config/projects.json` for the current epoch information contained in the event.

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/processor_distributor.py#L1077-L1115
```


## Delegation Workers for Preloaders

![Delegation Worker Dependent Preloading Architecture](/images/delegate_preloading.png)

Preloaders often fetch and cache large volumes of data, such as all the transaction receipts for a block on the data source blockchain. In such cases, a single worker is often insufficient to feasibly fetch the data for timely base snapshot generation and subsequent aggregate snapshot generations to reach a consensus.

To address this, workers are defined as `delegate_tasks` in [`config/preloader.json`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/preloader.json). The [Process Hub Core](#process-hub-core) then launches a specific number of workers, as defined in the primary settings file, [`config/settings.json`](https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/settings.example.json), under the key `callback_worker_config.num_delegate_workers`.


```python reference
https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/preloader.json#L19-L25
```

```python reference
https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/settings.example.json#L86-L90
```

Delegation workers operate over a simple request-response queue architecture over RabbitMQ.

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/init_rabbitmq.py#L243-L254
```

One of the preloaders bundled with this snapshotter peer is tasked with fetching all the transaction receipts within a given epoch's block range and because of the volume of data to be fetched it delegates this work to a bunch of delegation worker

* The Preloader: [snapshotter/utils/preloaders/tx_receipts/preloader.py](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/preloaders/tx_receipts/preloader.py).
* The Delegation Workers: [snapshotter/utils/preloaders/tx_receipts/delegated_worker/tx_receipts.py](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/preloaders/tx_receipts/delegated_worker/tx_receipts.py)

As a common functionality shared by all preloaders that utilize delegate workers, this logic is present in the generic class `DelegatorPreloaderAsyncWorker` that all such preloaders inherit. Here you can observe the workload is sent to the delegation workers

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/generic_delegator_preloader.py#L191-L210
```

Upon sending out the workloads tagged by unique request IDs, the delegator sets up a temporary exclusive queue to which only the delegation workers meant for the task type push their responses.

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/generic_delegator_preloader.py#L159-L186
```

The corresponding response being pushed by the delegation workers can be found here in the generic class `DelegateAsyncWorker` that all such workers should inherit from:

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/delegate_worker.py#L74-L84
```

## Callback Workers

The callback workers are the ones that build the base snapshot and aggregation snapshots and as explained above, are launched by the [process hub core](#process-hub-core) according to the configurations in `aggregator/projects.json` and `config/aggregator.json`.

They listen to new messages on the RabbitMQ topic exchange as described in the following configuration, and the topic queue's initialization is as follows.

```python reference
https://github.com/powerloom/snapshotter-configs/blob/fcf9b852bac9694258d7afcd8beeaa4cf961c65f/settings.example.json#L33-L55
```

```python reference
https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/init_rabbitmq.py#L182-L213
```

Upon receiving a message from the processor distributor after preloading is complete, the workers do most of the heavy lifting along with some sanity checks and then call the `compute()` callback function on the project's configured snapshot worker class to transform the dependent data points as cached by the preloaders to finally generate the base snapshots.

:::info
[Snapshot generation specification](/Protocol/Specifications/Snapshotter/snapshot-build)
:::

## RPC Helper

Extracting data from the blockchain state and generating the snapshot can be a complex task. The `RpcHelper`, defined in [`utils/rpc.py`](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/utils/rpc.py), has a bunch of helper functions to make this process easier. It handles all the `retry` and `caching` logic so that developers can focus on efficiently building their use cases.


## Core API

This component is one of the most important and allows you to access the finalized protocol state on the smart contract running on the anchor chain. Find it in [`core_api.py`](https://github.com/powerloom/pooler/blob/634610801a7fcbd8d863f2e72a04aa8204d27d03/snapshotter/core_api.py).

In the end,

* It provides a reliable gateway to the datasets finalized on the protocol state for a data market
  * It abstracts away the parts that deal with varying interaces and APIs of 
    * decentralized storage protcols like IPFS, Filecoin 
    * other value added providers like Web3 Storage on such layers
* It maintains a cache as well for redundancy and availability of the data sets

Its API endpoints are used by a decoupled frontend adapter logic that ultimately support building of rich data products for smart contracts and other web3 based applications. 

In the [`All about Data` section](/build-with-powerloom/snapshotter-node/data), learn how resolver APIs serve finalized data while preserving verification metadata for applications and agents.