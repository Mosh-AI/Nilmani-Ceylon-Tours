"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/app/actions/contact";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MapPin, Mail, Phone, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [serverResult, setServerResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitting(true);
    setServerResult(null);
    try {
      const result = await submitContactForm(data);
      setServerResult({ success: result.success, message: result.success ? result.message : (result as { success: false; error: string }).error });
      if (result.success) reset();
    } catch {
      setServerResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-brand-border bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";
  const errorClass = "mt-1 text-xs text-red-600";
  const labelClass = "mb-1.5 block text-sm font-medium text-brand-text";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1C1209] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Breadcrumb
            items={[{ label: "Contact" }]}
            className="mb-6 justify-center"
          />
          <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#C9A84C]/80">
            Start planning your dream Sri Lanka journey. We&apos;ll reply within
            24 hours.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-5">
          {/* Contact Info */}
          <aside className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-light text-brand-text">
              Contact Information
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">
              Whether you have a question about a tour, a custom itinerary
              request, or just want to say hello — we&apos;re happy to hear from
              you.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brand-text">Address</p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    196/4, Yagodamulla, Seeduwa 11390<br />Sri Lanka
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brand-text">Phone / WhatsApp</p>
                  <a
                    href="tel:+94787829952"
                    className="mt-0.5 block text-sm text-gold underline-offset-2 hover:underline"
                  >
                    +94 78 782 9952
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brand-text">Email</p>
                  <a
                    href="mailto:nilmaniceylontours@gmail.com"
                    className="mt-0.5 block text-sm text-gold underline-offset-2 hover:underline"
                  >
                    nilmaniceylontours@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brand-text">Response Time</p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    Within 24 hours, usually much sooner.
                  </p>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
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
          </aside>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-brand-border bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-light text-brand-text">
                Send a Message
              </h2>

              {/* Server result banner */}
              {serverResult && (
                <div
                  className={`mt-4 flex items-start gap-3 rounded-lg p-4 text-sm ${
                    serverResult.success
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {serverResult.success ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  )}
                  <p>{serverResult.message}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
              >
                {/* Honeypot fields — hidden from real users */}
                <div aria-hidden="true" className="hidden">
                  <input tabIndex={-1} autoComplete="off" {...register("website")} />
                  <input tabIndex={-1} autoComplete="off" {...register("url_field")} />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      className={inputClass}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className={errorClass}>{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className={errorClass}>{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone / WhatsApp{" "}
                    <span className="font-normal text-brand-muted">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+44 7700 000000"
                    autoComplete="tel"
                    className={inputClass}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className={errorClass}>{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="e.g. Custom 10-day itinerary enquiry"
                    className={inputClass}
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className={errorClass}>{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your travel plans, travel dates, group size..."
                    className={`${inputClass} resize-none`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className={errorClass}>{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#1C1209] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>

                <p className="text-center text-xs text-brand-muted">
                  We respect your privacy. Your details are never shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
