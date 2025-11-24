// External drivers aligned with Feature Store entities in Foundry
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  // Pharma-specific feature store drivers
  const featureStoreDrivers = [
    { name: "Healthcare Policy Changes", autoSelected: true, icon: "FileText" },
    { name: "Disease Outbreak Tracking", autoSelected: true, icon: "Activity" },
    { name: "Drug Patent Expirations", autoSelected: false, icon: "Clock" },
    { name: "Clinical Trial Outcomes", autoSelected: false, icon: "Microscope" },
    { name: "Hospital Admission Rates", autoSelected: false, icon: "Building2" },
    { name: "Seasonal Illness Patterns", autoSelected: false, icon: "CalendarDays" },
    { name: "Weather & Climate Data", autoSelected: false, icon: "CloudRain" },
    { name: "Generic Drug Launches", autoSelected: false, icon: "Pill" },
    { name: "Insurance Coverage Changes", autoSelected: false, icon: "Shield" },
    { name: "Prescription Trends", autoSelected: false, icon: "ClipboardList" },
    { name: "Regulatory Approvals (FDA/EMA)", autoSelected: false, icon: "CheckCircle" },
    { name: "Healthcare Spending", autoSelected: false, icon: "DollarSign" },
    { name: "Competitor Drug Launches", autoSelected: false, icon: "Users" },
    { name: "Medical Conference Calendar", autoSelected: false, icon: "Calendar" },
    { name: "Pharmacy Network Expansion", autoSelected: false, icon: "MapPin" },
  ];

  // Return feature store drivers for all study types to maintain consistency
  return featureStoreDrivers;
};