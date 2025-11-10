import React, { useState, useEffect } from "react";
import axios from "axios";
import UserFormModal from "../../../../../components/modals/staff/UserFormModal";
import { columns } from "./columns";
import { DataTable } from "../../../../../components/ui/data-table";
import './AdminUsers.css'
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const res = await axios.patch(
          `http://localhost:8000/api/v1/users/${userData._id}`,
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === userData._id ? res.data.data : u))
        );
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/users/createAccount",
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers((prev) => [...prev, res.data.data.user]);
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.userName} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex-between">
        <h2>Users Management</h2>
        <div className="flex-between">
          <input
            className="search-input"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="action-button add"
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <DataTable
          columns={columns({
            onEdit: (user) => {
              setEditingUser(user);
              setShowModal(true);
            },
            onDelete: handleDeleteUser,
          })}
          data={filteredUsers}
        />
      </div>

      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingUser={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}

export default UsersManagement;
