import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import ScaleHover from '../common/animations/ScaleHover';
import StaggerContainer, { StaggerItem } from '../common/animations/StaggerContainer';
import FadeIn from '../common/animations/FadeIn';

const Footer: React.FC = () => {
    return (
        <footer className="bg-surface pt-20 pb-10 border-t border-border relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

            <FadeIn direction='up' duration={0.8} fullWidth>
                <StaggerContainer className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 relative z-10" staggerDelay={0.1}>
                    {/* Brand */}
                    <StaggerItem className="lg:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-tighter text-text mb-6 block relative h-12 w-auto">
                            {/* White Logo for Dark Mode */}
                            <img
                                src="/logo2.png"
                                alt="Aarvion Services"
                                className="h-12 w-auto object-contain hidden dark:block"
                            />
                            {/* Dark Logo for Light Mode */}
                            <img
                                src="/logo.png"
                                alt="Aarvion Services"
                                className="h-12 w-auto object-contain block dark:hidden"
                            />
                        </Link>
                        <p className="text-text-muted mb-6 text-sm leading-relaxed">
                            We are a service-driven company delivering reliable, efficient solutions across technology and business operations. Our expertise spans IT support, back-office management, financial services, and other essential business functions.
                        </p>

                    </StaggerItem>

                    {/* Quick Links */}
                    <StaggerItem>
                        <h3 className="text-text font-semibold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Contact Us', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-text-muted hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </StaggerItem>

                    {/* Services */}
                    <StaggerItem>
                        <h3 className="text-text font-semibold text-lg mb-6 relative inline-block">
                            Our Services
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'IT Support & Outsourcing',
                                'Back Office Support',
                                'Financial Services',
                                'Customer Support',
                                'Admission Help Centre',
                            ].map((item) => (
                                <li key={item}>
                                    <Link to="/services" className="text-text-muted hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </StaggerItem>

                    {/* Legal */}
                    <StaggerItem>
                        <h3 className="text-text font-semibold text-lg mb-6 relative inline-block">
                            Legal
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy" className="text-text-muted hover:text-primary transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    <span className="text-text-muted group-hover:text-primary transition-colors">Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-text-muted hover:text-primary transition-colors flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    <span className="text-text-muted group-hover:text-primary transition-colors">Terms of Service</span>
                                </Link>
                            </li>
                        </ul>
                    </StaggerItem>

                    {/* Newsletter & Contact */}
                    <StaggerItem>
                        <h4 className="text-text font-medium mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-text-muted hover:text-text transition-colors">
                                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                                <span className="text-sm">4th Floor, WorkFlo Hitex, Bizness Square,<br />
                                    Hyderabad, Telangana - 500081</span>
                            </li>
                            <li className="flex items-center space-x-3 text-text-muted hover:text-text transition-colors">
                                <Mail size={18} className="text-primary flex-shrink-0" />
                                <span className="text-sm">info@aarvionservices.com</span>
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                            <ScaleHover>
                                <a href="#" className="p-2 rounded-full bg-text/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all duration-300 block">
                                    <Facebook size={18} />
                                </a>
                            </ScaleHover>
                            <ScaleHover>
                                <a href="#" className="p-2 rounded-full bg-text/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all duration-300 block">
                                    {/* X (formerly Twitter) Logo */}
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="X (formerly Twitter)">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                </a>
                            </ScaleHover>
                            <ScaleHover>
                                <a href="#" className="p-2 rounded-full bg-text/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all duration-300 block">
                                    <Instagram size={18} />
                                </a>
                            </ScaleHover>
                            <ScaleHover>
                                <a href="#" className="p-2 rounded-full bg-text/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all duration-300 block">
                                    <Linkedin size={18} />
                                </a>
                            </ScaleHover>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </FadeIn>

            {/* Bottom Bar */}
            <div className="container-custom pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
                <div className="mb-4 md:mb-0">
                    <p>&copy; {new Date().getFullYear()} Aarvion Services India Pvt. Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
