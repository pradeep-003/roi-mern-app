import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    upiId: { type: String },
    qrImage: { type: String }, // file name stored in /uploads
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
