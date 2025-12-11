// External drivers data for Splash Fashions - Fashion Industry
import { promotionsData } from './promotionsData';

export const externalDriversData = {
  // Promotions & Discounts - using actual Splash promotions data
  "Promotions_Discounts": promotionsData.map(p => ({
    date: p.startWeek.replace('-W', '-W'),
    promoId: p.promoId,
    promoType: p.promoType,
    brand: p.brand,
    sku: p.sku || 'All SKUs',
    discountPercent: p.discountPct,
    startWeek: p.startWeek,
    endWeek: p.endWeek,
    description: p.description,
    estimatedLift: Math.round(p.discountPct * 1.8),
    channel: 'All Channels'
  })),

  // Seasonality Trends for Fashion
  "Seasonality_Trends": [
    { week: "2024-W01", season: "Winter", seasonIndex: 0.85, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 1.15 },
    { week: "2024-W02", season: "Winter", seasonIndex: 0.82, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 1.12 },
    { week: "2024-W03", season: "Winter", seasonIndex: 0.78, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 1.08 },
    { week: "2024-W04", season: "Winter", seasonIndex: 0.75, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 1.05 },
    { week: "2024-W05", season: "Winter", seasonIndex: 0.72, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 1.02 },
    { week: "2024-W06", season: "Winter", seasonIndex: 0.68, trendDirection: "Declining", category: "Outerwear", demandMultiplier: 0.98 },
    { week: "2024-W07", season: "Spring Transition", seasonIndex: 0.75, trendDirection: "Rising", category: "Light Layers", demandMultiplier: 1.05 },
    { week: "2024-W08", season: "Spring Transition", seasonIndex: 0.82, trendDirection: "Rising", category: "Light Layers", demandMultiplier: 1.12 },
    { week: "2024-W09", season: "Spring", seasonIndex: 0.88, trendDirection: "Rising", category: "Spring Collection", demandMultiplier: 1.18 },
    { week: "2024-W10", season: "Spring", seasonIndex: 0.92, trendDirection: "Rising", category: "Spring Collection", demandMultiplier: 1.22 },
    { week: "2024-W11", season: "Spring", seasonIndex: 0.95, trendDirection: "Peak", category: "Spring Collection", demandMultiplier: 1.25 },
    { week: "2024-W12", season: "Spring", seasonIndex: 0.98, trendDirection: "Peak", category: "Spring Collection", demandMultiplier: 1.28 },
    { week: "2024-W13", season: "Spring", seasonIndex: 1.00, trendDirection: "Peak", category: "Spring Collection", demandMultiplier: 1.30 },
    { week: "2024-W14", season: "Spring", seasonIndex: 0.98, trendDirection: "Stable", category: "Casual Wear", demandMultiplier: 1.28 },
    { week: "2024-W15", season: "Spring/Summer Transition", seasonIndex: 0.95, trendDirection: "Rising", category: "Summer Preview", demandMultiplier: 1.25 },
    { week: "2024-W16", season: "Summer", seasonIndex: 1.05, trendDirection: "Rising", category: "Summer Collection", demandMultiplier: 1.35 },
    { week: "2024-W17", season: "Summer", seasonIndex: 1.10, trendDirection: "Rising", category: "Summer Collection", demandMultiplier: 1.40 },
    { week: "2024-W18", season: "Summer", seasonIndex: 1.15, trendDirection: "Peak", category: "Summer Collection", demandMultiplier: 1.45 },
    { week: "2024-W19", season: "Summer", seasonIndex: 1.18, trendDirection: "Peak", category: "Swimwear", demandMultiplier: 1.48 },
    { week: "2024-W20", season: "Summer", seasonIndex: 1.20, trendDirection: "Peak", category: "Swimwear", demandMultiplier: 1.50 },
  ],

  // Fashion Week Calendar
  "Fashion_Week_Calendar": [
    { date: "2024-02-08", event: "New York Fashion Week", city: "New York", season: "Fall/Winter 2024", impact: "Very High", trendInfluence: 0.95, brands: ["Major Designers"], duration: 8 },
    { date: "2024-02-20", event: "London Fashion Week", city: "London", season: "Fall/Winter 2024", impact: "High", trendInfluence: 0.85, brands: ["British Designers"], duration: 5 },
    { date: "2024-02-26", event: "Milan Fashion Week", city: "Milan", season: "Fall/Winter 2024", impact: "Very High", trendInfluence: 0.92, brands: ["Italian Houses"], duration: 6 },
    { date: "2024-03-04", event: "Paris Fashion Week", city: "Paris", season: "Fall/Winter 2024", impact: "Very High", trendInfluence: 0.98, brands: ["French Couture"], duration: 9 },
    { date: "2024-09-06", event: "New York Fashion Week", city: "New York", season: "Spring/Summer 2025", impact: "Very High", trendInfluence: 0.95, brands: ["Major Designers"], duration: 8 },
    { date: "2024-09-13", event: "London Fashion Week", city: "London", season: "Spring/Summer 2025", impact: "High", trendInfluence: 0.85, brands: ["British Designers"], duration: 5 },
    { date: "2024-09-17", event: "Milan Fashion Week", city: "Milan", season: "Spring/Summer 2025", impact: "Very High", trendInfluence: 0.92, brands: ["Italian Houses"], duration: 6 },
    { date: "2024-09-23", event: "Paris Fashion Week", city: "Paris", season: "Spring/Summer 2025", impact: "Very High", trendInfluence: 0.98, brands: ["French Couture"], duration: 9 },
    { date: "2024-01-20", event: "Dubai Fashion Week", city: "Dubai", season: "Spring 2024", impact: "High", trendInfluence: 0.75, brands: ["Middle East Designers"], duration: 4 },
    { date: "2024-04-15", event: "Arab Fashion Week", city: "Dubai", season: "Resort 2024", impact: "Medium", trendInfluence: 0.68, brands: ["Regional Brands"], duration: 5 },
  ],

  // Weather & Climate Data for UAE/Middle East (Splash operates in this region)
  "Weather_Climate": [
    { week: "2024-W01", location: "Dubai", avgTemp: 21, humidity: 62, weatherType: "Pleasant", shoppingIndex: 1.15, outdoorActivity: "High" },
    { week: "2024-W02", location: "Dubai", avgTemp: 20, humidity: 60, weatherType: "Pleasant", shoppingIndex: 1.18, outdoorActivity: "High" },
    { week: "2024-W03", location: "Dubai", avgTemp: 22, humidity: 58, weatherType: "Pleasant", shoppingIndex: 1.20, outdoorActivity: "High" },
    { week: "2024-W04", location: "Dubai", avgTemp: 23, humidity: 55, weatherType: "Warm", shoppingIndex: 1.15, outdoorActivity: "High" },
    { week: "2024-W05", location: "Dubai", avgTemp: 24, humidity: 52, weatherType: "Warm", shoppingIndex: 1.10, outdoorActivity: "Moderate" },
    { week: "2024-W06", location: "Dubai", avgTemp: 26, humidity: 50, weatherType: "Warm", shoppingIndex: 1.05, outdoorActivity: "Moderate" },
    { week: "2024-W07", location: "Dubai", avgTemp: 28, humidity: 48, weatherType: "Hot", shoppingIndex: 1.00, outdoorActivity: "Moderate" },
    { week: "2024-W08", location: "Dubai", avgTemp: 30, humidity: 45, weatherType: "Hot", shoppingIndex: 0.95, outdoorActivity: "Low" },
    { week: "2024-W09", location: "Dubai", avgTemp: 32, humidity: 42, weatherType: "Very Hot", shoppingIndex: 0.90, outdoorActivity: "Low" },
    { week: "2024-W10", location: "Dubai", avgTemp: 34, humidity: 40, weatherType: "Very Hot", shoppingIndex: 0.85, outdoorActivity: "Very Low" },
    { week: "2024-W11", location: "Dubai", avgTemp: 36, humidity: 38, weatherType: "Extreme Heat", shoppingIndex: 0.80, outdoorActivity: "Very Low" },
    { week: "2024-W12", location: "Dubai", avgTemp: 38, humidity: 35, weatherType: "Extreme Heat", shoppingIndex: 0.75, outdoorActivity: "Indoor Only" },
    { week: "2024-W01", location: "Abu Dhabi", avgTemp: 20, humidity: 65, weatherType: "Pleasant", shoppingIndex: 1.12, outdoorActivity: "High" },
    { week: "2024-W02", location: "Abu Dhabi", avgTemp: 21, humidity: 62, weatherType: "Pleasant", shoppingIndex: 1.15, outdoorActivity: "High" },
    { week: "2024-W03", location: "Abu Dhabi", avgTemp: 22, humidity: 60, weatherType: "Pleasant", shoppingIndex: 1.18, outdoorActivity: "High" },
    { week: "2024-W04", location: "Abu Dhabi", avgTemp: 24, humidity: 58, weatherType: "Warm", shoppingIndex: 1.12, outdoorActivity: "High" },
  ],

  // Social Media Trends for Fashion
  "Social_Media_Trends": [
    { week: "2024-W01", platform: "Instagram", hashtag: "#SplashFashions", mentions: 12500, engagement: 45000, sentiment: 0.82, trending: true, influencerReach: 250000 },
    { week: "2024-W01", platform: "TikTok", hashtag: "#SplashStyle", mentions: 8500, engagement: 125000, sentiment: 0.88, trending: true, influencerReach: 450000 },
    { week: "2024-W02", platform: "Instagram", hashtag: "#LeeCooperStyle", mentions: 9800, engagement: 38000, sentiment: 0.79, trending: false, influencerReach: 180000 },
    { week: "2024-W02", platform: "TikTok", hashtag: "#KappaFashion", mentions: 7200, engagement: 95000, sentiment: 0.85, trending: true, influencerReach: 380000 },
    { week: "2024-W03", platform: "Instagram", hashtag: "#ElleStyle", mentions: 15200, engagement: 62000, sentiment: 0.91, trending: true, influencerReach: 320000 },
    { week: "2024-W03", platform: "TikTok", hashtag: "#SmileyFashion", mentions: 11000, engagement: 145000, sentiment: 0.87, trending: true, influencerReach: 520000 },
    { week: "2024-W04", platform: "Instagram", hashtag: "#IconicLooks", mentions: 8900, engagement: 35000, sentiment: 0.76, trending: false, influencerReach: 160000 },
    { week: "2024-W04", platform: "TikTok", hashtag: "#SpringFashion2024", mentions: 25000, engagement: 280000, sentiment: 0.92, trending: true, influencerReach: 850000 },
    { week: "2024-W05", platform: "Instagram", hashtag: "#SplashNewArrivals", mentions: 18500, engagement: 72000, sentiment: 0.89, trending: true, influencerReach: 420000 },
    { week: "2024-W05", platform: "TikTok", hashtag: "#OOTDSplash", mentions: 14200, engagement: 195000, sentiment: 0.86, trending: true, influencerReach: 620000 },
    { week: "2024-W06", platform: "Instagram", hashtag: "#DubaiStyle", mentions: 22000, engagement: 95000, sentiment: 0.88, trending: true, influencerReach: 580000 },
    { week: "2024-W06", platform: "TikTok", hashtag: "#FashionHaul", mentions: 35000, engagement: 420000, sentiment: 0.90, trending: true, influencerReach: 1200000 },
    { week: "2024-W07", platform: "Instagram", hashtag: "#BossiniStyle", mentions: 6500, engagement: 28000, sentiment: 0.75, trending: false, influencerReach: 120000 },
    { week: "2024-W08", platform: "Instagram", hashtag: "#SplashSale", mentions: 28000, engagement: 115000, sentiment: 0.94, trending: true, influencerReach: 680000 },
    { week: "2024-W09", platform: "TikTok", hashtag: "#RamadanFashion", mentions: 45000, engagement: 580000, sentiment: 0.93, trending: true, influencerReach: 1500000 },
    { week: "2024-W10", platform: "Instagram", hashtag: "#EidOutfits", mentions: 52000, engagement: 220000, sentiment: 0.95, trending: true, influencerReach: 920000 },
  ],

  // Influencer Campaigns
  "Influencer_Campaigns": [
    { campaignId: "INF001", influencer: "Sarah Al-Rashid", platform: "Instagram", followers: 1250000, brand: "Splash Core", startDate: "2024-01-15", endDate: "2024-01-31", reach: 850000, engagement: 5.2, conversionRate: 2.8, roi: 3.5 },
    { campaignId: "INF002", influencer: "Fatima Hassan", platform: "TikTok", followers: 2800000, brand: "Elle", startDate: "2024-02-01", endDate: "2024-02-14", reach: 2100000, engagement: 8.5, conversionRate: 3.2, roi: 4.2 },
    { campaignId: "INF003", influencer: "Noura Ahmed", platform: "Instagram", followers: 980000, brand: "Lee Cooper", startDate: "2024-02-10", endDate: "2024-02-28", reach: 720000, engagement: 4.8, conversionRate: 2.5, roi: 3.1 },
    { campaignId: "INF004", influencer: "Huda Beauty Collab", platform: "Instagram", followers: 5200000, brand: "ICONIC", startDate: "2024-03-01", endDate: "2024-03-15", reach: 4200000, engagement: 6.2, conversionRate: 4.1, roi: 5.8 },
    { campaignId: "INF005", influencer: "Dubai Fashion Council", platform: "Multiple", followers: 450000, brand: "All Brands", startDate: "2024-03-10", endDate: "2024-03-25", reach: 380000, engagement: 3.5, conversionRate: 1.8, roi: 2.5 },
    { campaignId: "INF006", influencer: "Mona Kattan", platform: "Instagram", followers: 3100000, brand: "Smiley", startDate: "2024-04-01", endDate: "2024-04-15", reach: 2400000, engagement: 7.1, conversionRate: 3.8, roi: 4.5 },
    { campaignId: "INF007", influencer: "Ahmed Al-Mansoori", platform: "TikTok", followers: 1850000, brand: "Kappa", startDate: "2024-04-05", endDate: "2024-04-20", reach: 1450000, engagement: 9.2, conversionRate: 3.5, roi: 4.0 },
    { campaignId: "INF008", influencer: "Lana Rose", platform: "YouTube", followers: 4500000, brand: "Juniors", startDate: "2024-05-01", endDate: "2024-05-20", reach: 3200000, engagement: 5.8, conversionRate: 2.9, roi: 3.8 },
  ],

  // Competitor Pricing
  "Competitor_Pricing": [
    { week: "2024-W01", competitor: "Max Fashion", category: "T-Shirts", avgPrice: 45, priceIndex: 0.92, promoActive: true, marketShare: 18.5 },
    { week: "2024-W01", competitor: "Centrepoint", category: "T-Shirts", avgPrice: 52, priceIndex: 1.06, promoActive: false, marketShare: 22.3 },
    { week: "2024-W01", competitor: "H&M", category: "T-Shirts", avgPrice: 49, priceIndex: 1.00, promoActive: true, marketShare: 15.2 },
    { week: "2024-W02", competitor: "Max Fashion", category: "Denim", avgPrice: 89, priceIndex: 0.88, promoActive: true, marketShare: 16.8 },
    { week: "2024-W02", competitor: "Centrepoint", category: "Denim", avgPrice: 105, priceIndex: 1.04, promoActive: false, marketShare: 21.5 },
    { week: "2024-W02", competitor: "Zara", category: "Denim", avgPrice: 129, priceIndex: 1.28, promoActive: false, marketShare: 12.1 },
    { week: "2024-W03", competitor: "Max Fashion", category: "Dresses", avgPrice: 75, priceIndex: 0.85, promoActive: true, marketShare: 19.2 },
    { week: "2024-W03", competitor: "H&M", category: "Dresses", avgPrice: 89, priceIndex: 1.01, promoActive: true, marketShare: 14.8 },
    { week: "2024-W04", competitor: "Centrepoint", category: "Kids Wear", avgPrice: 42, priceIndex: 0.95, promoActive: false, marketShare: 24.5 },
    { week: "2024-W04", competitor: "Max Fashion", category: "Kids Wear", avgPrice: 38, priceIndex: 0.86, promoActive: true, marketShare: 20.1 },
    { week: "2024-W05", competitor: "Zara", category: "Premium Casual", avgPrice: 185, priceIndex: 1.35, promoActive: false, marketShare: 8.5 },
    { week: "2024-W05", competitor: "H&M", category: "Premium Casual", avgPrice: 125, priceIndex: 0.91, promoActive: true, marketShare: 11.2 },
    { week: "2024-W06", competitor: "Lifestyle", category: "Accessories", avgPrice: 65, priceIndex: 1.08, promoActive: false, marketShare: 15.8 },
    { week: "2024-W06", competitor: "Max Fashion", category: "Accessories", avgPrice: 48, priceIndex: 0.80, promoActive: true, marketShare: 18.9 },
  ],

  // Holiday Calendar (UAE focused)
  "Holiday_Calendar": [
    { date: "2024-01-01", event: "New Year's Day", type: "Public Holiday", country: "UAE", impact: "Very High", shoppingLift: 1.45, duration: 1 },
    { date: "2024-03-10", event: "Ramadan Start", type: "Religious", country: "UAE", impact: "Very High", shoppingLift: 1.85, duration: 30 },
    { date: "2024-04-09", event: "Eid Al-Fitr", type: "Public Holiday", country: "UAE", impact: "Very High", shoppingLift: 2.20, duration: 4 },
    { date: "2024-06-16", event: "Eid Al-Adha", type: "Public Holiday", country: "UAE", impact: "Very High", shoppingLift: 1.95, duration: 4 },
    { date: "2024-07-07", event: "Islamic New Year", type: "Public Holiday", country: "UAE", impact: "Medium", shoppingLift: 1.25, duration: 1 },
    { date: "2024-09-15", event: "Prophet's Birthday", type: "Public Holiday", country: "UAE", impact: "Medium", shoppingLift: 1.20, duration: 1 },
    { date: "2024-12-02", event: "UAE National Day", type: "Public Holiday", country: "UAE", impact: "Very High", shoppingLift: 1.75, duration: 2 },
    { date: "2024-12-03", event: "UAE National Day (Day 2)", type: "Public Holiday", country: "UAE", impact: "Very High", shoppingLift: 1.65, duration: 1 },
    { date: "2024-12-25", event: "Christmas", type: "Commercial", country: "UAE", impact: "High", shoppingLift: 1.55, duration: 3 },
    { date: "2024-12-31", event: "New Year's Eve", type: "Commercial", country: "UAE", impact: "High", shoppingLift: 1.40, duration: 1 },
    { date: "2024-02-14", event: "Valentine's Day", type: "Commercial", country: "UAE", impact: "Medium", shoppingLift: 1.35, duration: 3 },
    { date: "2024-11-29", event: "Black Friday", type: "Commercial", country: "UAE", impact: "Very High", shoppingLift: 2.50, duration: 4 },
    { date: "2024-11-11", event: "Singles Day (11.11)", type: "Commercial", country: "UAE", impact: "High", shoppingLift: 1.80, duration: 1 },
  ],

  // Store Events
  "Store_Events": [
    { eventId: "SE001", store: "Dubai Mall", eventType: "VIP Night", date: "2024-01-20", expectedFootfall: 2500, actualFootfall: 2820, salesLift: 1.65, brand: "All Brands" },
    { eventId: "SE002", store: "Mall of Emirates", eventType: "New Collection Launch", date: "2024-02-01", expectedFootfall: 1800, actualFootfall: 2150, salesLift: 1.82, brand: "Elle" },
    { eventId: "SE003", store: "Abu Dhabi Mall", eventType: "Flash Sale", date: "2024-02-10", expectedFootfall: 3200, actualFootfall: 3850, salesLift: 2.15, brand: "Splash Core" },
    { eventId: "SE004", store: "City Centre Deira", eventType: "Fashion Show", date: "2024-02-15", expectedFootfall: 1500, actualFootfall: 1680, salesLift: 1.45, brand: "ICONIC" },
    { eventId: "SE005", store: "Dubai Festival City", eventType: "Kids Fashion Day", date: "2024-02-25", expectedFootfall: 2200, actualFootfall: 2580, salesLift: 1.72, brand: "Juniors" },
    { eventId: "SE006", store: "Yas Mall", eventType: "Sports Collection Launch", date: "2024-03-05", expectedFootfall: 1900, actualFootfall: 2250, salesLift: 1.58, brand: "Kappa" },
    { eventId: "SE007", store: "Dubai Mall", eventType: "Ramadan Special Preview", date: "2024-03-08", expectedFootfall: 4500, actualFootfall: 5200, salesLift: 2.35, brand: "All Brands" },
    { eventId: "SE008", store: "Marina Mall", eventType: "Styling Workshop", date: "2024-03-20", expectedFootfall: 800, actualFootfall: 950, salesLift: 1.38, brand: "Lee Cooper" },
    { eventId: "SE009", store: "Mall of Emirates", eventType: "Eid Collection Launch", date: "2024-04-01", expectedFootfall: 5000, actualFootfall: 6200, salesLift: 2.55, brand: "All Brands" },
    { eventId: "SE010", store: "Al Wahda Mall", eventType: "Summer Preview", date: "2024-04-15", expectedFootfall: 1600, actualFootfall: 1850, salesLift: 1.48, brand: "Smiley" },
  ],

  // New Collection Launches
  "New_Collection_Launches": [
    { launchId: "NCL001", collection: "Spring Essentials 2024", brand: "Splash Core", launchDate: "2024-02-01", category: "Casual Wear", skuCount: 185, expectedSales: 450000, actualSales: 520000 },
    { launchId: "NCL002", collection: "Elle Spring/Summer", brand: "Elle", launchDate: "2024-02-15", category: "Women's Wear", skuCount: 120, expectedSales: 380000, actualSales: 425000 },
    { launchId: "NCL003", collection: "Lee Cooper Denim Edit", brand: "Lee Cooper", launchDate: "2024-03-01", category: "Denim", skuCount: 85, expectedSales: 290000, actualSales: 315000 },
    { launchId: "NCL004", collection: "Ramadan Collection", brand: "All Brands", launchDate: "2024-03-05", category: "Modest Fashion", skuCount: 350, expectedSales: 850000, actualSales: 1020000 },
    { launchId: "NCL005", collection: "Kappa Sportswear SS24", brand: "Kappa", launchDate: "2024-03-15", category: "Activewear", skuCount: 95, expectedSales: 220000, actualSales: 245000 },
    { launchId: "NCL006", collection: "Eid Festive Edit", brand: "ICONIC", launchDate: "2024-03-25", category: "Festive Wear", skuCount: 150, expectedSales: 420000, actualSales: 580000 },
    { launchId: "NCL007", collection: "Smiley Kids Summer", brand: "Smiley", launchDate: "2024-04-01", category: "Kids Wear", skuCount: 130, expectedSales: 180000, actualSales: 195000 },
    { launchId: "NCL008", collection: "Summer Vacation Edit", brand: "Splash Core", launchDate: "2024-05-01", category: "Resort Wear", skuCount: 200, expectedSales: 520000, actualSales: 485000 },
    { launchId: "NCL009", collection: "Bossini Basics Refresh", brand: "Bossini", launchDate: "2024-05-15", category: "Basics", skuCount: 75, expectedSales: 150000, actualSales: 142000 },
    { launchId: "NCL010", collection: "Back to School 2024", brand: "Juniors", launchDate: "2024-08-01", category: "Kids/Teens", skuCount: 280, expectedSales: 680000, actualSales: 750000 },
  ],

  // Clearance & End-of-Season
  "Clearance_EOS": [
    { clearanceId: "CLR001", season: "Winter 2023", startDate: "2024-01-15", endDate: "2024-02-15", avgDiscount: 50, skuCount: 1250, sellThroughRate: 78, revenueRecovered: 1850000 },
    { clearanceId: "CLR002", season: "Spring 2024", startDate: "2024-05-01", endDate: "2024-05-31", avgDiscount: 40, skuCount: 980, sellThroughRate: 72, revenueRecovered: 1420000 },
    { clearanceId: "CLR003", season: "Summer 2024", startDate: "2024-08-15", endDate: "2024-09-15", avgDiscount: 45, skuCount: 1450, sellThroughRate: 82, revenueRecovered: 2150000 },
    { clearanceId: "CLR004", season: "Fall 2024", startDate: "2024-11-01", endDate: "2024-11-30", avgDiscount: 35, skuCount: 850, sellThroughRate: 68, revenueRecovered: 980000 },
    { week: "2024-W03", category: "Outerwear", discountTier: "30-40%", unitsCleared: 2800, marginImpact: -15, inventoryReduction: 42 },
    { week: "2024-W04", category: "Knitwear", discountTier: "40-50%", unitsCleared: 3500, marginImpact: -22, inventoryReduction: 55 },
    { week: "2024-W05", category: "Winter Accessories", discountTier: "50-60%", unitsCleared: 4200, marginImpact: -28, inventoryReduction: 68 },
    { week: "2024-W06", category: "Heavy Jackets", discountTier: "50-70%", unitsCleared: 1800, marginImpact: -35, inventoryReduction: 75 },
  ],

  // Back-to-School Season
  "Back_To_School": [
    { week: "2024-W31", category: "School Uniforms", demandIndex: 1.45, yoyGrowth: 8.5, avgBasketSize: 285, parentDemographic: "25-45" },
    { week: "2024-W32", category: "School Uniforms", demandIndex: 1.85, yoyGrowth: 12.2, avgBasketSize: 320, parentDemographic: "25-45" },
    { week: "2024-W33", category: "School Uniforms", demandIndex: 2.25, yoyGrowth: 15.8, avgBasketSize: 380, parentDemographic: "25-45" },
    { week: "2024-W34", category: "School Uniforms", demandIndex: 2.65, yoyGrowth: 18.5, avgBasketSize: 420, parentDemographic: "25-45" },
    { week: "2024-W35", category: "School Uniforms", demandIndex: 2.15, yoyGrowth: 14.2, avgBasketSize: 350, parentDemographic: "25-45" },
    { week: "2024-W31", category: "Kids Casual", demandIndex: 1.35, yoyGrowth: 6.8, avgBasketSize: 180, parentDemographic: "30-45" },
    { week: "2024-W32", category: "Kids Casual", demandIndex: 1.55, yoyGrowth: 9.2, avgBasketSize: 210, parentDemographic: "30-45" },
    { week: "2024-W33", category: "Kids Casual", demandIndex: 1.75, yoyGrowth: 11.5, avgBasketSize: 245, parentDemographic: "30-45" },
    { week: "2024-W34", category: "Kids Casual", demandIndex: 1.95, yoyGrowth: 13.8, avgBasketSize: 275, parentDemographic: "30-45" },
    { week: "2024-W35", category: "Kids Casual", demandIndex: 1.65, yoyGrowth: 10.5, avgBasketSize: 225, parentDemographic: "30-45" },
    { week: "2024-W31", category: "Teen Fashion", demandIndex: 1.25, yoyGrowth: 5.5, avgBasketSize: 220, parentDemographic: "35-50" },
    { week: "2024-W32", category: "Teen Fashion", demandIndex: 1.45, yoyGrowth: 7.8, avgBasketSize: 255, parentDemographic: "35-50" },
    { week: "2024-W33", category: "Teen Fashion", demandIndex: 1.65, yoyGrowth: 10.2, avgBasketSize: 295, parentDemographic: "35-50" },
    { week: "2024-W34", category: "Teen Fashion", demandIndex: 1.85, yoyGrowth: 12.5, avgBasketSize: 330, parentDemographic: "35-50" },
  ],

  // Wedding & Festive Season
  "Wedding_Festive": [
    { week: "2024-W40", event: "Wedding Season Start", category: "Festive Wear", demandIndex: 1.55, avgOrderValue: 850, topBrands: ["ICONIC", "Elle"] },
    { week: "2024-W41", event: "Wedding Season", category: "Festive Wear", demandIndex: 1.75, avgOrderValue: 920, topBrands: ["ICONIC", "Elle"] },
    { week: "2024-W42", event: "Wedding Season Peak", category: "Festive Wear", demandIndex: 2.15, avgOrderValue: 1050, topBrands: ["ICONIC", "Elle", "Splash Core"] },
    { week: "2024-W43", event: "Wedding Season", category: "Festive Wear", demandIndex: 1.95, avgOrderValue: 980, topBrands: ["ICONIC", "Elle"] },
    { week: "2024-W44", event: "Wedding Season", category: "Festive Wear", demandIndex: 1.65, avgOrderValue: 890, topBrands: ["ICONIC", "Elle"] },
    { week: "2024-W10", event: "Ramadan Prep", category: "Modest Fashion", demandIndex: 1.85, avgOrderValue: 680, topBrands: ["Splash Core", "ICONIC"] },
    { week: "2024-W11", event: "Ramadan Week 1", category: "Modest Fashion", demandIndex: 2.25, avgOrderValue: 750, topBrands: ["Splash Core", "ICONIC", "Elle"] },
    { week: "2024-W12", event: "Ramadan Week 2", category: "Modest Fashion", demandIndex: 2.05, avgOrderValue: 720, topBrands: ["Splash Core", "ICONIC"] },
    { week: "2024-W13", event: "Ramadan Week 3", category: "Modest Fashion", demandIndex: 1.95, avgOrderValue: 695, topBrands: ["Splash Core", "Elle"] },
    { week: "2024-W14", event: "Pre-Eid Shopping", category: "Festive Wear", demandIndex: 2.85, avgOrderValue: 1150, topBrands: ["ICONIC", "Elle", "Splash Core", "Kappa"] },
    { week: "2024-W15", event: "Eid Week", category: "Festive Wear", demandIndex: 2.45, avgOrderValue: 980, topBrands: ["ICONIC", "Elle"] },
    { week: "2024-W24", event: "Pre-Eid Al Adha", category: "Festive Wear", demandIndex: 2.35, avgOrderValue: 920, topBrands: ["ICONIC", "Elle", "Splash Core"] },
    { week: "2024-W25", event: "Eid Al Adha", category: "Festive Wear", demandIndex: 2.05, avgOrderValue: 850, topBrands: ["ICONIC", "Elle"] },
  ],

  // Online vs Offline Traffic
  "Online_Offline_Traffic": [
    { week: "2024-W01", channel: "Online", traffic: 125000, conversionRate: 2.8, avgOrderValue: 245, returnRate: 18 },
    { week: "2024-W01", channel: "Offline", traffic: 185000, conversionRate: 12.5, avgOrderValue: 185, returnRate: 8 },
    { week: "2024-W02", channel: "Online", traffic: 118000, conversionRate: 2.6, avgOrderValue: 238, returnRate: 17 },
    { week: "2024-W02", channel: "Offline", traffic: 172000, conversionRate: 11.8, avgOrderValue: 178, returnRate: 7 },
    { week: "2024-W03", channel: "Online", traffic: 135000, conversionRate: 3.1, avgOrderValue: 265, returnRate: 19 },
    { week: "2024-W03", channel: "Offline", traffic: 195000, conversionRate: 13.2, avgOrderValue: 195, returnRate: 9 },
    { week: "2024-W04", channel: "Online", traffic: 142000, conversionRate: 3.4, avgOrderValue: 275, returnRate: 20 },
    { week: "2024-W04", channel: "Offline", traffic: 210000, conversionRate: 14.1, avgOrderValue: 205, returnRate: 8 },
    { week: "2024-W05", channel: "Online", traffic: 128000, conversionRate: 2.9, avgOrderValue: 255, returnRate: 18 },
    { week: "2024-W05", channel: "Offline", traffic: 188000, conversionRate: 12.8, avgOrderValue: 192, returnRate: 7 },
    { week: "2024-W06", channel: "Online", traffic: 155000, conversionRate: 3.5, avgOrderValue: 285, returnRate: 21 },
    { week: "2024-W06", channel: "Offline", traffic: 225000, conversionRate: 14.5, avgOrderValue: 215, returnRate: 9 },
    { week: "2024-W07", channel: "Online", traffic: 148000, conversionRate: 3.2, avgOrderValue: 270, returnRate: 19 },
    { week: "2024-W07", channel: "Offline", traffic: 215000, conversionRate: 13.8, avgOrderValue: 208, returnRate: 8 },
    { week: "2024-W08", channel: "Online", traffic: 165000, conversionRate: 3.8, avgOrderValue: 295, returnRate: 22 },
    { week: "2024-W08", channel: "Offline", traffic: 245000, conversionRate: 15.2, avgOrderValue: 225, returnRate: 10 },
    { week: "2024-W09", channel: "Online", traffic: 185000, conversionRate: 4.2, avgOrderValue: 320, returnRate: 23 },
    { week: "2024-W09", channel: "Offline", traffic: 280000, conversionRate: 16.5, avgOrderValue: 245, returnRate: 11 },
    { week: "2024-W10", channel: "Online", traffic: 195000, conversionRate: 4.5, avgOrderValue: 345, returnRate: 24 },
    { week: "2024-W10", channel: "Offline", traffic: 295000, conversionRate: 17.2, avgOrderValue: 265, returnRate: 12 },
  ],

  // Brand Collaborations
  "Brand_Collaborations": [
    { collabId: "BC001", partner: "Disney", brand: "Smiley", type: "Licensed Collection", startDate: "2024-01-15", endDate: "2024-03-31", skuCount: 85, salesLift: 2.15, targetAudience: "Kids 4-12" },
    { collabId: "BC002", partner: "FIFA", brand: "Kappa", type: "Sports Partnership", startDate: "2024-02-01", endDate: "2024-06-30", skuCount: 45, salesLift: 1.85, targetAudience: "Sports Enthusiasts" },
    { collabId: "BC003", partner: "Marvel", brand: "Juniors", type: "Licensed Collection", startDate: "2024-03-01", endDate: "2024-05-31", skuCount: 120, salesLift: 2.45, targetAudience: "Kids 6-14" },
    { collabId: "BC004", partner: "Barbie", brand: "Elle", type: "Capsule Collection", startDate: "2024-04-01", endDate: "2024-06-30", skuCount: 65, salesLift: 1.95, targetAudience: "Women 18-35" },
    { collabId: "BC005", partner: "Harry Potter", brand: "Splash Core", type: "Licensed Collection", startDate: "2024-05-01", endDate: "2024-08-31", skuCount: 95, salesLift: 2.25, targetAudience: "Teens & Adults" },
    { collabId: "BC006", partner: "Local Artist Collective", brand: "ICONIC", type: "Designer Collab", startDate: "2024-06-01", endDate: "2024-07-31", skuCount: 35, salesLift: 1.55, targetAudience: "Fashion Forward 25-40" },
    { collabId: "BC007", partner: "Nickelodeon", brand: "Smiley", type: "Licensed Collection", startDate: "2024-07-01", endDate: "2024-09-30", skuCount: 75, salesLift: 2.05, targetAudience: "Kids 3-10" },
    { collabId: "BC008", partner: "Olympics 2024", brand: "Kappa", type: "Sports Partnership", startDate: "2024-07-15", endDate: "2024-08-15", skuCount: 55, salesLift: 2.35, targetAudience: "Sports Enthusiasts" },
  ],
};

// Mapping from display names to data keys
const driverKeyMap: Record<string, string> = {
  "Promotions & Discounts": "Promotions_Discounts",
  "Seasonality Trends": "Seasonality_Trends",
  "Fashion Week Calendar": "Fashion_Week_Calendar",
  "Weather & Climate Data": "Weather_Climate",
  "Social Media Trends": "Social_Media_Trends",
  "Influencer Campaigns": "Influencer_Campaigns",
  "Competitor Pricing": "Competitor_Pricing",
  "Holiday Calendar": "Holiday_Calendar",
  "Store Events": "Store_Events",
  "New Collection Launches": "New_Collection_Launches",
  "Clearance & End-of-Season": "Clearance_EOS",
  "Back-to-School Season": "Back_To_School",
  "Wedding & Festive Season": "Wedding_Festive",
  "Online vs Offline Traffic": "Online_Offline_Traffic",
  "Brand Collaborations": "Brand_Collaborations",
};

// Helper function to get external driver data by display name
export const getExternalDriverData = (driverName: string): any[] => {
  const key = driverKeyMap[driverName];
  if (key && externalDriversData[key as keyof typeof externalDriversData]) {
    return externalDriversData[key as keyof typeof externalDriversData] as any[];
  }
  return [];
};
