import express from "express";
import dotenv from "dotenv";
import sequelize from "./connect.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import logger from "./middlewares/logger.js";
import bodyParser from "body-parser";
import globalRateLimiter from "./middlewares/rateLimit.js";
import { createServer } from "http";
import { Server } from "socket.io";
import "./models/Associations.js";

// Import routes
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import creatorRoute from "./routes/creatorRoute.js";
import brandRoute from "./routes/brandRoute.js";
import campaignRoute from "./routes/campaignRoute.js";
import proposalRoute from "./routes/proposalRoute.js";
import contractRoute from "./routes/contractRoute.js";
import creatorWorkRoute from "./routes/creatorWorkRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import brandReviewRoute from "./routes/brandReviewRoute.js";
import chatRoute from "./routes/chatRoute.js";

// Import socket handler
import { initializeSocket } from "./socket/socketHandler.js";

dotenv.config();

// Initialize the database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync the models with the database
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the function to initialize the database
initializeDatabase();

const app = express();
const PORT = process.env.PORT;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: [
      "https://helpful-begonia-22aec6.netlify.app",
      "https://*.netlify.app", // For Netlify deploy previews
      "http://localhost:3000", // For local development
      "https://www.collabforge.xyz",
      "https://collabforge.xyz",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Enable both transports
  allowEIO3: true, // Enable compatibility with older clients
});

// Initialize socket handlers
initializeSocket(io);

// Make io available to routes if needed
app.set("io", io);

// Middleware to log errors
app.use((err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
});

// Middlware to rate limit requests globally
app.use(globalRateLimiter);

// Middleware to handle JSON and cookie parsing
const MAX_REQUEST_SIZE = process.env.MAX_REQUEST_SIZE;

app.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
app.use(bodyParser.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));
app.use(bodyParser.raw({ limit: MAX_REQUEST_SIZE }));
app.use(cookieParser());

// Middlware to secure the app by setting various HTTP headers
app.use(helmet());

// Middleware to enable CORS
const allowedOrigins = [
  "https://helpful-begonia-22aec6.netlify.app",
  "https://*.netlify.app", // For Netlify deploy previews
  "http://localhost:3000", // For local development
  "https://www.collabforge.xyz",
  "https://collabforge.xyz",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount,
  });
});

// Setup the routes
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/creators", creatorRoute);
app.use("/api/brands", brandRoute);
app.use("/api/campaigns", campaignRoute);
app.use("/api/proposals", proposalRoute);
app.use("/api/contracts", contractRoute);
app.use("/api/creator-works", creatorWorkRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/brand-reviews", brandReviewRoute);
app.use("/api/chat", chatRoute);

// Socket.IO connection info endpoint (for debugging)
app.get("/api/socket/info", (req, res) => {
  res.json({
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
  });
});

// Global error handler for unhandled routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready for connections`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

export default app;
