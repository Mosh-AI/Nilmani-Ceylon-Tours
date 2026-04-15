export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
}

export type GalleryCategory =
  | "Cultural"
  | "Wildlife"
  | "Beaches"
  | "Hill Country"
  | "People & Culture";

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Cultural",
  "Wildlife",
  "Beaches",
  "Hill Country",
  "People & Culture",
] as const;

export const galleryImages: GalleryImage[] = [
  // Cultural
  {
    id: "cultural-sigiriya-hero",
    src: "/images/sigiriya-hero.jpg",
    alt: "Sigiriya Lion Rock Fortress rising above the jungle canopy at sunrise, Sri Lanka",
    category: "Cultural",
    width: 1200,
    height: 800,
  },
  {
    id: "cultural-sigiriya",
    src: "/images/sigiriya.jpg",
    alt: "Ancient Sigiriya Rock Fortress surrounded by royal gardens, a UNESCO World Heritage Site",
    category: "Cultural",
    width: 800,
    height: 600,
  },
  {
    id: "cultural-galle",
    src: "/images/galle.jpg",
    alt: "Historic Galle Fort lighthouse and colonial architecture along the southern coast of Sri Lanka",
    category: "Cultural",
    width: 800,
    height: 600,
  },
  {
    id: "cultural-temple",
    src: "https://images.unsplash.com/photo-1586613835341-57a18b7fbfc0?w=800&h=1000&fit=crop",
    alt: "Golden Buddha statue at the ancient Temple of the Sacred Tooth Relic in Kandy",
    category: "Cultural",
    width: 800,
    height: 1000,
  },
  {
    id: "cultural-polonnaruwa",
    src: "https://images.unsplash.com/photo-1588598198321-9735fd510221?w=800&h=600&fit=crop",
    alt: "Ancient stone ruins and carved pillars at Polonnaruwa archaeological site",
    category: "Cultural",
    width: 800,
    height: 600,
  },

  // Wildlife
  {
    id: "wildlife-yala",
    src: "/images/yala.jpg",
    alt: "Sri Lankan leopard resting on a rock in Yala National Park during an afternoon safari",
    category: "Wildlife",
    width: 800,
    height: 600,
  },
  {
    id: "wildlife-elephant",
    src: "https://images.unsplash.com/photo-1535338454528-1b5c8e9b2e02?w=800&h=900&fit=crop",
    alt: "Wild elephants bathing in a river at Pinnawala elephant gathering in Sri Lanka",
    category: "Wildlife",
    width: 800,
    height: 900,
  },
  {
    id: "wildlife-whale",
    src: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&h=600&fit=crop",
    alt: "Blue whale breaching off the coast of Mirissa during a whale watching excursion",
    category: "Wildlife",
    width: 800,
    height: 600,
  },

  // Beaches
  {
    id: "beaches-cta",
    src: "/images/beach-cta.jpg",
    alt: "Golden sunset over a pristine Sri Lankan beach with palm trees swaying in the tropical breeze",
    category: "Beaches",
    width: 1200,
    height: 800,
  },
  {
    id: "beaches-unawatuna",
    src: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=1000&fit=crop",
    alt: "Crystal clear turquoise waters at Unawatuna Beach, one of Sri Lanka's most beautiful coastal retreats",
    category: "Beaches",
    width: 800,
    height: 1000,
  },
  {
    id: "beaches-mirissa",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    alt: "Palm-lined Mirissa Beach at golden hour with traditional stilt fishermen in the distance",
    category: "Beaches",
    width: 800,
    height: 600,
  },

  // Hill Country
  {
    id: "hillcountry-ella",
    src: "/images/ella.jpg",
    alt: "Nine Arches Bridge in Ella surrounded by lush green tea plantations in Sri Lanka's hill country",
    category: "Hill Country",
    width: 800,
    height: 600,
  },
  {
    id: "hillcountry-tea",
    src: "https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?w=800&h=1000&fit=crop",
    alt: "Emerald tea plantations cascading down misty hillsides in Nuwara Eliya",
    category: "Hill Country",
    width: 800,
    height: 1000,
  },
  {
    id: "hillcountry-train",
    src: "https://images.unsplash.com/photo-1580892937970-96a2de2f8066?w=800&h=600&fit=crop",
    alt: "Iconic blue train crossing a bridge through the scenic hill country between Kandy and Ella",
    category: "Hill Country",
    width: 800,
    height: 600,
  },

  // People & Culture
  {
    id: "people-fishermen",
    src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=1000&fit=crop",
    alt: "Traditional stilt fishermen balancing on poles at sunset along the southern coast of Sri Lanka",
    category: "People & Culture",
    width: 800,
    height: 1000,
  },
  {
    id: "people-tea-plucker",
    src: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800&h=600&fit=crop",
    alt: "Sri Lankan tea plucker harvesting fresh tea leaves in the lush highlands of Nuwara Eliya",
    category: "People & Culture",
    width: 800,
    height: 600,
  },
  {
    id: "people-dancers",
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
    alt: "Kandyan dancers performing a traditional Sri Lankan cultural dance in vibrant ceremonial costumes",
    category: "People & Culture",
    width: 800,
    height: 800,
  },
  {
    id: "people-spices",
    src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop",
    alt: "Colorful spice market display with cinnamon, cardamom, and turmeric in a traditional Sri Lankan bazaar",
    category: "People & Culture",
    width: 800,
    height: 600,
  },
];
