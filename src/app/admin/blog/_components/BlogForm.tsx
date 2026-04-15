"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BlogData = {
  id?: string;
  slug?: string;
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
};

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const hintClass = "mt-1 text-xs text-gray-400";

export function BlogForm({ initial }: { initial?: BlogData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<BlogData>({
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    published: false,
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    ...initial,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BlogData>(key: K, value: BlogData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

    const url = isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">Post Details</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Best Time to Visit Sri Lanka"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className={inputClass}
              />
              <p className={hintClass}>/blog/{form.slug || "your-slug"}</p>
            </div>
            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="/images/blog-cover.jpg"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown in blog listing..."
              className={`${inputClass} resize-none`}
            />
            <p className={hintClass}>Max 300 characters.</p>
          </div>
          <div>
            <label className={labelClass}>Content</label>
            <textarea
              rows={16}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your blog post here. HTML is supported."
              className={`${inputClass} resize-y font-mono text-xs`}
            />
            <p className={hintClass}>HTML is allowed. Scripts and iframes are automatically removed.</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="rounded border-gray-300 text-[#C9A84C]"
            />
            Publish this post (visible on the website)
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Meta Title</label>
            <input type="text" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)}
              placeholder="e.g. Best Time to Visit Sri Lanka | Nilmani Ceylon Tours" className={inputClass} />
            <p className={hintClass}>{(form.metaTitle?.length ?? 0)}/70 characters</p>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
              placeholder="Summary for Google search results..." className={`${inputClass} resize-none`} />
            <p className={hintClass}>{(form.metaDescription?.length ?? 0)}/160 characters</p>
          </div>
          <div>
            <label className={labelClass}>Focus Keyword</label>
            <input type="text" value={form.focusKeyword} onChange={(e) => set("focusKeyword", e.target.value)}
              placeholder="e.g. best time to visit sri lanka" className={inputClass} />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="rounded-lg bg-[#1C1209] px-6 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A] disabled:opacity-60">
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
