"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from '../translations/en';
import { th } from '../translations/th';

type Language = 'en' | 'th';
type Dictionary = typeof en;

interface LanguageContextType {
    language: Language;
    t: Dictionary;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('th');

    // Try to load language preference from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'en' || saved === 'th')) {
            setLanguage(saved);
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = language === 'en' ? en : th;

    return (
        <LanguageContext.Provider value={{ language, t, setLanguage: changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
