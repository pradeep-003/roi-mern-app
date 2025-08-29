import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["buy", "sell"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    paymentScreenshot: { type: String },
    purchaseDate: { type: Date, default: Date.now }, // ✅ Added
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
