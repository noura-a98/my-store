import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cart/Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [shipping, setShipping] = useState(20); // example fixed shipping
  const [subtotal, setSubtotal] = useState(0);
const navigate = useNavigate();

  useEffect(() => {
    const dummyCart = [
      {
        _id: "1",
        name: "Sweet Drops – Sugar-Free",
        price: 49.99,
        quantity: 2,
        imageCover: "images.jpeg"
      },
      {
        _id: "2",
        name: "Sugar-Free Vanilla",
        price: 29.99,
        quantity: 1,
        imageCover: "images.jpeg"
      }
    ];
    setCartItems(dummyCart);

    const sub = dummyCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(sub);
  }, []);

  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <img src={`/${item.imageCover}`} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>Price: AED {item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Total: AED {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Subtotal: AED {subtotal.toFixed(2)}</p>
        <p>Shipping: AED {shipping.toFixed(2)}</p>
        <h3>Total: AED {total.toFixed(2)}</h3>
        <button onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>

      </div>
    </div>
  );
}

export default Cart;
