// Revalidate homepage every 60 seconds so DB-driven sections (tours, testimonials) stay fresh
export const revalidate = 60;

import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { FeaturedToursSection } from "@/components/FeaturedToursSection";
import { Footer } from "@/components/Footer";
import { GuestTestimonialsSection } from "@/components/GuestTestimonialsSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { VideoSection } from "@/components/VideoSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <HeroSection />
      <VideoSection />
      <FeaturedToursSection />
      <DestinationsSection />
      <AboutSection />
      <GuestTestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
