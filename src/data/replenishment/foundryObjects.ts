export const masterObjects = [
  'Product_Master',
  'Location_Master',
  'Supplier_Master',
  'Network_Configuration'
];

export const timeseriesObjects = [
  'Demand_Forecast',
  'Inventory_Levels',
  'Lead_Time_Data',
  'Supply_Constraints'
];

export const replenishmentRequiredFiles = [
  { 
    name: 'Norm_Data', 
    label: 'Norm File',
    description: 'Safety stock norms, MOQ, lot sizes, and ordering policies',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Network_Configuration', 
    label: 'Network File',
    description: 'Supply network topology, lead times, and routing rules',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Demand_Forecast', 
    label: 'Demand File',
    description: 'Forward demand projections by SKU, location, and time period',
    required: true,
    type: 'timeseries' as const
  }
];
