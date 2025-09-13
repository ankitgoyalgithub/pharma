export const gapData = [
  { week: "Week 1", actual: 100, imputed: 100, explanation: "Original value unchanged" },
  { week: "Week 2", actual: 120, imputed: 120, explanation: "Original value unchanged" },
  { week: "Week 3", actual: null, imputed: 118, explanation: "Linear interpolation between Week 2 (120) and Week 4 (130), adjusted for seasonal pattern" },
  { week: "Week 4", actual: 130, imputed: 130, explanation: "Original value unchanged" },
  { week: "Week 5", actual: 140, imputed: 140, explanation: "Original value unchanged" },
];