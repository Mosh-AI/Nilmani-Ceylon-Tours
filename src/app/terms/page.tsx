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
        <p className="mt-2 text-sm text-gray-500">Effective Date: April 22, 2026</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          By booking a tour, using our website, or contacting Nilmani Ceylon Tours, you agree to these Terms and Conditions. Please read them carefully.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          {/* 1 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">1. Services Provided</h2>
            <p>
              Nilmani Ceylon Tours arranges customized tour guidance, including itinerary planning, vehicles, booking assistance with our drivers and guides, and accommodations, and on-ground support. We act as an intermediary between you and independent service providers like hotels.
            </p>
          </section>

          {/* 3 — section 2 is not present in the provided terms */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">3. Customer Responsibilities</h2>
            <p className="mb-2">To deliver your tour safely, you agree to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide accurate contact, passport, and travel details</li>
              <li>Disclose relevant dietary needs, allergies, medical conditions, and emergency contacts</li>
              <li>Carry valid passport, visa, and travel insurance for the full tour duration</li>
              <li>Arrive on time for scheduled pickups and activities</li>
              <li>Follow local laws and instructions from guides or drivers</li>
              <li>Treat service providers and other travelers respectfully</li>
            </ul>
            <p className="mt-2">Failure to provide required documents or information may result in cancellation without refund.</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">4. Cancellations and Refunds</h2>
            <div className="overflow-x-auto">
              <table className="mt-2 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-2 pr-6 font-semibold text-[#1C1209]">When You Cancel</th>
                    <th className="pb-2 font-semibold text-[#1C1209]">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 pr-6">More than 30 days before tour</td>
                    <td className="py-2">75% refund, minus service charge fees</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">15 to 30 days before tour</td>
                    <td className="py-2">50% refund</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">7 to 14 days before tour</td>
                    <td className="py-2">25% refund</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Less than 7 days before tour</td>
                    <td className="py-2">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *If Nilmani Ceylon Tours cancels due to force majeure, unsafe conditions, or provider failure, we will offer a new date or a 75% refund of amounts paid to us, minus any non-refundable third-party costs already incurred.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">5. Changes to Itinerary</h2>
            <p>
              Minor changes may occur due to weather, road conditions, or provider availability. We will provide alternatives of similar value. Major changes requested by you may incur additional costs and must be confirmed in writing.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">6. Travel Insurance</h2>
            <p>
              Travel insurance covering medical emergencies, trip cancellation, and personal belongings is strongly recommended and may be required for certain activities. Nilmani Ceylon Tours is not liable for costs arising from lack of insurance.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">7. Liability and Disclaimers</h2>
            <p className="mb-2">
              Nilmani Ceylon Tours exercises due care in selecting guides, drivers, and hotels, but we are not liable for their acts, omissions, or failures. Also, we will provide safe guidance and advice to recover the certain situation.
            </p>
            <p className="mb-2">
              We are not responsible for injury, illness, loss, damage, or delays caused by third parties, accidents, natural events, strikes, or other events beyond our control. Also, we will provide safe guidance and advice to recover the certain situation with the chauffer coordination.
            </p>
            <p className="mb-2">
              Adventure activities like hiking, wildlife safaris, or water sports carry inherent risk. You participate at your own risk.
            </p>
            <p>
              Our total liability for any claim is limited to the amount you paid to Nilmani Ceylon Tours for the affected service. Refer included, not included in tour details tab.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">8. Passport, Visa, and Health Requirements</h2>
            <p>
              You are responsible for meeting all passport, visa, vaccination, and health requirements for Sri Lanka or other destinations. We may collect passport copies and health info only to comply with local regulations and ensure safety. See our Privacy Policy for details.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">9. Intellectual Property</h2>
            <p>
              All content on our website, including text, photos, logos, and itineraries, belongs to Nilmani Ceylon Tours or our licensors. You may not copy, reuse, or distribute it without written permission.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">10. Conduct and Termination</h2>
            <p>
              We may refuse service or terminate a tour without refund if a customer behaves dangerously, illegally, abusively, or violates these Terms. Safety of guests, staff, and partners is our priority.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">11. Marketing and Photos</h2>
            <p>
              We may take photos during tours for social media or marketing. If you prefer not to be photographed, tell your guide at the start of the tour. For email newsletters, we only contact you if you opt in. Unsubscribe anytime.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">12. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy, which explains how we collect and use personal data including passport and health information.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">13. Dispute Resolution</h2>
            <p>
              We aim to resolve issues quickly and fairly. Contact us first at Nirmani@gmail.com. If unresolved, disputes are subject to the exclusive jurisdiction of the courts in Sri Lanka.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">14. Changes to These Terms</h2>
            <p>
              We may update these Terms for legal or government operational reasons. The latest version posted on our website applies to all new bookings made after the effective date.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-2 font-serif text-lg font-medium text-[#1C1209]">15. Contact</h2>
            <p>Nilmani Ceylon Tours, Tour Guidance Services</p>
            <p>Email: <a href="mailto:Nirmani@gmail.com" className="text-[#C9A84C] hover:underline">Nirmani@gmail.com</a></p>
            <p>Location: 145 / H / 1, Arjunarama road, Miriswatta, Yagodamulla, Kotugoda, Sri Lanka</p>
          </section>
        </div>
      </div>
    </div>
  );
}
