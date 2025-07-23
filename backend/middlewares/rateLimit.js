import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 50,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default globalRateLimiter;
