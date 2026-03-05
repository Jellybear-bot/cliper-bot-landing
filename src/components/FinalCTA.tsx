"use client";
import React from 'react';
import { Rocket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FinalCTA() {
    const { t } = useLanguage();

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/30 to-slate-50 z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent z-0" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white p-10 md:p-16 rounded-[2rem] shadow-xl shadow-blue-900/5">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                        {t.finalCta.title1} <br /> {t.finalCta.title2}
                    </h2>
                    <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto font-medium">
                        {t.finalCta.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button className="px-10 py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg w-full sm:w-auto transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30">
                            {t.finalCta.button}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
