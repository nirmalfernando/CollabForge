import express from "express";
import dotenv from "dotenv";
import sequelize from "./connect.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import logger from "./middlewares/logger.js";
import bodyParser from "body-parser";
import globalRateLimiter from "./middlewares/rateLimit.js";
import "./models/Associations.js";
import JobScheduler from "./jobs/jobScheduler.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initializeSocket } from "./socket/socketHandler.js";

// Route imports
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
import recommendationRoute from "./routes/recommendationRoute.js";
import chatRoute from "./routes/chatRoute.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "https://helpful-begonia-22aec6.netlify.app",
      "https://*.netlify.app",
      "http://localhost:3000",
      "https://www.collabforge.xyz",
      "https://collabforge.xyz",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize the database and start server
const initializeServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync the models with the database
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");

    // Initialize job scheduler after database sync
    await JobScheduler.initialize();
    console.log("Job scheduler initialized successfully.");

    // Initialize Socket.IO handlers
    initializeSocket(io);
    console.log("Socket.IO initialized successfully.");

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
      logger.info(`Server started on port ${PORT} with Socket.IO support`);
    });

  } catch (error) {
    console.error("Failed to initialize server:", error);
    logger.error("Server initialization failed", { error: error.message });
    process.exit(1);
  }
};

// Middleware to log errors
app.use((err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
});

// Middleware to rate limit requests globally
app.use(globalRateLimiter);

// Middleware to handle JSON and cookie parsing
const MAX_REQUEST_SIZE = process.env.MAX_REQUEST_SIZE || "50mb";

app.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
app.use(bodyParser.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));
app.use(bodyParser.raw({ limit: MAX_REQUEST_SIZE }));
app.use(cookieParser());

// Middleware to secure the app by setting various HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow Socket.IO to work properly
}));

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
      
      // Check for exact matches or wildcard Netlify domains
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin === origin) return true;
        if (allowedOrigin.includes("*") && origin && origin.includes("netlify.app")) return true;
        return false;
      });
      
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// Make io accessible to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
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
app.use("/api/recommendations", recommendationRoute);
app.use("/api/chat", chatRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount,
  });
});

// Socket.IO connection info endpoint
app.get("/api/socket/info", (req, res) => {
  res.status(200).json({
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error("Global error handler", { 
    error: error.message, 
    stack: error.stack,
    url: req.url,
    method: req.method 
  });
  
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

// Call the function to initialize the database and server
initializeServer();