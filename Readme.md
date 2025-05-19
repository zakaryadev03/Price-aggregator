# Price Aggregator App

![Docker](https://img.shields.io/badge/Docker-✓-blue?logo=docker)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-✓-orange?logo=rabbitmq)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-✓-blue?logo=postgresql)

Real-time product price comparison API aggregating data from Amazon and AliExpress.
## Features

- 🚀 **Real-time price aggregation** from multiple sources
- 🔍 **Product search API** with best-price comparison
- 🐇 **RabbitMQ integration** for scalable data processing
- 🐘 **PostgreSQL storage** with automatic upserts
- 🌐 **CORS-enabled REST API**

## Quick Start

```bash
git clone https://github.com/your-repo/price-aggregator.git
cd price-aggregator
docker compose up -d
```
## High level Architecture
![Workflow](assets/Architecture.png)

## Detailed Architecture

```mermaid
flowchart TD
    A[User] -->|POST /search| B[Aggregator]
    B -->|Publish| C[(RabbitMQ)]
    C -->|Consume| D[Amazon Scraper]
    C -->|Consume| E[AliExpress Scraper]
    D & E -->|Push Updates| C
    C -->|Consume| B
    B -->|Upsert| F[(PostgreSQL)]
```
## Branching strategy

- master: main dev branch
- features/*: features/services dev branch
- release: production ready branch

 
