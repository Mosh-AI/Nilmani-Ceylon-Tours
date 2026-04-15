"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MapPin,
  CalendarRange,
  ShieldCheck,
  Star,
  Users,
  Award,
  Clock,
  Globe,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const stats = [
  { value: "500+", label: "Happy Guests", icon: Users },
  { value: "100%", label: "Custom Itineraries", icon: CalendarRange },
  { value: "4.9", label: "Star Rating", icon: Star },
  { value: "5+", label: "Years Experience", icon: Clock },
] as const;

const values = [
  {
    icon: Heart,
    title: "Personal Touch",
    description:
      "Every tour is personally guided by Roshan himself, never outsourced to third parties. You travel with someone who genuinely cares about your experience and knows every detail of the journey ahead.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "Born and raised in Sri Lanka, Roshan knows every hidden gem, secret viewpoint, and authentic local restaurant that guidebooks miss. His knowledge transforms a good trip into an unforgettable one.",
  },
  {
    icon: CalendarRange,
    title: "Flexible Journeys",
    description:
      "Your schedule, your pace, your interests. Want to linger at a temple, take an unplanned detour to a waterfall, or stop at a roadside fruit stall? Every itinerary bends to your wishes.",
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Travel with complete peace of mind. All vehicles are fully licensed, insured, and meticulously maintained. Roshan holds all required tourism certifications and prioritizes your wellbeing above all.",
  },
] as const;

const specialties = [
  "Cultural & Heritage Tours",
  "Wildlife Safaris",
  "Family Trips",
  "Hill Country & Tea Trails",
  "Beach & Coastal Escapes",
  "Honeymoon Packages",
] as const;

function useRevealOnScroll(sectionId: string) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(`#${sectionId} .reveal, #${sectionId} .reveal-left`)
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionId]);
}

export default function AboutPage() {
  useRevealOnScroll("about-story");
  useRevealOnScroll("about-stats");
  useRevealOnScroll("about-values");
  useRevealOnScroll("about-guide");
  useRevealOnScroll("about-cta");

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => {
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Section 1: Hero */}
        <section className="relative flex min-h-[60vh] items-center overflow-hidden md:min-h-[70vh]">
          <div className="absolute inset-0">
            <Image
              src="/images/sigiriya-hero.jpg"
              alt="Sigiriya Lion Rock fortress rising above lush green landscapes in Sri Lanka"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            <div className="noise-overlay" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-sm text-white/60"
            >
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-white/40" aria-hidden="true">
                    /
                  </span>
                  <span className="font-semibold text-white" aria-current="page">
                    About Us
                  </span>
                </li>
              </ol>
            </nav>
            <div className="mb-8 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Our Story
              </span>
            </div>
            <h1 className="mb-6 max-w-3xl font-serif text-4xl leading-[1.1] font-light text-white sm:text-5xl md:text-6xl lg:text-7xl">
              About Nilmani
              <br />
              <span className="text-gold-gradient italic">Ceylon Tours</span>
            </h1>
            <p className="max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg">
              Your trusted partner for authentic Sri Lanka experiences since
              2019. We turn travel dreams into lifelong memories.
            </p>
          </div>
        </section>

        {/* Section 2: Our Story */}
        <section
          id="about-story"
          className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="reveal-left">
                <div className="mb-6 flex items-center gap-3">
                  <div className="gold-divider" />
                  <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                    How It All Began
                  </span>
                </div>
                <h2 className="mb-8 font-serif text-3xl leading-tight font-light text-brand-text md:text-4xl lg:text-5xl">
                  A Passion for
                  <br />
                  <span className="text-gold-gradient italic">
                    Sharing Sri Lanka
                  </span>
                </h2>
                <div className="space-y-5 text-base leading-relaxed text-brand-muted lg:text-lg">
                  <p>
                    My name is Roshan Jayasuriya, and I was born and raised in
                    the heart of Sri Lanka. For as long as I can remember, I have
                    been captivated by the beauty of this island — its ancient
                    ruins draped in jungle vine, its misty tea plantations, its
                    golden beaches, and above all, the warmth of its people.
                  </p>
                  <p>
                    I started Nilmani Ceylon Tours because I saw too many
                    travelers experience Sri Lanka through the window of a rushed
                    tour bus, missing the real soul of the country. I wanted to
                    change that. Nilmani, a name deeply meaningful to my family,
                    represents something precious — and that is exactly how I
                    treat every guest who trusts me with their journey.
                  </p>
                  <p>
                    Based in Seeduwa, just minutes from Bandaranaike
                    International Airport, I greet my guests the moment they
                    arrive. From that first handshake to the final farewell, I am
                    your driver, your guide, and your friend. I speak fluent
                    English, know every corner of this island, and take
                    immense pride in crafting tours that are as unique as the
                    people I serve.
                  </p>
                </div>
              </div>

              <div className="reveal relative">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/sigiriya.jpg"
                    alt="Sigiriya Rock Fortress surrounded by ancient royal gardens and lush greenery"
                    width={640}
                    height={480}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                </div>
                <div className="absolute -right-4 -bottom-4 z-[-1] h-full w-full rounded-2xl border border-brand-border-gold bg-brand-surface md:-right-6 md:-bottom-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Stats */}
        <section
          id="about-stats"
          className="bg-brand-surface px-6 py-20 lg:px-12 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="reveal mb-14 text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="gold-divider" />
                <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                  By the Numbers
                </span>
                <div className="gold-divider" />
              </div>
              <h2 className="font-serif text-3xl font-light text-brand-text md:text-4xl lg:text-5xl">
                Trusted by{" "}
                <span className="text-gold-gradient italic">Travelers</span>{" "}
                Worldwide
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={cn(
                      "reveal rounded-2xl border border-brand-border bg-white p-6 text-center transition-all duration-500 hover:border-brand-border-gold hover:shadow-lg md:p-8",
                      i === 1 && "delay-100",
                      i === 2 && "delay-200",
                      i === 3 && "delay-300"
                    )}
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface">
                        <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="mb-2 font-serif text-3xl font-medium text-gold md:text-4xl">
                      {stat.value}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Our Values */}
        <section
          id="about-values"
          className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="reveal mb-14 text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="gold-divider" />
                <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                  What We Stand For
                </span>
                <div className="gold-divider" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-light text-brand-text md:text-4xl lg:text-5xl">
                Our{" "}
                <span className="text-gold-gradient italic">Values</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-muted">
                Every journey with Nilmani Ceylon Tours is built on four
                principles that guide everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className={cn(
                      "reveal group cursor-default rounded-2xl border border-brand-border bg-brand-surface p-6 transition-all duration-500 hover:border-brand-border-gold hover:-translate-y-1 hover:shadow-lg md:p-8",
                      i === 1 && "delay-100",
                      i === 2 && "delay-200",
                      i === 3 && "delay-300"
                    )}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white transition-colors duration-300 group-hover:bg-gold/10">
                      <Icon
                        className="h-6 w-6 text-gold"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="mb-3 font-serif text-xl font-light text-brand-text">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-muted">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Meet Your Guide */}
        <section
          id="about-guide"
          className="bg-brand-surface px-6 py-24 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="reveal lg:col-span-2">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/ella.jpg"
                    alt="Scenic view of Ella, Sri Lanka, with lush green hills and tea plantations"
                    width={500}
                    height={600}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                </div>
              </div>

              <div className="reveal-left lg:col-span-3">
                <div className="mb-6 flex items-center gap-3">
                  <div className="gold-divider" />
                  <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                    Your Host
                  </span>
                </div>
                <h2 className="mb-2 font-serif text-3xl font-light text-brand-text md:text-4xl lg:text-5xl">
                  Roshan{" "}
                  <span className="text-gold-gradient italic">
                    Jayasuriya
                  </span>
                </h2>
                <p className="mb-6 text-sm font-medium uppercase tracking-luxury text-gold">
                  Founder & Lead Guide
                </p>
                <p className="mb-8 text-base leading-relaxed text-brand-muted lg:text-lg">
                  With over five years of experience guiding international
                  travelers across Sri Lanka, Roshan brings an unmatched
                  combination of local knowledge, genuine hospitality, and
                  meticulous attention to detail. Whether you are exploring the
                  ancient ruins of Anuradhapura, tracking leopards in Yala
                  National Park, or winding through the emerald tea hills of
                  Nuwara Eliya, Roshan ensures every moment is seamless,
                  comfortable, and truly memorable.
                </p>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Globe
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="mb-1 text-sm font-medium text-brand-text">
                        Languages
                      </p>
                      <p className="text-sm text-brand-muted">
                        English, Sinhala
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="mb-1 text-sm font-medium text-brand-text">
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {specialties.map((s) => (
                          <span
                            key={s}
                            className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs text-brand-muted"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <a
                    href="https://wa.me/94787829952?text=Hello%20Roshan%2C%20I%27d%20like%20to%20discuss%20a%20tour%20of%20Sri%20Lanka."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-luxury"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                    <span>WhatsApp Roshan</span>
                  </a>
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-luxury"
                  >
                    <Mail className="h-4 w-4" strokeWidth={2} />
                    <span>Send an Email</span>
                  </a>
                  <a
                    href="tel:+94787829952"
                    className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-luxury"
                  >
                    <Phone className="h-4 w-4" strokeWidth={2} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: CTA */}
        <section
          id="about-cta"
          className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative flex min-h-[380px] items-center overflow-hidden rounded-3xl md:min-h-[440px]">
              <Image
                src="/images/beach-cta.jpg"
                alt="Sri Lankan beach at sunset with golden sand, palm trees, and gentle waves"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
              <div className="noise-overlay" />

              <div className="relative z-10 max-w-2xl px-8 py-16 md:px-16">
                <div className="reveal mb-6 flex items-center gap-3">
                  <div className="gold-divider" />
                  <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                    Start Your Adventure
                  </span>
                </div>
                <h2 className="reveal mb-6 font-serif text-3xl leading-tight font-light text-white delay-100 sm:text-4xl md:text-5xl lg:text-6xl">
                  Ready to Explore
                  <br />
                  <span className="text-gold-gradient italic">Sri Lanka?</span>
                </h2>
                <p className="reveal mb-10 max-w-md text-base leading-relaxed text-white/70 delay-200 md:text-lg">
                  Let Roshan design a journey that is uniquely yours. Whether you
                  have a detailed plan or just a dream, we will make it happen.
                </p>
                <div className="reveal flex flex-col gap-4 delay-300 sm:flex-row">
                  <Link
                    href="/booking"
                    className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
                  >
                    <span>Browse Our Tours</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
