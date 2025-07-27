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
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import creatorRoute from "./routes/creatorRoute.js";
import brandRoute from "./routes/brandRoute.js";
import campaignRoute from "./routes/campaignRoute.js";
import proposalRoute from "./routes/proposalRoute.js";
import contractRoute from "./routes/contractRoute.js";

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

// Setup the routes
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/creators", creatorRoute);
app.use("/api/brands", brandRoute);
app.use("/api/campaigns", campaignRoute);
app.use("/api/proposals", proposalRoute);
app.use("/api/contracts", contractRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
