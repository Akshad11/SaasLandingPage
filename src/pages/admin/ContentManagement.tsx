import { useState, useEffect } from 'react';
import { } from '../../context/AuthContext';
import { Trash2, PlusCircle, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

const ContentManagement = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'testimonials' | 'partners'>('testimonials');
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const resT = await fetch('http://localhost:5000/api/cms/testimonials');
            const resP = await fetch('http://localhost:5000/api/cms/partners');
            if (resT.ok) setTestimonials(await resT.json());
            if (resP.ok) setPartners(await resP.json());
        } catch (error) {
            console.error("Failed to fetch content", error);
        }
    };

    const handleCreate = async (data: any) => {
        const endpoint = activeTab === 'testimonials' ? 'testimonials' : 'partners';
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/cms/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                fetchContent();
                reset();
            }
        } catch (error) {
            console.error(`Failed to create ${endpoint}`, error);
        }
    };

    const handleDelete = async (id: string, type: 'testimonials' | 'partners') => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/cms/${type}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchContent();
        } catch (error) {
            console.error(`Failed to delete ${type}`, error);
        }
    };

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Content Management | Admin</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-white">Content Management</h1>

            <div className="flex space-x-4 border-b border-white/10 pb-2">
                <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'testimonials' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    Testimonials
                </button>
                <button
                    onClick={() => setActiveTab('partners')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'partners' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    Trusted Companies
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {activeTab === 'testimonials' ? (
                        testimonials.map((t) => (
                            <div key={t._id} className="bg-surface p-4 rounded-xl border border-white/10 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center mb-1">
                                        <span className="font-bold text-white mr-2">{t.name}</span>
                                        <div className="flex text-yellow-500">
                                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{t.role} at {t.company}</p>
                                    <p className="text-gray-300 text-sm italic">"{t.message}"</p>
                                </div>
                                <button onClick={() => handleDelete(t._id, 'testimonials')} className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        partners.map((p) => (
                            <div key={p._id} className="bg-surface p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                                        {p.logo ? <img src={p.logo} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">Logo</span>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{p.name}</p>
                                        <a href={p.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">{p.websiteUrl}</a>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(p._id, 'partners')} className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Form */}
                <div className="bg-surface p-6 rounded-xl border border-white/10 h-fit">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Add New {activeTab === 'testimonials' ? 'Testimonial' : 'Partner'}
                    </h3>
                    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input {...register('name', { required: true })} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>

                        {activeTab === 'testimonials' && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <input {...register('role', { required: true })} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Company</label>
                                    <input {...register('company')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea {...register('message', { required: true })} className="w-full bg-background border border-white/10 rounded p-2 text-white h-24"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Rating</label>
                                    <select {...register('rating')} className="w-full bg-background border border-white/10 rounded p-2 text-white">
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {activeTab === 'partners' && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
                                    <input {...register('logo', { required: true })} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Website URL</label>
                                    <input {...register('websiteUrl')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                                </div>
                            </>
                        )}

                        <button type="submit" className="w-full btn-primary py-2 rounded font-bold text-black mt-4">
                            <PlusCircle className="inline-block mr-2" size={18} /> Add Item
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
