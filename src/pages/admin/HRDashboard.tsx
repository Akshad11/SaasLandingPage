import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Briefcase, Users, Mail, Play, Download, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HRDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, applications: 0, views: 0 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                
                // Fetch Stats
                const jobsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/my-jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (jobsRes.ok) {
                    const jobsData = await jobsRes.json();
                    setStats(prev => ({ ...prev, jobs: jobsData.length }));
                }

                // Fetch Recent Activity (Messages/Applications)
                const contactRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (contactRes.ok) {
                    const data = await contactRes.json();
                    const messagesArray = Array.isArray(data) ? data : (data.contacts || data.data || []);
                    setRecentActivity(messagesArray.slice(0, 3)); // Get top 3
                    
                    // Update application count based on subjects
                    const appCount = messagesArray.filter((m: any) => m.subject?.toLowerCase().includes('job application')).length;
                    setStats(prev => ({ ...prev, applications: appCount }));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Parsing helper for application links
    const extractLink = (text: string, label: string) => {
        if (!text || !text.includes(label)) return null;
        const parts = text.split(label);
        if (parts.length < 2) return null;
        const link = parts[1].split('\n')[0].trim();
        return (link && link !== 'Not provided' && link.startsWith('http')) ? link : null;
    };

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black text-text tracking-tight">HR Intelligence</h1>
                <p className="text-text-muted mt-2 font-medium">Welcome back, {user?.name}. Here's your current overview.</p>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Total Applications', value: stats.applications, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Total Views', value: stats.views, icon: BarChart3, color: 'text-brand-green', bg: 'bg-brand-green/10' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-border/50 relative overflow-hidden group"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} blur-3xl rounded-full`}></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <span className="text-3xl font-black text-text">{stat.value}</span>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-black text-text tracking-tight uppercase tracking-[0.1em]">Recent Activity</h2>
                        <Link to="/hr/contact" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                            View Full Inbox
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="py-20 text-center glass-card border-dashed border-border/50">
                                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Loading Live Stream...</p>
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="py-20 text-center glass-card border-dashed border-border/50">
                                <p className="text-text-muted font-bold text-sm">No recent activity detected.</p>
                            </div>
                        ) : (
                            recentActivity.map((msg, idx) => {
                                const isApp = msg.subject?.toLowerCase().includes('job application');
                                const resumeLink = extractLink(msg.message, 'Resume:');
                                const videoLink = extractLink(msg.message, 'Video Resume:');
                                const displayMessage = msg.message?.split('\n\nVideo Resume:')[0] || msg.message;

                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={msg._id} 
                                        className="group bg-surface/40 hover:bg-surface border border-border/30 hover:border-primary/30 p-5 rounded-3xl transition-all relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isApp ? 'bg-purple-500/10 text-purple-400' : 'bg-brand-green/10 text-brand-green'}`}>
                                                    {isApp ? <Briefcase size={22} /> : <Mail size={22} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-text text-sm leading-tight line-clamp-1">{msg.subject}</h3>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted mt-1">
                                                        <span className="text-primary">{msg.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isApp && videoLink && (
                                                    <a href={videoLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary text-black rounded-lg hover:scale-110 transition-all">
                                                        <Play size={14} fill="currentColor" />
                                                    </a>
                                                )}
                                                {isApp && resumeLink && (
                                                    <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 text-text rounded-lg hover:bg-white/20 transition-all border border-white/10">
                                                        <Download size={14} />
                                                    </a>
                                                )}
                                                {!isApp && (
                                                    <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-xs text-text-muted line-clamp-2 leading-relaxed opacity-70">
                                            {displayMessage}
                                        </p>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: Quick Links / Status */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-text tracking-tight uppercase tracking-[0.1em] px-2">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/hr/jobs/new" className="flex items-center justify-between p-5 bg-primary rounded-3xl group transition-all hover:shadow-xl hover:shadow-primary/20">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                                    <Briefcase size={20} className="text-black" />
                                </div>
                                <span className="font-black text-black text-sm uppercase tracking-wider">Post New Job</span>
                            </div>
                            <ArrowRight size={20} className="text-black group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/hr/jobs" className="flex items-center justify-between p-5 bg-surface rounded-3xl border border-border/50 group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border">
                                    <Users size={20} className="text-text-muted" />
                                </div>
                                <span className="font-bold text-text text-sm">Manage Postings</span>
                            </div>
                            <ArrowRight size={20} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="p-6 bg-brand-green/10 rounded-3xl border border-brand-green/20">
                        <h4 className="text-brand-green font-black text-xs uppercase tracking-widest mb-2">Hiring Tip</h4>
                        <p className="text-xs text-text-muted font-medium leading-relaxed">
                            Video resumes provide 40% more insight into candidate personality than traditional text resumes. Check them out first!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
