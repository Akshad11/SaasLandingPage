
import { motion } from "framer-motion";
import { Code, FileText, TrendingUp, Headphones, Users2, Cpu, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
    {
        icon: <Code className="w-8 h-8" />,
        title: "IT Support & Outsourcing",
        description:
            "Managed IT services, technical support, helpdesk outsourcing, and remote infrastructure management.",
        bullets: ["24/7 Helpdesk Support", "Remote Infrastructure", "SLA Driven Delivery"],
        image: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1170&auto=format&fit=crop",
        color: "from-blue-500 to-cyan-400",
        delay: 0.1
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: "Back Office Support",
        description:
            "End-to-end back-office operations: data entry, reconciliation, document processing and record management.",
        bullets: ["Data & Records", "Financial Reconciliation", "Process Optimization"],
        image: "https://plus.unsplash.com/premium_photo-1661573764813-a6ae0ea91e37?q=80&w=1932&auto=format&fit=crop",
        color: "from-purple-500 to-pink-400",
        delay: 0.2
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Financial Services",
        description:
            "Loan assistance, insurance processing support, KYC facilitation and liaison with financial institutions.",
        bullets: ["KYC Facilitation", "Loan Operations", "Insurance Support"],
        image: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?q=80&w=1170&auto=format&fit=crop",
        color: "from-brand-green to-emerald-400",
        delay: 0.3
    },
    {
        icon: <Headphones className="w-8 h-8" />,
        title: "Customer Support",
        description:
            "Omni-channel customer support solutions — phone, email, chat and ticketing systems with SLA-driven delivery.",
        bullets: ["Omni-channel Support", "Ticketing Systems", "Voice & Chat Ops"],
        image: "https://plus.unsplash.com/premium_photo-1661434914660-c68d9fd54753?q=80&w=1170&auto=format&fit=crop",
        color: "from-orange-500 to-amber-400",
        delay: 0.4
    },
    {
        icon: <Users2 className="w-8 h-8" />,
        title: "Staffing Options",
        description:
            "Recruitment, payroll and HR services for IT, professional and healthcare roles.",
        bullets: ["IT & Prof Staffing", "Payroll Management", "HR Operations"],
        image: "https://plus.unsplash.com/premium_photo-1661782480332-b13e3172660d?q=80&w=1170&auto=format&fit=crop",
        color: "from-brand-blue to-indigo-400",
        delay: 0.5
    },
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "PCB Designing",
        description:
            "Complete schematic and PCB design services with high-quality fabrication meeting Mil Grade and Industrial standards.",
        bullets: ["Schematic Layout", "High-Speed Design", "Mil-Grade Standards"],
        image: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=996&auto=format&fit=crop",
        color: "from-red-500 to-orange-400",
        delay: 0.6
    },
];

const ServicesGrid = () => {
    return (
        <section className="section-padding relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/20 rounded-full blur-[120px]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 inline-block border border-primary/20">
                            Our Solutions
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                            Tailored Services for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-teal-400">Modern Businesses</span>
                        </h2>
                        <p className="text-text-muted text-lg">
                            From IT infrastructure to financial support, we provide comprehensive services
                            designed to scale your operations and drive efficiency.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: service.delay }}
                            className="group"
                        >
                            <div className="glass-card h-full flex flex-col p-8 transition-all duration-500 group-hover:translate-y-[-10px] group-hover:shadow-[0_20px_50px_rgba(84,101,255,0.15)] relative overflow-hidden">
                                {/* Subtle Image Background on Hover */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
                                    style={{ backgroundImage: `url(${service.image})` }}
                                />
                                
                                <div className="mb-6 relative">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 group-hover:rotate-6 transition-transform duration-500`}>
                                        <div className="w-full h-full bg-surface rounded-[14px] flex items-center justify-center text-primary group-hover:bg-transparent group-hover:text-white transition-all duration-500">
                                            {service.icon}
                                        </div>
                                    </div>
                                    
                                    {/* Icon Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`} />
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-text group-hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-text-muted mb-8 flex-grow leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {service.bullets.map((bullet, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-brand-green" />
                                            </div>
                                            <span className="text-sm text-text-muted">{bullet}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to="/services"
                                    className="inline-flex items-center gap-2 font-bold text-primary group/link overflow-hidden relative"
                                >
                                    <span className="relative z-10">Explore Service</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover/link:translate-x-1 transition-transform" />
                                    
                                    {/* Animated underline */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform translate-x-[-100%] group-hover/link:translate-x-0 transition-transform duration-300" />
                                </Link>
                                
                                {/* Decorative Corner Accent */}
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${service.color} opacity-[0.03] group-hover:opacity-10 rounded-bl-[100px] transition-opacity duration-500`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Statistics or Trust Badge Footer for the section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-20 p-8 rounded-3xl bg-surface/30 backdrop-blur-sm border border-border/50 flex flex-wrap items-center justify-around gap-8 text-center"
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-primary">500+</span>
                        <span className="text-sm text-text-muted uppercase tracking-wider font-semibold">Clients Served</span>
                    </div>
                    <div className="w-[1px] h-12 bg-border hidden md:block" />
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-primary">24/7</span>
                        <span className="text-sm text-text-muted uppercase tracking-wider font-semibold">Expert Support</span>
                    </div>
                    <div className="w-[1px] h-12 bg-border hidden md:block" />
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold text-primary">99.9%</span>
                        <span className="text-sm text-text-muted uppercase tracking-wider font-semibold">SLA Success Rate</span>
                    </div>
                    <div className="w-[1px] h-12 bg-border hidden md:block" />
                    <Link to="/contact" className="btn-primary flex items-center gap-2">
                        Get a Free Audit <Zap size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesGrid;