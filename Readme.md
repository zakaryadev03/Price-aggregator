# Price Aggregator Service

A real-time product price comparison API that collects data from multiple e-commerce platforms and returns the best available prices.

## Features

- 🚀 **Real-time price aggregation** from multiple sources
- 🔍 **Product search API** with best-price comparison
- 🐇 **RabbitMQ integration** for scalable data processing
- 🐘 **PostgreSQL storage** with automatic upserts
- 🌐 **CORS-enabled REST API**

## Architecture

```mermaid
flowchart LR
    User-->|POST /search|Aggregator
    Aggregator-->|Publish query|RabbitMQ
    RabbitMQ-->|Consume|Scraper1[Amazon Scraper]
    RabbitMQ-->|Consume|Scraper2[AliExpress Scraper]
    Scraper1-->|Publish data|RabbitMQ
    Scraper2-->|Publish data|RabbitMQ
    RabbitMQ-->|Consume|Aggregator
    Aggregator-->|Upsert|PostgreSQL