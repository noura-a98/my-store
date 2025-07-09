import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./product.css";

function Product({ addToCart, setCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: "123",
    name: "Sweet Drops – Sugar-Free",
    price: 49.0,
    image: "/images.jpeg",
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    setCart([{ ...product, quantity }]);
    navigate('/checkout');
  };

  return (
    <div className="product-page">
      <div className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="product-description">
            A guilt-free, sugar-free sweetener made from natural ingredients. Perfect for your morning coffee, smoothies, and baking needs.
          </p>
          <p className="product-price">AED {product.price.toFixed(2)}</p>
          <div className="quantity-wrapper">
            <label htmlFor="quantity">Qty:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>
          <div className="btn">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="shipping-info">
        <h3>Shipping & Delivery</h3>
        <p>
          Orders placed before 3 PM are shipped the same day. We deliver across the UAE within 1–3 business days. 
          Free delivery on orders over AED 100.
        </p>
        <ul>
          <li>✔️ Same-day shipping on weekdays</li>
          <li>✔️ Tracking number provided after dispatch</li>
          <li>✔️ Secure & eco-friendly packaging</li>
        </ul>
      </div>
    </div>
  );
}

export default Product;
