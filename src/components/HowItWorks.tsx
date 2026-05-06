"use client";
import React from 'react';
import { Upload, Users, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        { icon: <Upload className="w-9 h-9 text-blue-500" />,   step: '01', title: t.howItWorks.step1.title, desc: t.howItWorks.step1.desc },
        { icon: <Users  className="w-9 h-9 text-indigo-500" />, step: '02', title: t.howItWorks.step2.title, desc: t.howItWorks.step2.desc },
        { icon: <Activity className="w-9 h-9 text-purple-500" />, step: '03', title: t.howItWorks.step3.title, desc: t.howItWorks.step3.desc },
    ];

    return (
        <section className="py-24 relative overflow-hidden section-alt">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px]
                    bg-indigo-400/8 dark:bg-indigo-600/8" />
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">{t.howItWorks.title}</h2>
                    <p className="max-w-2xl mx-auto font-medium text-secondary">{t.howItWorks.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting gradient line */}
                    <div className="hidden md:block absolute top-[18%] left-[14%] right-[14%] h-px
                        bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30
                        dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="lg-card lg-card-hover p-8 relative overflow-hidden group">
                            {/* Step watermark */}
                            <div className="text-7xl font-black absolute top-3 right-5 pointer-events-none select-none transition-colors duration-300
                                text-slate-100/80 dark:text-white/5 group-hover:text-slate-200/80 dark:group-hover:text-white/8">
                                {step.step}
                            </div>
                            {/* Icon container */}
                            <div className="w-18 h-18 w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110
                                bg-white/60 dark:bg-white/6 border border-white/70 dark:border-white/10">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
                            <p className="leading-relaxed text-sm md:text-base font-medium text-secondary">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
