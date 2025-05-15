// consumer_amazon.js
require('dotenv').config();
const amqp = require('amqplib');
const AmazonAPI = require('./amazon');

async function start() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();

  await ch.assertQueue('product_searches', { durable: false });
  await ch.assertQueue('price_updates',   { durable: false });

  const api = new AmazonAPI();

  console.log('Amazon service waiting for product_searches…');
  ch.consume('product_searches', async msg => {
    if (!msg) return;

    const { keyWord } = JSON.parse(msg.content.toString());
    console.log(`→ [Amazon] Searching for: ${keyWord}`);

    const results = await api.searchProducts(keyWord);
    if (results && results.length) {
      ch.sendToQueue(
        'price_updates',
        Buffer.from(JSON.stringify({ source: 'Amazon', data: results })),
        { persistent: true }
      );
      console.log(`✓ [Amazon] Sent ${results.length} items to price_updates`);
    } else {
      console.log('⚠️ [Amazon] No results or API error');
    }

    ch.ack(msg);
  }, { noAck: false });
}

start().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
