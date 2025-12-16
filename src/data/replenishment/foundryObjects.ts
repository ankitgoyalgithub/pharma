export const masterObjects = [
  'Product_Master',
  'Location_Master',
  'Supplier_Master',
  'Network_Configuration',
  'Channel_Master'
];

export const timeseriesObjects = [
  'Demand_Forecast',
  'Inventory_Levels',
  'Lead_Time_Data',
  'Supply_Constraints',
  'Expiry_Tracking'
];

export const replenishmentRequiredFiles = [
  { 
    name: 'SKU_Master', 
    label: 'SKU Master',
    description: 'Product details with therapy area, dosage form, cold chain requirements',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Node_Master', 
    label: 'Node Master',
    description: 'Distribution network nodes - Plants, DCs, Depots, Stockists',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Replenishment_Policy', 
    label: 'Replenishment Policy',
    description: 'MIN-MAX policies, safety stock norms, review cycles by SKU-Node',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Inventory_Snapshot', 
    label: 'Inventory Snapshot',
    description: 'Current stock levels with batch details and expiry dates',
    required: true,
    type: 'timeseries' as const
  },
  { 
    name: 'Demand_History', 
    label: 'Demand History',
    description: 'Historical demand by SKU, channel, and region',
    required: true,
    type: 'timeseries' as const
  }
];

export const pharmaExternalFactors = [
  {
    name: 'Seasonal_Illness_Patterns',
    description: 'Monsoon infections, winter respiratory issues, summer GI cases',
    impact: 'High demand variability for ORS, antibiotics, respiratory drugs',
    source: 'Disease Surveillance Network'
  },
  {
    name: 'Disease_Outbreak_Tracking',
    description: 'Dengue, malaria, flu outbreak monitoring by region',
    impact: 'Sudden demand spikes for specific therapy areas',
    source: 'IDSP & State Health Departments'
  },
  {
    name: 'Generic_Drug_Launches',
    description: 'New generic entries and patent expiries',
    impact: 'Demand cannibalization and market share shifts',
    source: 'CDSCO & Industry Intelligence'
  },
  {
    name: 'Healthcare_Policy_Changes',
    description: 'NLEM updates, pricing regulations, import restrictions',
    impact: 'Stock adjustments for regulated products',
    source: 'NPPA & Ministry of Health'
  },
  {
    name: 'Cold_Chain_Disruptions',
    description: 'Power outages, equipment failures, transport delays',
    impact: 'Critical for insulin and biologics inventory',
    source: 'Cold Chain Monitoring System'
  }
];
