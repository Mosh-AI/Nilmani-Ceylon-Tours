"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LocationInitial {
  id: string;
  slug: string;
  name: string;
  region: string;
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
}

interface LocationFormProps {
  initial?: LocationInitial;
}

const REGION_OPTIONS = [
  { value: "north", label: "North" },
  { value: "north-central", label: "North Central" },
  { value: "east", label: "East" },
  { value: "central", label: "Central / Hill Country" },
  { value: "west", label: "West" },
  { value: "south", label: "South" },
] as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

export function LocationForm({ initial }: LocationFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [lat, setLat] = useState<string>(initial?.lat?.toString() ?? "");
  const [lng, setLng] = useState<string>(initial?.lng?.toString() ?? "");
  const [mapX, setMapX] = useState<string>(initial?.mapX?.toString() ?? "");
  const [mapY, setMapY] = useState<string>(initial?.mapY?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...(isEdit ? {} : { slug }),
      name,
      region,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      mapX: parseFloat(mapX),
      mapY: parseFloat(mapY),
    };

    const url = isEdit
      ? `/api/admin/locations/${initial!.id}`
      : "/api/admin/locations";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/locations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Location Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Slug */}
          <div>
            <label className={labelClass} htmlFor="loc-slug">
              Slug <span className="text-red-500">*</span>
              {isEdit && (
                <span className="ml-2 text-xs font-normal text-gray-400">(read-only)</span>
              )}
            </label>
            <input
              id="loc-slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              disabled={isEdit}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. sigiriya"
              className={`${inputClass} ${isEdit ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""}`}
            />
            {!isEdit && (
              <p className="mt-1 text-xs text-gray-400">
                Lowercase letters, digits, and hyphens only.
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className={labelClass} htmlFor="loc-name">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="loc-name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sigiriya"
              className={inputClass}
            />
          </div>

          {/* Region */}
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="loc-region">
              Region <span className="text-red-500">*</span>
            </label>
            <select
              id="loc-region"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a region…</option>
              {REGION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Geographic Coordinates
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Lat */}
          <div>
            <label className={labelClass} htmlFor="loc-lat">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              id="loc-lat"
              type="number"
              required
              step="0.0001"
              min={5}
              max={11}
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 7.9572"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">Range: 5 – 11</p>
          </div>

          {/* Lng */}
          <div>
            <label className={labelClass} htmlFor="loc-lng">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              id="loc-lng"
              type="number"
              required
              step="0.0001"
              min={79}
              max={82}
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. 80.7603"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">Range: 79 – 82</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
          SVG Map Coordinates
        </h2>
        <p className="mb-5 text-xs text-gray-400">
          Pixel position on the Sri Lanka island outline SVG (viewBox 0 0 450 793).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Map X */}
          <div>
            <label className={labelClass} htmlFor="loc-map-x">
              Map X <span className="text-red-500">*</span>
            </label>
            <input
              id="loc-map-x"
              type="number"
              required
              step={1}
              min={0}
              max={500}
              value={mapX}
              onChange={(e) => setMapX(e.target.value)}
              placeholder="e.g. 231"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">Range: 0 – 500</p>
          </div>

          {/* Map Y */}
          <div>
            <label className={labelClass} htmlFor="loc-map-y">
              Map Y <span className="text-red-500">*</span>
            </label>
            <input
              id="loc-map-y"
              type="number"
              required
              step={1}
              min={0}
              max={800}
              value={mapY}
              onChange={(e) => setMapY(e.target.value)}
              placeholder="e.g. 403"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">Range: 0 – 800</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#1C1209] px-8 py-3 text-sm font-semibold text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Location"}
        </button>
        <a
          href="/admin/locations"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
