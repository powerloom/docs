---
sidebar_position: 1
---

# Protocol State: V2

:::info
This page documents the Protocol v2 state model. For the live DSV mainnet submission and verification path, see [`On-Chain Submission and Verification`](/dsv-mainnet/onchain-submission-and-verification) and [`Why DSV Exists`](/dsv-mainnet/why-dsv-exists).
:::

## Overview: Smart Contract Architecture

The smart contracts that maintain the state of the protocol V2 interact are arranged as depicted in the diagram that follows.

This architecture is an upgrade from the protocol state of V1 in the following aspects:

### Unified view and interface for all peers

The implementation of the protocol state in V2 introduces a unified view and interface for all peers on the network, with the ability to extend functionality with new features as the protocol evolves.

All the interactions with underlying data markets, their state changes and event emissions are accessible through the implementation of the protocol state core.


### Protocol State Core
* The core of the protocol state is now maintained in a separate contract, managed by an ERC1967Proxy upgradeable proxy
* The upgradable proxy pattern allows for the core state contract to be upgraded without the need to redeploy the proxy and all the dependent contracts
* The upgradable proxy pattern also allows for the core state contract to be upgraded in a controlled manner, with the ability to maintain previous versions of the contract in case a regression is introduced in the new version

#### Functions

##### `initialize(address initialOwner, address _snapshotterState, address _dataMarketFactory)`

Initializes the contract with the owner, snapshotter state, and data market factory addresses.

```solidity
function initialize(
    address initialOwner,
    address _snapshotterState,
    address _dataMarketFactory
) initializer public
```

##### `receive()`

Allows the contract to receive Ether.

```solidity
receive() external payable {}
```

##### `updateDataMarketFactory(address _address)`

Updates the address of the data market factory.

```solidity
function updateDataMarketFactory(address _address) external onlyOwner
```

##### `updateSnapshotterState(address _address)`

Updates the address of the snapshotter state contract.

```solidity
function updateSnapshotterState(address _address) external onlyOwner
```

##### `getSlotRewards(uint256 slotId)`

Retrieves the rewards for a given slot.

```solidity
function getSlotRewards(uint256 slotId) public view returns (uint256 rewards)
```

##### `toggleDataMarket(address dataMarketAddress, bool enabled)`

Toggles the enabled status of a data market.

```solidity
function toggleDataMarket(address dataMarketAddress, bool enabled) public onlyOwner
```

##### `getTotalNodeCount()`

Gets the total count of nodes.

```solidity
function getTotalNodeCount() public view returns(uint256)
```

##### `enabledNodeCount()`

Gets the current count of enabled nodes.

```solidity
function enabledNodeCount() external view returns (uint256)
```

##### `claimRewards(address _user)`

Allows a user to claim their accumulated rewards.

```solidity
function claimRewards(address _user) external
```

##### `emergencyWithdraw()`

Allows the owner to withdraw all funds from the contract in case of emergency.

```solidity
function emergencyWithdraw() public onlyOwner
```

![Protocol V2 Smart Contract Architecture](/images/protocolV2-contract-state-dark.png) 

### Data markets

Data market contracts are now separated from the protocol state core. Their creation is initiated from the protocol state core contract and intermediated by a data market factory contract.

The following features of the protocol state are now maintained in the data market contract since they are specific to their operations and functions:

* Epochs
  * Epoch release and epoch size
  * Epochs in a "day"
* Allowed sequencer identities
* Finalized snapshot CIDs against project IDs
* Submission counts against snapshotter slots
* Submission batches and their attestation consensus by validators

:::info
Read more:
* [State view: Data market contracts](#state-view-data-market-contracts)
* [Sequencer](/Protocol/Protocol_v2/sequencer.md)
* [Validator](/Protocol/Protocol_v2/validator.md)
* [Data market](/Protocol/data-sources.md)
* [Snapshot composition](/Protocol/data-composition.md)
:::

### User Information

```solidity
struct UserInfo {
    uint256 totalRewards;
    uint256 totalClaimed;
    uint256 lastClaimed;
    uint256 lastUpdated;
}
```

### State Variables

* `slotRewards`: Mapping from slot ID to rewards.
* `dataMarketCount`: Total number of data markets created.
* `dataMarketIdToAddress`: Mapping from data market ID to its address.
* `dataMarkets`: Mapping from data market address to its information.
* `userInfo`: Mapping from user address to their reward information.

### Identity management

#### Snapshotters

Snapshotters are assigned nodes on the protocol, and their identities are maintained on a separate `PowerloomNodes` contract. The interface to interact with this contract is maintained in the protocol state core contract as well as the data market contracts.

```solidity
/**
 * @title IPowerloomNodes
 * @dev Interface for the PowerloomNodes contract
 */
interface IPowerloomNodes {
    /**
     * @dev Returns the snapshotter address for a given node
     * @param nodeId The ID of the node
     * @return address of the snapshotter
     */
    function nodeSnapshotterMapping(uint256 nodeId) external view returns (address);

    /**
     * @dev Returns the total number of nodes
     * @return uint256 representing the total snapshotter count
     */
    function getTotalSnapshotterCount() external view returns (uint256);

    /**
     * @dev Checks if an address is a registered snapshotter
     * @param snapshotter Address to check
     * @return bool indicating if the address is a snapshotter
     */
    function allSnapshotters(address snapshotter) external view returns (bool);

    /**
     * @dev Checks if a node is available
     * @param _nodeId The ID of the node to check
     * @return bool indicating if the node is available
     */
    function isNodeAvailable(uint256 _nodeId) external view returns (bool);
}
```

### Comparisons with V1

#### New features
In an upgrade to V1, the protocol state in V2 introduces the following:

* Batched snapshot submissions from sequencer
* Attestation on submission batches from validators

:::info
The upgraded architecture of the protocol state allows for support of feature extensions in existing categories of peers like snapshotters and sequencers, along with introducing new categories of peers like validators, watchers among others.
:::

#### Removed features

* [Method to directly accept submissions from allowed snapshotters](/Protocol/Specifications/state-v1.md#function-submitsnapshotstring-memory-snapshotcid-uint256-epochid-string-memory-projectid-request-calldata-request-bytes-calldata-signature-public)
* Snapshot submissions as content identifiers(CIDs) per epoch
* Occurrence count of their submissions
* Mapping between allowed snapshotter identities and the CIDs they submitted
* Time slot allotted to snapshotter identities: `timeSlotPreference(uint256)`
* Indication of whether a snapshot was received against a slot ID within an epoch ID: `snapshotsReceivedSlot`

#### Inherited, continued features

:::note
Most of the [V1 protocol state](/Protocol/Specifications/state-v1.md) implemented for the different phases of the incentivized testnets and the lite node testnet continues in V2.
:::

* Slot based snapshotter identities (slot IDs)
* Snapshot CIDs per epoch per project with the max occurrence frequency
* Time slots allotted to slot IDs against snapshotter identities

## Deployed contracts

The contract addresses for the V2 protocol state can be found in the `env.example` file for the type of node being deployed. Refer to the specific node's repository for the most up-to-date deployment information.

---

## State transitions

### Snapshot state

```solidity
enum SnapshotStatus {
    PENDING,
    FINALIZED
}
```
The state of a snapshot CID against a project ID is `PENDING` when reported by the sequencer and `FINALIZED` when the same is attested to by the validator.

The `PENDING` state can be considered to be an intermediate, trusted state since it is reported by the sequencer which has no incentive to be a bad actor unless its security is compromised.

---

## State modification: Data market contracts

### Update 'day' size

```solidity
function updateDaySize(uint256 _daySize, address _sender) public onlyProtocolState {
    DAY_SIZE = _daySize;
    epochsInADay = DAY_SIZE / (SOURCE_CHAIN_BLOCK_TIME * EPOCH_SIZE);
}
```

A 'day' for a data market is defined by the `DAY_SIZE` in seconds. The `epochsInADay` is the number of epochs that fit into a day.

### Rewards distribution

#### Toggle rewards distribution

```solidity
function toggleRewards(address _sender) public onlyProtocolState {
    rewardsEnabled = !rewardsEnabled;
}
```

#### Daily snapshot quota

This quota is the number of snapshots that have to be submitted by a snapshotter in a day to be eligible for rewards.

```solidity
function updateDailySnapshotQuota(
    uint256 _dailySnapshotQuota, address _sender
) public onlyProtocolState {
    dailySnapshotQuota = _dailySnapshotQuota;
}
```

#### Update Reward Pool Size

```solidity
function updateRewardPoolSize(
    uint256 newRewardPoolSize, address _sender
) public onlyProtocolState {
    rewardPoolSize = newRewardPoolSize;
}
```

#### Commit submission counts

The sequencer commits the submission counts for a day against the slot IDs of the snapshotters. It is planned to be decentralized in the future by combining the election of sequencers and reports on submitted counts peers called 'watchers'.

```solidity
function updateRewards(uint256 slotId, uint256 submissions, uint256 day, address _sender) public onlyProtocolState returns (bool) {
```

:::note
Many functions in `PowerloomDataMarket` are called internally by `PowerloomProtocolState`. When called via `PowerloomProtocolState`, the `msg.sender` of the `PowerloomProtocolState` call is passed as the `_sender` parameter to the `PowerloomDataMarket` function.
:::

Refer: [day size for a data market](#update-day-size)

#### Update Eligible Nodes for Day

```solidity
function updateEligibleNodesForDay(uint256 day, uint256 eligibleNodes, address _sender) public onlyProtocolState {
```

### Epochs

#### Epoch release

```solidity
function releaseEpoch(
    uint256 begin,
    uint256 end,
    address _sender
) public isActive onlyProtocolState returns (bool, bool) {
```

Refer: [Epoch manager](/Protocol/Specifications/Epoch.md)

#### Skip epochs

```solidity
function forceSkipEpoch(
    uint256 begin,
    uint256 end,
    address _sender
) public onlyOwnerOrigin isActive {
```

This is a fallback mechanism to skip epochs in case the epoch release service fails.

### Snapshot submission in batches by [sequencer](/Protocol/Protocol_v2/sequencer.md)

```solidity
function submitSubmissionBatch(
        string memory batchCid,
        uint256 epochId,
        string[] memory projectIds,
        string[] memory snapshotCids,
        bytes32 finalizedCidsRootHash,
        address _sender
    ) public onlyProtocolState
```

An epoch as identified by `epochId` can contain multiple batches of snapshot submissions from the sequencer, as referenced by the `batchCid`.

The entire contents of this batch are made available on IPFS on the CID `batchCid`.

The elements of the arrays `projectIds` and `snapshotCids` are present as a 1:1 mapping that the sequencer reports as finalized CID against each of the project IDs.

:::note
* The `projectIds` and `snapshotCids` arrays are expected to be of the same length.
* In the next upgrade, the `projectIds` and `snapshotCids` arrays will be removed. The `finalizedCidsRootHash`, that is the root hash of the merkle tree built from the CIDs of the projects, holds appropriate information to be used in the consensus rule for attestation as well as verification of the batch CID uploaded to IPFS and anchored to the protocol state by this function call.
:::

### Indicating end of batch submissions for an epoch

```solidity
function endBatchSubmissions(uint256 epochId, address _sender) external {
```

### Attestation against submission batches by [validator](/Protocol/Protocol_v2/validator.md)

```solidity
function submitBatchAttestation(
        string memory batchCid,
        uint256 epochId,
        bytes32 finalizedCidsRootHash,
        address _sender
    ) public onlyProtocolState
```

Validators submit their attestations against batches of snapshot submissions in an `epochId` by refererring to their `batchCid`.

The attestation is the `finalizedCidsRootHash` which is the hash of the merkle tree root constructed from the finalized CIDs across the projects contained in a batch.

### Finalization against attestation consensus

`shouldFinalizeBatchAttestation()` is used as the state check whether the consensus rule around attestations submitted by the network of validators is satisfied, followed by a call to `finalizeSnapshotBatch()` that finalizes the snapshot CIDs against the project IDs contained in a `batchCid` for an `epochId`.

```solidity
function shouldFinalizeBatchAttestation(
    string memory batchCid,
    uint256 currentAttestationCount
) private view returns (bool) {
```

```solidity
function finalizeSnapshotBatch(string memory batchCid, uint256 epochId) private
```

### Triggering attestation consensus externally

```solidity
function forceCompleteConsensusAttestations(
  string memory batchCid, 
  uint256 epochId,
  address _sender
) public onlyProtocolState returns (bool TRIGGER_BATCH_RESUBMISSION, bool BATCH_FINALIZED) {
```

---

## State view: Data market contracts

### Epoch size

```solidity
uint8 public EPOCH_SIZE; // Number of Blocks in each Epoch
```

Refer: [Epoch](/Protocol/Specifications/Epoch.md)
### Data source chain properties

These properties are specific to the chain on which the actual data sources i.e. smart contracts and applications are running.

```solidity
uint256 public SOURCE_CHAIN_ID;
uint256 public SOURCE_CHAIN_BLOCK_TIME; // Block time in seconds * 1e4 (to allow decimals)
```

### Consensus properties

```solidity
uint256 public batchSubmissionWindow // Number of blocks to wait before finalizing batch
uint256 public attestationSubmissionWindow // Number of blocks to wait for attestation acceptance
uint256 public minAttestationsForConsensus // Minimum number of attestations for consensus
```

### Status and CIDs of snapshots

* The snapshot CID reported to have reached consensus against a `projectId` for an `epochId`. The `ConsensusStatus` wraps the [`SnapshotStatus` enum](#snapshot-state).

```solidity
mapping(string projectId => mapping(
  uint256 epochId => ConsensusStatus
)) public snapshotStatus;

function maxSnapshotsCid(
    string memory projectId,
    uint256 epochId
) public view returns (string memory, SnapshotStatus) {
```

* Snapshot CID finalized for a project ID against an epoch ID, as reported by the sequencer.

```solidity
mapping(string projectId => uint256 epochId) public lastSequencerFinalizedSnapshot;
```

* Snapshot CID finalized against an epoch ID for each project ID, once validators attest to the finalization from sequencer as shown above.

```solidity
mapping(string projectId => uint256 epochId) public lastFinalizedSnapshot;
```

* The very first epoch ID against which a finalization was achieved for a project ID.

```solidity
mapping(string projectId => uint256 epochId) public projectFirstEpochId;
```

### `batchCidToProjects`

```solidity
mapping(string batchCid => string[] projectids) public batchCidToProjects;
```

Project IDs contained within a Batch CID.

### `epochIdToBatchCids`

```solidity
mapping(uint256 epochId => string[] batchCids) public epochIdToBatchCids;
```

Batch CIDs of submissions sent out for an epoch by the sequencer.

### Validator attestations

```solidity
mapping(string batchCid => mapping(address => bool)) public attestationsReceived;
mapping(string batchCid => mapping(bytes32 finalizedCidsRootHash=> uint256 count)) public attestationsReceivedCount;
mapping(string batchCid => uint256 count) public maxAttestationsCount;
mapping(string batchCid => bytes32 finalizedCidsRootHash) public maxAttestationFinalizedRootHash;
mapping(string batchCid => bool) public batchCidAttestationStatus;
```

Storing attestations received from validator identities and their counts of attestations against finalized root hashes of merkle trees built from CIDs.

```solidity
mapping(string batchCid => bytes32 finalizedCidsRootHash) public batchCidSequencerAttestation;
mapping(string batchCid => address[] validators) public batchCidDivergentValidators;
```

State of the initial attestation as reported by the sequencer as finalized CIDs against the project IDs and the state of them if they diverge from the consensus on attestations as reached by validators.


### State view: PowerloomNodes contract

#### Structs

##### `LegacyNodeVestingInfo`
```solidity
struct LegacyNodeVestingInfo {
   address owner;
   uint256 initialClaim;
   uint256 tokensAfterInitialClaim;
   uint256 tokensClaimed;
   uint256 lastClaim;
}
```
Information about vesting for legacy nodes.

##### `NodeInfo`
```solidity
struct NodeInfo {
    address snapshotterAddress;
    uint256 nodePrice;
    uint256 amountSentOnL1;
    uint256 mintedOn;
    uint256 burnedOn;
    uint256 lastUpdated;
    bool isLegacy;
    bool claimedTokens;
    bool active;
    bool isKyced;
}
```
Information about a specific node.

#### State Variables

*   `nodePrice`: The price for minting a new node.
*   `nodeCount`: Total number of nodes minted.
*   `enabledNodeCount`: Number of currently active (enabled) nodes.
*   `legacyNodeCount`: Number of legacy nodes configured.
*   `legacyNodeInitialClaimPercentage`: Initial claim percentage for legacy nodes.
*   `legacyNodeCliff`: Cliff period for legacy nodes in days.
*   `legacyNodeValue`: Total value of legacy nodes.
*   `legacyTokensSentOnL1`: Amount of tokens sent on L1 for legacy nodes.
*   `legacyNodeVestingDays`: Vesting period for legacy nodes in days.
*   `legacyNodeVestingStart`: Start time for legacy node vesting.
*   `legacyNodeNonKycedCooldown`: Cooldown period for non-KYCed legacy nodes.
*   `mintStartTime`: The start time for node minting.
*   `snapshotterAddressChangeCooldown`: Cooldown period for changing snapshotter addresses.
*   `snapshotterTokenClaimCooldown`: Cooldown period for snapshotter token claims.
*   `MAX_SUPPLY`: Maximum total supply of nodes.
*   `userTokenIds`: Mapping from user address to their owned node IDs.
*   `snapshotterToNodeIds`: Mapping from snapshotter address to their assigned node IDs.
*   `nodeIdToOwner`: Mapping from node ID to its owner address.
*   `nodeIdToVestingInfo`: Mapping from node ID to its vesting information.
*   `isNodeBurned`: Mapping to check if a node is burned.
*   `burnedUserTokenIds`: Mapping from user address to their burned node IDs.
*   `allSnapshotters`: Mapping to track all registered snapshotters.
*   `lastSnapshotterChange`: Mapping to track the last snapshotter change timestamp for a node.
*   `nodeInfo`: Mapping from node ID to its `NodeInfo` struct.
*   `name`: The name of the token.

#### Functions

##### `initialize(address initialOwner, uint256 initialNodePrice, string memory initialName)`
Initializes the contract with the owner, initial node price, and token name.

```solidity
function initialize(address initialOwner, uint256 initialNodePrice, string memory initialName) initializer public
```

##### `updateAdmins(address[] calldata _admins, bool[] calldata _status)`
Updates the admin status for multiple addresses.

```solidity
function updateAdmins(address[] calldata _admins, bool[] calldata _status) external onlyOwner
```

##### `getAdmins()`
Returns an array of all admin addresses.

```solidity
function getAdmins() public view returns(address[] memory)
```

##### `updateMaxSupply(uint256 _maxSupply)`
Updates the maximum supply of nodes.

```solidity
function updateMaxSupply(uint256 _maxSupply) public onlyOwner
```

##### `setURI(string memory newuri)`
Sets the URI for token metadata.

```solidity
function setURI(string memory newuri) public onlyOwner
```

##### `configureLegacyNodes(...)`
Configures parameters for legacy nodes.

```solidity
function configureLegacyNodes(
        uint256 _legacyNodeCount, 
        uint256 _legacyNodeInitialClaimPercentage, 
        uint256 _legacyNodeCliff, 
        uint256 _legacyNodeValue,
        uint256 _legacyNodeVestingDays,
        uint256 _legacyNodeVestingStart,
        uint256 _legacyTokensSentOnL1,
        uint256 _legacyNodeNonKycedCooldown
    ) public onlyOwner
```

##### `setMintStartTime(uint256 _mintStartTime)`
Sets the start time for node minting.

```solidity
function setMintStartTime(uint256 _mintStartTime) public onlyOwner
```

##### `setSnapshotterAddressChangeCooldown(uint256 _snapshotterAddressChangeCooldown)`
Sets the cooldown period for snapshotter address changes.

```solidity
function setSnapshotterAddressChangeCooldown(uint256 _snapshotterAddressChangeCooldown) public onlyOwner
```

##### `isNodeAvailable(uint256 _nodeId)`
Checks if a node is available (not burned and within the valid node count).

```solidity
function isNodeAvailable(uint256 _nodeId) public view returns (bool)
```

##### `setName(string memory _name)`
Sets the name of the token.

```solidity
function setName(string memory _name) public onlyOwner
```

##### `pause()`
Pauses the contract.

```solidity
function pause() public onlyOwner
```

##### `unpause()`
Unpauses the contract.

```solidity
function unpause() public onlyOwner
```

##### `updateNodePrice(uint256 _nodePrice)`
Updates the price of a node.

```solidity
function updateNodePrice(uint256 _nodePrice) public onlyOwner
```

##### `setSnapshotterTokenClaimCooldown(uint256 _snapshotterTokenClaimCooldown)`
Sets the cooldown for snapshotter token claims.

```solidity
function setSnapshotterTokenClaimCooldown(uint256 _snapshotterTokenClaimCooldown) public onlyOwner
```

##### `getNodesOwned(address _address)`
Gets the number of nodes owned by an address.

```solidity
function getNodesOwned(address _address) public view returns (uint256)
```

##### `getUserOwnedNodeIds(address _address)`
Gets the node IDs owned by an address.

```solidity
function getUserOwnedNodeIds(address _address) public view returns (uint256[] memory)
```

##### `getAllUserNodeIds(address _address)`
Gets all node IDs owned by an address, including burned ones.

```solidity
function getAllUserNodeIds(address _address) public view returns (uint256[] memory)
```

##### `getUserBurnedNodeIds(address _address)`
Gets the node IDs burned by an address.

```solidity
function getUserBurnedNodeIds(address _address) public view returns (uint256[] memory)
```

##### `safeTransferFrom(...)`
Disables transfers (SBT functionality).

```solidity
function safeTransferFrom(address, address, uint256, uint256, bytes memory) public virtual override
```

##### `safeBatchTransferFrom(...)`
Disables batch transfers (SBT functionality).

```solidity
function safeBatchTransferFrom(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual override
```

##### `completeKyc(uint256 _nodeId)`
Completes the KYC process for a node.

```solidity
function completeKyc(uint256 _nodeId) public onlyOwner
```

##### `mintNode(uint256 amount)`
Mints a new node.

```solidity
function mintNode(uint256 amount) public payable nonReentrant whenNotPaused
```

##### `getTotalSnapshotterCount()`
Returns the total number of active snapshotters.

```solidity
function getTotalSnapshotterCount() public view returns(uint256)
```

##### `nodeSnapshotterMapping(uint256 nodeId)`
Returns the snapshotter address for a given node ID.

```solidity
function nodeSnapshotterMapping(uint256 nodeId) external view returns(address)
```

##### `assignSnapshotterToNode(uint256 nodeId, address snapshotterAddress)`
Assigns a snapshotter to a node.

```solidity
function assignSnapshotterToNode(uint256 nodeId, address snapshotterAddress) public
```

##### `assignSnapshotterToNodeAdmin(uint256 nodeId, address snapshotterAddress)`
Assigns a snapshotter to a node (Admin only).

```solidity
function assignSnapshotterToNodeAdmin(uint256 nodeId, address snapshotterAddress) public onlyOwnerOrAdmin
```

##### `assignSnapshotterToNodeBulk(uint256[] calldata nodeIds, address[] calldata snapshotterAddresses)`
Bulk assigns snapshotters to nodes.

```solidity
function assignSnapshotterToNodeBulk(uint256[] calldata nodeIds, address[] calldata snapshotterAddresses) public
```

##### `assignSnapshotterToNodeBulkAdmin(uint256[] calldata nodeIds, address[] calldata snapshotterAddresses)`
Bulk assigns snapshotters to nodes (Admin only).

```solidity
function assignSnapshotterToNodeBulkAdmin(uint256[] calldata nodeIds, address[] calldata snapshotterAddresses) public onlyOwnerOrAdmin
```

##### `burnNode(uint256 _nodeId)`
Burns a node.

```solidity
function burnNode(uint256 _nodeId) public nonReentrant whenNotPaused
```

##### `adminMintLegacyNodes(address _to, uint256 _amount, bool _isKyced)`
Mints legacy nodes (admin function).

```solidity
function adminMintLegacyNodes(address _to, uint256 _amount, bool _isKyced) public onlyOwner
```

##### `vestedLegacyNodeTokens()`
Calculates vested tokens for legacy nodes.

```solidity
function vestedLegacyNodeTokens() public view returns (uint256)
```

##### `claimableLegacyNodeTokens(uint256 _nodeId)`
Calculates claimable tokens for a legacy node.

```solidity
function claimableLegacyNodeTokens(uint256 _nodeId) public view returns (uint256)
```

##### `getLegacyInitialClaim()`
Calculates the initial claim value for legacy nodes.

```solidity
function getLegacyInitialClaim() public view returns (uint256)
```

##### `claimableNodeTokens(uint256 _nodeId)`
Calculates claimable tokens for a node.

```solidity
function claimableNodeTokens(uint256 _nodeId) public view returns (uint256 _claimableNodeTokens)
```

##### `claimNodeTokens(uint256 _nodeId)`
Claims tokens for a node.

```solidity
function claimNodeTokens(uint256 _nodeId) public nonReentrant whenNotPaused
```

##### `emergencyWithdraw()`
Allows the owner to withdraw all funds from the contract in case of emergency.

```solidity
function emergencyWithdraw() public onlyOwner
```

#### Events

*   **`NodeMinted`:** Emitted when a new node is minted.

    ```solidity
    event NodeMinted(address indexed to, uint256 nodeId);
    ```

*   **`NodeBurned`:** Emitted when a node is burned.

    ```solidity
    event NodeBurned(address indexed from, uint256 nodeId);
    ```

*   **`LegacyNodeTokensClaimed`:** Emitted when tokens are claimed for a legacy node.

    ```solidity
    event LegacyNodeTokensClaimed(address indexed claimer, uint256 nodeId, uint256 amount);
    ```

*   **`SnapshotterTokensClaimed`:** Emitted when tokens are claimed for a snapshotter node.

    ```solidity
    event SnapshotterTokensClaimed(address indexed claimer, uint256 nodeId, uint256 amount);
    ```

*   **`ConfigurationUpdated`:** Emitted when a configuration parameter is updated.

    ```solidity
    event ConfigurationUpdated(string paramName, uint256 newValue);
    ```

*   **`URIUpdated`:** Emitted when the token metadata URI is updated.

    ```solidity
    event URIUpdated(string newUri);
    ```

*   **`NameUpdated`:** Emitted when the token name is updated.

    ```solidity
    event NameUpdated(string newName);
    ```

*   **`EmergencyWithdraw`:** Emitted when funds are withdrawn from the contract in an emergency.

    ```solidity
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    ```

*   **`Deposit`:** Emitted when Ether is deposited into the contract.

    ```solidity
    event Deposit(address indexed from, uint256 amount);
    ```

*   **`SnapshotterStateUpdated`:** Emitted when the snapshotter state contract address is updated.

    ```solidity
    event SnapshotterStateUpdated(address indexed newSnapshotterState);
    ```

*   **`allSnapshottersUpdated`:** Emitted when a snapshotter's status is updated.

    ```solidity
    event allSnapshottersUpdated(address snapshotterAddress, bool allowed);
    ```

*   **`AdminsUpdated`:** Emitted when an admin's status is updated.

    ```solidity
    event AdminsUpdated(address adminAddress, bool allowed);
    ```

*   **`SnapshotterAddressChanged`:** Emitted when a snapshotter address for a node is changed.

    ```solidity
    event SnapshotterAddressChanged(uint256 nodeId, address oldSnapshotter, address newSnapshotter);
    ```


---

## Events

### Namespaced event emissions

Event emissions specific to data market operations are emitted from the data market contracts as well as the protocol state core contract, which has an additional topic that identifies the data market against which the operation is being performed.

This allows for state and event observers on the protocol to filter events by the data market contract of interest.

For example, the `SnapshotBatchSubmitted` event has the following signatures when emitted from:

#### protocol state core contract

```solidity
event SnapshotBatchSubmitted(
  address indexed dataMarketAddress, 
  string batchCid, 
  uint256 indexed epochId, 
  uint256 timestamp
);
```

#### data market contract

```solidity
event SnapshotBatchSubmitted(
  string batchCid, 
  uint256 indexed epochId, 
  uint256 timestamp
);
```

### Epoch related events

* **`DailyTaskCompletedEvent`:** Emitted when a snapshotter reaches their daily quota of snapshot submission count.

```solidity
event DailyTaskCompletedEvent(
  address indexed dataMarketAddress, 
  address snapshotterAddress, 
  uint256 slotId, 
  uint256 dayId, 
  uint256 timestamp
);
```
Read more: [Daily snapshot quota](#daily-snapshot-quota)

* **`DayStartedEvent`:** Emitted when a new day starts.

```solidity
event DayStartedEvent(
  address indexed dataMarketAddress, 
  uint256 dayId, 
  uint256 timestamp
);
```

Read more: [Day size for a data market](#update-day-size)

* **`EpochReleased`**: Emitted when an epoch is released.

```solidity
event EpochReleased(
  address indexed dataMarketAddress, 
  uint256 indexed epochId, 
  uint256 begin, 
  uint256 end, 
  uint256 timestamp
);
```

Read more: [Epoch release](#epoch-release)

* **`RewardsDistributedEvent`:** Emitted when rewards are distributed to a snapshotter.

```solidity
event RewardsDistributedEvent(
  address indexed dataMarketAddress, 
  address snapshotterAddress,
  uint256 slotId,
  uint256 dayId,
  uint256 rewardPoints,
  uint256 timestamp
);
```

### Role Management Events

* **`ValidatorsUpdated`:** Emitted when a validator's status is updated.

```solidity
event ValidatorsUpdated(address indexed dataMarketAddress, address validatorAddress, bool allowed);
```

* **`SequencersUpdated`:** Emitted when a sequencer's status is updated.

```solidity
event SequencersUpdated(address indexed dataMarketAddress, address sequencerAddress, bool allowed);
```

* **`AdminsUpdated`:** Emitted when an admin's status is updated.

```solidity
event AdminsUpdated(address indexed dataMarketAddress, address adminAddress, bool allowed);
```

### Snapshot submissions

* **SnapshotBatchSubmitted:** Emitted upon the sequencer submitting a batch of snapshot submissions along with their claimed finalizations for an `epochId`

```solidity
event SnapshotBatchSubmitted(
  address indexed dataMarketAddress, 
  string batchCid, 
  uint256 indexed epochId, 
  uint256 timestamp
);
```

* **DelayedBatchSubmitted:** Emitted when the sequencer submits a batch past the submission deadline for an epoch

```solidity
event DelayedBatchSubmitted(
  address indexed dataMarketAddress, 
  string batchCid, 
  uint256 indexed epochId, 
  uint256 timestamp
);
```

* **SnapshotBatchFinalized:** Emitted when a majority of the validators have submitted their attestations on a `batchCid` submitted by the sequencer.

```solidity
event SnapshotBatchFinalized(
  address indexed dataMarketAddress, 
  uint256 indexed epochId,
  string batchCid,
  uint256 timestamp
);
```

### Validation

* **SnapshotBatchAttestationSubmitted:** Emitted when a validator `validatorAddr` submits their attestation for a `batchCid` batch.

```solidity
event SnapshotBatchAttestationSubmitted(
  address indexed dataMarketAddress, 
  string batchCid,
  uint256 indexed epochId,
  uint256 timestamp,
  address indexed validatorAddr
);
```

* **DelayedAttestationSubmitted:** Emitted when a validator `validatorAddr` submits their attestation for a `batchCid` batch past the submission deadline

```solidity
event DelayedAttestationSubmitted(
  address indexed dataMarketAddress, 
  string batchCid,
  uint256 indexed epochId,
  uint256 timestamp,
  address indexed validatorAddr
);
```

### Other Events

* **`DelayedSnapshotSubmitted`:** Emitted when a snapshot is submitted past the submission deadline.

```solidity
event DelayedSnapshotSubmitted(
  address indexed dataMarketAddress, 
  address indexed snapshotterAddr, 
  uint256 slotId, 
  string snapshotCid, 
  uint256 indexed epochId, 
  string projectId, 
  uint256 timestamp
);
```

* **`EmergencyWithdraw`:** Emitted when funds are withdrawn from the contract in an emergency.

```solidity
event EmergencyWithdraw(address indexed owner, uint256 amount);
```

* **`RewardsClaimed`:** Emitted when a user claims rewards.

```solidity
event RewardsClaimed(address indexed user, uint256 amount, uint256 timestamp);
```
