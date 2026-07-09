import mongoose from "mongoose";
import Region from "../models/Region.js";

export const getRegions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const regions = await Region.find(filters).sort({ name: 1 });
    res.json(regions);
  } catch (error) {
    next(error);
  }
};

export const getRegionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const region = await Region.findOne(query);
    if (!region) {
      return res.status(404).json({ message: "Region not found." });
    }
    res.json(region);
  } catch (error) {
    next(error);
  }
};

export const createRegion = async (req, res, next) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Region already exists." });
    }
    next(error);
  }
};

export const updateRegion = async (req, res, next) => {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!region) {
      return res.status(404).json({ message: "Region not found." });
    }
    res.json(region);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Region name already exists." });
    }
    next(error);
  }
};

export const deleteRegion = async (req, res, next) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) {
      return res.status(404).json({ message: "Region not found." });
    }
    res.json({ message: "Region deleted." });
  } catch (error) {
    next(error);
  }
};
