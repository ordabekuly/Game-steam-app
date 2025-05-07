// src/pages/ManageUsers.jsx

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

function ManageUsers() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [roleModalIsOpen, setRoleModalIsOpen] = useState(false);
    const [userToUpdateRole, setUserToUpdateRole] = useState(null);
    const [newRole, setNewRole] = useState('');

    const roles = ['user', 'admin', 'developer'];

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Access denied! Only admins can manage users.');
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get('/users')
            .then((res) => {
                const filteredUsers = res.data.filter((u) => u.id !== user.id);
                setUsers(filteredUsers);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
            });
    }, [user]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/users/${userToDelete.id}`);
            setUsers(users.filter((u) => u.id !== userToDelete.id));
            toast.success('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
        setModalIsOpen(false);
    };

    const handleBan = async (userId) => {
        try {
            const res = await axios.post(`/users/${userId}/ban`);
            setUsers(users.map((u) => (u.id === userId ? res.data.user : u)));
            toast.info('User banned');
        } catch (error) {
            console.error('Error banning user:', error);
            toast.error('Failed to ban user');
        }
    };

    const handleUnban = async (userId) => {
        try {
            const res = await axios.post(`/users/${userId}/unban`);
            setUsers(users.map((u) => (u.id === userId ? res.data.user : u)));
            toast.success('User unbanned');
        } catch (error) {
            console.error('Error unbanning user:', error);
            toast.error('Failed to unban user');
        }
    };

    const handleRoleChange = async () => {
        if (!newRole) {
            toast.error('Please select a role');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('role', newRole);
            const res = await axios.put(`/users/${userToUpdateRole.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUsers(users.map((u) => (u.id === userToUpdateRole.id ? res.data : u)));
            toast.success('Role updated successfully!');
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
        setRoleModalIsOpen(false);
        setNewRole('');
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setModalIsOpen(true);
    };

    const openRoleModal = (user) => {
        setUserToUpdateRole(user);
        setNewRole(user.role);
        setRoleModalIsOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-white font-bold mb-4">Manage Users (Admins Only)</h1>
            <ul className="space-y-4">
                {users.map((u) => (
                    <li key={u.id} className="bg-gray-800 bg-opacity-95 flex justify-between items-center border-b pb-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-white">{u.name}</span>
                            <span className="text-sm text-yellow-600">{u.email}</span>
                            <span className="text-sm text-blue-300">
                                {u.role} — {u.isBanned ? '🔒 Banned' : '✅ Active'}
                            </span>
                        </div>
                        <div className="space-x-2">
                            {u.isBanned ? (
                                <button
                                    onClick={() => handleUnban(u.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Unban
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBan(u.id)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Ban
                                </button>
                            )}
                            <button
                                onClick={() => openRoleModal(u)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Change Role
                            </button>
                            <button
                                onClick={() => openDeleteModal(u)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Delete Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="bg-gray-800 p-6 rounded shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl text-red-700 font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-xl text-red-800 font-semibold">Are you sure you want to delete {userToDelete?.name}?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            {/* Role Modal */}
            <Modal
                isOpen={roleModalIsOpen}
                onRequestClose={() => setRoleModalIsOpen(false)}
                className="bg-gray-800 p-6 rounded shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-xl text-blue-600 font-semibold mb-4">
                    Change Role for {userToUpdateRole?.name}
                </h2>
                <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="bg-gray-600 border p-2 rounded w-full mb-4"
                >
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleRoleChange}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Update Role
                    </button>
                    <button
                        onClick={() => setRoleModalIsOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default ManageUsers;
