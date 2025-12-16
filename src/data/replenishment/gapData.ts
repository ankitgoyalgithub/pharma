export const gapData = [
  { week: 'W01', actual: 2850, imputed: 2850 },
  { week: 'W02', actual: 2720, imputed: 2720 },
  { week: 'W03', actual: null, imputed: 2785 },
  { week: 'W04', actual: 2950, imputed: 2950 },
  { week: 'W05', actual: 3120, imputed: 3120 },
  { week: 'W06', actual: null, imputed: 3035 },
  { week: 'W07', actual: 3400, imputed: 3400 },
  { week: 'W08', actual: 3250, imputed: 3250 },
  { week: 'W09', actual: 3550, imputed: 3550 },
  { week: 'W10', actual: 3380, imputed: 3380 },
  { week: 'W11', actual: null, imputed: 3465 },
  { week: 'W12', actual: 3700, imputed: 3700 }
];

export const inventoryGapAnalysis = [
  { bucket: 'Below Safety Stock', issues: 3, skus: ['SKU006 @ DC_WEST', 'SKU008 @ DEP_EAST', 'SKU010 @ DC_WEST'] },
  { bucket: 'Near Expiry (< 90 days)', issues: 5, skus: ['SKU001 Batch B33393', 'SKU006 Batch B98988', 'SKU007 Batch B52280', 'SKU008 Batch B39256', 'SKU003 Batch B77508'] },
  { bucket: 'Overstock (> Max)', issues: 2, skus: ['SKU002 @ DC_NCR', 'SKU005 @ DC_SOUTH'] },
  { bucket: 'Cold Chain Gap', issues: 1, skus: ['SKU004 cold storage capacity at DEP_EAST'] },
  { bucket: 'Lead Time Variance', issues: 4, skus: ['PLT_HYD to DC_NCR route variability'] },
  { bucket: 'Policy Mismatch', issues: 2, skus: ['SKU001 review cycle vs safety days', 'SKU009 MOQ vs demand pattern'] },
];

export const therapyAreaGaps = [
  { therapy: 'Antibiotic', fillRateGap: 1.2, stockoutRisk: 'Low', expiryRisk: 'Medium' },
  { therapy: 'GI', fillRateGap: 3.8, stockoutRisk: 'High', expiryRisk: 'Low' },
  { therapy: 'Respiratory', fillRateGap: 0.9, stockoutRisk: 'Medium', expiryRisk: 'High' },
  { therapy: 'Diabetes', fillRateGap: 0.2, stockoutRisk: 'Low', expiryRisk: 'Low' },
  { therapy: 'Analgesic/Antipyretic', fillRateGap: 2.1, stockoutRisk: 'Medium', expiryRisk: 'Medium' },
  { therapy: 'Allergy', fillRateGap: 1.5, stockoutRisk: 'Low', expiryRisk: 'Medium' },
  { therapy: 'Vitamins', fillRateGap: 4.2, stockoutRisk: 'High', expiryRisk: 'Low' },
];

export const nodeGaps = [
  { node: 'DC_NCR', utilizationPct: 78, gapType: 'Optimal', recommendation: 'Maintain current allocation' },
  { node: 'DC_WEST', utilizationPct: 72, gapType: 'Understocked', recommendation: 'Increase ORS and Pantoprazole stock' },
  { node: 'DC_SOUTH', utilizationPct: 68, gapType: 'Optimal', recommendation: 'Monitor respiratory SKU expiry' },
  { node: 'DEP_EAST', utilizationPct: 54, gapType: 'Understocked', recommendation: 'Expedite Vitamin D3 replenishment' },
];
