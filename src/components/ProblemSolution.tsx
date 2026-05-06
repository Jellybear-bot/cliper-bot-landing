"use client";
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProblemSolution() {
    const { t } = useLanguage();

    return (
        <section id="services" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">
                        {t.problemSolution.title}
                    </h2>
                    <p className="max-w-2xl mx-auto font-medium text-secondary">
                        {t.problemSolution.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Problem */}
                    <div className="lg-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none
                            bg-red-400/15 dark:bg-red-600/10" />
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-500 dark:text-red-400">
                            <XCircle className="w-8 h-8 flex-shrink-0" />
                            {t.problemSolution.traditional.title}
                        </h3>
                        <ul className="space-y-4 font-medium text-secondary">
                            {[
                                t.problemSolution.traditional.point1,
                                t.problemSolution.traditional.point2,
                                t.problemSolution.traditional.point3,
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="lg-card p-8 relative overflow-hidden md:-translate-y-4
                        border-blue-400/40 dark:border-blue-500/30
                        shadow-xl shadow-blue-500/10 dark:shadow-blue-500/8">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none
                            bg-blue-400/20 dark:bg-blue-600/15" />
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-500 dark:text-blue-400">
                            <CheckCircle className="w-8 h-8 flex-shrink-0" />
                            {t.problemSolution.crowdClip.title}
                        </h3>
                        <ul className="space-y-4 font-medium text-secondary">
                            {[
                                t.problemSolution.crowdClip.point1,
                                t.problemSolution.crowdClip.point2,
                                t.problemSolution.crowdClip.point3,
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
