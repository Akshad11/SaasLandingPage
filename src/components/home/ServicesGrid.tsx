import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, FileText, TrendingUp, Headphones, Users2, Cpu } from "lucide-react";

const services = [
    {
        icon: <Code size={32} />,
        title: "IT Support & Outsourcing",
        description:
            "Managed IT services, technical support, helpdesk outsourcing, and remote infrastructure management.",
        bullets: ["24/7 Helpdesk", "Remote Monitoring", "SLA Driven Delivery"],
        image: "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        icon: <FileText size={32} />,
        title: "Back Office Support",
        description:
            "End-to-end back-office operations: data entry, reconciliation, document processing and record management.",
        bullets: ["Data Processing", "Reconciliation", "Document Management"],
        image:
            "https://plus.unsplash.com/premium_photo-1661573764813-a6ae0ea91e37?q=80&w=1932&auto=format&fit=crop",
    },
    {
        icon: <TrendingUp size={32} />,
        title: "Financial Services",
        description:
            "Loan assistance, insurance processing support, KYC facilitation and liaison with financial institutions.",
        bullets: ["KYC Support", "Loan Processing", "Insurance Ops"],
        image:
            "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?q=80&w=1170&auto=format&fit=crop",
    },
    {
        icon: <Headphones size={32} />,
        title: "Customer Support",
        description:
            "Omni-channel customer support solutions — phone, email, chat and ticketing systems with SLA-driven delivery.",
        bullets: ["Voice + Chat", "Ticketing", "Omnichannel"],
        image:
            "https://plus.unsplash.com/premium_photo-1661434914660-c68d9fd54753?q=80&w=1170&auto=format&fit=crop",
    },
    {
        icon: <Users2 size={32} />,
        title: "Staffing Options",
        description:
            "Recruitment, payroll and HR services for IT, professional and healthcare roles.",
        bullets: ["IT Staffing", "Payroll", "HR Management"],
        image: "https://plus.unsplash.com/premium_photo-1661782480332-b13e3172660d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        icon: <Cpu size={32} />,
        title: "PCB Designing",
        description:
            "Complete schematic and PCB design services with high-quality fabrication meeting Mil Grade and Industrial standards.",
        bullets: ["Schematic Design", "High-Speed Layout", "Fabrication Support"],
        image: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const ServicesSnapPage = () => {
    const sectionsRef = useRef<HTMLDivElement[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute("data-index"));
                    if (entry.isIntersecting) setActiveIndex(index);
                });
            },
            { threshold: 0.6 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-surface">
            {services.map((service, index) => {
                const isActive = index === activeIndex;

                return (
                    <div
                        key={index}
                        data-index={index}
                        ref={(el) => {
                            if (el) sectionsRef.current[index] = el;
                        }}
                        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
                    >
                        {/* 🔲 ANTI-GRAVITY GRID */}
                        <motion.div
                            className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
                            animate={{ y: [0, -30, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                                    backgroundSize: "40px 40px",
                                }}
                            />
                        </motion.div>

                        {/* 🔦 FLASHLIGHT (ANTI-GRAVITY FLOAT) */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none z-0"
                            animate={{ y: [0, -40, 0], opacity: [0.12, 0.22, 0.12] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                background:
                                    "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.14), transparent 60%)",
                                filter: "blur(60px)",
                            }}
                        />

                        {/* 🧩 CIRCUIT PATH (FLOAT UP) */}
                        <motion.svg
                            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0"
                            viewBox="0 0 800 600"
                            fill="none"
                            animate={{ y: [0, -25, 0] }}
                            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <motion.path
                                d="M50 300 H250 V200 H450 V350 H650"
                                stroke="url(#circuitGrad)"
                                strokeWidth="2"
                                strokeDasharray="8 6"
                                animate={{ strokeDashoffset: [0, -40] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                            <defs>
                                <linearGradient id="circuitGrad">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* 🟣 FLOATING LIGHT ORBS (ANTI-GRAVITY) */}
                        <motion.div
                            className="absolute top-1/4 right-1/4 w-40 h-40 bg-primary/20 rounded-full blur-2xl z-0"
                            animate={{ y: [0, -35, 0] }}
                            transition={{ duration: 10, repeat: Infinity }}
                        />

                        <motion.div
                            className="absolute bottom-20 left-1/3 w-16 h-16 bg-secondary/20 rounded-full blur-xl z-0"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />

                        {/* 🧩 PARTICLES FLOAT UP */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full z-0"
                                style={{
                                    top: `${30 + i * 6}%`,
                                    left: `${10 + i * 10}%`,
                                }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{
                                    duration: 6 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}

                        {/* 🧩 CARD (LOCKED, NO ROTATION) */}
                        <motion.div
                            animate={{
                                scale: isActive ? 1 : 0.92,
                                opacity: isActive ? 1 : 0.5,
                            }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 w-full max-w-6xl h-[70vh] rounded-3xl overflow-hidden shadow-2xl isolate transform-none"
                        >
                            {/* HUD CORNERS */}
                            {isActive && (
                                <>
                                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
                                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
                                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/60" />
                                </>
                            )}

                            {/* Background */}
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70" />

                            {/* Content */}
                            <div className="relative z-10 grid md:grid-cols-2 gap-10 p-10 md:p-16 text-white h-full items-center">
                                <div>
                                    <div className="mb-4 text-primary">{service.icon}</div>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                        {service.title}
                                    </h2>
                                    <p className="text-gray-300 mb-6 max-w-xl">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-2 text-gray-200">
                                        {service.bullets.map((b, i) => (
                                            <li key={i}>• {b}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Glass Popup */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 60 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 60 }}
                                            transition={{ duration: 0.4 }}
                                            className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
                                        >
                                            <h4 className="font-semibold mb-2">
                                                Why choose this service?
                                            </h4>
                                            <p className="text-sm text-gray-200 mb-4">
                                                Optimized workflow, reduced operational costs, and
                                                scalable delivery tailored to your business.
                                            </p>
                                            <button className="px-4 py-2 bg-primary rounded-lg text-sm font-semibold hover:scale-105 transition">
                                                Enquire Now
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                );
            })}
        </section>
    );
};

export default ServicesSnapPage;
