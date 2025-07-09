// AllOrders.jsx
import React, { useState } from 'react';
import './Orders.css';

const dummyOrders = [
  {
    _id: 'ORD001',
    customerName: 'Alice',
    product: 'Sweet Drops',
    quantity: 2,
    totalPrice: 98,
    status: 'assigned',
    driver: 'Driver One'
  },
  {
    _id: 'ORD002',
    customerName: 'Bob',
    product: 'Vanilla Sweet',
    quantity: 1,
    totalPrice: 49,
    status: 'out-for-delivery',
    driver: 'Driver Two'
  }
];

function AllOrders() {
  const [orders, setOrders] = useState(dummyOrders);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="orders-container">
      <h2>All Orders</h2>
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
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>AED {order.totalPrice}</td>
              <td>{order.driver}</td>
              <td>
                <select onChange={(e) => handleStatusUpdate(order._id, e.target.value)} value={order.status}>
                  <option value="assigned">Assigned</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
              <td><button className="assign-btn">Update</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllOrders;
