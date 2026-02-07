
import React from 'react';
import { motion } from 'framer-motion';

const Introduction: React.FC = () => {
    return (
        <section className="section-padding bg-background">
            <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-primary font-bold uppercase tracking-wider mb-2 block">Who We Are</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                        Delivering Modern, Reliable and Efficient Solutions
                    </h2>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">
                        Aarvion Services India Pvt. Ltd. is a diversified service-based company delivering modern, reliable and efficient solutions across multiple domains. Led by our Founder & CEO Ravi Shankar Mishra and Chief Technology Officer Akshay Verma, we bring extensive expertise in business operations, technology, and customer experience.
                    </p>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">
                        Registered in Financial District, Hyderabad, Telangana, we work with many clients and partners across India. We specialize in professional back-office support, financial services, IT support & outsourcing, customer support operations, and university admission help-centres.
                    </p>
                </motion.div>
                <div className="relative">
                    <div className="aspect-video bg-surface rounded-2xl overflow-hidden border border-border relative z-10 box-glow">
                        <div className="absolute inset-0 flex items-center justify-center bg-surface">
                            <img src="team.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Introduction;
