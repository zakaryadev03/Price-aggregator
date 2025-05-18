// test_amazon_publish.js
require('dotenv').config();
const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch   = await conn.createChannel();
  await ch.assertQueue('price_updates', { durable: true });

  // A minimal “fake” Amazon payload:
  const payload = {
    source: 'Amazon',
    data: [
      {
        product_id: 'TEST1234',
        title:      'Test iPhone Case from Amazon',
        price:       9.99,
        original_price: 19.99,
        currency:    'USD',
        discount:    '50%',
        image_url:   'https://example.com/test.jpg',
        platform:    'Amazon'  // this field isn’t used by upsertProduct, but it matches your normalization
      }
    ]
  };

  ch.sendToQueue(
    'price_updates',
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
  console.log('✅ Pushed fake Amazon payload to price_updates');
  await ch.close();
  await conn.close();
  process.exit(0);
})();
