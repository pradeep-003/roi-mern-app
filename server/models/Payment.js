import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    method: { type: String, required: true }, // UPI/QR
    amount: { type: Number, required: true }, // ✅ add amount to credit wallet
    screenshot: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: { type: Date }, // ✅ for audit
    processed: { type: Boolean, default: false }, // ✅ prevents double-credit
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
