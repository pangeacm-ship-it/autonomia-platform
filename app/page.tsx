import BusinessCases from "@/components/BusinessCases";
import ElenaSection from "@/components/ElenaSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Industries from "@/components/Industries";
import FinalCTA from "@/components/FinalCTA";
import Modules from "@/components/Modules";
import Navbar from "@/components/Navbar";
import PlanComparison from "@/components/PlanComparison";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] text-slate-950">
      <Navbar />
      <Hero />
      <Modules />
      <ElenaSection />
      <Pricing />
      <PlanComparison />
      <BusinessCases />
      <Industries />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
