export const dataQualityIssues = [
  {
    id: 1,
    severity: 'high' as const,
    type: 'Missing Values',
    field: 'Lead_Time',
    description: 'Missing lead time data for 15 SKU-Supplier combinations',
    affectedRecords: 15,
    suggestedFix: 'Impute using average lead time by supplier category',
    status: 'pending' as const
  },
  {
    id: 2,
    severity: 'high' as const,
    type: 'Missing Values',
    field: 'Safety_Stock_Days',
    description: 'Safety stock norms missing for 8 product-location pairs',
    affectedRecords: 8,
    suggestedFix: 'Calculate using service level targets and demand variability',
    status: 'pending' as const
  },
  {
    id: 3,
    severity: 'medium' as const,
    type: 'Inconsistency',
    field: 'MOQ',
    description: 'MOQ exceeds maximum inventory capacity for 3 locations',
    affectedRecords: 3,
    suggestedFix: 'Flag for manual review and supplier negotiation',
    status: 'pending' as const
  },
  {
    id: 4,
    severity: 'medium' as const,
    type: 'Outliers',
    field: 'Demand_Forecast',
    description: 'Unusually high demand spikes detected for 12 SKUs',
    affectedRecords: 12,
    suggestedFix: 'Verify with sales team or cap at 95th percentile',
    status: 'pending' as const
  },
  {
    id: 5,
    severity: 'low' as const,
    type: 'Data Format',
    field: 'Location_Code',
    description: 'Inconsistent location code formats (some with prefixes)',
    affectedRecords: 25,
    suggestedFix: 'Standardize to alphanumeric format without prefixes',
    status: 'pending' as const
  },
  {
    id: 6,
    severity: 'low' as const,
    type: 'Duplicates',
    field: 'SKU_Supplier_Mapping',
    description: 'Duplicate entries for 2 SKU-Supplier pairs',
    affectedRecords: 2,
    suggestedFix: 'Remove duplicates, keep most recent record',
    status: 'pending' as const
  }
];

export const dataQualitySummary = {
  totalIssues: dataQualityIssues.length,
  highSeverity: dataQualityIssues.filter(i => i.severity === 'high').length,
  mediumSeverity: dataQualityIssues.filter(i => i.severity === 'medium').length,
  lowSeverity: dataQualityIssues.filter(i => i.severity === 'low').length,
  completeness: 96.8,
  consistency: 94.2,
  accuracy: 98.5
};
