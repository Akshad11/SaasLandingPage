
import React from 'react';
import SEO from '../components/common/SEO';
import Introduction from '../components/about/Introduction';
import MissionVision from '../components/about/MissionVision';
import CoreValues from '../components/about/CoreValues';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

import PageHero from '../components/common/PageHero';

const About: React.FC = () => {
    return (
        <>
            <SEO
                title="About Us"
                description="Learn more about Aarvion Services, our mission, vision, and the team dedicated to your operational success."
            />

            <main>
                <PageHero
                    title="About Us"
                    description="Building the future of business services, one partner at a time."
                    image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920"
                />

                <Introduction />
                <MissionVision />
                <CoreValues />
                
                <Testimonials />
                <CTA />
            </main>
        </>
    );
};

export default About;
