export const abcXyzMatrixData = [
  // Row A (80% Value) - Critical Medicines
  {
    segment: "AX",
    row: "A",
    col: "X",
    skuCount: 45,
    revenue: "₹42.3Cr",
    label: "Essential medicines",
    priority: "high",
    description: "Stable high-value chronic care drugs (Diabetes, Cardiac) - ensure 99% availability"
  },
  {
    segment: "AY",
    row: "A",
    col: "Y",
    skuCount: 32,
    revenue: "₹18.6Cr",
    label: "Seasonal therapeutics",
    priority: "medium",
    description: "Variable high-value items - adjust for disease seasonality patterns"
  },
  {
    segment: "AZ",
    row: "A",
    col: "Z",
    skuCount: 18,
    revenue: "₹7.2Cr",
    label: "Outbreak response",
    priority: "risk",
    description: "Erratic high-value drugs (epidemic-driven) - monitor outbreak alerts closely"
  },
  // Row B (15% Value) - Regular Medicines
  {
    segment: "BX",
    row: "B",
    col: "X",
    skuCount: 86,
    revenue: "₹12.4Cr",
    label: "OTC essentials",
    priority: "medium",
    description: "Stable mid-value OTC products - standard replenishment protocols"
  },
  {
    segment: "BY",
    row: "B",
    col: "Y",
    skuCount: 72,
    revenue: "₹8.8Cr",
    label: "Respiratory & Allergy",
    priority: "medium",
    description: "Variable mid-value seasonal drugs - balance availability and expiry risk"
  },
  {
    segment: "BZ",
    row: "B",
    col: "Z",
    skuCount: 28,
    revenue: "₹2.4Cr",
    label: "Watch closely",
    priority: "risk",
    description: "Erratic demand patterns - monitor for near-expiry clearance"
  },
  // Row C (5% Value) - Low-Movement Items
  {
    segment: "CX",
    row: "C",
    col: "X",
    skuCount: 124,
    revenue: "₹3.2Cr",
    label: "Vitamins & Supplements",
    priority: "low",
    description: "Stable low-value supplements - minimal safety stock needed"
  },
  {
    segment: "CY",
    row: "C",
    col: "Y",
    skuCount: 95,
    revenue: "₹2.1Cr",
    label: "Generic alternatives",
    priority: "low",
    description: "Variable low-value generics - periodic bulk procurement"
  },
  {
    segment: "CZ",
    row: "C",
    col: "Z",
    skuCount: 42,
    revenue: "₹1.1Cr",
    label: "Phase-out candidates",
    priority: "low",
    description: "Erratic low-value items - consider SKU rationalization"
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
  { label: "Medium Priority", color: "warning", description: "Balance service & expiry" },
  { label: "Risk Items", color: "destructive", description: "Monitor closely" },
  { label: "Low Priority", color: "muted", description: "Minimize inventory" },
];