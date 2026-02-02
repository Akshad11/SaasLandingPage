import { Users, Heart, Zap, TrendingUp } from 'lucide-react';

const values = [
    { icon: <Heart />, title: "Integrity", desc: "We are honest, transparent, and ethical in everything we do." },
    { icon: <Zap />, title: "Innovation", desc: "We constantly explore new technologies to stay ahead." },
    { icon: <Users />, title: "Customer Centricity", desc: "Our clients are at the heart of everything we do." },
    { icon: <Users />, title: "Team Work", desc: "We believe in the power of collaboration and shared success." },
    { icon: <TrendingUp />, title: "Excellence", desc: "We are committed to the highest standards of quality." }
];

const CoreValues: React.FC = () => {
    return (
        <section className="section-padding bg-background">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Values</h2>
                    <p className="text-muted">The principles that guide our work and culture.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((val, idx) => (
                        <div key={idx} className="p-6 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="text-primary mb-4">{val.icon}</div>
                            <h4 className="text-xl font-bold text-white mb-2">{val.title}</h4>
                            <p className="text-muted">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
