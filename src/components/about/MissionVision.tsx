
import React from 'react';
import { Target } from 'lucide-react';

const MissionVision: React.FC = () => {
    return (
        <section className="section-padding bg-surface">
            <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mission */}
                <div className="bg-background p-10 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-primary mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-muted text-lg leading-relaxed">
                        To empower our clients with reliable services, operational excellence, and consistent value.
                    </p>
                </div>

                {/* Vision */}
                <div className="bg-background p-10 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-primary mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                    <p className="text-muted text-lg leading-relaxed">
                        To be a dependable service partner known for excellence, integrity, and long-term value creation.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;
