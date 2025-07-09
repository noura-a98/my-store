// import './../pages/css/AdminDashboard.css';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'; // install via: npm install axios
function DashboardLayout() {
  const location = useLocation();
  const [ordersOpen, setOrdersOpen] = useState(location.pathname.includes('/admin/orders'));


  const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8000/api/v1/users/logout', {}, { withCredentials: true });
    localStorage.removeItem('token'); // optional, if you're storing token
    window.location.href = '/login';  // or use navigate()
  } catch (err) {
    console.error('Logout failed', err);
  }
};

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
          <li className="dropdown">
            <span>Users</span>
            <ul className="dropdown-menu">
              <li><Link to="/admin/users/staff">Staff</Link></li>
              <li><Link to="/admin/users/influencers">Influencers</Link></li>
            </ul>
          </li>            
          <li><Link to="products">Products</Link></li>

            <li className="dropdown">
              <div
                className="dropdown-toggle"
                onClick={() => setOrdersOpen(!ordersOpen)}>Orders 
              </div>
              {ordersOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="orders/new">New Orders</Link></li>
                  <li><Link to="orders/all">All Orders</Link></li>
                </ul>
              )}
            </li>

<li>
  <button onClick={handleLogout} style={{
    background: 'none',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%'
  }}>
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
