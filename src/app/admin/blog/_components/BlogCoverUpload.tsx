"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";

interface BlogCoverUploadProps {
  coverImage: string;
  onChange: (coverImage: string) => void;
}

type StagedFile = { id: string; file: File; preview: string };

export function BlogCoverUpload({ coverImage, onChange }: BlogCoverUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [staged, setStaged] = useState<StagedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous staged preview if exists
    if (staged) URL.revokeObjectURL(staged.preview);

    setStaged({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    });

    // Reset file input so same file can be re-selected
    e.target.value = "";
  }

  async function handleUpload() {
    if (!staged || uploading) return;
    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", staged.file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setUploadError(`${staged.file.name}: ${err.error ?? "Upload failed"}`);
      setUploading(false);
      return;
    }

    const { url } = (await res.json()) as { url: string };
    URL.revokeObjectURL(staged.preview);
    setStaged(null);
    setUploading(false);
    onChange(url);
    setUploadSuccess("Cover image uploaded.");
    setTimeout(() => setUploadSuccess(""), 4000);
  }

  function handleRemove() {
    onChange("");
  }

  function handleCancelStaged() {
    if (staged) URL.revokeObjectURL(staged.preview);
    setStaged(null);
  }

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Cover Image
      </h2>

      <div className="space-y-4">
        {/* Success */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
            {uploadSuccess}
          </div>
        )}

        {/* Error */}
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

        {/* Current uploaded image */}
        {coverImage && !staged && (
          <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />

            {/* Cover badge */}
            <div className="absolute left-3 top-3 rounded-full bg-[#C9A84C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1C1209]">
              Cover
            </div>

            {/* Hover overlay with remove + replace */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-white"
              >
                <Upload className="h-3.5 w-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Staged file preview — ready to upload */}
        {staged && !uploading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-amber-800">Ready to upload</p>
              <button
                type="button"
                onClick={handleCancelStaged}
                className="text-xs text-amber-600 underline hover:text-amber-800"
              >
                Cancel
              </button>
            </div>
            <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-amber-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={staged.preview} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mb-3 truncate text-xs text-amber-700">{staged.file.name}</p>
            <button
              type="button"
              onClick={handleUpload}
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-[#1C1209] transition hover:bg-[#E8C96A]"
            >
              <Upload className="h-4 w-4" />
              Upload image
            </button>
          </div>
        )}

        {/* Upload in progress */}
        {uploading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 text-sm font-medium text-amber-800">Uploading…</div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
              <div className="h-full w-full animate-pulse rounded-full bg-[#C9A84C]" />
            </div>
          </div>
        )}

        {/* Empty state — no image, no staged file */}
        {!coverImage && !staged && !uploading && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-14 transition hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/[0.02]"
          >
            <ImageIcon className="h-9 w-9 text-gray-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Click to upload cover image</p>
              <p className="mt-0.5 text-xs text-gray-400">JPEG, PNG, or WebP · up to 50 MB</p>
            </div>
          </button>
        )}

        {/* Hidden file input — single file only */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
