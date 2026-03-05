"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SocialProof() {
    const { t } = useLanguage();
    const logos = [
        { name: "Brand 1", id: 1 },
        { name: "Brand 2", id: 2 },
        { name: "Brand 3", id: 3 },
        { name: "Brand 4", id: 4 },
        { name: "Brand 5", id: 5 },
    ];

    return (
        <section className="py-12 border-y border-slate-200 bg-white">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">{t.socialProof.title}</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70">
                    {logos.map((logo) => (
                        <div key={logo.id} className="text-2xl font-black text-slate-400 tracking-tighter hover:text-slate-900 transition-colors cursor-pointer filter grayscale hover:grayscale-0">
                            LOGO {logo.id}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
