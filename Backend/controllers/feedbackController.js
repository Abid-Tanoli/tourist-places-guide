import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

const allowedFeedbackFields = ["name", "email", "country", "rating", "feedBackText"];

const pickAllowed = (body, fields) =>
  fields.reduce((obj, key) => {
    if (body[key] !== undefined) obj[key] = body[key];
    return obj;
  }, {});

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(pickAllowed(req.body, allowedFeedbackFields));
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    let isAdmin = false;
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === "admin") {
          isAdmin = true;
        }
      } catch (err) {
        // Not a valid token, ignore
      }
    }

    const { featured, status, limit } = req.query;
    const query = {};

    if (!isAdmin) {
      query.status = "approved";
    } else if (status) {
      query.status = status;
    }

    if (featured === "true") {
      query.featured = true;
    }

    let feedbackQuery = Feedback.find(query).sort({ createdAt: -1 });
    if (limit) {
      feedbackQuery = feedbackQuery.limit(Number(limit));
    }
    if (!isAdmin) {
      feedbackQuery = feedbackQuery.select("-email");
    }

    const feedback = await feedbackQuery;
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    res.json({ message: "Feedback deleted." });
  } catch (error) {
    next(error);
  }
};
