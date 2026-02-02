import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            setMessage('OTP sent to your email. Redirecting...');
            setTimeout(() => {
                navigate('/reset-password', { state: { email: data.email } });
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password | Aarvion Services</title>
            </Helmet>
            <main className="pt-20 min-h-screen flex items-center justify-center bg-surface">
                <div className="w-full max-w-md p-8 bg-background rounded-2xl border border-white/10 shadow-xl">
                    <Link to="/login" className="flex items-center text-gray-400 hover:text-white mb-6">
                        <ArrowLeft size={16} className="mr-2" /> Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
                    <p className="text-gray-400 text-center mb-6">Enter your email to receive a 6-digit OTP.</p>

                    {message && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-6 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    {...register('email', { required: 'Email is required' })}
                                    type="email"
                                    className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 rounded-lg font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ForgotPassword;
