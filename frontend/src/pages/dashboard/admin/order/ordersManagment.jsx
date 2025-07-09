// NewOrders.jsx
import React, { useState } from 'react';
import './Orders.css';

const dummyOrders = [
  {
    _id: 'ORD001',
    customerName: 'Alice',
    product: 'Sweet Drops',
    quantity: 2,
    totalPrice: 98,
    status: 'pending',
    driverId: null
  },
  {
    _id: 'ORD002',
    customerName: 'Bob',
    product: 'Vanilla Sweet',
    quantity: 1,
    totalPrice: 49,
    status: 'processing',
    driverId: null
  }
];

const dummyDrivers = [
  { _id: 'DRV1', name: 'Driver One' },
  { _id: 'DRV2', name: 'Driver Two' }
];

function NewOrders() {
  const [orders, setOrders] = useState(dummyOrders);

  const handleAssign = (orderId, driverId, status) => {
    setOrders(prev => prev.map(order => order._id === orderId ? { ...order, driverId, status } : order));
  };

  return (
    <div className="orders-container">
      <h2>New Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter(o => o.status === 'pending' || o.status === 'processing').map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>AED {order.totalPrice}</td>
              <td>
                <select onChange={(e) => handleAssign(order._id, e.target.value, order.status)} defaultValue={order.driverId || ''}>
                  <option value=''>Select Driver</option>
                  {dummyDrivers.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select onChange={(e) => handleAssign(order._id, order.driverId, e.target.value)} defaultValue={order.status}>
                  <option value="processing">Processing</option>
                  <option value="assigned">Assigned</option>
                </select>
              </td>
              <td><button className="assign-btn">Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewOrders;
