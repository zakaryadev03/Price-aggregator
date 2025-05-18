import React from 'react';

function ProductCard({ product }) {
  const { title, image_url, best_price, best_platform, prices } = product;

  return (
    <div className="product-card">
      <img src={image_url} alt={title} />
      <div className="product-title">{title}</div>
      <div className="best-price">${best_price} ({best_platform})</div>
      <ul className="other-prices">
        {prices.map((p, idx) => (
          <li key={idx}>
            {p.platform}: ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductCard;