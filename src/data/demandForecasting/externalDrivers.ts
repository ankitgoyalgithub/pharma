// External drivers aligned with Feature Store entities in Foundry
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  // Common feature store drivers available for all study types
  const featureStoreDrivers = [
    { name: "Holiday Calendar", autoSelected: hasData, icon: "Calendar" },
    { name: "Event Calendar", autoSelected: false, icon: "CalendarDays" },
    { name: "Crude Oil Prices", autoSelected: false, icon: "Fuel" },
    { name: "NSE Index", autoSelected: false, icon: "TrendingUp" },
    { name: "NASDAQ Index", autoSelected: false, icon: "LineChart" },
    { name: "Weather Data", autoSelected: false, icon: "CloudRain" },
    { name: "Exchange Rates", autoSelected: false, icon: "DollarSign" },
    { name: "Interest Rates", autoSelected: false, icon: "Percent" },
    { name: "Inflation Data", autoSelected: false, icon: "BarChart3" },
    { name: "GDP Growth", autoSelected: false, icon: "TrendingUp" },
    { name: "Commodity Prices", autoSelected: false, icon: "Package" },
    { name: "Labor Market Data", autoSelected: hasData, icon: "Users" },
    { name: "Supply Chain Events", autoSelected: false, icon: "Truck" },
    { name: "Regulatory Changes", autoSelected: false, icon: "FileText" },
  ];

  // Return feature store drivers for all study types to maintain consistency
  return featureStoreDrivers;
};