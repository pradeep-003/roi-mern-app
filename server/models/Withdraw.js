import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
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

export default mongoose.model("Withdraw", withdrawSchema);
