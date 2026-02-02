import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, Mail, Trash2 } from 'lucide-react';

// Mock data until specific backend routes are fully connected via a service
// In production, we would fetch from /api/users and /api/contact

const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'inbox'>('users');

    useEffect(() => {
        // Fetch Users (Simulated or Real)
        // fetch('/api/auth/users')... 
        // For now, let's just show current user as placeholder
        if (user) setUsers([user]);

        // Fetch Messages
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/contact', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.name}. Manage system users and communications.</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="text-primary" size={24} />
                        <span className="text-2xl font-bold text-white">{users.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Active System Users</p>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <Mail className="text-primary" size={24} />
                        <span className="text-2xl font-bold text-white">{messages.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Total Inquiries</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-white/10 pb-2">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'inbox' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    Contact Inbox
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
                {activeTab === 'users' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">System Users</h2>
                            <button className="flex items-center btn-primary px-4 py-2 rounded-lg font-bold text-sm">
                                <UserPlus size={18} className="mr-2" /> Invite User
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
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
                                            <td className="px-6 py-4 text-green-400">Active</td>
                                            <td className="px-6 py-4">
                                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'inbox' && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Inquiries</h2>
                        {messages.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No messages found.</p>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg: any) => (
                                    <div key={msg._id} className="bg-background p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{msg.subject || 'No Subject'}</h3>
                                                <div className="text-sm text-primary">{msg.name} &lt;{msg.email}&gt;</div>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
