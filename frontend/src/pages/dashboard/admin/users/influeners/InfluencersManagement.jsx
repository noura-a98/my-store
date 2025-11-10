import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from "../../../../../components/ui/data-table";
import InfluencerFormModal from '../../../../../components/modals/influncer/InfluencerFormModal';
import { columns } from "./columns";
import { Button } from './../../../../../components/ui/button';
import './influencer-management.css';

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

        const influencerList = res.data.data;

        const counts = await Promise.all(
          influencerList.map((inf) =>
            axios
              .get(`http://localhost:8000/api/v1/influencers/code/${inf.code}/stats`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then(res => res.data.data.orderCount)
              .catch(() => 0)
          )
        );

        const updatedInfluencers = influencerList.map((inf, i) => ({
          ...inf,
          count: counts[i],
        }));

        setInfluencers(updatedInfluencers);
      } catch (err) {
        console.error('Failed to fetch influencers or counts:', err);
      }
    };

    fetchInfluencers();
  }, [token]);

  const addInfluencer = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/influencers', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const countRes = await axios.get(
        `http://localhost:8000/api/v1/influencers/code/${res.data.data.code}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newInfluencer = {
        ...res.data.data,
        count: countRes.data.data.orderCount,
      };

      setInfluencers((prev) => [...prev, newInfluencer]);
    } catch (err) {
      console.error('Failed to add influencer:', err);
    }
  };

  const updateInfluencer = async (data) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/influencers/${editingInfluencer._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = res.data.data;

      const countRes = await axios.get(
        `http://localhost:8000/api/v1/influencers/code/${updated.code}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updated.count = countRes.data.data.orderCount;

      setInfluencers((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
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
    <div className="page-container">
      <div className="flex-between mb-4">
        <h2 className="text-2xl font-bold">Influencer Management</h2>
        <Button onClick={() => openModal(null)} className="action-button add">
          + Add Influencer
        </Button>
      </div>

      <DataTable
        columns={columns({
          onEdit: (inf) => openModal(inf),
          onDelete: handleDelete,
        })}
        data={influencers}
      />

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
