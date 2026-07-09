import express from "express";
import { body } from "express-validator";
import {
  createFAQ,
  deleteFAQ,
  getFAQs,
  reorderFAQs,
  updateFAQ,
} from "../controllers/faqController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const faqValidators = [
  body("question").trim().notEmpty().withMessage("Question is required."),
  body("answer").trim().notEmpty().withMessage("Answer is required."),
  body("category")
    .optional()
    .isIn(["general", "booking", "payment", "cancellation", "tour", "other"])
    .withMessage("Invalid category."),
];

router.get("/", getFAQs);
router.post("/", protect, admin, faqValidators, validateRequest, createFAQ);
router.put("/reorder", protect, admin, reorderFAQs);
router
  .route("/:id")
  .put(protect, admin, updateFAQ)
  .delete(protect, admin, deleteFAQ);

export default router;
