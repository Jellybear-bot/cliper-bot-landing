"use client";
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
    );
}
