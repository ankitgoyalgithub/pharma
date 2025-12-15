// Data Gap Imputation Preview - Pharma Context
export const gapData = [
  { week: "Week 1", actual: 12500, imputed: 12500, explanation: "Original sales value unchanged for Paracetamol 500mg" },
  { week: "Week 2", actual: 13200, imputed: 13200, explanation: "Original sales value unchanged" },
  { week: "Week 3", actual: null, imputed: 12850, explanation: "Linear interpolation between Week 2 (13200) and Week 4 (12800), adjusted for seasonal pattern" },
  { week: "Week 4", actual: 12800, imputed: 12800, explanation: "Original sales value unchanged" },
  { week: "Week 5", actual: 14500, imputed: 14500, explanation: "Original value unchanged - expected uptick due to monsoon onset and respiratory demand" },
];