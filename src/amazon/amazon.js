// amazon.js
require('dotenv').config();
const rp = require('request-promise');

class AmazonAPI {
  constructor() {
    this.baseUrl = 'https://real-time-amazon-data.p.rapidapi.com/search';
    this.headers = {
      'x-rapidapi-key': process.env.AMAZON_API_KEY,
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
    };
  }

  async searchProducts(query) {
    const options = {
      method: 'GET',
      uri: this.baseUrl,
      qs: { query },
      headers: this.headers,
      json: true,
    };

    try {
      const body = await rp(options);
      return this._normalize(body);
    } catch (err) {
      console.error('Amazon API error:', err.message);
      return null;
    }
  }

  _normalize(raw) {
    const items = raw?.data?.products || [];
    return items.map(item => {
      // parse prices
      const price = item.product_price
        ? parseFloat(item.product_price.replace(/[^0-9.]/g, ''))
        : 0;
      const original = item.product_original_price
        ? parseFloat(item.product_original_price.replace(/[^0-9.]/g, ''))
        : null;
      // compute discount %
      const discount = original
        ? `${Math.round(((original - price) / original) * 100)}%`
        : null;

      return {
        product_id: item.asin,
        title:       item.product_title,
        price:       price,
        original_price: original,
        currency:    item.currency || 'USD',
        discount:    discount,
        image_url:   item.product_photo,
        platform:    'Amazon',
      };
    });
  }
}

module.exports = AmazonAPI;
