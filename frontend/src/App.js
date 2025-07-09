import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Product from './pages/product-details/product-shop';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import CartSidebar from './components/cart/CartSidebar';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/order/OrderSuccess';
import Login from './pages/login/Login';
import Cart from './pages/cart/Cart';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import UsersManagement from './pages/dashboard/admin/users/UsersManagement';
import ProductsManagement from './pages/dashboard/admin/products/ProductsManagement';
import NewOrders from './pages/dashboard/admin/order/NewOrder'
import AllOrders from './pages/dashboard/admin/order/AllOrders'
import ProtectedRoute from './components/ProtectedRoute'; // adjust path if needed
import InfluencersManagement from './pages/dashboard/admin/users/InfluencersManagement';

function AppContent() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState([]); // For Buy Now flow

  const toggleCart = () => setCartOpen(!cartOpen);

  const addToCart = (product) => {
    if (!product.id) {
      product.id = Date.now(); // fallback ID
    }
    setCartItems((prev) => [...prev, product]);
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const dummyOrder = {
    _id: 'ORD123456',
    createdAt: new Date(),
    totalPrice: 129.98,
    paymentMethod: 'cod',
    items: [
      { name: 'Sweet Drops – Sugar-Free', quantity: 2, price: 49.99 },
      { name: 'Sugar-Free Vanilla', quantity: 1, price: 29.99 }
    ]
  };

const hideLayout = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="App">
    {!hideLayout && <Navbar onCartClick={toggleCart} />}
{!hideLayout && (
  <CartSidebar
    open={cartOpen}
    onClose={toggleCart}
    cartItems={cartItems}
    removeFromCart={removeFromCart}
  />
)}


      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Product addToCart={addToCart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/success" element={<OrderSuccess order={dummyOrder} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />

           <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
            <Route path="users">
              <Route path="staff" element={<UsersManagement />} />
              <Route path="influencers" element={<InfluencersManagement />} />
            </Route>              <Route path="products" element={<ProductsManagement />} />
              <Route path="orders">
              <Route path="new" element={<NewOrders />} />
              <Route path="all" element={<AllOrders />} />
              </Route>
          </Route>

        </Routes>
      </main>

      {!hideLayout  && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
