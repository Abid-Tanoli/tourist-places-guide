import Inquiry from "../models/Inquiry.js";

export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Inquiry.countDocuments(filters),
    ]);

    res.json({
      inquiries,
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

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }
    res.json(inquiry);
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }
    res.json({ message: "Inquiry deleted." });
  } catch (error) {
    next(error);
  }
};
