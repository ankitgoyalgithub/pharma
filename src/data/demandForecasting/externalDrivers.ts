// External drivers aligned with Feature Store entities — boAt Lifestyle
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  const featureStoreDrivers = [
    { name: "Search Trends (Google)", autoSelected: true, icon: "TrendingUp" },
    { name: "Promotional Campaigns", autoSelected: true, icon: "Tag" },
    { name: "Seasonality Trends", autoSelected: true, icon: "Calendar" },
    { name: "Holiday Calendar", autoSelected: false, icon: "Gift" },
    { name: "Competitor Pricing", autoSelected: false, icon: "DollarSign" },
    { name: "New Product Launches", autoSelected: false, icon: "Sparkles" },
    { name: "Social Media Sentiment", autoSelected: false, icon: "MessageCircle" },
    { name: "Platform Sale Events", autoSelected: false, icon: "ShoppingCart" },
    { name: "Weather & Climate Data", autoSelected: false, icon: "CloudRain" },
    { name: "Consumer Sentiment Index", autoSelected: false, icon: "BarChart" },
    { name: "Influencer Campaign Tracker", autoSelected: false, icon: "Users" },
    { name: "Competitor Activity", autoSelected: false, icon: "Eye" },
  ];

  return featureStoreDrivers;
};
