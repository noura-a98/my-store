import React, { useState, useEffect } from 'react';
import './UserFormModal.css'
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
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder='First Name'
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder='Last Name'
          required
        />
      </div>

      <div className="form-group">
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder='Email'
          required
        />
      </div>

      <div className="form-group">
        <input
          id="phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder='Phone'

          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
          <option value="influencer">Influencer</option>
        </select>
      </div>

      {!editingUser && (
        <>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
             placeholder='Confirm Password'
              required
              minLength={8}
            />
          </div>
        </>
      )}

    
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
