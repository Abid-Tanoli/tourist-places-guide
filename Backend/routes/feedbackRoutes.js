import express from "express";
import { body } from "express-validator";
import {
  createFeedback,
  deleteFeedback,
  getFeedback,
} from "../controllers/feedbackController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const createFeedbackValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("country").optional().trim(),
  body("rating")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),
  body("feedBackText")
    .trim()
    .notEmpty()
    .withMessage("Feedback text is required."),
];

router
  .route("/")
  .post(createFeedbackValidators, validateRequest, createFeedback)
  .get(getFeedback);

router.delete("/:id", protect, admin, deleteFeedback);

export default router;
