import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import Place from "../models/Place.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

export const getReports = async (req, res, next) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const dateFilter = { createdAt: { $gte: startDate } };

    const [
      totalBookings,
      bookingsByStatus,
      totalRevenue,
      bookingsByMonth,
      popularTours,
      recentBookings,
      totalUsers,
      newUsers,
      bookingsByTour,
    ] = await Promise.all([
      Booking.countDocuments(dateFilter),
      Booking.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { ...dateFilter, "payment.status": "completed" } },
        { $group: { _id: null, total: { $sum: "$payment.amount" } } },
      ]),
      Booking.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
            revenue: { $sum: "$payment.amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$tour", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "tours", localField: "_id", foreignField: "_id", as: "tour" } },
        { $unwind: "$tour" },
        { $project: { name: "$tour.name", count: 1 } },
      ]),
      Booking.find(dateFilter)
        .populate("tour", "name")
        .sort({ createdAt: -1 })
        .limit(10),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Booking.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$tour", count: { $sum: 1 }, revenue: { $sum: "$payment.amount" } } },
        { $sort: { count: -1 } },
        { $lookup: { from: "tours", localField: "_id", foreignField: "_id", as: "tour" } },
        { $unwind: "$tour" },
        { $project: { name: "$tour.name", count: 1, revenue: 1 } },
      ]),
    ]);

    res.json({
      period: period || "all",
      totalBookings,
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totalRevenue: totalRevenue[0]?.total || 0,
      bookingsByMonth,
      popularTours,
      recentBookings,
      totalUsers,
      newUsers,
      bookingsByTour,
    });
  } catch (error) {
    next(error);
  }
};
