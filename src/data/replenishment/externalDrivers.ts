// External drivers for pharmaceutical inventory optimization
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  const pharmaInventoryDrivers = [
    { name: "Seasonal_Illness_Patterns", autoSelected: hasData, icon: "Thermometer" },
    { name: "Disease_Outbreak_Tracking", autoSelected: hasData, icon: "AlertTriangle" },
    { name: "Cold_Chain_Availability", autoSelected: hasData, icon: "Snowflake" },
    { name: "Supplier_Lead_Time_Variability", autoSelected: false, icon: "Clock" },
    { name: "Batch_Expiry_Risk", autoSelected: false, icon: "Calendar" },
    { name: "Healthcare_Policy_Changes", autoSelected: false, icon: "FileText" },
    { name: "Generic_Competition_Impact", autoSelected: false, icon: "TrendingDown" },
    { name: "Hospital_Tender_Cycles", autoSelected: false, icon: "Building" },
  ];

  return pharmaInventoryDrivers;
};

export const driverDescriptions: Record<string, { description: string; impact: string }> = {
  "Seasonal_Illness_Patterns": {
    description: "Tracks monsoon infections, winter respiratory issues, and summer GI cases across regions",
    impact: "20-40% demand variation for antibiotics, ORS, respiratory medications"
  },
  "Disease_Outbreak_Tracking": {
    description: "Real-time monitoring of dengue, malaria, flu outbreaks by district",
    impact: "Sudden 2-5x demand spikes requiring emergency replenishment"
  },
  "Cold_Chain_Availability": {
    description: "Temperature-controlled storage and transport capacity at each node",
    impact: "Critical constraint for insulin, vaccines, biologics placement"
  },
  "Supplier_Lead_Time_Variability": {
    description: "Historical supplier performance and delivery reliability metrics",
    impact: "Safety stock calculations for API and finished goods"
  },
  "Batch_Expiry_Risk": {
    description: "Near-expiry inventory alerts and FEFO compliance tracking",
    impact: "Write-off prevention and stock rotation optimization"
  },
  "Healthcare_Policy_Changes": {
    description: "NLEM updates, pricing ceiling changes, import regulations",
    impact: "Stock adjustments for price-controlled essential medicines"
  },
  "Generic_Competition_Impact": {
    description: "New generic launches and market share erosion patterns",
    impact: "Demand cannibalization planning for branded products"
  },
  "Hospital_Tender_Cycles": {
    description: "Government and institutional tender award schedules",
    impact: "Bulk order fulfillment capacity planning"
  }
};
