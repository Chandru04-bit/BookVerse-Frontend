import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===================================
// STEP 1 — Normal CORS
// ===================================
app.use(
  cors({
    origin: "https://book-verse-frontend-vm56.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===================================
// STEP 2 — Manual CORS headers (Fix for Vercel)
// ===================================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://book-verse-frontend-vm56.vercel.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight request success
  }
  next();
});

// Parse JSON body
app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================================
// MongoDB Connection
// ===================================
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===================================
// Health Check Route
// ===================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// ===================================
// API Routes
// ===================================
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Temporary mock orders route
app.get("/api/orders", (req, res) => {
  res.json({
    orders: [
      { _id: "1", user: "John Doe", total: 499, status: "Delivered", date: "2025-11-07" },
      { _id: "2", user: "Jane Smith", total: 799, status: "Pending", date: "2025-11-06" },
      { _id: "3", user: "Mark Wilson", total: 299, status: "Processing", date: "2025-11-05" },
    ],
  });
});

// ===================================
// Default Route
// ===================================
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running successfully...");
});

// ===================================
// Export for Vercel
// ===================================
export default app;

