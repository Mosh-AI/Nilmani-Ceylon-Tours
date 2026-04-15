import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { Footer } from "@/components/Footer";
import { GuestTestimonialsSection } from "@/components/GuestTestimonialsSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import { TripadvisorSection } from "@/components/TripadvisorSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <HeroSection />
      <ServicesSection />
      <DestinationsSection />
      <AboutSection />
      <GuestTestimonialsSection />
      <TripadvisorSection />
      <CTASection />
      <Footer />
    </main>
  );
}
