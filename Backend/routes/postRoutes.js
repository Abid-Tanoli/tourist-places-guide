import express from "express";
import { body } from "express-validator";
import {
  getPosts,
  getPublishedPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const postValidators = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("content").trim().notEmpty().withMessage("Content is required."),
  body("status").optional().isIn(["draft", "published"]),
];

router.get("/", getPublishedPosts);
router.get("/admin", protect, admin, getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", protect, admin, postValidators, validateRequest, createPost);
router.put("/:id", protect, admin, updatePost);
router.delete("/:id", protect, admin, deletePost);

export default router;
