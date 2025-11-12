export const aiResponses = {
  dataMapping: `I've analyzed your uploaded files and mapped them to the assortment planning framework:

**Product Master** → Product_Catalog.xlsx
- 524 unique SKUs identified across 8 product categories
- Complete attribute coverage: pricing, margins, dimensions, ratings
- Brand distribution: 45 brands with StyleCo, Essentials, and SportPro as top performers

**Store Master** → Store_Attributes.csv
- 82 active stores across 5 store formats
- Store clustering completed: 4 distinct clusters identified
- Space capacity ranges from 3,500 to 18,000 sq ft

**Sales History** → Sales_Performance_24M.xlsx
- 24 months of transaction-level sales data
- 1.2M+ sales records with complete revenue and unit metrics
- Seasonality patterns detected for apparel and footwear categories

All required data sources are present with 96% completeness. Ready to proceed with assortment optimization.`,

  driverAnalysis: `Based on the selected external drivers, here's the assortment strategy analysis:

**Trend Analysis** reveals strong momentum in:
- Athleisure category (+28% YoY growth)
- Sustainable/eco-friendly products (+34% customer preference)
- Gender-neutral styling (+19% emerging demand)

**Seasonality Patterns** show:
- Q4 holiday surge: 42% of annual revenue concentrated in Nov-Dec
- Spring refresh (Mar-Apr): 23% revenue share with apparel focus
- Back-to-school (Aug-Sep): 18% with accessories and footwear peaks

**Store Clustering** optimization suggests:
- Urban Premium stores: Fashion-forward, premium price points, deeper assortment
- Suburban Standard: Balanced mix, family-oriented, value + quality
- Trend Forward: Early adopters, exclusive launches, higher turnover
- Value Seekers: Price-sensitive, basics-focused, promotional intensity

**Price Sensitivity** analysis indicates:
- Sweet spot: $50-$120 range captures 68% of transaction volume
- Premium segment ($150+): 15% of sales, 32% of margin contribution
- Value segment (<$40): High velocity, lower margins, traffic drivers

Recommended strategy: Implement cluster-specific assortment depth with 15-20% localized SKU variation while maintaining 80% core assortment consistency.`,

  qualityCheck: `Data quality assessment completed across all input sources:

**High Severity Issues (Requires Action):**
- Product margin data missing for 12 SKUs (2.3% of catalog)
  → Impact: Revenue projection accuracy reduced by ~1.5%
  → Fix: Auto-impute using category-level average margins

**Medium Severity (Recommended Fix):**
- Size range format inconsistency in footwear (45 products)
  → Impact: Potential sizing analysis errors
  → Fix: Standardize to numeric ranges (e.g., 6-13)
  
- Store cluster assignments incomplete for 3 new stores
  → Impact: Sub-optimal assortment recommendations
  → Fix: Assign based on demographic and format similarity

**Low Severity (Monitor):**
- Sales spike outlier detected: SKU-A089, Week 2024-W08
  → Impact: Minimal, isolated anomaly
  → Action: Flagged for promotional activity verification

**Overall Data Quality Score: 94/100**

Applying auto-fixes will increase quality score to 98/100. All critical data for optimization is present and validated.`
};
