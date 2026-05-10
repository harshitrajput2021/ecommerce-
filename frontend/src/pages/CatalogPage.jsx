import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../api/products';

const CATEGORIES = ['', 'Electronics', 'Furniture', 'Kitchen', 'Sports', 'Accessories'];

export default function CatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productsApi
      .getProducts({ keyword, category, page: currentPage, size: 12 })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data.content ?? []);
          setTotalPages(res.data.totalPages ?? 1);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to load products.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [keyword, category, currentPage]);

  function handleSearch(e) {
    e.preventDefault();
    setCurrentPage(0);
    setKeyword(searchInput);
  }

  function handleCategoryChange(e) {
    setCurrentPage(0);
    setCategory(e.target.value);
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-kicker">Curated Collection</p>
        <h1 className="page-title">Product Catalog</h1>
      </header>

      <form onSubmit={handleSearch} className="toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-inline"
        />
        <select value={category} onChange={handleCategoryChange} className="select-inline">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === '' ? 'All Categories' : c}</option>
          ))}
        </select>
        <button type="submit" className="primary-btn">Search</button>
      </form>

      {loading && <p>Loading products...</p>}
      {error && <p className="danger">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid-products">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="product-card"
              >
                <img
                  src={product.imageUrl || 'https://placehold.co/200x150?text=No+Image'}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="muted">{product.category}</p>
                <p><strong>₹{Number(product.price).toFixed(2)}</strong></p>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="ghost-btn"
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="ghost-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
