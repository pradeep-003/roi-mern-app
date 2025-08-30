import express from "express";
import Transaction from "../models/Transaction.js";
import Stock from "../models/Stock.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { calculateROI } from "../utils/roiCalculator.js";

const router = express.Router();

router.get("/", authMiddleware(["user"]), async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      type: "buy",
      status: "completed",
      sold: false,
    }).populate("stockId");

    const result = transactions.map((t) => {
      const profit = calculateROI(
        t.amount,
        t.stockId.roiPercentage,
        t.purchaseDate
      );
      return {
        stockId: t.stockId._id,
        stock: t.stockId.name,
        amount: t.amount,
        roiPercentage: t.stockId.roiPercentage,
        purchaseDate: t.purchaseDate,
        profit,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
