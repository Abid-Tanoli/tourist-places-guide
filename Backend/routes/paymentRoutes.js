import express from "express";
import {
  confirmPayment,
  createPaymentIntent,
  handleStripeWebhook,
  initiateEasypaisaPayment,
  initiateJazzCashPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);
router.post("/easypaisa", protect, initiateEasypaisaPayment);
router.post("/jazzcash", protect, initiateJazzCashPayment);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
