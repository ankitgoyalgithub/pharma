// External drivers data for Pharmaceutical Industry - India
import { promotionsData } from './promotionsData';

// Helper function to get external driver data by name
export const getExternalDriverData = (driverName: string) => {
  const key = driverName.replace(/\s+/g, '_').replace(/&/g, '');
  return externalDriversData[key as keyof typeof externalDriversData] || [];
};
import { weatherClimateData } from '../foundry/weatherClimateData';
import { seasonalIllnessData } from '../foundry/seasonalIllnessData';
import { prescriptionTrendsData } from '../foundry/prescriptionTrendsData';
import { medicalConferenceData } from '../foundry/medicalConferenceData';
import { healthcarePolicyData } from '../foundry/healthcarePolicyData';
import { genericDrugLaunchesData } from '../foundry/genericDrugLaunchesData';
import { diseaseOutbreakData } from '../foundry/diseaseOutbreakData';

export const externalDriversData = {
  // Weather & Climate Data - from Feature Store
  "Weather_Climate_Data": weatherClimateData.map(w => ({
    month: w.month,
    region: w.region,
    avgTempC: w.avg_temp_c,
    humidityIndex: w.humidity_index,
    rainfallMm: w.rainfall_mm,
    demandImpact: w.humidity_index > 0.65 ? "High" : w.humidity_index > 0.5 ? "Medium" : "Low",
    affectedCategories: w.humidity_index > 0.65 ? ["Respiratory", "Antibiotic", "ORS"] : ["Vitamins", "GI"]
  })),

  // Seasonal Illness Patterns - from Feature Store
  "Seasonal_Illness_Patterns": seasonalIllnessData.map(s => ({
    month: s.month,
    fluIndex: s.flu_index,
    dengueIndex: s.dengue_index,
    allergyIndex: s.allergy_index,
    primaryCategory: s.flu_index > 0.6 ? "Respiratory/Antibiotic" : s.dengue_index > 0.3 ? "Antipyretic/ORS" : "Allergy",
    demandMultiplier: Math.max(s.flu_index, s.dengue_index, s.allergy_index) + 0.5
  })),

  // Disease Outbreak Tracking - from Feature Store
  "Disease_Outbreak_Tracking": diseaseOutbreakData.map(d => ({
    weekStart: d.week_start,
    state: d.state,
    disease: d.disease,
    reportedCases: d.reported_cases,
    severityIndex: d.severity_index,
    affectedSKUs: d.disease === "Dengue" ? ["SKU001", "SKU006"] : 
                  d.disease === "Influenza-like illness" ? ["SKU001", "SKU002", "SKU007"] :
                  d.disease === "Chikungunya" ? ["SKU001", "SKU003", "SKU006"] : ["SKU001"],
    demandUpliftPct: Math.round(d.severity_index * 50)
  })),

  // Prescription Trends - from Feature Store
  "Prescription_Trends": prescriptionTrendsData.map(p => ({
    month: p.month,
    antibioticIndex: p.rx_index_antibiotic,
    respiratoryIndex: p.rx_index_respiratory,
    diabetesIndex: p.rx_index_diabetes,
    topMovers: p.rx_index_respiratory > 1.0 ? "Respiratory" : 
               p.rx_index_antibiotic > 1.0 ? "Antibiotic" : "Diabetes",
    trendDirection: p.rx_index_respiratory > 1.05 || p.rx_index_antibiotic > 1.05 ? "Rising" : "Stable"
  })),

  // Medical Conference Calendar - from Feature Store
  "Medical_Conference_Calendar": medicalConferenceData.map(m => ({
    eventName: m.event_name,
    city: m.city,
    startDate: m.start_date,
    endDate: m.end_date,
    therapyArea: m.therapy_area,
    expectedRxUpliftPct: m.expected_rx_uplift_pct,
    affectedSKUs: m.therapy_area === "Respiratory" ? ["SKU002", "SKU007"] :
                  m.therapy_area === "Diabetes" ? ["SKU004"] :
                  m.therapy_area === "General Medicine" ? ["SKU001", "SKU002", "SKU005"] : ["SKU001"]
  })),

  // Healthcare Policy Changes - from Feature Store
  "Healthcare_Policy_Changes": healthcarePolicyData.map(h => ({
    effectiveDate: h.effective_date,
    policyType: h.policy_type,
    agency: h.agency,
    affectedTherapyArea: h.affected_therapy_area,
    expectedDemandImpactPct: h.expected_demand_impact_pct,
    affectedSKUs: h.affected_therapy_area === "Analgesic/Antibiotic" ? ["SKU001", "SKU002", "SKU005", "SKU009"] :
                  h.affected_therapy_area === "Diabetes/GI" ? ["SKU004", "SKU006", "SKU010"] :
                  h.affected_therapy_area === "Antibiotic" ? ["SKU002", "SKU005", "SKU009"] : []
  })),

  // Generic Drug Launches - from Feature Store
  "Generic_Drug_Launches": genericDrugLaunchesData.map(g => ({
    launchMonth: g.launch_month,
    molecule: g.molecule,
    therapyArea: g.therapy_area,
    expectedPriceDropPct: g.expected_price_drop_pct,
    expectedVolumeUpliftPct: g.expected_volume_uplift_pct,
    competingWithSKU: g.molecule === "Cholecalciferol" ? "SKU008" : 
                      g.molecule === "Paracetamol" ? "SKU001" : null
  })),

  // Promotional Campaigns - using promotions data
  "Promotional_Campaigns": promotionsData.map(p => ({
    promoId: p.promoId,
    promoType: p.promoType,
    brand: p.brand,
    sku: p.sku,
    discountPct: p.discountPct,
    startWeek: p.startWeek,
    endWeek: p.endWeek,
    description: p.description,
    estimatedLift: Math.round(p.discountPct * 1.5)
  })),

  // Holiday Calendar (India focused for Pharma)
  "Holiday_Calendar": [
    { date: "2024-01-14", event: "Makar Sankranti", type: "Festival", region: "Pan-India", impact: "Medium", salesLift: 1.15, duration: 2 },
    { date: "2024-01-26", event: "Republic Day", type: "Public Holiday", region: "Pan-India", impact: "Low", salesLift: 0.85, duration: 1 },
    { date: "2024-03-25", event: "Holi", type: "Festival", region: "North/West", impact: "Medium", salesLift: 1.20, duration: 2 },
    { date: "2024-04-11", event: "Eid ul-Fitr", type: "Festival", region: "Pan-India", impact: "High", salesLift: 1.35, duration: 3 },
    { date: "2024-04-14", event: "Ambedkar Jayanti", type: "Public Holiday", region: "Pan-India", impact: "Low", salesLift: 0.90, duration: 1 },
    { date: "2024-08-15", event: "Independence Day", type: "Public Holiday", region: "Pan-India", impact: "Low", salesLift: 0.85, duration: 1 },
    { date: "2024-08-26", event: "Janmashtami", type: "Festival", region: "North/West", impact: "Medium", salesLift: 1.18, duration: 2 },
    { date: "2024-10-02", event: "Gandhi Jayanti", type: "Public Holiday", region: "Pan-India", impact: "Low", salesLift: 0.88, duration: 1 },
    { date: "2024-10-12", event: "Durga Puja/Navratri", type: "Festival", region: "East/West", impact: "High", salesLift: 1.40, duration: 9 },
    { date: "2024-11-01", event: "Diwali", type: "Festival", region: "Pan-India", impact: "Very High", salesLift: 1.65, duration: 5 },
    { date: "2024-11-15", event: "Guru Nanak Jayanti", type: "Festival", region: "North", impact: "Medium", salesLift: 1.12, duration: 1 },
    { date: "2024-12-25", event: "Christmas", type: "Commercial", region: "Metro Cities", impact: "Medium", salesLift: 1.15, duration: 3 },
  ],

  // Government Tender Schedule
  "Government_Tender_Schedule": [
    { tenderId: "CGHS-2024-Q1", authority: "CGHS", category: "Essential Medicines", openDate: "2024-01-15", closeDate: "2024-02-15", estimatedValue: "₹45Cr", affectedSKUs: ["SKU001", "SKU006", "SKU010"] },
    { tenderId: "ESIC-2024-01", authority: "ESIC", category: "Antibiotics", openDate: "2024-02-01", closeDate: "2024-03-01", estimatedValue: "₹28Cr", affectedSKUs: ["SKU002", "SKU005", "SKU009"] },
    { tenderId: "MH-PHD-2024", authority: "Maharashtra State", category: "Diabetes Care", openDate: "2024-03-15", closeDate: "2024-04-15", estimatedValue: "₹18Cr", affectedSKUs: ["SKU004"] },
    { tenderId: "TNMSC-2024-Q2", authority: "Tamil Nadu MSC", category: "ORS & Rehydration", openDate: "2024-04-01", closeDate: "2024-05-01", estimatedValue: "₹12Cr", affectedSKUs: ["SKU006"] },
    { tenderId: "CGHS-2024-Q2", authority: "CGHS", category: "Respiratory", openDate: "2024-05-15", closeDate: "2024-06-15", estimatedValue: "₹22Cr", affectedSKUs: ["SKU007", "SKU003"] },
    { tenderId: "Army-MH-2024", authority: "Army Medical", category: "Injectables", openDate: "2024-06-01", closeDate: "2024-07-01", estimatedValue: "₹35Cr", affectedSKUs: ["SKU004", "SKU009"] },
  ],

  // Hospital Procurement Cycles
  "Hospital_Procurement_Cycles": [
    { hospitalGroup: "Apollo Hospitals", procurementFrequency: "Monthly", avgOrderValue: "₹2.8Cr", paymentTerms: "45 days", topCategories: ["Diabetes", "Cardiac", "Antibiotic"] },
    { hospitalGroup: "Fortis Healthcare", procurementFrequency: "Bi-weekly", avgOrderValue: "₹1.9Cr", paymentTerms: "60 days", topCategories: ["Antibiotic", "Respiratory", "GI"] },
    { hospitalGroup: "Max Healthcare", procurementFrequency: "Monthly", avgOrderValue: "₹2.2Cr", paymentTerms: "45 days", topCategories: ["Diabetes", "Vitamins", "Antibiotic"] },
    { hospitalGroup: "Manipal Hospitals", procurementFrequency: "Bi-weekly", avgOrderValue: "₹1.5Cr", paymentTerms: "30 days", topCategories: ["Emergency Care", "Antibiotic", "ORS"] },
    { hospitalGroup: "AIIMS Network", procurementFrequency: "Quarterly", avgOrderValue: "₹8.5Cr", paymentTerms: "90 days", topCategories: ["Essential Medicines", "Injectables", "Cold Chain"] },
  ],

  // Vaccination Drives
  "Vaccination_Drives": [
    { driveName: "Universal Immunization Program", region: "Pan-India", startDate: "2024-01-01", endDate: "2024-12-31", demandImpact: "Sustained", affectedCategories: ["Vitamins", "ORS"] },
    { driveName: "Pulse Polio", region: "Pan-India", startDate: "2024-01-28", endDate: "2024-01-30", demandImpact: "Spike", affectedCategories: ["ORS", "Vitamins"] },
    { driveName: "Mission Indradhanush", region: "Underserved Districts", startDate: "2024-04-07", endDate: "2024-04-14", demandImpact: "Moderate", affectedCategories: ["Antipyretic", "ORS"] },
    { driveName: "Dengue Prevention Campaign", region: "Endemic States", startDate: "2024-06-15", endDate: "2024-10-15", demandImpact: "High", affectedCategories: ["ORS", "Antipyretic", "Allergy"] },
  ],

  // API Price Index
  "API_Price_Index": [
    { month: "2024-01", molecule: "Paracetamol", priceIndex: 1.0, trend: "Stable", importDependency: "Low" },
    { month: "2024-02", molecule: "Azithromycin", priceIndex: 1.02, trend: "Rising", importDependency: "Medium" },
    { month: "2024-03", molecule: "Cetirizine", priceIndex: 0.98, trend: "Declining", importDependency: "Low" },
    { month: "2024-04", molecule: "Insulin Glargine", priceIndex: 1.05, trend: "Rising", importDependency: "High" },
    { month: "2024-05", molecule: "Amoxicillin", priceIndex: 1.01, trend: "Stable", importDependency: "Medium" },
    { month: "2024-06", molecule: "Ceftriaxone", priceIndex: 1.08, trend: "Rising", importDependency: "High" },
  ],

  // Insurance Coverage Updates
  "Insurance_Coverage_Updates": [
    { effectiveDate: "2024-01-01", insurer: "Star Health", changeType: "Coverage Expansion", therapyArea: "Diabetes", expectedDemandImpact: "+8%", affectedSKUs: ["SKU004", "SKU010"] },
    { effectiveDate: "2024-04-01", insurer: "ICICI Lombard", changeType: "OPD Coverage", therapyArea: "General", expectedDemandImpact: "+5%", affectedSKUs: ["SKU001", "SKU003", "SKU008"] },
    { effectiveDate: "2024-07-01", insurer: "Ayushman Bharat", changeType: "Hospital Rate Revision", therapyArea: "Critical Care", expectedDemandImpact: "+12%", affectedSKUs: ["SKU004", "SKU009"] },
    { effectiveDate: "2024-10-01", insurer: "HDFC Ergo", changeType: "Preventive Care", therapyArea: "Vitamins", expectedDemandImpact: "+6%", affectedSKUs: ["SKU008"] },
  ],

  // New Product Launches
  "New_Product_Launches": [
    { launchId: "NPL001", productName: "Paracetamol 650mg FD Tablet", brand: "Calmofen Plus", launchDate: "2024-02-01", therapyArea: "Analgesic", expectedVolume: 50000, cannibalizationRisk: "SKU001" },
    { launchId: "NPL002", productName: "Azithromycin 250mg Suspension", brand: "AziSure Junior", launchDate: "2024-03-15", therapyArea: "Antibiotic", expectedVolume: 25000, cannibalizationRisk: "None" },
    { launchId: "NPL003", productName: "Insulin Aspart Pen", brand: "Rapidis", launchDate: "2024-05-01", therapyArea: "Diabetes", expectedVolume: 8000, cannibalizationRisk: "SKU004" },
    { launchId: "NPL004", productName: "Vitamin D3 + K2 Combo", brand: "D3Max Plus", launchDate: "2024-09-01", therapyArea: "Vitamins", expectedVolume: 35000, cannibalizationRisk: "SKU008" },
  ],
};