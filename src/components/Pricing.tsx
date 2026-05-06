"use client";
import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Pricing() {
    const { t } = useLanguage();

    const plans = [
        { name: t.pricing.plans.starter.name,    views: t.pricing.plans.starter.views,    price: t.pricing.plans.starter.price,    desc: t.pricing.plans.starter.desc,    features: t.pricing.plans.starter.features,    highlighted: false },
        { name: t.pricing.plans.impact.name,     views: t.pricing.plans.impact.views,     price: t.pricing.plans.impact.price,     desc: t.pricing.plans.impact.desc,     features: t.pricing.plans.impact.features,     highlighted: true,  badge: t.pricing.plans.impact.badge },
        { name: t.pricing.plans.domination.name, views: t.pricing.plans.domination.views, price: t.pricing.plans.domination.price, desc: t.pricing.plans.domination.desc, features: t.pricing.plans.domination.features, highlighted: false },
    ];

    return (
        <section id="pricing" className="py-24 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[160px]
                    bg-blue-400/8 dark:bg-blue-600/8" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">{t.pricing.title}</h2>
                    <p className="max-w-2xl mx-auto font-medium text-secondary">{t.pricing.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`lg-card p-8 relative overflow-hidden transition-all duration-300 ${
                                plan.highlighted
                                    ? 'lg:-translate-y-4 border-blue-400/50 dark:border-blue-500/35 shadow-2xl shadow-blue-500/12 dark:shadow-blue-500/10 z-10'
                                    : 'lg-card-hover'
                            }`}
                        >
                            {/* Glow for highlighted */}
                            {plan.highlighted && (
                                <div className="absolute inset-0 rounded-3xl pointer-events-none
                                    bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-500/8" />
                            )}

                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-white text-xs font-bold tracking-wide shadow-lg
                                    bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/30">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8 relative z-10">
                                <h3 className={`text-lg font-bold mb-2 ${plan.highlighted ? 'text-blue-500 dark:text-blue-400' : 'text-primary'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-primary">{plan.views}</span>
                                </div>
                                <div className="text-xl font-bold mb-4 text-blue-500 dark:text-blue-400">
                                    THB {plan.price}
                                </div>
                                <p className="text-sm font-medium min-h-[56px] text-secondary">{plan.desc}</p>
                            </div>

                            <ul className="space-y-3.5 mb-8 relative z-10">
                                {plan.features.map((feature: string, fIdx: number) => (
                                    <li key={fIdx} className="flex items-start gap-3 font-medium text-secondary">
                                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="relative z-10">
                                {plan.highlighted ? (
                                    <button className="w-full py-4 rounded-2xl font-bold lg-btn-primary">
                                        {t.pricing.launchBtn}
                                    </button>
                                ) : (
                                    <button className="w-full py-4 rounded-2xl font-bold transition-all lg-btn-ghost">
                                        {t.pricing.launchBtn}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
