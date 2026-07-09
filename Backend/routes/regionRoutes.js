import express from "express";
import { body } from "express-validator";
import {
  createRegion,
  deleteRegion,
  getRegions,
  getRegionById,
  updateRegion,
} from "../controllers/regionController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const regionValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("slug")
    .optional()
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Slug cannot be empty."),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive."),
];

router
  .route("/")
  .get(getRegions)
  .post(protect, admin, regionValidators, validateRequest, createRegion);

router
  .route("/:id")
  .get(getRegionById)
  .put(protect, admin, regionValidators, validateRequest, updateRegion)
  .delete(protect, admin, deleteRegion);

export default router;
