import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "booking", "payment", "email", "social", "seo"],
      default: "general",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

settingsSchema.index({ key: 1 }, { unique: true });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
