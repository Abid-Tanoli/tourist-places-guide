const places = [
  {
    id: 1,
    name: "Hunza Valley",
    description:
      "A picturesque valley known for its stunning landscapes, including snow-capped peaks and lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.8,
    lat: 36.3167,
    lng: 74.65,
  },

  {
    id: 2,
    name: "Naran & Kaghan Valleys",
    description:
      "Famous for their serene lakes like Lake Saif-ul-Malook and lush green meadows. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.7,
    lat: 34.909,
    lng: 73.648,
  },

  {
    id: 3,
    name: "Fairy Meadows",
    description:
      "A high-altitude plateau offering breathtaking views of Nanga Parbat, the world's ninth-highest mountain. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to August",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    category: "Meadow",
    region: "Gilgit-Baltistan",
    rating: 4.9,
    lat: 35.0267,
    lng: 74.5036,
  },

  {
    id: 4,
    name: "Neelum Valley",
    description:
      "Known as the 'Blue Gem' of Pakistan, famous for its waterfalls and lush forests. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    category: "Valley",
    region: "Azad Kashmir",
    rating: 4.6,
    lat: 34.0,
    lng: 73.8,
  },

  {
    id: 5,
    name: "Skardu",
    description:
      "Gateway to some of the world's highest peaks, known for lakes, mountains, and trekking. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to September",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 35.3353,
    lng: 75.536,
  },

  {
    id: 6,
    name: "Murree",
    description:
      "Popular hill station close to Islamabad, famous for pine forests and pleasant weather. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to June",
    image: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&q=80",
    category: "Hill Station",
    region: "Punjab",
    rating: 4.3,
    lat: 33.9069,
    lng: 73.39,
  },

  {
    id: 7,
    name: "Swat Valley",
    description:
      "Often called the 'Switzerland of Pakistan', known for rivers, mountains, and lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to September",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.6,
    lat: 35.2117,
    lng: 72.4316,
  },

  {
    id: 8,
    name: "Chitral",
    description:
      "Home to the Kalash Valley, known for unique culture and beautiful landscapes. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.5,
    lat: 35.8514,
    lng: 71.7889,
  },

  {
    id: 9,
    name: "Lahore Fort",
    description:
      "A UNESCO World Heritage Site and iconic Mughal-era fortress in the heart of Lahore. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    category: "Fort",
    region: "Punjab",
    rating: 4.5,
    lat: 31.5881,
    lng: 74.3170,
  },

  {
    id: 10,
    name: "Badshahi Mosque",
    description:
      "One of the largest and most famous Mughal-era mosques, a masterpiece of Mughal architecture. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1570346355038-85b57a38e0a7?w=800&q=80",
    category: "Mosque",
    region: "Punjab",
    rating: 4.7,
    lat: 31.5870,
    lng: 74.3129,
  },

  {
    id: 11,
    name: "Karimabad",
    description:
      "The main town of Hunza Valley, known for its scenic beauty and historic forts. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 36.3267,
    lng: 74.6764,
  },

  {
    id: 12,
    name: "Ratti Gali Lake",
    description:
      "A stunning alpine lake accessible via a scenic trek in Neelum Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Azad Kashmir",
    rating: 4.6,
    lat: 34.75,
    lng: 74.55,
  },

  {
    id: 13,
    name: "Ziarat",
    description:
      "Known for the world's second-largest Juniper Forest and Quaid-e-Azam's residency. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
    category: "Forest",
    region: "Balochistan",
    rating: 4.2,
    lat: 30.38,
    lng: 66.75,
  },

  {
    id: 14,
    name: "Khewra Salt Mine",
    description:
      "One of the oldest and largest salt mines in the world, famous for its underground tunnels and mosques. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    category: "Mine",
    region: "Punjab",
    rating: 4.5,
    lat: 32.6569,
    lng: 73.0089,
  },

  {
    id: 15,
    name: "Ranikot Fort",
    description:
      "Known as the 'Great Wall of Sindh', the world's largest fort by area. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Sindh",
    rating: 4.1,
    lat: 27.9074,
    lng: 67.9069,
  },

  {
    id: 16,
    name: "Rama Lake",
    description:
      "A beautiful lake surrounded by pine forests in Astore Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Gilgit-Baltistan",
    rating: 4.4,
    lat: 35.3250,
    lng: 74.9500,
  },

  {
    id: 17,
    name: "Makran Coastal Highway",
    description:
      "A scenic highway along the Arabian Sea coast, offering breathtaking coastal views. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Highway",
    region: "Balochistan",
    rating: 4.3,
    lat: 25.1248,
    lng: 66.3145,
  },

  {
    id: 18,
    name: "Rupal Valley",
    description:
      "A stunning valley at the base of Nanga Parbat's Rupal Face. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.5,
    lat: 34.95,
    lng: 74.25,
  },

  {
    id: 19,
    name: "Shandur Pass",
    description:
      "Known as the 'Roof of the World', famous for the annual Shandur Polo Festival. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    category: "Pass",
    region: "Khyber Pakhtunkhwa",
    rating: 4.4,
    lat: 36.25,
    lng: 72.55,
  },

  {
    id: 20,
    name: "Astola Island",
    description:
      "An uninhabited island in the Arabian Sea, known for its unique geological formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Island",
    region: "Balochistan",
    rating: 4.2,
    lat: 25.1064,
    lng: 65.5500,
  },

  {
    id: 21,
    name: "Derawar Fort",
    description:
      "A massive fortress in the Cholistan Desert with a distinctive square shape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    category: "Fort",
    region: "Punjab",
    rating: 4.3,
    lat: 28.95,
    lng: 71.33,
  },

  {
    id: 22,
    name: "Attabad Lake",
    description:
      "A stunning turquoise lake formed by a landslide in Hunza Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to October",
    image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800&q=80",
    category: "Lake",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 36.4367,
    lng: 74.8667,
  },

  {
    id: 23,
    name: "Hingol National Park",
    description:
      "Pakistan's largest national park, known for the Mud Volcanoes and Princess of Hope. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    category: "National Park",
    region: "Balochistan",
    rating: 4.1,
    lat: 25.55,
    lng: 65.75,
  },

  {
    id: 24,
    name: "Kalat Fort",
    description:
      "An historic fort with panoramic views of the surrounding desert landscape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Balochistan",
    rating: 4.0,
    lat: 29.03,
    lng: 66.58,
  },

  {
    id: 25,
    name: "Hanna Lake",
    description:
      "A beautiful lake near Quetta, surrounded by hills and picnic spots. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Balochistan",
    rating: 4.3,
    lat: 30.12,
    lng: 66.88,
  },

  {
    id: 26,
    name: "Makli Necropolis",
    description:
      "A UNESCO World Heritage Site, one of the largest necropolises in the world. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    category: "Historic Site",
    region: "Sindh",
    rating: 4.2,
    lat: 24.82,
    lng: 67.92,
  },

  {
    id: 27,
    name: "Cholistan Desert",
    description:
      "Pakistan's largest desert, known for its rich history and traditional culture. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Desert",
    region: "Punjab",
    rating: 4.0,
    lat: 28.85,
    lng: 71.55,
  },

  {
    id: 28,
    name: "Khanpur Dam",
    description:
      "A popular recreational spot with boating and water sports facilities. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Dam",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 33.75,
    lng: 71.55,
  },

  {
    id: 29,
    name: "Malam Jabba",
    description:
      "Pakistan's premier ski resort with modern facilities. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "December to March",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    category: "Ski Resort",
    region: "Khyber Pakhtunkhwa",
    rating: 4.4,
    lat: 34.82,
    lng: 72.47,
  },

  {
    id: 30,
    name: "Kund Malir Beach",
    description:
      "A pristine beach along the Makran Coast with crystal clear waters. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.5,
    lat: 25.35,
    lng: 65.88,
  },

  {
    id: 31,
    name: "Gorakh Hill",
    description:
      "Pakistan's highest hill station in Sindh with cool weather and scenic views. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Hill Station",
    region: "Sindh",
    rating: 4.1,
    lat: 28.17,
    lng: 68.08,
  },

  {
    id: 32,
    name: "Ranikot Lake",
    description:
      "A scenic lake near Ranikot Fort with beautiful surroundings. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Sindh",
    rating: 4.0,
    lat: 27.85,
    lng: 67.95,
  },

  {
    id: 33,
    name: "Nooriabad Industrial Area",
    description:
      "An industrial hub near Hyderabad with modern infrastructure. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Industrial",
    region: "Sindh",
    rating: 3.8,
    lat: 25.42,
    lng: 68.28,
  },

  {
    id: 34,
    name: "Patrind Waterfall",
    description:
      "A beautiful waterfall in Kaghan Valley surrounded by lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Waterfall",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 34.92,
    lng: 73.48,
  },

  {
    id: 35,
    name: "Kalat Desert",
    description:
      "A unique desert landscape with stunning rock formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Desert",
    region: "Balochistan",
    rating: 3.9,
    lat: 29.08,
    lng: 66.62,
  },

  {
    id: 36,
    name: "Churna Island",
    description:
      "A small island near Karachi, popular for scuba diving and snorkeling. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Island",
    region: "Sindh",
    rating: 4.2,
    lat: 24.72,
    lng: 67.28,
  },

  {
    id: 37,
    name: "Khewra Valley",
    description:
      "A scenic valley near the Khewra Salt Mine with beautiful landscapes. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Punjab",
    rating: 4.1,
    lat: 32.62,
    lng: 73.00,
  },

  {
    id: 38,
    name: "Gawadar Port",
    description:
      "Pakistan's strategic deep-sea port with a stunning coastal landscape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Port",
    region: "Balochistan",
    rating: 4.0,
    lat: 25.12,
    lng: 62.33,
  },

  {
    id: 39,
    name: "Suleman Mountain Range",
    description:
      "A beautiful mountain range known for its unique rock formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Mountain Range",
    region: "Balochistan",
    rating: 4.2,
    lat: 30.50,
    lng: 68.50,
  },

  {
    id: 40,
    name: "Rashakai Dam",
    description:
      "A scenic dam with surrounding hills and picnic spots. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Dam",
    region: "Khyber Pakhtunkhwa",
    rating: 4.1,
    lat: 34.15,
    lng: 71.88,
  },

  {
    id: 41,
    name: "Margalla Hills National Park",
    description:
      "A popular hiking destination near Islamabad with diverse wildlife. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "September to November",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "National Park",
    region: "Islamabad Capital Territory",
    rating: 4.6,
    lat: 33.75,
    lng: 73.05,
  },

  {
    id: 42,
    name: "Ayubia National Park",
    description:
      "A protected forest area with chairlift rides and hiking trails. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "National Park",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 34.07,
    lng: 73.40,
  },

  {
    id: 43,
    name: "Kundal Shahi",
    description:
      "A picturesque area in Neelum Valley with lush green surroundings. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Azad Kashmir",
    rating: 4.3,
    lat: 34.65,
    lng: 73.85,
  },

  {
    id: 44,
    name: "Hingol River",
    description:
      "A beautiful river flowing through Hingol National Park. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "River",
    region: "Balochistan",
    rating: 4.0,
    lat: 25.50,
    lng: 65.70,
  },

  {
    id: 45,
    name: "Rohi Fort",
    description:
      "A historic fort with panoramic views of the surrounding desert. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Punjab",
    rating: 4.0,
    lat: 29.10,
    lng: 71.42,
  },

  {
    id: 46,
    name: "Neelam River",
    description:
      "A major river flowing through the scenic Neelum Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "River",
    region: "Azad Kashmir",
    rating: 4.5,
    lat: 34.50,
    lng: 73.90,
  },

  {
    id: 47,
    name: "Banjosa Lake",
    description:
      "A beautiful artificial lake surrounded by pine forests near Rawalakot. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Azad Kashmir",
    rating: 4.4,
    lat: 33.87,
    lng: 73.73,
  },

  {
    id: 48,
    name: "Makran Beach",
    description:
      "A beautiful beach with golden sands along the Arabian Sea. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.2,
    lat: 25.20,
    lng: 65.65,
  },

  {
    id: 49,
    name: "Gawadar Beach",
    description:
      "A stunning beach with crystal clear waters near Gawadar Port. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.3,
    lat: 25.10,
    lng: 62.35,
  },

  {
    id: 50,
    name: "Ratti Gali Meadows",
    description:
      "Beautiful alpine meadows near Ratti Gali Lake with wildflowers. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Meadow",
    region: "Azad Kashmir",
    rating: 4.5,
    lat: 34.76,
    lng: 74.56,
  },
];

export default places;
