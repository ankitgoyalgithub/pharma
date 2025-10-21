export const gapData = [
  { week: "Week 1", actual: 150, imputed: 150, explanation: "Original value unchanged" },
  { week: "Week 2", actual: 155, imputed: 155, explanation: "Original value unchanged" },
  { week: "Week 3", actual: null, imputed: 154, explanation: "Linear interpolation between Week 2 (155) and Week 4 (160), adjusted for trend pattern" },
  { week: "Week 4", actual: 160, imputed: 160, explanation: "Original value unchanged" },
  { week: "Week 5", actual: 165, imputed: 165, explanation: "Original value unchanged" },
];