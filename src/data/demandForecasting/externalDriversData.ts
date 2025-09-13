export const externalDriversPreviewData = [
  { 
    name: "Holiday Calendar",
    data: [
      { date: "2024-01-01", value: "New Year" },
      { date: "2024-01-02", value: "Regular" },
      { date: "2024-01-03", value: "Regular" }
    ],
    source: "Public holidays database",
    updateFrequency: "Static/Annual"
  },
  {
    name: "Ad Spend", 
    data: [
      { date: "2024-01-01", value: "$12,500" },
      { date: "2024-01-02", value: "$8,200" },
      { date: "2024-01-03", value: "$15,000" }
    ],
    source: "Marketing platforms API",
    updateFrequency: "Daily"
  },
  {
    name: "Rainfall",
    data: [
      { date: "2024-01-01", value: "2.3mm" },
      { date: "2024-01-02", value: "0.0mm" },
      { date: "2024-01-03", value: "1.2mm" }
    ],
    source: "Weather service API", 
    updateFrequency: "Hourly"
  },
  {
    name: "Temperature",
    data: [
      { date: "2024-01-01", value: "24°C" },
      { date: "2024-01-02", value: "26°C" },
      { date: "2024-01-03", value: "22°C" }
    ],
    source: "Meteorological data",
    updateFrequency: "Hourly"
  },
  {
    name: "Economic Index",
    data: [
      { date: "2024-01-01", value: "102.4" },
      { date: "2024-01-02", value: "102.6" },
      { date: "2024-01-03", value: "102.8" }
    ],
    source: "Financial data provider",
    updateFrequency: "Daily"
  },
  {
    name: "Competitor Pricing",
    data: [
      { date: "2024-01-01", value: "$49.99" },
      { date: "2024-01-02", value: "$51.99" },
      { date: "2024-01-03", value: "$48.99" }
    ],
    source: "Price monitoring service",
    updateFrequency: "Daily"
  },
  {
    name: "Social Media Trends",
    data: [
      { date: "2024-01-01", value: "0.82" },
      { date: "2024-01-02", value: "0.75" },
      { date: "2024-01-03", value: "0.91" }
    ],
    source: "Social listening platform",
    updateFrequency: "Daily"
  },
  {
    name: "Stock Market",
    data: [
      { date: "2024-01-01", value: "1,245" },
      { date: "2024-01-02", value: "1,382" },
      { date: "2024-01-03", value: "1,156" }
    ],
    source: "Stock market API",
    updateFrequency: "Daily"
  }
];

// Helper function to get data for a specific driver
export const getDriverPreviewData = (driverName: string) => {
  const driver = externalDriversPreviewData.find(d => d.name === driverName);
  return driver || null;
};