import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle, AlertCircle, HelpCircle, FileText, X } from 'lucide-react';

type FormData = {
    name: string;
    email: string;
    phone: string;
    position: string;
    message: string;
    resume: FileList;
    videoResumeLink?: string;
};

const ApplicationForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const watchedResume = watch('resume');
    const selectedFile = watchedResume && watchedResume.length > 0 ? watchedResume[0] : null;

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            // Check if resume file exists
            if (!data.resume || data.resume.length === 0) {
                throw new Error('Please select a resume file');
            }

            const resumeFile = data.resume[0];

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(resumeFile.type)) {
                throw new Error('Only PDF and DOC/DOCX files are allowed');
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (resumeFile.size > maxSize) {
                throw new Error('File size must be less than 5MB');
            }

            // Submit application as multipart form data
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('position', data.position);
            formData.append('message', data.message);
            formData.append('resume', resumeFile);
            formData.append('videoResumeLink', data.videoResumeLink || '');

            const applicationRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/applications`, {
                method: 'POST',
                body: formData
            });

            if (!applicationRes.ok) {
                const errorData = await applicationRes.json().catch(() => ({}));
                throw new Error(errorData.message || 'Application submission failed');
            }

            setSubmitStatus('success');
            reset();
        } catch (error: any) {
            console.error('Application error:', error);
            setErrorMessage(error.message || 'An error occurred. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="application-form" className="section-padding bg-transparent relative z-10">
            <div className="container-custom max-w-5xl glass-card p-8 md:p-12">
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-[#BDF300]/10 border border-[#BDF300] rounded-lg flex items-center text-[#BDF300]">
                        <CheckCircle className="mr-2" /> Application submitted successfully!
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center text-red-500">
                        <AlertCircle className="mr-2" /> {errorMessage || 'Something went wrong. Please try again.'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters'
                                    }
                                })}
                                className={`w-full bg-surface/50 backdrop-blur-sm border ${errors.name ? 'border-red-500' : 'border-border/50'} rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors`}
                                placeholder="John Doe"
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                className={`w-full bg-surface/50 backdrop-blur-sm border ${errors.email ? 'border-red-500' : 'border-border/50'} rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors`}
                                placeholder="john@example.com"
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Phone Number</label>
                            <input
                                {...register('phone')}
                                className="w-full bg-surface/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
                                placeholder="+1 234 567 890"
                            />
                            {errors.phone && <span className="text-red-500 text-xs mt-1">Phone is required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Position Applied For</label>
                            <select
                                {...register('position', { required: 'Please select a position' })}
                                className={`w-full bg-surface/50 backdrop-blur-sm border ${errors.position ? 'border-red-500' : 'border-border/50'} rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary appearance-none transition-colors`}
                            >
                                <option value="" className="bg-surface text-text">Select a position</option>
                                <option value="Senior React Developer" className="bg-surface text-text">Senior React Developer</option>
                                <option value="UI/UX Designer" className="bg-surface text-text">UI/UX Designer</option>
                                <option value="Digital Marketing Specialist" className="bg-surface text-text">Digital Marketing Specialist</option>
                                <option value="General Application" className="bg-surface text-text">General Application</option>
                            </select>
                            {errors.position && <span className="text-red-500 text-xs mt-1 block">{errors.position.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Upload - Smaller */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Upload Resume (PDF/DOC)</label>
                            <div className={`relative border-2 border-dashed ${errors.resume ? 'border-red-500' : selectedFile ? 'border-primary' : 'border-border/50'} rounded-lg p-4 text-center hover:border-primary/50 transition-colors bg-surface/20 min-h-[100px] flex flex-col items-center justify-center`}>
                                <input
                                    type="file"
                                    {...register('resume', { required: 'Resume is required' })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.doc,.docx"
                                />
                                {selectedFile ? (
                                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                                            <FileText className="text-primary" size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-text truncate max-w-[200px]">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                                            <CheckCircle size={10} /> Ready to upload
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto text-text-muted mb-1" size={20} />
                                        <p className="text-xs text-text-muted">Click or drag file to upload</p>
                                    </>
                                )}
                            </div>
                            {errors.resume && <span className="text-red-500 text-xs mt-1 block">{errors.resume.message}</span>}
                        </div>

                        {/* Video Resume Link */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                                Video Resume Link (Optional)
                                <div className="group relative">
                                    <HelpCircle size={16} className="text-text-muted cursor-help" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-surface border border-border rounded-lg shadow-lg text-xs text-text-muted z-10">
                                        <p className="font-semibold mb-1">How to create a video resume:</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Record a 1-2 minute video introducing yourself</li>
                                            <li>Upload to Google Drive</li>
                                            <li>Right-click → Share → Change to "Anyone with the link"</li>
                                            <li>Copy and paste the link here</li>
                                        </ol>
                                    </div>
                                </div>
                            </label>
                            <input
                                {...register('videoResumeLink', {
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL'
                                    }
                                })}
                                className="w-full bg-surface/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://drive.google.com/..."
                            />
                            {errors.videoResumeLink && <span className="text-red-500 text-xs mt-1">{errors.videoResumeLink.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Cover Letter / Message</label>
                        <textarea
                            {...register('message')}
                            rows={4}
                            className="w-full bg-surface/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
                            placeholder="Tell us why you're a great fit..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ApplicationForm;
