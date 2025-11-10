import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    recentUsers: [],
    recentOrders: []
  });

  const token = localStorage.getItem('token'); // Or however you're storing the token

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [usersRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/users', { headers }),
          axios.get('http://localhost:8000/api/v1/orders', { headers })
        ]);

        const users = usersRes?.data?.data || [];
        const orders = ordersRes?.data?.data || [];

    const validOrders = orders.filter(order => order.status !== 'cancelled');

    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pendingOrdersCount = validOrders.filter(order => order.status === 'pending').length;

    setStats({
      totalUsers: users.length,
      totalOrders: validOrders.length,
      revenue: totalRevenue.toFixed(2),
      pendingOrders: pendingOrdersCount,
      recentUsers: users.slice(-3).reverse(),
      recentOrders: validOrders.slice(-3).reverse()
    });

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="admin-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="admin-card">
          <h3>Revenue</h3>
          <p>AED {stats.revenue}</p>
        </div>
        <div className="admin-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h2>Recent Users</h2>
          <ul>
            {stats.recentUsers.map((user, i) => (
              <li key={user._id || i}>
                {user.firstName} - {user.email}
              </li>
            ))}
          </ul>
        </div>

        <div className="widget">
          <h2>Recent Orders</h2>
          <ul>
            {stats.recentOrders.map((order, i) => (
              <li key={order._id || i}>
                #{order._id.slice(-4)} - AED {order.totalPrice} - {order.paymentMethod.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
