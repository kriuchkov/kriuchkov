---
title: "TonBeacon"
sort: 10
license: 'GPL-3.0'
description: "TonBeacon is a self-hosted B2B solution providing infrastructure for generating user wallets on the TON (The Open Network) blockchain, tracking incoming transactions, and automatically centralizing funds to a master wallet."
image: "images/projects/tonbeacon_black.png"
link: "https://github.com/kriuchkov/tonbeacon"
stack: ["Go", "TON", "Kafka", "PostgreSQL", "gRPC"]
---

# TonBeacon

TonBeacon is a self-hosted B2B solution providing infrastructure for generating user wallets on the TON (The Open Network) blockchain, tracking incoming transactions, and automatically centralizing funds to a master wallet. The primary goal of the project is to make the TON blockchain accessible for financial solutions and extend beyond the Telegram ecosystem, enabling B2B applications to offer custodial wallets with account management and fund aggregation for their users without relying on memo phrases or compromising the master wallet.

## Project Goals

- **Wallet Generation**: Create unique subwallets for each user based on a single master key.
- **Transaction Tracking**: Monitor incoming transactions using the Outbox pattern with idempotent delivery to Kafka.
- **Funds Centralization**: Run a collector that periodically consolidates funds from subwallets to the master wallet.

## Key Features

- **Self-Hosted**: Deploy on your own servers with full autonomy.
- **API**: gRPC and HTTP interfaces for managing wallets and retrieving transaction data.
- **Scalability**: Supports Kafka for asynchronous event processing and PostgreSQL for data storage.
- **Security**: Configuration via environment variables and secrets, with graceful shutdown for proper termination.
