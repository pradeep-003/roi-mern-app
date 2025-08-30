export const calculateROI = (amount, roiPercentage, purchaseDate) => {
  const today = new Date();
  const diffTime = Math.abs(today - new Date(purchaseDate));
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dailyROI = roiPercentage / 365;

  const profit = (amount * dailyROI * (days - 1)) / 100;

  return profit.toFixed(2);
};
