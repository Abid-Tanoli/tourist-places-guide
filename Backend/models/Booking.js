import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/crypto.js";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "PKR" },
    method: {
      type: String,
      enum: ["cod", "stripe", "easypaisa", "jazzcash", "other"],
      default: "cod",
    },
    transactionId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paidAt: { type: Date },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    selectedTour: {
      type: String,
      required: true,
      trim: true,
    },
    userType: {
      type: String,
      enum: ["pakistani", "foreigner"],
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    cnic: {
      type: String,
      trim: true,
      default: "",
      get: decrypt,
      set: encrypt,
    },
    passport: {
      type: String,
      trim: true,
      default: "",
      get: decrypt,
      set: encrypt,
    },
    guests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    departure: {
      departureId: { type: mongoose.Schema.Types.ObjectId },
      date: { type: Date },
      time: { type: String, default: "" },
    },
    payment: paymentSchema,
    date: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ tour: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
