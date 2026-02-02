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
            const res = await fetch('http://localhost:5000/api/cms/settings');
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
                return fetch('http://localhost:5000/api/cms/settings', {
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
            <h1 className="text-3xl font-bold text-white">Site Settings</h1>
            <p className="text-gray-400">Manage global website configurations.</p>

            {message && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-4">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* General Settings */}
                <div className="bg-surface p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Site Name</label>
                            <input {...register('siteName')} className="w-full bg-background border border-white/10 rounded p-2 text-white" placeholder="Aarvion Services" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Support Email</label>
                            <input {...register('supportEmail')} type="email" className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                            <input {...register('phoneNumber')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Address</label>
                            <input {...register('address')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-surface p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                            <input {...register('socialLinkedin')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Twitter URL</label>
                            <input {...register('socialTwitter')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Instagram URL</label>
                            <input {...register('socialInstagram')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Facebook URL</label>
                            <input {...register('socialFacebook')} className="w-full bg-background border border-white/10 rounded p-2 text-white" />
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
