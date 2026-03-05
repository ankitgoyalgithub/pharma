// Consumer Electronics Promotions Data
export const promotionsData = [
  { promoId: "PROMO001", promoType: "Flash Sale", brand: "Product_1", sku: "SKU_001", discountPct: 15, startWeek: "2025-W10", endWeek: "2025-W12", description: "15% Flash Sale on Earbuds via Amazon" },
  { promoId: "PROMO002", promoType: "Clearance Sale", brand: "Product_5", sku: "SKU_005", discountPct: 20, startWeek: "2025-W07", endWeek: "2025-W09", description: "20% Clearance on TWS Speakers" },
  { promoId: "PROMO003", promoType: "Festival Offer", brand: "Product_7", sku: "SKU_007", discountPct: 25, startWeek: "2025-W14", endWeek: "2025-W18", description: "25% Festival Offer on Neckband Headphones" },
  { promoId: "PROMO004", promoType: "Bundle Deal", brand: "Product_12", sku: "SKU_012", discountPct: 12, startWeek: "2025-W03", endWeek: "2025-W06", description: "12% Bundle Deal on Premium Speakers" },
  { promoId: "PROMO005", promoType: "Platform Exclusive", brand: "Product_21", sku: "SKU_021", discountPct: 18, startWeek: "2025-W05", endWeek: "2025-W08", description: "18% Flipkart Exclusive on OverEar Headphones" },
  { promoId: "PROMO006", promoType: "Republic Day Sale", brand: "Product_29", sku: "SKU_029", discountPct: 22, startWeek: "2025-W04", endWeek: "2025-W05", description: "22% Republic Day Sale on Premium Speakers" },
  { promoId: "PROMO007", promoType: "Summer Sale", brand: "Product_35", sku: "SKU_035", discountPct: 15, startWeek: "2025-W20", endWeek: "2025-W24", description: "15% Summer Sale on Budget Headphones" },
  { promoId: "PROMO008", promoType: "Prime Day", brand: "Product_40", sku: "SKU_040", discountPct: 30, startWeek: "2025-W28", endWeek: "2025-W29", description: "30% Prime Day Deal on Budget Earbuds" },
  { promoId: "PROMO009", promoType: "D2C Launch", brand: "Product_43", sku: "SKU_043", discountPct: 10, startWeek: "2025-W09", endWeek: "2025-W12", description: "10% D2C Launch Offer on Wearables" },
  { promoId: "PROMO010", promoType: "Flash Sale", brand: "Product_49", sku: "SKU_049", discountPct: 14, startWeek: "2025-W06", endWeek: "2025-W09", description: "14% Flash Sale on Premium Earbuds" },
  { promoId: "PROMO011", promoType: "Big Billion Days", brand: "Multiple", sku: "SKU_001", discountPct: 35, startWeek: "2025-W40", endWeek: "2025-W42", description: "35% Big Billion Days on Earbuds range" },
  { promoId: "PROMO012", promoType: "Great Indian Sale", brand: "Multiple", sku: "SKU_005", discountPct: 28, startWeek: "2025-W38", endWeek: "2025-W40", description: "28% Great Indian Sale on Speakers" },
  { promoId: "PROMO013", promoType: "Diwali Offer", brand: "Multiple", sku: "SKU_012", discountPct: 25, startWeek: "2025-W42", endWeek: "2025-W44", description: "25% Diwali Combo on Premium Speakers" },
  { promoId: "PROMO014", promoType: "Back to School", brand: "Product_7", sku: "SKU_007", discountPct: 15, startWeek: "2025-W24", endWeek: "2025-W28", description: "15% Back to School on Headphones" },
  { promoId: "PROMO015", promoType: "Year End Sale", brand: "Multiple", sku: "SKU_021", discountPct: 20, startWeek: "2025-W50", endWeek: "2025-W52", description: "20% Year End Clearance on Headphones" },
  { promoId: "PROMO016", promoType: "Independence Day", brand: "Multiple", sku: "SKU_029", discountPct: 18, startWeek: "2025-W32", endWeek: "2025-W34", description: "18% Independence Day Sale on Speakers" },
  { promoId: "PROMO017", promoType: "Navratri Offer", brand: "Multiple", sku: "SKU_049", discountPct: 22, startWeek: "2025-W38", endWeek: "2025-W40", description: "22% Navratri Offer on Premium Earbuds" },
  { promoId: "PROMO018", promoType: "Student Discount", brand: "Product_35", sku: "SKU_035", discountPct: 12, startWeek: "2025-W14", endWeek: "2025-W18", description: "12% Student Discount on Budget Headphones" },
  { promoId: "PROMO019", promoType: "Valentine's Day", brand: "Product_40", sku: "SKU_040", discountPct: 15, startWeek: "2025-W06", endWeek: "2025-W07", description: "15% Valentine's Day Gift on Earbuds" },
  { promoId: "PROMO020", promoType: "New Year Sale", brand: "Multiple", sku: "SKU_043", discountPct: 20, startWeek: "2025-W01", endWeek: "2025-W03", description: "20% New Year Sale on Wearables" },
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
