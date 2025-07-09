import React, { useState, useEffect } from 'react';
import './../../pages/dashboard/admin/products/AdminProducts.css';

function InfluencerFormModal({ isOpen, onClose, onSave, editingInfluencer }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    instagram: '',
    tiktok: '',
    active: true,
  });

  useEffect(() => {
    if (editingInfluencer) {
      const { _id, ...dataWithoutId } = editingInfluencer;
      setFormData(dataWithoutId);
    } else {
      setFormData({
        name: '',
        code: '',
        email: '',
        phone: '',
        instagram: '',
        tiktok: '',
        active: true,
      });
    }
  }, [editingInfluencer]);

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
      <div className="influencer-modal">
        <h3>{editingInfluencer ? 'Edit Influencer' : 'Add Influencer'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="code" placeholder="Referral Code" value={formData.code} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="instagram" placeholder="Instagram Username" value={formData.instagram} onChange={handleChange} />
            <input type="text" name="tiktok" placeholder="TikTok Username" value={formData.tiktok} onChange={handleChange} />
            <label>
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
              Active
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit">{editingInfluencer ? 'Update' : 'Create'}</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InfluencerFormModal;
