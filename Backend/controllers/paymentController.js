import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

let stripe;
try {
  const Stripe = (await import("stripe")).default;
  stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
} catch {
  stripe = null;
}

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
    const price = visitorType === "foreigner" ? tour.foreignerPrice : tour.pakistaniPrice;
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
        await Tour.findByIdAndUpdate(booking.tour._id, {
          $inc: { availableSeats: -(booking.guests?.adults || 1) },
        });
      }

      return res.json({ message: "Payment confirmed.", booking });
    }

    res.status(400).json({ message: "Payment not yet successful.", status: paymentIntent.status });
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
      await Tour.findByIdAndUpdate(booking.tour, {
        $inc: { availableSeats: -(booking.guests?.adults || 1) },
      });
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
    const price = booking.userType === "foreigner" ? tour.foreignerPrice : tour.pakistaniPrice;
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      ...booking.payment,
      amount: totalAmount,
      currency: "PKR",
      method: "easypaisa",
      status: "pending",
    };
    await booking.save();

    res.json({
      message: "EasyPaisa payment initiated. Please complete on your phone.",
      bookingId: booking._id,
      amount: totalAmount,
      phone: phone || booking.phone,
      instructions: "Dial *786# on your EasyPaisa mobile to complete payment.",
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
    const price = booking.userType === "foreigner" ? tour.foreignerPrice : tour.pakistaniPrice;
    const totalAmount = price * (booking.guests?.adults || 1);

    booking.payment = {
      ...booking.payment,
      amount: totalAmount,
      currency: "PKR",
      method: "jazzcash",
      status: "pending",
    };
    await booking.save();

    res.json({
      message: "JazzCash payment initiated. Please complete on your phone.",
      bookingId: booking._id,
      amount: totalAmount,
      phone: phone || booking.phone,
      instructions: "Dial *786# on your JazzCash mobile to complete payment.",
    });
  } catch (error) {
    next(error);
  }
};
