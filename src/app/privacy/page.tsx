import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Nilmani Ceylon Tours",
  description: "How Nilmani Ceylon Tours collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "15 April 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block font-serif text-lg text-[#1C1209] hover:underline">
          ← Nilmani Ceylon Tours
        </Link>

        <h1 className="font-serif text-4xl font-light text-[#1C1209]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray mt-8 max-w-none text-sm leading-relaxed">
          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">1. Who We Are</h2>
            <p className="text-gray-700">
              Nilmani Ceylon Tours is a private tour operator based in Seeduwa, Sri Lanka, operated by Roshan
              Jayasuriya. We provide personalised private tours and driver-guide services throughout Sri Lanka.
              Contact: <a href="mailto:nilmaniceylontours@gmail.com" className="text-[#C9A84C]">nilmaniceylontours@gmail.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">2. Data We Collect</h2>
            <p className="mb-2 text-gray-700">When you use our website or services, we may collect:</p>
            <ul className="ml-4 list-disc space-y-1 text-gray-700">
              <li><strong>Contact details:</strong> name, email address, phone number</li>
              <li><strong>Booking details:</strong> travel dates, group size, special requirements, nationality</li>
              <li><strong>Account details:</strong> email and password (if you create an account)</li>
              <li><strong>Communication data:</strong> messages sent through our contact form or chat</li>
              <li><strong>Technical data:</strong> IP address, browser type, pages visited (via analytics)</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Sensitive data (phone numbers, passport details where applicable) is encrypted at rest using AES-256-GCM.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">3. How We Use Your Data</h2>
            <ul className="ml-4 list-disc space-y-1 text-gray-700">
              <li>To process and manage your tour booking</li>
              <li>To communicate about your booking and enquiries</li>
              <li>To send transactional emails (booking confirmations, status updates)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-2 text-gray-700">
              We do not use your data for marketing without explicit consent, and we never sell your data to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">4. Legal Basis (GDPR)</h2>
            <p className="text-gray-700">
              For users in the European Economic Area (EEA) and UK, we process your data under the following legal bases:
            </p>
            <ul className="ml-4 mt-2 list-disc space-y-1 text-gray-700">
              <li><strong>Contract performance</strong> — to fulfil your booking</li>
              <li><strong>Legitimate interests</strong> — to run our business securely and improve our service</li>
              <li><strong>Consent</strong> — for analytics cookies (which you can withdraw at any time)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">5. Data Sharing</h2>
            <p className="mb-2 text-gray-700">We share your data only with:</p>
            <ul className="ml-4 list-disc space-y-1 text-gray-700">
              <li><strong>Resend</strong> (email delivery) — Data Processing Agreement in place</li>
              <li><strong>Cloudinary</strong> (image hosting, if applicable) — Data Processing Agreement in place</li>
              <li><strong>Sentry</strong> (error monitoring) — anonymised error reports only, PII scrubbed</li>
            </ul>
            <p className="mt-2 text-gray-700">
              No other third parties receive your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">6. Data Retention</h2>
            <ul className="ml-4 list-disc space-y-1 text-gray-700">
              <li>Active bookings: retained for 6 months after tour completion</li>
              <li>Enquiries with no booking: anonymised after 6 months of inactivity</li>
              <li>All booking records: anonymised after 2 years</li>
              <li>Account data: retained until you request deletion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">7. Your Rights</h2>
            <p className="mb-2 text-gray-700">Under GDPR you have the right to:</p>
            <ul className="ml-4 list-disc space-y-1 text-gray-700">
              <li><strong>Access</strong> — request a copy of all data we hold about you</li>
              <li><strong>Rectification</strong> — correct inaccurate data</li>
              <li><strong>Erasure (Article 17)</strong> — request deletion of your account and data</li>
              <li><strong>Portability (Article 20)</strong> — receive your data in a machine-readable format</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests</li>
              <li><strong>Withdraw consent</strong> — at any time for consent-based processing</li>
            </ul>
            <p className="mt-3 text-gray-700">
              To exercise these rights, sign in to your account and visit{" "}
              <Link href="/dashboard" className="text-[#C9A84C] hover:underline">your dashboard</Link>, or email us at{" "}
              <a href="mailto:nilmaniceylontours@gmail.com" className="text-[#C9A84C]">nilmaniceylontours@gmail.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">8. Cookies</h2>
            <p className="text-gray-700">
              We use essential cookies for authentication (session management). We may also use analytics cookies
              with your consent to understand how our website is used. You can withdraw consent at any time using
              the cookie banner or your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">9. Security</h2>
            <p className="text-gray-700">
              We use industry-standard security measures including HTTPS, AES-256-GCM encryption for sensitive
              fields, secure HTTP-only cookies, rate limiting, and regular backups. Our servers are hosted on
              a VPS with firewall protection and automated security patches.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-medium text-[#1C1209]">10. Contact & Complaints</h2>
            <p className="text-gray-700">
              For any privacy concerns, contact us at{" "}
              <a href="mailto:nilmaniceylontours@gmail.com" className="text-[#C9A84C]">nilmaniceylontours@gmail.com</a>.
              If you are in the EU/UK and believe we have not handled your data appropriately, you have the right
              to lodge a complaint with your local data protection authority.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
