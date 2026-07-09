import express from "express";
import { body } from "express-validator";
import {
  createTour,
  deleteTour,
  getTourById,
  getTours,
  getToursSimple,
  updateTour,
} from "../controllers/tourController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const createTourValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  body("shortDescription").optional().trim(),
  body("days")
    .isInt({ min: 1 })
    .withMessage("Days must be a positive number."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be zero or greater."),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100."),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1."),
  body("included").optional().isArray(),
  body("excluded").optional().isArray(),
  body("images").optional().isArray(),
  body("image").optional().trim(),
  body("location").optional().trim(),
  body("featured").optional().isBoolean(),
  body("status")
    .optional()
    .isIn(["draft", "published", "cancelled", "completed"])
    .withMessage("Status must be draft, published, cancelled, or completed."),
  body("route")
    .isArray({ min: 1 })
    .withMessage("Route must contain at least one place."),
  body("route.*.place")
    .isMongoId()
    .withMessage("Each route stop must reference a valid place."),
  body("route.*.day")
    .isInt({ min: 1 })
    .withMessage("Each route day must be a positive number."),
  body("route.*.order")
    .isInt({ min: 1 })
    .withMessage("Each route order must be a positive number."),
];

const updateTourValidators = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),
  body("days")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Days must be a positive number."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be zero or greater."),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100."),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1."),
  body("included").optional().isArray(),
  body("excluded").optional().isArray(),
  body("images").optional().isArray(),
  body("image").optional().trim(),
  body("location").optional().trim(),
  body("featured").optional().isBoolean(),
  body("status")
    .optional()
    .isIn(["draft", "published", "cancelled", "completed"])
    .withMessage("Status must be draft, published, cancelled, or completed."),
  body("route")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Route must contain at least one place."),
  body("route.*.place")
    .optional()
    .isMongoId()
    .withMessage("Each route stop must reference a valid place."),
  body("route.*.day")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each route day must be a positive number."),
  body("route.*.order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each route order must be a positive number."),
];

router
  .route("/")
  .get(getToursSimple)
  .post(protect, admin, createTourValidators, validateRequest, createTour);

router.get("/manage", protect, admin, getTours);

router
  .route("/:id")
  .get(getTourById)
  .put(protect, admin, updateTourValidators, validateRequest, updateTour)
  .delete(protect, admin, deleteTour);

export default router;
