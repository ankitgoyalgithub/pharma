// Pharma inventory data previews
export const normDataPreview = [
  { sku: 'SKU001', product: 'Paracetamol 500mg Tablet 10s', location: 'DC_NCR', safety_stock_days: 14, moq: 1500, lot_size: 100, max_inventory: 9774, reorder_point: 3967 },
  { sku: 'SKU002', product: 'Azithromycin 500mg Tablet 3s', location: 'DC_NCR', safety_stock_days: 7, moq: 1500, lot_size: 500, max_inventory: 6787, reorder_point: 1558 },
  { sku: 'SKU003', product: 'Cetirizine 10mg Tablet 10s', location: 'DC_WEST', safety_stock_days: 10, moq: 1500, lot_size: 100, max_inventory: 7676, reorder_point: 4226 },
  { sku: 'SKU004', product: 'Insulin Glargine 100IU/ml Pen', location: 'DC_NCR', safety_stock_days: 14, moq: 500, lot_size: 100, max_inventory: 4626, reorder_point: 2025 },
  { sku: 'SKU005', product: 'Amoxicillin+Clav 625mg Tablet', location: 'DC_SOUTH', safety_stock_days: 14, moq: 500, lot_size: 100, max_inventory: 7199, reorder_point: 2312 },
  { sku: 'SKU006', product: 'ORS Sachet 21g', location: 'DC_WEST', safety_stock_days: 10, moq: 1000, lot_size: 500, max_inventory: 9012, reorder_point: 4071 },
  { sku: 'SKU007', product: 'Salbutamol Inhaler 100mcg', location: 'DC_SOUTH', safety_stock_days: 14, moq: 1500, lot_size: 200, max_inventory: 8163, reorder_point: 4495 },
  { sku: 'SKU008', product: 'Vitamin D3 60000 IU Sachet', location: 'DEP_EAST', safety_stock_days: 7, moq: 500, lot_size: 100, max_inventory: 8128, reorder_point: 4465 },
  { sku: 'SKU009', product: 'Ceftriaxone 1g Injection Vial', location: 'DC_NCR', safety_stock_days: 14, moq: 1000, lot_size: 100, max_inventory: 9525, reorder_point: 4438 },
  { sku: 'SKU010', product: 'Pantoprazole 40mg Tablet 10s', location: 'DC_WEST', safety_stock_days: 7, moq: 1500, lot_size: 200, max_inventory: 9132, reorder_point: 4319 },
];

export const networkDataPreview = [
  { from_location: 'PLT_BHI', to_location: 'DC_NCR', mode: 'Truck', lead_time_days: 2, cost_per_unit: 1.8, capacity: 50000 },
  { from_location: 'PLT_BHI', to_location: 'DC_WEST', mode: 'Truck', lead_time_days: 3, cost_per_unit: 2.2, capacity: 40000 },
  { from_location: 'PLT_BHI', to_location: 'DC_SOUTH', mode: 'Rail', lead_time_days: 4, cost_per_unit: 1.5, capacity: 60000 },
  { from_location: 'PLT_HYD', to_location: 'DC_NCR', mode: 'Air (Cold Chain)', lead_time_days: 1, cost_per_unit: 8.5, capacity: 5000 },
  { from_location: 'PLT_HYD', to_location: 'DC_SOUTH', mode: 'Truck', lead_time_days: 2, cost_per_unit: 1.6, capacity: 35000 },
  { from_location: 'DC_NCR', to_location: 'STK_PUN', mode: 'Truck', lead_time_days: 1, cost_per_unit: 1.2, capacity: 15000 },
  { from_location: 'DC_WEST', to_location: 'STK_GUJ', mode: 'Truck', lead_time_days: 1, cost_per_unit: 0.9, capacity: 20000 },
  { from_location: 'DC_SOUTH', to_location: 'STK_TN', mode: 'Truck', lead_time_days: 1, cost_per_unit: 0.8, capacity: 18000 },
  { from_location: 'DC_NCR', to_location: 'DEP_EAST', mode: 'Rail', lead_time_days: 3, cost_per_unit: 1.4, capacity: 25000 },
];

export const demandDataPreview = [
  { sku: 'SKU001', location: 'DC_NCR', week: 'W01-2025', demand: 2850, confidence: 0.94 },
  { sku: 'SKU001', location: 'DC_NCR', week: 'W02-2025', demand: 2720, confidence: 0.92 },
  { sku: 'SKU002', location: 'DC_NCR', week: 'W01-2025', demand: 1120, confidence: 0.91 },
  { sku: 'SKU002', location: 'DC_NCR', week: 'W02-2025', demand: 1380, confidence: 0.89 },
  { sku: 'SKU003', location: 'DC_WEST', week: 'W01-2025', demand: 1950, confidence: 0.93 },
  { sku: 'SKU004', location: 'DC_NCR', week: 'W01-2025', demand: 1450, confidence: 0.96 },
  { sku: 'SKU006', location: 'DC_WEST', week: 'W01-2025', demand: 4200, confidence: 0.88 },
  { sku: 'SKU007', location: 'DC_SOUTH', week: 'W01-2025', demand: 2280, confidence: 0.91 },
  { sku: 'SKU009', location: 'DC_NCR', week: 'W01-2025', demand: 2980, confidence: 0.95 },
];

export const inventorySnapshotPreview = [
  { as_of_date: '2025-01-01', node_id: 'DC_NCR', sku_id: 'SKU001', batch_no: 'B33393', expiry_date: '2025-08-31', on_hand_qty: 6070, available_qty: 5214, quarantine_qty: 81 },
  { as_of_date: '2025-01-01', node_id: 'DC_NCR', sku_id: 'SKU002', batch_no: 'B13352', expiry_date: '2026-04-11', on_hand_qty: 8531, available_qty: 7908, quarantine_qty: 236 },
  { as_of_date: '2025-01-01', node_id: 'DC_NCR', sku_id: 'SKU004', batch_no: 'B72284', expiry_date: '2026-03-10', on_hand_qty: 3248, available_qty: 2934, quarantine_qty: 126 },
  { as_of_date: '2025-01-01', node_id: 'DC_WEST', sku_id: 'SKU003', batch_no: 'B77508', expiry_date: '2025-10-07', on_hand_qty: 7144, available_qty: 6392, quarantine_qty: 248 },
  { as_of_date: '2025-01-01', node_id: 'DC_SOUTH', sku_id: 'SKU007', batch_no: 'B52280', expiry_date: '2025-05-19', on_hand_qty: 5550, available_qty: 4975, quarantine_qty: 257 },
];

export const replenishmentPolicyPreview = [
  { sku_id: 'SKU001', node_id: 'DC_NCR', policy_type: 'MIN_MAX', min_stock: 3967, max_stock: 9774, review_cycle_days: 7, safety_stock_days: 14, target_fill_rate: 0.94 },
  { sku_id: 'SKU002', node_id: 'DC_NCR', policy_type: 'MIN_MAX', min_stock: 1558, max_stock: 6787, review_cycle_days: 14, safety_stock_days: 7, target_fill_rate: 0.94 },
  { sku_id: 'SKU004', node_id: 'DC_NCR', policy_type: 'MIN_MAX', min_stock: 2025, max_stock: 4626, review_cycle_days: 7, safety_stock_days: 14, target_fill_rate: 0.96 },
  { sku_id: 'SKU006', node_id: 'DC_WEST', policy_type: 'MIN_MAX', min_stock: 4071, max_stock: 9012, review_cycle_days: 30, safety_stock_days: 10, target_fill_rate: 0.96 },
  { sku_id: 'SKU009', node_id: 'DC_NCR', policy_type: 'MIN_MAX', min_stock: 4438, max_stock: 9525, review_cycle_days: 7, safety_stock_days: 14, target_fill_rate: 0.97 },
];
