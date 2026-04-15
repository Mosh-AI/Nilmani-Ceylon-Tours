import Link from "next/link";
import { Logo } from "./Logo";

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
      />
    </svg>
  );
}

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function IconWhatsApp({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-surface px-6 pt-16 pb-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:gap-12 lg:flex-row">
          <div className="max-w-xs">
            <Logo size="md" linkClassName="mb-4" />
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Experience Sri Lanka in elegance and comfort. Premium tours
              crafted for discerning travelers.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/nilmani_ceylon_tours/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-muted transition-all duration-300 hover:border-gold hover:text-gold"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61583096224962"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-muted transition-all duration-300 hover:border-gold hover:text-gold"
                aria-label="Facebook"
              >
                <IconFacebook />
              </a>
              <a
                href="https://wa.me/94787829952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-muted transition-all duration-300 hover:border-gold hover:text-gold"
                aria-label="WhatsApp"
              >
                <IconWhatsApp />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-luxury text-gold">
                Navigate
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  Home
                </Link>
                <Link
                  href="/#about"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  About
                </Link>
                <Link
                  href="/booking"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  Booking
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-luxury text-gold">
                Contact
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:nilmaniceylontours@gmail.com"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  nilmaniceylontours@gmail.com
                </a>
                <a
                  href="tel:+94787829952"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                >
                  +94 78 782 9952
                </a>
                <span className="text-sm text-brand-muted">
                  196/4, Yagodamulla, 11390
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-border pt-6 sm:flex-row">
          <p className="text-sm text-brand-faint">
            © 2026 Nilmani Ceylon Tours. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-brand-faint transition-colors hover:text-brand-muted"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-brand-faint transition-colors hover:text-brand-muted"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
