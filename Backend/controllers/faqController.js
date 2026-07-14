import FAQ from "../models/FAQ.js";

export const getFAQs = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

const allowedFAQFields = ["question", "answer", "category", "order", "status"];

const pickAllowed = (body, fields) =>
  fields.reduce((obj, key) => {
    if (body[key] !== undefined) obj[key] = body[key];
    return obj;
  }, {});

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(pickAllowed(req.body, allowedFAQFields));
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, pickAllowed(req.body, allowedFAQFields), {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found." });
    }
    res.json(faq);
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found." });
    }
    res.json({ message: "FAQ deleted." });
  } catch (error) {
    next(error);
  }
};

export const reorderFAQs = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array." });
    }

    const bulkOps = items.map((item, index) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: index } },
      },
    }));

    await FAQ.bulkWrite(bulkOps);
    res.json({ message: "FAQs reordered successfully." });
  } catch (error) {
    next(error);
  }
};
