// Base inventory items for pharmaceutical replenishment planning
export interface ItemRow {
  sku: string;
  description: string;
  location: string;
  supplier: string;
  current_stock: number;
  on_order: number;
  safety_stock: number;
  lead_time_days: number;
  moq: number;
  lot_size: number;
  avg_daily_demand: number;
  demand_cv: number;
  therapy_area?: string;
  cold_chain?: boolean;
}

export const baseItems: ItemRow[] = [
  {
    sku: "SKU001",
    description: "Paracetamol 500mg Tablet 10s",
    location: "DC_NCR",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 6070,
    on_order: 1500,
    safety_stock: 3967,
    lead_time_days: 7,
    moq: 1500,
    lot_size: 100,
    avg_daily_demand: 285,
    demand_cv: 0.15,
    therapy_area: "Analgesic/Antipyretic",
    cold_chain: false
  },
  {
    sku: "SKU002",
    description: "Azithromycin 500mg Tablet 3s",
    location: "DC_NCR",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 8531,
    on_order: 1500,
    safety_stock: 1558,
    lead_time_days: 14,
    moq: 1500,
    lot_size: 500,
    avg_daily_demand: 112,
    demand_cv: 0.22,
    therapy_area: "Antibiotic",
    cold_chain: false
  },
  {
    sku: "SKU003",
    description: "Cetirizine 10mg Tablet 10s",
    location: "DC_WEST",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 7144,
    on_order: 1500,
    safety_stock: 4226,
    lead_time_days: 30,
    moq: 1500,
    lot_size: 100,
    avg_daily_demand: 195,
    demand_cv: 0.18,
    therapy_area: "Allergy",
    cold_chain: false
  },
  {
    sku: "SKU004",
    description: "Insulin Glargine 100IU/ml 3ml Pen",
    location: "DC_NCR",
    supplier: "Hyderabad Injectables Plant",
    current_stock: 3248,
    on_order: 500,
    safety_stock: 2025,
    lead_time_days: 7,
    moq: 500,
    lot_size: 100,
    avg_daily_demand: 145,
    demand_cv: 0.12,
    therapy_area: "Diabetes",
    cold_chain: true
  },
  {
    sku: "SKU005",
    description: "Amoxicillin+Clav 625mg Tablet 10s",
    location: "DC_SOUTH",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 4207,
    on_order: 500,
    safety_stock: 2312,
    lead_time_days: 7,
    moq: 500,
    lot_size: 100,
    avg_daily_demand: 165,
    demand_cv: 0.20,
    therapy_area: "Antibiotic",
    cold_chain: false
  },
  {
    sku: "SKU006",
    description: "ORS Sachet 21g",
    location: "DC_WEST",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 1696,
    on_order: 1000,
    safety_stock: 4071,
    lead_time_days: 30,
    moq: 1000,
    lot_size: 500,
    avg_daily_demand: 320,
    demand_cv: 0.35,
    therapy_area: "GI",
    cold_chain: false
  },
  {
    sku: "SKU007",
    description: "Salbutamol Inhaler 100mcg 200md",
    location: "DC_SOUTH",
    supplier: "Hyderabad Injectables Plant",
    current_stock: 5550,
    on_order: 1500,
    safety_stock: 4495,
    lead_time_days: 7,
    moq: 1500,
    lot_size: 200,
    avg_daily_demand: 228,
    demand_cv: 0.25,
    therapy_area: "Respiratory",
    cold_chain: false
  },
  {
    sku: "SKU008",
    description: "Vitamin D3 60000 IU Sachet",
    location: "DEP_EAST",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 2639,
    on_order: 500,
    safety_stock: 4465,
    lead_time_days: 30,
    moq: 500,
    lot_size: 100,
    avg_daily_demand: 185,
    demand_cv: 0.16,
    therapy_area: "Vitamins",
    cold_chain: false
  },
  {
    sku: "SKU009",
    description: "Ceftriaxone 1g Injection Vial",
    location: "DC_NCR",
    supplier: "Hyderabad Injectables Plant",
    current_stock: 4438,
    on_order: 1000,
    safety_stock: 4438,
    lead_time_days: 7,
    moq: 1000,
    lot_size: 100,
    avg_daily_demand: 298,
    demand_cv: 0.14,
    therapy_area: "Antibiotic",
    cold_chain: false
  },
  {
    sku: "SKU010",
    description: "Pantoprazole 40mg Tablet 10s",
    location: "DC_WEST",
    supplier: "Bhiwadi Formulations Plant",
    current_stock: 4319,
    on_order: 1500,
    safety_stock: 4319,
    lead_time_days: 30,
    moq: 1500,
    lot_size: 200,
    avg_daily_demand: 245,
    demand_cv: 0.13,
    therapy_area: "GI",
    cold_chain: false
  }
];

export const pharmaNodes = [
  { id: "PLT_BHI", name: "Bhiwadi Formulations Plant", type: "PLANT", city: "Bhiwadi", state: "Rajasthan" },
  { id: "PLT_HYD", name: "Hyderabad Injectables Plant", type: "PLANT", city: "Hyderabad", state: "Telangana" },
  { id: "DC_NCR", name: "NCR Distribution Center", type: "DC", city: "Gurugram", state: "Haryana" },
  { id: "DC_WEST", name: "West Distribution Center", type: "DC", city: "Bhiwandi", state: "Maharashtra" },
  { id: "DC_SOUTH", name: "South Distribution Center", type: "DC", city: "Bengaluru", state: "Karnataka" },
  { id: "DEP_EAST", name: "East Depot", type: "DEPOT", city: "Kolkata", state: "West Bengal" },
  { id: "STK_PUN", name: "Punjab Super Stockist", type: "STOCKIST", city: "Ludhiana", state: "Punjab" },
  { id: "STK_GUJ", name: "Gujarat Super Stockist", type: "STOCKIST", city: "Ahmedabad", state: "Gujarat" },
  { id: "STK_TN", name: "Tamil Nadu Super Stockist", type: "STOCKIST", city: "Chennai", state: "Tamil Nadu" },
];

export const forwardDays = 90;
