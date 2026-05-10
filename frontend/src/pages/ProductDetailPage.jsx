import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/products';
import { cartApi } from '../api/cart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productsApi
      .getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message ?? 'Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="page-shell">Loading product...</p>;
  if (error) return <p className="page-shell danger">Error: {error}</p>;
  if (!product) return null;

  function handleAddToCart() {
    setAddingToCart(true);
    setCartMessage(null);
    setCartError(null);
    cartApi
      .addItem(product.id, 1)
      .then(() => {
        setCartMessage('Added to cart!');
        setTimeout(() => setCartMessage(null), 3000);
      })
      .catch((err) => {
        setCartError(err.response?.data?.message ?? 'Failed to add to cart.');
      })
      .finally(() => setAddingToCart(false));
  }

  return (
    <div className="page-shell" style={{ maxWidth: '760px' }}>
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        &larr; Back to Catalog
      </Link>

      <div className="panel">
        <img
          src={product.imageUrl || 'https://placehold.co/600x300?text=No+Image'}
          alt={product.name}
          style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', borderRadius: '12px' }}
        />

        <h1 className="page-title" style={{ fontSize: '2.1rem', marginTop: '1rem' }}>{product.name}</h1>
        <p className="muted">{product.category}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{Number(product.price).toFixed(2)}</p>
        <p>{product.description}</p>
        <p>
          <strong>In stock:</strong> {product.stockQuantity}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="primary-btn"
          style={{ maxWidth: '240px', marginTop: '0.7rem' }}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>

        {cartMessage && <p className="success">{cartMessage}</p>}
        {cartError && <p className="danger">{cartError}</p>}
      </div>
    </div>
  );
}
