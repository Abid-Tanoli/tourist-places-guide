import Settings from "../models/Settings.js";

export const getSettings = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const settings = await Settings.find(filter).sort({ category: 1, key: 1 });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const getSettingByKey = async (req, res, next) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: "Setting not found." });
    }
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, description, category } = req.body;

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, description: description || "", category: category || "general" },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: "Settings must be an array." });
    }

    const bulkOps = settings.map((s) => ({
      updateOne: {
        filter: { key: s.key },
        update: {
          $set: {
            value: s.value,
            description: s.description || "",
            category: s.category || "general",
          },
        },
        upsert: true,
      },
    }));

    await Settings.bulkWrite(bulkOps);
    res.json({ message: "Settings updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  try {
    const setting = await Settings.findOneAndDelete({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: "Setting not found." });
    }
    res.json({ message: "Setting deleted." });
  } catch (error) {
    next(error);
  }
};
