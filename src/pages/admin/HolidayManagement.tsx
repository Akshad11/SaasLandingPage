import { useState, useEffect } from 'react';
import { 
    Calendar, 
    Plus, 
    Trash2, 
    Upload, 
    FileText, 
    AlertCircle, 
    CheckCircle2,
    Info,
    Save,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface Holiday {
    _id: string;
    date: string;
    name: string;
}

const HolidayManagement = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSavingSchedule, setIsSavingSchedule] = useState(false);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchHolidays = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays`);
            if (res.ok) {
                const data = await res.json();
                setHolidays(data);
            }
        } catch (error) {
            console.error("Failed to fetch holidays", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/settings`);
            if (res.ok) {
                const data = await res.json();
                // Pre-fill form
                Object.keys(data).forEach(key => {
                    if (key.startsWith('workingDay_')) {
                        setValue(key, data[key] === 'true' || data[key] === true);
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    useEffect(() => {
        fetchHolidays();
        fetchSettings();
    }, []);

    const onSaveSchedule = async (data: any) => {
        setIsSavingSchedule(true);
        try {
            const token = localStorage.getItem('token');
            // Sequential save to avoid race conditions and ensure reliability
            for (const key of Object.keys(data)) {
                if (key.startsWith('workingDay_')) {
                    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/settings`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ key, value: data[key] })
                    });
                }
            }
            setMessage({ text: 'Operating schedule updated!', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to update schedule', type: 'error' });
        } finally {
            setIsSavingSchedule(false);
        }
    };

    const handleAddManual = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newDate) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName, date: newDate })
            });

            if (res.ok) {
                setNewName('');
                setNewDate('');
                setMessage({ text: 'Holiday added successfully!', type: 'success' });
                fetchHolidays();
            } else {
                const err = await res.json();
                setMessage({ text: err.message || 'Failed to add holiday', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Server error occurred', type: 'error' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this holiday?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setHolidays(holidays.filter(h => h._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete holiday", error);
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const holidaysToUpload: any[] = [];

            // Skip header if exists
            const startIndex = (lines[0].toLowerCase().includes('date') || lines[0].toLowerCase().includes('name')) ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const [date, name] = line.split(',').map(s => s.trim());
                if (date && name) {
                    holidaysToUpload.push({ date, name });
                }
            }

            if (holidaysToUpload.length === 0) {
                setMessage({ text: 'No valid data found in CSV', type: 'error' });
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays/bulk`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ holidays: holidaysToUpload })
                });

                if (res.ok) {
                    setMessage({ text: `Successfully imported ${holidaysToUpload.length} holidays!`, type: 'success' });
                    fetchHolidays();
                } else {
                    setMessage({ text: 'Bulk import failed', type: 'error' });
                }
            } catch (error) {
                setMessage({ text: 'Error uploading CSV', type: 'error' });
            } finally {
                setTimeout(() => setMessage(null), 3000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black text-text tracking-tight uppercase">Holiday Management</h1>
                <p className="text-text-muted mt-2 font-medium">Configure organizational holidays for timesheet tracking.</p>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${
                            message.type === 'success' 
                                ? 'bg-brand-green/10 border-brand-green/20 text-brand-green' 
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-bold">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Section */}
                <div className="space-y-6">
                    {/* Operating Schedule */}
                    <div className="glass-card p-6 border border-border/50 space-y-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-primary" size={20} />
                            <h2 className="text-lg font-black text-text uppercase tracking-widest">Operating Schedule</h2>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">Select the days your organization is active. Unselected days will be marked as "Off" in timesheets.</p>
                        
                        <form onSubmit={handleSubmit(onSaveSchedule)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Sun', value: '0' },
                                    { label: 'Mon', value: '1' },
                                    { label: 'Tue', value: '2' },
                                    { label: 'Wed', value: '3' },
                                    { label: 'Thu', value: '4' },
                                    { label: 'Fri', value: '5' },
                                    { label: 'Sat', value: '6' },
                                ].map((day) => (
                                    <label key={day.value} className="flex items-center gap-3 p-3 bg-surface/30 border border-border/30 rounded-xl cursor-pointer hover:border-primary/40 transition-all">
                                        <input 
                                            type="checkbox" 
                                            {...register(`workingDay_${day.value}`)} 
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-[11px] font-black text-text uppercase">{day.label}</span>
                                    </label>
                                ))}
                            </div>
                            <button 
                                type="submit"
                                disabled={isSavingSchedule}
                                className="w-full flex items-center justify-center gap-2 bg-cta-gradient text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {isSavingSchedule ? (
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Schedule
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card p-6 border border-border/50 space-y-6">
                        <div className="flex items-center gap-2">
                            <Plus className="text-primary" size={20} />
                            <h2 className="text-lg font-black text-text uppercase tracking-widest">Add Manually</h2>
                        </div>
                        
                        <form onSubmit={handleAddManual} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Holiday Name</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Independence Day"
                                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Date</label>
                                <input 
                                    type="date" 
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Add Holiday'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card p-6 border border-border/50 space-y-4">
                        <div className="flex items-center gap-2">
                            <Upload className="text-primary" size={20} />
                            <h2 className="text-lg font-black text-text uppercase tracking-widest">Bulk Import</h2>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                            Upload a CSV file with the format: <br/>
                            <code className="text-primary font-bold">YYYY-MM-DD, Holiday Name</code>
                        </p>
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept=".csv"
                                onChange={handleCSVUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border-2 border-dashed border-border/50 group-hover:border-primary/50 rounded-2xl p-8 text-center transition-all">
                                <FileText size={32} className="mx-auto text-text-muted mb-2 group-hover:text-primary" />
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Click to browse CSV</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <Info size={14} className="text-primary shrink-0" />
                            <p className="text-[10px] text-text-muted font-medium">Duplicate dates will be automatically skipped.</p>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-black text-text uppercase tracking-widest flex items-center gap-3">
                            <Calendar size={20} className="text-primary" />
                            Holiday Calendar ({holidays.length})
                        </h2>
                    </div>

                    <div className="glass-card border border-border/50 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/50 border-b border-border/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Holiday Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-20 text-center">
                                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Loading Records...</span>
                                        </td>
                                    </tr>
                                ) : holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-20 text-center">
                                            <p className="text-sm font-bold text-text-muted">No holidays configured yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday._id} className="border-b border-border/30 hover:bg-surface/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-text tracking-tighter">
                                                    {new Date(holiday.date).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-text-muted">{holiday.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(holiday._id)}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayManagement;
