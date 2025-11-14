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
    rowNumber: 1247,
    column: 'units_sold',
    issueType: 'Missing Value',
    severity: 'high',
    currentValue: null,
    suggestedFix: '42',
    explanation: 'Linear interpolation between Week 1246 (38) and Week 1248 (46) for product P0073 at location L038',
    impactScore: 8.5
  },
  {
    id: 'dq_002',
    file: 'sales_history.csv',
    rowNumber: 3456,
    column: 'units_sold',
    issueType: 'Outlier',
    severity: 'high',
    currentValue: '9999',
    suggestedFix: '35',
    explanation: 'Value exceeds 3 std dev from mean. Likely data entry error. Replaced with 4-week moving average.',
    impactScore: 9.2
  },
  {
    id: 'dq_003',
    file: 'sales_history.csv',
    rowNumber: 5678,
    column: 'net_selling_price',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '861.00',
    explanation: 'Forward-filled with last known price from Week 5677 for same product',
    impactScore: 6.3
  },
  {
    id: 'dq_004',
    file: 'sales_history.csv',
    rowNumber: 8912,
    column: 'discount_pct',
    issueType: 'Invalid Value',
    severity: 'high',
    currentValue: '1.5',
    suggestedFix: '0.15',
    explanation: 'Discount percentage should be between 0 and 1. Converted from percentage format.',
    impactScore: 8.8
  },
  {
    id: 'dq_005',
    file: 'location_master.csv',
    rowNumber: 12,
    column: 'region',
    issueType: 'Invalid Category',
    severity: 'low',
    currentValue: 'UNKNWN',
    suggestedFix: 'West',
    explanation: 'Standardized to valid region based on city (Pune)',
    impactScore: 3.2
  },
  {
    id: 'dq_006',
    file: 'product_master.csv',
    rowNumber: 23,
    column: 'base_mrp',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: '1520',
    explanation: 'Imputed using category median MRP for Footwear/Sports Shoes',
    impactScore: 5.7
  },
  {
    id: 'dq_007',
    file: 'sales_history.csv',
    rowNumber: 12345,
    column: 'week_start_date',
    issueType: 'Duplicate Record',
    severity: 'medium',
    currentValue: '2024-03-11',
    suggestedFix: 'Remove duplicate',
    explanation: 'Duplicate entry for P0073, L038, C01 on same date. Keeping first occurrence.',
    impactScore: 6.9
  },
  {
    id: 'dq_008',
    file: 'mapping_master.csv',
    rowNumber: 234,
    column: 'listed_flag',
    issueType: 'Inconsistent Format',
    severity: 'low',
    currentValue: 'Yes',
    suggestedFix: '1',
    explanation: 'Standardized boolean flag to numeric format (1/0)',
    impactScore: 2.5
  },
  {
    id: 'dq_009',
    file: 'channel_master.csv',
    rowNumber: 2,
    column: 'channel_type',
    issueType: 'Missing Value',
    severity: 'medium',
    currentValue: null,
    suggestedFix: 'Brick & Mortar',
    explanation: 'Inferred from channel_name (Modern Trade) using common retail classifications',
    impactScore: 5.2
  },
  {
    id: 'dq_010',
    file: 'product_master.csv',
    rowNumber: 67,
    column: 'status',
    issueType: 'Invalid Category',
    severity: 'low',
    currentValue: 'ACTV',
    suggestedFix: 'Active',
    explanation: 'Standardized status value to match data dictionary',
    impactScore: 2.8
  }
];

export const dataQualitySummary = {
  totalIssues: 10,
  highSeverity: 4,
  mediumSeverity: 4,
  lowSeverity: 2,
  filesAffected: 5,
  rowsAffected: 10,
  estimatedAccuracyImprovement: '12-15%'
};
