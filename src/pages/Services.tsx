import React from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import CTA from "../components/home/CTA";
import { motion } from "framer-motion";
import {
    Code,
    ArrowRight,
    FileText,
    TrendingUp,
    Headphones,
    GraduationCap,
    Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
    {
        id: "it-support-outsourcing",
        icon: <Code size={36} />,
        title: "IT Support & Outsourcing",
        description:
            "End-to-end managed IT services that reduce downtime and improve system reliability.",
        features: ["24/7 Helpdesk", "Remote Monitoring", "SLA Delivery"],
        image:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "back-office-support",
        icon: <FileText size={36} />,
        title: "Back Office Support",
        description:
            "Efficient data processing and reconciliation to streamline operations.",
        features: ["Data Processing", "Reconciliation", "Document Management"],
        image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "financial-services",
        icon: <TrendingUp size={36} />,
        title: "Financial Services",
        description:
            "KYC, loan, and insurance operations handled with compliance and accuracy.",
        features: ["Loan Processing", "Insurance Ops", "KYC Compliance"],
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "customer-support",
        icon: <Headphones size={36} />,
        title: "Customer Support",
        description:
            "Omnichannel support across voice, chat, and email platforms.",
        features: ["Voice Support", "Email & Chat", "Ticketing Systems"],
        image:
            "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "staffing-options",
        icon: <GraduationCap size={36} />,
        title: "Staffing Solutions",
        description:
            "Flexible workforce solutions to scale your business efficiently.",
        features: ["Contract Staffing", "Permanent Hiring", "Payroll Mgmt"],
        image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "pcb-designing",
        icon: <Cpu size={36} />,
        title: "PCB Designing",
        description:
            "High-performance PCB layout for industrial and high-speed electronics.",
        features: ["Schematic Design", "High-Speed Layout", "Fabrication Support"],
        image:
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop",
    },
];

const Services: React.FC = () => {
    return (
        <>
            <SEO
                title="Our Services"
                description="Explore our IT, Financial, Back Office, Customer Support, Staffing, and PCB Design services."
            />

            <main>
                <PageHero
                    title="Our Expertise"
                    description="Technology-driven solutions designed to optimize operations and accelerate growth."
                    image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1920"
                />

                {/* Background Blobs */}
                <div className="absolute top-40 left-0 w-72 h-72 bg-primary/20 blur-3xl rounded-full animate-pulse -z-10" />
                <div className="absolute bottom-20 right-0 w-72 h-72 bg-secondary/20 blur-3xl rounded-full animate-pulse -z-10" />

                <section className="section-padding bg-background">
                    <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service) => (
                            <div key={service.id} className="group perspective">
                                <div className="relative h-[420px] w-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">

                                    {/* FRONT */}
                                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-border shadow-xl bg-surface">

                                        {/* IMAGE */}
                                        <div className="h-40 w-full overflow-hidden">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="p-6">
                                            <motion.div
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="text-primary mb-4"
                                            >
                                                {service.icon}
                                            </motion.div>

                                            <h3 className="text-xl font-bold text-text mb-3">
                                                {service.title}
                                            </h3>

                                            <p className="text-text-muted text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* BACK */}
                                    <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl overflow-hidden border border-primary/30 shadow-2xl">

                                        {/* IMAGE WITH OVERLAY */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/70" />
                                        </div>

                                        <div className="relative z-10 p-6 text-white h-full flex flex-col justify-center">
                                            <h4 className="text-xl font-bold mb-4">
                                                Key Capabilities
                                            </h4>

                                            <ul className="space-y-2 mb-6">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-sm">
                                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link
                                                to={`/services/${service.id}`}
                                                className="inline-flex items-center text-primary font-semibold hover:translate-x-2 transition-transform"
                                            >
                                                Learn More <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <CTA />
            </main>
        </>
    );
};

export default Services;
