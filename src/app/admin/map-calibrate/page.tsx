"use client";

import { useState, useRef, useCallback } from "react";
import { SRI_LANKA_DISTRICTS } from "@/components/sri-lanka-map-data";
import { SRI_LANKA_LOCATIONS } from "@/data/sri-lanka-locations";
import { Copy, Check } from "lucide-react";

type Pin = { slug: string; name: string; mapX: number; mapY: number };

export default function MapCalibratePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [clicked, setClicked] = useState<{ x: number; y: number } | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [copied, setCopied] = useState(false);

  const getSvgCoords = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const scaleX = 450 / rect.width;
      const scaleY = 793 / rect.height;
      return {
        x: Math.round((e.clientX - rect.left) * scaleX),
        y: Math.round((e.clientY - rect.top) * scaleY),
      };
    },
    []
  );

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const c = getSvgCoords(e);
    if (c) setCursor(c);
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const c = getSvgCoords(e);
    if (!c) return;
    setClicked(c);
    if (selectedSlug) {
      setOverrides((prev) => ({ ...prev, [selectedSlug]: c }));
    }
  }

  // Merged pins: original coords + any overrides from clicking
  const pins: Pin[] = SRI_LANKA_LOCATIONS.map((loc) => ({
    slug: loc.slug,
    name: loc.name,
    mapX: overrides[loc.slug]?.x ?? loc.mapX,
    mapY: overrides[loc.slug]?.y ?? loc.mapY,
  }));

  function generateCode() {
    return SRI_LANKA_LOCATIONS.map((loc) => {
      const ov = overrides[loc.slug];
      const x = ov?.x ?? loc.mapX;
      const y = ov?.y ?? loc.mapY;
      const tag = ov ? " // manually calibrated" : "";
      return `  { slug: "${loc.slug.padEnd(17)}", name: "${loc.name}", ...mapX: ${String(x).padStart(3)}, mapY: ${String(y).padStart(3)} },${tag}`;
    }).join("\n");
  }

  function copyCode() {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Left sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-neutral-800 overflow-y-auto">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-sm font-semibold text-white">Map Pin Calibrator</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Select a location, then click on the map to reposition its pin.
          </p>
        </div>

        {/* Cursor readout */}
        <div className="p-4 border-b border-neutral-800 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">cursor</span>
            <span className="text-amber-400">
              {cursor ? `${cursor.x}, ${cursor.y}` : "—"}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-neutral-500">last click</span>
            <span className="text-green-400">
              {clicked ? `${clicked.x}, ${clicked.y}` : "—"}
            </span>
          </div>
          {selectedSlug && (
            <div className="mt-2 text-[#C9A84C]">
              Placing: <strong>{selectedSlug}</strong>
            </div>
          )}
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
          {SRI_LANKA_LOCATIONS.map((loc) => {
            const ov = overrides[loc.slug];
            const isSelected = selectedSlug === loc.slug;
            return (
              <button
                key={loc.slug}
                onClick={() =>
                  setSelectedSlug((s) => (s === loc.slug ? null : loc.slug))
                }
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                  isSelected
                    ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{loc.name}</span>
                  {ov && (
                    <span className="text-green-400 font-mono">
                      {ov.x},{ov.y}
                    </span>
                  )}
                  {!ov && (
                    <span className="text-neutral-600 font-mono">
                      {loc.mapX},{loc.mapY}
                    </span>
                  )}
                </div>
                <div className="text-neutral-600 capitalize">{loc.region}</div>
              </button>
            );
          })}
        </div>

        {/* Copy code */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8983e] text-black text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Updated Coords"}
          </button>
          {Object.keys(overrides).length > 0 && (
            <p className="text-xs text-neutral-500 mt-2 text-center">
              {Object.keys(overrides).length} pin
              {Object.keys(overrides).length !== 1 ? "s" : ""} repositioned
            </p>
          )}
        </div>
      </aside>

      {/* Map area */}
      <main className="flex-1 flex items-center justify-center overflow-hidden bg-neutral-900 p-8">
        <svg
          ref={svgRef}
          viewBox="0 0 450 793"
          className="h-full max-h-full w-auto select-none"
          style={{ cursor: selectedSlug ? "crosshair" : "default" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursor(null)}
          onClick={handleClick}
        >
          <defs>
            <filter id="cal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Districts */}
          {SRI_LANKA_DISTRICTS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="#2a2a2a"
              stroke="#444"
              strokeWidth="0.5"
              filter="url(#cal-shadow)"
            />
          ))}

          {/* Grid overlay (every 50px) */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 50).map((x) => (
            <line key={`vg-${x}`} x1={x} y1={0} x2={x} y2={793} stroke="#ffffff08" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 15 }, (_, i) => (i + 1) * 50).map((y) => (
            <line key={`hg-${y}`} x1={0} y1={y} x2={450} y2={y} stroke="#ffffff08" strokeWidth="0.5" />
          ))}

          {/* Cursor crosshair */}
          {cursor && (
            <>
              <line x1={cursor.x} y1={0} x2={cursor.x} y2={793} stroke="#ffffff20" strokeWidth="0.5" />
              <line x1={0} y1={cursor.y} x2={450} y2={cursor.y} stroke="#ffffff20" strokeWidth="0.5" />
            </>
          )}

          {/* Pins */}
          {pins.map((pin) => {
            const isSelected = selectedSlug === pin.slug;
            const isOverridden = !!overrides[pin.slug];
            const r = isSelected ? 8 : 5;
            const fill = isOverridden ? "#22c55e" : isSelected ? "#C9A84C" : "#888";
            return (
              <g
                key={pin.slug}
                transform={`translate(${pin.mapX}, ${pin.mapY})`}
                style={{ pointerEvents: "none" }}
              >
                {isSelected && (
                  <circle r={14} fill="none" stroke="#C9A84C" strokeWidth="1" opacity={0.5} />
                )}
                <circle r={r} fill={fill} stroke="#fff" strokeWidth={isSelected ? 1.5 : 0.8} opacity={0.9} />
                <text
                  x={8}
                  y={4}
                  fontSize={isSelected ? "10" : "8"}
                  fill={isSelected ? "#C9A84C" : isOverridden ? "#22c55e" : "#ccc"}
                  fontWeight={isSelected ? "700" : "400"}
                  style={{ userSelect: "none" }}
                >
                  {pin.name}
                </text>
              </g>
            );
          })}

          {/* Click marker */}
          {clicked && !selectedSlug && (
            <g transform={`translate(${clicked.x}, ${clicked.y})`} style={{ pointerEvents: "none" }}>
              <line x1={-8} y1={0} x2={8} y2={0} stroke="#22c55e" strokeWidth="1.5" />
              <line x1={0} y1={-8} x2={0} y2={8} stroke="#22c55e" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </main>
    </div>
  );
}
