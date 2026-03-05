"use client";
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProblemSolution() {
    const { t } = useLanguage();

    return (
        <section id="services" className="py-24 relative bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">{t.problemSolution.title}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto font-medium">{t.problemSolution.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Problem Card */}
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center gap-3">
                            <XCircle className="w-8 h-8 flex-shrink-0" /> {t.problemSolution.traditional.title}
                        </h3>
                        <ul className="space-y-4 text-slate-700 font-medium">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>{t.problemSolution.traditional.point1}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>{t.problemSolution.traditional.point2}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>{t.problemSolution.traditional.point3}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Solution Card */}
                    <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl relative overflow-hidden transform md:-translate-y-4 shadow-xl shadow-blue-500/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 flex-shrink-0" /> {t.problemSolution.crowdClip.title}
                        </h3>
                        <ul className="space-y-4 text-slate-700 font-medium">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                                <span>{t.problemSolution.crowdClip.point1}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                                <span>{t.problemSolution.crowdClip.point2}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                                <span>{t.problemSolution.crowdClip.point3}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
