import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PrivacyTOC } from "./PrivacyTOC";
import { BackToTopButton } from "./BackToTopButton";

export const metadata: Metadata = {
  title: "Privacy Policy — Nilmani Ceylon Tours",
  description:
    "How Nilmani Ceylon Tours collects, uses, and protects your personal information when using our website and tour booking services.",
};

const SECTIONS = [
  { id: "who-we-are",              num: "01", title: "Who We Are" },
  { id: "information-we-collect",  num: "02", title: "Information We Collect" },
  { id: "how-we-use",              num: "03", title: "How We Use Your Information" },
  { id: "how-we-share",            num: "04", title: "How We Share Information" },
  { id: "international-transfers", num: "05", title: "International Data Transfers" },
  { id: "legal-basis",             num: "06", title: "Legal Basis for Processing" },
  { id: "data-retention",          num: "07", title: "Data Retention" },
  { id: "your-rights",             num: "08", title: "Your Rights" },
  { id: "cookies",                 num: "09", title: "Cookies & Tracking" },
  { id: "data-security",           num: "10", title: "Data Security" },
  { id: "children",                num: "11", title: "Children's Privacy" },
  { id: "updates-contact",         num: "12", title: "Updates & Contact" },
] as const;

// ─── Table data ───────────────────────────────────────────────────────────────

interface CollectRow {
  type: string;
  examples: string;
  why: string;
}

const INFO_COLLECT_ROWS: CollectRow[] = [
  {
    type: "Contact details",
    examples: "Full name, email, phone, nationality",
    why: "To communicate and confirm bookings",
  },
  {
    type: "Travel details",
    examples: "Dates, destinations, group size, preferences",
    why: "To plan and customise your tour",
  },
  {
    type: "Identity details",
    examples: "Passport number, copy of passport",
    why: "Required by hotels, authorities, or for emergency use",
  },
  {
    type: "Health & emergency",
    examples: "Dietary needs, allergies, medical conditions, emergency contact",
    why: "To ensure safety and proper arrangements during tours",
  },
  {
    type: "Payment details",
    examples: "Billing name, transaction ID from PayPal",
    why: "To verify payment via our third-party processor",
  },
  {
    type: "Website data",
    examples: "IP address, browser type, cookies via Google Analytics & Meta Pixel",
    why: "To analyse traffic and improve marketing",
  },
  {
    type: "Communication",
    examples: "Messages, reviews, feedback",
    why: "To provide support and improve services",
  },
];

interface ShareRow {
  sharedWith: string;
  what: string;
  purpose: string;
}

const INFO_SHARE_ROWS: ShareRow[] = [
  {
    sharedWith: "PayPal",
    what: "Name, email, booking details",
    purpose: "To process payments securely",
  },
  {
    sharedWith: "Hotels, drivers, guides",
    what: "Name, phone, passport info, dietary or medical notes",
    purpose: "To check you in and ensure safe service",
  },
  {
    sharedWith: "Google Analytics, Meta",
    what: "Anonymised usage data, cookies",
    purpose: "Website analytics and advertising",
  },
  {
    sharedWith: "Legal authorities",
    what: "As required by law",
    purpose: "Compliance, safety, fraud prevention",
  },
];

interface RightCard {
  right: string;
  description: string;
}

const YOUR_RIGHTS: RightCard[] = [
  { right: "Access", description: "Request a copy of all personal data we hold about you." },
  { right: "Correct", description: "Ask us to fix inaccurate or incomplete data." },
  { right: "Delete", description: "Request erasure of your data where no legal obligation to retain it exists." },
  { right: "Object", description: "Object to processing based on legitimate interests." },
  { right: "Portability", description: "Receive your data in a machine-readable format." },
  { right: "Withdraw consent", description: "Withdraw consent for marketing or non-essential cookies at any time." },
];

// ─── Helper components ────────────────────────────────────────────────────────

function SectionCard({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="reveal scroll-mt-28 rounded-2xl border border-brand-border bg-white p-8 shadow-sm transition-all duration-500 hover:border-[rgba(201,168,76,0.3)] hover:shadow-md"
    >
      <div className="mb-5 flex items-start gap-4">
        <span
          className="shrink-0 font-serif text-4xl font-light leading-none"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-hidden="true"
        >
          {num}
        </span>
        <h2 className="pt-1 font-serif text-2xl font-light text-brand-text md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mb-6 h-px bg-brand-border" />
      <div className="space-y-4 text-sm leading-relaxed text-brand-muted">
        {children}
      </div>
    </section>
  );
}

function DataTable<T extends object>({
  headers,
  rows,
  keys,
}: {
  headers: string[];
  rows: T[];
  keys: (keyof T)[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-border">
      <table className="w-full text-sm">
        <thead>
          <tr
            className="border-b"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,168,76,0.10) 0%, rgba(232,201,106,0.10) 50%, rgba(201,168,76,0.10) 100%)",
              borderColor: "rgba(201,168,76,0.3)",
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-luxury text-gold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="transition-colors duration-150 hover:bg-brand-surface/60"
            >
              {keys.map((k) => (
                <td key={String(k)} className="px-5 py-3.5 text-sm text-brand-muted first:font-medium first:text-brand-text">
                  {String(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-brand-bg">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative border-b border-brand-border bg-brand-bg pb-12 pt-28 lg:pt-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-brand-muted">
              <Link href="/" className="transition-colors hover:text-brand-text">
                Home
              </Link>
              <span className="text-brand-faint" aria-hidden="true">/</span>
              <span className="text-gold" aria-current="page">Privacy Policy</span>
            </nav>

            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Legal
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl font-light text-brand-text md:text-6xl lg:text-7xl">
              Privacy{" "}
              <span className="text-gold-gradient italic">Policy</span>
            </h1>

            <p className="mt-4 text-sm text-brand-muted">
              Effective: 11 May 2026
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
              Nilmani Ceylon Tours is committed to protecting your personal data in line with the
              General Data Protection Regulation (GDPR), Sri Lanka&apos;s Personal Data Protection
              Act (PDPA), and other applicable privacy laws.
            </p>

            {/* Mobile section chips */}
            <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
              {SECTIONS.map(({ id, num, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-border px-3 py-1.5 text-xs text-brand-muted transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <span className="font-serif text-gold">{num}</span>
                  <span>{title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Two-column body ───────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="flex gap-12 lg:gap-16">

            {/* Sticky sidebar TOC — desktop only */}
            <aside className="hidden lg:block lg:w-60 xl:w-72 shrink-0">
              <PrivacyTOC sections={SECTIONS} />
            </aside>

            {/* Section cards */}
            <div className="min-w-0 flex-1 space-y-8">

              {/* 01 — Who We Are */}
              <SectionCard id="who-we-are" num="01" title="Who We Are">
                <p>
                  Nilmani Ceylon Tours is a private tour operator based in Seeduwa, Sri Lanka,
                  operated by Roshan Jayasuriya. We provide personalised private tours and
                  driver-guide services throughout Sri Lanka.
                </p>
                <p>
                  Contact:{" "}
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="font-medium text-gold hover:underline"
                  >
                    nilmaniceylontours@gmail.com
                  </a>
                </p>
              </SectionCard>

              {/* 02 — Information We Collect */}
              <SectionCard id="information-we-collect" num="02" title="Information We Collect">
                <p>
                  Because we arrange personalised tours for international travellers, we may
                  collect the following categories of personal data:
                </p>
                <DataTable<CollectRow>
                  headers={["Data Type", "Examples", "Why We Collect It"]}
                  rows={INFO_COLLECT_ROWS}
                  keys={["type", "examples", "why"]}
                />
                <p className="mt-4 rounded-xl border border-brand-border bg-brand-surface px-5 py-4 text-xs leading-relaxed">
                  You provide sensitive data such as passport details and health information
                  voluntarily and only when necessary for your trip.
                </p>
              </SectionCard>

              {/* 03 — How We Use Your Information */}
              <SectionCard id="how-we-use" num="03" title="How We Use Your Information">
                <p>We use your personal data to:</p>
                <ul className="space-y-2">
                  {[
                    "Arrange tours with licensed guides, hotels, and transport providers",
                    "Share necessary details with partners to fulfil your itinerary",
                    "Redirect you to PayPal to complete secure payments",
                    "Send booking information, travel updates, and safety instructions",
                    "Send newsletters and promotions if you opt in — unsubscribe anytime via the link in our emails",
                    "Run Google Analytics and Meta Pixel to measure site performance and ad effectiveness",
                    "Comply with Sri Lankan tax, tourism, and legal obligations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-2 border-t border-brand-border pt-4">
                  <p className="mb-3 font-medium text-brand-text">What your data is used for</p>
                  <ul className="space-y-2">
                    {[
                      "Providing a quote",
                      "Discussing travel arrangements",
                      "Sending you the requested information",
                      "Sending e-marketing or relevant information (with consent)",
                      "Booking your tour",
                      "Asking for feedback on our services",
                      "Notifying you of any changes or amendments to your booking",
                      "Notifying you in case of emergencies",
                      "Providing a seamless service and up-to-date information",
                      "Keeping you updated on new products and services from Nilmani Ceylon Tours",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/50"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="rounded-xl border border-brand-border bg-brand-surface px-5 py-4 text-xs">
                  We never sell or rent your data to third parties.
                </p>
              </SectionCard>

              {/* 04 — How We Share Information */}
              <SectionCard id="how-we-share" num="04" title="How We Share Information">
                <p>
                  We never sell your data. We share it only as needed to deliver your tour:
                </p>
                <DataTable<ShareRow>
                  headers={["Shared With", "What We Share", "Purpose"]}
                  rows={INFO_SHARE_ROWS}
                  keys={["sharedWith", "what", "purpose"]}
                />
                <p className="mt-4 text-xs text-brand-muted">
                  All partners are required to keep your data confidential and use it only for
                  the agreed service.
                </p>
              </SectionCard>

              {/* 05 — International Data Transfers */}
              <SectionCard id="international-transfers" num="05" title="International Data Transfers">
                <p>
                  Your data is primarily stored in Sri Lanka but may be transferred to PayPal,
                  Google, Meta, or other service providers in the US, EU, or other countries.
                </p>
                <p>
                  We use GDPR-compliant contracts (Standard Contractual Clauses) and other
                  appropriate safeguards for these international transfers.
                </p>
              </SectionCard>

              {/* 06 — Legal Basis for Processing */}
              <SectionCard id="legal-basis" num="06" title="Legal Basis for Processing">
                <p>Under GDPR and PDPA, we process your data on the following legal bases:</p>
                <ul className="space-y-3">
                  {[
                    {
                      basis: "Contract",
                      detail: "To deliver the tour you booked",
                    },
                    {
                      basis: "Legal obligation",
                      detail: "Sri Lankan tax and tourism regulations",
                    },
                    {
                      basis: "Consent",
                      detail: "For marketing emails and non-essential cookies",
                    },
                    {
                      basis: "Legitimate interest",
                      detail: "Website security, analytics, and fraud prevention",
                    },
                  ].map(({ basis, detail }) => (
                    <li key={basis} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="font-medium text-brand-text">{basis}:</span>{" "}
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* 07 — Data Retention */}
              <SectionCard id="data-retention" num="07" title="Data Retention">
                <ul className="space-y-2">
                  {[
                    "Booking and passport info: 7 years for legal and tax purposes",
                    "Health and emergency info: Deleted within 30 days after tour completion unless you request otherwise",
                    "Marketing data: Until you unsubscribe",
                    "Analytics data: 26 months, then anonymised",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* 08 — Your Rights */}
              <SectionCard id="your-rights" num="08" title="Your Rights">
                <p>
                  Under GDPR, PDPA, and similar laws, you have the following rights regarding
                  your personal data:
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {YOUR_RIGHTS.map(({ right, description }) => (
                    <div
                      key={right}
                      className="rounded-xl border border-brand-border bg-brand-surface p-4"
                    >
                      <dt className="mb-1 text-xs font-semibold uppercase tracking-luxury text-gold">
                        {right}
                      </dt>
                      <dd className="text-sm leading-relaxed text-brand-muted">
                        {description}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4">
                  To exercise any right, contact us at{" "}
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="font-medium text-gold hover:underline"
                  >
                    nilmaniceylontours@gmail.com
                  </a>
                  . We respond within 30 days.
                </p>
              </SectionCard>

              {/* 09 — Cookies & Tracking */}
              <SectionCard id="cookies" num="09" title="Cookies & Tracking">
                <p>We use the following types of cookies:</p>
                <ul className="space-y-3">
                  {[
                    {
                      name: "Essential cookies",
                      detail:
                        "Required for site function and redirecting to PayPal. Cannot be disabled.",
                    },
                    {
                      name: "Analytics cookies",
                      detail:
                        "Google Analytics to understand site usage. Used with your consent.",
                    },
                    {
                      name: "Marketing cookies",
                      detail:
                        "Meta Pixel to measure ad performance. Used with your consent.",
                    },
                  ].map(({ name, detail }) => (
                    <li key={name} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="font-medium text-brand-text">{name}:</span>{" "}
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2">
                  You can manage cookies via your browser settings. Disabling some cookies may
                  limit site features.
                </p>
              </SectionCard>

              {/* 10 — Data Security */}
              <SectionCard id="data-security" num="10" title="Data Security">
                <p>
                  We use SSL encryption, access controls, and secure storage to protect your
                  data. PayPal handles all card transactions directly — we do not store full
                  card numbers on our systems.
                </p>
                <p>
                  Sensitive fields (phone numbers, passport details) are encrypted at rest
                  using AES-256-GCM. Our servers are protected by firewalls and automated
                  security patches.
                </p>
                <p className="rounded-xl border border-brand-border bg-brand-surface px-5 py-4 text-xs leading-relaxed">
                  No system is 100% secure. While we take all reasonable precautions, we cannot
                  guarantee absolute security of data transmitted over the internet.
                </p>
              </SectionCard>

              {/* 11 — Children's Privacy */}
              <SectionCard id="children" num="11" title="Children's Privacy">
                <p>
                  We do not knowingly collect personal data from children under 16 without
                  verifiable parental consent. Tours that include minors must be booked by a
                  parent or legal guardian.
                </p>
                <p>
                  If you believe we have inadvertently collected data from a child under 16,
                  please contact us immediately at{" "}
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="font-medium text-gold hover:underline"
                  >
                    nilmaniceylontours@gmail.com
                  </a>{" "}
                  and we will delete it promptly.
                </p>
              </SectionCard>

              {/* 12 — Updates & Contact */}
              <SectionCard id="updates-contact" num="12" title="Updates & Contact">
                <p>
                  We may update this policy as laws or services change. When we do, we will
                  post the new version on this page with a revised effective date. Continued use
                  of our site after changes constitutes acceptance.
                </p>
                <p>For privacy queries, data access requests, or complaints:</p>
                <div
                  className="mt-4 rounded-xl border p-6"
                  style={{
                    borderColor: "rgba(201,168,76,0.3)",
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)",
                  }}
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-luxury text-gold">
                    Get in touch
                  </p>
                  <p className="mb-3 text-sm text-brand-muted">
                    Nilmani Ceylon Tours · Seeduwa, Sri Lanka
                  </p>
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="text-sm font-medium text-gold hover:underline"
                  >
                    nilmaniceylontours@gmail.com
                  </a>
                  <p className="mt-3 text-xs text-brand-muted">
                    If you are in the EU/UK and believe we have not handled your data
                    appropriately, you have the right to lodge a complaint with your local data
                    protection authority.
                  </p>
                </div>
              </SectionCard>

            </div>
          </div>
        </div>
      </main>

      <BackToTopButton />
      <Footer />
    </>
  );
}
