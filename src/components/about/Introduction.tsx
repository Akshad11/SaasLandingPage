
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Globe, Shield } from 'lucide-react';

const Introduction: React.FC = () => {
    return (
        <section className="section-padding bg-background overflow-hidden">
            <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-primary font-bold uppercase tracking-wider mb-2 block">Who We Are</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                        Delivering Reliable IT and Business Solutions That Work
                    </h2>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">
                        Aarvion Services India Pvt. Ltd. is a service-focused organization providing dependable, efficient solutions across technology and business operations. We work closely with companies to simplify processes, strengthen systems, and support day-to-day operations with confidence.
                    </p>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">
                        Led by an experienced leadership team, we deliver practical and scalable solutions across IT services, business operations, and customer support.

                        Based in Hyderabad’s Financial District, we serve clients across India with IT support and outsourcing, back-office operations, financial services, customer support, and admission help-centre solutions, focused on reliability and long-term value.</p>
                </motion.div>
                <div className="relative flex items-center justify-center py-10">
                    {/* Orbit Rings Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] border border-dashed border-primary/20 rounded-full absolute"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] border border-dashed border-primary/10 rounded-full absolute"
                        />
                    </div>

                    {/* Floating Icons (Orbiting) */}
                    {/* Tech Icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full relative">
                            <motion.div
                                className="absolute top-0 left-1/2 -ml-5 bg-surface p-3 rounded-xl shadow-lg border border-border text-primary"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            >
                                <Server size={20} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Globe Icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full relative">
                            <motion.div
                                className="absolute bottom-0 left-1/2 -ml-5 bg-surface p-3 rounded-xl shadow-lg border border-border text-blue-500"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                            >
                                <Globe size={20} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Shield Icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }}
                    >
                        <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full relative">
                            <motion.div
                                className="absolute bottom-1/4 right-0 bg-surface p-3 rounded-xl shadow-lg border border-border text-green-500"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }}
                            >
                                <Shield size={20} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Main Image */}
                    <motion.div
                        className="relative z-10 w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-surface/50 backdrop-blur-sm"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=1196&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Team Collaboration"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Introduction;
