const tours = [
  {
    id: 1,
    name: "Northern Adventure",
    description:
      "Explore the breathtaking beauty of northern Pakistan. Includes valleys, lakes, and mountain passes with stunning views of K2 and Nanga Parbat.",
    shortDescription: "A 5-day journey through the majestic northern landscapes of Pakistan",
    days: 5,
    pakistaniPrice: 85000,
    foreignerPrice: 145000,
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
    pakistaniPrice: 55000,
    foreignerPrice: 90000,
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
    pakistaniPrice: 42000,
    foreignerPrice: 68000,
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
    pakistaniPrice: 48000,
    foreignerPrice: 78000,
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
    pakistaniPrice: 65000,
    foreignerPrice: 110000,
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
    pakistaniPrice: 35000,
    foreignerPrice: 58000,
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
    pakistaniPrice: 95000,
    foreignerPrice: 160000,
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
    pakistaniPrice: 52000,
    foreignerPrice: 85000,
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
    pakistaniPrice: 32000,
    foreignerPrice: 52000,
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
    pakistaniPrice: 145000,
    foreignerPrice: 240000,
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
  {
    id: 11,
    name: "Naran Valley Weekend Escape",
    description:
      "A quick weekend getaway to the stunning Naran Valley. Perfect for those short on time who want to experience the beauty of Kaghan Valley.",
    shortDescription: "A 2-day escape to the beautiful Naran Valley",
    days: 2,
    pakistaniPrice: 18000,
    foreignerPrice: 30000,
    included: [
      "Hotel accommodation",
      "Transportation (sedan)",
      "Guide",
      "Meals (breakfast & dinner)",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 2 },  // Naran & Kaghan Valleys
      { placeId: 28 }, // Khanpur Dam
    ],
    capacity: 20,
    availableSeats: 16,
    featured: false,
    location: "Khyber Pakhtunkhwa",
  },
  {
    id: 12,
    name: "Deosai Plains Safari",
    description:
      "Explore the 'Land of Giants' — the second-highest plateau in the world. Witness wildflowers, marmots, and untouched wilderness with Himalayan views.",
    shortDescription: "A 5-day adventure to the breathtaking Deosai Plains",
    days: 5,
    pakistaniPrice: 72000,
    foreignerPrice: 120000,
    included: [
      "Camping equipment",
      "4x4 vehicle with driver",
      "Experienced trekking guide",
      "All meals (camp cooking)",
      "Deosai National Park permits",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal trekking gear",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 5 },  // Skardu
      { placeId: 16 }, // Rama Lake
      { placeId: 3 },  // Fairy Meadows
    ],
    capacity: 12,
    availableSeats: 8,
    featured: false,
    location: "Gilgit-Baltistan",
  },
  {
    id: 13,
    name: "Lahore Food & Heritage Walk",
    description:
      "Taste your way through Lahore's legendary food street, explore Mughal-era architecture, and dive into centuries-old bazaars with a local expert.",
    shortDescription: "A 2-day culinary and cultural deep-dive into Lahore",
    days: 2,
    pakistaniPrice: 15000,
    foreignerPrice: 28000,
    included: [
      "Heritage hotel accommodation",
      "Walking tour guide",
      "Food tasting experiences (6+ dishes)",
      "Monument entry tickets",
      "Rickshaw ride through old Lahore",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 9, day: 1, order: 1, description: "Morning tour of Lahore Fort and Badshahi Mosque." },
      { placeId: 10, day: 1, order: 2, description: "Evening food walk through Gawalmandi and Food Street." },
      { placeId: 26, day: 2, order: 1, description: "Day trip to Harappa or Shalimar Gardens." },
    ],
    capacity: 15,
    availableSeats: 12,
    featured: false,
    location: "Punjab",
  },
  {
    id: 14,
    name: "Kalash Valley Cultural Immersion",
    description:
      "Live among the Kalash people — an ancient community with unique traditions, festivals, and polytheistic beliefs tucked into Chitral's mountains.",
    shortDescription: "A 4-day cultural immersion in the Kalash Valley",
    days: 4,
    pakistaniPrice: 55000,
    foreignerPrice: 90000,
    included: [
      "Guesthouse accommodation",
      "Transportation (4x4)",
      "Local Kalash guide",
      "Meals (traditional Kalash cuisine)",
      "Cultural session with Kalash elders",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 8 },  // Chitral
      { placeId: 19 }, // Shandur Pass
      { placeId: 7 },  // Swat Valley
    ],
    capacity: 10,
    availableSeats: 8,
    featured: false,
    location: "Khyber Pakhtunkhwa",
  },
  {
    id: 15,
    name: "Shandur Polo Festival Tour",
    description:
      "Attend the world's highest polo festival at Shandur Pass. Watch freestyle polo matches surrounded by stunning mountain scenery.",
    shortDescription: "A 3-day trip to the legendary Shandur Polo Festival",
    days: 3,
    pakistaniPrice: 40000,
    foreignerPrice: 65000,
    included: [
      "Camping/guesthouse accommodation",
      "Transportation (4x4)",
      "Festival guide",
      "Meals",
      "Festival entry passes",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 19 }, // Shandur Pass
      { placeId: 8 },  // Chitral
      { placeId: 7 },  // Swat Valley
    ],
    capacity: 15,
    availableSeats: 10,
    featured: false,
    location: "KPK & GB",
  },
  {
    id: 16,
    name: "Hunza & Nagar Valley Explorer",
    description:
      "Go beyond the usual Hunza itinerary — explore Nagar Valley, Hoper Glacier, and the less-visited corners of this magical region.",
    shortDescription: "A 6-day deep exploration of Hunza and Nagar valleys",
    days: 6,
    pakistaniPrice: 78000,
    foreignerPrice: 130000,
    included: [
      "Hotel accommodation (3-4 star)",
      "4x4 vehicle",
      "Local guide",
      "All meals",
      "Glacier trek permit",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 1 },  // Hunza Valley
      { placeId: 11 }, // Karimabad
      { placeId: 22 }, // Attabad Lake
      { placeId: 5 },  // Skardu
    ],
    capacity: 14,
    availableSeats: 10,
    featured: false,
    location: "Gilgit-Baltistan",
  },
  {
    id: 17,
    name: "Skardu & Deosai Adventure",
    description:
      "The ultimate adventure package combining Skardu's lakes and forts with the remote wilderness of Deosai Plains.",
    shortDescription: "A 7-day adventure through Skardu and Deosai",
    days: 7,
    pakistaniPrice: 98000,
    foreignerPrice: 165000,
    included: [
      "Hotel & camping accommodation",
      "4x4 vehicle with driver",
      "Trekking guide",
      "All meals",
      "National park permits",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal trekking gear",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 5 },  // Skardu
      { placeId: 22 }, // Attabad Lake
      { placeId: 16 }, // Rama Lake
      { placeId: 3 },  // Fairy Meadows
    ],
    capacity: 10,
    availableSeats: 6,
    featured: true,
    location: "Gilgit-Baltistan",
  },
  {
    id: 18,
    name: "Murree & Ayubia Hill Station Break",
    description:
      "A relaxing hill station getaway with chairlift rides, pine forest walks, and cool mountain air — perfect for families.",
    shortDescription: "A 2-day family-friendly hill station escape",
    days: 2,
    pakistaniPrice: 16000,
    foreignerPrice: 28000,
    included: [
      "Hotel accommodation",
      "Transportation",
      "Chairlift ride",
      "Meals (breakfast & dinner)",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 6 },  // Murree
      { placeId: 42 }, // Ayubia National Park
    ],
    capacity: 25,
    availableSeats: 20,
    featured: false,
    location: "Punjab",
  },
  {
    id: 19,
    name: "Ziarat & Quetta Explorer",
    description:
      "Discover Balochistan's hidden gems — the ancient juniper forests of Ziarat, Quetta's bazaars, and the rugged beauty of the Sulaiman Range.",
    shortDescription: "A 4-day exploration of Quetta and Ziarat",
    days: 4,
    pakistaniPrice: 45000,
    foreignerPrice: 75000,
    included: [
      "Hotel accommodation",
      "Transportation (4x4)",
      "Local guide",
      "Meals",
      "Ziarat Residency visit",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 13 }, // Ziarat
      { placeId: 25 }, // Hanna Lake
      { placeId: 24 }, // Kalat Fort
    ],
    capacity: 12,
    availableSeats: 10,
    featured: false,
    location: "Balochistan",
  },
  {
    id: 20,
    name: "Gwadar & Coastal Balochistan",
    description:
      "Explore Pakistan's emerging coastal destination — pristine beaches, deep-sea fishing, and the strategic Gwadar Port.",
    shortDescription: "A 5-day coastal adventure to Gwadar",
    days: 5,
    pakistaniPrice: 68000,
    foreignerPrice: 115000,
    included: [
      "Hotel accommodation",
      "4x4 vehicle",
      "Boat trip",
      "Local guide",
      "Meals (seafood included)",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 38 }, // Gawadar Port
      { placeId: 49 }, // Gawadar Beach
      { placeId: 30 }, // Kund Malir Beach
      { placeId: 23 }, // Hingol National Park
    ],
    capacity: 10,
    availableSeats: 8,
    featured: false,
    location: "Balochistan",
  },
  {
    id: 21,
    name: "Pakistan Honeymoon Package",
    description:
      "A romantic journey through Pakistan's most beautiful destinations — from the lakes of Kashmir to the valleys of Hunza.",
    shortDescription: "An 8-day romantic getaway for couples",
    days: 8,
    pakistaniPrice: 120000,
    foreignerPrice: 200000,
    included: [
      "Premium resort accommodation",
      "Private vehicle with driver",
      "Personal guide",
      "All meals",
      "Romantic dinner setups",
      "Photography sessions",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 4 },  // Neelum Valley
      { placeId: 12 }, // Ratti Gali Lake
      { placeId: 1 },  // Hunza Valley
      { placeId: 22 }, // Attabad Lake
      { placeId: 5 },  // Skardu
    ],
    capacity: 8,
    availableSeats: 6,
    featured: true,
    location: "All Pakistan",
  },
  {
    id: 22,
    name: "Family-Friendly Northern Tour",
    description:
      "A carefully paced northern tour designed for families with children — easy walks, scenic drives, and comfortable accommodation.",
    shortDescription: "A 6-day family adventure in northern Pakistan",
    days: 6,
    pakistaniPrice: 82000,
    foreignerPrice: 135000,
    included: [
      "Family-friendly hotel accommodation",
      "Spacious vehicle",
      "Family guide",
      "All meals",
      "Activities suitable for children",
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
    ],
    capacity: 16,
    availableSeats: 12,
    featured: false,
    location: "Northern Pakistan",
  },
  {
    id: 23,
    name: "Trekking: Fairy Meadows Base Camp",
    description:
      "A challenging trek to the base camp of Nanga Parbat with overnight camping at the legendary Fairy Meadows.",
    shortDescription: "A 4-day trekking expedition to Fairy Meadows",
    days: 4,
    pakistaniPrice: 52000,
    foreignerPrice: 88000,
    included: [
      "Camping equipment",
      "Trekking guide & porters",
      "Meals (camp cooking)",
      "Trek permits",
      "4x4 transfer to trailhead",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal trekking gear",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 3 },  // Fairy Meadows
      { placeId: 18 }, // Rupal Valley
    ],
    capacity: 10,
    availableSeats: 6,
    featured: false,
    location: "Gilgit-Baltistan",
  },
  {
    id: 24,
    name: "Makran Coastal Road Trip",
    description:
      "Drive the spectacular Makran Coastal Highway — one of the world's most scenic coastal drives — from Karachi to Gwadar.",
    shortDescription: "A 5-day road trip along the Arabian Sea coast",
    days: 5,
    pakistaniPrice: 62000,
    foreignerPrice: 100000,
    included: [
      "Hotel & beach camp accommodation",
      "4x4 vehicle with driver",
      "Guide",
      "Meals",
      "Beach camping setup",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 30 }, // Kund Malir Beach
      { placeId: 17 }, // Makran Coastal Highway
      { placeId: 48 }, // Makran Beach
      { placeId: 38 }, // Gawadar Port
    ],
    capacity: 10,
    availableSeats: 8,
    featured: false,
    location: "Balochistan",
  },
  {
    id: 25,
    name: "Islamabad & Margalla Hills Weekend",
    description:
      "Explore Pakistan's capital city and hike the scenic trails of Margalla Hills National Park.",
    shortDescription: "A 2-day city break in Islamabad with hill hikes",
    days: 2,
    pakistaniPrice: 14000,
    foreignerPrice: 25000,
    included: [
      "Hotel accommodation",
      "Transportation",
      "Hiking guide",
      "Meals",
      "Monument entries",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 41 }, // Margalla Hills National Park
      { placeId: 42 }, // Ayubia National Park
    ],
    capacity: 20,
    availableSeats: 16,
    featured: false,
    location: "Islamabad",
  },
  {
    id: 26,
    name: "Sindh Desert Forts Trail",
    description:
      "Follow the ancient trail of Sindh's magnificent desert forts — from Ranikot to Mohenjo-daro to the necropolis of Makli.",
    shortDescription: "A 5-day heritage trail through Sindh's desert forts",
    days: 5,
    pakistaniPrice: 58000,
    foreignerPrice: 95000,
    included: [
      "Hotel accommodation",
      "Air-conditioned vehicle",
      "Heritage guide",
      "All meals",
      "Archaeological site entries",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 15 }, // Ranikot Fort
      { placeId: 32 }, // Ranikot Lake
      { placeId: 26 }, // Makli Necropolis
      { placeId: 31 }, // Gorakh Hill
    ],
    capacity: 12,
    availableSeats: 10,
    featured: false,
    location: "Sindh",
  },
  {
    id: 27,
    name: "Chitral & Kalash Valley Explorer",
    description:
      "Journey to the remote corners of Chitral — explore the Kalash valleys, attend local festivals, and witness the unique culture.",
    shortDescription: "A 6-day exploration of Chitral and Kalash valleys",
    days: 6,
    pakistaniPrice: 75000,
    foreignerPrice: 125000,
    included: [
      "Guesthouse & hotel accommodation",
      "4x4 vehicle",
      "Local guide",
      "All meals",
      "Cultural sessions",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 8 },  // Chitral
      { placeId: 19 }, // Shandur Pass
      { placeId: 7 },  // Swat Valley
      { placeId: 29 }, // Malam Jabba
    ],
    capacity: 10,
    availableSeats: 8,
    featured: false,
    location: "Khyber Pakhtunkhwa",
  },
  {
    id: 28,
    name: "Pakistan Photography Tour",
    description:
      "A specialized tour for photographers — timed golden-hour shoots, access to remote locations, and expert composition guidance.",
    shortDescription: "A 10-day photography expedition across Pakistan",
    days: 10,
    pakistaniPrice: 160000,
    foreignerPrice: 270000,
    included: [
      "Premium accommodation",
      "All transportation",
      "Photography guide",
      "All meals",
      "Permit fees for restricted areas",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Camera equipment",
      "Personal expenses",
      "Tips & gratuities",
    ],
    route: [
      { placeId: 9 },  // Lahore Fort
      { placeId: 10 }, // Badshahi Mosque
      { placeId: 7 },  // Swat Valley
      { placeId: 1 },  // Hunza Valley
      { placeId: 22 }, // Attabad Lake
      { placeId: 5 },  // Skardu
      { placeId: 3 },  // Fairy Meadows
    ],
    capacity: 8,
    availableSeats: 5,
    featured: true,
    location: "All Pakistan",
  },
];

export default tours;
