import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load Environment Variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Start Server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`\SkillWage Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`API Base URL: ${process.env.CORS_ORIGIN}/api`);
      console.log(`Health Check: ${process.env.CORS_ORIGIN}/api/health\n`);
    });

    // Graceful Shutdown 
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Unhandled Rejections 
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION:", err.message);
      server.close(() => process.exit(1));
    });

    // Uncaught Exceptions
    process.on("uncaughtException", (err) => {
      console.error("UNCAUGHT EXCEPTION:", err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
