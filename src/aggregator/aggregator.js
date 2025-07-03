// aggregator.js
require('dotenv').config();
const express = require('express');
const amqp    = require('amqplib');
const { Pool } = require('pg');
const cors = require('cors');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const DB_URL       = process.env.DATABASE_URL;
const SEARCH_QUEUE = 'product_searches';
const PRICE_UPDATES_QUEUE = 'price_updates';

const app = express();
app.use(express.json());
app.use(cors());

// Postgres pool
const pgPool = new Pool({
  connectionString: DB_URL,
});

// Helper: upsert into `products`
async function upsertProduct(item, platform) {
  const {
    product_id,
    title,
    price,
    original_price,
    currency,
    discount,
    image_url
  } = item;

  const text = `
    INSERT INTO products
      (platform, product_id, title, price, original_price, currency, discount, image_url, last_updated)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (platform, product_id)
    DO UPDATE SET
      title          = EXCLUDED.title,
      price          = EXCLUDED.price,
      original_price = EXCLUDED.original_price,
      currency       = EXCLUDED.currency,
      discount       = EXCLUDED.discount,
      image_url      = EXCLUDED.image_url,
      last_updated   = NOW()
  `;
  const values = [
    platform,
    product_id,
    title,
    price,
    original_price,
    currency,
    discount,
    image_url
  ];

  try {
    await pgPool.query(text, values);
  } catch (err) {
    console.error('Error upserting product:', err);
  }
}

// Helper: consume price_updates and upsert into `products`
async function startPriceUpdateConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch   = await conn.createChannel();
  await ch.assertQueue(PRICE_UPDATES_QUEUE, { durable: true });

  ch.consume(
    PRICE_UPDATES_QUEUE,
    async (msg) => {
      if (!msg) return;
      const body = JSON.parse(msg.content.toString());
      const { source, data } = body; // source: "Amazon" or "AliExpress"

      for (const item of data) {
        await upsertProduct(item, source);
      }

      ch.ack(msg);
    },
    { noAck: false }
  );

  console.log('→ [Aggregator] listening to price_updates…');
}

// 2. Endpoint: POST /search
// Clients send { "keyWord": "Phone" } here.
app.post('/search', async (req, res) => {
  const { keyWord } = req.body;
  if (!keyWord) {
    return res.status(400).json({ error: 'keyWord is required' });
  }

  let conn, ch;
  try {
    // 2.1. Publish the search query to RabbitMQ
    conn = await amqp.connect(RABBITMQ_URL);
    ch   = await conn.createChannel();
    await ch.assertQueue(SEARCH_QUEUE, { durable: true });

    console.log(`→ [Aggregator] publishing "${keyWord}" to ${SEARCH_QUEUE}`);
    ch.sendToQueue(
      SEARCH_QUEUE,
      Buffer.from(JSON.stringify({ keyWord })),
      { persistent: true }
    );
  } catch (err) {
    console.error('RabbitMQ publish error:', err);
    return res.status(500).json({ error: 'Internal error publishing search' });
  }

  // 2.2. Wait a few seconds for the fetchers to respond & for upserts to happen
  const WAIT_MS = 4000;
  await new Promise(resolve => setTimeout(resolve, WAIT_MS));

  // 2.3. Query the `products` table for the keyword
  const queryText = `
    SELECT platform, product_id, title, price, original_price, currency, discount, image_url, last_updated
    FROM products
    WHERE title ILIKE $1
    ORDER BY title, price
    LIMIT 100
  `;
  const queryValues = [`%${keyWord}%`];

  let rows;
  try {
    const result = await pgPool.query(queryText, queryValues);
    rows = result.rows;
  } catch (err) {
    console.error('Postgres query error:', err);
    return res.status(500).json({ error: 'Internal error querying products' });
  }

  // 2.4. Group rows by title
  // Then pick best price across platforms for each unique product_id
  const grouped = {};
  for (const r of rows) {
    const key = r.product_id;
    if (!grouped[key]) {
      grouped[key] = {
        product_id:    r.product_id,
        title:         r.title,
        currency:      r.currency,
        image_url:     r.image_url,
        best_price:    r.price,
        best_platform: r.platform,
        prices: [{
          platform:   r.platform,
          price:      r.price,
          last_updated: r.last_updated
        }]
      };
    } else {
      // add to prices list
      grouped[key].prices.push({
        platform:    r.platform,
        price:       r.price,
        last_updated: r.last_updated
      });
      // update best_price if needed
      if (r.price < grouped[key].best_price) {
        grouped[key].best_price = r.price;
        grouped[key].best_platform = r.platform;
      }
    }
  }

  // Turn grouped object into an array
  const responseArr = Object.values(grouped);

  return res.json(responseArr);
});

// 3. Initialize both HTTP server & queue consumer
async function start() {
  await startPriceUpdateConsumer();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`→ [Aggregator HTTP] Listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Fatal aggregator error:', err);
  process.exit(1);
});
