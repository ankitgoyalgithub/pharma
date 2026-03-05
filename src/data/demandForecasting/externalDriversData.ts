// Consumer Electronics External Drivers Data (2025)
export const externalDriversData: Record<string, any[]> = {
  // Weather & Climate Data (Monthly 2025)
  "Weather_Climate_Data": [
    { month: "2025-01", region: "North", avgTemp: 12, rainfall: 22, humidity: 58, season: "Winter" },
    { month: "2025-02", region: "North", avgTemp: 16, rainfall: 18, humidity: 52, season: "Winter" },
    { month: "2025-03", region: "South", avgTemp: 30, rainfall: 8, humidity: 65, season: "Summer" },
    { month: "2025-04", region: "West", avgTemp: 34, rainfall: 3, humidity: 42, season: "Summer" },
    { month: "2025-05", region: "East", avgTemp: 36, rainfall: 45, humidity: 78, season: "Pre-Monsoon" },
    { month: "2025-06", region: "Pan-India", avgTemp: 33, rainfall: 120, humidity: 82, season: "Monsoon" },
    { month: "2025-07", region: "West", avgTemp: 29, rainfall: 280, humidity: 90, season: "Monsoon" },
    { month: "2025-08", region: "North", avgTemp: 31, rainfall: 210, humidity: 85, season: "Monsoon" },
    { month: "2025-09", region: "South", avgTemp: 28, rainfall: 150, humidity: 80, season: "Post-Monsoon" },
    { month: "2025-10", region: "Pan-India", avgTemp: 26, rainfall: 60, humidity: 68, season: "Post-Monsoon" },
    { month: "2025-11", region: "North", avgTemp: 18, rainfall: 12, humidity: 55, season: "Winter" },
    { month: "2025-12", region: "Pan-India", avgTemp: 14, rainfall: 8, humidity: 50, season: "Winter" },
  ],

  // Holiday Calendar (2025)
  "Holiday_Calendar": [
    { date: "2025-01-14", holiday: "Makar Sankranti", region: "Pan-India", impactLevel: "Medium", expectedLift: 12 },
    { date: "2025-01-26", holiday: "Republic Day", region: "Pan-India", impactLevel: "High", expectedLift: 25 },
    { date: "2025-03-14", holiday: "Holi", region: "North", impactLevel: "Medium", expectedLift: 15 },
    { date: "2025-04-14", holiday: "Baisakhi / Tamil New Year", region: "North/South", impactLevel: "Medium", expectedLift: 10 },
    { date: "2025-08-15", holiday: "Independence Day", region: "Pan-India", impactLevel: "High", expectedLift: 18 },
    { date: "2025-08-27", holiday: "Ganesh Chaturthi", region: "West", impactLevel: "Medium", expectedLift: 12 },
    { date: "2025-10-02", holiday: "Navratri Start", region: "Pan-India", impactLevel: "High", expectedLift: 30 },
    { date: "2025-10-20", holiday: "Diwali", region: "Pan-India", impactLevel: "Very High", expectedLift: 38 },
    { date: "2025-11-05", holiday: "Bhai Dooj", region: "North", impactLevel: "Medium", expectedLift: 14 },
    { date: "2025-12-25", holiday: "Christmas", region: "Pan-India", impactLevel: "High", expectedLift: 20 },
  ],

  // Platform Sale Events (2025)
  "Platform_Sale_Events": [
    { eventId: "EVT001", platform: "Amazon", event: "Great Republic Day Sale", startDate: "2025-01-13", endDate: "2025-01-19", expectedLift: 25, category: "All" },
    { eventId: "EVT002", platform: "Flipkart", event: "Republic Day Sale", startDate: "2025-01-20", endDate: "2025-01-26", expectedLift: 22, category: "All" },
    { eventId: "EVT003", platform: "Amazon", event: "Summer Sale", startDate: "2025-05-01", endDate: "2025-05-07", expectedLift: 15, category: "Earbuds/Speakers" },
    { eventId: "EVT004", platform: "Amazon", event: "Prime Day", startDate: "2025-07-15", endDate: "2025-07-16", expectedLift: 35, category: "All" },
    { eventId: "EVT005", platform: "Flipkart", event: "Big Billion Days", startDate: "2025-09-26", endDate: "2025-10-03", expectedLift: 45, category: "All" },
    { eventId: "EVT006", platform: "Amazon", event: "Great Indian Festival", startDate: "2025-10-05", endDate: "2025-10-12", expectedLift: 40, category: "All" },
    { eventId: "EVT007", platform: "D2C", event: "Diwali Campaign", startDate: "2025-10-15", endDate: "2025-10-25", expectedLift: 30, category: "Premium" },
  ],

  // Competitor Pricing (2025)
  "Competitor_Pricing": [
    { competitor: "JBL", product: "Wave Beam", category: "TWS", mrp: 1999, effectivePrice: 1499, platform: "Amazon", lastUpdated: "2025-01-15" },
    { competitor: "Noise", product: "Buds VS104", category: "TWS", mrp: 1499, effectivePrice: 1199, platform: "Flipkart", lastUpdated: "2025-01-20" },
    { competitor: "Realme", product: "Buds Wireless 3", category: "Neckband", mrp: 1299, effectivePrice: 999, platform: "Amazon", lastUpdated: "2025-02-05" },
    { competitor: "OnePlus", product: "Nord Buds 2", category: "TWS", mrp: 2999, effectivePrice: 2499, platform: "D2C", lastUpdated: "2025-02-10" },
    { competitor: "Sony", product: "WH-CH520", category: "Headphones", mrp: 4990, effectivePrice: 3990, platform: "Amazon", lastUpdated: "2025-03-01" },
    { competitor: "JBL", product: "Flip 6", category: "Speakers", mrp: 12999, effectivePrice: 9999, platform: "Amazon", lastUpdated: "2025-03-15" },
  ],

  // Search Trends (Monthly 2025)
  "Search_Trends": [
    { month: "2025-01", keyword: "wireless earbuds", trendScore: 72, region: "Pan-India", yoyChange: 12 },
    { month: "2025-01", keyword: "bluetooth speaker", trendScore: 58, region: "Pan-India", yoyChange: 8 },
    { month: "2025-02", keyword: "noise cancelling headphones", trendScore: 65, region: "Pan-India", yoyChange: 15 },
    { month: "2025-03", keyword: "smartwatch under 5000", trendScore: 80, region: "North", yoyChange: 25 },
    { month: "2025-04", keyword: "gaming earbuds", trendScore: 45, region: "West", yoyChange: 32 },
    { month: "2025-06", keyword: "party speaker", trendScore: 52, region: "South", yoyChange: 18 },
    { month: "2025-10", keyword: "diwali gifts electronics", trendScore: 95, region: "Pan-India", yoyChange: 28 },
  ],

  // Social Media Sentiment (2025)
  "Social_Media_Sentiment": [
    { month: "2025-01", platform: "Twitter", sentiment: 0.72, mentions: 45000, topTopic: "Sound quality", brand: "boAt" },
    { month: "2025-02", platform: "Instagram", sentiment: 0.78, mentions: 62000, topTopic: "Design & comfort", brand: "boAt" },
    { month: "2025-03", platform: "YouTube", sentiment: 0.68, mentions: 28000, topTopic: "Battery life", brand: "boAt" },
    { month: "2025-04", platform: "Reddit", sentiment: 0.55, mentions: 8500, topTopic: "Build quality", brand: "boAt" },
    { month: "2025-05", platform: "Twitter", sentiment: 0.81, mentions: 52000, topTopic: "Value for money", brand: "boAt" },
    { month: "2025-06", platform: "Instagram", sentiment: 0.75, mentions: 71000, topTopic: "Style quotient", brand: "boAt" },
  ],

  // Consumer Sentiment Index (2025)
  "Consumer_Sentiment_Index": [
    { month: "2025-01", index: 68.2, change: 1.5, outlook: "Positive", spendingIntent: "Moderate" },
    { month: "2025-02", index: 69.8, change: 1.6, outlook: "Positive", spendingIntent: "Moderate" },
    { month: "2025-03", index: 71.2, change: 1.4, outlook: "Positive", spendingIntent: "High" },
    { month: "2025-04", index: 67.5, change: -3.7, outlook: "Neutral", spendingIntent: "Moderate" },
    { month: "2025-05", index: 65.1, change: -2.4, outlook: "Cautious", spendingIntent: "Low" },
    { month: "2025-06", index: 70.8, change: 5.7, outlook: "Positive", spendingIntent: "High" },
  ],

  // Digital Campaign Tracker (2025) — campaign performance data
  "Digital_Campaign_Tracker": [
    { campaignId: "DC001", campaignType: "Social Media Ads", platform: "Instagram", category: "TWS", reach: 8500000, engagementRate: 4.2, startDate: "2025-01-10", endDate: "2025-01-25", estimatedSalesLift: 15 },
    { campaignId: "DC002", campaignType: "Brand Ambassador", platform: "Instagram", category: "Smartwatches", reach: 12000000, engagementRate: 5.8, startDate: "2025-02-01", endDate: "2025-02-14", estimatedSalesLift: 22 },
    { campaignId: "DC003", campaignType: "YouTube Reviews", platform: "YouTube", category: "Nirvana TWS", reach: 5200000, engagementRate: 5.5, startDate: "2025-03-01", endDate: "2025-03-15", estimatedSalesLift: 12 },
    { campaignId: "DC004", campaignType: "Brand Campaign", platform: "Instagram", category: "Neckbands", reach: 15000000, engagementRate: 6.1, startDate: "2025-04-15", endDate: "2025-04-30", estimatedSalesLift: 18 },
    { campaignId: "DC005", campaignType: "Tech Reviews", platform: "YouTube", category: "Headphones", reach: 3800000, engagementRate: 4.8, startDate: "2025-06-01", endDate: "2025-06-15", estimatedSalesLift: 10 },
    { campaignId: "DC006", campaignType: "Gaming Sponsorship", platform: "YouTube", category: "Immortal Gaming", reach: 20000000, engagementRate: 7.2, startDate: "2025-07-10", endDate: "2025-07-20", estimatedSalesLift: 25 },
    { campaignId: "DC007", campaignType: "Social Media Ads", platform: "Instagram", category: "Party Speakers", reach: 9500000, engagementRate: 5.0, startDate: "2025-09-15", endDate: "2025-09-30", estimatedSalesLift: 14 },
  ],

  // Seasonality Trends (Monthly 2025)
  "Seasonality_Trends": [
    { month: "Jan", earbuds: 85, headphones: 70, speakers: 55, wearables: 60, indexBase: 100 },
    { month: "Feb", earbuds: 78, headphones: 65, speakers: 50, wearables: 55, indexBase: 100 },
    { month: "Mar", earbuds: 82, headphones: 68, speakers: 48, wearables: 58, indexBase: 100 },
    { month: "Apr", earbuds: 75, headphones: 60, speakers: 45, wearables: 52, indexBase: 100 },
    { month: "May", earbuds: 80, headphones: 62, speakers: 52, wearables: 65, indexBase: 100 },
    { month: "Jun", earbuds: 88, headphones: 72, speakers: 58, wearables: 70, indexBase: 100 },
    { month: "Jul", earbuds: 95, headphones: 78, speakers: 65, wearables: 75, indexBase: 100 },
    { month: "Aug", earbuds: 90, headphones: 75, speakers: 70, wearables: 72, indexBase: 100 },
    { month: "Sep", earbuds: 105, headphones: 85, speakers: 80, wearables: 82, indexBase: 100 },
    { month: "Oct", earbuds: 138, headphones: 110, speakers: 95, wearables: 100, indexBase: 100 },
    { month: "Nov", earbuds: 125, headphones: 100, speakers: 88, wearables: 92, indexBase: 100 },
    { month: "Dec", earbuds: 110, headphones: 90, speakers: 75, wearables: 85, indexBase: 100 },
  ],

  // Promotional Campaigns (2025)
  "Promotional_Campaigns": [
    { campaignId: "PC001", type: "Flash Sale", platform: "Amazon", discount: 15, startDate: "2025-01-10", endDate: "2025-01-12", expectedLift: 18 },
    { campaignId: "PC002", type: "Bundle Deal", platform: "D2C", discount: 12, startDate: "2025-02-01", endDate: "2025-02-14", expectedLift: 14 },
    { campaignId: "PC003", type: "Festival Offer", platform: "Flipkart", discount: 25, startDate: "2025-03-10", endDate: "2025-03-16", expectedLift: 28 },
    { campaignId: "PC004", type: "Clearance Sale", platform: "All", discount: 30, startDate: "2025-04-01", endDate: "2025-04-15", expectedLift: 22 },
    { campaignId: "PC005", type: "Prime Day", platform: "Amazon", discount: 35, startDate: "2025-07-15", endDate: "2025-07-16", expectedLift: 40 },
  ],
};
