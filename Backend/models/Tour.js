import mongoose from "mongoose";

const tourStopSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    day: {
      type: Number,
      required: true,
      min: 1,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, default: "" },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
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
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    included: [
      {
        type: String,
        trim: true,
      },
    ],
    excluded: [
      {
        type: String,
        trim: true,
      },
    ],
    route: {
      type: [tourStopSchema],
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "Tour route must contain at least one place.",
      },
    },
    schedule: [scheduleSchema],
    capacity: {
      type: Number,
      min: 1,
      default: 20,
    },
    availableSeats: {
      type: Number,
      min: 0,
      default: 20,
    },
    images: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

tourSchema.index({ name: "text", description: "text" });
tourSchema.index({ slug: 1 });
tourSchema.index({ status: 1, featured: 1 });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
