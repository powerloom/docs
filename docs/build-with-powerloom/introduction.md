---
sidebar_position: 0
---

# Introduction

Powerloom protocol is designed to be decentralized from the ground up. This means everything, from data market implementations to data relevance, is intended to be controlled by market economics. This represents a distinct departure from current centralized solutions where data is controlled by a single entity.

The overall architecture of the Powerloom protocol is illustrated below:
![Overall Architecture](/images/OverallArchitecture.png)

One of the most crucial components of the Powerloom protocol is the Snapshotter peer. A Snapshotter is a node responsible for reading data from various blockchains and sending it to the Powerloom consensus protocol for validation. Anyone can run a Snapshotter node and join the Powerloom network.

Powerloom's current data access direction starts with the BDS data market: verified, DSV-finalized Uniswap V3 data served through metered HTTP routes and agent-friendly access layers.

Let's dive into the Snapshotter node and see how it all works!
