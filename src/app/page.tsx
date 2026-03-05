"use client";
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SocialProof from '@/components/SocialProof';
import ProblemSolution from '@/components/ProblemSolution';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-500/30">
            <Header />

            <main>
                <HeroSection />
                <SocialProof />
                <ProblemSolution />
                <HowItWorks />
                <Pricing />
                <FAQ />
                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
}
