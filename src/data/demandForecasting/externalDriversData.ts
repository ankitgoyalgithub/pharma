// External drivers data for boAt Lifestyle — Consumer Audio & Wearables
import { promotionsData } from './promotionsData';

// Helper function to get external driver data by name
export const getExternalDriverData = (driverName: string) => {
  const key = driverName.replace(/\s+/g, '_').replace(/&/g, '').replace(/\(|\)/g, '');
  return externalDriversData[key as keyof typeof externalDriversData] || [];
};

export const externalDriversData = {
  // Search Trends (Google) — boAt product search interest in India
  "Search_Trends_Google": [
    { date: "2023-01-01", search_keyword: "boat airdopes", geo: "IN", category: "TWS", trend_score: 52 },
    { date: "2023-01-01", search_keyword: "boat rockerz neckband", geo: "IN", category: "Neckbands", trend_score: 38 },
    { date: "2023-01-01", search_keyword: "boat smartwatch", geo: "IN", category: "Smartwatches", trend_score: 45 },
    { date: "2023-01-08", search_keyword: "boat airdopes 141", geo: "IN", category: "TWS", trend_score: 58 },
    { date: "2023-01-08", search_keyword: "boat stone speaker", geo: "IN", category: "Speakers", trend_score: 31 },
    { date: "2023-01-08", search_keyword: "boat nirvana earbuds", geo: "IN", category: "TWS", trend_score: 42 },
    { date: "2023-02-05", search_keyword: "boat airdopes", geo: "IN", category: "TWS", trend_score: 64 },
    { date: "2023-02-05", search_keyword: "boat rockerz 450", geo: "IN", category: "Headphones", trend_score: 48 },
    { date: "2023-03-05", search_keyword: "boat airdopes", geo: "IN", category: "TWS", trend_score: 71 },
    { date: "2023-03-12", search_keyword: "boat lunar smartwatch", geo: "IN", category: "Smartwatches", trend_score: 82 },
    { date: "2023-03-12", search_keyword: "boat partypal speaker", geo: "IN", category: "Party Speakers", trend_score: 55 },
    { date: "2023-07-10", search_keyword: "boat airdopes prime day", geo: "IN", category: "TWS", trend_score: 95 },
    { date: "2023-07-10", search_keyword: "boat earbuds under 1000", geo: "IN", category: "TWS", trend_score: 88 },
    { date: "2023-10-05", search_keyword: "boat diwali sale", geo: "IN", category: "All", trend_score: 100 },
    { date: "2023-10-05", search_keyword: "boat immortal gaming", geo: "IN", category: "Gaming", trend_score: 62 },
  ],

  // Weather & Climate Data — monsoon/summer impact on audio & wearables
  "Weather_Climate_Data": [
    { month: "2023-01", region: "North", avgTempC: 14, humidityIndex: 0.42, rainfallMm: 18, demandImpact: "Low", affectedCategories: ["TWS", "Neckbands"] },
    { month: "2023-02", region: "South", avgTempC: 28, humidityIndex: 0.55, rainfallMm: 12, demandImpact: "Medium", affectedCategories: ["Speakers", "Soundbars"] },
    { month: "2023-03", region: "West", avgTempC: 32, humidityIndex: 0.48, rainfallMm: 5, demandImpact: "Low", affectedCategories: ["TWS", "Smartwatches"] },
    { month: "2023-04", region: "North", avgTempC: 36, humidityIndex: 0.38, rainfallMm: 8, demandImpact: "Low", affectedCategories: ["TWS", "Neckbands"] },
    { month: "2023-05", region: "Pan-India", avgTempC: 38, humidityIndex: 0.45, rainfallMm: 15, demandImpact: "Medium", affectedCategories: ["Smartwatches", "Neckbands"] },
    { month: "2023-06", region: "West", avgTempC: 33, humidityIndex: 0.72, rainfallMm: 285, demandImpact: "High", affectedCategories: ["Speakers", "Party Speakers"] },
    { month: "2023-07", region: "North", avgTempC: 34, humidityIndex: 0.82, rainfallMm: 320, demandImpact: "High", affectedCategories: ["Party Speakers", "Soundbars"] },
    { month: "2023-08", region: "East", avgTempC: 31, humidityIndex: 0.85, rainfallMm: 340, demandImpact: "High", affectedCategories: ["Speakers", "Headphones"] },
    { month: "2023-09", region: "South", avgTempC: 29, humidityIndex: 0.68, rainfallMm: 180, demandImpact: "Medium", affectedCategories: ["TWS", "Smartwatches"] },
    { month: "2023-10", region: "Pan-India", avgTempC: 28, humidityIndex: 0.52, rainfallMm: 45, demandImpact: "Low", affectedCategories: ["All"] },
  ],

  // Platform Sale Events — major Indian e-commerce events
  "Platform_Sale_Events": [
    { eventName: "Republic Day Sale", platform: "Amazon + Flipkart", startDate: "2025-01-20", endDate: "2025-01-28", expectedUplift: 55, affectedCategories: ["All"] },
    { eventName: "boAt Days (D2C)", platform: "boat-lifestyle.com", startDate: "2025-03-10", endDate: "2025-03-15", expectedUplift: 40, affectedCategories: ["Nirvana", "Airdopes"] },
    { eventName: "Flipkart Big Saving Days", platform: "Flipkart", startDate: "2025-05-01", endDate: "2025-05-07", expectedUplift: 65, affectedCategories: ["TWS", "Neckbands"] },
    { eventName: "Amazon Prime Day", platform: "Amazon", startDate: "2025-07-15", endDate: "2025-07-17", expectedUplift: 140, affectedCategories: ["All"] },
    { eventName: "Independence Day Sale", platform: "Amazon + Flipkart", startDate: "2025-08-06", endDate: "2025-08-12", expectedUplift: 70, affectedCategories: ["All"] },
    { eventName: "Big Billion Days", platform: "Flipkart", startDate: "2025-10-05", endDate: "2025-10-12", expectedUplift: 200, affectedCategories: ["All"] },
    { eventName: "Great Indian Festival", platform: "Amazon", startDate: "2025-10-08", endDate: "2025-10-15", expectedUplift: 180, affectedCategories: ["All"] },
    { eventName: "boAt Payday Sale (D2C)", platform: "boat-lifestyle.com", startDate: "2025-11-01", endDate: "2025-11-05", expectedUplift: 35, affectedCategories: ["Smartwatches", "Speakers"] },
    { eventName: "Black Friday", platform: "All", startDate: "2025-11-28", endDate: "2025-12-02", expectedUplift: 90, affectedCategories: ["Nirvana", "Rockerz"] },
    { eventName: "Year End Sale", platform: "All", startDate: "2025-12-20", endDate: "2025-12-31", expectedUplift: 65, affectedCategories: ["All"] },
  ],

  // Competitor Activity Tracking — JBL, Noise, OnePlus, Realme, Fire-Boltt
  "Competitor_Activity": [
    { weekStart: "2025-01-06", region: "Pan-India", activity: "Noise ColorFit Pro 6 launch", impactScore: 0.72, affectedSKUs: ["SKU_003", "SKU_038"], demandImpactPct: 22 },
    { weekStart: "2025-01-20", region: "North", activity: "JBL Wave Beam 2 price drop ₹1,299", impactScore: 0.65, affectedSKUs: ["SKU_001", "SKU_040"], demandImpactPct: 20 },
    { weekStart: "2025-02-10", region: "Pan-India", activity: "OnePlus Nord Buds 3 Pro launch", impactScore: 0.82, affectedSKUs: ["SKU_001", "SKU_022", "SKU_049"], demandImpactPct: 25 },
    { weekStart: "2025-03-03", region: "South", activity: "Realme Buds Air 6 Pro aggressive pricing", impactScore: 0.58, affectedSKUs: ["SKU_001", "SKU_035"], demandImpactPct: 17 },
    { weekStart: "2025-04-07", region: "Pan-India", activity: "Samsung Galaxy Buds FE2 launch", impactScore: 0.78, affectedSKUs: ["SKU_022", "SKU_049"], demandImpactPct: 23 },
    { weekStart: "2025-05-19", region: "West", activity: "Fire-Boltt smartwatch flash sale", impactScore: 0.55, affectedSKUs: ["SKU_003", "SKU_038"], demandImpactPct: 16 },
    { weekStart: "2025-07-14", region: "Pan-India", activity: "JBL Xtreme 4 Prime Day deal", impactScore: 0.70, affectedSKUs: ["SKU_005", "SKU_029"], demandImpactPct: 21 },
    { weekStart: "2025-09-01", region: "East", activity: "Mivi DuoPods launch ₹799", impactScore: 0.48, affectedSKUs: ["SKU_040", "SKU_035"], demandImpactPct: 14 },
  ],

  // Promotional Campaigns — boAt promotions across channels
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

  // Holiday Calendar (India focused for boAt)
  "Holiday_Calendar": [
    { date: "2025-01-14", event: "Makar Sankranti / Pongal", type: "Festival", region: "Pan-India", impact: "Medium", salesLift: 1.18, duration: 2 },
    { date: "2025-01-26", event: "Republic Day Sale", type: "Sale Event", region: "Pan-India", impact: "High", salesLift: 1.55, duration: 5 },
    { date: "2025-02-14", event: "Valentine's Day", type: "Gifting", region: "Metro Cities", impact: "High", salesLift: 1.45, duration: 3 },
    { date: "2025-03-14", event: "Holi", type: "Festival", region: "North/West", impact: "Medium", salesLift: 1.22, duration: 2 },
    { date: "2025-05-01", event: "IPL Finals Week", type: "Sporting Event", region: "Pan-India", impact: "High", salesLift: 1.35, duration: 7 },
    { date: "2025-07-15", event: "Amazon Prime Day", type: "Sale Event", region: "Pan-India", impact: "Very High", salesLift: 2.40, duration: 3 },
    { date: "2025-08-15", event: "Independence Day Sale", type: "Sale Event", region: "Pan-India", impact: "High", salesLift: 1.55, duration: 5 },
    { date: "2025-09-05", event: "Teachers' Day / Back to College", type: "Gifting", region: "Pan-India", impact: "Medium", salesLift: 1.20, duration: 5 },
    { date: "2025-10-02", event: "Navratri / Garba Season", type: "Festival", region: "West", impact: "High", salesLift: 1.65, duration: 9 },
    { date: "2025-10-05", event: "Big Billion Days", type: "Sale Event", region: "Pan-India", impact: "Very High", salesLift: 3.00, duration: 7 },
    { date: "2025-10-20", event: "Diwali", type: "Festival", region: "Pan-India", impact: "Very High", salesLift: 2.80, duration: 5 },
    { date: "2025-11-28", event: "Black Friday", type: "Sale Event", region: "Metro Cities", impact: "High", salesLift: 1.85, duration: 4 },
    { date: "2025-12-25", event: "Christmas / New Year", type: "Gifting", region: "Metro Cities", impact: "High", salesLift: 1.70, duration: 7 },
  ],

  // Social Media Sentiment — boAt brand tracking
  "Social_Media_Sentiment": [
    { date: "2025-01-15", platform: "Twitter/X", sentiment_score: 0.78, brand_mentions: 12500, category: "TWS", topHashtag: "#boAtAirdopes" },
    { date: "2025-01-15", platform: "Instagram", sentiment_score: 0.88, brand_mentions: 28000, category: "Smartwatches", topHashtag: "#boAtLunar" },
    { date: "2025-02-14", platform: "Instagram", sentiment_score: 0.92, brand_mentions: 35000, category: "TWS", topHashtag: "#GiftBoAt" },
    { date: "2025-02-15", platform: "YouTube", sentiment_score: 0.75, brand_mentions: 18000, category: "Headphones", topHashtag: "#Rockerz650Pro" },
    { date: "2025-03-15", platform: "Twitter/X", sentiment_score: 0.82, brand_mentions: 15200, category: "Party Speakers", topHashtag: "#boAtPartyPal" },
    { date: "2025-03-15", platform: "YouTube", sentiment_score: 0.85, brand_mentions: 22000, category: "TWS", topHashtag: "#NirvanaReview" },
    { date: "2025-07-16", platform: "Twitter/X", sentiment_score: 0.90, brand_mentions: 45000, category: "All", topHashtag: "#boAtPrimeDay" },
    { date: "2025-10-06", platform: "Instagram", sentiment_score: 0.94, brand_mentions: 62000, category: "All", topHashtag: "#boAtBBD" },
  ],

  // Consumer Sentiment Index — Indian consumer electronics buying intent
  "Consumer_Sentiment_Index": [
    { month: "2025-01", region: "North", confidence_index: 72, spending_propensity: 0.65, electronics_intent: 0.58 },
    { month: "2025-01", region: "South", confidence_index: 78, spending_propensity: 0.72, electronics_intent: 0.68 },
    { month: "2025-01", region: "West", confidence_index: 75, spending_propensity: 0.68, electronics_intent: 0.62 },
    { month: "2025-02", region: "North", confidence_index: 74, spending_propensity: 0.66, electronics_intent: 0.60 },
    { month: "2025-02", region: "South", confidence_index: 76, spending_propensity: 0.70, electronics_intent: 0.65 },
    { month: "2025-03", region: "Pan-India", confidence_index: 71, spending_propensity: 0.62, electronics_intent: 0.55 },
    { month: "2025-07", region: "Pan-India", confidence_index: 85, spending_propensity: 0.80, electronics_intent: 0.78 },
    { month: "2025-10", region: "Pan-India", confidence_index: 92, spending_propensity: 0.88, electronics_intent: 0.85 },
    { month: "2025-11", region: "Pan-India", confidence_index: 82, spending_propensity: 0.78, electronics_intent: 0.75 },
    { month: "2025-12", region: "Pan-India", confidence_index: 85, spending_propensity: 0.82, electronics_intent: 0.78 },
  ],

  // Influencer Campaign Tracker — boAt ambassador & creator campaigns
  "Influencer_Campaign_Tracker": [
    { campaignId: "INF001", influencer: "Technical Guruji", platform: "YouTube", category: "TWS", reach: 8500000, engagementRate: 4.2, startDate: "2025-01-10", endDate: "2025-01-25", estimatedSalesLift: 15 },
    { campaignId: "INF002", influencer: "Hardik Pandya (Brand Ambassador)", platform: "Instagram", category: "Smartwatches", reach: 12000000, engagementRate: 5.8, startDate: "2025-02-01", endDate: "2025-02-14", estimatedSalesLift: 22 },
    { campaignId: "INF003", influencer: "Trakin Tech", platform: "YouTube", category: "Nirvana TWS", reach: 5200000, engagementRate: 5.5, startDate: "2025-03-01", endDate: "2025-03-15", estimatedSalesLift: 12 },
    { campaignId: "INF004", influencer: "Kiara Advani (Brand Ambassador)", platform: "Instagram", category: "Neckbands", reach: 15000000, engagementRate: 6.1, startDate: "2025-04-15", endDate: "2025-04-30", estimatedSalesLift: 18 },
    { campaignId: "INF005", influencer: "GeekyRanjit", platform: "YouTube", category: "Headphones", reach: 3800000, engagementRate: 4.8, startDate: "2025-06-01", endDate: "2025-06-15", estimatedSalesLift: 10 },
    { campaignId: "INF006", influencer: "CarryMinati (Gaming)", platform: "YouTube", category: "Immortal Gaming", reach: 20000000, engagementRate: 7.2, startDate: "2025-07-10", endDate: "2025-07-20", estimatedSalesLift: 25 },
    { campaignId: "INF007", influencer: "Bhuvan Bam", platform: "Instagram", category: "Party Speakers", reach: 9500000, engagementRate: 5.0, startDate: "2025-09-15", endDate: "2025-09-30", estimatedSalesLift: 14 },
  ],

  // New Product Launches — boAt product pipeline
  "New_Product_Launches": [
    { launchId: "NPL001", productName: "Airdopes Prime 701 ANC", brand: "boAt Nirvana", launchDate: "2025-02-01", category: "TWS", expectedVolume: 75000, cannibalizationRisk: "SKU_022" },
    { launchId: "NPL002", productName: "Lunar Discovery HD Smartwatch", brand: "boAt Lunar", launchDate: "2025-03-15", category: "Smartwatches", expectedVolume: 45000, cannibalizationRisk: "SKU_003" },
    { launchId: "NPL003", productName: "Rockerz 650 Pro ANC", brand: "boAt Rockerz", launchDate: "2025-05-01", category: "Headphones", expectedVolume: 30000, cannibalizationRisk: "SKU_021" },
    { launchId: "NPL004", productName: "Airdopes Loop Open-Ear", brand: "boAt Airdopes", launchDate: "2025-06-15", category: "TWS", expectedVolume: 60000, cannibalizationRisk: "SKU_001" },
    { launchId: "NPL005", productName: "PartyPal 500 Speaker", brand: "boAt PartyPal", launchDate: "2025-08-01", category: "Party Speakers", expectedVolume: 25000, cannibalizationRisk: "SKU_029" },
    { launchId: "NPL006", productName: "Immortal 350 Gaming TWS", brand: "boAt Immortal", launchDate: "2025-09-15", category: "Gaming", expectedVolume: 20000, cannibalizationRisk: "None" },
  ],

  // Competitor Pricing — key competitors in Indian audio/wearables market
  "Competitor_Pricing": [
    { month: "2025-01", competitor: "JBL", category: "TWS", avgPrice: 2499, priceChange: -5, marketShare: 18 },
    { month: "2025-01", competitor: "Noise", category: "Smartwatches", avgPrice: 1999, priceChange: -8, marketShare: 22 },
    { month: "2025-01", competitor: "OnePlus", category: "TWS", avgPrice: 2299, priceChange: 0, marketShare: 8 },
    { month: "2025-02", competitor: "Realme", category: "TWS", avgPrice: 1299, priceChange: -12, marketShare: 10 },
    { month: "2025-02", competitor: "Fire-Boltt", category: "Smartwatches", avgPrice: 1499, priceChange: -15, marketShare: 20 },
    { month: "2025-03", competitor: "JBL", category: "Speakers", avgPrice: 3999, priceChange: -3, marketShare: 25 },
    { month: "2025-03", competitor: "Sony", category: "Headphones", avgPrice: 8999, priceChange: -5, marketShare: 12 },
    { month: "2025-07", competitor: "Samsung", category: "TWS", avgPrice: 3499, priceChange: -20, marketShare: 7 },
    { month: "2025-10", competitor: "Noise", category: "Smartwatches", avgPrice: 1799, priceChange: -10, marketShare: 24 },
    { month: "2025-10", competitor: "Mivi", category: "Speakers", avgPrice: 1499, priceChange: -8, marketShare: 6 },
  ],

  // Seasonality Trends — boAt category-level seasonality
  "Seasonality_Trends": [
    { month: "Jan", tws_index: 0.85, neckband_index: 0.80, smartwatch_index: 0.75, speaker_index: 0.60, headphone_index: 0.82 },
    { month: "Feb", tws_index: 0.90, neckband_index: 0.82, smartwatch_index: 0.78, speaker_index: 0.55, headphone_index: 0.80 },
    { month: "Mar", tws_index: 0.95, neckband_index: 0.88, smartwatch_index: 0.85, speaker_index: 0.65, headphone_index: 0.85 },
    { month: "Apr", tws_index: 0.88, neckband_index: 0.90, smartwatch_index: 0.90, speaker_index: 0.70, headphone_index: 0.78 },
    { month: "May", tws_index: 0.82, neckband_index: 0.85, smartwatch_index: 0.88, speaker_index: 0.75, headphone_index: 0.72 },
    { month: "Jun", tws_index: 0.78, neckband_index: 0.80, smartwatch_index: 0.82, speaker_index: 0.65, headphone_index: 0.70 },
    { month: "Jul", tws_index: 1.15, neckband_index: 1.10, smartwatch_index: 1.05, speaker_index: 0.90, headphone_index: 1.08 },
    { month: "Aug", tws_index: 1.05, neckband_index: 1.00, smartwatch_index: 1.02, speaker_index: 0.85, headphone_index: 0.95 },
    { month: "Sep", tws_index: 0.95, neckband_index: 0.92, smartwatch_index: 0.95, speaker_index: 0.80, headphone_index: 0.88 },
    { month: "Oct", tws_index: 1.55, neckband_index: 1.45, smartwatch_index: 1.50, speaker_index: 1.40, headphone_index: 1.42 },
    { month: "Nov", tws_index: 1.20, neckband_index: 1.15, smartwatch_index: 1.18, speaker_index: 1.10, headphone_index: 1.12 },
    { month: "Dec", tws_index: 1.10, neckband_index: 1.05, smartwatch_index: 1.08, speaker_index: 1.25, headphone_index: 1.05 },
  ],
};
