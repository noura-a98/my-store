import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const STATUSES = [
  'pending',
  'processing',
  'assigned',
  'out-for-delivery',
  'delivered',
  'cancelled',
];

export default function AllOrders() {
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [draft, setDraft] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [ordersRes, driversRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/orders', { headers }),
          axios.get('http://localhost:8000/api/v1/users?role=driver', { headers }),
        ]);

        setOrders(ordersRes.data.data);
        // Filter drivers on client-side as additional safeguard
        const filteredDrivers = driversRes.data.data.filter(user => 
          user.role === 'driver' || user.role === 'Driver'
        );
        setDrivers(filteredDrivers);

        const d = {};
        ordersRes.data.data.forEach(o => {
          d[o._id] = {
            driverId: o.driverId?._id || '',
            status: o.status,
          };
        });
        setDraft(d);
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchData();
  }, [token]);

  const filtered = orders.filter(o =>
    activeTab === 'all' ? true : o.status === activeTab
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const badgeClass = s =>
    `badge ${
      {
        pending: 'badge-yellow',
        processing: 'badge-orange',
        assigned: 'badge-blue',
        'out-for-delivery': 'badge-cyan',
        delivered: 'badge-green',
        cancelled: 'badge-red',
      }[s]
    }`;

  const onDraftChange = (id, field, val) =>
    setDraft(p => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const saveRow = async id => {
    const { driverId, status } = draft[id];
    
    // Check if status requires a driver
    const statusesRequiringDriver = ['assigned', 'out-for-delivery', 'delivered'];
    const requiresDriver = statusesRequiringDriver.includes(status);
    
    // Validation: status is required, driver required only for certain statuses
    if (!status) {
      setToast('Please select a status ✗');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    
    if (requiresDriver && !driverId) {
      setToast('Driver required for this status ✗');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { status };
      
      // Only include driverId if it's provided (for statuses that need it)
      if (driverId) {
        payload.driverId = driverId;
      }
      
      const res = await axios.patch(
        `http://localhost:8000/api/v1/orders/${id}/assign`,
        payload,
        { headers }
      );

      setOrders(p => p.map(o => (o._id === id ? res.data.data : o)));
      setToast('Order saved ✓');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setToast('Save failed ✗');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="users-management">
        <div className="header-row">
          <h2>Orders</h2>
          {toast && <span className="toast">{toast}</span>}
        </div>

        <div className="tabs">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              className={s === activeTab ? 'tab active' : 'tab'}
              onClick={() => {
                setActiveTab(s);
                setCurrentPage(1);
              }}
            >
              {s === 'all' ? 'All' : s.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order #</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Delivery Fee</th>
                <th>Total</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Payment</th>
                <th>Message</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Save</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o, i) => (
                <tr key={o._id}>
                  <td data-label="#">{(currentPage - 1) * rowsPerPage + i + 1}</td>
                  <td data-label="Order #">{o.orderNumber}</td>
                  <td data-label="Customer">{o.customerName}</td>
                  <td data-label="Product">
                    <div className="product-info">
                      <div className="product-name">{o.product?.name || 'N/A'}</div>
                    </div>
                  </td>
                  <td data-label="Unit Price">AED {o.productPrice || o.product?.price || 0}</td>
                  <td data-label="Qty">
                    <span className="quantity-badge">{o.quantity}</span>
                  </td>
                  <td data-label="Subtotal">
                    AED {(o.productPrice * o.quantity).toFixed(2)}
                  </td>
                  <td data-label="Delivery Fee">
                    <span className="delivery-fee">AED {o.deliveryFee}</span>
                  </td>
                  <td data-label="Total">
                    <strong>AED {o.totalPrice}</strong>
                  </td>
                  <td data-label="Address">
                    <div className="address-info">
                      <div>{o.shipping?.address || 'N/A'}</div>
                      {o.shipping?.city && <small>{o.shipping.city}</small>}
                    </div>
                  </td>
                  <td data-label="Phone">{o.phone}</td>
                  <td data-label="Payment">
                    <div className="payment-method">
                      <span className={`payment-badge ${o.paymentMethod}`}>
                        {o.paymentMethod?.toUpperCase() || 'COD'}
                      </span>
                    </div>
                  </td>
                  <td data-label="Message">
                      {o.message ? (
                        <div  title={o.message}>
                          {o.message.length > 30 ? `${o.message.substring(0, 30)}...` : o.message}
                        </div>
                      ) : (
                        <span className="no-message">No message</span>
                      )}
                    
                  </td>
                  <td data-label="Driver">
                    <select
                      className="driver-select"
                      style={{ backgroundColor: 'white' }}
                      value={draft[o._id]?.driverId || ''}
                      onChange={e => onDraftChange(o._id, 'driverId', e.target.value)}
                    >
                      <option value="">
                        {['assigned', 'out-for-delivery', 'delivered'].includes(draft[o._id]?.status) 
                          ? 'Select Driver (Required)' 
                          : 'Select Driver (Optional)'
                        }
                      </option>
                      {drivers.map(d => (
                        <option key={d._id} value={d._id}>
                          {d.firstName} {d.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Status">
                    <select
                      className={`status-select ${draft[o._id]?.status}`}
                      value={draft[o._id]?.status}
                      onChange={e => onDraftChange(o._id, 'status', e.target.value)}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Actions">
                    <button className="edit-btn" onClick={() => saveRow(o._id)}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="16" style={{ textAlign: 'center' }}>
                    No orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={i + 1 === currentPage ? 'page-btn active' : 'page-btn'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}