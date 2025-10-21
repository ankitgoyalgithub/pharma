export interface DataQualityIssue {
  id: string;
  file: string;
  rowNumber: number;
  column: string;
  issueType: string;
  severity: 'high' | 'medium' | 'low';
  currentValue: string | null;
  suggestedFix: string;
  explanation: string;
  impactScore: number;
}

export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: 'dq_001',
    file: 'sales_history.csv',
    rowNumber: 127,
    column: 'sales_quantity',
    issueType: 'Missing Value',
    severity: 'high',
    currentValue: null,
    suggestedFix: '145',
    explanation: 'Linear interpolation between Week 126 (140) and Week 128 (150)',
    impactScore: 8.5
  },
  {
    id: 'dq_002',
    file: 'sales_history.csv',
    rowNumber: 234,
    column: 'sales_quantity',
    issueType: 'Outlier',
    severity: 'high',
    currentValue: '9999',
    suggestedFix: '125',
    explanation: 'Value exceeds 3 std dev from mean. Likely data entry error. Replaced with 7-day moving average.',
    impactScore: 9.2
  },
  {
    id: 'dq_003',
    file: 'sales_history.csv',
    rowNumber: 456,
    column: 'price',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '49.99',
    explanation: 'Forward-filled with last known price from Week 455',
    impactScore: 6.3
  },
  {
    id: 'dq_004',
    file: 'inventory_levels.csv',
    rowNumber: 89,
    column: 'stock_level',
    issueType: 'Negative Value',
    severity: 'high',
    currentValue: '-15',
    suggestedFix: '0',
    explanation: 'Stock level cannot be negative. Reset to zero and flagged for inventory audit.',
    impactScore: 8.8
  },
  {
    id: 'dq_005',
    file: 'sales_history.csv',
    rowNumber: 567,
    column: 'region',
    issueType: 'Invalid Category',
    severity: 'low',
    currentValue: 'UNKNWN',
    suggestedFix: 'UNKNOWN',
    explanation: 'Standardized to valid category value',
    impactScore: 3.2
  },
  {
    id: 'dq_006',
    file: 'product_master.csv',
    rowNumber: 23,
    column: 'unit_cost',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '32.50',
    explanation: 'Imputed using category median cost for similar products',
    impactScore: 5.7
  },
  {
    id: 'dq_007',
    file: 'sales_history.csv',
    rowNumber: 789,
    column: 'sales_date',
    issueType: 'Duplicate Record',
    severity: 'medium',
    currentValue: '2024-03-15',
    suggestedFix: 'Remove duplicate',
    explanation: 'Duplicate entry for same product, region, and date. Keeping first occurrence.',
    impactScore: 6.9
  },
  {
    id: 'dq_008',
    file: 'sales_history.csv',
    rowNumber: 891,
    column: 'sales_quantity',
    issueType: 'Inconsistent Format',
    severity: 'low',
    currentValue: '100.00',
    suggestedFix: '100',
    explanation: 'Quantity should be integer. Removed decimal formatting.',
    impactScore: 2.5
  }
];

export const dataQualitySummary = {
  totalIssues: 8,
  highSeverity: 4,
  mediumSeverity: 3,
  lowSeverity: 1,
  filesAffected: 3,
  rowsAffected: 8,
  estimatedAccuracyImprovement: '12-15%'
};
