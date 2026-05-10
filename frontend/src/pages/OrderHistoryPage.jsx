import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersApi
      .getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message ?? 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-shell">Loading orders...</p>;
  if (error) return <p className="page-shell danger">Error: {error}</p>;

  return (
    <div className="page-shell" style={{ maxWidth: '920px' }}>
      <header className="page-header">
        <p className="page-kicker">Timeline</p>
        <h1 className="page-title">Order History</h1>
      </header>

      {orders.length === 0 ? (
        <div className="panel">
          <p className="muted">You have no orders yet.</p>
          <button onClick={() => navigate('/products')} className="primary-btn">Browse Products</button>
        </div>
      ) : (
        <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>#{order.id}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>{order.items.length}</td>
                <td>₹{Number(order.totalPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
