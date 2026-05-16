"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";

interface TourImageUploadProps {
  heroImage: string;
  images: string[];
  onChange: (heroImage: string, images: string[]) => void;
}

type StagedFile = { id: string; file: File; preview: string };

export function TourImageUpload({ heroImage, images, onChange }: TourImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const currentUrls = [heroImage, ...images].filter(Boolean);

  function removeImage(idx: number) {
    const next = currentUrls.filter((_, i) => i !== idx);
    onChange(next[0] ?? "", next.slice(1));
  }

  function makeCover(idx: number) {
    const next = [...currentUrls];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next[0] ?? "", next.slice(1));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newStaged: StagedFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setStaged((prev) => [...prev, ...newStaged]);

    // Reset file input so the same files can be selected again if needed
    e.target.value = "";
  }

  async function handleUploadAll() {
    if (!staged.length || uploading) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress({ done: 0, total: staged.length });

    const newUrls: string[] = [];
    for (let i = 0; i < staged.length; i++) {
      const item = staged[i];
      const fd = new FormData();
      fd.append("file", item.file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        setUploadError(`${item.file.name}: ${err.error ?? "Upload failed"}`);
        setUploading(false);
        setUploadProgress(null);
        staged.slice(i).forEach((s) => URL.revokeObjectURL(s.preview));
        return;
      }

      const { url } = (await res.json()) as { url: string };
      newUrls.push(url);
      URL.revokeObjectURL(item.preview);
      setUploadProgress({ done: i + 1, total: staged.length });
    }

    const merged = [...currentUrls, ...newUrls];
    onChange(merged[0] ?? "", merged.slice(1));
    setStaged([]);
    setUploading(false);
    setUploadProgress(null);
    setUploadSuccess(`${newUrls.length} image${newUrls.length !== 1 ? "s" : ""} uploaded.`);
    setTimeout(() => setUploadSuccess(""), 4000);
  }

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Tour Images
      </h2>

      <div className="space-y-4">
        {/* Success message */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
            {uploadSuccess}
          </div>
        )}

        {/* Sticky error message */}
        {uploadError && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError("")}
              className="shrink-0 rounded p-0.5 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Current images grid */}
        {currentUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {currentUrls.map((url, idx) => (
              <div
                key={url + idx}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />

                {/* Cover badge on first image */}
                {idx === 0 && (
                  <div className="absolute left-2 top-2 rounded-full bg-[#C9A84C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1C1209]">
                    Cover
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-end justify-between bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(idx)}
                      className="rounded-full bg-[#C9A84C] px-2 py-1 text-[10px] font-bold text-[#1C1209] hover:bg-[#E8C96A]"
                    >
                      Set as Cover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staged files pending upload */}
        {staged.length > 0 && !uploading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-amber-800">
                {staged.length} image{staged.length !== 1 ? "s" : ""} ready to upload
              </p>
              <button
                type="button"
                onClick={() => {
                  staged.forEach((s) => URL.revokeObjectURL(s.preview));
                  setStaged([]);
                }}
                className="text-xs text-amber-600 underline hover:text-amber-800"
              >
                Cancel all
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {staged.map((item) => (
                <div key={item.id} className="group relative h-16 w-16 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(item.preview);
                      setStaged((prev) => prev.filter((s) => s.id !== item.id));
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUploadAll}
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-[#1C1209] transition hover:bg-[#E8C96A]"
            >
              <Upload className="h-4 w-4" />
              Upload {staged.length} image{staged.length !== 1 ? "s" : ""}
            </button>
          </div>
        )}

        {/* Upload progress bar */}
        {uploading && uploadProgress && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-amber-800">
              <span>Uploading images…</span>
              <span>
                {uploadProgress.done}/{uploadProgress.total}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full rounded-full bg-[#C9A84C] transition-all duration-300"
                style={{
                  width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Empty state dashed upload area */}
        {currentUrls.length === 0 && staged.length === 0 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-12 transition hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/[0.02]"
          >
            <ImageIcon className="h-8 w-8 text-gray-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Click to upload images</p>
              <p className="mt-0.5 text-xs text-gray-400">
                JPEG, PNG, WebP · Max 5MB each · First image becomes the cover
              </p>
            </div>
          </button>
        )}

        {/* Add more button when images already exist */}
        {(currentUrls.length > 0 || staged.length > 0) && !uploading && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            <Upload className="h-4 w-4" />
            Add more images
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
