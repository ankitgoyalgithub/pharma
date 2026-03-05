// External drivers data for Consumer Electronics Industry
import { promotionsData } from './promotionsData';

// Helper function to get external driver data by name
export const getExternalDriverData = (driverName: string) => {
  const key = driverName.replace(/\s+/g, '_').replace(/&/g, '').replace(/\(|\)/g, '');
  return externalDriversData[key as keyof typeof externalDriversData] || [];
};
import { weatherClimateData } from '../foundry/weatherClimateData';
import { seasonalIllnessData } from '../foundry/seasonalIllnessData';
import { prescriptionTrendsData } from '../foundry/prescriptionTrendsData';
import { medicalConferenceData } from '../foundry/medicalConferenceData';
import { healthcarePolicyData } from '../foundry/healthcarePolicyData';
import { genericDrugLaunchesData } from '../foundry/genericDrugLaunchesData';
import { diseaseOutbreakData } from '../foundry/diseaseOutbreakData';

export const externalDriversData = {
  // Search Trends (Google)
  "Search_Trends_Google": [
    { date: "2023-01-01", search_keyword: "wireless earbuds", geo: "IN", category: "Earbuds", trend_score: 38 },
    { date: "2023-01-01", search_keyword: "bluetooth speaker", geo: "IN", category: "Speakers", trend_score: 22 },
    { date: "2023-01-01", search_keyword: "noise cancelling headphones", geo: "IN", category: "Headphones", trend_score: 41 },
    { date: "2023-01-08", search_keyword: "wireless earbuds", geo: "IN", category: "Earbuds", trend_score: 42 },
    { date: "2023-01-08", search_keyword: "smartwatch under 5000", geo: "IN", category: "Wearables", trend_score: 55 },
    { date: "2023-01-08", search_keyword: "bluetooth speaker", geo: "IN", category: "Speakers", trend_score: 47 },
    { date: "2023-02-05", search_keyword: "wireless earbuds", geo: "IN", category: "Earbuds", trend_score: 61 },
    { date: "2023-02-05", search_keyword: "neckband earphones", geo: "IN", category: "Earbuds", trend_score: 45 },
    { date: "2023-03-05", search_keyword: "wireless earbuds", geo: "IN", category: "Earbuds", trend_score: 82 },
    { date: "2023-03-12", search_keyword: "noise cancelling headphones", geo: "IN", category: "Headphones", trend_score: 89 },
  ],

  // Weather & Climate Data - from Feature Store
  "Weather_Climate_Data": weatherClimateData.map(w => ({
    month: w.month,
    region: w.region,
    avgTempC: w.avg_temp_c,
    humidityIndex: w.humidity_index,
    rainfallMm: w.rainfall_mm,
    demandImpact: w.humidity_index > 0.65 ? "High" : w.humidity_index > 0.5 ? "Medium" : "Low",
    affectedCategories: w.humidity_index > 0.65 ? ["Speakers", "Headphones"] : ["Earbuds", "Wearables"]
  })),

  // Platform Sale Events (replaces Seasonal Illness Patterns)
  "Platform_Sale_Events": [
    { eventName: "Republic Day Sale", platform: "Amazon + Flipkart", startDate: "2025-01-20", endDate: "2025-01-28", expectedUplift: 45, affectedCategories: ["All"] },
    { eventName: "Prime Day", platform: "Amazon", startDate: "2025-07-15", endDate: "2025-07-17", expectedUplift: 120, affectedCategories: ["All"] },
    { eventName: "Big Billion Days", platform: "Flipkart", startDate: "2025-10-05", endDate: "2025-10-12", expectedUplift: 180, affectedCategories: ["All"] },
    { eventName: "Great Indian Festival", platform: "Amazon", startDate: "2025-10-08", endDate: "2025-10-15", expectedUplift: 160, affectedCategories: ["All"] },
    { eventName: "Black Friday", platform: "All", startDate: "2025-11-28", endDate: "2025-12-02", expectedUplift: 85, affectedCategories: ["Premium"] },
    { eventName: "Year End Sale", platform: "All", startDate: "2025-12-20", endDate: "2025-12-31", expectedUplift: 65, affectedCategories: ["All"] },
  ],

  // Competitor Activity Tracking (replaces Disease Outbreak Tracking)
  "Competitor_Activity": diseaseOutbreakData.map(d => ({
    weekStart: d.week_start,
    region: d.state,
    activity: d.disease,
    impactScore: d.severity_index,
    affectedSKUs: ["SKU_001", "SKU_007", "SKU_021"],
    demandImpactPct: Math.round(d.severity_index * 30)
  })),

  // Category Demand Trends (replaces Prescription Trends)
  "Category_Demand_Trends": prescriptionTrendsData.map(p => ({
    month: p.month,
    earbudsIndex: p.rx_index_antibiotic,
    headphonesIndex: p.rx_index_respiratory,
    wearablesIndex: p.rx_index_diabetes,
    topCategory: p.rx_index_respiratory > 1.0 ? "Headphones" : 
               p.rx_index_antibiotic > 1.0 ? "Earbuds" : "Wearables",
    trendDirection: p.rx_index_respiratory > 1.05 || p.rx_index_antibiotic > 1.05 ? "Rising" : "Stable"
  })),

  // Tech Events Calendar (replaces Medical Conference Calendar)
  "Tech_Events_Calendar": medicalConferenceData.map(m => ({
    eventName: m.event_name,
    city: m.city,
    startDate: m.start_date,
    endDate: m.end_date,
    category: m.therapy_area,
    expectedSalesUpliftPct: m.expected_rx_uplift_pct,
    affectedSKUs: m.therapy_area === "Audio" ? ["SKU_001", "SKU_007", "SKU_029"] :
                  m.therapy_area === "Wearables" ? ["SKU_003", "SKU_038"] :
                  ["SKU_001", "SKU_005", "SKU_021"]
  })),

  // Regulatory Changes (replaces Healthcare Policy Changes)
  "Regulatory_Changes": healthcarePolicyData.map(h => ({
    effectiveDate: h.effective_date,
    policyType: h.policy_type,
    agency: h.agency,
    affectedCategory: h.affected_therapy_area,
    expectedDemandImpactPct: h.expected_demand_impact_pct,
    affectedSKUs: h.affected_therapy_area === "Earbuds/Headphones" ? ["SKU_001", "SKU_007", "SKU_021", "SKU_035"] :
                  h.affected_therapy_area === "Wearables/Speakers" ? ["SKU_003", "SKU_005", "SKU_029"] :
                  ["SKU_001", "SKU_005", "SKU_007", "SKU_021"]
  })),

  // Competitor Launches (replaces Generic Drug Launches)
  "Competitor_Launches": genericDrugLaunchesData.map(g => ({
    launchMonth: g.launch_month,
    productType: g.molecule,
    category: g.therapy_area,
    expectedPriceDropPct: g.expected_price_drop_pct,
    expectedVolumeUpliftPct: g.expected_volume_uplift_pct,
    competingWithSKU: g.therapy_area === "Earbuds" ? "SKU_001" : 
                      g.therapy_area === "Wearables" ? "SKU_003" : "SKU_021"
  })),

  // Promotional Campaigns - using promotions data
  "Promotional_Campaigns": promotionsData.map(p => ({
    promoId: p.promoId,
    promoType: p.promoType,
    brand: p.brand,
    sku: p.sku,
    discountPct: p.discountPct,
    startWeek: p.startWeek,
    endWeek: p.endWeek,
    description: p.description,
    estimatedLift: Math.round(p.discountPct * 1.8)
  })),

  // Holiday Calendar (India focused for Consumer Electronics)
  "Holiday_Calendar": [
    { date: "2025-01-14", event: "Makar Sankranti", type: "Festival", region: "Pan-India", impact: "Medium", salesLift: 1.15, duration: 2 },
    { date: "2025-01-26", event: "Republic Day Sale", type: "Sale Event", region: "Pan-India", impact: "High", salesLift: 1.45, duration: 5 },
    { date: "2025-03-14", event: "Holi", type: "Festival", region: "North/West", impact: "Medium", salesLift: 1.25, duration: 2 },
    { date: "2025-03-31", event: "Eid ul-Fitr", type: "Festival", region: "Pan-India", impact: "Medium", salesLift: 1.20, duration: 3 },
    { date: "2025-07-15", event: "Amazon Prime Day", type: "Sale Event", region: "Pan-India", impact: "Very High", salesLift: 2.20, duration: 3 },
    { date: "2025-08-15", event: "Independence Day Sale", type: "Sale Event", region: "Pan-India", impact: "High", salesLift: 1.55, duration: 5 },
    { date: "2025-10-02", event: "Gandhi Jayanti", type: "Public Holiday", region: "Pan-India", impact: "Low", salesLift: 0.88, duration: 1 },
    { date: "2025-10-05", event: "Big Billion Days", type: "Sale Event", region: "Pan-India", impact: "Very High", salesLift: 2.80, duration: 7 },
    { date: "2025-10-20", event: "Diwali", type: "Festival", region: "Pan-India", impact: "Very High", salesLift: 2.50, duration: 5 },
    { date: "2025-11-28", event: "Black Friday", type: "Sale Event", region: "Metro Cities", impact: "High", salesLift: 1.85, duration: 4 },
    { date: "2025-12-25", event: "Christmas", type: "Commercial", region: "Metro Cities", impact: "High", salesLift: 1.65, duration: 5 },
  ],

  // Social Media Sentiment
  "Social_Media_Sentiment": [
    { date: "2025-01-15", platform: "Twitter", sentiment_score: 0.72, brand_mentions: 4500, category: "Earbuds" },
    { date: "2025-01-15", platform: "Instagram", sentiment_score: 0.85, brand_mentions: 8200, category: "Wearables" },
    { date: "2025-02-15", platform: "YouTube", sentiment_score: 0.78, brand_mentions: 12000, category: "Headphones" },
    { date: "2025-02-15", platform: "Twitter", sentiment_score: 0.65, brand_mentions: 3800, category: "Speakers" },
    { date: "2025-03-15", platform: "Instagram", sentiment_score: 0.88, brand_mentions: 9500, category: "Earbuds" },
    { date: "2025-03-15", platform: "YouTube", sentiment_score: 0.82, brand_mentions: 15000, category: "Headphones" },
  ],

  // Consumer Sentiment Index
  "Consumer_Sentiment_Index": [
    { month: "2025-01", region: "North", confidence_index: 72, spending_propensity: 0.65, electronics_intent: 0.58 },
    { month: "2025-01", region: "South", confidence_index: 78, spending_propensity: 0.72, electronics_intent: 0.65 },
    { month: "2025-01", region: "West", confidence_index: 75, spending_propensity: 0.68, electronics_intent: 0.62 },
    { month: "2025-02", region: "North", confidence_index: 70, spending_propensity: 0.62, electronics_intent: 0.55 },
    { month: "2025-02", region: "South", confidence_index: 76, spending_propensity: 0.70, electronics_intent: 0.63 },
    { month: "2025-03", region: "North", confidence_index: 68, spending_propensity: 0.58, electronics_intent: 0.50 },
    { month: "2025-10", region: "Pan-India", confidence_index: 88, spending_propensity: 0.85, electronics_intent: 0.82 },
    { month: "2025-11", region: "Pan-India", confidence_index: 82, spending_propensity: 0.78, electronics_intent: 0.75 },
    { month: "2025-12", region: "Pan-India", confidence_index: 85, spending_propensity: 0.82, electronics_intent: 0.78 },
  ],

  // Influencer Campaign Tracker
  "Influencer_Campaign_Tracker": [
    { campaignId: "INF001", influencer: "TechBar", platform: "YouTube", category: "Earbuds", reach: 2500000, engagementRate: 4.5, startDate: "2025-01-10", endDate: "2025-01-25", estimatedSalesLift: 12 },
    { campaignId: "INF002", influencer: "GadgetGuru", platform: "Instagram", category: "Wearables", reach: 1800000, engagementRate: 6.2, startDate: "2025-02-14", endDate: "2025-02-28", estimatedSalesLift: 8 },
    { campaignId: "INF003", influencer: "SoundCheck", platform: "YouTube", category: "Headphones", reach: 3200000, engagementRate: 5.1, startDate: "2025-03-01", endDate: "2025-03-15", estimatedSalesLift: 15 },
    { campaignId: "INF004", influencer: "TechBurner", platform: "YouTube", category: "Speakers", reach: 5000000, engagementRate: 3.8, startDate: "2025-07-10", endDate: "2025-07-20", estimatedSalesLift: 18 },
  ],

  // New Product Launches
  "New_Product_Launches": [
    { launchId: "NPL001", productName: "ANC Earbuds Pro", brand: "Product Line A", launchDate: "2025-02-01", category: "Earbuds", expectedVolume: 50000, cannibalizationRisk: "SKU_001" },
    { launchId: "NPL002", productName: "Budget Fitness Band v3", brand: "Product Line B", launchDate: "2025-03-15", category: "Wearables", expectedVolume: 25000, cannibalizationRisk: "None" },
    { launchId: "NPL003", productName: "Studio Headphones X1", brand: "Product Line C", launchDate: "2025-05-01", category: "Headphones", expectedVolume: 15000, cannibalizationRisk: "SKU_021" },
    { launchId: "NPL004", productName: "Party Speaker Max", brand: "Product Line D", launchDate: "2025-09-01", category: "Speakers", expectedVolume: 35000, cannibalizationRisk: "SKU_029" },
  ],

  // Competitor Pricing Data
  "Competitor_Pricing": [
    { month: "2025-01", competitor: "boAt", category: "Earbuds", avgPrice: 1499, priceChange: -5, marketShare: 28 },
    { month: "2025-01", competitor: "JBL", category: "Speakers", avgPrice: 3999, priceChange: 0, marketShare: 22 },
    { month: "2025-02", competitor: "Noise", category: "Wearables", avgPrice: 2499, priceChange: -8, marketShare: 18 },
    { month: "2025-02", competitor: "Sony", category: "Headphones", avgPrice: 8999, priceChange: -3, marketShare: 15 },
    { month: "2025-03", competitor: "boAt", category: "Earbuds", avgPrice: 1399, priceChange: -7, marketShare: 30 },
    { month: "2025-03", competitor: "Samsung", category: "Wearables", avgPrice: 4999, priceChange: -10, marketShare: 12 },
  ],
};
