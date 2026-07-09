import express from "express";
import { getReports } from "../controllers/reportsController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getReports);

export default router;
