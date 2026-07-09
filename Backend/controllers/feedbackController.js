import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
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

    const query = Feedback.find({}).sort({ createdAt: -1 });
    if (!isAdmin) {
      query.select("-email");
    }

    const feedback = await query;
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
