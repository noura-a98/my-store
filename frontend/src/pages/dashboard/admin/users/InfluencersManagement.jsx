import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css'; // You can extract to InfluencerManagement.css if needed
import InfluencerFormModal from '../../../../components/modals/InfluencerFormModal';

function InfluencerManagement() {
  const [influencers, setInfluencers] = useState([]);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/influencers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfluencers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch influencers:', err);
      }
    };
    fetchInfluencers();
  }, [token]);

  const addInfluencer = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/influencer', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfluencers((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error('Failed to add influencer:', err);
    }
  };

  const updateInfluencer = async (data) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/v1/influencers/${editingInfluencer._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfluencers((prev) =>
        prev.map((i) => (i._id === editingInfluencer._id ? res.data.data : i))
      );
    } catch (err) {
      console.error('Failed to update influencer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this influencer?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/influencers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfluencers((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error('Failed to delete influencer:', err);
    }
  };

  const openModal = (influencer = null) => {
    setEditingInfluencer(influencer);
    setShowModal(true);
  };

  return (
    <div className="influencer-management">
      <div className="header">
        <h2>Influencer Management</h2>
        <button className="add-user" onClick={() => openModal(null)}>+ Add Influencer</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Code</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Instagram</th>
            <th>TikTok</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((inf, idx) => (
            <tr key={inf._id}>
              <td>{idx + 1}</td>
              <td>{inf.name}</td>
              <td>{inf.code}</td>
              <td>{inf.email}</td>
              <td>{inf.phone}</td>
              <td>{inf.instagram || '-'}</td>
              <td>{inf.tiktok || '-'}</td>
              <td>
                <button className="edit-btn" onClick={() => openModal(inf)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(inf._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <InfluencerFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInfluencer(null);
        }}
        editingInfluencer={editingInfluencer}
        onSave={async (formData) => {
          if (editingInfluencer) {
            await updateInfluencer(formData);
          } else {
            await addInfluencer(formData);
          }
          setShowModal(false);
          setEditingInfluencer(null);
        }}
      />
    </div>
  );
}

export default InfluencerManagement;
