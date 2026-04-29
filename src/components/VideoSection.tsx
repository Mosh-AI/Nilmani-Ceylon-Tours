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
    <section className="bg-brand-bg px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT — Video player */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1C1209] shadow-2xl aspect-video">
            {/* Gold border frame */}
            <div className="absolute inset-[2px] rounded-3xl border border-gold/20 pointer-events-none z-10" />

            {/* Decorative corner marks */}
            <span className="absolute top-5 left-5 h-6 w-6 border-t-2 border-l-2 border-gold/50 rounded-tl-lg z-10 pointer-events-none" />
            <span className="absolute top-5 right-5 h-6 w-6 border-t-2 border-r-2 border-gold/50 rounded-tr-lg z-10 pointer-events-none" />
            <span className="absolute bottom-5 left-5 h-6 w-6 border-b-2 border-l-2 border-gold/50 rounded-bl-lg z-10 pointer-events-none" />
            <span className="absolute bottom-5 right-5 h-6 w-6 border-b-2 border-r-2 border-gold/50 rounded-br-lg z-10 pointer-events-none" />

            {/* Native video element */}
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

            {/* Custom play overlay — shown only before first play */}
            {!playing && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play intro video"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 group bg-[#1C1209]/60 backdrop-blur-[2px] transition-opacity duration-300 hover:bg-[#1C1209]/40 focus-visible:outline-none"
              >
                {/* Outer pulse ring */}
                <span className="absolute h-24 w-24 rounded-full border border-gold/30 animate-ping" />

                {/* Play button circle */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/70 bg-gold/15 backdrop-blur-sm transition-all duration-500 group-hover:border-gold group-hover:bg-gold/25 group-hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 translate-x-0.5 text-gold drop-shadow-lg"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-luxury text-gold">
                    Watch Our Story
                  </p>
                  <p className="mt-1 text-sm font-light text-white/60">
                    Nilmani Ceylon Tours
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* RIGHT — Tagline text */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Our Journey
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl leading-tight font-light text-brand-text md:text-5xl lg:text-6xl">
              We Don&apos;t Just
              <br />
              <span className="text-gold-gradient italic">Plan Trips</span>
              <br />
              We Craft Memories
            </h2>
            <p className="mb-8 text-base leading-relaxed text-brand-muted lg:text-lg">
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
                className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
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
