
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const leaders = [
    { name: "Ravi Shankar Mishra", role: "Founder & CEO", image: "" },
    { name: "Akshay Verma", role: "Chief Technology Officer", image: "" },
];

const Leadership: React.FC = () => {
    return (
        <section className="section-padding bg-surface">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Meet Our Leadership</h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Led by Founder & CEO Ravi Shankar Mishra and CTO Akshay Verma, bringing extensive expertise in business operations, technology, and customer experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {leaders.map((leader, idx) => (
                        <div key={idx} className="group relative">
                            <div className="aspect-[3/4] bg-background rounded-2xl overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-surface flex items-center justify-center">
                                    <span className="text-text-muted">Leader Image</span>
                                </div>
                                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                    <a href="https://www.linkedin.com/company/aarvion/" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full text-primary hover:bg-gray-100"><Linkedin size={20} /></a>
                                    <a href="#" className="bg-white p-2 rounded-full text-primary hover:bg-gray-100"><Twitter size={20} /></a>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-text">{leader.name}</h3>
                            <p className="text-text-muted">{leader.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Leadership;
