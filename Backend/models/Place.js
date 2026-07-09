import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const openingHoursSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    open: { type: String, default: "" },
    close: { type: String, default: "" },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    regionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [galleryImageSchema],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    bestTime: {
      type: String,
      trim: true,
      default: "",
    },
    openingHours: [openingHoursSchema],
    entryFee: {
      pakistani: { type: Number, default: 0 },
      foreigner: { type: Number, default: 0 },
      currency: { type: String, default: "PKR" },
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    contactInfo: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    seoFields: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

placeSchema.index({ name: "text", description: "text" });
placeSchema.index({ region: 1, category: 1 });
placeSchema.index({ slug: 1 });
placeSchema.index({ featured: 1, status: 1 });
placeSchema.index({ lat: 1, lng: 1 });

const Place = mongoose.model("Place", placeSchema);

export default Place;
