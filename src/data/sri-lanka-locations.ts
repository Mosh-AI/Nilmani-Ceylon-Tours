/* ── Pre-defined Sri Lankan tourist locations ──
 * SVG coordinates match viewBox "0 0 450 793" in sri-lanka-map-data.ts
 * Slugs are canonical identifiers used in route_stops.location_slug
 */

export interface SriLankaLocation {
  slug: string;
  name: string;
  region: "north" | "north-central" | "east" | "central" | "west" | "south";
  mapX: number;
  mapY: number;
}

export const SRI_LANKA_LOCATIONS: SriLankaLocation[] = [
  // ── North ──
  // Coordinates derived from affine transform (svgX = 175.383·lng − 13943.8, svgY = −183.888·lat + 1861.187)
  // with IDW bias-correction anchored to 5 hand-verified reference pins from DestinationsSection.
  { slug: "jaffna",          name: "Jaffna",          region: "north",         mapX:  91, mapY:  85 },
  { slug: "mannar",          name: "Mannar",          region: "north",         mapX:  74, mapY: 211 },

  // ── North Central ──
  { slug: "anuradhapura",    name: "Anuradhapura",    region: "north-central", mapX: 165, mapY: 335 },
  { slug: "trincomalee",     name: "Trincomalee",     region: "north-central", mapX: 306, mapY: 284 },
  { slug: "polonnaruwa",     name: "Polonnaruwa",     region: "north-central", mapX: 272, mapY: 405 },
  { slug: "sigiriya",        name: "Sigiriya",        region: "north-central", mapX: 231, mapY: 403 }, // verified
  { slug: "dambulla",        name: "Dambulla",        region: "north-central", mapX: 211, mapY: 418 },
  { slug: "kurunegala",      name: "Kurunegala",      region: "north-central", mapX: 153, mapY: 482 },

  // ── East ──
  { slug: "batticaloa",      name: "Batticaloa",      region: "east",          mapX: 388, mapY: 443 },
  { slug: "arugam-bay",      name: "Arugam Bay",      region: "east",          mapX: 407, mapY: 613 },
  { slug: "ampara",          name: "Ampara",          region: "east",          mapX: 382, mapY: 519 },

  // ── Central / Hill Country ──
  { slug: "matale",          name: "Matale",          region: "central",       mapX: 198, mapY: 485 },
  { slug: "kandy",           name: "Kandy",           region: "central",       mapX: 196, mapY: 514 },
  { slug: "nuwara-eliya",    name: "Nuwara Eliya",    region: "central",       mapX: 212, mapY: 572 }, // verified
  { slug: "badulla",         name: "Badulla",         region: "central",       mapX: 282, mapY: 565 },
  { slug: "haputale",        name: "Haputale",        region: "central",       mapX: 263, mapY: 607 },
  { slug: "ella",            name: "Ella",            region: "central",       mapX: 287, mapY: 587 }, // verified
  { slug: "ratnapura",       name: "Ratnapura",       region: "central",       mapX: 154, mapY: 625 },

  // ── West ──
  { slug: "negombo",         name: "Negombo",         region: "west",          mapX:  58, mapY: 531 },
  { slug: "colombo-airport", name: "Colombo Airport", region: "west",          mapX:  66, mapY: 536 },
  { slug: "colombo",         name: "Colombo",         region: "west",          mapX:  61, mapY: 582 },
  { slug: "kegalle",         name: "Kegalle",         region: "west",          mapX: 146, mapY: 522 },

  // ── South ──
  { slug: "yala",            name: "Yala",            region: "south",         mapX: 344, mapY: 720 }, // verified
  { slug: "tissamaharama",   name: "Tissamaharama",   region: "south",         mapX: 307, mapY: 725 },
  { slug: "hambantota",      name: "Hambantota",      region: "south",         mapX: 279, mapY: 745 },
  { slug: "tangalle",        name: "Tangalle",        region: "south",         mapX: 224, mapY: 751 },
  { slug: "matara",          name: "Matara",          region: "south",         mapX: 180, mapY: 757 },
  { slug: "mirissa",         name: "Mirissa",         region: "south",         mapX: 161, mapY: 757 },
  { slug: "weligama",        name: "Weligama",        region: "south",         mapX: 157, mapY: 751 },
  { slug: "galle",           name: "Galle",           region: "south",         mapX: 120, mapY: 735 }, // verified
  { slug: "unawatuna",       name: "Unawatuna",       region: "south",         mapX: 125, mapY: 743 },
  { slug: "hikkaduwa",       name: "Hikkaduwa",       region: "south",         mapX:  99, mapY: 720 },
];

// O(1) lookup by slug
export const LOCATION_BY_SLUG = Object.fromEntries(
  SRI_LANKA_LOCATIONS.map((l) => [l.slug, l])
) as Record<string, SriLankaLocation>;

// Region display labels
export const REGION_LABELS: Record<SriLankaLocation["region"], string> = {
  "north":         "North",
  "north-central": "North Central",
  "east":          "East",
  "central":       "Central / Hill Country",
  "west":          "West",
  "south":         "South",
};
