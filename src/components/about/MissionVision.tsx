import React, { useEffect, useState } from "react";
import { Target, Eye, ShieldCheck, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        title: "Our Mission",
        desc: "To empower our clients with reliable services, operational excellence, and consistent business value.",
        icon: <Target size={36} />,
        image:
            "https://plus.unsplash.com/premium_photo-1682124869082-f3f3b6f36ed6?q=80&w=1314&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Our Vision",
        desc: "To be a trusted global service partner known for innovation, integrity, and long-term value creation.",
        icon: <Eye size={36} />,
        image:
            "https://images.unsplash.com/photo-1598520106830-8c45c2035460?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Our Commitment",
        desc: "We deliver measurable outcomes through accountability, quality, and customer-focused execution.",
        icon: <ShieldCheck size={36} />,
        image:
            "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Our Approach",
        desc: "We combine technology, skilled talent, and optimized processes to build scalable business solutions.",
        icon: <Layers size={36} />,
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop",
    },
];

const MissionVision: React.FC = () => {
    const [index, setIndex] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = slides[index];

    return (
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            {/* Background Image */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={current.image}
                    src={current.image}
                    alt={current.title}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 max-w-2xl text-center text-white shadow-2xl"
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{ rotate: [0, 6, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="mb-6 flex justify-center text-primary"
                        >
                            {current.icon}
                        </motion.div>

                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            {current.title}
                        </h3>

                        <p className="text-lg text-gray-200 leading-relaxed">
                            {current.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* DOT NAVIGATION */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === index ? "bg-primary scale-125" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default MissionVision;
