import mongoose from "mongoose";
import Place from "../models/Place.js";

export const getPlaces = async (req, res, next) => {
  try {
    const {
      region,
      category,
      search,
      featured,
      status = "published",
      page = 1,
      limit = 50,
      sort = "name",
      lat,
      lng,
      radius,
    } = req.query;

    const filters = {};

    if (status && status !== "all") filters.status = status;
    if (region && region !== "All") filters.region = region;
    if (category && category !== "All") filters.category = category;
    if (featured === "true") filters.featured = true;

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filters.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { shortDescription: { $regex: escapedSearch, $options: "i" } },
        { region: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (lat && lng && radius) {
      const maxDistance = Number(radius) || 100;
      filters.lat = {
        $gte: Number(lat) - maxDistance / 111,
        $lte: Number(lat) + maxDistance / 111,
      };
      filters.lng = {
        $gte: Number(lng) - maxDistance / (111 * Math.cos((Number(lat) * Math.PI) / 180)),
        $lte: Number(lng) + maxDistance / (111 * Math.cos((Number(lat) * Math.PI) / 180)),
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sortObj = { name: 1 };
    if (sort === "rating") sortObj = { rating: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };
    if (sort === "name") sortObj = { name: 1 };
    if (sort === "legacyId") sortObj = { legacyId: 1, name: 1 };

    const [places, total] = await Promise.all([
      Place.find(filters).sort(sortObj).skip(skip).limit(Number(limit)),
      Place.countDocuments(filters),
    ]);

    res.json({
      places,
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

export const getPlacesSimple = async (req, res, next) => {
  try {
    const { region, category, search } = req.query;
    const filters = { status: "published" };

    if (region && region !== "All") filters.region = region;
    if (category && category !== "All") filters.category = category;
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filters.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const places = await Place.find(filters)
      .select("name slug description shortDescription region category rating image lat lng featured bestTime entryFee facilities")
      .sort({ featured: -1, legacyId: 1, name: 1 });
    res.json(places);
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else if (!isNaN(id)) {
      query = { legacyId: Number(id) };
    } else {
      query = { slug: id };
    }

    const place = await Place.findOne(query)
      .populate("categoryRef", "name slug")
      .populate("regionRef", "name slug");

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.json(place);
  } catch (error) {
    next(error);
  }
};

export const getNearbyPlaces = async (req, res, next) => {
  try {
    const { lat, lng, radius = 100 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    const maxDistance = Number(radius);
    const places = await Place.find({
      status: "published",
      lat: {
        $gte: Number(lat) - maxDistance / 111,
        $lte: Number(lat) + maxDistance / 111,
      },
      lng: {
        $gte: Number(lng) - maxDistance / (111 * Math.cos((Number(lat) * Math.PI) / 180)),
        $lte: Number(lng) + maxDistance / (111 * Math.cos((Number(lat) * Math.PI) / 180)),
      },
    })
      .select("name slug shortDescription region category rating image lat lng")
      .sort({ rating: -1 })
      .limit(20);

    res.json(places);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedPlaces = async (req, res, next) => {
  try {
    const places = await Place.find({ featured: true, status: "published" })
      .select("name slug shortDescription region category rating image lat lng bestTime")
      .sort({ rating: -1 })
      .limit(10);
    res.json(places);
  } catch (error) {
    next(error);
  }
};

export const createPlace = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    const place = await Place.create(req.body);
    res.status(201).json(place);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Place slug already exists." });
    }
    next(error);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.json(place);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Place slug already exists." });
    }
    next(error);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.json({ message: "Place deleted." });
  } catch (error) {
    next(error);
  }
};
