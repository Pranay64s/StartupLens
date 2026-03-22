import React, { useState, useEffect } from 'react';
import { BarChart2, Target, Zap, Github, Linkedin, Mail, Bot, Network, Menu, X } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden scroll-smooth">
            <style>
                {` html { scroll-behavior: smooth; } `}
            </style>

            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-slate-900 py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="text-2xl font-bold tracking-tight text-white">StartupLens</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                        <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
                        <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                        <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
                        <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
                    </div>
                    <button
                        onClick={onStart}
                        className="hidden md:block px-6 py-2.5 bg-white text-slate-900 hover:bg-blue-50 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                    >
                        Get Started
                    </button>

                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 shadow-xl animate-fade-in">
                        <div className="flex flex-col p-6 space-y-4">
                            <a href="#home" onClick={closeMobileMenu} className="text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800">Home</a>
                            <a href="#about" onClick={closeMobileMenu} className="text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800">About</a>
                            <a href="#how-it-works" onClick={closeMobileMenu} className="text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800">How It Works</a>
                            <a href="#contact" onClick={closeMobileMenu} className="text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800">Contact</a>
                            <button
                                onClick={() => { closeMobileMenu(); onStart(); }}
                                className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <section id="home" className="relative bg-slate-900 pt-40 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">
                    <div className={`space-y-8 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-sm font-medium backdrop-blur-sm">
                            <Bot className="w-4 h-4 text-blue-400" />
                            <span>Powered by Autonomous AI Agents</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                            Validate Your Startup With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligent Agents</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-lg font-light">
                            We go beyond simple LLMs. Our multi-agent system autonomously scouts the web, analyzes competitors, and simulates market scenarios to give you battle-tested insights.
                        </p>
                    </div>

                    <div className={`relative transition-all duration-1000 delay-300 ease-out transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-600 rounded-full blur-[60px] animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-center z-20">
                                <Bot className="w-20 h-20 text-blue-500" />
                            </div>

                            <div className="absolute inset-0 animate-spin-slow-reverse">
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-md">
                                    <Target className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div className="absolute bottom-20 left-10 w-20 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-md">
                                    <Network className="w-8 h-8 text-purple-400" />
                                </div>
                                <div className="absolute bottom-20 right-10 w-20 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-md">
                                    <BarChart2 className="w-8 h-8 text-amber-400" />
                                </div>
                            </div>

                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
                                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                                <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                                <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">About StartupLens</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-8">
                                We Decode <br /><span className="text-blue-600">Market Intelligence.</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                StartupLens combines the predictive power of Autonomous AI Agents with real-time industry data to validate your startup concepts instantly.
                            </p>

                            <div className="grid grid-cols-2 gap-8 mt-10">
                                <div className="bg-slate-50 p-6 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Instant Validation</h4>
                                    <p className="text-sm text-slate-500 mt-2">Get feedback in seconds.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Agentic Research</h4>
                                    <p className="text-sm text-slate-500 mt-2">Autonomous competitive scouting.</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 w-full">
                            <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-slate-100 shadow-2xl p-8 overflow-hidden group hover:shadow-blue-200/50 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-shimmer z-10"></div>

                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                        <div className="h-8 w-48 bg-slate-900 rounded-lg"></div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <BarChart2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 w-full h-24 flex items-end justify-around px-4">
                                            <div className="w-8 bg-blue-100 rounded-t h-[40%] group-hover:h-[60%] transition-all duration-700"></div>
                                            <div className="w-8 bg-blue-200 rounded-t h-[70%] group-hover:h-[85%] transition-all duration-700 delay-100"></div>
                                            <div className="w-8 bg-blue-400 rounded-t h-[50%] group-hover:h-[90%] transition-all duration-700 delay-200"></div>
                                            <div className="w-8 bg-blue-600 rounded-t h-[80%] group-hover:h-[95%] transition-all duration-700 delay-300"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-16 flex-1 bg-slate-50 rounded-xl border border-slate-100"></div>
                                        <div className="h-16 flex-1 bg-slate-50 rounded-xl border border-slate-100"></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float-slow z-20">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Target className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Target</p>
                                            <p className="text-sm font-bold text-slate-900">Gen-Z Market</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs bg-white px-3 py-1.5 rounded-full shadow-sm">Process</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-20">How It Works</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <span className="text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Input Concept</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Describe your startup idea. Our smart agents help clarify your vision.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                                <span className="text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Processing</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Agents autonomously research competitors and analyze market trends.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                                <span className="text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Strategy Report</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Get a comprehensive strategic roadmap and financial projections.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1 rounded-full">Get In Touch</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 mt-4">Contact Us</h2>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Email Us</h4>
                                <p className="text-slate-500 mt-1 break-all">info@startuplens.com</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                                <Linkedin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">LinkedIn</h4>
                                <p className="text-slate-500 mt-1">/startuplens</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Your Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Your Email</label>
                                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Your Message</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none" placeholder="How can we help?" />
                            </div>
                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-900 text-white py-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <span className="text-xl font-bold">StartupLens</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                AI-powered startup analysis and validation.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-white hover:text-slate-900 transition-all"><Linkedin className="w-4 h-4" /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-white hover:text-slate-900 transition-all"><Github className="w-4 h-4" /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-white hover:text-slate-900 transition-all"><Mail className="w-4 h-4" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Navigation</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
                                <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
                                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
                                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Legal</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookies</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Contact</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><a href="mailto:info@startuplens.com" className="hover:text-blue-400 transition-colors">info@startuplens.com</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} StartupLens. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;
