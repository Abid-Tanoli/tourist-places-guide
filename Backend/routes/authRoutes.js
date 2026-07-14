import express from "express";
import { body } from "express-validator";
import {
  changePassword,
  forgotPassword,
  getDashboardStats,
  getPublicStats,
  login,
  logout,
  me,
  refreshToken,
  register,
  resetPassword,
  toggleWishlist,
  updateProfile,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

router.post("/register", registerValidators, validateRequest, register);
router.post("/login", loginValidators, validateRequest, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/wishlist/:placeId", protect, toggleWishlist);
router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.get("/public-stats", getPublicStats);

export default router;
