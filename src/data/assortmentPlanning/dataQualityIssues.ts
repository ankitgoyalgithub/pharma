export const dataQualityIssues = [
  {
    severity: 'high',
    category: 'Missing Data',
    issue: 'Product margin data missing',
    affected: '12 SKUs (2.3% of catalog)',
    recommendation: 'Impute using category average margins',
    autoFixable: true
  },
  {
    severity: 'medium',
    category: 'Inconsistency',
    issue: 'Size range format varies across categories',
    affected: '45 products in footwear',
    recommendation: 'Standardize to numeric size ranges',
    autoFixable: true
  },
  {
    severity: 'low',
    category: 'Outliers',
    issue: 'Unusual sales spike detected',
    affected: 'SKU-A089, Week 2025-W08',
    recommendation: 'Review for promotional activity or data entry error',
    autoFixable: false
  },
  {
    severity: 'medium',
    category: 'Completeness',
    issue: 'Store cluster assignments incomplete',
    affected: '3 new stores',
    recommendation: 'Assign clusters based on demographic similarity',
    autoFixable: true
  }
];
