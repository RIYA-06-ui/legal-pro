const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

console.log("Starting LegalPro server...");
console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);

// Import routes
console.log("Importing documentRoutes...");
const documentAnalysisRoutes = require("./routes/documentRoutes");
console.log("documentRoutes imported");

console.log("Importing chatRoutes...");
const chatRoutes = require("./routes/chatRoutes");
console.log("chatRoutes imported");

console.log("Importing benchmarkRoutes...");
const benchmarkRoutes = require("./routes/benchmarkRoutes");
console.log("benchmarkRoutes imported");

console.log("Routes imported successfully");

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173", // Vite default port
      "http://localhost:5174", // Alternative Vite port
      "http://localhost:5175", // Another Vite port
      "http://localhost:3000", // Create React App default port
      "https://legalpro.vercel.app", // Production frontend URL
      /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel apps
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/document", documentAnalysisRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/benchmark", benchmarkRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "LegalPro API",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// 404 handler - must be last middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
