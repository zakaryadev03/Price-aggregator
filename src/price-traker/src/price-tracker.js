// price_tracker.js
require('dotenv').config();
const amqp = require('amqplib');
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

async function savePrice(update) {
  const {
    source: platform,
    data,  // array of normalized items
  } = update;

  const insertText = `
    INSERT INTO price_history
      (product_id, title, platform, price, original_price, currency, discount, image_url)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  for (const item of data) {
    const vals = [
      item.product_id,
      item.title,
      platform,
      item.price,
      item.original_price || null,
      item.currency,
      item.discount || null,
      item.image_url
    ];
    try {
      await pool.query(insertText, vals);
    } catch (err) {
      console.error('DB Insert error:', err);
    }
  }
}

async function start() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch   = await conn.createChannel();

  await ch.assertQueue('price_updates', { durable: true });
  console.log('Price‑Tracker waiting on price_updates…');

  ch.consume('price_updates', async msg => {
    if (!msg) return;
    let payload;
    try {
      payload = JSON.parse(msg.content.toString());
    } catch (e) {
      console.error('Invalid JSON:', e);
      return ch.ack(msg);
    }

    console.log(`→ [Tracker] ${payload.source} sent ${payload.data.length} items`);
    await savePrice(payload);
    ch.ack(msg);
  }, { noAck: false });
}

start().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
