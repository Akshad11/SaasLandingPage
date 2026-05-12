import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { 
    User, 
    Mail, 
    Shield, 
    Lock, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight,
    Camera,
    Save
} from 'lucide-react';

const ProfileManagement = () => {
    const { user, login } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    
    // Form states
    const [name, setName] = useState(user?.name || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (data.success) {
                setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local auth context
                if (user) {
                    login({ ...user, name: data.user.name });
                }
            } else {
                setUpdateMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setUpdateMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setUpdateMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            const data = await response.json();

            if (data.success) {
                setUpdateMessage({ type: 'success', text: 'Password reset successfully!' });
                setIsPasswordModalOpen(false);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setUpdateMessage({ type: 'error', text: data.message || 'Failed to reset password' });
            }
        } catch (error) {
            setUpdateMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <Helmet>
                <title>Account Settings | Aarvion Admin</title>
            </Helmet>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-text tracking-tight">Account Settings</h1>
                    <p className="text-text-muted mt-2">Manage your personal information and security preferences.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface/50 p-2 pr-6 rounded-full border border-border glass">
                    <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-black font-bold text-xl">
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text">{user?.name}</p>
                        <p className="text-xs text-text-muted capitalize">{user?.role} Access</p>
                    </div>
                </div>
            </div>

            {updateMessage.text && (
                <div className={`flex items-center p-4 rounded-xl border ${
                    updateMessage.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                    {updateMessage.type === 'success' ? <CheckCircle size={20} className="mr-3" /> : <AlertCircle size={20} className="mr-3" />}
                    <p className="text-sm font-medium">{updateMessage.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-text">Profile Information</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-background/50 border border-border rounded-xl pl-11 pr-4 py-3 text-text focus:outline-none focus:border-primary transition-all"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 opacity-70">
                                    <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input 
                                            type="email" 
                                            value={user?.email}
                                            disabled
                                            className="w-full bg-background/30 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-text-muted cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-text-muted italic ml-1">Email cannot be changed. Contact super admin for assistance.</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    type="submit"
                                    disabled={isUpdating || name === user?.name}
                                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                >
                                    <Save size={18} />
                                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Card */}
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-brand-green/20 text-brand-green">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-text">Security & Privacy</h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-background/40 border border-border/40">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-3 rounded-xl bg-surface border border-border">
                                    <Lock size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text">Account Password</h3>
                                    <p className="text-sm text-text-muted mt-1 max-w-md">
                                        Protect your account with a strong, unique password. We recommend updating it every few months.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full md:w-auto px-6 py-3 rounded-xl border border-border hover:border-primary hover:text-primary font-bold transition-all whitespace-nowrap bg-surface/50"
                            >
                                Security Reset
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-background/40 border border-border/40 opacity-60">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-3 rounded-xl bg-surface border border-border">
                                    <Shield size={20} className="text-brand-green" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text">Two-Factor Authentication</h3>
                                    <p className="text-sm text-text-muted mt-1">
                                        Add an extra layer of security to your admin account. (Coming Soon)
                                    </p>
                                </div>
                            </div>
                            <button disabled className="w-full md:w-auto px-6 py-3 rounded-xl border border-border opacity-50 cursor-not-allowed font-bold">
                                Enable
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Status / Meta */}
                <div className="space-y-8">
                    <div className="glass-card p-8 overflow-hidden relative">
                        {/* Decorative glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-green/20 blur-3xl rounded-full"></div>

                        <h3 className="text-lg font-bold text-text mb-6 relative z-10">Access Overview</h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Account Status</span>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase border border-green-500/30">Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-muted">Security Level</span>
                                <span className="px-3 py-1 rounded-full bg-brand-green text-black text-xs font-bold uppercase">Standard</span>
                            </div>
                            <div className="h-px bg-border/50 my-2"></div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-text-muted">Assigned Role</span>
                                    <span className="text-text font-semibold capitalize">{user?.role}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-text-muted">Member Since</span>
                                    <span className="text-text font-semibold">
                                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-blue/10 border border-brand-blue/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="text-primary mt-1 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-text">Security Tip</p>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Never share your administrator credentials with anyone. Aarvion support will never ask for your password.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsPasswordModalOpen(false)}></div>
                    <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-8 relative z-10 shadow-strong animate-slide-up glass">
                        <h2 className="text-2xl font-bold text-text mb-2">Security Reset</h2>
                        <p className="text-text-muted text-sm mb-8">Set a new secure password for your administrator account.</p>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input 
                                        type="password" 
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-text focus:outline-none focus:border-primary transition-all"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input 
                                        type="password" 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-text focus:outline-none focus:border-primary transition-all"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-border text-text font-bold hover:bg-surface/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isUpdating || !newPassword || newPassword !== confirmPassword}
                                    className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50 disabled:transform-none"
                                >
                                    {isUpdating ? 'Processing...' : 'Confirm Reset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileManagement;
