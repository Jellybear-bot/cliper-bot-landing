"use client";
import React from 'react';
import { Rocket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FinalCTA() {
    const { t } = useLanguage();

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px]
                    bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-transparent
                    dark:from-blue-600/12 dark:via-indigo-600/8 dark:to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto lg-card p-10 md:p-16 relative overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none
                        bg-gradient-to-b from-blue-400/5 to-purple-400/3 dark:from-blue-600/6 dark:to-purple-600/3" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8
                            bg-gradient-to-br from-blue-500 to-indigo-600
                            shadow-2xl shadow-blue-500/30">
                            <Rocket className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-primary">
                            {t.finalCta.title1} <br /> {t.finalCta.title2}
                        </h2>

                        <p className="text-lg mb-10 max-w-xl mx-auto font-medium text-secondary">
                            {t.finalCta.subtitle}
                        </p>

                        <button className="px-12 py-5 font-bold text-lg w-full sm:w-auto active:scale-95 lg-btn-primary">
                            {t.finalCta.button}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
