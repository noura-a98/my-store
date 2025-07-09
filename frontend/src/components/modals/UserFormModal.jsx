import React, { useState, useEffect } from 'react';
import './../../pages/dashboard/admin/users/AdminUsers.css';

function UserFormModal({ isOpen, onClose, onSave, editingUser }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    role: 'admin',
    password: '',
    passwordConfirm: '',
    active: true,
  });

 useEffect(() => {
  if (editingUser) {
    // DON'T strip out _id, keep it for update
    setFormData(editingUser);
  } else {
    setFormData({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phone: '',
      role: 'admin',
    });
  }
}, [editingUser]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="user-modal">
        <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
         
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="driver">Driver</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          {/* Show password fields only when adding a user */}
          {!editingUser && (
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm Password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          )}

          {/* Active checkbox */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              /> Active
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
