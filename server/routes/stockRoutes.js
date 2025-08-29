import express from "express";
import Stock from "../models/Stock.js";
import Transaction from "../models/Transaction.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ADMIN: Add new stock
router.post("/add", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { name, price, roiPercentage } = req.body;
    const stock = await Stock.create({ name, price, roiPercentage });
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Edit stock
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Delete stock
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER: Get all active stocks
router.get("/", authMiddleware(), async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/stockRoutes.js (patch for buy/sell handlers)

// ... existing add/edit/delete/get routes remain ...

// USER: Buy stock (immediate completion if funds available)
router.post("/buy/:stockId", authMiddleware(["user"]), async (req, res) => {
  try {
    const { amount } = req.body;
    const stockId = req.params.stockId;

    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Valid amount required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((user.walletBalance || 0) < Number(amount))
      return res.status(400).json({ message: "Insufficient wallet balance" });

    // debit wallet
    user.walletBalance = (user.walletBalance || 0) - Number(amount);
    await user.save();

    // record transaction as completed
    const transaction = await Transaction.create({
      userId: req.user.id,
      stockId,
      amount: Number(amount),
      type: "buy",
      status: "completed",
      purchaseDate: new Date(),
    });

    res.status(201).json({
      message: "Purchase completed",
      transaction,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER: Sell stock (credit wallet with principal + ROI profit)
// USER: Sell stock (credit wallet with principal + ROI profit)
router.post("/sell/:stockId", authMiddleware(["user"]), async (req, res) => {
  try {
    const { amount } = req.body;
    const stockId = req.params.stockId;

    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Valid amount required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔍 Find a matching unsold buy transaction
    const buyTxn = await Transaction.findOne({
      userId: req.user.id,
      stockId,
      type: "buy",
      status: "completed",
      sold: false, // 🆕 only active investments
    }).sort({ createdAt: 1 });

    if (!buyTxn) {
      return res.status(400).json({ message: "No active investment found" });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const { calculateROI } = await import("../utils/roiCalculator.js");
    const profit = calculateROI(
      buyTxn.amount,
      stock.roiPercentage,
      buyTxn.purchaseDate
    );

    const totalCredit = buyTxn.amount + Number(profit);

    // ✅ Credit wallet
    user.walletBalance = (user.walletBalance || 0) + totalCredit;
    await user.save();

    // Mark buy transaction as sold
    buyTxn.sold = true; // 🆕
    await buyTxn.save();

    // Record sell transaction
    const sellTxn = await Transaction.create({
      userId: req.user.id,
      stockId,
      amount: totalCredit,
      type: "sell",
      status: "completed",
    });

    res.status(201).json({
      message: `Sell completed. You earned ₹${profit} profit.`,
      transaction: sellTxn,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
