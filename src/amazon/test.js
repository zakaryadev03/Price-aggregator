// test_amazon_service.js
require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const TEST_KEYWORD = 'Phone';
const TIMEOUT_MS = 20000; // 20s

(async () => {
  let conn, ch;
  try {
    conn = await amqp.connect(RABBITMQ_URL);
    ch   = await conn.createChannel();

    await ch.assertQueue('product_searches', { durable: false });
    await ch.assertQueue('price_updates',   { durable: false });

    console.log(`→ Sending test search "${TEST_KEYWORD}" to product_searches…`);
    ch.sendToQueue(
      'product_searches',
      Buffer.from(JSON.stringify({ keyWord: TEST_KEYWORD })),
      { persistent: true }
    );

    // wait for one message on price_updates
    console.log('← Waiting for price_updates message…');
    const msgPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout waiting for response')), TIMEOUT_MS);

      ch.consume('price_updates', msg => {
        if (!msg) return;
        clearTimeout(timer);
        ch.ack(msg);
        resolve(msg.content.toString());
      }, { noAck: false });
    });

    const raw = await msgPromise;
    const payload = JSON.parse(raw);

    // Basic validation
    const ok = 
      payload.source === 'Amazon' &&
      Array.isArray(payload.data) &&
      payload.data.length > 0 &&
      payload.data.every(item =>
        item.product_id &&
        item.title &&
        typeof item.price === 'number' &&
        item.currency &&
        item.platform === 'Amazon'
      );

    console.log('\n===== TEST RESULT =====');
    if (ok) {
      console.log('✅ PASS — payload looks good:');
      console.dir(payload, { depth: 2 });
      process.exit(0);
    } else {
      console.error('❌ FAIL — payload did not match expected schema:');
      console.dir(payload, { depth: 2 });
      process.exit(1);
    }

  } catch (err) {
    console.error('\n⚠️  TEST ERROR:', err);
    process.exit(1);

  } finally {
    if (ch)  await ch.close().catch(() => {});
    if (conn) await conn.close().catch(() => {});
  }
})();
