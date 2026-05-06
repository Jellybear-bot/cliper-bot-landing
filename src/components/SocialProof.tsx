"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SocialProof() {
    const { t } = useLanguage();
    const logos = [1, 2, 3, 4, 5];

    return (
        <section className="py-14 border-y border-white/30 dark:border-white/8 section-alt backdrop-blur-sm">
            <div className="container mx-auto px-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.22em] mb-10 text-muted-lg">
                    {t.socialProof.title}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                    {logos.map(id => (
                        <div
                            key={id}
                            className="text-2xl font-black tracking-tighter transition-all cursor-pointer
                                text-slate-300 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-400 grayscale hover:grayscale-0"
                        >
                            LOGO {id}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
