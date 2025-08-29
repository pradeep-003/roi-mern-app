export const calculateROI = (amount, roiPercentage, purchaseDate) => {
  const today = new Date();
  const diffTime = Math.abs(today - new Date(purchaseDate));
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // how many days passed

  // convert annual ROI% → daily ROI%
  const dailyROI = roiPercentage / 365;

  // profit = principal × dailyROI% × days
  const profit = (amount * dailyROI * (days - 1)) / 100;

  return profit.toFixed(2);
};
