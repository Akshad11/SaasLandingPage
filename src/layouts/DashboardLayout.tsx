import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    MessageSquare,
    LogOut,
    Menu,
    X,
    BarChart3,
    PlusCircle,
    User,
    ChevronRight
} from 'lucide-react';

interface SidebarItem {
    name: string;
    path: string;
    icon: React.ReactElement<{ size?: number; className?: string }>;
    roles: string[];
}

const sidebarItems: SidebarItem[] = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard size={20} />,
        roles: ['super-admin', 'admin']
    },
    {
        name: 'Analytics',
        path: '/admin/analytics',
        icon: <BarChart3 size={20} />,
        roles: ['super-admin', 'admin']
    },
    {
        name: 'User Management',
        path: '/admin/users',
        icon: <Users size={20} />,
        roles: ['super-admin']
    },
    {
        name: 'Content Management',
        path: '/admin/content',
        icon: <Briefcase size={20} />,
        roles: ['super-admin', 'admin']
    },
    {
        name: 'About Management',
        path: '/admin/about',
        icon: <Users size={20} />, // Reusing icon or specific one if available
        roles: ['super-admin', 'admin']
    },
    {
        name: 'Site Settings',
        path: '/admin/settings',
        icon: <BarChart3 size={20} />,
        roles: ['super-admin']
    },
    {
        name: 'Contact Inbox',
        path: '/admin/inbox',
        icon: <MessageSquare size={20} />,
        roles: ['super-admin', 'admin']
    },
    {
        name: 'Account Settings',
        path: '/admin/profile',
        icon: <User size={20} />,
        roles: ['super-admin', 'admin']
    },
    {
        name: 'Contact Inbox',
        path: '/hr/contact',
        icon: <MessageSquare size={20} />,
        roles: ['hr']
    },
    {
        name: 'Dashboard',
        path: '/hr/dashboard',
        icon: <BarChart3 size={20} />,
        roles: ['hr']
    },
    {
        name: 'My Jobs',
        path: '/hr/jobs',
        icon: <Briefcase size={20} />,
        roles: ['hr']
    },
    {
        name: 'Post New Job',
        path: '/hr/jobs/new',
        icon: <PlusCircle size={20} />,
        roles: ['hr']
    },
    {
        name: 'Account Settings',
        path: '/hr/profile',
        icon: <User size={20} />,
        roles: ['hr']
    }
];

const DashboardLayout: React.FC = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based protection
    if (location.pathname.startsWith('/admin') && !['super-admin', 'admin'].includes(user.role)) {
        return <Navigate to="/hr/dashboard" replace />; // Fallback or Unauthorized page
    }

    if (location.pathname.startsWith('/hr') && !['super-admin', 'admin', 'hr'].includes(user.role)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filter items based on role
    const filteredItems = sidebarItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="h-screen bg-background flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`
                    flex-shrink-0 z-30 h-full w-72 bg-surface/80 backdrop-blur-xl border-r border-border/50 transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24 lg:w-72'}
                    fixed md:relative
                `}
            >
                <div className="h-full flex flex-col relative overflow-hidden">
                    {/* Decorative Gradient Glows */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="absolute top-1/2 -right-24 w-48 h-48 bg-brand-green/10 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-between px-6 mb-4">
                        <Link to="/" className={`flex items-center gap-3 transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 lg:opacity-100'}`}>
                            <img 
                                src="/logo.png" 
                                alt="Aarvion" 
                                className="h-10 w-auto object-contain dark:hidden" 
                            />
                            <img 
                                src="/logo2.png" 
                                alt="Aarvion" 
                                className="h-10 w-auto object-contain hidden dark:block" 
                            />
                        </Link>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="p-2 rounded-lg bg-surface/50 border border-border/50 text-text hover:text-primary transition-all md:hidden"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 no-scrollbar">
                        {/* Section Grouping (Optional) */}
                        <div>
                            <p className={`text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted px-4 mb-4 transition-all ${!isSidebarOpen && 'md:opacity-0 lg:opacity-100'}`}>
                                Main Menu
                            </p>
                            <nav className="space-y-1.5">
                                {filteredItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`
                                                relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group
                                                ${isActive 
                                                    ? 'bg-primary/10 text-primary shadow-sm' 
                                                    : 'text-text-muted hover:bg-surface-gradient hover:text-text'}
                                            `}
                                        >
                                            {/* Active Indicator Line */}
                                            {isActive && (
                                                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(84,101,255,0.8)]"></div>
                                            )}

                                            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                {React.cloneElement(item.icon, { 
                                                    size: 22,
                                                    className: isActive ? 'text-primary' : 'text-text-muted group-hover:text-text'
                                                })}
                                            </span>
                                            
                                            <span className={`ml-4 font-semibold text-sm whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 lg:opacity-100'}`}>
                                                {item.name}
                                            </span>

                                            {/* Hover Glow Effect */}
                                            {!isActive && (
                                                <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Section (User & Utils) */}
                    <div className="p-4 mt-auto space-y-4">
                        {/* Theme & Meta */}
                        <div className={`flex items-center justify-between px-4 transition-all ${!isSidebarOpen && 'md:justify-center lg:justify-between'}`}>
                            <div className={`${!isSidebarOpen && 'md:hidden lg:block'}`}>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Appearance</p>
                            </div>
                            <ThemeToggle className="p-2 rounded-lg bg-surface/50 border border-border/50 text-text-muted hover:text-primary transition-all" />
                        </div>

                        {/* User Card */}
                        <div className="relative group">
                            <Link 
                                to={user?.role === 'hr' ? '/hr/profile' : '/admin/profile'} 
                                className={`
                                    flex items-center p-3 rounded-2xl bg-surface/40 border border-border/30 hover:border-primary/30 transition-all duration-300 group
                                    ${!isSidebarOpen && 'md:justify-center lg:justify-start'}
                                `}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-cta-gradient flex items-center justify-center text-black font-black text-lg shadow-inner ring-2 ring-surface/50">
                                        {user?.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
                                </div>
                                
                                <div className={`ml-3 overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 lg:opacity-100'}`}>
                                    <p className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">{user?.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter capitalize">{user?.role}</p>
                                    </div>
                                </div>
                                
                                <div className={`ml-auto transition-all ${!isSidebarOpen && 'md:opacity-0 lg:opacity-100'}`}>
                                    <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                                </div>
                            </Link>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className={`
                                w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border/30 text-sm font-bold text-text-muted hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-300
                                ${!isSidebarOpen && 'md:px-2'}
                            `}
                        >
                            <LogOut size={18} />
                            <span className={`${!isSidebarOpen && 'md:hidden lg:inline'}`}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden h-20 bg-surface/80 backdrop-blur-md border-b border-border/50 flex items-center px-6 justify-between shrink-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-surface/50 border border-border/50 text-text">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cta-gradient rounded-lg flex items-center justify-center">
                            <span className="text-black font-black text-sm">A</span>
                        </div>
                        <span className="text-lg font-black tracking-tight text-text">Aarvion</span>
                    </div>
                    <ThemeToggle className="p-2 rounded-lg bg-surface/50 border border-border/50 text-text" />
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-10 no-scrollbar relative">
                    {/* Background Decorative Element */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10"></div>
                    
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
