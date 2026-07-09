import express from "express";
import { body } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const categoryValidators = [
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
  .get(getCategories)
  .post(protect, admin, categoryValidators, validateRequest, createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, categoryValidators, validateRequest, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
