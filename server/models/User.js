import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    kyc: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
