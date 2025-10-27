// Base inventory items for replenishment planning
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
}

export const baseItems: ItemRow[] = [
  {
    sku: "SKU-001",
    description: "Widget A",
    location: "WH-NYC",
    supplier: "Supplier-X",
    current_stock: 450,
    on_order: 200,
    safety_stock: 180,
    lead_time_days: 14,
    moq: 100,
    lot_size: 50,
    avg_daily_demand: 25,
    demand_cv: 0.15
  },
  {
    sku: "SKU-002",
    description: "Widget B",
    location: "WH-LA",
    supplier: "Supplier-Y",
    current_stock: 320,
    on_order: 150,
    safety_stock: 140,
    lead_time_days: 10,
    moq: 75,
    lot_size: 25,
    avg_daily_demand: 18,
    demand_cv: 0.20
  },
  {
    sku: "SKU-003",
    description: "Component C",
    location: "WH-CHI",
    supplier: "Supplier-Z",
    current_stock: 580,
    on_order: 0,
    safety_stock: 220,
    lead_time_days: 21,
    moq: 200,
    lot_size: 100,
    avg_daily_demand: 30,
    demand_cv: 0.12
  },
  {
    sku: "SKU-004",
    description: "Part D",
    location: "WH-NYC",
    supplier: "Supplier-X",
    current_stock: 210,
    on_order: 300,
    safety_stock: 160,
    lead_time_days: 12,
    moq: 150,
    lot_size: 50,
    avg_daily_demand: 22,
    demand_cv: 0.18
  },
  {
    sku: "SKU-005",
    description: "Assembly E",
    location: "WH-LA",
    supplier: "Supplier-W",
    current_stock: 420,
    on_order: 100,
    safety_stock: 200,
    lead_time_days: 18,
    moq: 120,
    lot_size: 60,
    avg_daily_demand: 28,
    demand_cv: 0.14
  },
  {
    sku: "SKU-006",
    description: "Module F",
    location: "WH-CHI",
    supplier: "Supplier-Y",
    current_stock: 150,
    on_order: 250,
    safety_stock: 120,
    lead_time_days: 15,
    moq: 100,
    lot_size: 50,
    avg_daily_demand: 20,
    demand_cv: 0.22
  },
  {
    sku: "SKU-007",
    description: "Unit G",
    location: "WH-NYC",
    supplier: "Supplier-Z",
    current_stock: 680,
    on_order: 0,
    safety_stock: 280,
    lead_time_days: 25,
    moq: 250,
    lot_size: 125,
    avg_daily_demand: 35,
    demand_cv: 0.10
  },
  {
    sku: "SKU-008",
    description: "Product H",
    location: "WH-LA",
    supplier: "Supplier-X",
    current_stock: 290,
    on_order: 180,
    safety_stock: 150,
    lead_time_days: 16,
    moq: 90,
    lot_size: 30,
    avg_daily_demand: 24,
    demand_cv: 0.16
  },
  {
    sku: "SKU-009",
    description: "Item I",
    location: "WH-CHI",
    supplier: "Supplier-W",
    current_stock: 510,
    on_order: 120,
    safety_stock: 210,
    lead_time_days: 20,
    moq: 130,
    lot_size: 65,
    avg_daily_demand: 29,
    demand_cv: 0.13
  },
  {
    sku: "SKU-010",
    description: "Component J",
    location: "WH-NYC",
    supplier: "Supplier-Y",
    current_stock: 380,
    on_order: 200,
    safety_stock: 170,
    lead_time_days: 13,
    moq: 110,
    lot_size: 55,
    avg_daily_demand: 26,
    demand_cv: 0.17
  }
];

export const forwardDays = 90;
