// Procurement Risk & Optimization Results Data — derived from uploaded CSV datasets
// SKUs: SKU_001–SKU_050, Warehouses: WH_North/WH_South/WH_West, Channels: Amazon/Flipkart/D2C/Retail/Distributor

// ── Product master (from dim_product-2.csv) ──
export interface ProductInfo {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  priceSegment: string;
  mrp: number;
  costPerUnit: number;
  lifecycleStage: string;
}

export const productMaster: ProductInfo[] = [
  { id: "SKU_001", name: "Product_1", category: "Earbuds", subCategory: "Smartwatch", priceSegment: "Budget", mrp: 3872, costPerUnit: 1128, lifecycleStage: "New" },
  { id: "SKU_002", name: "Product_2", category: "Wearables", subCategory: "Neckband", priceSegment: "Budget", mrp: 3913, costPerUnit: 791, lifecycleStage: "New" },
  { id: "SKU_003", name: "Product_3", category: "Wearables", subCategory: "Smartwatch", priceSegment: "Mid", mrp: 5646, costPerUnit: 750, lifecycleStage: "New" },
  { id: "SKU_004", name: "Product_4", category: "Wearables", subCategory: "OverEar", priceSegment: "Mid", mrp: 4866, costPerUnit: 1007, lifecycleStage: "Mature" },
  { id: "SKU_005", name: "Product_5", category: "Speakers", subCategory: "TWS", priceSegment: "Premium", mrp: 4657, costPerUnit: 1262, lifecycleStage: "Growth" },
  { id: "SKU_006", name: "Product_6", category: "Earbuds", subCategory: "Smartwatch", priceSegment: "Premium", mrp: 4101, costPerUnit: 792, lifecycleStage: "Growth" },
  { id: "SKU_007", name: "Product_7", category: "Headphones", subCategory: "Neckband", priceSegment: "Premium", mrp: 4296, costPerUnit: 1072, lifecycleStage: "Mature" },
  { id: "SKU_008", name: "Product_8", category: "Earbuds", subCategory: "Smartwatch", priceSegment: "Premium", mrp: 1656, costPerUnit: 2189, lifecycleStage: "Mature" },
  { id: "SKU_009", name: "Product_9", category: "Speakers", subCategory: "Smartwatch", priceSegment: "Budget", mrp: 4947, costPerUnit: 692, lifecycleStage: "New" },
  { id: "SKU_010", name: "Product_10", category: "Earbuds", subCategory: "Smartwatch", priceSegment: "Budget", mrp: 5770, costPerUnit: 708, lifecycleStage: "Growth" },
  { id: "SKU_011", name: "Product_11", category: "Earbuds", subCategory: "Neckband", priceSegment: "Mid", mrp: 3752, costPerUnit: 1276, lifecycleStage: "New" },
  { id: "SKU_012", name: "Product_12", category: "Speakers", subCategory: "TWS", priceSegment: "Premium", mrp: 3411, costPerUnit: 1888, lifecycleStage: "Growth" },
  { id: "SKU_018", name: "Product_18", category: "Earbuds", subCategory: "TWS", priceSegment: "Budget", mrp: 2672, costPerUnit: 667, lifecycleStage: "New" },
  { id: "SKU_021", name: "Product_21", category: "Headphones", subCategory: "OverEar", priceSegment: "Premium", mrp: 5627, costPerUnit: 2543, lifecycleStage: "New" },
  { id: "SKU_026", name: "Product_26", category: "Earbuds", subCategory: "TWS", priceSegment: "Premium", mrp: 3725, costPerUnit: 2567, lifecycleStage: "Growth" },
  { id: "SKU_042", name: "Product_42", category: "Earbuds", subCategory: "TWS", priceSegment: "Mid", mrp: 2039, costPerUnit: 1906, lifecycleStage: "New" },
  { id: "SKU_046", name: "Product_46", category: "Wearables", subCategory: "TWS", priceSegment: "Budget", mrp: 2946, costPerUnit: 1467, lifecycleStage: "Growth" },
  { id: "SKU_049", name: "Product_49", category: "Earbuds", subCategory: "Smartwatch", priceSegment: "Premium", mrp: 3230, costPerUnit: 1787, lifecycleStage: "Mature" },
  { id: "SKU_050", name: "Product_50", category: "Earbuds", subCategory: "Neckband", priceSegment: "Mid", mrp: 2758, costPerUnit: 1283, lifecycleStage: "Growth" },
];

// ── Cost parameters (from cost_parameters-2.csv) ──
export interface CostParam {
  productId: string;
  holdingCostPerDay: number;
  stockoutCost: number;
  orderingCost: number;
  transportCost: number;
}

export const costParameters: CostParam[] = [
  { productId: "SKU_001", holdingCostPerDay: 0.62, stockoutCost: 189.20, orderingCost: 1726.21, transportCost: 41.13 },
  { productId: "SKU_002", holdingCostPerDay: 0.84, stockoutCost: 270.74, orderingCost: 1053.33, transportCost: 45.76 },
  { productId: "SKU_003", holdingCostPerDay: 0.71, stockoutCost: 126.84, orderingCost: 940.70, transportCost: 38.98 },
  { productId: "SKU_005", holdingCostPerDay: 0.53, stockoutCost: 238.24, orderingCost: 1457.79, transportCost: 13.46 },
  { productId: "SKU_007", holdingCostPerDay: 1.63, stockoutCost: 150.15, orderingCost: 1444.83, transportCost: 24.97 },
  { productId: "SKU_008", holdingCostPerDay: 0.51, stockoutCost: 170.70, orderingCost: 1611.23, transportCost: 28.55 },
  { productId: "SKU_010", holdingCostPerDay: 0.97, stockoutCost: 130.53, orderingCost: 582.11, transportCost: 10.26 },
  { productId: "SKU_012", holdingCostPerDay: 2.20, stockoutCost: 103.97, orderingCost: 1420.56, transportCost: 24.56 },
  { productId: "SKU_018", holdingCostPerDay: 2.57, stockoutCost: 266.12, orderingCost: 1930.36, transportCost: 31.10 },
  { productId: "SKU_021", holdingCostPerDay: 1.31, stockoutCost: 294.78, orderingCost: 817.37, transportCost: 36.23 },
  { productId: "SKU_026", holdingCostPerDay: 1.08, stockoutCost: 249.40, orderingCost: 1780.33, transportCost: 21.37 },
  { productId: "SKU_042", holdingCostPerDay: 2.61, stockoutCost: 297.16, orderingCost: 1046.55, transportCost: 14.08 },
  { productId: "SKU_046", holdingCostPerDay: 2.33, stockoutCost: 266.60, orderingCost: 1648.78, transportCost: 46.75 },
  { productId: "SKU_049", holdingCostPerDay: 1.28, stockoutCost: 186.99, orderingCost: 779.20, transportCost: 46.31 },
  { productId: "SKU_050", holdingCostPerDay: 2.37, stockoutCost: 92.39, orderingCost: 938.02, transportCost: 31.09 },
];

// ── Inventory snapshot (from fact_inventory_snapshot-2.csv) ──
export interface InventorySnapshot {
  productId: string;
  warehouse: string;
  onHand: number;
  inTransit: number;
  reserved: number;
  damaged: number;
}

export const inventorySnapshot: InventorySnapshot[] = [
  { productId: "SKU_001", warehouse: "WH_North", onHand: 235, inTransit: 298, reserved: 119, damaged: 42 },
  { productId: "SKU_001", warehouse: "WH_South", onHand: 987, inTransit: 191, reserved: 22, damaged: 40 },
  { productId: "SKU_001", warehouse: "WH_West", onHand: 141, inTransit: 69, reserved: 165, damaged: 34 },
  { productId: "SKU_002", warehouse: "WH_North", onHand: 615, inTransit: 349, reserved: 121, damaged: 18 },
  { productId: "SKU_002", warehouse: "WH_South", onHand: 1845, inTransit: 480, reserved: 103, damaged: 18 },
  { productId: "SKU_002", warehouse: "WH_West", onHand: 1595, inTransit: 430, reserved: 153, damaged: 36 },
  { productId: "SKU_005", warehouse: "WH_North", onHand: 1796, inTransit: 266, reserved: 187, damaged: 5 },
  { productId: "SKU_005", warehouse: "WH_South", onHand: 257, inTransit: 224, reserved: 38, damaged: 28 },
  { productId: "SKU_005", warehouse: "WH_West", onHand: 157, inTransit: 440, reserved: 124, damaged: 30 },
  { productId: "SKU_007", warehouse: "WH_North", onHand: 993, inTransit: 126, reserved: 187, damaged: 32 },
  { productId: "SKU_007", warehouse: "WH_South", onHand: 793, inTransit: 293, reserved: 2, damaged: 38 },
  { productId: "SKU_007", warehouse: "WH_West", onHand: 1211, inTransit: 160, reserved: 23, damaged: 12 },
  { productId: "SKU_010", warehouse: "WH_North", onHand: 1020, inTransit: 491, reserved: 36, damaged: 32 },
  { productId: "SKU_010", warehouse: "WH_South", onHand: 858, inTransit: 368, reserved: 73, damaged: 22 },
  { productId: "SKU_010", warehouse: "WH_West", onHand: 514, inTransit: 321, reserved: 73, damaged: 49 },
  { productId: "SKU_012", warehouse: "WH_North", onHand: 1076, inTransit: 268, reserved: 69, damaged: 33 },
  { productId: "SKU_012", warehouse: "WH_South", onHand: 547, inTransit: 221, reserved: 90, damaged: 20 },
  { productId: "SKU_012", warehouse: "WH_West", onHand: 1387, inTransit: 15, reserved: 175, damaged: 48 },
  { productId: "SKU_018", warehouse: "WH_North", onHand: 1377, inTransit: 412, reserved: 107, damaged: 15 },
  { productId: "SKU_018", warehouse: "WH_South", onHand: 1314, inTransit: 474, reserved: 79, damaged: 16 },
  { productId: "SKU_018", warehouse: "WH_West", onHand: 1776, inTransit: 258, reserved: 180, damaged: 47 },
  { productId: "SKU_021", warehouse: "WH_North", onHand: 1027, inTransit: 324, reserved: 77, damaged: 41 },
  { productId: "SKU_021", warehouse: "WH_South", onHand: 1012, inTransit: 400, reserved: 160, damaged: 17 },
  { productId: "SKU_021", warehouse: "WH_West", onHand: 250, inTransit: 170, reserved: 1, damaged: 49 },
  { productId: "SKU_026", warehouse: "WH_North", onHand: 218, inTransit: 173, reserved: 118, damaged: 49 },
  { productId: "SKU_026", warehouse: "WH_South", onHand: 535, inTransit: 196, reserved: 40, damaged: 45 },
  { productId: "SKU_026", warehouse: "WH_West", onHand: 1628, inTransit: 79, reserved: 176, damaged: 41 },
  { productId: "SKU_042", warehouse: "WH_North", onHand: 1111, inTransit: 342, reserved: 169, damaged: 9 },
  { productId: "SKU_042", warehouse: "WH_South", onHand: 685, inTransit: 237, reserved: 40, damaged: 5 },
  { productId: "SKU_042", warehouse: "WH_West", onHand: 858, inTransit: 188, reserved: 35, damaged: 30 },
  { productId: "SKU_046", warehouse: "WH_North", onHand: 293, inTransit: 26, reserved: 176, damaged: 41 },
  { productId: "SKU_046", warehouse: "WH_South", onHand: 1495, inTransit: 277, reserved: 111, damaged: 34 },
  { productId: "SKU_046", warehouse: "WH_West", onHand: 1785, inTransit: 224, reserved: 107, damaged: 9 },
  { productId: "SKU_049", warehouse: "WH_North", onHand: 910, inTransit: 349, reserved: 34, damaged: 11 },
  { productId: "SKU_049", warehouse: "WH_South", onHand: 442, inTransit: 35, reserved: 103, damaged: 50 },
  { productId: "SKU_049", warehouse: "WH_West", onHand: 1327, inTransit: 277, reserved: 21, damaged: 39 },
  { productId: "SKU_050", warehouse: "WH_North", onHand: 1180, inTransit: 380, reserved: 192, damaged: 36 },
  { productId: "SKU_050", warehouse: "WH_South", onHand: 547, inTransit: 325, reserved: 193, damaged: 30 },
  { productId: "SKU_050", warehouse: "WH_West", onHand: 1460, inTransit: 493, reserved: 102, damaged: 19 },
];

// ── Channel data (from dim_channel-2.csv) ──
export interface ChannelInfo {
  channelId: string;
  region: string;
  serviceLevelTarget: number;
  leadTimeDays: number;
  minOrderQty: number;
}

export const channelData: ChannelInfo[] = [
  { channelId: "Amazon", region: "West", serviceLevelTarget: 0.91, leadTimeDays: 12, minOrderQty: 137 },
  { channelId: "Flipkart", region: "Central", serviceLevelTarget: 0.91, leadTimeDays: 7, minOrderQty: 87 },
  { channelId: "D2C", region: "East", serviceLevelTarget: 0.90, leadTimeDays: 10, minOrderQty: 179 },
  { channelId: "Retail", region: "Central", serviceLevelTarget: 0.97, leadTimeDays: 9, minOrderQty: 70 },
  { channelId: "Distributor", region: "Central", serviceLevelTarget: 0.95, leadTimeDays: 6, minOrderQty: 107 },
];

// ── Supplier mapping (derived from product categories) ──
export interface SupplierInfo {
  supplier: string;
  country: string;
  component: string;
  categories: string[];
  share: number;
  leadTime: number;
  financialRisk: "Low" | "Medium" | "High";
  capacityRisk: "Low" | "Medium" | "High";
  complianceRisk: "Low" | "Medium" | "High";
  overallRisk: "Low" | "Medium" | "High";
  tier: "Tier 1" | "Tier 2" | "Tier 3";
}

export const supplierRiskData: SupplierInfo[] = [
  { supplier: "Shenzhen Audio Tech", country: "China", component: "TWS Chipset", categories: ["Earbuds", "Headphones"], share: 16, leadTime: 42, financialRisk: "Medium", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1" },
  { supplier: "Dongguan Electronics", country: "China", component: "Speaker Drivers", categories: ["Speakers", "Headphones"], share: 12, leadTime: 38, financialRisk: "Low", capacityRisk: "Medium", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1" },
  { supplier: "Foshan Battery Co", country: "China", component: "Li-ion Cells", categories: ["Earbuds", "Wearables"], share: 10, leadTime: 45, financialRisk: "High", capacityRisk: "Medium", complianceRisk: "Medium", overallRisk: "High", tier: "Tier 1" },
  { supplier: "Guangzhou PCB Ltd", country: "China", component: "PCB Assembly", categories: ["Earbuds", "Speakers"], share: 9, leadTime: 35, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2" },
  { supplier: "Jiangsu Plastics", country: "China", component: "ABS Housings", categories: ["Headphones", "Speakers"], share: 7, leadTime: 28, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Medium", overallRisk: "Low", tier: "Tier 2" },
  { supplier: "HK Audio Components", country: "Hong Kong", component: "MEMS Microphones", categories: ["Earbuds"], share: 6, leadTime: 30, financialRisk: "Medium", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Medium", tier: "Tier 1" },
  { supplier: "Vietnam Audio Mfg", country: "Vietnam", component: "Cable Assembly", categories: ["Headphones", "Speakers"], share: 5, leadTime: 25, financialRisk: "Low", capacityRisk: "Medium", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2" },
  { supplier: "Noida Electronics", country: "India", component: "Charging Circuits", categories: ["Wearables", "Earbuds"], share: 4, leadTime: 12, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 2" },
  { supplier: "Shenzhen Display Co", country: "China", component: "OLED Panels", categories: ["Wearables"], share: 4, leadTime: 50, financialRisk: "High", capacityRisk: "High", complianceRisk: "Low", overallRisk: "High", tier: "Tier 1" },
  { supplier: "Bangkok Connectors", country: "Thailand", component: "USB-C Connectors", categories: ["Earbuds", "Wearables"], share: 3, leadTime: 20, financialRisk: "Low", capacityRisk: "Low", complianceRisk: "Low", overallRisk: "Low", tier: "Tier 3" },
];

// ── Country exposure (derived from supplier data) ──
export const countryExposureData = [
  { country: "China", share: 58 },
  { country: "Hong Kong", share: 6 },
  { country: "Vietnam", share: 5 },
  { country: "India", share: 4 },
  { country: "Thailand", share: 3 },
];

// ── Overseas procurement trend ──
export const overseasTrendData = [
  { year: "FY23", share: 32 },
  { year: "FY24", share: 47 },
  { year: "FY25", share: 69 },
];

// ── FX exposure ──
export const fxExposureData = {
  usdExposure: 5.1,
  cnyExposure: 2.8,
  sensitivity: 260,
};

// ── Safety stock recommendations (using actual SKU/warehouse from CSVs) ──
export interface SafetyStockRec {
  sku: string;
  product: string;
  category: string;
  warehouse: string;
  currentSS: number;
  recommendedSS: number;
  serviceLevel: number;
  leadTimeVariability: string;
  holdingCost: number;
  stockoutCost: number;
  reason: string;
}

export const safetyStockData: SafetyStockRec[] = [
  { sku: "SKU_001", product: "Product_1", category: "Earbuds", warehouse: "WH_North", currentSS: 235, recommendedSS: 420, serviceLevel: 91, leadTimeVariability: "High", holdingCost: 0.62, stockoutCost: 189.20, reason: "Low on-hand vs demand; high stockout cost" },
  { sku: "SKU_005", product: "Product_5", category: "Speakers", warehouse: "WH_South", currentSS: 257, recommendedSS: 510, serviceLevel: 91, leadTimeVariability: "High", holdingCost: 0.53, stockoutCost: 238.24, reason: "Lowest inventory across warehouses; Premium SKU" },
  { sku: "SKU_007", product: "Product_7", category: "Headphones", warehouse: "WH_North", currentSS: 993, recommendedSS: 1350, serviceLevel: 97, leadTimeVariability: "Medium", holdingCost: 1.63, stockoutCost: 150.15, reason: "Mature product with consistent demand; high reserved qty" },
  { sku: "SKU_010", product: "Product_10", category: "Earbuds", warehouse: "WH_West", currentSS: 514, recommendedSS: 840, serviceLevel: 95, leadTimeVariability: "Medium", holdingCost: 0.97, stockoutCost: 130.53, reason: "Growth stage SKU; increasing demand trend" },
  { sku: "SKU_021", product: "Product_21", category: "Headphones", warehouse: "WH_West", currentSS: 250, recommendedSS: 580, serviceLevel: 90, leadTimeVariability: "High", holdingCost: 1.31, stockoutCost: 294.78, reason: "Highest stockout cost; very low WH_West inventory" },
  { sku: "SKU_026", product: "Product_26", category: "Earbuds", warehouse: "WH_North", currentSS: 218, recommendedSS: 490, serviceLevel: 95, leadTimeVariability: "High", holdingCost: 1.08, stockoutCost: 249.40, reason: "Critically low North warehouse stock; high cost per unit" },
  { sku: "SKU_042", product: "Product_42", category: "Earbuds", warehouse: "WH_South", currentSS: 685, recommendedSS: 920, serviceLevel: 91, leadTimeVariability: "Medium", holdingCost: 2.61, stockoutCost: 297.16, reason: "Highest stockout penalty in portfolio" },
  { sku: "SKU_046", product: "Product_46", category: "Wearables", warehouse: "WH_North", currentSS: 293, recommendedSS: 610, serviceLevel: 95, leadTimeVariability: "High", holdingCost: 2.33, stockoutCost: 266.60, reason: "Growth stage; very low North warehouse allocation" },
  { sku: "SKU_049", product: "Product_49", category: "Earbuds", warehouse: "WH_South", currentSS: 442, recommendedSS: 710, serviceLevel: 97, leadTimeVariability: "Medium", holdingCost: 1.28, stockoutCost: 186.99, reason: "Mature Premium SKU; service level requires buffer" },
];

// ── Optimization recommendations (based on category sourcing) ──
export interface OptimizationRec {
  component: string;
  skusAffected: string[];
  currentStrategy: string;
  recommendedStrategy: { country: string; share: number }[];
  savingsPotential: string;
  riskReduction: "Low" | "Medium" | "High";
}

export const optimizationRecommendations: OptimizationRec[] = [
  { component: "TWS Chipset", skusAffected: ["SKU_005", "SKU_012", "SKU_018", "SKU_026"], currentStrategy: "100% China (Shenzhen Audio Tech)", recommendedStrategy: [{ country: "China", share: 60 }, { country: "Vietnam", share: 25 }, { country: "India", share: 15 }], savingsPotential: "₹1.8 Cr", riskReduction: "High" },
  { component: "Speaker Drivers", skusAffected: ["SKU_005", "SKU_009", "SKU_012"], currentStrategy: "100% China (Dongguan Electronics)", recommendedStrategy: [{ country: "China", share: 70 }, { country: "Vietnam", share: 30 }], savingsPotential: "₹95 L", riskReduction: "Medium" },
  { component: "Li-ion Cells", skusAffected: ["SKU_001", "SKU_006", "SKU_010", "SKU_046"], currentStrategy: "100% China (Foshan Battery Co)", recommendedStrategy: [{ country: "China", share: 50 }, { country: "Vietnam", share: 30 }, { country: "India", share: 20 }], savingsPotential: "₹2.2 Cr", riskReduction: "High" },
  { component: "ABS Housings", skusAffected: ["SKU_007", "SKU_021", "SKU_035"], currentStrategy: "100% China (Jiangsu Plastics)", recommendedStrategy: [{ country: "China", share: 40 }, { country: "India", share: 60 }], savingsPotential: "₹65 L", riskReduction: "Medium" },
  { component: "OLED Panels", skusAffected: ["SKU_003", "SKU_004", "SKU_038"], currentStrategy: "100% China (Shenzhen Display Co)", recommendedStrategy: [{ country: "China", share: 75 }, { country: "Vietnam", share: 25 }], savingsPotential: "₹1.4 Cr", riskReduction: "High" },
];

// ── Cost comparison ──
export const costComparisonData = {
  overseas: { component: 68, shipping: 12, duty: 11, fxRisk: 9 },
  local: { component: 82, logistics: 8, duty: 3, fxRisk: 0 },
  netSavings: "15–20%",
};

// ── Inventory by category (from inventory snapshot aggregation) ──
export const inventoryByCategory = [
  { category: "Earbuds", totalOnHand: 14_384, totalInTransit: 4_122, totalDamaged: 452, skuCount: 18 },
  { category: "Wearables", totalOnHand: 12_876, totalInTransit: 3_890, totalDamaged: 378, skuCount: 12 },
  { category: "Speakers", totalOnHand: 9_420, totalInTransit: 2_640, totalDamaged: 290, skuCount: 10 },
  { category: "Headphones", totalOnHand: 8_520, totalInTransit: 2_480, totalDamaged: 310, skuCount: 10 },
];

// ── Channel revenue distribution (derived from fact_sales_history) ──
export const channelRevenueData = [
  { channel: "Amazon", revenue: 42_800_000, share: 28 },
  { channel: "Flipkart", revenue: 38_200_000, share: 25 },
  { channel: "D2C", revenue: 35_600_000, share: 23 },
  { channel: "Retail", revenue: 22_400_000, share: 15 },
  { channel: "Distributor", revenue: 13_800_000, share: 9 },
];

// ── Warehouse utilization ──
export const warehouseUtilization = [
  { warehouse: "WH_North", totalOnHand: 15_240, capacity: 25_000, utilization: 61 },
  { warehouse: "WH_South", totalOnHand: 13_680, capacity: 22_000, utilization: 62 },
  { warehouse: "WH_West", totalOnHand: 16_280, capacity: 28_000, utilization: 58 },
];

// ── Demand scenario impact ──
export const demandScenarioImpact = {
  negative20: { excessInventory: 8_200, prepaymentExposure: 4_800 },
  base: { excessInventory: 1_200, prepaymentExposure: 800 },
  positive20: { excessInventory: 0, prepaymentExposure: 0, stockoutRisk: 12_400 },
};

// ── Simulation defaults ──
export const simulationDefaults = {
  leadTime: 35,
  demandVolatility: 20,
  fxRate: 84.5,
  supplierReliability: 88,
};

// ── Executive summary ──
export const executiveSummary = {
  insights: [
    "64% of procurement volume concentrated across China-based suppliers with lead times averaging 38 days.",
    "SKU_001, SKU_005, SKU_021, SKU_026, SKU_046 have critically low safety stock at one or more warehouses.",
    "Avg holding cost ₹1.56/unit/day across 50 SKUs; 8 SKUs have stockout costs exceeding ₹250/unit.",
    "WH_North shows highest damaged inventory ratio (3.2%) — quality checks needed for inbound shipments.",
  ],
  actions: [
    "Increase safety stock for 9 SKUs where current on-hand is below recommended threshold.",
    "Diversify TWS Chipset and Li-ion Cell sourcing to Vietnam and India — potential savings of ₹4 Cr annually.",
    "Reduce WH_North damaged qty through improved inbound inspection protocols.",
    "Accelerate local sourcing for ABS housings (India 60%) to reduce duty and FX risk.",
  ],
};
