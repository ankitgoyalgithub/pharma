export const abcXyzMatrixData = [
  // Row A (80% Value)
  {
    segment: "AX",
    row: "A",
    col: "X",
    skuCount: 128,
    revenue: "$42.3M",
    label: "Core bestsellers",
    priority: "high",
    description: "Stable high-value fashion items - ensure 99% availability for key styles"
  },
  {
    segment: "AY",
    row: "A",
    col: "Y",
    skuCount: 96,
    revenue: "$18.6M",
    label: "Seasonal trends",
    priority: "medium",
    description: "Variable high-value items - adjust for seasonal fashion cycles"
  },
  {
    segment: "AZ",
    row: "A",
    col: "Z",
    skuCount: 32,
    revenue: "$7.2M",
    label: "Trend pieces",
    priority: "risk",
    description: "Erratic high-value trend items - monitor closely for markdowns"
  },
  // Row B (15% Value)
  {
    segment: "BX",
    row: "B",
    col: "X",
    skuCount: 192,
    revenue: "$12.4M",
    label: "Everyday basics",
    priority: "medium",
    description: "Stable mid-value basics - standard replenishment protocols"
  },
  {
    segment: "BY",
    row: "B",
    col: "Y",
    skuCount: 224,
    revenue: "$8.8M",
    label: "Occasion wear",
    priority: "medium",
    description: "Variable mid-value items - balance availability and markdown risk"
  },
  {
    segment: "BZ",
    row: "B",
    col: "Z",
    skuCount: 64,
    revenue: "$2.4M",
    label: "Watch closely",
    priority: "risk",
    description: "Erratic demand patterns - monitor for clearance timing"
  },
  // Row C (5% Value)
  {
    segment: "CX",
    row: "C",
    col: "X",
    skuCount: 256,
    revenue: "$3.2M",
    label: "Accessories",
    priority: "low",
    description: "Stable low-value accessories - minimal safety stock needed"
  },
  {
    segment: "CY",
    row: "C",
    col: "Y",
    skuCount: 224,
    revenue: "$2.1M",
    label: "Bulk buys",
    priority: "low",
    description: "Variable low-value items - periodic bulk procurement"
  },
  {
    segment: "CZ",
    row: "C",
    col: "Z",
    skuCount: 64,
    revenue: "$1.1M",
    label: "Slow movers",
    priority: "low",
    description: "Erratic low-value items - consider phasing out"
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
  { label: "High Priority", color: "success", description: "Focus on availability" },
  { label: "Medium Priority", color: "warning", description: "Balance service & cost" },
  { label: "Risk Items", color: "destructive", description: "Needs monitoring" },
  { label: "Low Priority", color: "muted", description: "Minimize inventory" },
];
