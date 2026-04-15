"use client";

import { useState, useEffect, useRef } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Images, Trash2, Upload, X } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  sortOrder: number;
};

const CATEGORIES = ["All", "Landmarks", "Landscapes", "Wildlife", "Beaches", "Culture", "Food"];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []));
  }, []);

  async function handleFileUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await upRes.json();

      if (!upRes.ok) {
        setUploadError(upData.error ?? "Upload failed");
        setUploading(false);
        return;
      }

      const addRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: upData.url,
          alt: file.name.replace(/\.[^.]+$/, ""),
          category: selectedCategory === "All" ? "" : selectedCategory,
          sortOrder: images.length,
        }),
      });

      const addData = await addRes.json();
      if (addData.image) {
        setImages((prev) => [...prev, addData.image]);
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
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
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload Photos"}
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
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {uploadError && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {uploadError}
          <button onClick={() => setUploadError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Drop zone hint */}
      <div
        onClick={() => fileRef.current?.click()}
        className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 text-center hover:border-[#C9A84C] hover:bg-amber-50/30 transition-colors"
      >
        <Upload className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm font-medium text-gray-500">
          Click to upload photos
        </p>
        <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP · Max 5MB each</p>
      </div>

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
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
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="h-full w-full object-cover transition group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-end justify-start p-1.5 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {img.category && (
                <div className="absolute bottom-1.5 left-1.5">
                  <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                    {img.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
