export const abcXyzMatrixData = [
  // Row A (80% Value)
  {
    segment: "AX",
    row: "A",
    col: "X",
    skuCount: 245,
    revenue: "₹68.0Cr",
    label: "Critical medicines",
    priority: "high",
    description: "Stable high-value drugs - ensure 99% availability for life-saving medicines"
  },
  {
    segment: "AY",
    row: "A",
    col: "Y",
    skuCount: 127,
    revenue: "₹29.0Cr",
    label: "Seasonal drugs",
    priority: "medium",
    description: "Variable high-value drugs - adjust for seasonal illness patterns"
  },
  {
    segment: "AZ",
    row: "A",
    col: "Z",
    skuCount: 45,
    revenue: "₹8.9Cr",
    label: "Specialty drugs",
    priority: "risk",
    description: "Erratic high-value specialty medicines - monitor expiry and demand closely"
  },
  // Row B (15% Value)
  {
    segment: "BX",
    row: "B",
    col: "X",
    skuCount: 198,
    revenue: "₹12.0Cr",
    label: "Chronic care",
    priority: "medium",
    description: "Stable chronic disease medications - standard safety stock protocols"
  },
  {
    segment: "BY",
    row: "B",
    col: "Y",
    skuCount: 267,
    revenue: "₹8.95Cr",
    label: "Acute care",
    priority: "medium",
    description: "Variable acute care medicines - balance availability and expiry risk"
  },
  {
    segment: "BZ",
    row: "B",
    col: "Z",
    skuCount: 89,
    revenue: "₹2.34Cr",
    label: "Watch closely",
    priority: "risk",
    description: "Erratic demand patterns - monitor for generic competition impact"
  },
  // Row C (5% Value)
  {
    segment: "CX",
    row: "C",
    col: "X",
    skuCount: 187,
    revenue: "₹3.45Cr",
    label: "Generic OTC",
    priority: "low",
    description: "Stable low-value OTC drugs - minimal safety stock required"
  },
  {
    segment: "CY",
    row: "C",
    col: "Y",
    skuCount: 245,
    revenue: "₹2.89Cr",
    label: "Bulk ordering",
    priority: "low",
    description: "Variable low-value supplements - periodic bulk procurement"
  },
  {
    segment: "CZ",
    row: "C",
    col: "Z",
    skuCount: 98,
    revenue: "₹1.23Cr",
    label: "Slow movers",
    priority: "low",
    description: "Erratic low-value items - consider phasing out or formulary removal"
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
    { id: "Y", label: "Y (Variable)", sublabel: "0.5 ≤CV ≤1.0" },
    { id: "Z", label: "Z (Erratic)", sublabel: "CV≥1.0" },
  ],
};

export const abcXyzLegend = [
  { label: "High Priority", color: "success", description: "Focus on service level and availability" },
  { label: "Medium Priority", color: "warning", description: "Balance service and cost efficiency" },
  { label: "Risk Items", color: "destructive", description: "Requires special attention and monitoring" },
  { label: "Low Priority", color: "muted", description: "Minimize inventory and cost" },
];
