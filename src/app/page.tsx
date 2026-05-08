"use client";
import Header from '@/components/crowdclip/Header';
import Hero from '@/components/crowdclip/Hero';
import { Trust, ProblemSolution } from '@/components/crowdclip/TrustAndProblem';
import { HowItWorks, Pricing } from '@/components/crowdclip/HowAndPricing';
import Inquiry from '@/components/crowdclip/Inquiry';
import { FAQ, FinalCTA, Footer } from '@/components/crowdclip/FAQAndFinal';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#fff8f1] text-[#1a0f08] selection:bg-[#ff6b3d]/25" style={{ fontFamily: 'var(--font-thai), "Noto Sans Thai", sans-serif', overflowX: 'hidden' }}>
            <Header />

            <main>
                <Hero />
                <Trust />
                <ProblemSolution />
                <HowItWorks />
                <Pricing />
                <Inquiry />
                <FAQ />
                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
}
