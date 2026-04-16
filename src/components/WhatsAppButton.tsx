"use client";

import { useState, useEffect } from "react";

/**
 * Floating WhatsApp contact button.
 * Replace the phone number below with the actual Nilmani Ceylon Tours WhatsApp number.
 */
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94787829952";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Nilmani%20Ceylon%20Tours%2C%20I%27m%20interested%20in%20booking%20a%20tour`;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        transform: visible ? "translateY(0)" : "translateY(1rem)",
        opacity: visible ? 1 : 0,
      }}
      className="whatsapp-btn fixed bottom-6 right-20 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] group"
    >
      {/* Tooltip */}
      <span
        className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whatsapp-tooltip"
        role="tooltip"
      >
        Chat with us
      </span>

      {/* Official WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16.002c0 3.502 1.128 6.744 3.046 9.378L1.06 31.29l6.162-1.97a15.915 15.915 0 0 0 8.782 2.632C24.826 31.952 32 24.778 32 16.002 32 7.174 24.826 0 16.004 0zm9.51 22.604c-.396 1.116-2.328 2.076-3.21 2.196-.882.12-1.698.396-5.706-1.188-4.836-1.908-7.896-6.894-8.136-7.212-.228-.318-1.896-2.52-1.896-4.812 0-2.292 1.2-3.42 1.626-3.888.426-.468.93-.582 1.242-.582.306 0 .618.006.888.018.288.012.672-.108 1.05.804.396.93 1.344 3.27 1.464 3.51.12.24.198.516.036.834-.162.318-.246.516-.486.792-.24.282-.504.624-.72.84-.24.24-.492.498-.21.978.276.48 1.236 2.04 2.652 3.3 1.824 1.626 3.36 2.13 3.84 2.37.48.24.762.204 1.044-.12.282-.324 1.2-1.398 1.524-1.878.318-.48.642-.396 1.08-.24.438.162 2.784 1.314 3.264 1.554.48.24.798.36.918.558.12.198.12 1.146-.276 2.262l-.084.042z" />
      </svg>
    </a>
  );
}
