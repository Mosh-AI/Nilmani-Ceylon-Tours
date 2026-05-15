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
  { slug: "jaffna",          name: "Jaffna",          region: "north",         mapX: 210, mapY: 45  },
  { slug: "mannar",          name: "Mannar",          region: "north",         mapX: 130, mapY: 130 },

  // ── North Central ──
  { slug: "anuradhapura",    name: "Anuradhapura",    region: "north-central", mapX: 188, mapY: 195 },
  { slug: "trincomalee",     name: "Trincomalee",     region: "north-central", mapX: 285, mapY: 200 },
  { slug: "polonnaruwa",     name: "Polonnaruwa",     region: "north-central", mapX: 258, mapY: 275 },
  { slug: "sigiriya",        name: "Sigiriya",        region: "north-central", mapX: 212, mapY: 295 },
  { slug: "dambulla",        name: "Dambulla",        region: "north-central", mapX: 192, mapY: 315 },
  { slug: "kurunegala",      name: "Kurunegala",      region: "north-central", mapX: 152, mapY: 355 },

  // ── East ──
  { slug: "batticaloa",      name: "Batticaloa",      region: "east",          mapX: 318, mapY: 360 },
  { slug: "arugam-bay",      name: "Arugam Bay",      region: "east",          mapX: 318, mapY: 430 },
  { slug: "ampara",          name: "Ampara",          region: "east",          mapX: 292, mapY: 445 },

  // ── Central / Hill Country ──
  { slug: "matale",          name: "Matale",          region: "central",       mapX: 188, mapY: 368 },
  { slug: "kandy",           name: "Kandy",           region: "central",       mapX: 188, mapY: 420 },
  { slug: "nuwara-eliya",    name: "Nuwara Eliya",    region: "central",       mapX: 212, mapY: 490 },
  { slug: "badulla",         name: "Badulla",         region: "central",       mapX: 255, mapY: 505 },
  { slug: "haputale",        name: "Haputale",        region: "central",       mapX: 222, mapY: 545 },
  { slug: "ella",            name: "Ella",            region: "central",       mapX: 238, mapY: 535 },
  { slug: "ratnapura",       name: "Ratnapura",       region: "central",       mapX: 162, mapY: 535 },

  // ── West ──
  { slug: "negombo",         name: "Negombo",         region: "west",          mapX: 98,  mapY: 430 },
  { slug: "colombo-airport", name: "Colombo Airport", region: "west",          mapX: 100, mapY: 445 },
  { slug: "colombo",         name: "Colombo",         region: "west",          mapX: 108, mapY: 480 },
  { slug: "kegalle",         name: "Kegalle",         region: "west",          mapX: 155, mapY: 455 },

  // ── South ──
  { slug: "yala",            name: "Yala",            region: "south",         mapX: 268, mapY: 595 },
  { slug: "tissamaharama",   name: "Tissamaharama",   region: "south",         mapX: 260, mapY: 615 },
  { slug: "hambantota",      name: "Hambantota",      region: "south",         mapX: 248, mapY: 650 },
  { slug: "tangalle",        name: "Tangalle",        region: "south",         mapX: 218, mapY: 645 },
  { slug: "matara",          name: "Matara",          region: "south",         mapX: 198, mapY: 648 },
  { slug: "mirissa",         name: "Mirissa",         region: "south",         mapX: 172, mapY: 648 },
  { slug: "weligama",        name: "Weligama",        region: "south",         mapX: 160, mapY: 648 },
  { slug: "galle",           name: "Galle",           region: "south",         mapX: 138, mapY: 638 },
  { slug: "unawatuna",       name: "Unawatuna",       region: "south",         mapX: 143, mapY: 642 },
  { slug: "hikkaduwa",       name: "Hikkaduwa",       region: "south",         mapX: 118, mapY: 628 },
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
