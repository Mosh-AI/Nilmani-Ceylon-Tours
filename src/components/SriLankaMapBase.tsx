/* ── Reusable Sri Lanka SVG Map ──
 * Uses the same 25-district SVG paths as DestinationsSection.
 * No GSAP — pure CSS transitions for pin state changes.
 * Uses unique SVG IDs (map-base-*) to avoid conflicts when
 * DestinationsSection is on the same page.
 */

import { SRI_LANKA_DISTRICTS } from "./sri-lanka-map-data";

export type PinState = "normal" | "selected" | "faded";

export interface MapPin {
  slug: string;
  name: string;
  mapX: number;
  mapY: number;
  state: PinState;
}

interface SriLankaMapBaseProps {
  pins: MapPin[];
  onPinClick?: (slug: string) => void;
  className?: string;
  "aria-label"?: string;
}

export function SriLankaMapBase({
  pins,
  onPinClick,
  className,
  "aria-label": ariaLabel = "Interactive map of Sri Lanka",
}: SriLankaMapBaseProps) {
  return (
    <svg
      viewBox="0 0 450 793"
      className={className}
      aria-label={ariaLabel}
      role="img"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="map-base-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#A8891A"
            floodOpacity="0.1"
          />
        </filter>
        <linearGradient id="map-base-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A8891A" />
        </linearGradient>
        <radialGradient id="map-base-pin-glow">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── District fills ── */}
      <g filter="url(#map-base-shadow)">
        {SRI_LANKA_DISTRICTS.map((d, i) => (
          <path
            key={i}
            d={d}
            className="sri-lanka-district"
            fill="url(#map-base-gold-grad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.55"
          />
        ))}
      </g>

      {/* ── Location pins ── */}
      {pins.map((pin) => {
        const isFaded = pin.state === "faded";
        const isSelected = pin.state === "selected";

        return (
          <g
            key={pin.slug}
            transform={`translate(${pin.mapX}, ${pin.mapY})`}
            onClick={() => !isFaded && onPinClick?.(pin.slug)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isFaded) {
                e.preventDefault();
                onPinClick?.(pin.slug);
              }
            }}
            role={!isFaded ? "button" : undefined}
            tabIndex={!isFaded ? 0 : -1}
            aria-label={
              !isFaded
                ? `${isSelected ? "Deselect" : "Select"} ${pin.name}`
                : undefined
            }
            aria-pressed={isSelected || undefined}
            style={{
              opacity: isFaded ? 0.15 : 1,
              cursor: isFaded ? "default" : "pointer",
              pointerEvents: isFaded ? "none" : "auto",
              transition: "opacity 0.35s ease",
              outline: "none",
            }}
          >
            {/* Glow halo */}
            <circle
              r="22"
              fill="url(#map-base-pin-glow)"
              style={{
                opacity: isSelected ? 0.7 : 0.2,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Pin body */}
            <circle
              r={isSelected ? 9 : 6}
              fill={isSelected ? "#C9A84C" : "#A8891A"}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              style={{
                transition: "r 0.2s ease, fill 0.2s ease",
              }}
            />

            {/* Centre dot */}
            <circle r="2.5" fill="#FFFFFF" opacity={0.9} />

            {/* Label */}
            <text
              y={isSelected ? 26 : 22}
              textAnchor="middle"
              fill={isSelected ? "#1C1209" : "#3D3020"}
              fontSize={isSelected ? 11 : 9.5}
              fontWeight={isSelected ? "600" : "400"}
              fontFamily="Montserrat, sans-serif"
              aria-hidden="true"
              style={{ transition: "fill 0.2s ease, font-size 0.2s ease", userSelect: "none" }}
            >
              {pin.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
