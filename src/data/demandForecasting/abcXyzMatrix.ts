export const abcXyzMatrixData = [
  // Row A (80% Value) - Premium High-Volume Products
  {
    segment: "AX",
    row: "A",
    col: "X",
    skuCount: 12,
    revenue: "₹42.3Cr",
    label: "Star performers",
    priority: "high",
    description: "Stable high-value SKUs (Premium Earbuds, Headphones) - ensure 99% availability across Amazon & Flipkart"
  },
  {
    segment: "AY",
    row: "A",
    col: "Y",
    skuCount: 8,
    revenue: "₹18.6Cr",
    label: "Festival spikes",
    priority: "medium",
    description: "Variable high-value items - adjust for sale events (BBD, Prime Day, Diwali)"
  },
  {
    segment: "AZ",
    row: "A",
    col: "Z",
    skuCount: 5,
    revenue: "₹7.2Cr",
    label: "New launches",
    priority: "risk",
    description: "Erratic high-value new products - closely monitor D2C and marketplace performance"
  },
  // Row B (15% Value) - Mid-Range Products
  {
    segment: "BX",
    row: "B",
    col: "X",
    skuCount: 15,
    revenue: "₹12.4Cr",
    label: "Steady sellers",
    priority: "medium",
    description: "Stable mid-value products (Budget Earbuds, Neckbands) - standard replenishment"
  },
  {
    segment: "BY",
    row: "B",
    col: "Y",
    skuCount: 10,
    revenue: "₹8.8Cr",
    label: "Seasonal audio",
    priority: "medium",
    description: "Variable mid-value items (Speakers, Party range) - seasonal demand patterns"
  },
  {
    segment: "BZ",
    row: "B",
    col: "Z",
    skuCount: 6,
    revenue: "₹2.4Cr",
    label: "Watch closely",
    priority: "risk",
    description: "Erratic demand patterns - monitor for competitor impact and clearance"
  },
  // Row C (5% Value) - Long-Tail Products
  {
    segment: "CX",
    row: "C",
    col: "X",
    skuCount: 18,
    revenue: "₹3.2Cr",
    label: "Budget basics",
    priority: "low",
    description: "Stable low-value accessories and budget items - minimal safety stock"
  },
  {
    segment: "CY",
    row: "C",
    col: "Y",
    skuCount: 12,
    revenue: "₹2.1Cr",
    label: "Niche products",
    priority: "low",
    description: "Variable low-value niche wearables - periodic bulk orders"
  },
  {
    segment: "CZ",
    row: "C",
    col: "Z",
    skuCount: 8,
    revenue: "₹1.1Cr",
    label: "Phase-out candidates",
    priority: "low",
    description: "Erratic low-value items - consider SKU rationalization and clearance sales"
  },
];

export const abcXyzHeaders = {
  rows: [
    { id: "A", label: "A", sublabel: "80% Value" },
    { id: "B", label: "B", sublabel: "15% Value" },
    { id: "C", label: "C", sublabel: "5% Value" },
  ],
  cols: [
    { id: "X", label: "X (Stable)", sublabel: "CV < 0.5" },
    { id: "Y", label: "Y (Variable)", sublabel: "0.5 ≤ CV ≤ 1.0" },
    { id: "Z", label: "Z (Erratic)", sublabel: "CV ≥ 1.0" },
  ],
};

export const abcXyzLegend = [
  { label: "High Priority", color: "success", description: "Ensure availability" },
  { label: "Medium Priority", color: "warning", description: "Balance service & inventory" },
  { label: "Risk Items", color: "destructive", description: "Monitor closely" },
  { label: "Low Priority", color: "muted", description: "Minimize inventory" },
];
