import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersApi
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message ?? 'Failed to load order.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="page-shell">Loading order...</p>;
  if (error) return <p className="page-shell danger">Error: {error}</p>;

  return (
    <div className="page-shell" style={{ maxWidth: '920px' }}>
      <Link to="/orders" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Orders
      </Link>

      <header className="page-header">
        <p className="page-kicker">Order Snapshot</p>
        <h1 className="page-title">Order #{order.id}</h1>
      </header>
      <div className="panel" style={{ marginBottom: '1rem' }}>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Shipping Address: {order.shippingAddress}</p>
      </div>

      <h2>Items</h2>
      <div className="panel">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>₹{Number(item.unitPrice).toFixed(2)}</td>
              <td>₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div style={{ textAlign: 'right' }}>
        <strong>Total: ₹{Number(order.totalPrice).toFixed(2)}</strong>
      </div>
    </div>
  );
}
