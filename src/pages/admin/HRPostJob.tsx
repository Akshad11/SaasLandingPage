import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';

const HRPostJob = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                navigate('/hr/jobs');
            } else {
                alert('Failed to post job');
            }
        } catch (error) {
            console.error("Error posting job", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Post New Job</h1>
                    <p className="text-gray-400">Create a new job opening.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl bg-surface p-8 rounded-xl border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="e.g. Senior Software Engineer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                        <select
                            {...register('department', { required: true })}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">Human Resources</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                        <input
                            {...register('location', { required: true })}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            placeholder="e.g. Remote, New York, London"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select
                            {...register('type', { required: true })}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        rows={6}
                        className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="Detailed job description..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Requirements (Bullet points)</label>
                    <textarea
                        {...register('requirements')}
                        rows={4}
                        className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="- Requirement 1&#10;- Requirement 2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate requirements with new lines.</p>
                </div>

                <div className="border-t border-white/10 pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-3 rounded-lg font-bold flex items-center disabled:opacity-50"
                    >
                        <Save size={20} className="mr-2" />
                        {isSubmitting ? 'Posting...' : 'Publish Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HRPostJob;
