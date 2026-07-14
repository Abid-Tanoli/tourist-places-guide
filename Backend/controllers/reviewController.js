import mongoose from "mongoose";
import Review from "../models/Review.js";
import Place from "../models/Place.js";
import Tour from "../models/Tour.js";

export const getReviews = async (req, res, next) => {
  try {
    const { place, status, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (place) filters.place = place;
    if (status) filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filters)
        .populate("place", "name slug image")
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filters),
    ]);

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByPlace = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total, stats] = await Promise.all([
      Review.find({ place: placeId, status: "approved" })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ place: placeId, status: "approved" }),
      Review.aggregate([
        { $match: { place: new mongoose.Types.ObjectId(placeId), status: "approved" } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    const ratingStats = stats[0] || { avgRating: 0, totalReviews: 0 };

    res.json({
      reviews,
      stats: {
        avgRating: Math.round(ratingStats.avgRating * 10) / 10,
        totalReviews: ratingStats.totalReviews,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total, stats] = await Promise.all([
      Review.find({ tour: tourId, status: "approved" })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ tour: tourId, status: "approved" }),
      Review.aggregate([
        { $match: { tour: new mongoose.Types.ObjectId(tourId), status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      ]),
    ]);

    const ratingStats = stats[0] || { avgRating: 0, totalReviews: 0 };

    res.json({
      reviews,
      stats: {
        avgRating: Math.round(ratingStats.avgRating * 10) / 10,
        totalReviews: ratingStats.totalReviews,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const allowedReviewFields = ["name", "email", "place", "tour", "rating", "title", "comment", "images", "user"];

const pickAllowed = (body, fields) =>
  fields.reduce((obj, key) => {
    if (body[key] !== undefined) obj[key] = body[key];
    return obj;
  }, {});

export const createReview = async (req, res, next) => {
  try {
    if (!req.body.place && !req.body.tour) {
      return res.status(400).json({ message: "Either place or tour is required." });
    }

    const review = await Review.create(pickAllowed(req.body, allowedReviewFields));

    if (review.place) {
      const stats = await Review.aggregate([
        { $match: { place: review.place, status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      ]);
      if (stats[0]) {
        await Place.findByIdAndUpdate(review.place, {
          rating: Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].totalReviews,
        });
      }
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Recalculate place stats
    const stats = await Review.aggregate([
      { $match: { place: review.place, status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const placeStats = stats[0] || { avgRating: 0, totalReviews: 0 };
    await Place.findByIdAndUpdate(review.place, {
      rating: Math.round(placeStats.avgRating * 10) / 10,
      totalReviews: placeStats.totalReviews,
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    review.replies.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });

    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const likeReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Recalculate place stats
    const stats = await Review.aggregate([
      { $match: { place: review.place, status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const placeStats = stats[0] || { avgRating: 0, totalReviews: 0 };
    await Place.findByIdAndUpdate(review.place, {
      rating: Math.round(placeStats.avgRating * 10) / 10,
      totalReviews: placeStats.totalReviews,
    });

    res.json({ message: "Review deleted." });
  } catch (error) {
    next(error);
  }
};
