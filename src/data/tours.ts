/* ── Tour Data ── */

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export type TourCategory =
  | "Cultural"
  | "Beach"
  | "Wildlife"
  | "Adventure"
  | "Comprehensive";

export interface Tour {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: TourCategory;
  duration: string;
  durationDays: number;
  price: string;
  priceNote: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSize: string;
  heroImage: string;
  heroAlt: string;
  galleryImages: { src: string; alt: string }[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  faqs: FAQ[];
}

export const TOUR_CATEGORIES: TourCategory[] = [
  "Cultural",
  "Beach",
  "Wildlife",
  "Adventure",
  "Comprehensive",
];

export const tours: Tour[] = [
  {
    slug: "cultural-triangle-explorer",
    title: "Cultural Triangle Explorer",
    subtitle: "Colombo \u2192 Sigiriya \u2192 Dambulla \u2192 Kandy \u2192 Nuwara Eliya",
    description:
      "Journey through Sri Lanka\u2019s ancient heartland \u2014 climb the legendary Sigiriya Rock, explore sacred cave temples, and witness centuries of Kandyan heritage.",
    longDescription:
      "This seven-day immersion takes you through the Cultural Triangle, a UNESCO-recognized region that shelters some of the world\u2019s most extraordinary ancient cities. From the fifth-century sky fortress of Sigiriya to the golden cave temples of Dambulla and the sacred Temple of the Tooth in Kandy, every stop reveals a new chapter in Sri Lanka\u2019s 2,500-year civilizational story. The journey concludes amid the cool misty highlands of Nuwara Eliya, where rolling tea estates meet colonial-era charm.",
    category: "Cultural",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    price: "From $490",
    priceNote: "per person, twin sharing",
    difficulty: "Moderate",
    groupSize: "2\u201312 guests",
    heroImage: "/images/sigiriya-hero.jpg",
    heroAlt:
      "Sigiriya Lion Rock fortress rising above lush green gardens at sunrise, Sri Lanka",
    galleryImages: [
      {
        src: "/images/sigiriya.jpg",
        alt: "View of Sigiriya rock from the water gardens below",
      },
      {
        src: "/images/ella.jpg",
        alt: "Scenic train crossing the Nine Arch Bridge in Ella",
      },
      {
        src: "/images/galle.jpg",
        alt: "Galle Fort lighthouse on the southern coast",
      },
      {
        src: "/images/yala.jpg",
        alt: "Scenic lake landscape in Yala region",
      },
    ],
    highlights: [
      "Climb the 1,200 steps to Sigiriya\u2019s summit for panoramic views",
      "Explore the five Dambulla Cave Temples with 150+ Buddha statues",
      "Attend a traditional Kandyan dance performance",
      "Visit the Temple of the Sacred Tooth Relic in Kandy",
      "Tour a working tea plantation and factory in Nuwara Eliya",
      "Stroll through the Royal Botanical Gardens in Peradeniya",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo",
        description:
          "Welcome at Bandaranaike International Airport. Your private chauffeur will transfer you to your hotel in Colombo. In the afternoon, enjoy a leisurely city tour of Colombo covering the Gangaramaya Temple, Independence Square, and the vibrant Pettah Market. End the evening with dinner at the historic Grand Oriental Hotel overlooking the harbor.",
        highlights: [
          "Airport pickup with welcome drink",
          "Gangaramaya Temple visit",
          "Pettah Market walking tour",
        ],
      },
      {
        day: 2,
        title: "Colombo to Sigiriya",
        description:
          "Depart early for the Cultural Triangle. En route, stop at the Pinnawala Elephant Orphanage to watch elephants bathe in the Maha Oya river. Arrive in Sigiriya by afternoon and visit the Sigiriya Museum for context before an evening walk around the water gardens at the base of the rock fortress.",
        highlights: [
          "Pinnawala Elephant Orphanage",
          "Sigiriya Museum",
          "Water garden sunset walk",
        ],
      },
      {
        day: 3,
        title: "Sigiriya Rock & Dambulla Caves",
        description:
          "Begin at dawn with the climb up Sigiriya \u2014 the legendary Lion Rock fortress built by King Kashyapa in the 5th century. Marvel at the ancient frescoes of the Sigiriya Maidens and the Mirror Wall. After descending, drive to the Dambulla Cave Temple, a UNESCO World Heritage Site featuring five cave shrines adorned with 150+ Buddha statues and intricate ceiling paintings dating back over 2,000 years.",
        highlights: [
          "Sigiriya Rock summit at sunrise",
          "Sigiriya frescoes and Mirror Wall",
          "Dambulla Cave Temple \u2014 5 sacred caves",
        ],
      },
      {
        day: 4,
        title: "Polonnaruwa & Transfer to Kandy",
        description:
          "Morning visit to the ancient city of Polonnaruwa, the medieval capital of Sri Lanka. Explore the Royal Palace ruins, the Gal Vihara rock-carved Buddha statues, and the Parakrama Samudra reservoir. After lunch, drive through the scenic countryside to Kandy, arriving by late afternoon. Evening at leisure along Kandy Lake.",
        highlights: [
          "Polonnaruwa ancient city ruins",
          "Gal Vihara rock-carved Buddhas",
          "Scenic drive through hill country",
        ],
      },
      {
        day: 5,
        title: "Kandy Heritage Day",
        description:
          "Begin with a morning visit to the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), Sri Lanka\u2019s most important Buddhist shrine. Continue to the Royal Botanical Gardens in Peradeniya, home to over 4,000 species of plants. After lunch, visit a traditional Kandyan arts and crafts center. In the evening, attend an authentic Kandyan cultural dance performance.",
        highlights: [
          "Temple of the Sacred Tooth Relic",
          "Royal Botanical Gardens Peradeniya",
          "Kandyan dance performance",
        ],
      },
      {
        day: 6,
        title: "Kandy to Nuwara Eliya",
        description:
          "Drive through winding mountain roads lined with tea plantations to reach Nuwara Eliya, known as \u2018Little England\u2019 for its colonial architecture. Visit a working tea factory to learn the art of Ceylon tea production, from plucking to processing. Enjoy a guided tea tasting session. Afternoon free to explore the charming town, Victoria Park, and Gregory Lake.",
        highlights: [
          "Scenic mountain drive through tea estates",
          "Tea factory tour and tasting",
          "Victoria Park and Gregory Lake",
        ],
      },
      {
        day: 7,
        title: "Nuwara Eliya to Colombo & Departure",
        description:
          "After a leisurely breakfast, visit the Hakgala Botanical Gardens and the Seetha Amman Temple. Drive back to Colombo via the Kitulgala area, famous for white-water rafting and the location where The Bridge on the River Kwai was filmed. Transfer to the airport for your departure flight.",
        highlights: [
          "Hakgala Botanical Gardens",
          "Seetha Amman Temple",
          "Airport transfer",
        ],
      },
    ],
    included: [
      "6 nights\u2019 accommodation in 3\u20134 star hotels",
      "Daily breakfast, 3 lunches, 2 dinners",
      "Private air-conditioned vehicle with chauffeur",
      "English-speaking licensed national guide",
      "All entrance fees to listed sites",
      "Kandyan dance show tickets",
      "Tea factory tour and tasting",
      "Airport pickup and drop-off",
      "Bottled water throughout the tour",
      "All applicable taxes and service charges",
    ],
    notIncluded: [
      "International flights",
      "Sri Lanka visa (ETA \u2014 available online)",
      "Travel insurance",
      "Meals not listed in the itinerary",
      "Personal expenses and tips",
      "Camera permits at heritage sites",
      "Optional activities (hot air balloon, village safari)",
    ],
    faqs: [
      {
        question: "How strenuous is the Sigiriya climb?",
        answer:
          "The climb involves approximately 1,200 steps and takes 60\u201390 minutes. It is moderate in difficulty. We recommend starting early in the morning to avoid midday heat. Handrails are provided along most of the route. Those with vertigo should note there are open sections near the summit.",
      },
      {
        question: "What is the best time of year for this tour?",
        answer:
          "The Cultural Triangle region is best visited from January to April and again from August to September, when rainfall is minimal. However, the tour operates year-round, and even in the wet season, morning hours are typically dry.",
      },
      {
        question: "Can this tour be customized?",
        answer:
          "Absolutely. We can add extra days in any location, upgrade accommodations to 5-star properties, include hot air balloon rides over Sigiriya, or add a village safari experience. Contact us with your preferences and we will tailor the itinerary.",
      },
      {
        question: "Is this tour suitable for families with children?",
        answer:
          "Yes, the tour is family-friendly. We can adjust the pace for younger travelers, add child-friendly activities like elephant encounters, and arrange connecting rooms at all hotels. Children under 5 travel free.",
      },
    ],
  },

  {
    slug: "south-coast-paradise",
    title: "South Coast Paradise",
    subtitle: "Galle \u2192 Unawatuna \u2192 Mirissa \u2192 Tangalle",
    description:
      "Discover Sri Lanka\u2019s stunning southern coastline \u2014 colonial Galle Fort, turquoise bays, whale watching, and serene golden-sand beaches.",
    longDescription:
      "Five sun-drenched days along Sri Lanka\u2019s southern seaboard, from the UNESCO-listed ramparts of Galle Fort to the untouched shores of Tangalle. Swim in the sheltered cove of Unawatuna, watch blue whales breach off Mirissa, and unwind on beaches that rival the Maldives \u2014 at a fraction of the cost. This is the perfect blend of cultural richness and tropical relaxation.",
    category: "Beach",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    price: "From $350",
    priceNote: "per person, twin sharing",
    difficulty: "Easy",
    groupSize: "2\u201310 guests",
    heroImage: "/images/galle.jpg",
    heroAlt:
      "Galle Fort lighthouse with palm trees on the southern coast of Sri Lanka",
    galleryImages: [
      {
        src: "/images/beach-cta.jpg",
        alt: "Pristine tropical beach on Sri Lanka\u2019s south coast",
      },
      {
        src: "/images/galle.jpg",
        alt: "Galle Fort lighthouse at golden hour",
      },
      {
        src: "/images/yala.jpg",
        alt: "Scenic coastal landscape",
      },
      {
        src: "/images/sigiriya.jpg",
        alt: "Lush green Sri Lankan landscape",
      },
    ],
    highlights: [
      "Walk the 400-year-old ramparts of Galle Fort at sunset",
      "Snorkel in the coral reefs of Unawatuna Bay",
      "Blue whale and dolphin watching in Mirissa (seasonal)",
      "Visit a traditional stilt fisherman demonstration",
      "Relax on the pristine beaches of Tangalle",
      "Sample fresh seafood at beachside restaurants",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Galle",
        description:
          "Transfer from Colombo airport to Galle (approximately 2.5 hours via the Southern Expressway). Check in to your boutique hotel within Galle Fort. Spend the afternoon exploring the cobblestone streets of this UNESCO World Heritage Site \u2014 visit the Dutch Reformed Church, the Maritime Museum, and the iconic lighthouse. End the day with sunset drinks on the ramparts overlooking the Indian Ocean.",
        highlights: [
          "Galle Fort walking tour",
          "Dutch Reformed Church",
          "Sunset on the ramparts",
        ],
      },
      {
        day: 2,
        title: "Unawatuna Beach Day",
        description:
          "Short drive to Unawatuna, one of Sri Lanka\u2019s most beautiful beaches. Spend the morning snorkeling in the sheltered bay, exploring the Japanese Peace Pagoda on the hilltop, and visiting the Yatagala Raja Maha Viharaya temple hidden among the rocks. Afternoon at leisure on the beach with optional surfing lessons.",
        highlights: [
          "Unawatuna Bay snorkeling",
          "Japanese Peace Pagoda",
          "Yatagala Raja Maha Viharaya",
        ],
      },
      {
        day: 3,
        title: "Mirissa \u2014 Whale Watching",
        description:
          "Early morning departure for a whale watching excursion off Mirissa (seasonal: November\u2013April). Sri Lanka\u2019s southern waters are home to blue whales, sperm whales, and spinner dolphins. Return to shore for a late breakfast, then explore Mirissa\u2019s coconut-lined beach. Visit the secret Parrot Rock viewpoint for Instagram-worthy panoramas. Evening: beachside dinner with fresh-caught seafood.",
        highlights: [
          "Blue whale watching excursion",
          "Parrot Rock viewpoint",
          "Fresh seafood dinner on the beach",
        ],
      },
      {
        day: 4,
        title: "Tangalle Retreat",
        description:
          "Drive east to Tangalle, passing through the traditional stilt fishing village of Koggala. Arrive at your beachside resort and spend the day at complete leisure \u2014 swim in the warm Indian Ocean, book an Ayurvedic spa treatment, or take a boat ride through the Rekawa Lagoon. At night, join a guided turtle watching experience on Rekawa Beach, where five species of sea turtles nest.",
        highlights: [
          "Stilt fisherman village visit",
          "Ayurvedic spa treatment (optional)",
          "Sea turtle watching at Rekawa Beach",
        ],
      },
      {
        day: 5,
        title: "Tangalle to Colombo & Departure",
        description:
          "After a relaxed breakfast, visit the Mulkirigala Rock Temple \u2014 a lesser-known gem with cave paintings rivaling Dambulla. Drive back to Colombo via the Southern Expressway. Drop at the airport or your Colombo hotel.",
        highlights: [
          "Mulkirigala Rock Temple",
          "Scenic coastal drive",
          "Airport transfer",
        ],
      },
    ],
    included: [
      "4 nights\u2019 accommodation in boutique beach hotels",
      "Daily breakfast, 2 lunches, 1 dinner",
      "Private air-conditioned vehicle with chauffeur",
      "Whale watching boat excursion (seasonal)",
      "Snorkeling equipment at Unawatuna",
      "All entrance fees to listed sites",
      "Airport pickup and drop-off",
      "Bottled water throughout the tour",
    ],
    notIncluded: [
      "International flights",
      "Sri Lanka visa (ETA)",
      "Travel insurance",
      "Meals not listed in the itinerary",
      "Surfing lessons and board hire",
      "Ayurvedic spa treatments",
      "Personal expenses and tips",
    ],
    faqs: [
      {
        question: "When is the best time for whale watching in Mirissa?",
        answer:
          "The whale watching season runs from November to April, with peak sightings in February and March. Outside this season, we substitute the whale watching with a snorkeling and boat tour of Weligama Bay.",
      },
      {
        question: "Are the beaches safe for swimming?",
        answer:
          "Unawatuna and Mirissa have sheltered bays that are generally safe for swimming year-round. Tangalle has stronger currents \u2014 we recommend swimming in front of your hotel where lifeguards are present. Your guide will advise on conditions each day.",
      },
      {
        question: "Can I extend the stay in Tangalle?",
        answer:
          "Yes, many guests add 1\u20132 extra nights in Tangalle for deeper relaxation. We can arrange extended stays at the same resort or upgrade to a luxury villa with a private pool.",
      },
    ],
  },

  {
    slug: "wildlife-safari-adventure",
    title: "Wildlife Safari Adventure",
    subtitle: "Yala \u2192 Udawalawe \u2192 Sinharaja",
    description:
      "Track leopards in Yala, watch elephant herds at Udawalawe, and explore the biodiversity of Sinharaja rainforest \u2014 Sri Lanka\u2019s premier wildlife experience.",
    longDescription:
      "Four action-packed days for nature enthusiasts and wildlife photographers. Sri Lanka packs an extraordinary density of wildlife into a compact island. This tour covers the country\u2019s three most important wildlife zones: Yala National Park (home to the world\u2019s highest leopard density), Udawalawe National Park (wild elephant herds), and the Sinharaja Forest Reserve (a UNESCO World Heritage rainforest with exceptional endemic bird species).",
    category: "Wildlife",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: "From $320",
    priceNote: "per person, twin sharing",
    difficulty: "Moderate",
    groupSize: "2\u20138 guests",
    heroImage: "/images/yala.jpg",
    heroAlt:
      "Scenic lake in Yala National Park Sri Lanka with dramatic cloudy sky",
    galleryImages: [
      {
        src: "/images/yala.jpg",
        alt: "Yala National Park lakeside landscape",
      },
      {
        src: "/images/sigiriya.jpg",
        alt: "Lush Sri Lankan wilderness",
      },
      {
        src: "/images/ella.jpg",
        alt: "Green hill country landscape",
      },
      {
        src: "/images/beach-cta.jpg",
        alt: "Tropical Sri Lanka scenery",
      },
    ],
    highlights: [
      "Early morning leopard-tracking safari in Yala National Park",
      "Spot wild elephants, crocodiles, and water buffalo at Udawalawe",
      "Guided rainforest trek through Sinharaja with endemic bird spotting",
      "Visit the Udawalawe Elephant Transit Home for orphaned calves",
      "Professional wildlife photography opportunities",
      "Sunset safari drive through dry-zone wilderness",
    ],
    itinerary: [
      {
        day: 1,
        title: "Transfer to Yala & Afternoon Safari",
        description:
          "Depart from Colombo early morning and drive to Yala National Park (approximately 5 hours). Check in to your safari lodge near the park entrance. After lunch, embark on an afternoon jeep safari into Block 1 of Yala \u2014 the most wildlife-rich zone. Look for Sri Lankan leopards, sloth bears, spotted deer, wild boar, and a dazzling array of birdlife including peacocks and painted storks.",
        highlights: [
          "Scenic drive through southern Sri Lanka",
          "Afternoon jeep safari in Yala Block 1",
          "Leopard and sloth bear spotting",
        ],
      },
      {
        day: 2,
        title: "Yala Dawn Safari & Udawalawe",
        description:
          "Rise before dawn for the most rewarding safari experience \u2014 the first light hours are when leopards are most active. Spend 3\u20134 hours tracking wildlife with an expert tracker-guide. After breakfast, drive to Udawalawe National Park (1.5 hours). Visit the Elephant Transit Home, a rehabilitation center for orphaned baby elephants, and watch the feeding session. Check in to your lodge near the park.",
        highlights: [
          "Dawn leopard-tracking safari",
          "Elephant Transit Home visit",
          "Transfer to Udawalawe",
        ],
      },
      {
        day: 3,
        title: "Udawalawe Safari & Sinharaja Rainforest",
        description:
          "Morning jeep safari in Udawalawe, where herds of 50\u2013100 wild elephants roam the dry-zone grasslands. Also spot crocodiles, water monitors, and hundreds of water birds at the reservoir. After lunch, drive to the edge of the Sinharaja Forest Reserve (2 hours). Enjoy a sunset nature walk through the buffer zone with an expert naturalist, listening for the calls of the Sri Lanka blue magpie.",
        highlights: [
          "Wild elephant herds at Udawalawe",
          "Sinharaja Forest Reserve approach",
          "Sunset nature walk with naturalist",
        ],
      },
      {
        day: 4,
        title: "Sinharaja Rainforest Trek & Departure",
        description:
          "Early morning guided trek into the heart of Sinharaja, a UNESCO World Heritage rainforest and one of the last remaining primary tropical rainforests in the world. Spot endemic species including the red-faced malkoha, Sri Lanka blue magpie, green-billed coucal, and the elusive purple-faced langur. After the trek, drive back to Colombo or the airport (approximately 4 hours).",
        highlights: [
          "Guided rainforest biodiversity trek",
          "Endemic bird species spotting",
          "Return to Colombo / airport",
        ],
      },
    ],
    included: [
      "3 nights\u2019 accommodation in safari lodges",
      "Daily breakfast, 3 lunches, 2 dinners",
      "Private 4WD jeep safaris with expert tracker",
      "Licensed naturalist guide throughout",
      "All national park entrance fees",
      "Elephant Transit Home entrance",
      "Sinharaja Forest Reserve permits and guide fees",
      "Airport pickup and drop-off",
      "Bottled water and snacks on safaris",
    ],
    notIncluded: [
      "International flights",
      "Sri Lanka visa (ETA)",
      "Travel insurance",
      "Camera/video permits in national parks",
      "Personal expenses and tips",
      "Optional night safari drives",
      "Binoculars or photography equipment hire",
    ],
    faqs: [
      {
        question: "What are the chances of seeing a leopard?",
        answer:
          "Yala has the highest density of wild leopards in the world. On average, about 60\u201370% of safaris result in at least one leopard sighting. Dawn safaris significantly increase your chances. Our tracker-guides have years of experience and know the prime territories.",
      },
      {
        question: "What should I wear on the Sinharaja trek?",
        answer:
          "Wear long trousers, a lightweight long-sleeved shirt, and sturdy closed-toe shoes or hiking boots. The rainforest is humid and leeches are common \u2014 we provide leech socks. Bring insect repellent, a rain jacket, and a small daypack for water and camera gear.",
      },
      {
        question: "Is this tour suitable for older travelers?",
        answer:
          "The jeep safaris at Yala and Udawalawe are comfortable and accessible. The Sinharaja trek involves moderate walking on uneven terrain for 3\u20134 hours. We can shorten the trek or arrange a shorter buffer-zone walk for those who prefer a gentler experience.",
      },
    ],
  },

  {
    slug: "hill-country-rail-journey",
    title: "Hill Country Rail Journey",
    subtitle: "Kandy \u2192 Nuwara Eliya \u2192 Ella \u2192 Haputale",
    description:
      "Ride the world\u2019s most scenic railway through misty tea estates, cross the iconic Nine Arch Bridge, and hike to breathtaking highland viewpoints.",
    longDescription:
      "Five days traversing Sri Lanka\u2019s spectacular hill country by train, foot, and tuk-tuk. The Kandy-to-Ella railway is consistently ranked among the most beautiful train journeys on Earth. This tour lets you experience it fully, with stops at the colonial charm of Nuwara Eliya, the dramatic viewpoints of Ella, and the quiet majesty of Haputale. Tea plantations, waterfalls, and mountain panoramas await at every turn.",
    category: "Adventure",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    price: "From $370",
    priceNote: "per person, twin sharing",
    difficulty: "Moderate",
    groupSize: "2\u20138 guests",
    heroImage: "/images/ella.jpg",
    heroAlt:
      "Blue train crossing the Nine Arch Bridge in Ella surrounded by lush green jungle",
    galleryImages: [
      {
        src: "/images/ella.jpg",
        alt: "Nine Arch Bridge in Ella, Sri Lanka",
      },
      {
        src: "/images/sigiriya-hero.jpg",
        alt: "Lush green Sri Lankan highlands",
      },
      {
        src: "/images/galle.jpg",
        alt: "Coastal Sri Lanka scenery",
      },
      {
        src: "/images/yala.jpg",
        alt: "Scenic lakeside landscape",
      },
    ],
    highlights: [
      "Ride the Kandy-to-Ella train through tea country",
      "Walk across the iconic Nine Arch Bridge in Ella",
      "Hike to Little Adam\u2019s Peak for sunrise panoramas",
      "Tour a Ceylon tea plantation and factory in Nuwara Eliya",
      "Visit the stunning Ravana Falls and Diyaluma Falls",
      "Explore the Lipton\u2019s Seat viewpoint in Haputale",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kandy",
        description:
          "Arrive in Kandy by private transfer from Colombo. Visit the Temple of the Sacred Tooth Relic and stroll around Kandy Lake. In the afternoon, visit the Royal Botanical Gardens at Peradeniya and explore the orchid collection. Enjoy an evening Kandyan dance performance before dinner at a lakeside restaurant.",
        highlights: [
          "Temple of the Sacred Tooth Relic",
          "Royal Botanical Gardens",
          "Kandyan dance performance",
        ],
      },
      {
        day: 2,
        title: "Kandy to Nuwara Eliya by Train",
        description:
          "Board the scenic hill country train from Kandy to Nanu Oya station (3.5 hours). Watch as the landscape transforms from tropical lowlands to cool mountain tea estates. Your chauffeur meets you at Nanu Oya for the short drive to Nuwara Eliya. Afternoon visit to a tea plantation and factory for a guided tour and tasting. Free time to explore the town, visit the post office, and browse the local market.",
        highlights: [
          "Scenic train ride through tea country",
          "Tea plantation factory tour",
          "Nuwara Eliya town exploration",
        ],
      },
      {
        day: 3,
        title: "Nuwara Eliya to Ella",
        description:
          "Continue the rail journey from Nanu Oya to Ella (approximately 3 hours) \u2014 the most photographed stretch of railway in Sri Lanka. The train winds through tunnels, across bridges, and along cliff edges with jaw-dropping views of waterfalls and terraced hills. Arrive in Ella and settle into your guesthouse. Afternoon visit to the Nine Arch Bridge and Ella Spice Garden. Evening cooking class at a local family\u2019s home.",
        highlights: [
          "World-famous Nanu Oya to Ella train",
          "Nine Arch Bridge visit",
          "Sri Lankan cooking class",
        ],
      },
      {
        day: 4,
        title: "Ella Explorations & Haputale",
        description:
          "Pre-dawn hike to Little Adam\u2019s Peak (45 minutes) for a spectacular sunrise over the Ella Gap valley. Return for breakfast, then visit the Ravana Falls and the Ravana Ella Cave. After lunch, drive to Haputale (1 hour) and take a tuk-tuk to Lipton\u2019s Seat \u2014 a stunning hilltop viewpoint where Sir Thomas Lipton once surveyed his vast tea empire. Visit the Dambatenne Tea Factory on the way back.",
        highlights: [
          "Sunrise from Little Adam\u2019s Peak",
          "Ravana Falls",
          "Lipton\u2019s Seat panoramic viewpoint",
        ],
      },
      {
        day: 5,
        title: "Haputale to Colombo & Departure",
        description:
          "Morning visit to Diyaluma Falls, Sri Lanka\u2019s second highest waterfall (220 m), with optional natural rock pools for a swim. Drive back to Colombo through the scenic Ella-Wellawaya road and the Southern Expressway. Transfer to the airport for departure.",
        highlights: [
          "Diyaluma Falls and natural pools",
          "Scenic drive through highlands",
          "Airport transfer",
        ],
      },
    ],
    included: [
      "4 nights\u2019 accommodation in boutique hill country hotels",
      "Daily breakfast, 2 lunches, 1 dinner",
      "Reserved 1st-class train tickets (Kandy\u2013Nanu Oya\u2013Ella)",
      "Private vehicle with chauffeur for road transfers",
      "Tea factory tour and tasting",
      "Cooking class with local family",
      "All entrance fees to listed sites",
      "Airport pickup and drop-off",
    ],
    notIncluded: [
      "International flights",
      "Sri Lanka visa (ETA)",
      "Travel insurance",
      "Meals not listed in the itinerary",
      "Personal expenses and tips",
      "Optional tuk-tuk rides in Ella",
      "Alcoholic beverages",
    ],
    faqs: [
      {
        question: "How reliable are the trains in Sri Lanka?",
        answer:
          "Sri Lankan trains can experience delays of 30\u201360 minutes. We build buffer time into the itinerary and your chauffeur tracks the train\u2019s progress to meet you at the station. In rare cases of significant delay, we have a backup vehicle ready to cover the route by road.",
      },
      {
        question: "What class of train tickets do you book?",
        answer:
          "We book 1st-class reserved observation seats, which offer the best views, air conditioning, and guaranteed seating. These tickets sell out weeks in advance, so early booking is essential.",
      },
      {
        question: "How difficult are the hikes?",
        answer:
          "Little Adam\u2019s Peak is an easy 45-minute walk on a well-maintained trail. The Diyaluma Falls natural pools require a moderate 30-minute scramble over rocks. Neither requires technical fitness, but reasonable mobility is needed.",
      },
      {
        question: "What is the weather like in hill country?",
        answer:
          "Expect cool temperatures (10\u201320\u00b0C / 50\u201368\u00b0F) year-round, with misty mornings and occasional afternoon showers. Pack layers, a light rain jacket, and a warm fleece for early morning hikes. The coolest months are January and February.",
      },
    ],
  },

  {
    slug: "complete-sri-lanka",
    title: "Complete Sri Lanka",
    subtitle:
      "Colombo \u2192 Sigiriya \u2192 Kandy \u2192 Nuwara Eliya \u2192 Ella \u2192 Yala \u2192 Galle \u2192 Colombo",
    description:
      "The ultimate 10-day journey covering every facet of Sri Lanka \u2014 ancient cities, hill country railways, wildlife safaris, and golden beaches.",
    longDescription:
      "This comprehensive ten-day circuit is the definitive Sri Lanka experience. From the Cultural Triangle\u2019s ancient kingdoms and the misty tea plantations of the highlands to Yala\u2019s leopard-prowled wilderness and the colonial charm of Galle Fort, you will experience the full spectrum of what makes this island extraordinary. Every day brings a completely new landscape, culture, and adventure. This is for the traveler who wants to see it all.",
    category: "Comprehensive",
    duration: "10 Days / 9 Nights",
    durationDays: 10,
    price: "From $750",
    priceNote: "per person, twin sharing",
    difficulty: "Moderate",
    groupSize: "2\u201310 guests",
    heroImage: "/images/sigiriya-hero.jpg",
    heroAlt:
      "Panoramic view of Sigiriya rock fortress at sunrise, Sri Lanka",
    galleryImages: [
      {
        src: "/images/sigiriya.jpg",
        alt: "Sigiriya rock fortress from below",
      },
      {
        src: "/images/ella.jpg",
        alt: "Nine Arch Bridge in Ella",
      },
      {
        src: "/images/yala.jpg",
        alt: "Yala National Park lakeside",
      },
      {
        src: "/images/galle.jpg",
        alt: "Galle Fort lighthouse",
      },
      {
        src: "/images/beach-cta.jpg",
        alt: "Pristine southern coast beach",
      },
    ],
    highlights: [
      "Climb the legendary Sigiriya Rock Fortress",
      "Ride the Kandy-to-Ella scenic railway",
      "Morning leopard safari in Yala National Park",
      "Walk the ramparts of Galle Fort at sunset",
      "Tour a Ceylon tea plantation in Nuwara Eliya",
      "Visit the Temple of the Sacred Tooth in Kandy",
      "Whale watching in Mirissa (seasonal)",
      "Explore the Dambulla Cave Temples",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo",
        description:
          "Welcome at Bandaranaike International Airport. Private transfer to your Colombo hotel. Afternoon city tour covering the Gangaramaya Temple, Colombo National Museum, Independence Square, and a sunset stroll along Galle Face Green. Welcome dinner at Ministry of Crab, one of Asia\u2019s top restaurants.",
        highlights: [
          "Airport welcome and transfer",
          "Colombo city tour",
          "Welcome dinner at Ministry of Crab",
        ],
      },
      {
        day: 2,
        title: "Colombo to Sigiriya",
        description:
          "Drive to the Cultural Triangle region. En route, stop at the Dambulla Cave Temple to explore the five caves with their spectacular murals and 150+ Buddha statues. Continue to Sigiriya and check in to your hotel with views of the rock fortress. Evening village safari by bullock cart through Sigiriya\u2019s paddy fields and rural hamlets.",
        highlights: [
          "Dambulla Cave Temples",
          "Sigiriya village safari",
          "Views of Lion Rock at sunset",
        ],
      },
      {
        day: 3,
        title: "Sigiriya & Polonnaruwa",
        description:
          "Sunrise climb of Sigiriya Rock, the 5th-century sky palace of King Kashyapa. Marvel at the ancient frescoes, the Mirror Wall, and the lion\u2019s paw gateway. After descending, drive to Polonnaruwa to explore the medieval capital \u2014 the Gal Vihara rock-carved Buddhas, the Royal Palace, and the Parakrama Samudra reservoir.",
        highlights: [
          "Sigiriya Rock sunrise climb",
          "Polonnaruwa ancient city",
          "Gal Vihara Buddhas",
        ],
      },
      {
        day: 4,
        title: "Sigiriya to Kandy",
        description:
          "Morning visit to Minneriya or Kaudulla National Park for a jeep safari to see wild elephants at the seasonal gathering (The Gathering). Drive to Kandy through lush countryside. Afternoon visit to the Royal Botanical Gardens at Peradeniya. Evening Kandyan dance performance and Temple of the Tooth evening puja ceremony.",
        highlights: [
          "Elephant Gathering safari",
          "Royal Botanical Gardens",
          "Temple of the Tooth puja ceremony",
        ],
      },
      {
        day: 5,
        title: "Kandy to Nuwara Eliya by Train",
        description:
          "Board the scenic train to Nanu Oya through some of the most beautiful railway scenery in the world. Tea-carpeted hillsides, waterfalls, and misty valleys pass by your window. Visit a tea plantation and factory for a guided tour. Explore Nuwara Eliya \u2014 Victoria Park, Gregory Lake, and the charming colonial town center.",
        highlights: [
          "Scenic hill country train ride",
          "Tea factory tour and tasting",
          "Nuwara Eliya exploration",
        ],
      },
      {
        day: 6,
        title: "Nuwara Eliya to Ella",
        description:
          "Continue the train journey from Nanu Oya to Ella \u2014 the most iconic stretch. Arrive in Ella and visit the Nine Arch Bridge, hike to Little Adam\u2019s Peak for panoramic views, and enjoy a cooking class at a local home. Evening free to explore Ella\u2019s laid-back cafes and boutiques.",
        highlights: [
          "Iconic train ride to Ella",
          "Nine Arch Bridge",
          "Little Adam\u2019s Peak sunset hike",
        ],
      },
      {
        day: 7,
        title: "Ella to Yala",
        description:
          "Morning at Ravana Falls and the Ravana Ella Cave. Drive through the dramatic Ella Gap and descend to the dry lowlands, arriving at Yala National Park by afternoon. Check in to your safari camp. Afternoon jeep safari into Yala Block 1 \u2014 search for leopards, sloth bears, elephants, and crocodiles as the golden-hour light sets over the wilderness.",
        highlights: [
          "Ravana Falls visit",
          "Scenic drive through Ella Gap",
          "Afternoon Yala safari",
        ],
      },
      {
        day: 8,
        title: "Yala Dawn Safari & Transfer to South Coast",
        description:
          "Pre-dawn safari for the best leopard-tracking opportunities. After breakfast, drive along the southern coast to Mirissa. Optional whale watching excursion (seasonal: November\u2013April). Afternoon at leisure on Mirissa Beach. Evening fresh seafood dinner.",
        highlights: [
          "Dawn leopard safari",
          "Whale watching (seasonal)",
          "Mirissa Beach relaxation",
        ],
      },
      {
        day: 9,
        title: "Galle Fort & South Coast",
        description:
          "Drive to Galle and spend the day exploring this UNESCO World Heritage fort city. Walk the 400-year-old Dutch ramparts, visit artisan boutiques, the Maritime Museum, and the iconic lighthouse. Afternoon free for shopping or relaxing on Unawatuna Beach nearby. Sunset drinks on the fort walls \u2014 one of the most memorable experiences in Sri Lanka.",
        highlights: [
          "Galle Fort heritage walk",
          "Rampart sunset experience",
          "Unawatuna Beach option",
        ],
      },
      {
        day: 10,
        title: "Galle to Colombo & Departure",
        description:
          "Leisurely morning in Galle with optional visit to a turtle hatchery. Drive back to Colombo via the Southern Expressway (2 hours). Time for last-minute shopping at Barefoot Gallery or Odel. Transfer to the airport for your departure flight.",
        highlights: [
          "Turtle hatchery visit (optional)",
          "Colombo shopping stop",
          "Airport transfer",
        ],
      },
    ],
    included: [
      "9 nights\u2019 accommodation in handpicked 3\u20134 star hotels",
      "Daily breakfast, 5 lunches, 3 dinners including welcome dinner",
      "Private air-conditioned vehicle with chauffeur throughout",
      "English-speaking licensed national guide",
      "Reserved 1st-class train tickets (Kandy\u2013Ella, two segments)",
      "2 jeep safaris (Minneriya/Kaudulla + Yala, 2 sessions)",
      "Whale watching excursion (seasonal)",
      "Tea factory tour and tasting",
      "Cooking class in Ella",
      "All entrance fees to listed sites and national parks",
      "Kandyan dance show tickets",
      "Airport pickup and drop-off",
      "Bottled water throughout the tour",
      "All applicable taxes and service charges",
    ],
    notIncluded: [
      "International flights",
      "Sri Lanka visa (ETA \u2014 available online)",
      "Travel insurance",
      "Meals not listed in the itinerary",
      "Personal expenses, souvenirs, and tips",
      "Camera/video permits at heritage sites and national parks",
      "Optional activities (hot air balloon, surfing, spa treatments)",
      "Alcoholic beverages",
    ],
    faqs: [
      {
        question: "Can this tour be shortened or extended?",
        answer:
          "Yes. The most common modification is to extend by 2\u20133 days to add more beach time in Tangalle or Mirissa. We can also shorten the tour by combining the Ella and Yala segments. Contact us for a custom quote.",
      },
      {
        question: "What fitness level is required?",
        answer:
          "Moderate fitness is recommended. The Sigiriya climb (1,200 steps) and Little Adam\u2019s Peak hike (45 min) are the most demanding activities. Both are optional and alternatives can be arranged. The train journeys and safaris require no special fitness.",
      },
      {
        question: "Is the tour suitable for vegetarians?",
        answer:
          "Absolutely. Sri Lankan cuisine is exceptionally vegetarian-friendly, with a rich tradition of rice and curry dishes featuring locally grown vegetables, lentils, and coconut. We inform all restaurants in advance and can accommodate vegan, gluten-free, and other dietary requirements.",
      },
      {
        question: "What happens if the weather is bad?",
        answer:
          "Sri Lanka has two monsoon seasons affecting different parts of the island. This tour is designed to follow the dry zone. In the unlikely event of poor weather, we have backup activities and indoor alternatives for every day. Your guide will adjust the itinerary in real time for the best experience.",
      },
    ],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getRelatedTours(currentSlug: string, count = 3): Tour[] {
  const current = getTourBySlug(currentSlug);
  if (!current) return tours.slice(0, count);

  // Prefer same category, then different
  const sameCategory = tours.filter(
    (t) => t.slug !== currentSlug && t.category === current.category
  );
  const different = tours.filter(
    (t) => t.slug !== currentSlug && t.category !== current.category
  );

  return [...sameCategory, ...different].slice(0, count);
}
