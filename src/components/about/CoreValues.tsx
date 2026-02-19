import {
    Users,
    Heart,
    Zap,
    TrendingUp,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const values = [
    {
        icon: <Heart />,
        title: "Integrity",
        desc: "We are honest, transparent, and ethical in everything we do.",
        image: "/office.png",
    },
    {
        icon: <Zap />,
        title: "Innovation",
        desc: "We constantly explore new technologies to stay ahead.",
        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: <Users />,
        title: "Customer Centricity",
        desc: "Our clients are at the heart of everything we do.",
        image:
            "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: <Sparkles />,
        title: "Team Work",
        desc: "We believe in the power of collaboration and shared success.",
        image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: <TrendingUp />,
        title: "Excellence",
        desc: "We are committed to the highest standards of quality.",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: <ShieldCheck />,
        title: "Accountability",
        desc: "We take ownership and deliver on our commitments.",
        image:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    },
];

const CoreValues = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto spotlight slider
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % values.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative section-padding bg-background overflow-hidden">
            {/* Floating Background Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 blur-3xl rounded-full animate-pulse" />

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                        Core Values
                    </h2>
                    <p className="text-text-muted">
                        The principles that guide our work and culture.
                    </p>
                </div>

                {/* Grid for Desktop */}
                <div className="hidden md:grid grid-cols-3 gap-8">
                    {values.map((val, idx) => {
                        const isActive = idx === activeIndex;

                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    scale: isActive ? 1.05 : 0.95,
                                    opacity: isActive ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.4 }}
                                className="group relative rounded-2xl overflow-hidden border border-border
                bg-surface shadow-md hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="h-32 w-full overflow-hidden">
                                    <img
                                        src={val.image}
                                        alt={val.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="text-primary mb-3">{val.icon}</div>
                                    <h4 className="text-xl font-bold text-text mb-2">
                                        {val.title}
                                    </h4>
                                    <p className="text-text-muted text-sm">{val.desc}</p>
                                </div>

                                {/* Glow Border */}
                                {isActive && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Horizontal Slider */}
                <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
                    {values.map((val, idx) => (
                        <div
                            key={idx}
                            className="min-w-[80%] snap-center rounded-2xl overflow-hidden border border-border bg-surface"
                        >
                            <img
                                src={val.image}
                                alt={val.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-5">
                                <div className="text-primary mb-3">{val.icon}</div>
                                <h4 className="text-lg font-bold text-text mb-2">
                                    {val.title}
                                </h4>
                                <p className="text-text-muted text-sm">{val.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
