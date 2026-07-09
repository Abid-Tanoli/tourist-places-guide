import express from "express";
import { uploadSingle, uploadMultiple, uploadAvatar } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/image", protect, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
    });
  });
});

router.post("/images", protect, (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided." });
    }
    const uploaded = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width,
      height: file.height,
      format: file.format,
    }));
    res.json(uploaded);
  });
});

router.post("/avatar", protect, (req, res) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file provided." });
    }
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  });
});

export default router;
