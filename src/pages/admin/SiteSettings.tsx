import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { Save } from 'lucide-react';

const SiteSettings = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/settings`);
            if (res.ok) {
                const data = await res.json();
                // Pre-fill form
                Object.keys(data).forEach(key => setValue(key, data[key]));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const token = localStorage.getItem('token');
            const promises = Object.keys(data).map(key => {
                return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cms/settings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ key, value: data[key] })
                });
            });

            await Promise.all(promises);
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save settings", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Helmet>
                <title>Site Settings | Admin</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-text">Site Settings</h1>
            <p className="text-text-muted">Manage global website configurations.</p>

            {message && (
                <div className="bg-[#BDF300]/10 border border-[#BDF300] text-[#BDF300] p-3 rounded mb-4">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* General Settings */}
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Site Name</label>
                            <input {...register('siteName')} className="w-full bg-background border border-border rounded p-2 text-text" placeholder="Aarvion Services" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Support Email</label>
                            <input {...register('supportEmail')} type="email" className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Phone Number</label>
                            <input {...register('phoneNumber')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Address</label>
                            <input {...register('address')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-text-muted mb-1">LinkedIn URL</label>
                            <input {...register('socialLinkedin')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Twitter URL</label>
                            <input {...register('socialTwitter')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Instagram URL</label>
                            <input {...register('socialInstagram')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Facebook URL</label>
                            <input {...register('socialFacebook')} className="w-full bg-background border border-border rounded p-2 text-text" />
                        </div>
                    </div>
                </div>

                {/* Infrastructure Settings */}
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">Infrastructure</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-text-muted mb-1">Resume Storage Mode</label>
                            <select 
                                {...register('resume_storage_mode')} 
                                className="w-full bg-background border border-border rounded p-2 text-text focus:outline-none focus:border-primary"
                            >
                                <option value="cloudinary">Cloudinary (Optimized Cloud Storage)</option>
                                <option value="mongodb">MongoDB Bytes (Direct Database Storage)</option>
                            </select>
                            <p className="text-[10px] text-text-muted mt-2">
                                * MongoDB storage saves resumes directly as bytes. Max file size: 16MB.
                            </p>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto px-8 py-3 rounded-lg font-bold text-black flex items-center justify-center">
                    <Save className="mr-2" size={20} /> Save Changes
                </button>
            </form>
        </div>
    );
};

export default SiteSettings;
