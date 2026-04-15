"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Save, CheckCircle2 } from "lucide-react";

const SETTINGS_GROUPS = [
  {
    title: "Contact & Social",
    hint: "These appear in the footer and contact page.",
    fields: [
      { key: "contact_email", label: "Contact Email", placeholder: "roshan@nilmaniceylontours.com", type: "email" },
      { key: "contact_phone", label: "Phone Number", placeholder: "+94 78 782 9952", type: "tel" },
      { key: "whatsapp_number", label: "WhatsApp Number", placeholder: "94787829952", type: "tel", hint: "International format without + (e.g. 94787829952)" },
      { key: "address", label: "Address", placeholder: "Seeduwa, Sri Lanka", type: "text" },
      { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
      { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
      { key: "tripadvisor_url", label: "TripAdvisor URL", placeholder: "https://tripadvisor.com/...", type: "url" },
    ],
  },
  {
    title: "Site Branding",
    fields: [
      { key: "site_name", label: "Site Name", placeholder: "Nilmani Ceylon Tours", type: "text" },
      { key: "site_tagline", label: "Tagline", placeholder: "Luxury Sri Lanka Travel", type: "text" },
    ],
  },
  {
    title: "Booking Settings",
    fields: [
      { key: "booking_deposit_percent", label: "Deposit Percentage", placeholder: "20", type: "number", hint: "% deposit required to confirm a booking" },
      { key: "currency", label: "Currency", placeholder: "USD", type: "text" },
    ],
  },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings ?? {}));
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Configure your contact details, social links, and business settings."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A] disabled:opacity-60"
          >
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save Settings"}
          </button>
        }
      />

      <div className="space-y-6">
        {SETTINGS_GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {group.title}
            </h2>
            {group.hint && (
              <p className="mb-4 text-xs text-gray-400">{group.hint}</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={settings[field.key] ?? ""}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                  {field.hint && (
                    <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
