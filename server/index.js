import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import path from "path";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import roiRoutes from "./routes/roiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fs from "fs";

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/uploads", express.static("uploads")); // to serve uploaded files
app.use("/api/payments", paymentRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("ROI MERN Backend is running...");
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/roi_app";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
