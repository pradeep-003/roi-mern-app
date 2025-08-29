import express from "express";
import multer from "multer";
import path from "path";
import Payment from "../models/Payment.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------- Multer storage (screenshots + QR) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png/.test(
      path.extname(file.originalname).toLowerCase()
    );
    ok ? cb(null, true) : cb(new Error("Only images allowed"));
  },
});

// -------- USER: Upload payment screenshot ----------
router.post(
  "/upload",
  authMiddleware(["user"]),
  upload.single("screenshot"),
  async (req, res) => {
    try {
      const { method, amount } = req.body;
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount required" });
      }

      const payment = await Payment.create({
        userId: req.user.id,
        method,
        amount: Number(amount),
        screenshot: req.file?.filename,
      });

      res.status(201).json({ message: "Payment uploaded", payment });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// -------- ADMIN: List all payments ----------
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- ADMIN: Approve/Reject + wallet credit on approve ----------
router.put("/:id/status", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Idempotency: avoid double processing
    if (payment.processed) {
      return res.json({ message: "Already processed", payment });
    }

    payment.status = status;
    if (status === "approved") {
      payment.approvedAt = new Date();

      // Credit wallet
      const user = await User.findById(payment.userId);
      user.walletBalance = (user.walletBalance || 0) + Number(payment.amount);
      await user.save();

      payment.processed = true;
      await payment.save();
      return res.json({
        message: "Payment approved & wallet credited",
        payment,
      });
    } else if (status === "rejected") {
      payment.processed = true;
      await payment.save();
      return res.json({ message: "Payment rejected", payment });
    }

    res.status(400).json({ message: "Invalid status" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- ADMIN: Set UPI/QR (create or update) ----------
router.post(
  "/method",
  authMiddleware(["admin"]),
  upload.single("qrImage"),
  async (req, res) => {
    try {
      const { upiId } = req.body;
      const qrImage = req.file?.filename;

      let settings = await Settings.findOne();
      if (!settings) settings = new Settings();

      if (upiId) settings.upiId = upiId;
      if (qrImage) settings.qrImage = qrImage;

      await settings.save();
      res.json({ message: "Payment method saved", settings });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// -------- PUBLIC/USER: Get current UPI/QR for display ----------
router.get("/method", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/paymentRoutes.js

// GET approved payments
router.get("/approved", authMiddleware(["admin"]), async (req, res) => {
  try {
    const payments = await Payment.find({ status: "approved" }).populate(
      "userId",
      "username email"
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET rejected payments
router.get("/rejected", authMiddleware(["admin"]), async (req, res) => {
  try {
    const payments = await Payment.find({ status: "rejected" }).populate(
      "userId",
      "username email"
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
