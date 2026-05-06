"use client";
import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
    const { t } = useLanguage();

    return (
        <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[140px] animate-float-slow
                    bg-blue-400/15 dark:bg-blue-600/12" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px]
                    bg-indigo-400/15 dark:bg-indigo-600/10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px]
                    bg-purple-400/10 dark:bg-purple-700/10" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold mb-8
                        bg-white/50 dark:bg-white/8 backdrop-blur-xl
                        border border-white/70 dark:border-white/14
                        text-blue-600 dark:text-blue-400
                        shadow-lg shadow-blue-500/8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                    {t.hero.badge}
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-primary"
                >
                    {t.hero.title1} <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                        {t.hero.title2}
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium text-secondary"
                >
                    {t.hero.subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="w-full sm:w-auto px-9 py-4 font-bold flex items-center justify-center gap-2 active:scale-95 lg-btn-primary text-base">
                        {t.hero.ctaPrimary}
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <button className="w-full sm:w-auto px-9 py-4 rounded-full font-semibold flex items-center justify-center gap-2 lg-btn-ghost text-base">
                        <PlayCircle className="w-5 h-5 opacity-70" />
                        {t.hero.ctaSecondary}
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
