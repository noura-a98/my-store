import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Package, CheckCircle, Truck, LogOut } from 'lucide-react';
import './DriverDashboard.css';

const DRIVER_STATUSES = [
  'assigned',
  'out-for-delivery',
  'delivered'
];

export default function DriverDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('assigned');
  const [currentUser, setCurrentUser] = useState(null);

  // ADD THE PROTECTION HERE - Right after state declarations
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true }); // Add replace: true here too
      
      setToast('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeUser('user');
      navigate('/login', { replace: true }); // Add replace: true here too
    }
  };

  useEffect(() => {
    // Only fetch if token exists
    if (token) {
      fetchDriverOrders();
    }
  }, [token]); // Add token as dependency

  const fetchDriverOrders = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Get current user info
      const userResponse = await axios.get('http://localhost:8000/api/v1/users/me', { headers });
      const currentUserId = userResponse.data.data._id;
      setCurrentUser(userResponse.data.data);
      
      // Get orders
      const response = await axios.get('http://localhost:8000/api/v1/orders', { headers });
      
      // Filter orders assigned to current driver
      const driverOrders = response.data.data.filter(order => 
        order.driverId && order.driverId._id === currentUserId
      );
      
      setOrders(driverOrders);
    } catch (error) {
      console.error('Failed to fetch driver orders:', error);
      // Handle unauthorized access
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      setToast('Failed to fetch orders');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.patch(
        `http://localhost:8000/api/v1/orders/${orderId}/assign`,
        { status: newStatus },
        { headers }
      );

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );

      setToast(`Order ${newStatus.replace('-', ' ')}!`);
      setTimeout(() => setToast(''), 2000);

    } catch (error) {
      console.error('Failed to update order status:', error);
      // Handle unauthorized access
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      setToast('Update failed');
      setTimeout(() => setToast(''), 2000);
    }
  };

  // Don't render anything if no token (component will redirect)
  if (!token) {
    return null;
  }

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      'assigned': Package,
      'out-for-delivery': Truck,
      'delivered': CheckCircle
    };
    return icons[status] || Package;
  };

  const getStatusClass = (status) => {
    const classes = {
      'assigned': 'status-assigned',
      'out-for-delivery': 'status-delivery',
      'delivered': 'status-delivered'
    };
    return classes[status] || 'status-assigned';
  };

  const todayDelivered = orders.filter(o => 
    o.status === 'delivered' && 
    new Date(o.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-row">
            <div>
              <h1 className="header-title">Driver</h1>
              {currentUser && (
                <p className="header-subtitle">Hi, {currentUser.firstName}</p>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-number stats-blue">
              {orders.filter(o => o.status === 'assigned').length}
            </div>
            <div className="stats-label">New</div>
          </div>
          <div className="stats-card">
            <div className="stats-number stats-orange">
              {orders.filter(o => o.status === 'out-for-delivery').length}
            </div>
            <div className="stats-label">Delivering</div>
          </div>
          <div className="stats-card">
            <div className="stats-number stats-green">{todayDelivered}</div>
            <div className="stats-label">Done Today</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          {DRIVER_STATUSES.map(status => {
            const StatusIcon = getStatusIcon(status);
            const count = orders.filter(o => o.status === status).length;
            
            return (
              <button
                key={status}
                className={`tab-button ${status === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(status)}
              >
                <StatusIcon size={16} />
                <span>
                  {status === 'assigned' ? 'New' : 
                   status === 'out-for-delivery' ? 'Delivery' : 'Done'}
                </span>
                {count > 0 && (
                  <span className="tab-badge">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders */}
        <div className="orders-container">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div key={order._id} className="order-card">
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-header-row">
                      <div className="order-status-section">
                        <div className={`status-icon ${getStatusClass(order.status)}`}>
                          <StatusIcon size={16} />
                        </div>
                        <div>
                          <h3 className="order-number">#{order.orderNumber}</h3>
                          <p className="order-time">{formatTime(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="order-price-section">
                        <div className="order-price">AED {order.totalPrice}</div>
                        <div className="order-quantity">{order.quantity} item(s)</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="order-content">
                    {/* Customer Info */}
                    <div className="customer-section">
                      <div className="customer-info">
                        <h4 className="customer-name">{order.customerName}</h4>
                        <p className="product-name">{order.product?.name}</p>
                        <p className="customer-phone">{order.phone}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="address-section">
                      <MapPin size={16} className="address-icon" />
                      <div className="address-info">
                        <p className="address-line">{order.shipping?.address}</p>
                        <p className="address-city">{order.shipping?.city}</p>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {order.message && (
                      <div className="instructions">
                        <div className="instructions-content">
                          <div className="instructions-icon">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="instructions-text">{order.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {order.status === 'assigned' && (
                      <button
                        className="action-button action-start"
                        onClick={() => updateOrderStatus(order._id, 'out-for-delivery')}
                      >
                        Start Delivery
                      </button>
                    )}
                    
                    {order.status === 'out-for-delivery' && (
                      <button
                        className="action-button action-deliver"
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <Package className="empty-icon" size={48} />
              <h3 className="empty-title">
                No {activeTab.replace('-', ' ')} orders
              </h3>
              <p className="empty-description">Check back later for new assignments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}