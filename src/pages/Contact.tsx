
import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { Mail, Clock, LocateIcon, ExternalLink, Facebook, Instagram, Youtube } from 'lucide-react';


import PageHero from '../components/common/PageHero';

import { useForm, type SubmitHandler } from 'react-hook-form';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const Contact: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
        setIsLoading(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            reset();
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error: any) {
            setSubmitStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Contact Us"
                description="Get in touch with Aarvion Services. Reach out to our offices in Hyderabad or Mainpuri, or send us a message."
            />

            <main>
                {/* Hero */}
                <PageHero
                    title="Get in Touch"
                    description="Have a question or want to work together? We'd love to hear from you."
                    image="/office.png"
                />

                {/* Contact Info Cards */}
                <section className="section-padding bg-background relative overflow-hidden">
                    {/* Background Image with Dark Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                    </div>

                    {/* Top Section: Form & Contact Info */}
                    <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-stretch relative z-10">
                        {/* Contact Form */}
                        <div className="bg-surface/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg h-full order-2 lg:order-1 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>

                            {submitStatus && (
                                <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-500/10 border border-green-500 text-green-400' : 'bg-red-500/10 border border-red-500 text-red-400'}`}>
                                    {submitStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                        <input
                                            type="text"
                                            {...register("name", { required: "Name is required" })}
                                            className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                            placeholder="Your Name"
                                        />
                                        {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            {...register("phone", {
                                                required: "Phone number is required",
                                                pattern: {
                                                    value: /^[0-9+-]+$/,
                                                    message: "Invalid phone number"
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Phone number must be at least 10 digits"
                                                }
                                            })}
                                            className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                            placeholder="+91 98765 43210"
                                        />
                                        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            {...register("subject", { required: "Subject is required" })}
                                            className={`w-full bg-white/5 border ${errors.subject ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                            placeholder="How can we help?"
                                        />
                                        {errors.subject && <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        {...register("message", { required: "Message is required" })}
                                        className={`w-full bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                        placeholder="Write your message here..."
                                    />
                                    {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Details (Matched Height) */}
                        <div className="bg-surface/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg h-full order-1 lg:order-2 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
                            <p className="text-gray-300 mb-8 text-lg">
                                We're here to help and answer any question you might have. We look forward to hearing from you.
                            </p>

                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mt-1 mr-4 shrink-0 border border-primary/30">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-400 mb-1">Email</span>
                                        <span className="text-lg font-semibold text-white">info@aarvionservices.com</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mt-1 mr-4 shrink-0 border border-primary/30">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-400 mb-1">Business Hours</span>
                                        <span className="text-lg font-semibold text-white">Mon - Fri, 9:00 AM - 6:00 PM</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mt-1 mr-4 shrink-0 border border-primary/30">
                                        <LocateIcon size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-400 mb-1">Address</span>
                                        <span className="text-lg font-semibold text-white">4th Floor, WorkFlo Hitex, Bizness Square, Hyderabad, Telangana - 500081</span>
                                    </div>
                                </li>

                                {/* Social Media Links */}
                                <li className="pt-4 border-t border-white/10 mt-4">
                                    <span className="block text-sm font-medium text-gray-400 mb-4">Social Profiles</span>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/10">
                                            <Facebook size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-pink-500 hover:border-pink-500 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/10">
                                            <Instagram size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/10">
                                            {/* X (formerly Twitter) Logo */}
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="X (formerly Twitter)">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                            </svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:border-red-600 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/10">
                                            <Youtube size={18} />
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Wide Map Section - Full Width & Connected to Footer */}
                    <div className="w-full relative">
                        <div className="h-[450px] w-full bg-surface relative border-t border-border/50">
                            <iframe
                                src="https://maps.google.com/maps?q=17.456881720529108,78.3760453846566&z=15&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Google Map"
                            ></iframe>

                            {/* View on Maps Button */}
                            <a
                                href="https://maps.google.com/?q=17.456881720529108,78.3760453846566"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex absolute top-4 right-4 bg-white text-black text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors items-center gap-2 z-10"
                            >
                                <ExternalLink size={14} /> View on Google Maps
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Contact;
