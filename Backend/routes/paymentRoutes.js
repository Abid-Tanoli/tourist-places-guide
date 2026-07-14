import express from "express";
import {
  confirmCodBooking,
  confirmManualPayment,
  confirmPayment,
  createPaymentIntent,
  handleStripeWebhook,
  initiateEasypaisaPayment,
  initiateJazzCashPayment,
} from "../controllers/paymentController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);
router.post("/confirm-cod", protect, confirmCodBooking);
router.post("/confirm-manual", protect, admin, confirmManualPayment);
router.post("/easypaisa", protect, initiateEasypaisaPayment);
router.post("/jazzcash", protect, initiateJazzCashPayment);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
