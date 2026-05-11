"use client";

import { useState, useEffect, useRef } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Images, Trash2, Upload, X, CheckCircle, Plus } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  sortOrder: number;
};

type StagedFile = {
  id: string;
  file: File;
  preview: string;
  alt: string;
  category: string;
};

const CATEGORIES = ["Landmarks", "Landscapes", "Wildlife", "Beaches", "Culture", "Food"];
const VIEW_CATEGORIES = ["All", ...CATEGORIES];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []));
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      staged.forEach((s) => URL.revokeObjectURL(s.preview));
    };
  }, [staged]);

  function handleFileSelect(files: FileList | null) {
    if (!files?.length) return;
    const newStaged: StagedFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      category: "",
    }));
    setStaged((prev) => [...prev, ...newStaged]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function updateStaged(id: string, field: "alt" | "category", value: string) {
    setStaged((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function removeStaged(id: string) {
    setStaged((prev) => {
      const item = prev.find((s) => s.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((s) => s.id !== id);
    });
  }

  async function handleUploadAll() {
    if (!staged.length) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress({ done: 0, total: staged.length });

    let successCount = 0;

    for (let i = 0; i < staged.length; i++) {
      const item = staged[i];
      const fd = new FormData();
      fd.append("file", item.file);

      const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await upRes.json();

      if (!upRes.ok) {
        setUploadError(`${item.file.name}: ${upData.error ?? "Upload failed"}`);
        setUploading(false);
        setUploadProgress(null);
        return;
      }

      const addRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: upData.url,
          alt: item.alt.trim() || item.file.name.replace(/\.[^.]+$/, ""),
          category: item.category || null,
          sortOrder: images.length + i,
        }),
      });

      const addData = await addRes.json();

      if (!addRes.ok) {
        setUploadError(`${item.file.name}: ${addData.error ?? "Failed to save to gallery"}`);
        setUploading(false);
        setUploadProgress(null);
        return;
      }

      if (addData.image) {
        URL.revokeObjectURL(item.preview);
        setImages((prev) => [...prev, addData.image]);
        successCount++;
      }

      setUploadProgress({ done: i + 1, total: staged.length });
    }

    setStaged([]);
    setUploading(false);
    setUploadProgress(null);
    if (successCount > 0) {
      setUploadSuccess(`${successCount} photo${successCount > 1 ? "s" : ""} uploaded successfully.`);
      setTimeout(() => setUploadSuccess(""), 4000);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  const filtered =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Upload and manage photos shown in the public gallery."
        action={
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add Photos
          </button>
        }
      />

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Success / Error banners */}
      {uploadSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}
      {uploadError && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {uploadError}
          <button onClick={() => setUploadError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Upload progress */}
      {uploading && uploadProgress && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3">
          <div className="mb-1 flex justify-between text-xs font-medium text-amber-800">
            <span>Uploading photos…</span>
            <span>{uploadProgress.done}/{uploadProgress.total}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-[#C9A84C] transition-all duration-300"
              style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Staging area ── */}
      {staged.length > 0 && !uploading && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Ready to upload — {staged.length} photo{staged.length > 1 ? "s" : ""}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Add a description and category for each photo before uploading.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  staged.forEach((s) => URL.revokeObjectURL(s.preview));
                  setStaged([]);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel all
              </button>
              <button
                onClick={handleUploadAll}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-1.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload {staged.length > 1 ? `all ${staged.length}` : "photo"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {staged.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Preview */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeStaged(item.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-2.5 p-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) => updateStaged(item.id, "alt", e.target.value)}
                      placeholder="e.g. Sigiriya Rock Fortress at sunset"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => updateStaged(item.id, "category", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#C9A84C] focus:outline-none"
                    >
                      <option value="">— No category —</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add more */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition hover:border-[#C9A84C] hover:bg-amber-50/30 hover:text-[#C9A84C] sm:aspect-auto sm:min-h-[160px]"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-medium">Add more</span>
            </button>
          </div>
        </div>
      )}

      {/* Drop zone (only shown when no staged files) */}
      {staged.length === 0 && !uploading && (
        <div
          onClick={() => fileRef.current?.click()}
          className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 text-center hover:border-[#C9A84C] hover:bg-amber-50/30 transition-colors"
        >
          <Upload className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-500">
            Click to select photos
          </p>
          <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP · Max 5MB each</p>
        </div>
      )}

      {/* Category filter for uploaded images */}
      <div className="mb-4 flex flex-wrap gap-2">
        {VIEW_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[#1C1209] text-[#C9A84C]"
                : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <Images className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="aspect-square w-full object-cover transition group-hover:opacity-80"
              />
              {/* Hover overlay with meta */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 transition group-hover:opacity-100 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5">
                  {img.alt && (
                    <p className="line-clamp-2 text-[11px] leading-snug text-white">
                      {img.alt}
                    </p>
                  )}
                  {img.category && (
                    <span className="inline-block rounded-full bg-[#C9A84C]/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {img.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
