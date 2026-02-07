
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutPreview: React.FC = () => {
    return (
        <section className="section-padding bg-background relative overflow-hidden">
            <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Image Side */}
                <div className="relative order-2 lg:order-1">
                    <div className="aspect-[4/3] bg-surface rounded-2xl overflow-hidden mb-6 relative z-10">
                        {/* Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <img src="office.png" alt="" />
                        </div>
                    </div>
                    <div className="absolute -top-6 -left-6 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[80px]" />
                </div>

                {/* Content Side */}
                <div className="order-1 lg:order-2">
                    <span className="text-primary font-semibold tracking-wide uppercase mb-2 block">Who We Are</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                        Driving Digital Transformation with Passion & Precision
                    </h2>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">
                        Aarvion Services India Pvt. Ltd. is a diversified service-based company delivering modern, reliable and efficient solutions. Led by Founder & CEO Ravi Shankar Mishra and CTO Akshay Verma.
                    </p>
                    <p className="text-text-muted text-lg mb-8 leading-relaxed">
                        We specialize in professional back-office support, financial services, IT support & outsourcing, customer support operations, and university admission help-centres.
                    </p>
                    <Link to="/about" className="inline-flex items-center text-primary font-semibold hover:text-white transition-colors group">
                        More About Us <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutPreview;
