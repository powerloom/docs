---
sidebar_position: 3
---

# Validator

:::info
This page describes the Protocol v2 validator flow. For the live DSV mainnet consensus path, see [`Protocol Workflow`](/dsv-mainnet/protocol-workflow), [`On-Chain Submission and Verification`](/dsv-mainnet/onchain-submission-and-verification), and [`Stability and Scale`](/dsv-mainnet/stability-and-scale).
:::

## Overview

![Protocol V2 validator worklow](/images/validator-workflow.png)

As the snapshot submission batches are [anchored on the protocol state by the sequencer](/Protocol/Protocol_v2/sequencer.md#batch-upload-and-anchor-proof), the validators become responsible for submitting their attestations on these batches.

## State transitions

![Snapshot submission, validation and finalization state transitions](/images/submission-validation-timeline.png)

### Batch submission

When the sequencer submits a batch, it puts the snapshots contained within in a `PENDING` state on the protocol state. It also causes the emission of a `SnapshotBatchSubmitted` event.

:::info
Learn more:
* [Sequencer batch submission](/Protocol/Protocol_v2/sequencer.md#batch-upload-and-anchor-proof)
* [Protocol State: State transition of snapshots](/Protocol/Specifications/state-v2.md#snapshot-state)
:::

### Batch validation: Attestation and finalization

The finalized CID of every project ID committed by the sequencer in the `PENDING` state moves to a `FINALIZED` state when a majority of the validators submit their attestations on that finalization.

In the case where a majority of validators do not agree to the finalization, a resubmission workflow is triggered. This time, the validators work on re-creating the snapshots against the project IDs that did not reach consensus for finalization, and re-submit them to the protocol state to be resolved by the same consensus rules.

#### Trigger for batch attestation

For the current iteration of the Protocol V2 release, once the sequencer for a data market has finished committing all batches of submissions, it triggers an event release `BatchSubmissionsCompleted` on the protocol state smart contract that signals the validators to begin submitting their attestations.

#### What is the attestation?

As mentioned in the [protocol state](/Protocol/Specifications/state-v2.md#snapshot-submission-in-batches-by-sequencer) specification, the attestation is against the roothash of the Merkle tree that the sequencer has submitted for a batch. 

The tree is constructed out of the finalized CIDs of the project IDs in the order included in the batch.

The validator peers call the method [`submitBatchAttestation`](/Protocol/Specifications/state-v2.md#attestation-against-submission-batches-by-validator) to submit their attestation against the `batchCid` along with the root hash of the Merkle tree of the finalized CIDs.

```solidity
function submitSubmissionBatch(
        string memory batchCid,
        uint256 epochId,
        string[] memory projectIds,
        string[] memory snapshotCids,
        bytes32 finalizedCidsRootHash
    ) public onlySequencer
```

:::info
* See also: 
  * [Structure of a batch](/files/QmdFHpLZT4dgdFKYyd1yGM62chhJjYpZCtX.json)
  * [Batch upload integrity: Roothash of Merkle tree of finalized CIDs](/Protocol/Protocol_v2/sequencer.md#batch-upload-integrity-roothash-of-merkle-tree-of-finalized-cids)
:::
