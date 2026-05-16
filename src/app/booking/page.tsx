"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingStep1Schema,
  bookingStep2Schema,
  type BookingStep1Data,
  type BookingStep2Data,
} from "@/lib/validations";
import { submitBookingForm } from "@/app/actions/booking";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────── */

type TourOption = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  duration: number;
  price: number;
  category: string | null;
  heroImage: string | null;
  personsIncluded: number | null;
  difficulty: string | null;
};

/* ── Step indicator ─────────────────────────────────────────────────────── */

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Trip Details", "Your Info", "Confirm"];
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  done
                    ? "bg-[#C9A84C] text-white"
                    : active
                    ? "bg-[#1C1209] text-[#C9A84C]"
                    : "border border-brand-border bg-white text-brand-muted"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : step}
              </div>
              <p className={`mt-1.5 text-xs ${active ? "font-semibold text-brand-text" : "text-brand-muted"}`}>
                {label}
              </p>
            </div>
            {step < total && (
              <div className={`mb-4 h-px w-12 sm:w-20 transition-colors ${step < current ? "bg-[#C9A84C]" : "bg-brand-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tour selection card ─────────────────────────────────────────────────── */

function TourCard({ tour, onSelect }: { tour: TourOption; onSelect: (t: TourOption) => void }) {
  const nights = tour.duration - 1;
  return (
    <button
      type="button"
      onClick={() => onSelect(tour)}
      className="group relative w-full overflow-hidden rounded-2xl border border-brand-border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.heroImage ?? "/images/sigiriya-hero.jpg"}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Category badge */}
        {tour.category && (
          <span className="absolute left-3 top-3 rounded-full bg-[#C9A84C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1C1209]">
            {tour.category}
          </span>
        )}
        {/* Duration overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{tour.duration} Days / {nights} Nights</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-light text-[#1C1209] group-hover:text-[#C9A84C] transition-colors">
          {tour.title}
        </h3>
        {tour.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{tour.subtitle}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">From</p>
            <p className="text-lg font-semibold text-[#1C1209]">
              ${tour.price.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-gray-400">/ {tour.personsIncluded ?? 2} persons</span>
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1209] text-[#C9A84C] transition-all group-hover:bg-[#C9A84C] group-hover:text-[#1C1209]">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Matched location type ───────────────────────────────────────────────── */

type MatchedLocation = { slug: string; name: string };

/* ── Tour selection grid ─────────────────────────────────────────────────── */

function TourSelector({
  onSelect,
  locationSlugs,
}: {
  onSelect: (t: TourOption) => void;
  locationSlugs: string[];
}) {
  const [tours, setTours] = useState<TourOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<boolean | null>(null);
  const [matchedLocations, setMatchedLocations] = useState<MatchedLocation[]>([]);

  useEffect(() => {
    const url =
      locationSlugs.length > 0
        ? `/api/tours?locations=${locationSlugs.join(",")}`
        : "/api/tours";

    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setTours(d.tours ?? []);
        setFiltered(d.filtered ?? null);
        setMatchedLocations(d.matchedLocations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locationSlugs.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFiltering = locationSlugs.length > 0;
  const noMatchFallback = isFiltering && filtered === false;
  const activeFilter = isFiltering && filtered === true;

  return (
    <section className="bg-brand-bg py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            Step 1 of 3
          </p>
          <h2 className="font-serif text-3xl font-light text-[#1C1209] md:text-4xl">
            {activeFilter ? "Tours Visiting Your Destinations" : "Choose Your Tour"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
            {activeFilter
              ? "These tours include the destinations you selected. All are fully private and can be customised."
              : "Select the tour you'd like to book. All tours are fully private and can be customised to your preferences."}
          </p>
        </div>

        {/* Location filter banner */}
        {isFiltering && !loading && (
          <div
            className={`mb-8 overflow-hidden rounded-2xl border ${
              activeFilter
                ? "border-[#C9A84C]/30 bg-gradient-to-r from-[#FDFAF5] to-[#F7F1E8]"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            {activeFilter ? (
              <div className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="flex items-center gap-2 text-[#C9A84C]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6914]">
                    Filtered by location
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedLocations.map((loc) => (
                    <span
                      key={loc.slug}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1209] px-3 py-1 text-xs font-semibold text-[#C9A84C]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                      {loc.name}
                    </span>
                  ))}
                </div>
                <p className="ml-auto text-xs text-gray-400">
                  {tours.length} tour{tours.length !== 1 ? "s" : ""} found
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-3 px-6 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Star className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    No tours found for{" "}
                    {locationSlugs.map((s) => (
                      <span
                        key={s}
                        className="mx-0.5 rounded bg-amber-200/60 px-1.5 py-0.5 font-mono text-xs capitalize"
                      >
                        {s}
                      </span>
                    ))}
                  </p>
                  <p className="mt-0.5 text-xs text-amber-700">
                    Showing all available tours instead. Contact us to arrange a custom itinerary.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white">
                <div className="h-44 rounded-t-2xl bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-6 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} onSelect={onSelect} />
            ))}
          </div>
        )}

        {/* Browse all link when filtered */}
        {activeFilter && !loading && (
          <div className="mt-8 text-center">
            <a
              href="/booking"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 underline-offset-2 transition hover:text-[#C9A84C] hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Browse all tours
            </a>
          </div>
        )}

        <p className={`text-center text-sm text-gray-400 ${activeFilter ? "mt-3" : "mt-8"}`}>
          Looking for something custom?{" "}
          <a href="/contact" className="text-[#C9A84C] underline-offset-2 hover:underline">
            Contact us directly
          </a>
        </p>
      </div>
    </section>
  );
}

/* ── Form styles ─────────────────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-md border border-brand-border bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";
const errorClass = "mt-1 text-xs text-red-600";
const labelClass = "mb-1.5 block text-sm font-medium text-brand-text";

/* ── Main inner component ────────────────────────────────────────────────── */

function BookingPageInner() {
  const searchParams = useSearchParams();

  const urlTourId   = searchParams.get("tourId") ?? "";
  const urlTourName = searchParams.get("tourName") ?? "";
  const urlDuration = Math.max(1, Math.min(30, parseInt(searchParams.get("duration") ?? "7", 10) || 7));
  const urlGuests   = Math.max(1, Math.min(20, parseInt(searchParams.get("guests") ?? "2", 10) || 2));
  const urlPrice    = parseInt(searchParams.get("price") ?? "0", 10) || 0;
  const hasUrlTour  = Boolean(urlTourName);

  const locationSlugs = (searchParams.get("locations") ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  // Selected tour state (either from URL params or picked from the selector)
  const [selectedTour, setSelectedTour] = useState<{
    id: string; name: string; duration: number; guests: number; price: number;
  } | null>(
    hasUrlTour
      ? { id: urlTourId, name: urlTourName, duration: urlDuration, guests: urlGuests, price: urlPrice }
      : null
  );

  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<BookingStep1Data | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; referenceCode?: string } | null>(null);

  function handleTourSelect(tour: TourOption) {
    setSelectedTour({
      id: tour.id,
      name: tour.title,
      duration: tour.duration,
      guests: tour.personsIncluded ?? 2,
      price: tour.price,
    });
  }

  /* Step 1 form */
  const form1 = useForm<BookingStep1Data>({
    resolver: zodResolver(bookingStep1Schema),
    defaultValues: {
      tourId: selectedTour?.id || undefined,
      tourName: selectedTour?.name || undefined,
      duration: selectedTour?.duration ?? 7,
      guests: selectedTour?.guests ?? 2,
    },
  });

  // Sync form defaults when a tour is selected from the grid
  useEffect(() => {
    if (selectedTour) {
      form1.setValue("tourId", selectedTour.id || undefined);
      form1.setValue("tourName", selectedTour.name);
      form1.setValue("duration", selectedTour.duration);
      form1.setValue("guests", selectedTour.guests);
    }
  }, [selectedTour, form1]);

  /* Step 2 form */
  const form2 = useForm<BookingStep2Data>({
    resolver: zodResolver(bookingStep2Schema),
  });

  function handleStep1(data: BookingStep1Data) {
    setStep1Data(data);
    setStep(2);
  }

  async function handleStep2(data: BookingStep2Data) {
    if (!step1Data) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await submitBookingForm({ ...step1Data, ...data });
      if (res.success) {
        setResult({ success: true, message: res.message, referenceCode: res.referenceCode });
        setStep(3);
      } else {
        setResult({ success: false, message: res.error });
      }
    } catch {
      setResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success screen ── */
  if (step === 3 && result?.success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-brand-bg pt-20">
          <HeroSection />
          <section className="bg-brand-bg py-16 md:py-24">
            <div className="mx-auto max-w-lg px-6 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-light text-brand-text">
                Booking Enquiry Received!
              </h2>
              {result.referenceCode && (
                <p className="mt-4 rounded-lg bg-[#F0EBE0] p-4 font-mono text-lg text-brand-text">
                  Reference: <strong>{result.referenceCode}</strong>
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                We&apos;ve sent a confirmation to your email. Roshan will be in
                touch within 24 hours with a tailored quote and detailed itinerary.
              </p>
              <a
                href="https://wa.me/94787829952"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#1ebe5a]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
              <p className="mt-4">
                <a href="/" className="text-sm text-gold underline-offset-2 hover:underline">
                  Return to homepage
                </a>
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  /* ── No tour selected → show tour picker ── */
  if (!selectedTour) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-brand-bg pt-20">
          <HeroSection locationSlugs={locationSlugs} />
          <TourSelector onSelect={handleTourSelect} locationSlugs={locationSlugs} />
        </main>
        <Footer />
      </>
    );
  }

  /* ── Tour selected → show multi-step form ── */
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg pt-20">
        <HeroSection />
        <section className="bg-brand-bg py-12 md:py-20">
          <div className="mx-auto max-w-xl px-6">

            {/* "You're booking" card */}
            <div className="mb-6 overflow-hidden rounded-xl border border-[#C9A84C]/30 bg-[#FDFAF5]">
              <div className="flex items-center justify-between border-b border-[#C9A84C]/20 bg-[#1C1209] px-5 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C]">
                  You&apos;re booking
                </p>
                {!hasUrlTour && (
                  <button
                    type="button"
                    onClick={() => { setSelectedTour(null); setStep(1); }}
                    className="text-[10px] font-medium text-[#C9A84C]/70 underline-offset-2 hover:text-[#C9A84C] hover:underline"
                  >
                    Change tour
                  </button>
                )}
              </div>
              <div className="px-5 py-4">
                <p className="font-serif text-xl font-light text-[#1C1209]">{selectedTour.name}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 text-[#C9A84C]" />
                    {selectedTour.duration} days
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Users className="h-3.5 w-3.5 text-[#C9A84C]" />
                    {selectedTour.guests} {selectedTour.guests === 1 ? "guest" : "guests"} (default)
                  </span>
                  {selectedTour.price > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-[#C9A84C]" />
                      From ${selectedTour.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <StepIndicator current={step} total={3} />

            {/* Error banner */}
            {result && !result.success && (
              <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p>{result.message}</p>
              </div>
            )}

            <div className="rounded-xl border border-brand-border bg-white p-8 shadow-sm">
              {/* ── Step 1: Trip Details ── */}
              {step === 1 && (
                <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-5" noValidate>
                  <div>
                    <h2 className="font-serif text-2xl font-light text-brand-text">Trip Details</h2>
                    <p className="mt-1 text-sm text-brand-muted">Confirm your trip details below.</p>
                  </div>

                  <input type="hidden" {...form1.register("tourId")} />

                  <div>
                    <label htmlFor="tourName" className={labelClass}>
                      Tour / Trip Type <span className="text-red-500">*</span>
                    </label>
                    <div className={`${inputClass} cursor-default bg-gray-50 text-gray-700`}>
                      {selectedTour.name}
                    </div>
                    {form1.formState.errors.tourName && (
                      <p className={errorClass}>{form1.formState.errors.tourName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className={labelClass}>
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClass}
                        {...form1.register("startDate")}
                      />
                      {form1.formState.errors.startDate && (
                        <p className={errorClass}>{form1.formState.errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="duration" className={labelClass}>
                        Duration (days) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="duration"
                        type="number"
                        min={1}
                        max={30}
                        className={inputClass}
                        {...form1.register("duration", { valueAsNumber: true })}
                      />
                      {form1.formState.errors.duration && (
                        <p className={errorClass}>{form1.formState.errors.duration.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className={labelClass}>
                      Number of Guests <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="guests"
                      className={inputClass}
                      {...form1.register("guests", { valueAsNumber: true })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                      ))}
                      <option value={12}>10–12 guests (group)</option>
                      <option value={16}>13–16 guests (group)</option>
                      <option value={20}>17–20 guests (group)</option>
                    </select>
                    {form1.formState.errors.guests && (
                      <p className={errorClass}>{form1.formState.errors.guests.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className={labelClass}>
                      Special Requests{" "}
                      <span className="font-normal text-brand-muted">(optional)</span>
                    </label>
                    <textarea
                      id="specialRequests"
                      rows={3}
                      placeholder="Dietary requirements, accessibility needs, specific interests..."
                      className={`${inputClass} resize-none`}
                      {...form1.register("specialRequests")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1209] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A]"
                  >
                    Next: Your Information
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* ── Step 2: Personal Information ── */}
              {step === 2 && (
                <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-5" noValidate>
                  <div>
                    <h2 className="font-serif text-2xl font-light text-brand-text">Your Information</h2>
                    <p className="mt-1 text-sm text-brand-muted">
                      We&apos;ll use these details to contact you with your quote.
                    </p>
                  </div>

                  {/* Honeypot */}
                  <div aria-hidden="true" className="hidden">
                    <input tabIndex={-1} autoComplete="off" {...form2.register("website")} />
                  </div>

                  <div>
                    <label htmlFor="guestName" className={labelClass}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input id="guestName" type="text" placeholder="Your full name" autoComplete="name" className={inputClass} {...form2.register("guestName")} />
                    {form2.formState.errors.guestName && <p className={errorClass}>{form2.formState.errors.guestName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...form2.register("email")} />
                    {form2.formState.errors.email && <p className={errorClass}>{form2.formState.errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input id="phone" type="tel" placeholder="+44 7700 000000" autoComplete="tel" className={inputClass} {...form2.register("phone")} />
                    {form2.formState.errors.phone && <p className={errorClass}>{form2.formState.errors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="nationality" className={labelClass}>
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <input id="nationality" type="text" placeholder="e.g. British, German, Australian..." autoComplete="country-name" className={inputClass} {...form2.register("nationality")} />
                    {form2.formState.errors.nationality && <p className={errorClass}>{form2.formState.errors.nationality.message}</p>}
                  </div>

                  {/* Trip summary */}
                  {step1Data && (
                    <div className="rounded-lg border border-brand-border bg-[#FDFAF5] p-4 text-sm">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-[#C9A84C]" />
                        <p className="font-semibold text-brand-text">Trip Summary</p>
                      </div>
                      <div className="space-y-1 text-brand-muted">
                        <p>Tour: {step1Data.tourName}</p>
                        <p>Start: {step1Data.startDate} · {step1Data.duration} days · {step1Data.guests} guests</p>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="mt-2 text-xs text-gold underline-offset-2 hover:underline">
                        Edit trip details
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 rounded-full border border-brand-border px-5 py-3 text-sm font-medium text-brand-text transition hover:border-gold hover:text-gold"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1C1209] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : "Submit Booking Enquiry"}
                      {!submitting && <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>

                  <p className="text-center text-xs text-brand-muted">
                    No payment required now. We&apos;ll send you a personalised quote first.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Page export with Suspense ───────────────────────────────────────────── */

export default function BookingPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="min-h-screen bg-brand-bg pt-20">
          <HeroSection />
        </main>
        <Footer />
      </>
    }>
      <BookingPageInner />
    </Suspense>
  );
}

/* ── Hero section with background image ─────────────────────────────────── */

function HeroSection({ locationSlugs = [] }: { locationSlugs?: string[] }) {
  const hasLocations = locationSlugs.length > 0;
  return (
    <section className="relative overflow-hidden bg-[#1C1209] py-24 md:py-32">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sigiriya-hero.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1209]/60 via-[#1C1209]/70 to-[#1C1209]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Breadcrumb
          items={[{ label: "Book a Tour" }]}
          className="mb-6 justify-center"
        />
        <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
          {hasLocations ? "Tours to Your Destinations" : "Book Your Sri Lanka Journey"}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-[#C9A84C]/80 md:text-lg">
          {hasLocations
            ? "We've filtered tours that visit the destinations you're interested in."
            : "No payment required. Choose your tour, share your details, and we'll send a personalised itinerary and quote within 24 hours."}
        </p>

        {/* Location pills in hero */}
        {hasLocations && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {locationSlugs.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-1.5 text-sm font-medium capitalize text-[#C9A84C]"
              >
                <MapPin className="h-3.5 w-3.5" />
                {slug}
              </span>
            ))}
          </div>
        )}

        <div className="mx-auto mt-6 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-[#C9A84C]/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
          <div className="h-px w-16 bg-[#C9A84C]/40" />
        </div>
      </div>
    </section>
  );
}
