import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    upiId: { type: String },
    qrImage: { type: String }, // old local filename (fallback)
    qrImageUrl: { type: String }, // NEW
    qrImagePublicId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
