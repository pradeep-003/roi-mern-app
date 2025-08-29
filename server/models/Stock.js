import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    roiPercentage: { type: Number, default: 0 }, // Admin updates ROI %
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
