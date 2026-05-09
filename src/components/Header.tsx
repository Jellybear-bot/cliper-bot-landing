"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { isDark, toggle } = useTheme();

    return (
        <header className="lg-nav fixed w-full top-0 z-50 border-b transition-colors duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25">
                        C
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                        ClipHunter
                    </span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { label: t.header.services, href: '#services' },
                        { label: t.header.pricing,  href: '#pricing'  },
                        { label: t.header.brands,   href: '#brands'   },
                    ].map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors text-secondary hover:text-accent"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link href="/login" className="text-sm font-medium transition-colors text-secondary hover:text-accent">
                        {t.header.creators}
                    </Link>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Language switcher */}
                    <div className="flex items-center gap-1 rounded-full px-2 py-1 border transition-colors
                        bg-white/30 dark:bg-white/6 border-white/50 dark:border-white/12 backdrop-blur-md">
                        <Globe className="w-3.5 h-3.5 text-muted-lg ml-1" />
                        {(['th', 'en'] as const).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded-full transition-all ${
                                    language === lang
                                        ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Dark mode toggle */}
                    <button
                        onClick={toggle}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all
                            bg-white/30 dark:bg-white/8 border border-white/50 dark:border-white/14 backdrop-blur-md
                            hover:bg-white/60 dark:hover:bg-white/14"
                        title={isDark ? 'Light mode' : 'Dark mode'}
                    >
                        {isDark
                            ? <Sun  className="w-4 h-4 text-amber-400" />
                            : <Moon className="w-4 h-4 text-slate-500" />
                        }
                    </button>

                    <Link
                        href="/login"
                        className="px-5 py-2 rounded-full text-sm font-semibold transition-all
                            bg-white/40 dark:bg-white/8 text-blue-600 dark:text-blue-400
                            border border-blue-200/60 dark:border-blue-500/25 backdrop-blur-md
                            hover:bg-blue-50 dark:hover:bg-blue-500/15"
                    >
                        Login
                    </Link>
                    <a
                        href="https://discord.gg/9WE9sGyZ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-full text-sm font-semibold transition-all lg-btn-primary"
                    >
                        {t.header.bookDemo}
                    </a>
                </div>

                {/* Mobile: theme toggle + hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={toggle}
                        className="w-9 h-9 rounded-full flex items-center justify-center
                            bg-white/30 dark:bg-white/8 border border-white/50 dark:border-white/14"
                    >
                        {isDark
                            ? <Sun  className="w-4 h-4 text-amber-400" />
                            : <Moon className="w-4 h-4 text-slate-500" />
                        }
                    </button>
                    <button
                        className="w-9 h-9 rounded-full flex items-center justify-center
                            bg-white/30 dark:bg-white/8 border border-white/50 dark:border-white/14 text-primary"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-b p-6 flex flex-col gap-4 lg-nav">
                    <div className="flex items-center gap-1.5 rounded-full px-2 py-1 border self-start
                        bg-white/30 dark:bg-white/6 border-white/50 dark:border-white/12">
                        <Globe className="w-3.5 h-3.5 text-muted-lg" />
                        {(['th', 'en'] as const).map(lang => (
                            <button
                                key={lang}
                                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                                className={`text-sm font-bold px-3 py-1 rounded-full transition-all ${
                                    language === lang
                                        ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-400 dark:text-slate-500'
                                }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    {[t.header.services, t.header.pricing, t.header.brands, t.header.creators].map((label, i) => (
                        <a
                            key={i}
                            href={['#services','#pricing','#brands','/login'][i]}
                            onClick={() => setIsOpen(false)}
                            className="font-medium transition-colors text-secondary hover:text-accent"
                        >
                            {label}
                        </a>
                    ))}
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-3 px-6 py-3 rounded-2xl font-semibold text-center transition-all
                            bg-white/40 dark:bg-white/8 text-blue-600 dark:text-blue-400
                            border border-blue-200/50 dark:border-blue-500/20"
                    >
                        Login
                    </Link>
                    <a
                        href="https://discord.gg/9WE9sGyZ"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-1 px-6 py-3 rounded-2xl font-semibold text-center lg-btn-primary"
                    >
                        {t.header.bookDemo}
                    </a>
                </div>
            )}
        </header>
    );
}
