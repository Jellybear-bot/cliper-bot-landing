"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();
    const [open, setOpen] = useState<number | null>(0);

    const faqs = [
        { q: t.faq.q1.q, a: t.faq.q1.a },
        { q: t.faq.q2.q, a: t.faq.q2.a },
        { q: t.faq.q3.q, a: t.faq.q3.a },
        { q: t.faq.q4.q, a: t.faq.q4.a },
    ];

    return (
        <section className="py-24 relative section-alt">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">{t.faq.title}</h2>
                    <p className="font-medium text-secondary">{t.faq.subtitle}</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`lg-card overflow-hidden transition-all duration-300 ${
                                open === idx ? 'shadow-lg' : ''
                            }`}
                        >
                            <button
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none gap-4"
                                onClick={() => setOpen(open === idx ? null : idx)}
                            >
                                <span className="text-base font-bold text-primary">{faq.q}</span>
                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 text-muted-lg ${
                                        open === idx ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                    open === idx ? 'pb-5 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="border-t border-white/30 dark:border-white/8 pt-4">
                                    <p className="leading-relaxed text-sm md:text-base font-medium text-secondary">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
