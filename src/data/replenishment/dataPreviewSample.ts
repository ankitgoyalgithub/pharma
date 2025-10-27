export const normDataPreview = [
  { sku: 'SKU001', product: 'Widget Alpha', location: 'DC-NY', safety_stock_days: 14, moq: 500, lot_size: 100, max_inventory: 5000, reorder_point: 2100 },
  { sku: 'SKU002', product: 'Component Beta', location: 'DC-LA', safety_stock_days: 21, moq: 1000, lot_size: 250, max_inventory: 8000, reorder_point: 3500 },
  { sku: 'SKU003', product: 'Assembly Gamma', location: 'DC-CHI', safety_stock_days: 10, moq: 300, lot_size: 50, max_inventory: 3000, reorder_point: 1500 },
  { sku: 'SKU004', product: 'Part Delta', location: 'DC-ATL', safety_stock_days: 7, moq: 200, lot_size: 100, max_inventory: 2500, reorder_point: 900 },
  { sku: 'SKU005', product: 'Module Epsilon', location: 'DC-SEA', safety_stock_days: 18, moq: 750, lot_size: 150, max_inventory: 6000, reorder_point: 2800 },
];

export const networkDataPreview = [
  { from_location: 'PLANT-01', to_location: 'DC-NY', mode: 'Truck', lead_time_days: 2, cost_per_unit: 1.5, capacity: 10000 },
  { from_location: 'PLANT-01', to_location: 'DC-LA', mode: 'Rail', lead_time_days: 5, cost_per_unit: 0.8, capacity: 15000 },
  { from_location: 'PLANT-02', to_location: 'DC-CHI', mode: 'Truck', lead_time_days: 1, cost_per_unit: 1.2, capacity: 8000 },
  { from_location: 'SUPPLIER-A', to_location: 'PLANT-01', mode: 'Container', lead_time_days: 21, cost_per_unit: 0.5, capacity: 50000 },
  { from_location: 'SUPPLIER-B', to_location: 'PLANT-02', mode: 'Air', lead_time_days: 3, cost_per_unit: 5.0, capacity: 2000 },
];

export const demandDataPreview = [
  { sku: 'SKU001', location: 'DC-NY', week: 'W01-2025', demand: 850, confidence: 0.92 },
  { sku: 'SKU001', location: 'DC-NY', week: 'W02-2025', demand: 920, confidence: 0.89 },
  { sku: 'SKU002', location: 'DC-LA', week: 'W01-2025', demand: 1450, confidence: 0.95 },
  { sku: 'SKU002', location: 'DC-LA', week: 'W02-2025', demand: 1380, confidence: 0.93 },
  { sku: 'SKU003', location: 'DC-CHI', week: 'W01-2025', demand: 420, confidence: 0.88 },
  { sku: 'SKU003', location: 'DC-CHI', week: 'W02-2025', demand: 480, confidence: 0.90 },
  { sku: 'SKU004', location: 'DC-ATL', week: 'W01-2025', demand: 320, confidence: 0.91 },
  { sku: 'SKU005', location: 'DC-SEA', week: 'W01-2025', demand: 680, confidence: 0.94 },
];
