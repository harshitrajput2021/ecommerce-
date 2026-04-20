import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchCart() {
    setLoading(true);
    setError(null);
    cartApi
      .getCart()
      .then((res) => setCart(res.data))
      .catch((err) => setError(err.message ?? 'Failed to load cart.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCart();
  }, []);

  function handleDecrement(item) {
    if (item.quantity <= 1) {
      cartApi.removeItem(item.productId).then(fetchCart).catch((err) => setError(err.message));
    } else {
      cartApi.updateItem(item.productId, item.quantity - 1).then(fetchCart).catch((err) => setError(err.message));
    }
  }

  function handleIncrement(item) {
    cartApi.updateItem(item.productId, item.quantity + 1).then(fetchCart).catch((err) => setError(err.message));
  }

  function handleRemove(item) {
    cartApi.removeItem(item.productId).then(fetchCart).catch((err) => setError(err.message));
  }

  if (loading) return <p className="page-shell">Loading cart...</p>;
  if (error) return <p className="page-shell danger">Error: {error}</p>;

  const items = cart?.items ?? [];

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-kicker">Order Draft</p>
        <h1 className="page-title">Shopping Cart</h1>
      </header>

      {items.length === 0 ? (
        <div className="panel">
          <p className="muted">Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className="primary-btn">Browse Products</button>
        </div>
      ) : (
        <>
          <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>${Number(item.unitPrice).toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleDecrement(item)} className="ghost-btn">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrement(item)} className="ghost-btn">+</button>
                    </div>
                  </td>
                  <td>${Number(item.lineTotal).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemove(item)} className="ghost-btn danger">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div style={{ textAlign: 'right', margin: '1rem 0' }}>
            <p>Total Items: <strong>{cart.totalItems}</strong></p>
            <p>Grand Total: <strong>${Number(cart.grandTotal).toFixed(2)}</strong></p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => navigate('/checkout')}
              className="primary-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
