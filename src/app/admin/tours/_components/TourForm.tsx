"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Star } from "lucide-react";

type TourHighlight = { text: string; featured: boolean };

type TourData = {
  id?: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  duration?: number;
  price?: number;
  personsIncluded?: number;
  difficulty?: "Easy" | "Moderate" | "Challenging";
  maxGroup?: number;
  category?: string;
  highlights?: TourHighlight[];
  whatsIncluded?: string[];
  whatsExcluded?: string[];
  heroImage?: string;
  images?: string[];
  featured?: boolean;
  available?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
};

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const hintClass = "mt-1 text-xs text-gray-400";

function ListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, val: string) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className={hintClass}>{hint}</p>}
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-[#C9A84C] hover:text-[#C9A84C]"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
    </div>
  );
}

const MAX_FEATURED = 6;

function HighlightsEditor({
  items,
  onChange,
}: {
  items: TourHighlight[];
  onChange: (items: TourHighlight[]) => void;
}) {
  const featuredCount = items.filter((h) => h.featured).length;

  function updateText(i: number, text: string) {
    const next = [...items];
    next[i] = { ...next[i], text };
    onChange(next);
  }

  function toggleFeatured(i: number) {
    const next = [...items];
    const current = next[i].featured;
    if (!current && featuredCount >= MAX_FEATURED) return; // cap at 6
    next[i] = { ...next[i], featured: !current };
    onChange(next);
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function addItem() {
    onChange([...items, { text: "", featured: featuredCount < MAX_FEATURED }]);
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className={labelClass}>Highlights</label>
        <span className="text-xs font-medium" style={{ color: featuredCount >= MAX_FEATURED ? "#C9A84C" : "#9ca3af" }}>
          <Star className="mr-1 inline h-3 w-3" />
          {featuredCount}/{MAX_FEATURED} featured (shown on tour page)
        </span>
      </div>
      <p className={hintClass}>
        Add all highlights. Star up to 6 to show by default — others appear under &ldquo;Show more&rdquo;.
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
              item.featured
                ? "border-[#C9A84C]/40 bg-[#C9A84C]/5"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Star toggle */}
            <button
              type="button"
              title={item.featured ? "Remove from featured" : featuredCount >= MAX_FEATURED ? "Max 6 featured reached" : "Mark as featured"}
              onClick={() => toggleFeatured(i)}
              disabled={!item.featured && featuredCount >= MAX_FEATURED}
              className={`shrink-0 rounded p-1 transition-colors ${
                item.featured
                  ? "text-[#C9A84C] hover:text-[#C9A84C]/70"
                  : featuredCount >= MAX_FEATURED
                  ? "cursor-not-allowed text-gray-200"
                  : "text-gray-300 hover:text-[#C9A84C]"
              }`}
            >
              <Star className="h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
            </button>
            {/* Text input */}
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateText(i, e.target.value)}
              placeholder="e.g. Climb Sigiriya Rock Fortress — UNESCO World Heritage Site"
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {/* Delete */}
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-[#C9A84C] hover:text-[#C9A84C]"
        >
          <Plus className="h-3.5 w-3.5" /> Add highlight
        </button>
      </div>
    </div>
  );
}

export function TourForm({ initial }: { initial?: TourData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<TourData>({
    slug: "",
    title: "",
    subtitle: "",
    summary: "",
    description: "",
    duration: 7,
    price: 0,
    personsIncluded: 2,
    difficulty: "Easy",
    maxGroup: 8,
    category: "",
    highlights: [{ text: "", featured: true }],
    whatsIncluded: ["Private air-conditioned vehicle", "English-speaking driver-guide"],
    whatsExcluded: ["International flights", "Travel insurance", "Entrance fees"],
    heroImage: "",
    images: [],
    featured: false,
    available: true,
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ...initial,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof TourData>(key: K, value: TourData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-generate slug from title
  function handleTitleChange(title: string) {
    set("title", title);
    if (!isEdit) {
      set("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/tours/${initial!.id}` : "/api/admin/tours";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        highlights: form.highlights?.filter((h) => h.text.trim() !== ""),
        whatsIncluded: form.whatsIncluded?.filter(Boolean),
        whatsExcluded: form.whatsExcluded?.filter(Boolean),
        images: form.images?.filter(Boolean),
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/tours");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {/* Basic info */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Classic Sri Lanka — 8 Days"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="classic-sri-lanka-8-days"
              className={inputClass}
            />
            <p className={hintClass}>URL: /tours/{form.slug || "your-slug"}</p>
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. The Essential Island Experience"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tour Summary</label>
            <textarea
              rows={2}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder="Short 1–2 sentence summary shown on tour listing cards..."
              className={`${inputClass} resize-none`}
            />
            <p className={hintClass}>Shown on tour cards and search results. Keep under 200 characters.</p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>About this Tour *</label>
            <textarea
              required
              rows={8}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Full tour description shown on the tour detail page. Include all destinations, experiences, and what makes this tour special..."
              className={`${inputClass} resize-none`}
            />
            <p className={hintClass}>Full description shown on the tour detail page. Paste the complete "About this Tour" text from the client document.</p>
          </div>
        </div>
      </section>

      {/* Pricing & logistics */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Pricing & Logistics
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Duration (days) *</label>
            <input
              type="number"
              required
              min={1}
              max={60}
              value={form.duration}
              onChange={(e) => set("duration", parseInt(e.target.value, 10))}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Price (USD) *</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", parseInt(e.target.value, 10))}
                  placeholder="1170"
                  className={inputClass}
                />
              </div>
              <div className="w-36 shrink-0">
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={form.personsIncluded ?? 2}
                  onChange={(e) => set("personsIncluded", parseInt(e.target.value, 10))}
                  aria-label="Persons included in price"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <p className={hintClass}>Total price · Persons included</p>
              {(form.price ?? 0) > 0 && (form.personsIncluded ?? 0) > 0 && (
                <p className="text-xs font-medium text-[#C9A84C]">
                  ${(form.price ?? 0).toLocaleString()} for {form.personsIncluded ?? 2}{" "}
                  {(form.personsIncluded ?? 2) === 1 ? "person" : "persons"}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Max Group</label>
            <input
              type="number"
              min={1}
              max={50}
              value={form.maxGroup ?? ""}
              onChange={(e) => set("maxGroup", parseInt(e.target.value, 10))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value as "Easy" | "Moderate" | "Challenging")}
              className={inputClass}
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Cultural & Nature"
              className={inputClass}
            />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <ListEditor
              label="Tour Images"
              hint="First image is the hero/cover image. Add more for the tour gallery."
              items={form.images ?? []}
              onChange={(v) => set("images", v)}
              placeholder="/images/your-tour-photo.jpg or https://..."
            />
          </div>
        </div>
        <div className="mt-5 flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => set("available", e.target.checked)}
              className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
            />
            Available for booking
          </label>
        </div>
      </section>

      {/* Content lists */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Tour Content
        </h2>
        <div className="space-y-6">
          <HighlightsEditor
            items={form.highlights ?? []}
            onChange={(v) => set("highlights", v)}
          />
          <ListEditor
            label="What's Included"
            items={form.whatsIncluded ?? []}
            onChange={(v) => set("whatsIncluded", v)}
            placeholder="e.g. Private air-conditioned vehicle"
          />
          <ListEditor
            label="What's Not Included"
            items={form.whatsExcluded ?? []}
            onChange={(v) => set("whatsExcluded", v)}
            placeholder="e.g. International flights"
          />
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          SEO Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder="e.g. 8-Day Classic Sri Lanka Private Tour | Nilmani Ceylon Tours"
              className={inputClass}
            />
            <p className={hintClass}>
              {(form.metaTitle?.length ?? 0)}/70 characters. Keep under 60–70 for best results.
            </p>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              placeholder="e.g. Private 8-day tour covering Sigiriya, Kandy, Ella & Galle. Expert driver-guide. From $1,200/person."
              className={`${inputClass} resize-none`}
            />
            <p className={hintClass}>
              {(form.metaDescription?.length ?? 0)}/160 characters.
            </p>
          </div>
          <div>
            <label className={labelClass}>Focus Keyword</label>
            <input
              type="text"
              value={form.focusKeyword}
              onChange={(e) => set("focusKeyword", e.target.value)}
              placeholder="e.g. classic sri lanka tour"
              className={inputClass}
            />
            <p className={hintClass}>Primary keyword this page should rank for.</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#1C1209] px-6 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Tour"}
        </button>
      </div>
    </form>
  );
}
