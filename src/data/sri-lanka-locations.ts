/* ── Pre-defined Sri Lankan tourist locations ──
 * mapX / mapY  — SVG coordinates for the custom island outline (viewBox "0 0 450 793")
 * lat  / lng   — WGS-84 geographic coordinates for Google Maps marker placement
 * Slugs are canonical identifiers used in route_stops.location_slug
 */

export interface SriLankaLocation {
  slug: string;
  name: string;
  region: "north" | "north-central" | "east" | "central" | "west" | "south";
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
}

export const SRI_LANKA_LOCATIONS: SriLankaLocation[] = [
  // ── North ──
  { slug: "jaffna",          name: "Jaffna",          region: "north",         mapX:  91, mapY:  85, lat:  9.6615, lng: 80.0070 },
  { slug: "mannar",          name: "Mannar",          region: "north",         mapX:  74, mapY: 211, lat:  8.9774, lng: 79.9046 },

  // ── North Central ──
  { slug: "anuradhapura",    name: "Anuradhapura",    region: "north-central", mapX: 165, mapY: 335, lat:  8.3114, lng: 80.4037 },
  { slug: "trincomalee",     name: "Trincomalee",     region: "north-central", mapX: 306, mapY: 284, lat:  8.5874, lng: 81.2152 },
  { slug: "polonnaruwa",     name: "Polonnaruwa",     region: "north-central", mapX: 272, mapY: 405, lat:  7.9403, lng: 81.0003 },
  { slug: "sigiriya",        name: "Sigiriya",        region: "north-central", mapX: 231, mapY: 403, lat:  7.9572, lng: 80.7603 },
  { slug: "dambulla",        name: "Dambulla",        region: "north-central", mapX: 211, mapY: 418, lat:  7.8731, lng: 80.6511 },
  { slug: "kurunegala",      name: "Kurunegala",      region: "north-central", mapX: 153, mapY: 482, lat:  7.4863, lng: 80.3631 },

  // ── East ──
  { slug: "batticaloa",      name: "Batticaloa",      region: "east",          mapX: 388, mapY: 443, lat:  7.7170, lng: 81.7000 },
  { slug: "arugam-bay",      name: "Arugam Bay",      region: "east",          mapX: 407, mapY: 613, lat:  6.8406, lng: 81.8356 },
  { slug: "ampara",          name: "Ampara",          region: "east",          mapX: 382, mapY: 519, lat:  7.2984, lng: 81.6724 },

  // ── Central / Hill Country ──
  { slug: "matale",          name: "Matale",          region: "central",       mapX: 198, mapY: 485, lat:  7.4675, lng: 80.6234 },
  { slug: "kandy",           name: "Kandy",           region: "central",       mapX: 196, mapY: 514, lat:  7.2906, lng: 80.6337 },
  { slug: "nuwara-eliya",    name: "Nuwara Eliya",    region: "central",       mapX: 212, mapY: 572, lat:  6.9497, lng: 80.7891 },
  { slug: "badulla",         name: "Badulla",         region: "central",       mapX: 282, mapY: 565, lat:  6.9934, lng: 81.0550 },
  { slug: "haputale",        name: "Haputale",        region: "central",       mapX: 263, mapY: 607, lat:  6.7668, lng: 80.9535 },
  { slug: "ella",            name: "Ella",            region: "central",       mapX: 287, mapY: 587, lat:  6.8686, lng: 81.0466 },
  { slug: "ratnapura",       name: "Ratnapura",       region: "central",       mapX: 154, mapY: 625, lat:  6.6806, lng: 80.4022 },

  // ── West ──
  { slug: "negombo",         name: "Negombo",         region: "west",          mapX:  58, mapY: 531, lat:  7.2096, lng: 79.8386 },
  { slug: "colombo-airport", name: "Colombo Airport", region: "west",          mapX:  66, mapY: 536, lat:  7.1803, lng: 79.8840 },
  { slug: "colombo",         name: "Colombo",         region: "west",          mapX:  61, mapY: 582, lat:  6.9271, lng: 79.8612 },
  { slug: "kegalle",         name: "Kegalle",         region: "west",          mapX: 146, mapY: 522, lat:  7.2513, lng: 80.3464 },

  // ── South ──
  { slug: "yala",            name: "Yala",            region: "south",         mapX: 344, mapY: 720, lat:  6.3728, lng: 81.5201 },
  { slug: "tissamaharama",   name: "Tissamaharama",   region: "south",         mapX: 307, mapY: 725, lat:  6.2931, lng: 81.2923 },
  { slug: "hambantota",      name: "Hambantota",      region: "south",         mapX: 279, mapY: 745, lat:  6.1241, lng: 81.1185 },
  { slug: "tangalle",        name: "Tangalle",        region: "south",         mapX: 224, mapY: 751, lat:  6.0241, lng: 80.7997 },
  { slug: "matara",          name: "Matara",          region: "south",         mapX: 180, mapY: 757, lat:  5.9549, lng: 80.5550 },
  { slug: "mirissa",         name: "Mirissa",         region: "south",         mapX: 161, mapY: 757, lat:  5.9477, lng: 80.4538 },
  { slug: "weligama",        name: "Weligama",        region: "south",         mapX: 157, mapY: 751, lat:  5.9739, lng: 80.4283 },
  { slug: "galle",           name: "Galle",           region: "south",         mapX: 120, mapY: 735, lat:  6.0535, lng: 80.2210 },
  { slug: "unawatuna",       name: "Unawatuna",       region: "south",         mapX: 125, mapY: 743, lat:  6.0099, lng: 80.2490 },
  { slug: "hikkaduwa",       name: "Hikkaduwa",       region: "south",         mapX:  99, mapY: 720, lat:  6.1395, lng: 80.0998 },
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
