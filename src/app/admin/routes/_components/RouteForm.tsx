"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, X, Plus, Search, Loader2 } from "lucide-react";
import { REGION_LABELS } from "@/data/sri-lanka-locations";

interface LocationRow {
  id: string;
  slug: string;
  name: string;
  region: string;
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
}

interface RouteFormInitial {
  id: string;
  name: string;
  description: string;
  stops: string[];
}

interface RouteFormProps {
  initial?: RouteFormInitial;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const REGION_ORDER = [
  "north",
  "north-central",
  "east",
  "central",
  "west",
  "south",
] as const;

export function RouteForm({ initial }: RouteFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [locs, setLocs] = useState<LocationRow[]>([]);
  const [locsLoading, setLocsLoading] = useState(true);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [stops, setStops] = useState<string[]>(initial?.stops ?? []);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((data: { locations: LocationRow[] }) => {
        setLocs(data.locations ?? []);
      })
      .catch(() => setLocs([]))
      .finally(() => setLocsLoading(false));
  }, []);

  const locBySlug = useMemo(
    () => Object.fromEntries(locs.map((l) => [l.slug, l])),
    [locs]
  );

  // Locations not yet added, filtered by search query
  const filteredLocations = locs.filter((loc) => {
    if (stops.includes(loc.slug)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      (REGION_LABELS[loc.region as keyof typeof REGION_LABELS] ?? "").toLowerCase().includes(q)
    );
  });

  // Group filtered locations by region for display
  const byRegion = filteredLocations.reduce<Record<string, LocationRow[]>>(
    (acc, loc) => {
      const list = acc[loc.region] ?? [];
      list.push(loc);
      acc[loc.region] = list;
      return acc;
    },
    {}
  );

  function addStop(slug: string) {
    if (!stops.includes(slug)) setStops((p) => [...p, slug]);
    setSearch("");
  }

  function removeStop(slug: string) {
    setStops((p) => p.filter((s) => s !== slug));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setStops((p) => {
      const next = [...p];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    if (idx === stops.length - 1) return;
    setStops((p) => {
      const next = [...p];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stops.length === 0) {
      setError("Add at least one stop to the route.");
      return;
    }
    setSaving(true);
    setError("");

    const url = isEdit
      ? `/api/admin/routes/${initial!.id}`
      : "/api/admin/routes";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null, stops }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/routes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* ── Section 1: Basic Info ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Route Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="route-name">
              Route Name <span className="text-red-500">*</span>
            </label>
            <input
              id="route-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Sri Lanka Discovery"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="route-description">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="route-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this route's highlights..."
              rows={3}
              maxLength={500}
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {description.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Location Picker ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Add Locations
        </h2>
        <p className="mb-5 text-xs text-gray-400">
          Search and click to add stops. Locations already added are hidden.
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or region..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
          />
        </div>

        {/* Location chips grouped by region */}
        <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-3">
          {locsLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading locations…
            </div>
          ) : filteredLocations.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              {search ? "No locations match your search." : "All locations have been added."}
            </p>
          ) : (
            <div className="space-y-4">
              {REGION_ORDER.filter((region) => byRegion[region]?.length).map(
                (region) => (
                  <div key={region}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {REGION_LABELS[region]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {byRegion[region].map((loc) => (
                        <button
                          key={loc.slug}
                          type="button"
                          onClick={() => addStop(loc.slug)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
                        >
                          <Plus className="h-3 w-3" />
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Ordered Stops ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Route Order{" "}
          <span className="ml-2 rounded-full bg-[#C9A84C]/15 px-2 py-0.5 text-xs font-medium text-[#C9A84C]">
            {stops.length} stop{stops.length !== 1 ? "s" : ""}
          </span>
        </h2>
        <p className="mb-5 text-xs text-gray-400">
          Drag the arrows to reorder. The first stop is the starting point.
        </p>

        {stops.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
            <p className="text-sm text-gray-400">
              No stops added yet. Search and click locations above.
            </p>
          </div>
        ) : (
          <ol className="space-y-2">
            {stops.map((slug, idx) => {
              const loc = locBySlug[slug];
              return (
                <li
                  key={slug}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  {/* Stop number */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1C1209] text-[10px] font-bold text-[#C9A84C]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Location name */}
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {loc?.name ?? slug}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      {loc ? (REGION_LABELS[loc.region as keyof typeof REGION_LABELS] ?? loc.region) : ""}
                    </span>
                  </span>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      aria-label={`Move ${loc?.name ?? slug} up`}
                      className="rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === stops.length - 1}
                      aria-label={`Move ${loc?.name ?? slug} down`}
                      className="rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStop(slug)}
                      aria-label={`Remove ${loc?.name ?? slug}`}
                      className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#1C1209] px-8 py-3 text-sm font-semibold text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : isEdit
            ? "Save Changes"
            : "Create Route"}
        </button>
        <a
          href="/admin/routes"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
