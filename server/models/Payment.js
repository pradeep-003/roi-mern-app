import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    method: { type: String, required: true },
    amount: { type: Number, required: true },

    screenshot: { type: String },
    screenshotUrl: { type: String },
    screenshotPublicId: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: { type: Date },
    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
