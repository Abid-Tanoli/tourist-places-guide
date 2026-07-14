import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

const getVisitorPrice = (tour, userType) => {
  if (userType === "foreigner" && tour.foreignerPrice) return tour.foreignerPrice;
  if (tour.pakistaniPrice) return tour.pakistaniPrice;
  return tour.price || 0;
};

export const createBooking = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.body.tour);

    if (!tour) {
      return res.status(404).json({ message: "Selected tour not found." });
    }

    const visitorType = req.body.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const adults = Number(req.body.guests?.adults) || 1;
    const children = Number(req.body.guests?.children) || 0;
    const totalGuests = adults + children;
    const totalAmount = price * adults;

    // Validate departure capacity if a departure is selected
    if (req.body.departure?.departureId) {
      const departure = tour.departures.id(req.body.departure.departureId);
      if (!departure) {
        return res.status(404).json({ message: "Selected departure not found." });
      }
      if (departure.status === "cancelled") {
        return res.status(400).json({ message: "This departure has been cancelled." });
      }
      if (departure.status === "full" || (departure.capacity - departure.bookedSeats) < totalGuests) {
        return res.status(400).json({
          message: `Not enough seats available. Only ${departure.capacity - departure.bookedSeats} seats remaining for this departure.`,
        });
      }
    } else if (req.body.date) {
      // Find departure by date
      const departure = tour.departures.find(
        (d) => new Date(d.date).toISOString() === new Date(req.body.date).toISOString() && d.status === "active"
      );
      if (!departure) {
        return res.status(404).json({ message: "No active departure found for the selected date." });
      }
      if ((departure.capacity - departure.bookedSeats) < totalGuests) {
        return res.status(400).json({
          message: `Not enough seats available. Only ${departure.capacity - departure.bookedSeats} seats remaining for this date.`,
        });
      }
      req.body.departure = {
        departureId: departure._id,
        date: departure.date,
        time: departure.time,
      };
    } else {
      // Fallback: check global availableSeats
      if (tour.availableSeats < totalGuests) {
        return res.status(400).json({
          message: `Not enough seats available. Only ${tour.availableSeats} seats remaining.`,
        });
      }
    }

    const bookingData = {
      ...req.body,
      selectedTour: req.body.selectedTour || tour.name,
      payment: {
        amount: totalAmount,
        currency: "PKR",
        method: req.body.paymentMethod || "cod",
        status: "pending",
      },
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
