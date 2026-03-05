"use client";
import React from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm">C</div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">CrowdClip Media</span>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#services" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.header.services}</a>
                    <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.header.pricing}</a>
                    <a href="#brands" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.header.brands}</a>
                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.header.creators}</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-full px-2 py-1 border border-slate-200">
                        <Globe className="w-4 h-4 text-slate-500 ml-1" />
                        <button
                            onClick={() => setLanguage('th')}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors ${language === 'th' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            TH
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            EN
                        </button>
                    </div>
                    <Link href="/login" className="px-6 py-2.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-sm font-semibold hover:bg-indigo-100 transition-colors">
                        Login
                    </Link>
                    <a href="https://discord.gg/9WE9sGyZ" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                        {t.header.bookDemo}
                    </a>
                </div>

                <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 relative z-40 shadow-lg">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2 border border-slate-200 self-start mb-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <button
                            onClick={() => { setLanguage('th'); setIsOpen(false); }}
                            className={`text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${language === 'th' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            TH
                        </button>
                        <button
                            onClick={() => { setLanguage('en'); setIsOpen(false); }}
                            className={`text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            EN
                        </button>
                    </div>
                    <a href="#services" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-blue-600">{t.header.services}</a>
                    <a href="#pricing" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-blue-600">{t.header.pricing}</a>
                    <a href="#brands" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-blue-600">{t.header.brands}</a>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-blue-600">{t.header.creators}</Link>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full mt-4 px-6 py-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold text-center hover:bg-indigo-100 transition-colors">
                        Login
                    </Link>
                    <a href="https://discord.gg/9WE9sGyZ" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="w-full mt-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-sm text-center">
                        {t.header.bookDemo}
                    </a>
                </div>
            )}
        </header>
    );
}
