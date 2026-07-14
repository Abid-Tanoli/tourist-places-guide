import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      trim: true,
      default: "Admin",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: function () {
        return !this.tour;
      },
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    replies: [replySchema],
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ place: 1, createdAt: -1 });
reviewSchema.index({ tour: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
