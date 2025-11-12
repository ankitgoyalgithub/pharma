export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  const assortmentDrivers = [
    { name: "Trend Analysis", autoSelected: hasData, icon: "TrendingUp" },
    { name: "Seasonality Patterns", autoSelected: hasData, icon: "Calendar" },
    { name: "Store Clustering", autoSelected: false, icon: "Store" },
    { name: "Price Sensitivity", autoSelected: false, icon: "DollarSign" },
    { name: "Competitive Intelligence", autoSelected: false, icon: "Users" },
    { name: "Margin Optimization", autoSelected: false, icon: "Target" },
    { name: "Space Constraints", autoSelected: false, icon: "Maximize" },
    { name: "Customer Demographics", autoSelected: false, icon: "UserCircle" },
  ];

  return assortmentDrivers;
};
