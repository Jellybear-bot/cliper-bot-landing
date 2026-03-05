"use client";
import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            name: t.pricing.plans.starter.name,
            views: t.pricing.plans.starter.views,
            price: t.pricing.plans.starter.price,
            description: t.pricing.plans.starter.desc,
            features: t.pricing.plans.starter.features,
            highlighted: false
        },
        {
            name: t.pricing.plans.impact.name,
            views: t.pricing.plans.impact.views,
            price: t.pricing.plans.impact.price,
            description: t.pricing.plans.impact.desc,
            features: t.pricing.plans.impact.features,
            highlighted: true,
            badge: t.pricing.plans.impact.badge
        },
        {
            name: t.pricing.plans.domination.name,
            views: t.pricing.plans.domination.views,
            price: t.pricing.plans.domination.price,
            description: t.pricing.plans.domination.desc,
            features: t.pricing.plans.domination.features,
            highlighted: false
        }
    ];

    return (
        <section id="pricing" className="py-24 relative bg-slate-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/50 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">{t.pricing.title}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto font-medium">{t.pricing.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-3xl p-8 transition-all duration-300 ${plan.highlighted
                                ? 'bg-white border-2 border-blue-500 shadow-xl shadow-blue-500/10 lg:-translate-y-4 relative z-10'
                                : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-bold tracking-wide shadow-md">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-blue-600' : 'text-slate-700'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">{plan.views}</span>
                                </div>
                                <div className="text-2xl text-blue-500 font-bold mb-4">THB {plan.price}</div>
                                <p className="text-sm text-slate-500 font-medium min-h-[60px]">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3 text-slate-700 font-medium">
                                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-500' : 'text-slate-400'}`} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlighted
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-none'
                                }`}>
                                {t.pricing.launchBtn}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
