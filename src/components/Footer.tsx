"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm">C</div>
                            <span className="text-xl font-bold text-slate-900">CrowdClip Media</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed font-medium">
                            {t.footer.desc}
                        </p>
                        <p className="text-sm text-slate-600 font-bold">
                            {t.footer.company}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">{t.footer.companyLinks}</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.aboutUs}</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.careers}</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.forCreators}</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.contact}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">{t.footer.legalLinks}</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link href="/legal" className="hover:text-slate-900 transition-colors">{t.footer.legal}</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-slate-900 transition-colors">{t.footer.terms}</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-slate-900 transition-colors">{t.footer.privacy}</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-slate-900 transition-colors">{t.footer.cookie}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 font-medium">
                    <p>{t.footer.rights.replace('{year}', year.toString())}</p>
                    <div className="flex gap-4">
                        <a href="mailto:hello@crowdclip.media" className="hover:text-slate-600 transition-colors">Email</a>
                        <a href="https://line.me/ti/p/~crowdclip" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Line</a>
                        <a href="https://discord.gg/9WE9sGyZ" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Discord</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
