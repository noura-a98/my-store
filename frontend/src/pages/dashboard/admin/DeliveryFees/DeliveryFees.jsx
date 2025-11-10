import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryFees.css'; // We'll write styles here

export default function DeliveryFees() {
  const token = localStorage.getItem('token');

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Form state
  const [form, setForm] = useState({ city: '', fee: '' });
  const [editId, setEditId] = useState(null); // null means add mode, otherwise edit mode

  // Fetch all fees on mount
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8000/api/v1/deliveryFee', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(res.data.data);
    } catch (err) {
      setError('Failed to load delivery fees.');
    }
    setLoading(false);
  };

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validateForm = () => {
    if (!form.city.trim()) {
      setError('City name is required.');
      return false;
    }
    if (!form.fee || isNaN(form.fee) || Number(form.fee) < 0) {
      setError('✨Fee must be a positive number.');
      return false;
    }
    return true;
  };

  // Add or Update fee
  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (editId) {
        // Update
        const res = await axios.patch(
          `http://localhost:8000/api/v1/deliveryFee/${editId}`,
          { city: form.city.trim(), fee: Number(form.fee) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFees(fees.map(f => (f._id === editId ? res.data.data : f)));
        setToast('✨Fee updated successfully!');
      } else {
        // Create new
        const res = await axios.post(
          'http://localhost:8000/api/v1/deliveryFee',
          { city: form.city.trim(), fee: Number(form.fee) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFees([...fees, res.data.data]);
        setToast('✨Fee added successfully!');
      }
      setForm({ city: '', fee: '' });
      setEditId(null);
    } catch (err) {
      setError('Failed to save delivery fee.');
    }

    setLoading(false);
    setTimeout(() => setToast(''), 3000);
  };

  // Delete fee
  const onDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:8000/api/v1/deliveryFee/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(fees.filter(f => f._id !== id));
      setToast('✔️Fee deleted!');
    } catch (err) {
      setError('Failed to delete fee.');
    }
    setLoading(false);
    setTimeout(() => setToast(''), 3000);
  };

  // Start editing
  const onEdit = fee => {
    setForm({ city: fee.city, fee: fee.fee.toString() });
    setEditId(fee._id);
    setError('');
  };

  // Cancel editing
  const onCancel = () => {
    setForm({ city: '', fee: '' });
    setEditId(null);
    setError('');
  };

  return (
    <div className="page-container delivery-fees-page">
      <h2>Delivery Fees Management</h2>

        <div className="toast-wrapper">
            {toast && <div className="toast success">{toast}</div>}
            {error && <div className="toast error">{error}</div>}
     </div>


      <form onSubmit={onSubmit} className="fee-form">
        <input
          type="text"
          name="city"
          placeholder="City Name"
          value={form.city}
          onChange={onChange}
          disabled={loading}
        />
        <input
          type="number"
          name="fee"
          placeholder="Delivery Fee (AED)"
          value={form.fee}
          onChange={onChange}
          disabled={loading}
          min="0"
          step="0.01"
        />
        <button type="submit" disabled={loading}>
          {editId ? 'Update Fee' : 'Add Fee'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="fees-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Fee (AED)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No delivery fees found.
                </td>
              </tr>
            ) : (
              fees.map(fee => (
                <tr key={fee._id}>
                  <td>{fee.city}</td>
                  <td>{fee.fee.toFixed(2)}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(fee)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(fee._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
