import { useState, useEffect } from 'react';
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
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import UsersManagement from './pages/dashboard/admin/users/staff/UsersManagement';
import ProductsManagement from './pages/dashboard/admin/products/ProductsManagement';
import AllOrders from './pages/dashboard/admin/order/AllOrders';
import ProtectedRoute from './components/ProtectedRoute';
import InfluencersManagement from './pages/dashboard/admin/users/influeners/InfluencersManagement';
import DeliveryFees from './pages/dashboard/admin/DeliveryFees/DeliveryFees';
import DriverDashboard from './pages/dashboard/driverDashboard/driverDashboard'; 

function AppContent() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cartItems (Cart Sidebar) in localStorage
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist cart (Buy Now flow) in localStorage
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const hideLayout = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/driver-dashboard';

  // Dynamic body class management for navbar spacing
  useEffect(() => {
    if (hideLayout) {
      document.body.classList.add('no-navbar');
    } else {
      document.body.classList.remove('no-navbar');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('no-navbar');
    };
  }, [hideLayout]);

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
          <Route path="/product/:productId" element={<Product addToCart={addToCart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />

          <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users">
              <Route path="staff" element={<UsersManagement />} />
              <Route path="influencers" element={<InfluencersManagement />} />
            </Route>
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<AllOrders />} />
            <Route path="deliveryFees" element={<DeliveryFees />} />
          </Route>
        </Routes>
      </main>

      {!hideLayout && <Footer />}
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