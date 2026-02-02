import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Trash2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const [filter, setFilter] = useState<'all' | 'admin' | 'hr'>('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                fetchUsers();
                setIsModalOpen(false);
                reset();
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error("Failed to create user", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const filteredUsers = users.filter(u => filter === 'all' || u.role === filter);

    return (
        <div className="space-y-6">
            <Helmet>
                <title>User Management | Admin</title>
            </Helmet>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center px-4 py-2 rounded-lg font-bold"
                >
                    <UserPlus className="mr-2" size={20} /> Add User
                </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {['all', 'admin', 'hr'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-black' : 'bg-surface border border-white/10 text-gray-400 hover:text-white'
                            }`}
                    >
                        {f === 'all' ? 'All Users' : f}s
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-gray-400 min-w-[800px]">
                    <thead className="text-xs uppercase bg-white/5 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-white">{u.name} {u._id === user?._id && '(You)'}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4 capitalize">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'super-admin' ? 'bg-purple-500/20 text-purple-400' :
                                        u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {u._id !== user?._id && (
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-surface p-8 rounded-xl border border-white/10 w-full max-w-md relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input {...register('name', { required: true })} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input {...register('email', { required: true })} type="email" className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Password</label>
                                <input {...register('password', { required: true })} type="password" className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Role</label>
                                <select {...register('role')} className="w-full bg-background border border-white/10 rounded p-2 text-white">
                                    <option value="admin">Admin</option>
                                    <option value="hr">HR</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary py-2 rounded font-bold text-black mt-4">Create User</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
