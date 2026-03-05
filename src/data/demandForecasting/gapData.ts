// Data Gap Imputation Preview - Consumer Electronics Context
export const gapData = [
  { week: "Week 1", actual: 45, imputed: 45, explanation: "Original sales value unchanged for Product_1 Earbuds" },
  { week: "Week 2", actual: 52, imputed: 52, explanation: "Original sales value unchanged" },
  { week: "Week 3", actual: null, imputed: 48, explanation: "Linear interpolation between Week 2 (52) and Week 4 (46), adjusted for seasonal trend" },
  { week: "Week 4", actual: 46, imputed: 46, explanation: "Original sales value unchanged" },
  { week: "Week 5", actual: 58, imputed: 58, explanation: "Original value unchanged - expected uptick due to sale event on Amazon" },
];
