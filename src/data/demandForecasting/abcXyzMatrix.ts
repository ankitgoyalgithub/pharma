export const abcXyzMatrixData = [
  // Row A (80% Value)
  {
    segment: "AX",
    row: "A",
    col: "X",
    skuCount: 245,
    revenue: "$6800K",
    label: "High service level",
    priority: "high",
    description: "Stable high-value items - maintain optimal stock"
  },
  {
    segment: "AY",
    row: "A",
    col: "Y",
    skuCount: 127,
    revenue: "$2900K",
    label: "Moderate SS",
    priority: "medium",
    description: "Variable high-value items - moderate safety stock"
  },
  {
    segment: "AZ",
    row: "A",
    col: "Z",
    skuCount: 45,
    revenue: "$890K",
    label: "Risk management",
    priority: "risk",
    description: "Erratic high-value items - requires close monitoring"
  },
  // Row B (15% Value)
  {
    segment: "BX",
    row: "B",
    col: "X",
    skuCount: 198,
    revenue: "$1200K",
    label: "Standard SS",
    priority: "medium",
    description: "Stable medium-value items - standard safety stock"
  },
  {
    segment: "BY",
    row: "B",
    col: "Y",
    skuCount: 267,
    revenue: "$895K",
    label: "Balance cost",
    priority: "medium",
    description: "Variable medium-value items - balance service and cost"
  },
  {
    segment: "BZ",
    row: "B",
    col: "Z",
    skuCount: 89,
    revenue: "$234K",
    label: "High SS",
    priority: "risk",
    description: "Erratic medium-value items - higher safety stock needed"
  },
  // Row C (5% Value)
  {
    segment: "CX",
    row: "C",
    col: "X",
    skuCount: 187,
    revenue: "$345K",
    label: "Low priority",
    priority: "low",
    description: "Stable low-value items - minimal safety stock"
  },
  {
    segment: "BY",
    row: "C",
    col: "Y",
    skuCount: 245,
    revenue: "$289K",
    label: "Bulk approach",
    priority: "low",
    description: "Variable low-value items - periodic bulk ordering"
  },
  {
    segment: "CZ",
    row: "C",
    col: "Z",
    skuCount: 98,
    revenue: "$123K",
    label: "Consider DC",
    priority: "low",
    description: "Erratic low-value items - consider discontinuation"
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
