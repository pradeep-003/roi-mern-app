import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    upiId: { type: String },
    qrImage: { type: String },
    qrImageUrl: { type: String },
    qrImagePublicId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
