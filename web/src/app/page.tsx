import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero-section";
import { DealerMarquee } from "@/components/marketing/dealer-marquee";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { FeaturesSection } from "@/components/marketing/features-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CtaSection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <HeroSection />
        <DealerMarquee />
        <ProductShowcase />
        <FeaturesSection />
        <StatsSection />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
