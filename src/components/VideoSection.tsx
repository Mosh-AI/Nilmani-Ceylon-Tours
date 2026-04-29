"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    setPlaying(true);
    videoRef.current?.play();
  }

  function handleVideoClick() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#0D0905] py-20 lg:py-28">

      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section label */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-xs font-medium uppercase tracking-luxury text-gold">
            Our Story
          </span>
          <div className="h-px w-12 bg-gold/40" />
        </div>

        {/* ── FULL-WIDTH VIDEO PLAYER ── */}
        <div className="relative mb-14 w-full overflow-hidden rounded-2xl lg:rounded-3xl"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.18)" }}
        >
          {/* Aspect ratio wrapper — 16:9 */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>

            {/* Video element */}
            <video
              ref={videoRef}
              src="/videos/nilmani-intro.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              preload="metadata"
              playsInline
              onClick={handleVideoClick}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              controls={playing}
              aria-label="Nilmani Ceylon Tours intro video"
            />

            {/* Play overlay — shown until first play */}
            {!playing && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play intro video"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 group focus-visible:outline-none"
                style={{ background: "linear-gradient(180deg, rgba(13,9,5,0.35) 0%, rgba(13,9,5,0.55) 100%)" }}
              >
                {/* Outer ripple rings */}
                <span className="absolute h-36 w-36 rounded-full border border-gold/15 animate-ping" style={{ animationDuration: "2.5s" }} />
                <span className="absolute h-28 w-28 rounded-full border border-gold/20 animate-ping" style={{ animationDuration: "2s" }} />

                {/* Play button */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.10) 100%)",
                    border: "2px solid rgba(201,168,76,0.7)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10 translate-x-1 text-gold drop-shadow-lg"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                    Watch Our Story
                  </p>
                  <p className="mt-1.5 text-xs font-light tracking-wide text-white/50">
                    Nilmani Ceylon Tours
                  </p>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(13,9,5,0.6), transparent)" }}
                />
              </button>
            )}

            {/* Corner gold marks — only visible before play */}
            {!playing && (
              <>
                <span className="absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-gold/50 rounded-tl-lg z-10 pointer-events-none" />
                <span className="absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-gold/50 rounded-tr-lg z-10 pointer-events-none" />
                <span className="absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-gold/50 rounded-bl-lg z-10 pointer-events-none" />
                <span className="absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-gold/50 rounded-br-lg z-10 pointer-events-none" />
              </>
            )}
          </div>
        </div>

        {/* ── CONTENT BELOW VIDEO ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* LEFT: Heading */}
          <div>
            <h2 className="font-serif text-4xl leading-[1.1] font-light text-white md:text-5xl xl:text-6xl">
              We Don&apos;t Just
              <br />
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Plan Trips
              </span>
              <br />
              <span className="text-white/90">We Craft Memories</span>
            </h2>

            {/* Stats row */}
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { value: "300+", label: "Happy Travelers" },
                { value: "4.7★", label: "Average Rating" },
                { value: "5+", label: "Years Experience" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-gold/30 pl-4">
                  <p className="font-serif text-2xl font-medium text-gold">{s.value}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Text + buttons */}
          <div className="flex flex-col justify-center">
            <p className="mb-8 text-base leading-relaxed text-white/60 lg:text-lg">
              Every journey we create is a reflection of your dreams. From the
              mist-covered highlands of Ella to the ancient ramparts of Galle —
              we weave together experiences that stay with you long after you
              return home.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
              >
                <span>Start Planning</span>
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold tracking-luxury text-white/80 transition-all duration-300 hover:border-gold/50 hover:text-gold"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
