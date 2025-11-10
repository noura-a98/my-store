import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();
  const [ordersOpen, setOrdersOpen] = useState(location.pathname.includes('/admin/orders'));
  const [usersOpen, setUsersOpen] = useState(location.pathname.includes('/admin/users'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/users/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <h2>Admin Dashboard</h2>
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin</h2>
          <button className="sidebar-close" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <nav>
          <ul>
            <li>
              <Link to="/admin" onClick={closeSidebar}>Dashboard</Link>
            </li>
            
            {/* USERS DROPDOWN */}
            <li className="dropdown">
              <div
                className="dropdown-toggle"
                onClick={() => setUsersOpen(!usersOpen)}
              >
                Users
              </div>
              {usersOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/admin/users/staff" onClick={closeSidebar}>Staff</Link>
                  </li>
                  <li>
                    <Link to="/admin/users/influencers" onClick={closeSidebar}>Influencers</Link>
                  </li>
                </ul>
              )}
            </li>
            
            {/* PRODUCTS LINK */}
            <li>
              <Link to="/admin/products" onClick={closeSidebar}>Products</Link>
            </li>
            
            {/* ORDERS DROPDOWN */}
            <li>
              <Link to="/admin/orders" onClick={closeSidebar}>Orders</Link>
            </li>
            <li>
              <Link to="/admin/DeliveryFees" onClick={closeSidebar}>Delivery Fees</Link>
            </li>
            
            {/* LOGOUT */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="logout-button"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;