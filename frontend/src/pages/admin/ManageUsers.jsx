import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FiMail, FiTrash2, FiShield, FiPlus, FiX, FiUser, FiLock, FiMenu } from "react-icons/fi";
import { useAppData } from "../../context/AppDataContext";

export default function ManageUsers() {
  const { users, addUser, removeUser, toggleUserStatus } = useAppData();
  // Ensure we actually have these functions from context, if not, provide fallbacks to prevent crash
  // const safeAddUser = addUser || (() => console.warn("addUser not implemented"));

  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "User" });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        await removeUser(id);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    // Call context function to update status
    await toggleUserStatus(id, currentStatus);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const user = {
      ...newUser,
      username: newUser.name, // Ensure username format
      email: newUser.email,
      password: newUser.password
      // role not supported by default signup yet unless admin
    };

    try {
        await addUser(user);
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", role: "User" });
    } catch(err) {
        alert("Failed to add user");
    }
  };

  return (
    <div className="flex bg-cyber-dark1 min-h-screen text-white font-inter relative">
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-cyber-dark2 rounded-lg text-white shadow-lg border border-white/10">
            <FiMenu size={24} />
        </button>
      </div>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 relative transition-all duration-300 pt-16 md:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyber-blue">User Management</h1>
            <p className="text-gray-400 mt-1">Manage user access and roles</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            <FiPlus /> Add New User
          </Button>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
              
              <h2 className="text-2xl font-bold font-poppins text-white mb-6">Add New User</h2>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <div className="relative">
                    <InputField 
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="pl-10"
                    />
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <InputField 
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="pl-10"
                    />
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Password</label>
                  <div className="relative">
                    <InputField 
                      type="password"
                      placeholder="Create temporary password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="pl-10"
                    />
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full py-3">
                    Create User
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Joined Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {users.filter(user => user.role !== 'Admin').map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <FiMail className="w-3 h-3" /> {user.email}
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {user.role === 'Admin' ? <FiShield className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                            {user.role === 'Admin' ? 'Admin' : 'Customer'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                        {user.addresses && user.addresses.length > 0 
                            ? `${user.addresses[0].city}, ${user.addresses[0].state}`
                            : <span className="text-gray-600 italic">No Address</span>
                        }
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.joined}</td>
                    <td className="px-6 py-4">
                       <button 
                           onClick={() => toggleStatus(user.id, user.status)} 
                           className={`px-3 py-1 rounded-full text-xs font-bold border transition hover:opacity-80 active:scale-95 ${
                               user.status === 'Active' 
                               ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                               : 'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}
                       >
                         {user.status || "Active"}
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleDelete(user.id)}
                         className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition rounded-lg text-gray-400"
                       >
                          <FiTrash2 />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}