import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, ArrowLeft, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: any) => {
        setLoginError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
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
                navigate('/admin/dashboard');
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
                <title>Secure Access | Aarvion Services</title>
            </Helmet>
            <main className="min-h-screen pt-32 pb-20 px-6 bg-background flex items-center justify-center relative overflow-hidden transition-colors duration-500">
                {/* Minimalist Background Accents */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#5465FF]/5 dark:bg-[#5465FF]/10 -skew-x-12 translate-x-1/4 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#BDF300]/5 dark:bg-[#BDF300]/10 -skew-x-12 -translate-x-1/4 -z-10"></div>

                <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Branding/Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-[#5465FF]/10 text-[#5465FF] rounded-full text-xs font-bold uppercase tracking-widest">
                                Admin Gateway
                            </span>
                            <h1 className="text-5xl font-black text-text leading-tight tracking-tight">
                                Manage your <br />
                                <span className="text-primary">Aarvion</span> operations <br />
                                in one place.
                            </h1>
                            <p className="text-text-muted text-lg max-w-md">
                                Access powerful tools for recruitment, analytics, and content management with our secure administration portal.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border/50 backdrop-blur-sm">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-bold text-text">Secure Access</h3>
                                <p className="text-text-muted text-xs mt-1">Enterprise-grade security for your data.</p>
                            </div>
                            <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border/50 backdrop-blur-sm">
                                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-bold text-text">Real-time Stats</h3>
                                <p className="text-text-muted text-xs mt-1">Live analytics at your fingertips.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Login Form */}
                    <div className="flex justify-center lg:justify-end">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-[460px] bg-surface rounded-[2.5rem] p-10 shadow-2xl border border-border/50 relative overflow-hidden group"
                        >
                            {/* Decorative Glow (Dark Mode Only) */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none hidden dark:block"></div>
                            
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex justify-center mb-10">
                                <Link to="/">
                                    <img src="/logo.png" alt="Aarvion" className="h-10 w-auto object-contain dark:hidden" />
                                    <img src="/logo2.png" alt="Aarvion" className="h-10 w-auto object-contain hidden dark:block" />
                                </Link>
                            </div>

                            <div className="mb-10 relative">
                                <h2 className="text-3xl font-black text-text tracking-tight">Sign In</h2>
                                <p className="text-text-muted mt-2 font-medium">Enter your credentials to continue</p>
                            </div>

                            {loginError && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 border border-red-500/20"
                                >
                                    <ShieldCheck size={18} />
                                    {loginError}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-primary transition-colors" size={20} />
                                        <input
                                            {...register('email', { required: 'Email is required' })}
                                            type="email"
                                            className="w-full bg-background/50 border-2 border-border/50 rounded-2xl pl-12 pr-4 py-4 text-text focus:outline-none focus:border-primary/30 focus:bg-background transition-all placeholder:text-text-muted/50"
                                            placeholder="admin@aarvion.com"
                                        />
                                    </div>
                                    {errors.email && <span className="text-red-500 text-[10px] font-black ml-1 uppercase">{errors.email.message as string}</span>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[11px] font-black text-text-muted uppercase tracking-widest">Password</label>
                                        <Link to="/forgot-password" className="text-[11px] font-black text-primary hover:underline">Forgot Access?</Link>
                                    </div>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-primary transition-colors" size={20} />
                                        <input
                                            {...register('password', { required: 'Password is required' })}
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full bg-background/50 border-2 border-border/50 rounded-2xl pl-12 pr-12 py-4 text-text focus:outline-none focus:border-primary/30 focus:bg-background transition-all placeholder:text-text-muted/50"
                                            placeholder="••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <span className="text-red-500 text-[10px] font-black ml-1 uppercase">{errors.password.message as string}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 py-4 rounded-2xl font-black text-black transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In to Portal
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 flex flex-col items-center gap-4">
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest group"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                    Return to Homepage
                                </Link>
                                <p className="text-[10px] text-text-muted/50 font-bold uppercase tracking-[0.2em]">
                                    © {new Date().getFullYear()} Aarvion Services
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
