import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import { searchProducts } from './services/api';

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (keyword) => {
    setQuery(keyword);
    setLoading(true);
    setError(null);
    try {
      const results = await searchProducts(keyword);
      setProducts(results);
    } catch (err) {
      setError('Failed to fetch results.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Price Compare</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <ProductList products={products} />}
    </div>
  );
}

export default App;
