import express from "express";
import { body } from "express-validator";
import {
  addReply,
  createReview,
  deleteReview,
  getReviews,
  getReviewsByPlace,
  likeReview,
  updateReviewStatus,
} from "../controllers/reviewController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const createReviewValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("place")
    .notEmpty()
    .withMessage("Place is required.")
    .bail()
    .isMongoId()
    .withMessage("Place must be valid."),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),
  body("title").optional().trim(),
  body("comment").trim().notEmpty().withMessage("Comment is required."),
];

router
  .route("/")
  .get(getReviews)
  .post(createReviewValidators, validateRequest, createReview);

router.get("/place/:placeId", getReviewsByPlace);

router.put("/:id/status", protect, admin, updateReviewStatus);
router.post("/:id/reply", protect, admin, addReply);
router.post("/:id/like", likeReview);
router.delete("/:id", protect, admin, deleteReview);

export default router;
