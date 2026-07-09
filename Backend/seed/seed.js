import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "../config/db.js";
import Booking from "../models/Booking.js";
import Category from "../models/Category.js";
import Feedback from "../models/Feedback.js";
import Place from "../models/Place.js";
import Region from "../models/Region.js";
import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import User from "../models/User.js";
import places from "./placesData.js";
import tours from "./toursData.js";
import { categories, regions } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const tourPrices = {
  1: 85000,
  2: 65000,
  3: 45000,
};

const importData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Tour.deleteMany(),
      Place.deleteMany(),
      User.deleteMany(),
      Category.deleteMany(),
      Region.deleteMany(),
      Booking.deleteMany(),
      Feedback.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log("Cleared existing data.");

    // Create admin user
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    // Create test user
    await User.create({
      name: "Test User",
      email: "user@example.com",
      password: "user123",
      role: "user",
    });

    console.log("Users created.");

    // Create categories
    const insertedCategories = await Category.insertMany(
      categories.map((c) => ({
        ...c,
        status: "active",
      }))
    );
    const categoryIdMap = new Map(
      insertedCategories.map((c) => [c.name, c._id])
    );
    console.log(`${insertedCategories.length} categories created.`);

    // Create regions
    const insertedRegions = await Region.insertMany(
      regions.map((r) => ({
        ...r,
        status: "active",
      }))
    );
    const regionIdMap = new Map(
      insertedRegions.map((r) => [r.name, r._id])
    );
    console.log(`${insertedRegions.length} regions created.`);

    // Create places with new fields
    const insertedPlaces = await Place.insertMany(
      places.map((place) => ({
        legacyId: place.id,
        name: place.name,
        slug: toSlug(place.name),
        description: place.description,
        shortDescription: place.description
          ? place.description.substring(0, 150) + "..."
          : "",
        region: place.region,
        regionRef: regionIdMap.get(place.region),
        category: place.category,
        categoryRef: categoryIdMap.get(place.category),
        rating: place.rating,
        bestTime: place.bestTime || "",
        image: place.image,
        lat: place.lat,
        lng: place.lng,
        status: "published",
        featured: place.rating >= 4.7,
        address: "",
        facilities: [],
        entryFee: { pakistani: 0, foreigner: 0, currency: "PKR" },
        contactInfo: { phone: "", email: "", website: "" },
        seoFields: {
          title: `Visit ${place.name} - Tourist Places Guide`,
          description: `Discover ${place.name}. ${place.description || ""}`.substring(0, 160),
          keywords: [place.name, place.region, place.category, "Pakistan tourism"],
        },
      }))
    );

    console.log(`${insertedPlaces.length} places created.`);

    // Update category and region place counts
    for (const cat of insertedCategories) {
      const count = insertedPlaces.filter((p) => p.category === cat.name).length;
      await Category.findByIdAndUpdate(cat._id, { placeCount: count });
    }
    for (const reg of insertedRegions) {
      const count = insertedPlaces.filter((p) => p.region === reg.name).length;
      await Region.findByIdAndUpdate(reg._id, { placeCount: count });
    }

    const placeIdMap = new Map(
      insertedPlaces.map((place) => [place.legacyId, place._id])
    );

    // Create tours with new fields
    const tourDocs = tours.map((tour) => ({
      legacyId: tour.id,
      name: tour.name,
      slug: toSlug(tour.name),
      description: tour.description,
      shortDescription: tour.description
        ? tour.description.substring(0, 150) + "..."
        : "",
      days: tour.days,
      price: tour.price || tourPrices[tour.id] || tour.days * 15000,
      discount: 0,
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
      route: tour.route
        .map((stop, index) => ({
          place: placeIdMap.get(stop.placeId),
          day: stop.day || index + 1,
          order: stop.order || index + 1,
          description: "",
        }))
        .filter((stop) => stop.place),
      capacity: 20,
      availableSeats: 20,
      status: "published",
      featured: true,
      image: "",
      images: [],
      location: "Pakistan",
    }));

    await Tour.insertMany(tourDocs);
    console.log(`${tourDocs.length} tours created.`);

    // Create sample reviews
    const sampleReviews = insertedPlaces.slice(0, 5).map((place, index) => ({
      name: `Tourist ${index + 1}`,
      email: `tourist${index + 1}@example.com`,
      place: place._id,
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
      title: "Great experience!",
      comment: `Amazing place! ${place.name} is truly beautiful and worth visiting.`,
      status: "approved",
    }));

    await Review.insertMany(sampleReviews);
    console.log(`${sampleReviews.length} reviews created.`);

    console.log("\nSeed data imported successfully!");
    console.log("Admin credentials: admin@example.com / admin123");
    console.log("User credentials: user@example.com / user123");
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Promise.all([
      Tour.deleteMany(),
      Place.deleteMany(),
      User.deleteMany(),
      Category.deleteMany(),
      Region.deleteMany(),
      Booking.deleteMany(),
      Feedback.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log("All seed data destroyed successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Destroy failed: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
