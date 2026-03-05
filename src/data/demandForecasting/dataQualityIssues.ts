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
    file: 'fact_sales_history.csv',
    rowNumber: 1247,
    column: 'UNITS_SOLD',
    issueType: 'Missing Value',
    severity: 'high',
    currentValue: null,
    suggestedFix: '42',
    explanation: 'Linear interpolation between adjacent weeks for SKU_001 (Earbuds) on Amazon North region',
    impactScore: 8.5
  },
  {
    id: 'dq_002',
    file: 'fact_sales_history.csv',
    rowNumber: 3456,
    column: 'UNITS_SOLD',
    issueType: 'Outlier',
    severity: 'high',
    currentValue: '9999',
    suggestedFix: '52',
    explanation: 'Value exceeds 3 std dev from mean for SKU_007 (Headphones). Likely data entry error. Replaced with 4-week moving average.',
    impactScore: 9.2
  },
  {
    id: 'dq_003',
    file: 'fact_sales_history.csv',
    rowNumber: 5678,
    column: 'REVENUE',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '153913.76',
    explanation: 'Forward-filled with computed revenue (UNITS_SOLD × PRICE) for SKU_007 on Flipkart',
    impactScore: 6.3
  },
  {
    id: 'dq_004',
    file: 'fact_sales_history.csv',
    rowNumber: 8912,
    column: 'DISCOUNT_PERCENT',
    issueType: 'Invalid Value',
    severity: 'high',
    currentValue: '1.5',
    suggestedFix: '0.15',
    explanation: 'Discount percentage should be between 0 and 1. Converted from percentage format.',
    impactScore: 8.8
  },
  {
    id: 'dq_005',
    file: 'dim_product.csv',
    rowNumber: 12,
    column: 'CATEGORY',
    issueType: 'Invalid Category',
    severity: 'low',
    currentValue: 'Earbud',
    suggestedFix: 'Earbuds',
    explanation: 'Standardized to valid category name (plural form)',
    impactScore: 3.2
  },
  {
    id: 'dq_006',
    file: 'dim_product.csv',
    rowNumber: 23,
    column: 'MRP',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '3117',
    explanation: 'Imputed using category median MRP for Budget Headphones',
    impactScore: 5.7
  },
  {
    id: 'dq_007',
    file: 'fact_sales_history.csv',
    rowNumber: 12345,
    column: 'DATE',
    issueType: 'Duplicate Record',
    severity: 'medium',
    currentValue: '2023-03-11',
    suggestedFix: 'Remove duplicate',
    explanation: 'Duplicate entry for SKU_012, Amazon, Central region on same date. Keeping first occurrence.',
    impactScore: 6.9
  },
  {
    id: 'dq_008',
    file: 'dim_product.csv',
    rowNumber: 34,
    column: 'DISCONTINUED_FLAG',
    issueType: 'Inconsistent Format',
    severity: 'low',
    currentValue: 'false',
    suggestedFix: 'False',
    explanation: 'Standardized boolean flag to title case format (True/False)',
    impactScore: 2.5
  },
  {
    id: 'dq_009',
    file: 'dim_channel.csv',
    rowNumber: 3,
    column: 'REGION',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: 'Pan-India',
    explanation: 'Inferred from channel type (D2C operates across all regions)',
    impactScore: 5.2
  },
  {
    id: 'dq_010',
    file: 'cost_parameters.csv',
    rowNumber: 15,
    column: 'HOLDING_COST_PER_UNIT_PER_DAY',
    issueType: 'Outlier',
    severity: 'low',
    currentValue: '0.00',
    suggestedFix: '2.14',
    explanation: 'Zero holding cost is unrealistic. Imputed with category average for Wearables.',
    impactScore: 2.8
  }
];

export const dataQualitySummary = {
  totalIssues: 10,
  highSeverity: 3,
  mediumSeverity: 4,
  lowSeverity: 3,
  filesAffected: 4,
  rowsAffected: 10,
  estimatedAccuracyImprovement: '12-15%'
};
