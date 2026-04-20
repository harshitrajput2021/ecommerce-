import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi } from '../api/cart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    cartApi
      .checkout(shippingAddress)
      .then((res) => {
        if (res.status === 201) {
          navigate(`/orders/${res.data.id}/confirm`, { state: { order: res.data } });
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? err.message ?? 'Checkout failed.');
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="page-shell" style={{ maxWidth: '620px' }}>
      <Link to="/cart" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Back to Cart</Link>
      <header className="page-header">
        <p className="page-kicker">Final Step</p>
        <h1 className="page-title">Checkout</h1>
      </header>

      <form onSubmit={handleSubmit} className="panel">
        <div className="field-group" style={{ marginBottom: 0 }}>
          <label htmlFor="shippingAddress">Shipping Address</label>
          <textarea
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            rows={5}
            className="textarea-inline"
            placeholder="Enter your full shipping address"
          />
        </div>

        {error && <p className="danger">{error}</p>}

        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
