export const masterObjects = [
  'Product_Master',
  'Store_Master',
  'Category_Hierarchy',
  'Brand_Performance'
];

export const timeseriesObjects = [
  'Sales_History',
  'Inventory_Movement',
  'Pricing_History',
  'Customer_Traffic'
];

export const assortmentRequiredFiles = [
  { 
    name: 'Product_Master', 
    label: 'Product Catalog',
    description: 'Product attributes, categories, brands, pricing, and margins',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Store_Master', 
    label: 'Store Attributes',
    description: 'Store profiles, formats, clusters, and space capacity',
    required: true,
    type: 'master' as const
  },
  { 
    name: 'Sales_History', 
    label: 'Sales Performance',
    description: 'Historical sales, units sold, revenue by product and store',
    required: true,
    type: 'timeseries' as const
  }
];
