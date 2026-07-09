import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const cnicPattern = /^\d{5}-?\d{7}-?\d$/;
const passportPattern = /^[A-Za-z0-9-]{5,20}$/;

const createBookingValidators = [
  body("tour")
    .notEmpty()
    .withMessage("Selected tour is required.")
    .bail()
    .isMongoId()
    .withMessage("Selected tour must be valid."),
  body("selectedTour").optional().trim(),
  body("userType")
    .isIn(["pakistani", "foreigner"])
    .withMessage("Visitor type must be pakistani or foreigner."),
  body("name").optional().trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("cnic")
    .if(body("userType").equals("pakistani"))
    .trim()
    .notEmpty()
    .withMessage("CNIC is required for Pakistani visitors.")
    .bail()
    .matches(cnicPattern)
    .withMessage("CNIC must use 13 digits, with optional dashes."),
  body("passport")
    .if(body("userType").equals("foreigner"))
    .trim()
    .notEmpty()
    .withMessage("Passport is required for foreign visitors.")
    .bail()
    .matches(passportPattern)
    .withMessage("Passport must be 5-20 letters, numbers, or dashes."),
  body("guests.adults")
    .optional()
    .isInt({ min: 1 })
    .withMessage("At least 1 adult is required."),
  body("guests.children")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Children count cannot be negative."),
  body("notes").optional().trim(),
  body("date").optional().isISO8601().withMessage("Date must be valid."),
];

const statusValidators = [
  body("status")
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Status must be pending, confirmed, cancelled, or completed."),
];

router.get("/my-bookings", protect, getMyBookings);

router
  .route("/")
  .post(createBookingValidators, validateRequest, createBooking)
  .get(protect, admin, getBookings);

router
  .route("/:id")
  .get(protect, admin, getBookingById)
  .delete(protect, admin, deleteBooking);

router.put(
  "/:id/status",
  protect,
  admin,
  statusValidators,
  validateRequest,
  updateBookingStatus
);

export default router;
