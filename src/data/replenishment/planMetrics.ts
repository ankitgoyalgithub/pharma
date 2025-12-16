export const planMetrics = [
  { label: 'Total Replenishment Orders', value: '186', trend: '+15% vs last cycle', change: 'positive' },
  { label: 'Total Units', value: '2.4L', trend: '+12.5% vs baseline', change: 'positive' },
  { label: 'Replenishment Value', value: '₹8.6Cr', trend: '-6.8% optimized', change: 'positive' },
  { label: 'Fill Rate Achieved', value: '96.4%', trend: '+2.1% vs target', change: 'positive' },
  { label: 'Inventory Turnover', value: '9.2x', trend: '+0.8x improved', change: 'positive' },
  { label: 'Stock-out Risk', value: '1.8%', trend: '-1.5% reduced', change: 'positive' },
  { label: 'Near-Expiry Stock', value: '₹32L', trend: '-22% vs plan', change: 'positive' },
  { label: 'Avg Lead Time', value: '8.4 days', trend: 'Within norms', change: 'neutral' },
  { label: 'Cold Chain Compliance', value: '99.2%', trend: 'High adherence', change: 'positive' }
];

export const therapyAreaMetrics = [
  { therapy: 'Analgesic/Antipyretic', skuCount: 1, fillRate: 94.2, stockValue: '₹1.2Cr' },
  { therapy: 'Antibiotic', skuCount: 3, fillRate: 96.8, stockValue: '₹2.8Cr' },
  { therapy: 'Allergy', skuCount: 1, fillRate: 95.5, stockValue: '₹0.6Cr' },
  { therapy: 'Diabetes', skuCount: 1, fillRate: 98.2, stockValue: '₹1.8Cr' },
  { therapy: 'GI', skuCount: 2, fillRate: 93.8, stockValue: '₹0.9Cr' },
  { therapy: 'Respiratory', skuCount: 1, fillRate: 97.1, stockValue: '₹0.8Cr' },
  { therapy: 'Vitamins', skuCount: 1, fillRate: 94.6, stockValue: '₹0.5Cr' },
];

export const nodeMetrics = [
  { node: 'DC_NCR', name: 'NCR Distribution Center', skuCount: 5, fillRate: 96.8, stockValue: '₹3.2Cr', utilizationPct: 78 },
  { node: 'DC_WEST', name: 'West Distribution Center', skuCount: 3, fillRate: 95.4, stockValue: '₹2.1Cr', utilizationPct: 72 },
  { node: 'DC_SOUTH', name: 'South Distribution Center', skuCount: 2, fillRate: 97.2, stockValue: '₹1.6Cr', utilizationPct: 68 },
  { node: 'DEP_EAST', name: 'East Depot', skuCount: 1, fillRate: 94.1, stockValue: '₹0.8Cr', utilizationPct: 54 },
];

export const expiryRiskMetrics = [
  { range: '0-30 days', units: 4250, value: '₹12.8L', skuCount: 3, action: 'Urgent Transfer/Liquidation' },
  { range: '31-60 days', units: 8920, value: '₹24.6L', skuCount: 5, action: 'Promotional Push' },
  { range: '61-90 days', units: 15680, value: '₹42.1L', skuCount: 7, action: 'Monitor & Plan' },
  { range: '90+ days', units: 186540, value: '₹6.8Cr', skuCount: 10, action: 'Normal Operations' },
];
