import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

function CartSidebar({ open, onClose, cartItems, removeFromCart }) {
  const navigate = useNavigate();

  const handleViewCart = () => {
    onClose(); // close sidebar
    navigate('/cart'); // navigate to cart page
  };

  const handleCheckout = () => {
    onClose(); // close sidebar
    navigate('/checkout'); // navigate to checkout page
  };

  return (
    <div className={`cart-sidebar ${open ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: AED {item.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-buttons">
            <button className="btn view-cart" onClick={handleViewCart}>View Cart</button>
            <button className="btn checkout" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartSidebar;
