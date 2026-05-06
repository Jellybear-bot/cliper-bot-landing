"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/20 dark:border-white/8 section-alt pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25">
                                C
                            </div>
                            <span className="text-lg font-bold text-primary">CrowdClip Media</span>
                        </div>
                        <p className="text-sm max-w-sm mb-6 leading-relaxed font-medium text-secondary">
                            {t.footer.desc}
                        </p>
                        <p className="text-sm font-bold text-secondary">{t.footer.company}</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-primary">{t.footer.companyLinks}</h4>
                        <ul className="space-y-4 text-sm font-medium text-secondary">
                            {[
                                { label: t.footer.aboutUs,     href: '#' },
                                { label: t.footer.careers,     href: '#' },
                                { label: t.footer.forCreators, href: '#' },
                                { label: t.footer.contact,     href: '#' },
                            ].map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-accent transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-primary">{t.footer.legalLinks}</h4>
                        <ul className="space-y-4 text-sm font-medium text-secondary">
                            {[
                                { label: t.footer.legal,   href: '/legal' },
                                { label: t.footer.terms,   href: '/legal/terms' },
                                { label: t.footer.privacy, href: '/legal/privacy' },
                                { label: t.footer.cookie,  href: '/legal/cookies' },
                            ].map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 dark:border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-lg">
                    <p>{t.footer.rights.replace('{year}', year.toString())}</p>
                    <div className="flex gap-5">
                        {[
                            { label: 'Email',   href: 'mailto:hello@crowdclip.media' },
                            { label: 'Line',    href: 'https://line.me/ti/p/~crowdclip' },
                            { label: 'Discord', href: 'https://discord.gg/9WE9sGyZ' },
                        ].map(link => (
                            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                className="hover:text-secondary transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
