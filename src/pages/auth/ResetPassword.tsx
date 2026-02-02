import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, KeyRound } from 'lucide-react';

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const onSubmit = async (data: any) => {
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, email }), // Include email from state or input if we added email field here too
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Reset failed');
            }

            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <main className="pt-20 min-h-screen flex items-center justify-center bg-surface">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
                    <p className="text-gray-400 mb-4">Please initiate password reset from the Forgot Password page.</p>
                    <Link to="/forgot-password" className="text-primary hover:underline">Go to Forgot Password</Link>
                </div>
            </main>
        )
    }

    return (
        <>
            <Helmet>
                <title>Reset Password | Aarvion Services</title>
            </Helmet>
            <main className="pt-20 min-h-screen flex items-center justify-center bg-surface">
                <div className="w-full max-w-md p-8 bg-background rounded-2xl border border-white/10 shadow-xl">
                    <h1 className="text-3xl font-bold text-white mb-2 text-center">Set New Password</h1>
                    <p className="text-gray-400 text-center mb-6">Enter OTP sent to {email}</p>

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
                            <label className="block text-sm font-medium text-gray-400 mb-2">OTP Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    {...register('otp', { required: 'OTP is required' })}
                                    type="text"
                                    className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="6-digit OTP"
                                />
                            </div>
                            {errors.otp && <span className="text-red-500 text-xs mt-1">{errors.otp.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                                    type="password"
                                    className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Enter new password"
                                />
                            </div>
                            {errors.newPassword && <span className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 rounded-lg font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ResetPassword;
