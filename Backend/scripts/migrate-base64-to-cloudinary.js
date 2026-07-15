import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DRY_RUN = process.argv.includes("--dry-run");

const PLACEHOLDERS = {
  Place: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  Tour: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  Region: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  Category: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  User: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&q=80",
  Post: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  Review: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
};

const uploadBase64 = async (dataUri, folder, modelName) => {
  if (!dataUri || !dataUri.startsWith("data:image")) return null;

  // Try uploading the base64 directly first
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return result.secure_url;
  } catch (err) {
    console.log(`    Base64 corrupt (${err.message}), uploading placeholder from Unsplash...`);
  }

  // Fallback: download a placeholder from Unsplash and upload to Cloudinary
  const placeholder = PLACEHOLDERS[modelName] || PLACEHOLDERS.Place;
  try {
    const result = await cloudinary.uploader.upload(placeholder, {
      folder,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return result.secure_url;
  } catch (err2) {
    console.error(`  Placeholder upload also failed: ${err2.message}`);
    return null;
  }
};

const isBase64 = (val) => typeof val === "string" && val.startsWith("data:image");

const migrateModel = async (Model, name, fieldConfigs) => {
  const docs = await Model.find({});
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of docs) {
    let changed = false;

    for (const { field, type, folder } of fieldConfigs) {
      if (type === "string") {
        const val = doc[field];
        if (isBase64(val)) {
          console.log(`  [${name}] ${doc._id} → ${field}`);
          if (DRY_RUN) { migrated++; changed = true; continue; }
          const url = await uploadBase64(val, folder, name);
          if (url) { doc[field] = url; changed = true; migrated++; }
          else { failed++; }
        } else if (val && !val.startsWith("http") && !val.startsWith("data:")) {
          console.log(`  [${name}] ${doc._id} → ${field} (broken URL, replacing with placeholder)`);
          if (!DRY_RUN) { doc[field] = PLACEHOLDERS[name] || PLACEHOLDERS.Place; changed = true; }
        }
      } else if (type === "[string]") {
        const arr = doc[field];
        if (!Array.isArray(arr)) continue;
        let arrChanged = false;
        for (let i = 0; i < arr.length; i++) {
          if (isBase64(arr[i])) {
            console.log(`  [${name}] ${doc._id} → ${field}[${i}]`);
            if (DRY_RUN) { migrated++; arrChanged = true; continue; }
            const url = await uploadBase64(arr[i], folder, name);
            if (url) { arr[i] = url; arrChanged = true; migrated++; }
            else { failed++; }
          } else if (arr[i] && !arr[i].startsWith("http") && !arr[i].startsWith("data:")) {
            console.log(`  [${name}] ${doc._id} → ${field}[${i}] (broken, removing)`);
            arr.splice(i, 1); i--; arrChanged = true;
          }
        }
        if (arrChanged) changed = true;
      } else if (type === "gallery") {
        const arr = doc[field];
        if (!Array.isArray(arr)) continue;
        let arrChanged = false;
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (item && isBase64(item.url)) {
            console.log(`  [${name}] ${doc._id} → ${field}[${i}].url`);
            if (DRY_RUN) { migrated++; arrChanged = true; continue; }
            const url = await uploadBase64(item.url, folder, name);
            if (url) { item.url = url; arrChanged = true; migrated++; }
            else { failed++; }
          }
        }
        if (arrChanged) changed = true;
      }
    }

    if (changed && !DRY_RUN) {
      await doc.save({ validateModifiedOnly: true });
      skipped++; // using skipped as "saved" counter
    }
  }

  return { migrated, failed, saved: skipped };
};

async function main() {
  console.log(`\n🔧 Base64 → Cloudinary Migration${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("❌ CLOUDINARY_CLOUD_NAME not set in .env");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // Dynamically import models
  const { default: Place } = await import("../models/Place.js");
  const { default: Tour } = await import("../models/Tour.js");
  const { default: Region } = await import("../models/Region.js");
  const { default: Category } = await import("../models/Category.js");
  const { default: User } = await import("../models/User.js");
  const { default: Post } = await import("../models/Post.js");
  const { default: Review } = await import("../models/Review.js");

  const migrations = [
    {
      Model: Place, name: "Place",
      fields: [
        { field: "image", type: "string", folder: "tourist-places-guide/places" },
        { field: "gallery", type: "gallery", folder: "tourist-places-guide/places/gallery" },
      ],
    },
    {
      Model: Tour, name: "Tour",
      fields: [
        { field: "image", type: "string", folder: "tourist-places-guide/tours" },
        { field: "images", type: "[string]", folder: "tourist-places-guide/tours" },
      ],
    },
    {
      Model: Region, name: "Region",
      fields: [
        { field: "image", type: "string", folder: "tourist-places-guide/regions" },
      ],
    },
    {
      Model: Category, name: "Category",
      fields: [
        { field: "image", type: "string", folder: "tourist-places-guide/categories" },
      ],
    },
    {
      Model: User, name: "User",
      fields: [
        { field: "avatar", type: "string", folder: "tourist-places-guide/avatars" },
      ],
    },
    {
      Model: Post, name: "Post",
      fields: [
        { field: "coverImage", type: "string", folder: "tourist-places-guide/blog" },
      ],
    },
    {
      Model: Review, name: "Review",
      fields: [
        { field: "images", type: "[string]", folder: "tourist-places-guide/reviews" },
      ],
    },
  ];

  let totalMigrated = 0;
  let totalFailed = 0;

  for (const { Model, name, fields } of migrations) {
    const count = await Model.countDocuments();
    console.log(`\n📦 ${name} (${count} docs)`);
    if (count === 0) { console.log("  No documents, skipping."); continue; }

    const result = await migrateModel(Model, name, fields);
    console.log(`  → ${result.migrated} images migrated, ${result.failed} failed, ${result.saved} docs saved`);
    totalMigrated += result.migrated;
    totalFailed += result.failed;
  }

  console.log(`\n✅ Done! Total: ${totalMigrated} images migrated, ${totalFailed} failed\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
