// boAt Lifestyle Promotions Data — using actual dates instead of week codes
export const promotionsData = [
  { promoId: "PROMO001", promoType: "Flash Sale", brand: "Airdopes 141", sku: "SKU_001", discountPct: 15, startDate: "2025-03-03", endDate: "2025-03-16", description: "15% Flash Sale on Airdopes 141 via Amazon" },
  { promoId: "PROMO002", promoType: "Clearance Sale", brand: "Stone 352", sku: "SKU_005", discountPct: 20, startDate: "2025-02-10", endDate: "2025-02-23", description: "20% Clearance on Stone 352 Bluetooth Speaker" },
  { promoId: "PROMO003", promoType: "Festival Offer", brand: "Rockerz 255 Pro+", sku: "SKU_007", discountPct: 25, startDate: "2025-03-31", endDate: "2025-04-27", description: "25% Festival Offer on Rockerz 255 Pro+ Neckband" },
  { promoId: "PROMO004", promoType: "Bundle Deal", brand: "PartyPal 300", sku: "SKU_012", discountPct: 12, startDate: "2025-01-13", endDate: "2025-02-02", description: "12% Bundle Deal — PartyPal 300 + Airdopes combo" },
  { promoId: "PROMO005", promoType: "Platform Exclusive", brand: "Rockerz 450", sku: "SKU_021", discountPct: 18, startDate: "2025-01-27", endDate: "2025-02-16", description: "18% Flipkart Exclusive on Rockerz 450 Headphones" },
  { promoId: "PROMO006", promoType: "Republic Day Sale", brand: "Stone 1200F", sku: "SKU_029", discountPct: 22, startDate: "2025-01-20", endDate: "2025-01-26", description: "22% Republic Day Sale on Stone 1200F Party Speaker" },
  { promoId: "PROMO007", promoType: "Summer Sale", brand: "Rockerz 238", sku: "SKU_035", discountPct: 15, startDate: "2025-05-12", endDate: "2025-06-08", description: "15% Summer Sale on Rockerz 238 Neckband" },
  { promoId: "PROMO008", promoType: "Prime Day", brand: "Airdopes Alpha", sku: "SKU_040", discountPct: 30, startDate: "2025-07-07", endDate: "2025-07-13", description: "30% Prime Day Deal on Airdopes Alpha TWS" },
  { promoId: "PROMO009", promoType: "D2C Launch", brand: "Lunar Discovery", sku: "SKU_043", discountPct: 10, startDate: "2025-02-24", endDate: "2025-03-16", description: "10% D2C Launch Offer on Lunar Discovery Smartwatch" },
  { promoId: "PROMO010", promoType: "Flash Sale", brand: "Nirvana Ion ANC", sku: "SKU_049", discountPct: 14, startDate: "2025-02-03", endDate: "2025-02-23", description: "14% Flash Sale on Nirvana Ion ANC Earbuds" },
  { promoId: "PROMO011", promoType: "Big Billion Days", brand: "Airdopes Range", sku: "SKU_001", discountPct: 35, startDate: "2025-09-29", endDate: "2025-10-12", description: "35% Big Billion Days on entire Airdopes range" },
  { promoId: "PROMO012", promoType: "Great Indian Sale", brand: "Stone Range", sku: "SKU_005", discountPct: 28, startDate: "2025-09-15", endDate: "2025-09-28", description: "28% Great Indian Sale on Stone Speakers" },
  { promoId: "PROMO013", promoType: "Diwali Offer", brand: "PartyPal Range", sku: "SKU_012", discountPct: 25, startDate: "2025-10-13", endDate: "2025-10-26", description: "25% Diwali Combo — PartyPal + Airdopes gift set" },
  { promoId: "PROMO014", promoType: "Back to College", brand: "Rockerz 255 Pro+", sku: "SKU_007", discountPct: 15, startDate: "2025-06-09", endDate: "2025-07-06", description: "15% Back to College on Neckbands & TWS" },
  { promoId: "PROMO015", promoType: "Year End Sale", brand: "Rockerz 650 Pro", sku: "SKU_021", discountPct: 20, startDate: "2025-12-08", endDate: "2025-12-28", description: "20% Year End Clearance on Rockerz Headphones" },
  { promoId: "PROMO016", promoType: "Independence Day", brand: "Stone Range", sku: "SKU_029", discountPct: 18, startDate: "2025-08-04", endDate: "2025-08-17", description: "18% Independence Day Sale on Stone Speakers" },
  { promoId: "PROMO017", promoType: "Navratri Offer", brand: "Nirvana Range", sku: "SKU_049", discountPct: 22, startDate: "2025-09-15", endDate: "2025-09-28", description: "22% Navratri Offer on Nirvana Premium TWS" },
  { promoId: "PROMO018", promoType: "Student Discount", brand: "Rockerz 238", sku: "SKU_035", discountPct: 12, startDate: "2025-03-31", endDate: "2025-04-27", description: "12% Student Discount on Budget Neckbands" },
  { promoId: "PROMO019", promoType: "Valentine's Day", brand: "Airdopes 141", sku: "SKU_040", discountPct: 15, startDate: "2025-02-03", endDate: "2025-02-09", description: "15% Valentine's Day Gift — Airdopes for your boo" },
  { promoId: "PROMO020", promoType: "New Year Sale", brand: "Lunar Range", sku: "SKU_043", discountPct: 20, startDate: "2024-12-30", endDate: "2025-01-19", description: "20% New Year Sale on Lunar Smartwatches" },
];

// Get promotions by brand
export const getPromotionsByBrand = (brand: string) => {
  return promotionsData.filter(p => p.brand === brand);
};

// Get promotions by date range
export const getPromotionsByDate = (date: string) => {
  return promotionsData.filter(p => date >= p.startDate && date <= p.endDate);
};

// Get promotion types summary
export const getPromotionTypeSummary = () => {
  const summary: Record<string, number> = {};
  promotionsData.forEach(p => {
    summary[p.promoType] = (summary[p.promoType] || 0) + 1;
  });
  return summary;
};
