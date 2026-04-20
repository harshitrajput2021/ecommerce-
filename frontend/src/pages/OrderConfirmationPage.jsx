import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page-shell">
        <p>No order data found.</p>
        <button onClick={() => navigate('/products')} className="primary-btn">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="page-shell" style={{ maxWidth: '760px' }}>
      <header className="page-header">
        <p className="page-kicker">Success</p>
        <h1 className="page-title">Order Confirmed!</h1>
      </header>
      <p className="muted">Thank you for your order.</p>

      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
      </div>

      <h2>Items</h2>
      <div className="panel">
      <table className="table" style={{ marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {(order.items ?? []).map((item, idx) => (
            <tr key={idx}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <p style={{ textAlign: 'right', fontSize: '1.1rem' }}>
        <strong>Total: ${Number(order.totalPrice).toFixed(2)}</strong>
      </p>

      <button
        onClick={() => navigate('/products')}
        className="primary-btn"
      >
        Continue Shopping
      </button>
    </div>
  );
}
