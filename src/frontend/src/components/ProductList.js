import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products }) {
  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((prod) => (
        <ProductCard key={`${prod.platform}-${prod.product_id}`} product={prod} />
      ))}
    </div>
  );
}

export default ProductList;