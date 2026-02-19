import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import ScaleHover from '../common/animations/ScaleHover';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        {
            name: 'Our Services',
            path: '/services',
            dropdown: [
                { name: 'IT Support & Outsourcing', path: '/services/it-support-outsourcing' },
                { name: 'Back Office Support', path: '/services/back-office-support' },
                { name: 'Financial Services', path: '/services/financial-services' },
                { name: 'Customer Support', path: '/services/customer-support' },
                {
                    name: 'Staffing Options',
                    path: '/services/staffing',
                    subDropdown: [
                        { name: 'IT Staffing', path: '/staffing/it-staffing' },
                        { name: 'Professional Staffing', path: '/staffing/professional-staffing' },
                        { name: 'Healthcare Staffing', path: '/staffing/healthcare-staffing' },
                        { name: 'Recruitment & Account Management', path: '/staffing/recruitment-account-management' },
                        { name: 'Global Payrolling', path: '/staffing/global-payrolling' },
                    ]
                },
            ]
        },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-surface/90 backdrop-blur-md py-4 shadow-lg border-b border-border/10'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container-custom flex justify-between items-center">
                {/* Logo */}
                <ScaleHover>
                    <Link to="/" className="block relative h-12">
                        {/* White Logo (logo2.png) - Visible when unscrolled OR in dark mode */}
                        <img
                            src="/logo2.png"
                            alt="Aarvion Services"
                            className={`h-12 w-auto object-contain transition-opacity duration-300 ${isScrolled ? 'hidden dark:block' : 'block'}`}
                        />

                        {/* Dark Logo (logo.png) - Visible ONLY when scrolled AND in light mode */}
                        <img
                            src="/logo.png"
                            alt="Aarvion Services"
                            className={`h-12 w-auto object-contain transition-opacity duration-300 ${isScrolled ? 'block dark:hidden' : 'hidden'}`}
                        />
                    </Link>
                </ScaleHover>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                to={link.path}
                                className={`text-md font-medium transition-colors duration-300 hover:text-primary flex items-center ${location.pathname === link.path
                                    ? 'text-primary'
                                    : isScrolled ? 'text-text hover:text-text' : 'text-white hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown size={14} className="ml-1" />}
                            </Link>

                            {/* Dropdown Menu */}
                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-xl py-2"
                                        >
                                            {link.dropdown.map((subItem: any) => (
                                                <div
                                                    key={subItem.name}
                                                    className="relative group/sub"
                                                    onMouseEnter={() => subItem.subDropdown && setActiveSubDropdown(subItem.name)}
                                                    onMouseLeave={() => subItem.subDropdown && setActiveSubDropdown(null)}
                                                >
                                                    <Link
                                                        to={subItem.path}
                                                        className="px-4 py-3 text-sm text-text-muted hover:bg-primary/5 hover:text-primary transition-colors flex justify-between items-center w-full"
                                                    >
                                                        {subItem.name}
                                                        {subItem.subDropdown && <ChevronRight size={14} className="ml-2 text-text-muted group-hover/sub:text-primary" />}
                                                    </Link>

                                                    {/* Nested Sub-Dropdown */}
                                                    {subItem.subDropdown && activeSubDropdown === subItem.name && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute top-0 left-full w-64 bg-surface border border-border rounded-xl shadow-xl overflow-hidden py-2"
                                                        >
                                                            {subItem.subDropdown.map((nestedItem: any) => (
                                                                <Link
                                                                    key={nestedItem.name}
                                                                    to={nestedItem.path}
                                                                    className="block px-4 py-3 text-sm text-text-muted hover:bg-primary/5 hover:text-primary transition-colors"
                                                                >
                                                                    {nestedItem.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                    <div className="border-l border-border h-6 mx-4"></div>
                    <ScaleHover>
                        <ThemeToggle className={isScrolled ? undefined : "text-white hover:text-white"} />
                    </ScaleHover>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                    <ThemeToggle className={isScrolled ? undefined : "text-white hover:text-white"} />
                    <button
                        className={isScrolled ? "text-text" : "text-white"}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-surface border-t border-border"
                >
                    <div className="container-custom py-6 flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <div key={link.name} className="flex flex-col">
                                <Link
                                    to={link.path}
                                    className={`text-lg font-medium transition-colors duration-300 ${location.pathname === link.path ? 'text-primary' : 'text-text'}`}
                                    onClick={() => !link.dropdown && setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                                {link.dropdown && (
                                    <div className="pl-4 mt-2 flex flex-col space-y-2 border-l border-border ml-2">
                                        {link.dropdown.map((subItem) => (
                                            <div key={subItem.name}>
                                                <Link
                                                    to={subItem.path}
                                                    className="text-text-muted hover:text-primary text-sm flex items-center justify-between w-full"
                                                    onClick={() => !subItem.subDropdown && setIsOpen(false)}
                                                >
                                                    {subItem.name}
                                                    {/* @ts-ignore */}
                                                    {subItem.subDropdown && <ChevronDown size={14} />}
                                                </Link>
                                                {/* @ts-ignore */}
                                                {subItem.subDropdown && (
                                                    <div className="pl-4 mt-2 flex flex-col space-y-2 border-l border-border ml-2">
                                                        {/* @ts-ignore */}
                                                        {subItem.subDropdown.map((nestedItem) => (
                                                            <Link
                                                                key={nestedItem.name}
                                                                to={nestedItem.path}
                                                                className="text-text-muted hover:text-primary text-sm"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {nestedItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </header>
    );
};

export default Header;
