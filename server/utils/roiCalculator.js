export const calculateROI = (amount, roiPercentage, purchaseDate) => {
  const today = new Date();
  const diffTime = Math.abs(today - new Date(purchaseDate));
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // kitne din hue

  // Simple ROI formula → daily ROI apply (example logic)
  const profit = (amount * roiPercentage * days) / 100;
  return profit.toFixed(2);
};
