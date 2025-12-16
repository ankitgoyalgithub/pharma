export const dataQualityIssues = [
  {
    id: 1,
    severity: 'high' as const,
    type: 'Missing Values',
    field: 'Batch_Expiry_Date',
    description: 'Missing expiry dates for 8 SKU-batch combinations at DC_NCR',
    affectedRecords: 8,
    suggestedFix: 'Cross-reference with manufacturer batch records or GS1 data',
    status: 'pending' as const
  },
  {
    id: 2,
    severity: 'high' as const,
    type: 'Missing Values',
    field: 'Cold_Chain_Flag',
    description: 'Cold chain requirement not specified for 3 injectable SKUs',
    affectedRecords: 3,
    suggestedFix: 'Mark as cold chain required based on therapy area (Insulin, Biologics)',
    status: 'pending' as const
  },
  {
    id: 3,
    severity: 'medium' as const,
    type: 'Inconsistency',
    field: 'Safety_Stock_Days',
    description: 'Safety stock days exceeds review cycle for 5 SKU-Node pairs',
    affectedRecords: 5,
    suggestedFix: 'Align safety stock calculation with review cycle frequency',
    status: 'pending' as const
  },
  {
    id: 4,
    severity: 'medium' as const,
    type: 'Outliers',
    field: 'Demand_History',
    description: 'Unusually high demand spikes for ORS during non-monsoon months',
    affectedRecords: 4,
    suggestedFix: 'Verify if promotional campaign or data entry error',
    status: 'pending' as const
  },
  {
    id: 5,
    severity: 'low' as const,
    type: 'Data Format',
    field: 'Node_ID',
    description: 'Inconsistent node ID formats between inventory and policy files',
    affectedRecords: 12,
    suggestedFix: 'Standardize to uppercase with underscore (e.g., DC_NCR)',
    status: 'pending' as const
  },
  {
    id: 6,
    severity: 'low' as const,
    type: 'Duplicates',
    field: 'SKU_Node_Policy',
    description: 'Duplicate policy entries for SKU001 at DC_WEST',
    affectedRecords: 2,
    suggestedFix: 'Remove duplicates, keep policy with latest effective date',
    status: 'pending' as const
  },
  {
    id: 7,
    severity: 'high' as const,
    type: 'Missing Values',
    field: 'Quarantine_Qty',
    description: 'Quarantine quantities not tracked for DEP_EAST depot',
    affectedRecords: 10,
    suggestedFix: 'Enable quarantine tracking at depot level or set to 0',
    status: 'pending' as const
  },
  {
    id: 8,
    severity: 'medium' as const,
    type: 'Inconsistency',
    field: 'Lead_Time_Days',
    description: 'Lead time from PLT_HYD to DC_NCR varies significantly (1-7 days)',
    affectedRecords: 6,
    suggestedFix: 'Use weighted average or mode based on recent shipments',
    status: 'pending' as const
  }
];

export const dataQualitySummary = {
  totalIssues: dataQualityIssues.length,
  highSeverity: dataQualityIssues.filter(i => i.severity === 'high').length,
  mediumSeverity: dataQualityIssues.filter(i => i.severity === 'medium').length,
  lowSeverity: dataQualityIssues.filter(i => i.severity === 'low').length,
  completeness: 94.2,
  consistency: 91.8,
  accuracy: 97.5
};

export const pharmaSpecificChecks = [
  { check: 'Controlled Substance Tracking', status: 'pass', details: 'No controlled substances in current SKU set' },
  { check: 'Cold Chain Compliance', status: 'warning', details: '3 SKUs require cold chain verification' },
  { check: 'Batch Traceability', status: 'pass', details: 'All batches have manufacturing and expiry dates' },
  { check: 'GST/HSN Mapping', status: 'pass', details: 'All SKUs mapped to valid HSN codes' },
  { check: 'DPCO Price Compliance', status: 'pass', details: 'No DPCO violations detected in MRP data' },
  { check: 'Shelf Life Validation', status: 'warning', details: '2 batches below minimum remaining shelf life threshold' },
];
