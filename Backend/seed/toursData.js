const tours = [
  {
    id: 1,
    name: "Northern Adventure",
    description:
      "Explore the breathtaking beauty of northern Pakistan. Includes valleys, lakes, and mountain passes with stunning views of K2 and Nanga Parbat.",
    days: 5,
    price: 85000,
    route: [
      { placeId: 1 },  // Hunza Valley
      { placeId: 2 },  // Naran & Kaghan Valleys
      { placeId: 3 },  // Fairy Meadows
      { placeId: 5 },  // Skardu
      { placeId: 22 }, // Attabad Lake
    ],
  },
  {
    id: 2,
    name: "Cultural & Heritage Tour",
    description:
      "A journey into the rich culture and heritage of Pakistan. Visit historic forts, mosques, and UNESCO World Heritage Sites.",
    days: 4,
    price: 55000,
    route: [
      { placeId: 9 },  // Lahore Fort
      { placeId: 10 }, // Badshahi Mosque
      { placeId: 15 }, // Ranikot Fort
      { placeId: 21 }, // Derawar Fort
      { placeId: 26 }, // Makli Necropolis
    ],
  },
  {
    id: 3,
    name: "Nature & Lakes Tour",
    description:
      "Experience the serenity of Pakistan's alpine lakes and meadows. Perfect for nature lovers, photographers, and families seeking peaceful retreats.",
    days: 3,
    price: 42000,
    route: [
      { placeId: 12 }, // Ratti Gali Lake
      { placeId: 16 }, // Rama Lake
      { placeId: 25 }, // Hanna Lake
    ],
  },
];

export default tours;
