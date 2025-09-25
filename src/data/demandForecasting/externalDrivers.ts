// External drivers for different study types
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  const driverSets = {
    "demand-forecasting": [
      { name: "Holiday Calendar", autoSelected: hasData, icon: "Calendar" },
      { name: "Ad Spend", autoSelected: hasData, icon: "DollarSign" },
      { name: "Rainfall", autoSelected: false, icon: "CloudRain" },
      { name: "Temperature", autoSelected: false, icon: "TrendingUp" },
      { name: "Economic Index", autoSelected: false, icon: "BarChart3" },
      { name: "Competitor Pricing", autoSelected: hasData, icon: "Users" },
      { name: "Social Media Trends", autoSelected: false, icon: "MessageCircle" },
      { name: "Stock Market", autoSelected: false, icon: "Award" },
    ],
    "inventory-optimization": [
      { name: "Lead Time Variability", autoSelected: hasData, icon: "Timer" },
      { name: "Supplier Reliability", autoSelected: hasData, icon: "Truck" },
      { name: "Demand Seasonality", autoSelected: false, icon: "Calendar" },
      { name: "Economic Indicators", autoSelected: false, icon: "TrendingUp" },
      { name: "Supply Chain Events", autoSelected: false, icon: "AlertTriangle" },
      { name: "Weather Patterns", autoSelected: false, icon: "CloudRain" },
      { name: "Market Volatility", autoSelected: false, icon: "BarChart3" },
      { name: "Transportation Costs", autoSelected: false, icon: "MapPin" },
    ],
    "production-planning": [
      { name: "Maintenance Calendar", autoSelected: hasData, icon: "Settings" },
      { name: "Labor Availability", autoSelected: hasData, icon: "Users" },
      { name: "Supplier Lead Times", autoSelected: hasData, icon: "Timer" },
      { name: "QC/Inspection Slots", autoSelected: false, icon: "Award" },
      { name: "Setup Family Grouping", autoSelected: false, icon: "TrendingUp" },
      { name: "Energy Costs", autoSelected: false, icon: "Zap" },
      { name: "Raw Material Prices", autoSelected: false, icon: "Package" },
      { name: "Equipment Utilization", autoSelected: false, icon: "Factory" },
    ],
    "financial-planning": [
      { name: "Exchange Rates", autoSelected: hasData, icon: "DollarSign" },
      { name: "Interest Rates", autoSelected: hasData, icon: "TrendingUp" },
      { name: "Inflation Data", autoSelected: false, icon: "BarChart3" },
      { name: "GDP Growth", autoSelected: false, icon: "LineChart" },
      { name: "Market Indices", autoSelected: false, icon: "PieChart" },
      { name: "Commodity Prices", autoSelected: false, icon: "Coins" },
      { name: "Credit Spreads", autoSelected: false, icon: "CreditCard" },
      { name: "Currency Volatility", autoSelected: false, icon: "Repeat" },
    ],
    "capex-planning": [
      { name: "Equipment Lifecycle", autoSelected: hasData, icon: "Settings" },
      { name: "Technology Trends", autoSelected: hasData, icon: "Cpu" },
      { name: "Regulatory Changes", autoSelected: false, icon: "FileText" },
      { name: "Market Expansion", autoSelected: false, icon: "TrendingUp" },
      { name: "Competitor Investments", autoSelected: false, icon: "Users" },
      { name: "Energy Efficiency", autoSelected: false, icon: "Zap" },
      { name: "Safety Requirements", autoSelected: false, icon: "Shield" },
      { name: "Environmental Impact", autoSelected: false, icon: "Leaf" },
    ],
    "opex-planning": [
      { name: "Energy Cost Trends", autoSelected: hasData, icon: "Zap" },
      { name: "Labor Market Data", autoSelected: hasData, icon: "Users" },
      { name: "Inflation Forecasts", autoSelected: false, icon: "TrendingUp" },
      { name: "Supplier Pricing", autoSelected: false, icon: "DollarSign" },
      { name: "Utility Rates", autoSelected: false, icon: "Plug" },
      { name: "Insurance Costs", autoSelected: false, icon: "Shield" },
      { name: "Maintenance Schedules", autoSelected: false, icon: "Settings" },
      { name: "Regulatory Compliance", autoSelected: false, icon: "FileCheck" },
    ]
  };

  return driverSets[studyType] || driverSets["demand-forecasting"];
};