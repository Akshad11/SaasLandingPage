import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoginError('');
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            login(result);

            // Redirect based on role
            if (result.role === 'super-admin') {
                navigate('/admin/dashboard');
            } else if (result.role === 'hr') {
                navigate('/hr/dashboard');
            } else {
                navigate('/admin/dashboard'); // Default admin dashboard
            }

        } catch (error: any) {
            setLoginError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Aarvion Services</title>
            </Helmet>
            <main className="pt-20 min-h-screen flex items-center justify-center bg-surface">
                <div className="w-full max-w-md p-8 bg-background rounded-2xl border border-white/10 shadow-xl">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h1>

                    {loginError && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">
                            {loginError}
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

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-400">Password</label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    {...register('password', { required: 'Password is required' })}
                                    type="password"
                                    className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message as string}</span>}
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 rounded-lg font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Dev Mode Login Bypass */}
                    <div className="mt-6 border-t border-white/10 pt-6">
                        <p className="text-xs text-gray-500 text-center mb-2">Development Mode</p>
                        <button
                            type="button"
                            onClick={() => {
                                login({
                                    _id: 'dev-admin-id',
                                    name: 'Test Super Admin',
                                    email: 'admin@test.com',
                                    role: 'super-admin',
                                    token: 'dev-token-bypass'
                                });
                                navigate('/admin/dashboard');
                            }}
                            className="w-full bg-white/5 border border-white/10 text-gray-300 py-2 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Login as Super Admin (Test)
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                login({
                                    _id: 'dev-hr-id',
                                    name: 'Test HR Manager',
                                    email: 'hr@test.com',
                                    role: 'hr',
                                    token: 'dev-token-bypass-hr'
                                });
                                navigate('/hr/dashboard');
                            }}
                            className="w-full mt-3 bg-white/5 border border-white/10 text-gray-300 py-2 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Login as HR (Test)
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
