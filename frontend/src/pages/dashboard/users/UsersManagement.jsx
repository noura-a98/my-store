import React, { useState } from 'react';
import './../css/AdminUsers.css';
import UserFormModal from '../../../../components/UserFormModal';

const dummyUsers = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'johndoe',
    email: 'john@example.com',
    phone: '0501234567',
    role: 'admin',
  },
  {
    _id: '2',
    firstName: 'Fatima',
    lastName: 'Ali',
    userName: 'fatima23',
    email: 'fatima@example.com',
    phone: '0558765432',
    role: 'influencer',
  },
];

function UsersManagement() {
  const [users, setUsers] = useState(dummyUsers);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

  return (
    <div className="users-management">
      <div className="header">
        <h2>Users Management</h2>
            <button className="add-user" onClick={() => {
            setEditingUser(null);
            setShowModal(true);
            }}>
  + Add User
</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.userName}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
              <td>
<button className="edit-btn" onClick={() => {
  setEditingUser(u);
  setShowModal(true);
}}>
  Edit
</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    <UserFormModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  editingUser={editingUser}
  onSave={(userData) => {
    // Replace this with API logic later
    if (editingUser) {
      setUsers(prev => prev.map(u => u._id === userData._id ? userData : u));
    } else {
      setUsers(prev => [...prev, { ...userData, _id: Date.now().toString() }]);
    }
  }}
/>

    </div>
    
  );
}

export default UsersManagement;
