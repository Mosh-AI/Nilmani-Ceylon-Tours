import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LotusIcon } from "@/components/LotusIcon";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-6 pt-20">
        <div className="mx-auto max-w-lg text-center">
          <LotusIcon size={56} className="mx-auto mb-6 opacity-40" />

          <p className="font-serif text-[8rem] font-bold leading-none text-gold sm:text-[10rem]">
            404
          </p>

          <div className="gold-divider mx-auto my-6" />

          <h1 className="font-serif text-3xl font-semibold text-brand-text sm:text-4xl">
            Page Not Found
          </h1>

          <p className="mt-4 text-base leading-relaxed text-brand-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="btn-gold inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold tracking-luxury"
            >
              <span>Back to Home</span>
            </Link>

            <Link
              href="/booking"
              className="btn-outline-gold inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold tracking-luxury"
            >
              Explore Our Tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
