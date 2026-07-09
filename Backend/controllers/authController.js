import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Place from "../models/Place.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import Feedback from "../models/Feedback.js";

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  avatar: user.avatar || "",
  role: user.role,
  wishlist: user.wishlist || [],
  isEmailVerified: user.isEmailVerified || false,
});

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: true });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      user: formatUser(user),
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: true });

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      user: formatUser(user),
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateModifiedOnly: true });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token: newAccessToken,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully." });
  }
};

export const me = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");
    res.json({ message: "Password changed successfully. Please login again." });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true });

    const resetUrl = `${process.env.USER_CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    console.log("Password Reset URL:", resetUrl);

    res.json({
      message: "If the email exists, a reset link has been sent.",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const index = user.wishlist.indexOf(placeId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(placeId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [places, tours, bookings, feedback, users] = await Promise.all([
      Place.estimatedDocumentCount(),
      Tour.estimatedDocumentCount(),
      Booking.estimatedDocumentCount(),
      Feedback.estimatedDocumentCount(),
      User.estimatedDocumentCount(),
    ]);

    const recentBookings = await Booking.find({})
      .populate("tour", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    res.json({
      places,
      tours,
      bookings,
      feedback,
      users,
      pendingBookings,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};
