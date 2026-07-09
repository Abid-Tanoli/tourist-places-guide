import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

export const createBooking = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.body.tour);

    if (!tour) {
      return res.status(404).json({ message: "Selected tour not found." });
    }

    const bookingData = {
      ...req.body,
      selectedTour: req.body.selectedTour || tour.name,
    };

    if (req.user) {
      bookingData.user = req.user._id;
      if (!bookingData.name) bookingData.name = req.user.name;
      if (!bookingData.email) bookingData.email = req.user.email;
      if (!bookingData.phone) bookingData.phone = req.user.phone || "";
    }

    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("tour")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate("tour")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("tour");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("tour");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json({ message: "Booking deleted." });
  } catch (error) {
    next(error);
  }
};
