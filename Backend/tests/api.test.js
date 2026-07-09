import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import configureMiddleware from "../config/middleware.js";
import authRoutes from "../routes/authRoutes.js";
import placeRoutes from "../routes/placeRoutes.js";
import tourRoutes from "../routes/tourRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";
import faqRoutes from "../routes/faqRoutes.js";
import { errorHandler, notFound } from "../middleware/errorMiddleware.js";

process.env.JWT_SECRET = "test_jwt_secret_key";
process.env.JWT_REFRESH_SECRET = "test_jwt_refresh_secret_key";
process.env.NODE_ENV = "test";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  configureMiddleware(app);
  app.use("/api/auth", authRoutes);
  app.use("/api/places", placeRoutes);
  app.use("/api/tours", tourRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/faqs", faqRoutes);
  app.use(notFound);
  app.use(errorHandler);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Auth Routes", () => {
  const userData = { name: "Test User", email: "user@test.com", password: "user123" };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(userData.email);
      expect(res.body.user.role).toBe("user");
      expect(res.body.token).toBeDefined();
    });

    it("should not register with duplicate email", async () => {
      await request(app).post("/api/auth/register").send(userData);
      const res = await request(app).post("/api/auth/register").send(userData);

      expect(res.status).toBe(409);
    });

    it("should not register with invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...userData, email: "notanemail" });

      expect(res.status).toBe(400);
    });

    it("should not register with short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...userData, password: "123" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(userData);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: userData.password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(userData.email);
    });

    it("should not login with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: "wrongpass" });

      expect(res.status).toBe(401);
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@test.com", password: "user123" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post("/api/auth/register").send(userData);
      token = res.body.token;
    });

    it("should return current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(userData.email);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should return 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken123");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.status).toBe(200);
    });
  });
});

describe("Place Routes", () => {
  describe("GET /api/places", () => {
    it("should return places array", async () => {
      const res = await request(app).get("/api/places");
      expect(res.status).toBe(200);
    });
  });
});

describe("Tour Routes", () => {
  describe("GET /api/tours", () => {
    it("should return tours", async () => {
      const res = await request(app).get("/api/tours");
      expect(res.status).toBe(200);
    });
  });
});

describe("Booking Routes", () => {
  describe("POST /api/bookings", () => {
    it("should require tour ID", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .send({
          userType: "pakistani",
          name: "Test",
          email: "test@test.com",
          phone: "0300-1234567",
        });

      expect(res.status).toBe(400);
    });
  });
});

describe("FAQ Routes", () => {
  describe("GET /api/faqs", () => {
    it("should return empty FAQs", async () => {
      const res = await request(app).get("/api/faqs");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
