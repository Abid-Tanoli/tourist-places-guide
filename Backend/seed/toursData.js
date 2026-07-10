const tours = [
  {
    id: 1,
    name: "Northern Adventure",
    description:
      "Explore the breathtaking beauty of northern Pakistan. Includes valleys, lakes, and mountain passes with stunning views of K2 and Nanga Parbat.",
    shortDescription: "A 5-day journey through the majestic northern landscapes of Pakistan",
    days: 5,
    price: 85000,
    discount: 15,
    included: [
      "Hotel accommodation (4-star)",
      "Transportation (air-conditioned vehicle)",
      "Professional tour guide",
      "Meals (breakfast & dinner)",
      "All entrance fees",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 1 },  // Hunza Valley
      { placeId: 22 }, // Attabad Lake
      { placeId: 11 }, // Karimabad
      { placeId: 5 },  // Skardu
      { placeId: 3 },  // Fairy Meadows
    ],
    capacity: 20,
    availableSeats: 15,
    featured: true,
    location: "Northern Pakistan",
  },
  {
    id: 2,
    name: "Cultural & Heritage Tour",
    description:
      "A journey into the rich culture and heritage of Pakistan. Visit historic forts, mosques, and UNESCO World Heritage Sites across Punjab and Sindh.",
    shortDescription: "Discover Pakistan's rich cultural heritage through its historic landmarks",
    days: 4,
    price: 55000,
    discount: 10,
    included: [
      "Hotel accommodation (3-star)",
      "Transportation (air-conditioned vehicle)",
      "Expert heritage guide",
      "Meals (breakfast & dinner)",
      "Monument entry tickets",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 9 },  // Lahore Fort
      { placeId: 10 }, // Badshahi Mosque
      { placeId: 14 }, // Khewra Salt Mine
      { placeId: 21 }, // Derawar Fort
      { placeId: 26 }, // Makli Necropolis
    ],
    capacity: 25,
    availableSeats: 20,
    featured: true,
    location: "Punjab & Sindh",
  },
  {
    id: 3,
    name: "Nature & Lakes Tour",
    description:
      "Experience the serenity of Pakistan's alpine lakes and meadows. Perfect for nature lovers, photographers, and families seeking peaceful retreats.",
    shortDescription: "A tranquil escape to Pakistan's most beautiful lakes and meadows",
    days: 3,
    price: 42000,
    included: [
      "Hotel accommodation",
      "Transportation",
      "Tour guide",
      "Meals (breakfast & dinner)",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 12 }, // Ratti Gali Lake
      { placeId: 47 }, // Banjosa Lake
      { placeId: 16 }, // Rama Lake
    ],
    capacity: 15,
    availableSeats: 12,
    featured: false,
    location: "Azad Kashmir & GB",
  },
  {
    id: 4,
    name: "Swat & Kalam Valley Explorer",
    description:
      "Discover the Switzerland of Pakistan. Travel through lush green valleys, visit crystal-clear rivers, and experience the warm hospitality of Swat Valley.",
    shortDescription: "Experience the lush beauty of Swat and Kalam valleys in 4 days",
    days: 4,
    price: 48000,
    discount: 10,
    included: [
      "Hotel accommodation (3-star)",
      "Transportation (4x4 vehicle)",
      "Local guide",
      "Meals (breakfast & dinner)",
      "River rafting activity",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 7 },  // Swat Valley
      { placeId: 29 }, // Malam Jabba
      { placeId: 34 }, // Patrind Waterfall
      { placeId: 28 }, // Khanpur Dam
    ],
    capacity: 18,
    availableSeats: 14,
    featured: true,
    location: "Khyber Pakhtunkhwa",
  },
  {
    id: 5,
    name: "Kashmir & Neelum Valley Retreat",
    description:
      "Paradise on earth awaits. Explore the pristine beauty of Neelum Valley with its waterfalls, meadows, and rivers. A perfect romantic getaway.",
    shortDescription: "A 5-day retreat into the pristine beauty of Neelum Valley",
    days: 5,
    price: 65000,
    included: [
      "Hotel accommodation (resort)",
      "Transportation (SUV)",
      "Experienced guide",
      "All meals included",
      "Boat ride on Neelum River",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 4 },  // Neelum Valley
      { placeId: 43 }, // Kundal Shahi
      { placeId: 46 }, // Neelam River
      { placeId: 50 }, // Ratti Gali Meadows
      { placeId: 12 }, // Ratti Gali Lake
    ],
    capacity: 15,
    availableSeats: 10,
    featured: false,
    location: "Azad Kashmir",
  },
  {
    id: 6,
    name: "Cholistan Desert Safari",
    description:
      "Embark on an adventurous desert safari through the Cholistan Desert. Visit the magnificent Derawar Fort and experience traditional desert life.",
    shortDescription: "An adventurous 3-day safari through Pakistan's largest desert",
    days: 3,
    price: 35000,
    included: [
      "Desert camp accommodation",
      "4x4 safari vehicle",
      "Desert guide",
      "Meals (traditional cuisine)",
      "Camel ride experience",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 27 }, // Cholistan Desert
      { placeId: 21 }, // Derawar Fort
      { placeId: 45 }, // Rohi Fort
    ],
    capacity: 20,
    availableSeats: 18,
    discount: 20,
    featured: false,
    location: "Punjab",
  },
  {
    id: 7,
    name: "Karakoram Highway Road Trip",
    description:
      "Drive along the legendary Karakoram Highway, one of the highest paved roads in the world. Pass through breathtaking gorges, suspension bridges, and remote villages.",
    shortDescription: "A legendary 7-day road trip along the world's highest highway",
    days: 7,
    price: 95000,
    included: [
      "Hotel & guesthouse accommodation",
      "4x4 vehicle with driver",
      "Experienced guide",
      "All meals",
      "Highway permits",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 6 },  // Murree
      { placeId: 2 },  // Naran & Kaghan Valleys
      { placeId: 1 },  // Hunza Valley
      { placeId: 11 }, // Karimabad
      { placeId: 22 }, // Attabad Lake
      { placeId: 5 },  // Skardu
    ],
    capacity: 12,
    availableSeats: 8,
    featured: true,
    location: "KPK to GB",
  },
  {
    id: 8,
    name: "Makran Coast & Balochistan Explorer",
    description:
      "Discover the untouched coastal beauty of Balochistan. From the pristine beaches of Kund Malir to the dramatic landscapes of Hingol National Park.",
    shortDescription: "Explore Pakistan's stunning coastline and desert landscapes in 4 days",
    days: 4,
    price: 52000,
    included: [
      "Hotel accommodation",
      "4x4 vehicle",
      "Local guide",
      "Meals (seafood specialties)",
      "Beach camping night",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 30 }, // Kund Malir Beach
      { placeId: 23 }, // Hingol National Park
      { placeId: 48 }, // Makran Beach
      { placeId: 17 }, // Makran Coastal Highway
    ],
    capacity: 12,
    availableSeats: 10,
    featured: false,
    location: "Balochistan",
  },
  {
    id: 9,
    name: "Karachi Coast & Sindh Heritage Weekend",
    description:
      "A compact coastal and heritage escape from Karachi, combining island activities, Makli history, and the rugged hill country of Sindh.",
    shortDescription: "A 3-day Karachi coast and Sindh heritage getaway",
    days: 3,
    price: 32000,
    discount: 10,
    included: [
      "Hotel accommodation (3-star)",
      "Air-conditioned transport from Karachi",
      "Local heritage guide",
      "Breakfast and one seafood dinner",
      "Boat transfer for island activity",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional water sports gear",
    ],
    route: [
      { placeId: 36, day: 1, order: 1, description: "Boat transfer and coastal activities around Churna Island." },
      { placeId: 26, day: 2, order: 1, description: "Guided walk through the UNESCO-listed Makli Necropolis." },
      { placeId: 31, day: 3, order: 1, description: "Scenic drive to Gorakh Hill for sunset views over Sindh." },
    ],
    capacity: 16,
    availableSeats: 12,
    featured: false,
    location: "Karachi & Sindh",
  },
  {
    id: 10,
    name: "Pakistan Grand Tour",
    description:
      "The ultimate Pakistan experience. A comprehensive 10-day journey covering the best of the north, cultural heartland, and coastal beauty of Pakistan.",
    shortDescription: "The complete Pakistan experience - 10 days of unforgettable adventure",
    days: 10,
    price: 145000,
    discount: 12,
    included: [
      "Premium hotel accommodation",
      "All transportation (flights + vehicles)",
      "Personal guide throughout",
      "All meals included",
      "All activities & entrance fees",
      "Airport transfers",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
      "Visa fees",
    ],
    route: [
      { placeId: 9 },  // Lahore Fort
      { placeId: 10 }, // Badshahi Mosque
      { placeId: 7 },  // Swat Valley
      { placeId: 1 },  // Hunza Valley
      { placeId: 22 }, // Attabad Lake
      { placeId: 5 },  // Skardu
      { placeId: 3 },  // Fairy Meadows
      { placeId: 4 },  // Neelum Valley
    ],
    capacity: 10,
    availableSeats: 6,
    featured: true,
    location: "All Pakistan",
  },
];

export default tours;
