import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Trash2, X, Key, ShieldAlert, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const { register: registerReset, handleSubmit: handleSubmitReset, reset: resetPasswordForm, setValue } = useForm();
    const [filter, setFilter] = useState<'all' | 'admin' | 'hr'>('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
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
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
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

    const handleResetPassword = async (data: any) => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password: data.password })
            });
            if (res.ok) {
                alert(`Password updated for ${selectedUser.name}`);
                setIsResetModalOpen(false);
                resetPasswordForm();
                setSelectedUser(null);
                setShowPassword(false);
            } else {
                alert('Failed to update password');
            }
        } catch (error) {
            console.error("Failed to update password", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setValue('password', password);
        setShowPassword(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
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
        <div className="space-y-8 animate-fade-in">
            <Helmet>
                <title>User Management | Aarvion Admin</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text">User Management</h1>
                    <p className="text-text-muted mt-1 text-sm">Create and manage administrator accounts for the platform.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center px-6 py-2.5 rounded-xl font-bold"
                >
                    <UserPlus className="mr-2" size={20} /> Add New Admin
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-1 bg-surface/50 rounded-xl border border-border w-fit">
                {['all', 'admin', 'hr'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-primary text-black shadow-sm' : 'text-text-muted hover:text-text'
                            }`}
                    >
                        {f === 'all' ? 'All Roles' : f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden overflow-x-auto border border-border/50">
                <table className="w-full text-left text-text-muted min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border bg-background/30">
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Administrator</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Email Address</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Access Level</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-gradient border border-border flex items-center justify-center text-primary font-bold shadow-sm">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text">{u.name} {u._id === currentUser?._id && <span className="text-[10px] text-primary ml-1">(You)</span>}</p>
                                            <p className="text-[10px] text-text-muted italic leading-none mt-1">ID: {u._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm">{u.email}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        u.role === 'super-admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                        u.role === 'admin' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                        'bg-brand-green/10 border-brand-green/20 text-brand-green'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {u._id !== currentUser?._id && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setIsResetModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                                                    title="Reset Password"
                                                >
                                                    <Key size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u._id)}
                                                    className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center text-text-muted">
                        <p className="text-lg font-medium">No users found matching this criteria.</p>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-8 relative z-10 shadow-strong animate-slide-up glass">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-text">Add New Admin</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text p-1 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted ml-1 uppercase">Full Name</label>
                                <input {...register('name', { required: true })} className="w-full bg-background border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary transition-all" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted ml-1 uppercase">Email Address</label>
                                <input {...register('email', { required: true })} type="email" className="w-full bg-background border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted ml-1 uppercase">Temporary Password</label>
                                <input {...register('password', { required: true })} type="password" className="w-full bg-background border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary transition-all" placeholder="••••••••" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted ml-1 uppercase">Assigned Role</label>
                                <select {...register('role')} className="w-full bg-background border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                                    <option value="admin">Admin</option>
                                    <option value="hr">HR Manager</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-black mt-6 shadow-lg shadow-primary/20">Create Account</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => { setIsResetModalOpen(false); setSelectedUser(null); setShowPassword(false); }}></div>
                    <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-8 relative z-10 shadow-strong animate-slide-up glass">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-text">Reset Password</h2>
                            <button onClick={() => { setIsResetModalOpen(false); setSelectedUser(null); setShowPassword(false); }} className="text-text-muted hover:text-text p-1 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-text-muted text-sm mb-8 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-primary" />
                            Updating password for <span className="text-text font-bold">{selectedUser?.name}</span>
                        </p>

                        <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-6">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">New Password</label>
                                    <button 
                                        type="button"
                                        onClick={generatePassword}
                                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                                    >
                                        <Sparkles size={12} />
                                        Auto-generate
                                    </button>
                                </div>
                                <div className="relative group">
                                    <input 
                                        {...registerReset('password', { required: true, minLength: 8 })} 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="w-full bg-background border border-border rounded-xl p-3 pr-12 text-text focus:outline-none focus:border-primary transition-all font-mono" 
                                        placeholder="Enter new secure password" 
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted mt-1 ml-1 italic">Must be at least 8 characters long.</p>
                            </div>
                            
                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsResetModalOpen(false); setSelectedUser(null); setShowPassword(false); }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-border text-text font-bold hover:bg-surface/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 btn-primary py-3 rounded-xl font-bold text-black shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
