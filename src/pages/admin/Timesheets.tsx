import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    Clock, 
    Plus, 
    Search, 
    Calendar as CalendarIcon, 
    Trash2, 
    CheckCircle2,
    ChevronRight,
    Download,
    ChevronLeft,
    FileSpreadsheet,
    CalendarDays,
    X,
    User as UserIcon,
    Briefcase,
    Users,
    FileText,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface TimesheetEntry {
    _id: string;
    userId: string;
    userName: string;
    userRole: string;
    date: string;
    content: string;
    tasks: Array<{ title: string; status: string; _id: string }>;
    createdAt: string;
}

const Timesheets = () => {
    const { user: authUser } = useAuth();
    const [entries, setEntries] = useState<TimesheetEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    
    // Filtering State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().toDateString());
    const [selectedUser, setSelectedUser] = useState<string | 'all'>('all');
    const [filterRole] = useState<'all' | 'admin' | 'hr'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
    const [holidays, setHolidays] = useState<any[]>([]);

    // Form state
    const [newContent, setNewContent] = useState('');
    const [newTasks, setNewTasks] = useState<string[]>(['']);

    const isSuperAdmin = authUser?.role === 'super-admin';

    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedUpdateDate, setSelectedUpdateDate] = useState(getLocalDateString(new Date()));

    const fetchHolidays = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays`);
            if (res.ok) {
                const data = await res.json();
                setHolidays(data);
            }
        } catch (error) {
            console.error("Failed to fetch holidays", error);
        }
    };

    const fetchWorkingDays = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/settings`);
            if (res.ok) {
                const data = await res.json();
                const days: number[] = [];
                for (let i = 0; i < 7; i++) {
                    if (data[`workingDay_${i}`] === true || data[`workingDay_${i}`] === 'true') {
                        days.push(i);
                    }
                }
                if (days.length > 0) setWorkingDays(days);
            }
        } catch (error) {
            console.error("Failed to fetch working days", error);
        }
    };

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            
            // For SuperAdmin, we might want to fetch more or handle user filtering on backend
            // For now, we fetch the month and filter on frontend for responsiveness
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/timesheets?month=${month}&year=${year}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEntries(data);
            }
        } catch (error) {
            console.error("Failed to fetch timesheets", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkingDays();
        fetchHolidays();
        fetchEntries();
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent.trim()) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const tasks = newTasks.filter(t => t.trim() !== '').map(t => ({ title: t, status: 'completed' }));
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/timesheets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: newContent, tasks, date: selectedUpdateDate })
            });
            if (res.ok) {
                setNewContent('');
                setNewTasks(['']);
                setShowAddModal(false);
                fetchEntries();
            }
        } catch (error) {
            console.error("Failed to submit timesheet", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this update?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/timesheets/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setEntries(entries.filter(e => e._id !== id));
        } catch (error) {
            console.error("Failed to delete timesheet", error);
        }
    };

    const generateExcel = async (data: TimesheetEntry[], filename: string) => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Timesheet');
        const primaryColor = 'FFBDF300';
        sheet.mergeCells('A1:E1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'AARVION SERVICES - TIMESHEET REPORT';
        titleCell.font = { name: 'Arial Black', size: 16 };
        titleCell.alignment = { horizontal: 'center' };
        sheet.getRow(1).height = 30;

        const headerRow = sheet.addRow(['DATE', 'MEMBER NAME', 'ROLE', 'ACTIVITY SUMMARY', 'TASKS']);
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            cell.border = { bottom: { style: 'thick', color: { argb: primaryColor } } };
        });

        data.forEach((e) => {
            sheet.addRow([
                new Date(e.date).toLocaleDateString(),
                e.userName.toUpperCase(),
                e.userRole.toUpperCase(),
                e.content,
                e.tasks.map(t => t.title).join(', ')
            ]);
        });

        sheet.getColumn(1).width = 15;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 50;
        sheet.getColumn(5).width = 30;

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    const filteredEntries = entries.filter(entry => {
        const matchesRole = filterRole === 'all' || entry.userRole === filterRole;
        const matchesUser = selectedUser === 'all' || entry.userId === selectedUser;
        const matchesSearch = entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesUser && matchesSearch;
    });

    const dailyEntries = entries.filter(e => new Date(e.date).toDateString() === selectedDay);
    const users = Array.from(new Set(entries.map(e => JSON.stringify({ id: e.userId, name: e.userName, role: e.userRole }))))
                      .map(s => JSON.parse(s));

    const openAddForDate = (dateStr?: string) => {
        if (dateStr) setSelectedUpdateDate(getLocalDateString(new Date(dateStr)));
        else setSelectedUpdateDate(getLocalDateString(new Date()));
        setShowAddModal(true);
    };

    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const daysCount = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    return (
        <div className="space-y-8 pb-12">
            {/* Header & Stats */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-text tracking-tight uppercase">Timesheet Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="text-text-muted font-bold text-xs uppercase tracking-widest">
                            {isSuperAdmin ? "Corporate Oversight Mode" : "Personal Log Stream"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 bg-surface border border-border/50 text-text px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all"
                    >
                        <Download size={16} className="text-primary" />
                        Export Center
                    </motion.button>
                    {!isSuperAdmin && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openAddForDate()}
                            className="flex items-center gap-2 bg-cta-gradient text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                        >
                            <Plus size={18} />
                            Log Progress
                        </motion.button>
                    )}
                </div>
            </header>

            {/* Quick Stats Bar for SuperAdmin */}
            {isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-5 border border-border/40 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Members</p>
                            <h4 className="text-2xl font-black text-text">{users.length}</h4>
                        </div>
                    </div>
                    <div className="glass-card p-5 border border-border/40 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Daily Logs</p>
                            <h4 className="text-2xl font-black text-text">{dailyEntries.length}</h4>
                        </div>
                    </div>
                    <div className="glass-card p-5 border border-border/40 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Selected Day</p>
                            <h4 className="text-lg font-black text-text truncate">{new Date(selectedDay).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</h4>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left: Sidebar Navigation (User List & Calendar) */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Calendar Mini-View */}
                    <div className="glass-card p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <CalendarDays size={14} /> Month View
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={handlePrevMonth} className="p-1 hover:text-primary"><ChevronLeft size={16} /></button>
                                <button onClick={handleNextMonth} className="p-1 hover:text-primary"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <span key={d} className="text-[9px] font-black text-text-muted">{d}</span>
                            ))}
                            {Array.from({ length: firstDayIndex }).map((_, i) => <div key={i} className="h-7"></div>)}
                            {Array.from({ length: daysCount }).map((_, i) => {
                                const d = i + 1;
                                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                                const dateStr = dateObj.toDateString();
                                const hasEntry = entries.some(e => new Date(e.date).toDateString() === dateStr);
                                const isSelected = selectedDay === dateStr;
                                const isPast = dateObj < new Date();
                                const isHoliday = holidays.some(h => new Date(h.date).toDateString() === dateStr);
                                const isWorkingDay = workingDays.includes(dateObj.getDay());
                                const isPending = !hasEntry && isWorkingDay && !isHoliday && isPast;

                                return (
                                    <button 
                                        key={d}
                                        onClick={() => { setSelectedDay(dateStr); setSelectedUser('all'); }}
                                        className={`h-7 w-7 rounded-lg text-[10px] font-bold transition-all
                                            ${isSelected ? 'bg-primary text-black' : hasEntry ? 'text-primary' : isHoliday ? 'text-orange-500' : isPending ? 'text-red-500' : 'text-text-muted'}
                                        `}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[9px] text-text-muted font-bold uppercase tracking-tighter text-center">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Team Members List (Only SuperAdmin) */}
                    {isSuperAdmin && (
                        <div className="glass-card border border-border/50 overflow-hidden">
                            <div className="p-4 bg-surface/50 border-b border-border/50">
                                <h3 className="text-[10px] font-black text-text uppercase tracking-widest flex items-center gap-2">
                                    <Users size={14} className="text-primary" /> Active Team
                                </h3>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                <button 
                                    onClick={() => setSelectedUser('all')}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-surface transition-all text-left border-b border-border/20
                                        ${selectedUser === 'all' ? 'bg-primary/5 border-l-2 border-l-primary' : ''}
                                    `}
                                >
                                    <History size={16} className={selectedUser === 'all' ? 'text-primary' : 'text-text-muted'} />
                                    <span className="text-xs font-black uppercase tracking-tighter">Daily Overview</span>
                                </button>
                                {users.map((u: any) => (
                                    <button 
                                        key={u.id}
                                        onClick={() => setSelectedUser(u.id)}
                                        className={`w-full p-4 flex items-center gap-3 hover:bg-surface transition-all text-left border-b border-border/20
                                            ${selectedUser === u.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}
                                        `}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-surface border border-border/50 flex items-center justify-center text-xs font-black text-text-muted">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-text truncate uppercase">{u.name}</p>
                                            <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{u.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Content Area (Daily Feed or User Sheet) */}
                <div className="xl:col-span-9 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-surface border border-border/50 rounded-2xl">
                                {selectedUser === 'all' ? <CalendarIcon className="text-primary" /> : <UserIcon className="text-primary" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-text uppercase tracking-widest">
                                    {selectedUser === 'all' ? `Updates for ${new Date(selectedDay).toLocaleDateString()}` : `${users.find(u => u.id === selectedUser)?.name}'s Sheet`}
                                </h2>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-tighter">
                                    {selectedUser === 'all' ? "Reviewing all team progress for the day" : `Complete monthly log for ${currentDate.toLocaleString('default', { month: 'long' })}`}
                                </p>
                            </div>
                        </div>

                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search in logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Feed Section */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="py-24 text-center">
                                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Syncing Data...</p>
                            </div>
                        ) : (selectedUser === 'all' ? dailyEntries : filteredEntries).length === 0 ? (
                            <div className="py-32 text-center glass-card border-dashed border-border/50 flex flex-col items-center">
                                <FileSpreadsheet size={48} className="text-text-muted/20 mb-6" />
                                <h3 className="text-lg font-black text-text uppercase tracking-widest">No Records Found</h3>
                                <p className="text-text-muted text-xs mt-2 font-medium">There are no updates logged for this selection.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {(selectedUser === 'all' ? dailyEntries : filteredEntries)
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((entry, idx) => (
                                    <motion.div
                                        key={entry._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-card p-6 border border-border/40 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Left Meta info */}
                                            <div className="lg:w-48 shrink-0 space-y-4 border-r border-border/20 pr-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-cta-gradient flex items-center justify-center text-black font-black text-sm">
                                                        {entry.userName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-text uppercase tracking-tighter truncate w-24">{entry.userName}</p>
                                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{entry.userRole}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                                                        <CalendarIcon size={12} className="text-primary" />
                                                        {new Date(entry.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                                                        <Clock size={12} className="text-primary" />
                                                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Content */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm text-text font-medium leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                                    {(isSuperAdmin || entry.userId === authUser?._id) && (
                                                        <button 
                                                            onClick={() => handleDelete(entry._id)}
                                                            className="p-2 text-text-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {entry.tasks && entry.tasks.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {entry.tasks.map((t) => (
                                                            <div key={t._id} className="flex items-center gap-2 bg-surface/50 border border-border/20 px-3 py-1.5 rounded-xl">
                                                                <CheckCircle2 size={12} className="text-brand-green" />
                                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-tight">{t.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Export Selection Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExportModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-surface border border-border/50 rounded-[2rem] overflow-hidden p-8 shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-text uppercase tracking-widest">Export Center</h2>
                                    <p className="text-xs text-text-muted font-bold mt-1">Generate professional reports for your team.</p>
                                </div>
                                <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-surface rounded-full"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => { generateExcel(entries, `Full_Month_${currentDate.getFullYear()}_${currentDate.getMonth()+1}.xlsx`); setShowExportModal(false); }}
                                    className="flex items-center gap-4 p-5 bg-surface border border-border/50 rounded-2xl hover:border-primary/50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><FileSpreadsheet size={24} /></div>
                                    <div>
                                        <p className="text-sm font-black text-text uppercase">Full Monthly Sheet</p>
                                        <p className="text-[10px] text-text-muted font-bold italic">Includes every log from all users for the current month.</p>
                                    </div>
                                </button>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Specific Reports</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => { generateExcel(entries.filter(e => e.userRole === 'admin'), 'Admin_Logs.xlsx'); setShowExportModal(false); }}
                                            className="p-4 bg-surface/50 border border-border/30 rounded-2xl hover:border-primary/50 transition-all text-center"
                                        >
                                            <Briefcase size={20} className="mx-auto text-primary mb-2" />
                                            <p className="text-[10px] font-black text-text uppercase">Admins Only</p>
                                        </button>
                                        <button 
                                            onClick={() => { generateExcel(entries.filter(e => e.userRole === 'hr'), 'HR_Logs.xlsx'); setShowExportModal(false); }}
                                            className="p-4 bg-surface/50 border border-border/30 rounded-2xl hover:border-primary/50 transition-all text-center"
                                        >
                                            <UserIcon size={20} className="mx-auto text-primary mb-2" />
                                            <p className="text-[10px] font-black text-text uppercase">HR Only</p>
                                        </button>
                                    </div>
                                </div>

                                {selectedUser !== 'all' && (
                                    <button 
                                        onClick={() => { 
                                            const uEntries = entries.filter(e => e.userId === selectedUser);
                                            generateExcel(uEntries, `${uEntries[0]?.userName}_Report.xlsx`); 
                                            setShowExportModal(false); 
                                        }}
                                        className="flex items-center gap-4 p-5 bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all text-left"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-black font-black"><FileText size={24} /></div>
                                        <div>
                                            <p className="text-sm font-black text-text uppercase">Selected User Export</p>
                                            <p className="text-[10px] text-text-muted font-bold italic">Download full history for {users.find(u => u.id === selectedUser)?.name}</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Existing Add Log Modal (Keep as is, just styled a bit more) */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-surface border border-border/50 rounded-[2rem] overflow-hidden p-8 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-black text-text uppercase tracking-widest">New Work Log</h2>
                                        <p className="text-text-muted text-xs font-bold mt-1">Add details for your daily work sheet.</p>
                                    </div>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface rounded-full"><X size={20} /></button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Log Date</label>
                                        <input type="date" value={selectedUpdateDate} onChange={(e) => setSelectedUpdateDate(e.target.value)} className="w-full bg-surface/50 border border-border/50 rounded-xl py-3 px-4 text-sm font-bold text-text outline-none focus:border-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Summary</label>
                                        <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Describe your achievements today..." className="w-full h-32 bg-surface/50 border border-border/50 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary transition-all resize-none" required />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2 px-1">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Task Breakdown</label>
                                            <button type="button" onClick={() => setNewTasks([...newTasks, ''])} className="text-[10px] font-black text-primary uppercase">+ Add Task</button>
                                        </div>
                                        <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                                            {newTasks.map((t, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input type="text" value={t} onChange={(e) => { const n = [...newTasks]; n[i] = e.target.value; setNewTasks(n); }} className="flex-1 bg-surface/50 border border-border/50 rounded-xl px-4 py-2.5 text-xs font-bold text-text outline-none focus:border-primary" placeholder="Task description..." />
                                                    {newTasks.length > 1 && <button type="button" onClick={() => setNewTasks(newTasks.filter((_, idx) => idx !== i))} className="p-2 text-text-muted hover:text-red-500"><X size={14} /></button>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full bg-cta-gradient text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                    {isSubmitting ? 'Syncing...' : 'Submit Log'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Timesheets;
