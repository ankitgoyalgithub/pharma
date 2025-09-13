export const getExternalDrivers = (hasData: boolean) => [
  { name: "Holiday Calendar", autoSelected: hasData, icon: "Calendar" },
  { name: "Ad Spend", autoSelected: hasData, icon: "DollarSign" },
  { name: "Rainfall", autoSelected: false, icon: "CloudRain" },
  { name: "Temperature", autoSelected: false, icon: "TrendingUp" },
  { name: "Economic Index", autoSelected: false, icon: "BarChart3" },
  { name: "Competitor Pricing", autoSelected: hasData, icon: "Users" },
  { name: "Social Media Trends", autoSelected: false, icon: "MessageCircle" },
  { name: "Stock Market", autoSelected: false, icon: "Award" },
];