import { useState, useEffect } from 'react';
import { Mail, Trash2, Briefcase, Search, Filter, Play, Download, CheckCircle2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HRContact = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inboxCategory, setInboxCategory] = useState<'all' | 'inquiries' | 'applications'>('all');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [contactRes, appRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications`, { headers })
                ]);

                if (contactRes.ok) {
                    const data = await contactRes.json();
                    setContacts(Array.isArray(data) ? data : (data.contacts || data.data || []));
                }

                if (appRes.ok) {
                    const data = await appRes.json();
                    setApplications(Array.isArray(data) ? data : (data.applications || data.data || []));
                }
            } catch (error) {
                console.error("Failed to fetch inbox data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
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

    const combinedMessages = [
        ...contacts.map((c: any) => ({ ...c, modelType: 'inquiry' })),
        ...applications.map((a: any) => ({ ...a, modelType: 'application' }))
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredMessages = combinedMessages.filter(msg => {
        if (inboxCategory === 'applications') return msg.modelType === 'application';
        if (inboxCategory === 'inquiries') return msg.modelType === 'inquiry';
        return true;
    });

    const stats = {
        total: combinedMessages.length,
        inquiries: contacts.length,
        applications: applications.length
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-text tracking-tight">Contact Inbox</h1>
                    <p className="text-text-muted mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                        Managing communications and talent
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-surface/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-border/50 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Total</span>
                        <span className="text-xl font-black text-text">{stats.total}</span>
                    </div>
                </div>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border border-border/50 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-brand-green/10 text-brand-green">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Inquiries</p>
                            <span className="text-2xl font-black text-text">{stats.inquiries}</span>
                        </div>
                    </div>
                    <CheckCircle2 className="text-brand-green/20 group-hover:text-brand-green/50 transition-colors" size={40} />
                </div>
                <div className="glass-card p-6 border border-border/50 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Applications</p>
                            <span className="text-2xl font-black text-text">{stats.applications}</span>
                        </div>
                    </div>
                    <CheckCircle2 className="text-purple-500/20 group-hover:text-purple-500/50 transition-colors" size={40} />
                </div>
            </div>

            <div className="bg-surface/50 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-2xl min-h-[600px] flex flex-col">
                {/* Inbox Navigation */}
                <div className="p-8 border-b border-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex bg-surface p-1 rounded-2xl border border-border/50">
                        {[
                            { id: 'all', label: 'All Messages' },
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
                            placeholder="Search inbox..."
                            className="w-full bg-surface border border-border/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={inboxCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-text-muted font-bold text-sm tracking-widest uppercase">Accessing Secure Inbox...</p>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-surface/30 rounded-[2rem] border border-dashed border-border/50">
                                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-text-muted/30 mb-4 border border-border/30">
                                        <Filter size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-text">No messages found</h3>
                                    <p className="text-text-muted text-sm mt-1">Your inbox is clear in this category.</p>
                                </div>
                            ) : (
                                filteredMessages.map((msg: any) => {
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

                                    // Selectively apply fl_attachment
                                    // We can only use transformations for non-raw files (like PDFs uploaded as 'image' type via auto)
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
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default HRContact;
