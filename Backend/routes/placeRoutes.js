import express from "express";
import { body } from "express-validator";
import {
  createPlace,
  deletePlace,
  getFeaturedPlaces,
  getNearbyPlaces,
  getPlaceById,
  getPlaces,
  getPlacesSimple,
  updatePlace,
} from "../controllers/placeController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const createPlaceValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  body("region").trim().notEmpty().withMessage("Region is required."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5."),
  body("bestTime").optional().trim(),
  body("shortDescription").optional().trim(),
  body("address").optional().trim(),
  body("googleMapsUrl").optional().trim(),
  body("website").optional().trim(),
  body("featured").optional().isBoolean(),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived."),
  body("image").notEmpty().withMessage("Image is required."),
  body("lat").isFloat().withMessage("Latitude must be a number."),
  body("lng").isFloat().withMessage("Longitude must be a number."),
  body("facilities").optional().isArray(),
  body("entryFee").optional().isObject(),
  body("seoFields").optional().isObject(),
];

const updatePlaceValidators = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),
  body("region")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Region cannot be empty."),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty."),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5."),
  body("bestTime").optional().trim(),
  body("image").optional().notEmpty().withMessage("Image cannot be empty."),
  body("lat").optional().isFloat().withMessage("Latitude must be a number."),
  body("lng").optional().isFloat().withMessage("Longitude must be a number."),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived."),
];

router.get("/featured", getFeaturedPlaces);
router.get("/nearby", getNearbyPlaces);

router
  .route("/")
  .get(getPlacesSimple)
  .post(protect, admin, createPlaceValidators, validateRequest, createPlace);

router
  .route("/manage")
  .get(protect, admin, getPlaces);

router
  .route("/:id")
  .get(getPlaceById)
  .put(protect, admin, updatePlaceValidators, validateRequest, updatePlace)
  .delete(protect, admin, deletePlace);

export default router;
