import express from "express";
import {
  bulkUpdateSettings,
  deleteSetting,
  getSettingByKey,
  getSettings,
  updateSetting,
} from "../controllers/settingsController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getSettings);
router.get("/:key", protect, admin, getSettingByKey);
router.put("/:key", protect, admin, updateSetting);
router.put("/", protect, admin, bulkUpdateSettings);
router.delete("/:key", protect, admin, deleteSetting);

export default router;
