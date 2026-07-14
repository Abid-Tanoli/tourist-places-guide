import express from "express";
import { body } from "express-validator";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const inquiryValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required."),
  body("message").trim().notEmpty().withMessage("Message is required."),
];

router
  .route("/")
  .post(inquiryValidators, validateRequest, createInquiry)
  .get(protect, admin, getInquiries);

router.put("/:id/status", protect, admin, updateInquiryStatus);
router.delete("/:id", protect, admin, deleteInquiry);

export default router;
