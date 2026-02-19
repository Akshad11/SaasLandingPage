import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const words = [
    "We build your ideas.",
    "We design your future.",
    "We scale your business.",
    "Let’s start today.",
];

const images = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
];

const CTA: React.FC = () => {
    const [text, setText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);

    // Typing effect
    useEffect(() => {
        const currentWord = words[wordIndex];
        let i = 0;

        const typing = setInterval(() => {
            setText(currentWord.slice(0, i));
            i++;
            if (i > currentWord.length) {
                clearInterval(typing);
                setTimeout(() => {
                    setWordIndex((prev) => (prev + 1) % words.length);
                }, 1500);
            }
        }, 60);

        return () => clearInterval(typing);
    }, [wordIndex]);

    return (
        <section className="relative py-28 overflow-hidden text-white">
            {/* MOVING IMAGE TRACK */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex w-[200%]"
                >
                    {[...images, ...images].map((img, i) => (
                        <div key={i} className="w-[20%] h-[500px] flex-shrink-0">
                            <img
                                src={img}
                                className="w-full h-full object-cover blur-sm opacity-30"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* DARK GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-primary/40" />

            {/* GLOW BLOBS */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/20 blur-3xl rounded-full animate-pulse" />

            {/* CONTENT */}
            <div className="container-custom relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-3xl md:text-5xl font-bold mb-6"
                >
                    Ready to Start Your Project?
                </motion.h2>

                {/* TYPING TEXT */}
                <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto font-medium min-h-[28px]">
                    {text}
                    <span className="animate-pulse">|</span>
                </p>

                {/* CTA BUTTON */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-block"
                >
                    <Link
                        to="/contact"
                        className="relative inline-block px-10 py-4 text-lg font-semibold rounded-xl
            bg-primary shadow-xl overflow-hidden"
                    >
                        <span className="relative z-10">Get in Touch Today</span>

                        {/* GLOW OVERLAY */}
                        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />

                        {/* PULSE RING */}
                        <span className="absolute inset-0 rounded-xl border border-white/20 animate-ping" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
