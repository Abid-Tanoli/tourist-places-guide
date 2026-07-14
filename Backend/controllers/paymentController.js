import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

let stripe;
try {
  const Stripe = (await import("stripe")).default;
  stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
} catch {
  stripe = null;
}

const getVisitorPrice = (tour, userType) => {
  if (userType === "foreigner" && tour.foreignerPrice) return tour.foreignerPrice;
  if (tour.pakistaniPrice) return tour.pakistaniPrice;
  return tour.price || 0;
};

const decrementSeats = async (tourId, booking) => {
  const totalGuests = (booking.guests?.adults || 1) + (booking.guests?.children || 0);
  
  // Try to decrement departure-specific seats first
  if (booking.departure?.departureId) {
    const tour = await Tour.findById(tourId);
    if (tour) {
      const departure = tour.departures.id(booking.departure.departureId);
      if (departure) {
        departure.bookedSeats = Math.min(departure.bookedSeats + totalGuests, departure.capacity);
        if (departure.bookedSeats >= departure.capacity) {
          departure.status = "full";
        }
        await tour.save();
        return;
      }
    }
  }
  
  // Fallback to global availableSeats
  await Tour.findByIdAndUpdate(tourId, {
    $inc: { availableSeats: -totalGuests },
  });
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!stripe) {
      return res.status(503).json({ message: "Payment service not configured." });
    }

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.payment?.status === "completed") {
      return res.status(400).json({ message: "Booking already paid." });
    }

    const tour = booking.tour;
    const visitorType = booking.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const totalAmount = price * (booking.guests?.adults || 1);
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "pkr",
      metadata: {
        bookingId: booking._id.toString(),
        tourName: tour.name,
        customerEmail: booking.email,
      },
    });

    booking.payment = {
      ...booking.payment,
      amount: totalAmount,
      currency: "PKR",
      method: "stripe",
      transactionId: paymentIntent.id,
      status: "pending",
    };
    await booking.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    if (!stripe) {
      return res.status(503).json({ message: "Payment service not configured." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const booking = await Booking.findOneAndUpdate(
        { "payment.transactionId": paymentIntentId },
        {
          $set: {
            "payment.status": "completed",
            "payment.paidAt": new Date(),
            status: "confirmed",
          },
        },
        { new: true }
      ).populate("tour");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      if (booking.tour) {
        await decrementSeats(booking.tour._id, booking);
      }

      return res.json({ message: "Payment confirmed.", booking });
    }

    res.status(400).json({ message: "Payment not yet successful.", status: paymentIntent.status });
  } catch (error) {
    next(error);
  }
};

export const confirmCodBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.payment?.status === "completed") {
      return res.status(400).json({ message: "Booking already confirmed." });
    }

    const tour = booking.tour;
    const visitorType = booking.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      amount: totalAmount,
      currency: "PKR",
      method: "cod",
      status: "pending",
      paidAt: undefined,
    };
    booking.status = "confirmed";
    await booking.save();

    if (tour) {
      await decrementSeats(tour._id, booking);
    }

    res.json({ message: "Booking confirmed. Payment will be collected on arrival.", booking });
  } catch (error) {
    next(error);
  }
};

export const confirmManualPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.payment?.status === "completed") {
      return res.status(400).json({ message: "Booking already confirmed." });
    }

    const tour = booking.tour;
    const visitorType = booking.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      ...booking.payment,
      amount: totalAmount,
      currency: "PKR",
      status: "completed",
      paidAt: new Date(),
    };
    booking.status = "confirmed";
    await booking.save();

    if (tour) {
      await decrementSeats(tour._id, booking);
    }

    res.json({ message: "Payment confirmed manually.", booking });
  } catch (error) {
    next(error);
  }
};

export const handleStripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: "Payment service not configured." });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const booking = await Booking.findOneAndUpdate(
      { "payment.transactionId": paymentIntent.id },
      {
        $set: {
          "payment.status": "completed",
          "payment.paidAt": new Date(),
          status: "confirmed",
        },
      },
      { new: true }
    );

    if (booking?.tour) {
      await decrementSeats(booking.tour, booking);
    }
  }

  res.json({ received: true });
};

export const initiateEasypaisaPayment = async (req, res, next) => {
  try {
    const { bookingId, phone } = req.body;

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const tour = booking.tour;
    const visitorType = booking.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      amount: totalAmount,
      currency: "PKR",
      method: "easypaisa",
      status: "pending",
    };
    booking.status = "pending";
    await booking.save();

    res.json({
      message: "EasyPaisa payment initiated. Our team will verify your transaction and confirm your booking.",
      bookingId: booking._id,
      amount: totalAmount,
      phone: phone || booking.phone,
      instructions: "Please send the payment via EasyPaisa to the provided number. Our admin will verify and confirm your booking manually.",
      note: "This is a manual verification process. Your booking will be confirmed once our team verifies the payment.",
    });
  } catch (error) {
    next(error);
  }
};

export const initiateJazzCashPayment = async (req, res, next) => {
  try {
    const { bookingId, phone } = req.body;

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const tour = booking.tour;
    const visitorType = booking.userType || "pakistani";
    const price = getVisitorPrice(tour, visitorType);
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      amount: totalAmount,
      currency: "PKR",
      method: "jazzcash",
      status: "pending",
    };
    booking.status = "pending";
    await booking.save();

    res.json({
      message: "JazzCash payment initiated. Our team will verify your transaction and confirm your booking.",
      bookingId: booking._id,
      amount: totalAmount,
      phone: phone || booking.phone,
      instructions: "Please send the payment via JazzCash to the provided number. Our admin will verify and confirm your booking manually.",
      note: "This is a manual verification process. Your booking will be confirmed once our team verifies the payment.",
    });
  } catch (error) {
    next(error);
  }
};
