import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, User } from "lucide-react";

const UserManagement = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([
    { id: 1, username: "admin", role: "admin" },
    { id: 2, username: "tech1", role: "Lab Technician" },
    { id: 3, username: "labview", role: "Inventory Assistant" },
  ]);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
    customRole: "",
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) return;

    const finalRole =
      newUser.role === "user" && newUser.customRole.trim()
        ? newUser.customRole.trim()
        : newUser.role;

    setUsers([
      ...users,
      {
        id: Date.now(),
        username: newUser.username,
        role: finalRole,
      },
    ]);

    setNewUser({
      username: "",
      password: "",
      role: "user",
      customRole: "",
    });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-8 text-indigo-600 flex items-center gap-2">
        <User size={28} /> User Management
      </h2>

      {/* Add User Form */}
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
        <input
          type="text"
          placeholder="Username"
          className="p-3 border rounded-lg w-full"
          value={newUser.username}
          onChange={(e) =>
            setNewUser({ ...newUser, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded-lg w-full"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
        />
        <div>
          <select
            className="p-3 border rounded-lg w-full"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value, customRole: "" })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {newUser.role === "user" && (
            <input
              type="text"
              placeholder="Custom role (e.g. Lab Technician)"
              className="mt-2 p-3 border rounded-lg w-full"
              value={newUser.customRole}
              onChange={(e) =>
                setNewUser({ ...newUser, customRole: e.target.value })
              }
            />
          )}
        </div>
        <button
          onClick={handleAddUser}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add User
        </button>
      </div>

      {/* Users List */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-sm text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
