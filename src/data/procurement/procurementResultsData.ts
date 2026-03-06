// Procurement Risk & Optimization Results Data — boAt consumer electronics context

export const supplierConcentrationData = [
  { supplier: "Shenzhen Audio Tech", share: 14, country: "China", component: "Bluetooth SoC" },
  { supplier: "Dongguan Electronics", share: 11, country: "China", component: "Speaker Drivers" },
  { supplier: "Foshan Battery Co", share: 9, country: "China", component: "Li-ion Cells" },
  { supplier: "Guangzhou PCB Ltd", share: 8, country: "China", component: "PCB Assembly" },
  { supplier: "Jiangsu Plastics", share: 7, country: "China", component: "ABS Housings" },
  { supplier: "HK Audio Components", share: 6, country: "Hong Kong", component: "MEMS Microphones" },
  { supplier: "Vietnam Audio Mfg", share: 5, country: "Vietnam", component: "Cable Assembly" },
  { supplier: "Noida Electronics", share: 4, country: "India", component: "Charging Circuits" },
  { supplier: "Shenzhen Display Co", share: 4, country: "China", component: "OLED Panels" },
  { supplier: "Bangkok Connectors", share: 3, country: "Thailand", component: "USB-C Connectors" },
];

export const countryExposureData = [
  { country: "China", share: 78, color: "hsl(0, 72%, 51%)" },
  { country: "Hong Kong", share: 12, color: "hsl(25, 95%, 53%)" },
  { country: "Vietnam", share: 5, color: "hsl(45, 93%, 47%)" },
  { country: "India", share: 3, color: "hsl(142, 71%, 45%)" },
  { country: "Thailand", share: 2, color: "hsl(199, 89%, 48%)" },
];

export const overseasTrendData = [
  { year: "FY23", share: 32 },
  { year: "FY24", share: 47 },
  { year: "FY25", share: 69 },
];

export const fxExposureData = {
  usdExposure: 5.1, // ₹B
  cnyExposure: 2.8,
  sensitivity: 260, // ₹M per 5% USD move
};

export interface SupplierRisk {
  supplier: string;
  country: string;
  share: number;
  leadTime: number;
  financialRisk: "Low" | "Medium" | "High";
  capacityRisk: "Low" | "Medium" | "High";
  complianceRisk: "Low" | "Medium" | "High";
  overallRisk: "Low" | "Medium" | "High";
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  component: string;
}

export const supplierRiskData: SupplierRisk[] = [
  { supplier: "Shenzhen Audio Tech", country: "China", share: 14, leadTime: 45, financialRisk: "Medium", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1", component: "Bluetooth SoC" },
  { supplier: "Dongguan Electronics", country: "China", share: 11, leadTime: 38, financialRisk: "Low", capacityRisk: "Medium", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1", component: "Speaker Drivers" },
  { supplier: "Foshan Battery Co", country: "China", share: 9, leadTime: 42, financialRisk: "High", capacityRisk: "Medium", complianceRisk: "Medium", overallRisk: "High", tier: "Tier 1", component: "Li-ion Cells" },
  { supplier: "Guangzhou PCB Ltd", country: "China", share: 8, leadTime: 35, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2", component: "PCB Assembly" },
  { supplier: "Jiangsu Plastics", country: "China", share: 7, leadTime: 28, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Medium", overallRisk: "Low", tier: "Tier 2", component: "ABS Housings" },
  { supplier: "HK Audio Components", country: "Hong Kong", share: 6, leadTime: 30, financialRisk: "Medium", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1", component: "MEMS Microphones" },
  { supplier: "Vietnam Audio Mfg", country: "Vietnam", share: 5, leadTime: 25, financialRisk: "Low", capacityRisk: "Medium", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2", component: "Cable Assembly" },
  { supplier: "Noida Electronics", country: "India", share: 4, leadTime: 12, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2", component: "Charging Circuits" },
  { supplier: "Shenzhen Display Co", country: "China", share: 4, leadTime: 50, financialRisk: "High", capacityRisk: "High", complianceRisk: "Low", overallRisk: "High", tier: "Tier 1", component: "OLED Panels" },
  { supplier: "Bangkok Connectors", country: "Thailand", share: 3, leadTime: 20, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 3", component: "USB-C Connectors" },
];

export interface OptimizationRec {
  component: string;
  currentStrategy: string;
  recommendedStrategy: { country: string; share: number }[];
  savingsPotential: string;
  riskReduction: "Low" | "Medium" | "High";
}

export const optimizationRecommendations: OptimizationRec[] = [
  { component: "Bluetooth PCB", currentStrategy: "100% China sourcing", recommendedStrategy: [{ country: "China", share: 60 }, { country: "Vietnam", share: 25 }, { country: "India", share: 15 }], savingsPotential: "₹180M", riskReduction: "High" },
  { component: "Speaker Drivers", currentStrategy: "100% China sourcing", recommendedStrategy: [{ country: "China", share: 70 }, { country: "Vietnam", share: 30 }], savingsPotential: "₹95M", riskReduction: "Medium" },
  { component: "Li-ion Cells", currentStrategy: "90% China / 10% HK", recommendedStrategy: [{ country: "China", share: 50 }, { country: "Vietnam", share: 30 }, { country: "India", share: 20 }], savingsPotential: "₹220M", riskReduction: "High" },
  { component: "ABS Housings", currentStrategy: "100% China sourcing", recommendedStrategy: [{ country: "China", share: 40 }, { country: "India", share: 60 }], savingsPotential: "₹65M", riskReduction: "Medium" },
  { component: "OLED Panels", currentStrategy: "100% China sourcing", recommendedStrategy: [{ country: "China", share: 75 }, { country: "Vietnam", share: 25 }], savingsPotential: "₹140M", riskReduction: "High" },
];

export const costComparisonData = {
  overseas: { component: 68, shipping: 12, duty: 11, fxRisk: 9 },
  local: { component: 82, logistics: 8, duty: 3, fxRisk: 0 },
  netSavings: "15-20%",
};

export interface SafetyStockRec {
  sku: string;
  product: string;
  warehouse: string;
  currentSS: number;
  recommendedSS: number;
  serviceLevel: number;
  leadTimeVariability: string;
  reason: string;
}

export const safetyStockData: SafetyStockRec[] = [
  { sku: "AD-701", product: "Airdopes 701", warehouse: "Mumbai", currentSS: 6200, recommendedSS: 9400, serviceLevel: 95, leadTimeVariability: "High", reason: "High supplier lead time variability" },
  { sku: "AD-441", product: "Airdopes 441", warehouse: "Delhi", currentSS: 8500, recommendedSS: 11200, serviceLevel: 95, leadTimeVariability: "Medium", reason: "Seasonal demand spikes" },
  { sku: "RB-550", product: "Rockerz 550", warehouse: "Bangalore", currentSS: 4100, recommendedSS: 5800, serviceLevel: 95, leadTimeVariability: "High", reason: "Single-source supplier risk" },
  { sku: "SW-PRO", product: "Storm Pro", warehouse: "Mumbai", currentSS: 3200, recommendedSS: 4900, serviceLevel: 98, leadTimeVariability: "High", reason: "New product launch buffer" },
  { sku: "BS-1500", product: "Stone 1500", warehouse: "Chennai", currentSS: 5600, recommendedSS: 7100, serviceLevel: 95, leadTimeVariability: "Low", reason: "High base demand volume" },
  { sku: "AD-131", product: "Airdopes 131", warehouse: "Delhi", currentSS: 12000, recommendedSS: 14500, serviceLevel: 98, leadTimeVariability: "Medium", reason: "Top seller — stockout penalty high" },
  { sku: "RB-255", product: "Rockerz 255", warehouse: "Mumbai", currentSS: 7800, recommendedSS: 9200, serviceLevel: 95, leadTimeVariability: "Medium", reason: "Multi-channel demand variance" },
];

export const prepaymentExposureData = [
  { supplier: "Shenzhen Audio Tech", prepayment: 420, cancellationRisk: 35, demandVolatility: 22 },
  { supplier: "Foshan Battery Co", prepayment: 310, cancellationRisk: 45, demandVolatility: 28 },
  { supplier: "Dongguan Electronics", prepayment: 280, cancellationRisk: 20, demandVolatility: 15 },
  { supplier: "Shenzhen Display Co", prepayment: 180, cancellationRisk: 55, demandVolatility: 32 },
  { supplier: "HK Audio Components", prepayment: 110, cancellationRisk: 25, demandVolatility: 18 },
];

export const demandScenarioImpact = {
  negative20: { excessInventory: 260, prepaymentExposure: 180 },
  base: { excessInventory: 45, prepaymentExposure: 30 },
  positive20: { excessInventory: 0, prepaymentExposure: 0, stockoutRisk: 320 },
};

export const obsolescenceData = [
  { category: "Earbuds", low: 58, medium: 30, high: 12, totalUnits: 185000 },
  { category: "Headphones", low: 65, medium: 24, high: 11, totalUnits: 92000 },
  { category: "Speakers", low: 70, medium: 22, high: 8, totalUnits: 68000 },
  { category: "Wearables", low: 55, medium: 30, high: 15, totalUnits: 45000 },
];

export const simulationDefaults = {
  leadTime: 35,
  demandVolatility: 20,
  fxRate: 84.5,
  supplierReliability: 88,
};

export const executiveSummary = {
  insights: [
    "Supplier concentration risk detected across 6 suppliers controlling 55% of procurement volume.",
    "China + Hong Kong exposure at 90% poses geopolitical and logistics disruption risks.",
    "Diversifying sourcing could reduce risk by 38% and save ₹420M annually.",
    "Safety stock levels for 5 SKUs are below stochastic model recommendations.",
  ],
  actions: [
    "Diversify PCB and battery sourcing to Vietnam and India — potential ₹400M savings.",
    "Increase safety stock for high lead-time SKUs (Airdopes 701, Storm Pro).",
    "Reduce supplier prepayments for volatile demand categories (Wearables, new launches).",
    "Accelerate local sourcing for ABS housings and cable assemblies — 15-20% duty savings.",
  ],
};
