import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';
import UserFormModal from '../../../../components/modals/UserFormModal';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, [token]);

 const addUser = async (userData) => {
  try {
    const { userName, ...dataWithoutUserName } = userData;
    const res = await axios.post('http://localhost:8000/api/v1/users/createAccount', dataWithoutUserName, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers((prev) => [...prev, res.data.data.user]);
  } catch (error) {
    console.error('Failed to add user:', error);
  }
};


  const updateUser = async (userData) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/v1/users/${userData._id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map(u => u._id === userData._id ? res.data.data : u));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
const deleteUser = async (userId) => {
  try {
    await axios.delete(`http://localhost:8000/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove deleted user from state
    setUsers((prev) => prev.filter(user => user._id !== userId));
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

  return (
    <div className="users-management">
      <div className="header">
        <h2>Users Management</h2>
        <button
          className="add-user"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          + Add User
        </button>
      </div>

   <table className="users-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>User Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u, index) => (
      <tr key={u._id}>
        <td data-label="#"> {index + 1} </td>
        <td data-label="Name">{u.firstName} {u.lastName}</td>
        <td data-label="User Name">{u.userName}</td>
        <td data-label="Email">{u.email}</td>
        <td data-label="Phone">{u.phone}</td>
        <td data-label="Role"><span className={`role-badge ${u.role}`}>{u.role}</span></td>
        <td data-label="Actions">
          <button
            className="edit-btn"
            onClick={() => {
              setEditingUser(u);
              setShowModal(true);
            }}
          >
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this user?')) {
                deleteUser(u._id);
              }
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingUser={editingUser}
        onSave={async (userData) => {
          if (editingUser) {
            await updateUser(userData);
          } else {
            await addUser(userData);
          }
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default UsersManagement;
