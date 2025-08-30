import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["buy", "sell", "deposit", "withdraw"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    sold: { type: Boolean, default: false },
    paymentScreenshot: { type: String },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
