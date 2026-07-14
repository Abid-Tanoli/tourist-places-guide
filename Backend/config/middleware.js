import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const configureMiddleware = (app) => {
  const userClientUrl = process.env.USER_CLIENT_URL || "http://localhost:5173";
  const adminClientUrl = process.env.ADMIN_CLIENT_URL || "http://localhost:5174";

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(
    cors({
      origin: [userClientUrl, adminClientUrl],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(morgan("dev"));

  const isDev = process.env.NODE_ENV !== "production";

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 10000 : 200,
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 10000 : 15,
    message: { message: "Too many auth attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
  });

  app.use("/api/", generalLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);
  app.use("/api/auth/reset-password", authLimiter);

  return { generalLimiter, authLimiter };
};

export default configureMiddleware;
