import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Nilmani Ceylon Tours",
  description: "Terms and conditions for booking tours with Nilmani Ceylon Tours.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block font-serif text-lg text-[#1C1209] hover:underline">
          ← Nilmani Ceylon Tours
        </Link>

        <h1 className="font-serif text-4xl font-light text-[#1C1209]">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 15 April 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          {[
            {
              title: "1. Booking & Confirmation",
              content: "A booking is confirmed once you receive a written confirmation email and pay the deposit. The deposit (typically 20% of the total tour price) is required within 5 business days of receiving your quote. Full payment is due 14 days before the tour start date.",
            },
            {
              title: "2. Pricing",
              content: "All prices are quoted in USD and are per-person unless otherwise stated. Prices include private vehicle with air conditioning, English-speaking driver-guide, and accommodation as specified. Prices exclude international flights, travel insurance, entrance fees, meals (unless specified), and personal expenses.",
            },
            {
              title: "3. Cancellation Policy",
              content: `Cancellations must be notified in writing to nilmaniceylontours@gmail.com:\n• More than 30 days before departure: Full deposit refunded\n• 15–30 days before departure: 50% of total tour cost\n• 7–14 days before departure: 75% of total tour cost\n• Less than 7 days: No refund`,
            },
            {
              title: "4. Changes to Your Booking",
              content: "We will do our best to accommodate changes to your itinerary. Changes requested within 14 days of departure may be subject to additional charges depending on hotel and transport availability.",
            },
            {
              title: "5. Travel Insurance",
              content: "We strongly recommend that all guests purchase comprehensive travel insurance covering medical expenses, trip cancellation, and personal liability. Nilmani Ceylon Tours is not responsible for losses arising from lack of insurance.",
            },
            {
              title: "6. Our Responsibilities",
              content: "We are responsible for providing the services as described in your confirmed itinerary. We are not liable for events outside our control including natural disasters, political unrest, strikes, or illness. We reserve the right to make minor adjustments to itineraries when necessary for safety or operational reasons.",
            },
            {
              title: "7. Your Responsibilities",
              content: "You are responsible for ensuring you hold a valid passport, visa, and any required vaccinations for Sri Lanka. You must inform us of any dietary requirements, medical conditions, or accessibility needs at the time of booking.",
            },
            {
              title: "8. Privacy",
              content: "We handle your personal data in accordance with our Privacy Policy. By making a booking, you consent to us processing your data as necessary to fulfil the booking.",
            },
            {
              title: "9. Governing Law",
              content: "These terms are governed by the laws of Sri Lanka. Any disputes shall first be attempted to be resolved through good-faith negotiation.",
            },
            {
              title: "10. Contact",
              content: "For any questions about these terms, please contact us at nilmaniceylontours@gmail.com or via WhatsApp: +94 78 782 9952.",
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">{title}</h2>
              <p className="whitespace-pre-line">{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
