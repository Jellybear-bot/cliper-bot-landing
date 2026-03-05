"use client";
import React from 'react';
import { Upload, Users, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            icon: <Upload className="w-10 h-10 text-blue-600" />,
            title: t.howItWorks.step1.title,
            description: t.howItWorks.step1.desc,
            step: "01"
        },
        {
            icon: <Users className="w-10 h-10 text-purple-600" />,
            title: t.howItWorks.step2.title,
            description: t.howItWorks.step2.desc,
            step: "02"
        },
        {
            icon: <Activity className="w-10 h-10 text-emerald-600" />,
            title: t.howItWorks.step3.title,
            description: t.howItWorks.step3.desc,
            step: "03"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">{t.howItWorks.title}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto font-medium">{t.howItWorks.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[15%] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all hover:-translate-y-2 group">
                            <div className="text-6xl font-black text-slate-100 absolute top-4 right-6 transition-all group-hover:text-slate-200">
                                {step.step}
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
