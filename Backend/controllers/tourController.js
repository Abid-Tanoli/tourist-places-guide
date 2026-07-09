import Tour from "../models/Tour.js";

const populateRoute = {
  path: "route.place",
  model: "Place",
  select: "name slug image lat lng region category",
};

export const getTours = async (req, res, next) => {
  try {
    const {
      status = "published",
      featured,
      page = 1,
      limit = 50,
      sort = "name",
    } = req.query;

    const filters = {};
    if (status && status !== "all") filters.status = status;
    if (featured === "true") filters.featured = true;

    const skip = (Number(page) - 1) * Number(limit);

    let sortObj = { name: 1 };
    if (sort === "price") sortObj = { price: 1 };
    if (sort === "price-desc") sortObj = { price: -1 };
    if (sort === "days") sortObj = { days: 1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    const [tours, total] = await Promise.all([
      Tour.find(filters)
        .populate(populateRoute)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Tour.countDocuments(filters),
    ]);

    res.json({
      tours,
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

export const getToursSimple = async (req, res, next) => {
  try {
    const tours = await Tour.find({ status: "published" })
      .populate(populateRoute)
      .sort({ legacyId: 1, name: 1 });
    res.json(tours);
  } catch (error) {
    next(error);
  }
};

export const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate(populateRoute);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found." });
    }

    res.json(tour);
  } catch (error) {
    next(error);
  }
};

export const createTour = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (!req.body.availableSeats && req.body.capacity) {
      req.body.availableSeats = req.body.capacity;
    }

    const tour = await Tour.create(req.body);
    const populatedTour = await tour.populate(populateRoute);
    res.status(201).json(populatedTour);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Tour slug already exists." });
    }
    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(populateRoute);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found." });
    }

    res.json(tour);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Tour slug already exists." });
    }
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found." });
    }

    res.json({ message: "Tour deleted." });
  } catch (error) {
    next(error);
  }
};
