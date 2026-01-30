// Pharmaceutical Promotions Data
export const promotionsData = [
  { promoId: "PROMO001", promoType: "Trade Scheme", brand: "Calmofen", sku: "SKU001", discountPct: 12, startWeek: "2025-W10", endWeek: "2025-W12", description: "12% Trade Scheme on Paracetamol 500mg" },
  { promoId: "PROMO002", promoType: "Volume Discount", brand: "AziSure", sku: "SKU002", discountPct: 15, startWeek: "2025-W07", endWeek: "2025-W09", description: "15% Volume Discount on Azithromycin" },
  { promoId: "PROMO003", promoType: "Seasonal Offer", brand: "CetiClear", sku: "SKU003", discountPct: 18, startWeek: "2025-W14", endWeek: "2025-W18", description: "18% Allergy Season Offer on Cetirizine" },
  { promoId: "PROMO004", promoType: "Combo Pack", brand: "Glaris", sku: "SKU004", discountPct: 10, startWeek: "2025-W03", endWeek: "2025-W06", description: "10% Combo Pack on Insulin Glargine" },
  { promoId: "PROMO005", promoType: "Trade Scheme", brand: "MoxiClav", sku: "SKU005", discountPct: 20, startWeek: "2025-W05", endWeek: "2025-W08", description: "20% Trade Scheme on Amoxicillin+Clav" },
  { promoId: "PROMO006", promoType: "Government Tender", brand: "Rehydra", sku: "SKU006", discountPct: 25, startWeek: "2025-W01", endWeek: "2025-W04", description: "25% Government Tender on ORS" },
  { promoId: "PROMO007", promoType: "Seasonal Offer", brand: "BreatheEZ", sku: "SKU007", discountPct: 15, startWeek: "2025-W26", endWeek: "2025-W32", description: "15% Monsoon Offer on Salbutamol Inhaler" },
  { promoId: "PROMO008", promoType: "Volume Discount", brand: "D3Max", sku: "SKU008", discountPct: 22, startWeek: "2025-W44", endWeek: "2025-W48", description: "22% Volume Discount on Vitamin D3" },
  { promoId: "PROMO009", promoType: "Hospital Scheme", brand: "Ceftron", sku: "SKU009", discountPct: 18, startWeek: "2025-W09", endWeek: "2025-W12", description: "18% Hospital Scheme on Ceftriaxone" },
  { promoId: "PROMO010", promoType: "Trade Scheme", brand: "PantoCare", sku: "SKU010", discountPct: 14, startWeek: "2025-W06", endWeek: "2025-W09", description: "14% Trade Scheme on Pantoprazole" },
  { promoId: "PROMO011", promoType: "Launch Offer", brand: "Calmofen", sku: "SKU001", discountPct: 30, startWeek: "2025-W20", endWeek: "2025-W22", description: "30% Launch Offer for new pack size" },
  { promoId: "PROMO012", promoType: "E-Pharmacy Exclusive", brand: "D3Max", sku: "SKU008", discountPct: 25, startWeek: "2025-W15", endWeek: "2025-W18", description: "25% E-Pharmacy Exclusive on D3Max" },
  { promoId: "PROMO013", promoType: "Hospital Scheme", brand: "Glaris", sku: "SKU004", discountPct: 12, startWeek: "2025-W22", endWeek: "2025-W26", description: "12% Diabetes Awareness Month Hospital Scheme" },
  { promoId: "PROMO014", promoType: "Seasonal Offer", brand: "AziSure", sku: "SKU002", discountPct: 15, startWeek: "2025-W26", endWeek: "2025-W30", description: "15% Monsoon Respiratory Offer" },
  { promoId: "PROMO015", promoType: "Trade Scheme", brand: "MoxiClav", sku: "SKU005", discountPct: 16, startWeek: "2025-W32", endWeek: "2025-W36", description: "16% Post-Monsoon Antibiotic Push" },
  { promoId: "PROMO016", promoType: "Government Tender", brand: "Ceftron", sku: "SKU009", discountPct: 28, startWeek: "2025-W18", endWeek: "2025-W22", description: "28% State Hospital Tender" },
  { promoId: "PROMO017", promoType: "Combo Pack", brand: "PantoCare", sku: "SKU010", discountPct: 12, startWeek: "2025-W38", endWeek: "2025-W42", description: "12% Diwali Combo Pack" },
  { promoId: "PROMO018", promoType: "Volume Discount", brand: "Rehydra", sku: "SKU006", discountPct: 20, startWeek: "2025-W24", endWeek: "2025-W28", description: "20% Summer Volume Push on ORS" },
  { promoId: "PROMO019", promoType: "E-Pharmacy Exclusive", brand: "CetiClear", sku: "SKU003", discountPct: 18, startWeek: "2025-W12", endWeek: "2025-W15", description: "18% Spring Allergy E-Pharmacy Deal" },
  { promoId: "PROMO020", promoType: "Hospital Scheme", brand: "BreatheEZ", sku: "SKU007", discountPct: 14, startWeek: "2025-W44", endWeek: "2025-W48", description: "14% Winter Respiratory Hospital Push" },
];

// Get promotions by brand
export const getPromotionsByBrand = (brand: string) => {
  return promotionsData.filter(p => p.brand === brand);
};

// Get promotions by week
export const getPromotionsByWeek = (week: string) => {
  return promotionsData.filter(p => {
    const startNum = parseInt(p.startWeek.split('-W')[1]);
    const endNum = parseInt(p.endWeek.split('-W')[1]);
    const weekNum = parseInt(week.split('-W')[1]);
    return weekNum >= startNum && weekNum <= endNum;
  });
};

// Get promotion types summary
export const getPromotionTypeSummary = () => {
  const summary: Record<string, number> = {};
  promotionsData.forEach(p => {
    summary[p.promoType] = (summary[p.promoType] || 0) + 1;
  });
  return summary;
};