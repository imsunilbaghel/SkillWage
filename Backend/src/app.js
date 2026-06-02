import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import supportRoutes from "./routes/supportRoutes.js"
import { errorHandler } from "./middlewares/errorHandler.js";


// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  // "http://localhost:5173",
  // "http://127.0.0.1:5173",
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie Parser 
app.use(cookieParser());

// Request Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillWage API is running",
    data: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/post", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} — Route not found`
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
