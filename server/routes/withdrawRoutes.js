import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { weekendRestriction } from "../middleware/weekendMiddleware.js";
import Withdraw from "../models/Withdraw.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js"; // ✅ FIX ADDED

const router = express.Router();

router.post(
  "/",
  authMiddleware(["user"]),
  weekendRestriction,
  async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount required" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.walletBalance < amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      user.walletBalance -= amount;
      await user.save();

      const withdraw = await Withdraw.create({
        userId: user._id,
        amount,
      });

      await Transaction.create({
        userId: user._id,
        amount,
        type: "withdraw",
        status: "pending",
      });

      res
        .status(201)
        .json({ message: "Withdrawal request submitted", withdraw });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get("/", authMiddleware(["admin"]), async (req, res) => {
  const requests = await Withdraw.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email");
  res.json(requests);
});

router.put("/:id/status", authMiddleware(["admin"]), async (req, res) => {
  const { status } = req.body;
  const withdraw = await Withdraw.findById(req.params.id);
  if (!withdraw) return res.status(404).json({ message: "Withdraw not found" });
  if (withdraw.processed)
    return res.json({ message: "Already processed", withdraw });

  withdraw.status = status;

  const txn = await Transaction.findOne({
    userId: withdraw.userId,
    amount: withdraw.amount,
    type: "withdraw",
    status: "pending",
  }).sort({ createdAt: -1 });

  if (status === "approved") {
    withdraw.approvedAt = new Date();
    withdraw.processed = true;
    await withdraw.save();

    if (txn) {
      txn.status = "completed";
      await txn.save();
    }

    return res.json({
      message: "Withdraw approved & wallet deducted",
      withdraw,
    });
  } else if (status === "rejected") {
    const user = await User.findById(withdraw.userId);
    user.walletBalance += withdraw.amount;
    await user.save();

    withdraw.processed = true;
    await withdraw.save();

    if (txn) {
      txn.status = "refunded";
      await txn.save();
    }

    return res.json({ message: "Withdraw rejected & refunded", withdraw });
  }

  res.status(400).json({ message: "Invalid status" });
});

export default router;
