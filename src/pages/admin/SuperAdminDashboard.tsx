import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, Mail, Trash2, Briefcase, Search, Filter, CheckCircle2, Play, Download, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'inbox'>('users');
    const [inboxCategory, setInboxCategory] = useState<'all' | 'inquiries' | 'applications'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, inquiries: 0, applications: 0 });
    const [workingDays, setWorkingDays] = useState<number[]>([]);

    useEffect(() => {
        if (user) setUsers([user]);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                
                // Fetch Stats & Data
                const [statsRes, contactRes, appRes, holidayRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/stats`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/working-days`, { headers })
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(prev => ({ ...prev, users: data.users || 0 }));
                }

                let combined: any[] = [];
                if (contactRes.ok) {
                    const data = await contactRes.json();
                    const contactsArr = Array.isArray(data) ? data : (data.contacts || data.data || []);
                    combined = [...combined, ...contactsArr.map((c: any) => ({ ...c, modelType: 'inquiry' }))];
                    setStats(prev => ({ ...prev, inquiries: contactsArr.length }));
                }

                if (appRes.ok) {
                    const data = await appRes.json();
                    const appsArr = Array.isArray(data) ? data : (data.applications || data.data || []);
                    combined = [...combined, ...appsArr.map((a: any) => ({ ...a, modelType: 'application' }))];
                    setStats(prev => ({ ...prev, applications: appsArr.length }));
                }

                setMessages(combined.sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ));

                    if (holidayRes.ok) {
                    const data = await holidayRes.json();
                    if (data.data && data.data.workingDays) {
                        setWorkingDays(data.data.workingDays);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDownload = async (id: string, applicantName: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications/download/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!res.ok) return false;

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error("Download failed:", error);
            return false;
        }
    };

    const filteredMessages = messages.filter(msg => {
        const isApp = msg.subject?.toLowerCase().includes('job application');
        if (inboxCategory === 'applications') return isApp;
        if (inboxCategory === 'inquiries') return !isApp;
        return true;
    });


    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black text-text tracking-tight">Management Hub</h1>
                <p className="text-text-muted mt-2 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    System Overview for {user?.name}
                </p>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'System Users', value: stats.users, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'General Inquiries', value: stats.inquiries, icon: Mail, color: 'text-brand-green', bg: 'bg-brand-green/10' },
                    { label: 'Job Applications', value: stats.applications, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-border/50 relative overflow-hidden group"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} blur-3xl rounded-full transition-transform group-hover:scale-150`}></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <span className="text-3xl font-black text-text">{stat.value}</span>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Primary Content Container */}
            <div className="bg-surface/50 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Navigation Tabs */}
                <div className="flex items-center px-8 pt-8 border-b border-border/30 gap-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all relative ${activeTab === 'users' ? 'text-primary' : 'text-text-muted hover:text-text'}`}
                    >
                        User Management
                        {activeTab === 'users' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(84,101,255,0.5)]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all relative ${activeTab === 'inbox' ? 'text-primary' : 'text-text-muted hover:text-text'}`}
                    >
                        Communication Inbox
                        {activeTab === 'inbox' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(84,101,255,0.5)]" />}
                    </button>
                </div>

                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'users' ? (
                            <motion.div
                                key="users-tab"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black text-text tracking-tight">Active Accounts</h2>
                                        <p className="text-text-muted text-sm font-medium">Verified system administrators</p>
                                    </div>
                                    <button className="btn-primary px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-primary/20">
                                        <UserPlus size={20} />
                                        Create Account
                                    </button>
                                </div>
                                <div className="overflow-x-auto rounded-3xl border border-border/30">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-surface/80 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                                            <tr>
                                                <th className="px-8 py-5">Administrator</th>
                                                <th className="px-8 py-5">Role Permission</th>
                                                <th className="px-8 py-5">Security Status</th>
                                                <th className="px-8 py-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/20">
                                            {users.map((u, idx) => (
                                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-text flex items-center gap-2">
                                                                    {u.name}
                                                                    {u._id === user?._id && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                                                                </div>
                                                                <div className="text-xs text-text-muted font-medium">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${u.role === 'super-admin' ? 'bg-purple-500/10 text-purple-400' :
                                                            u.role === 'hr' ? 'bg-brand-green/10 text-brand-green' :
                                                                'bg-primary/10 text-primary'
                                                            }`}>
                                                            {u.role.replace('-', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-brand-green font-bold text-xs">
                                                            <CheckCircle2 size={14} />
                                                            Fully Authorized
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 text-text-muted hover:text-red-500 transition-colors bg-surface rounded-xl border border-border/50">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="inbox-tab"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex bg-surface p-1 rounded-2xl border border-border/50">
                                        {[
                                            { id: 'all', label: 'All Activity' },
                                            { id: 'inquiries', label: 'Inquiries' },
                                            { id: 'applications', label: 'Applications' },
                                        ].map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setInboxCategory(cat.id as any)}
                                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${inboxCategory === cat.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text'}`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative group w-full md:w-64">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            placeholder="Search messages..."
                                            className="w-full bg-surface border border-border/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <p className="text-text-muted font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
                                        </div>
                                    ) : filteredMessages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-24 bg-surface/30 rounded-[2rem] border border-dashed border-border/50">
                                            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-text-muted/30 mb-4 border border-border/30">
                                                <Filter size={40} />
                                            </div>
                                            <h3 className="text-xl font-bold text-text">No matching records</h3>
                                            <p className="text-text-muted text-sm mt-1">Try adjusting your filters or search query.</p>
                                        </div>
                                    ) : (
                                        messages.filter(m => {
                                            const isApp = m.modelType === 'application' || m.subject?.toLowerCase().includes('job application');
                                            if (inboxCategory === 'applications') return isApp;
                                            if (inboxCategory === 'inquiries') return !isApp;
                                            return true;
                                        }).map((msg: any) => {
                                            const isApp = msg.modelType === 'application' || msg.subject?.toLowerCase().includes('job application');

                                            // New model fields or legacy parsed fields
                                            let resumeLink = msg.resumeUrl || null;
                                            let videoLink = msg.videoResumeLink || null;
                                            let position = msg.position || null;
                                            let displayMessage = msg.message;
                                            let subject = msg.subject || (position ? `Job Application: ${position}` : 'No Subject');

                                            // Legacy parsing if it's a legacy application in the Contact model
                                            if (msg.modelType === 'inquiry' && isApp) {
                                                const extractLegacyLink = (text: string, label: string) => {
                                                    if (!text || !text.includes(label)) return null;
                                                    const parts = text.split(label);
                                                    return parts[1].split('\n')[0].trim();
                                                };
                                                resumeLink = extractLegacyLink(msg.message, 'Resume:');
                                                videoLink = extractLegacyLink(msg.message, 'Video Resume:');
                                                displayMessage = msg.message?.split('\n\nVideo Resume:')[0] || msg.message;
                                            }

                                            if (resumeLink && resumeLink.includes('res.cloudinary.com') && !resumeLink.includes('/raw/')) {
                                                resumeLink = resumeLink.replace('/upload/', '/upload/fl_attachment/');
                                            }

                                            return (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={msg._id}
                                                    className="group bg-surface/40 hover:bg-surface border border-border/30 hover:border-primary/30 p-6 rounded-[2rem] transition-all relative overflow-hidden"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
                                                        <div className="flex gap-5">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isApp ? 'bg-purple-500/10 text-purple-400' : 'bg-brand-green/10 text-brand-green'}`}>
                                                                {isApp ? <Briefcase size={28} /> : <Mail size={28} />}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-3">
                                                                    <h3 className="font-black text-text text-lg tracking-tight leading-tight">{subject}</h3>
                                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isApp ? 'bg-purple-500/10 text-purple-400' : 'bg-brand-green/10 text-brand-green'}`}>
                                                                        {isApp ? 'Application' : 'Inquiry'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-bold text-text-muted">
                                                                    <span className="text-primary">{msg.name}</span>
                                                                    <span className="opacity-50">•</span>
                                                                    <span>{msg.email}</span>
                                                                    {msg.phone && (
                                                                        <>
                                                                            <span className="opacity-50">•</span>
                                                                            <span>{msg.phone}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                                                            <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {isApp && videoLink && videoLink !== 'Not provided' && (
                                                                    <a
                                                                        href={videoLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl text-[10px] font-black hover:scale-105 transition-all uppercase tracking-widest"
                                                                    >
                                                                        <Play size={14} fill="currentColor" />
                                                                        Video
                                                                    </a>
                                                                )}
                                                                {isApp && resumeLink && (
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (msg.modelType === 'application') {
                                                                                const success = await handleDownload(msg._id, msg.name);
                                                                                if (!success) window.open(resumeLink, '_blank');
                                                                            } else {
                                                                                window.open(resumeLink, '_blank');
                                                                            }
                                                                        }}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-text rounded-xl text-[10px] font-black hover:bg-white/20 transition-all uppercase tracking-widest border border-white/10"
                                                                    >
                                                                        <Download size={14} />
                                                                        Resume
                                                                    </button>
                                                                )}
                                                                <button className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 p-5 bg-background/50 rounded-2xl border border-border/20 text-text-muted text-sm leading-relaxed relative z-10 whitespace-pre-line">
                                                        {displayMessage}
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
