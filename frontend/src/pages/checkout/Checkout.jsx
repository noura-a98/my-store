import "./Checkout.css";
import { useNavigate } from 'react-router-dom';

function Checkout({ cart }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 100 ? 0 : 20; // Free shipping for orders over AED 100
  const total = subtotal + shippingFee;
  const navigate = useNavigate();

  return (
    <div className="checkout-wrapper">
      <div className="checkout-grid">
        {/* Billing Form */}
        <div className="checkout-form">
          <h2>Billing Details</h2>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="text" placeholder="WhatsApp (Optional)" />
            <input type="text" placeholder="City" required />
            <input type="text" placeholder="Shipping Address" required />
            <textarea placeholder="Order Notes (Optional)" rows="4" />
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Your Order</h2>
          <div className="order-items">
            {cart.map((item, idx) => (
              <div key={idx} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="details">
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>AED {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div>
              <span>Subtotal:</span>
              <span>AED {subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Shipping:</span>
              <span>AED {shippingFee.toFixed(2)}</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>AED {total.toFixed(2)}</span>
            </div>
          </div>
          <button className="place-order" onClick={() => navigate('/success')}>
        Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
