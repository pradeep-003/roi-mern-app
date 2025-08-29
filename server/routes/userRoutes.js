import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select("-password");
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
