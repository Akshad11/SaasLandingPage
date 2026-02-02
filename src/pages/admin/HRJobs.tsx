import { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/jobs/my-jobs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            }
        };
        fetchJobs();
    }, []);

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setJobs(jobs.filter(job => job._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete job", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Jobs</h1>
                    <p className="text-gray-400">Manage your job postings.</p>
                </div>
                <button
                    onClick={() => navigate('/hr/jobs/new')}
                    className="btn-primary flex items-center px-4 py-2 rounded-lg font-bold"
                >
                    <PlusCircle className="mr-2" size={20} /> Post New Job
                </button>
            </div>

            {/* Job Listings Table */}
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
                {jobs.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <p>No jobs posted yet.</p>
                        <button onClick={() => navigate('/hr/jobs/new')} className="text-primary hover:underline mt-2">Post your first job</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Posted Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job._id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium text-white">{job.title}</td>
                                        <td className="px-6 py-4">{job.department}</td>
                                        <td className="px-6 py-4">{job.location}</td>
                                        <td className="px-6 py-4">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete Job"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRJobs;
