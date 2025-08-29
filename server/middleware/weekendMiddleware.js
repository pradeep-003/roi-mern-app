export const weekendRestriction = (req, res, next) => {
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  if (today === 0 || today === 6) {
    return res
      .status(403)
      .json({ message: "Withdrawals are not allowed on weekends" });
  }
  next();
};
