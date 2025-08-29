import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { weekendRestriction } from "../middleware/weekendMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware(["user"]), weekendRestriction, (req, res) => {
  res.json({ message: "Withdrawal request submitted successfully" });
});

export default router;
