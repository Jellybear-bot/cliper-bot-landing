"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();

    const faqs = [
        {
            question: t.faq.q1.q,
            answer: t.faq.q1.a
        },
        {
            question: t.faq.q2.q,
            answer: t.faq.q2.a
        },
        {
            question: t.faq.q3.q,
            answer: t.faq.q3.a
        },
        {
            question: t.faq.q4.q,
            answer: t.faq.q4.a
        }
    ];

    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">{t.faq.title}</h2>
                    <p className="text-slate-600 font-medium">{t.faq.subtitle}</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                                onClick={() => setOpen(open === idx ? null : idx)}
                            >
                                <span className="text-lg font-bold text-slate-800 pr-4">{faq.question}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${open === idx ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'py-4 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
