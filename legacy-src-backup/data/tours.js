// src/data/tours.js

const tours = [
  {
    id: 1,
    name: "Northern Adventure",
    description:
      "Explore the breathtaking beauty of northern Pakistan. Includes valleys, lakes, and mountain passes.",
    days: 5,
    route: [
      { placeId: 1 }, // Hunza Valley
      { placeId: 2 }, // Fairy Meadows
      { placeId: 3 }, // Skardu
      { placeId: 4 }, // Khunjerab Pass
      { placeId: 5 }, // Attabad Lake
    ],
  },
  {
    id: 2,
    name: "Cultural & Heritage Tour",
    description:
      "A journey into the rich culture and heritage of Pakistan. Visit mosques, forts, and historic gardens.",
    days: 4,
    route: [
      { placeId: 10 }, // Badshahi Mosque
      { placeId: 11 }, // Lahore Fort
      { placeId: 12 }, // Shalimar Gardens
      { placeId: 13 }, // Faisal Mosque
      { placeId: 14 }, // Makli Necropolis
    ],
  },
  {
    id: 3,
    name: "Nature & Lakes Tour",
    description:
      "Experience the serenity of Pakistan’s lakes and meadows, perfect for nature lovers and families.",
    days: 3,
    route: [
      { placeId: 6 }, // Ratti Gali Lake
      { placeId: 7 }, // Hanna Lake
      { placeId: 8 }, // Ratti Gali Meadows
    ],
  },
];

export default tours;
