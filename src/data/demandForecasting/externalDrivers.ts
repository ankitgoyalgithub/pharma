// External drivers aligned with Feature Store entities in Foundry - Pharmaceutical Industry
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  // Pharma-specific feature store drivers
  const featureStoreDrivers = [
    { name: "Weather & Climate Data", autoSelected: true, icon: "CloudRain" },
    { name: "Seasonal Illness Patterns", autoSelected: true, icon: "Thermometer" },
    { name: "Disease Outbreak Tracking", autoSelected: true, icon: "Activity" },
    { name: "Promotional Campaigns", autoSelected: true, icon: "Tag" },
    { name: "Seasonality Trends", autoSelected: true, icon: "TrendingUp" },
    { name: "Prescription Trends", autoSelected: false, icon: "Pill" },
    { name: "Medical Conference Calendar", autoSelected: false, icon: "Calendar" },
    { name: "Healthcare Policy Changes", autoSelected: false, icon: "FileText" },
    { name: "Generic Drug Launches", autoSelected: false, icon: "Package" },
    { name: "Holiday Calendar", autoSelected: false, icon: "Gift" },
    { name: "Government Tender Schedule", autoSelected: false, icon: "Building" },
    { name: "New Product Launches", autoSelected: false, icon: "Sparkles" },
    { name: "API Price Index", autoSelected: false, icon: "DollarSign" },
    { name: "Hospital Procurement Cycles", autoSelected: false, icon: "ShoppingCart" },
    { name: "Vaccination Drives", autoSelected: false, icon: "Shield" },
    { name: "Insurance Coverage Updates", autoSelected: false, icon: "Heart" },
  ];

  // Return feature store drivers for all study types to maintain consistency
  return featureStoreDrivers;
};