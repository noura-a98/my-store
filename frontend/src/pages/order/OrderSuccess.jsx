import './OrderSuccess.css';

function OrderSuccess({ order }) {
  const { _id, createdAt, totalPrice, paymentMethod, items } = order;

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
          <h1>🎉 Order Placed Successfully!</h1>
          <p className="subtitle">Thank you for shopping with us 💚</p>
        </div>

        <div className="info-grid">
          <div><strong>Order #</strong><p>{_id}</p></div>
          <div><strong>Date</strong><p>{new Date(createdAt).toLocaleDateString()}</p></div>
          <div><strong>Total</strong><p>AED {totalPrice.toFixed(2)}</p></div>
          <div><strong>Payment</strong><p>{paymentMethod.toUpperCase()}</p></div>
        </div>

        <h2 className="summary-heading">🛒 Your Order Summary</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>AED {item.price.toFixed(2)}</td>
                <td>AED {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer-note">
          <p>We'll send you a confirmation email with delivery details shortly.</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
