// External drivers aligned with Feature Store entities in Foundry - Fashion Industry
export const getExternalDrivers = (studyType: string, hasData: boolean = false) => {
  // Fashion-specific feature store drivers for Splash Fashions
  const featureStoreDrivers = [
    { name: "Promotions & Discounts", autoSelected: true, icon: "Tag" },
    { name: "Seasonality Trends", autoSelected: true, icon: "CalendarDays" },
    { name: "Fashion Week Calendar", autoSelected: false, icon: "Calendar" },
    { name: "Weather & Climate Data", autoSelected: false, icon: "CloudRain" },
    { name: "Social Media Trends", autoSelected: false, icon: "TrendingUp" },
    { name: "Influencer Campaigns", autoSelected: false, icon: "Users" },
    { name: "Competitor Pricing", autoSelected: false, icon: "DollarSign" },
    { name: "Holiday Calendar", autoSelected: false, icon: "Gift" },
    { name: "Store Events", autoSelected: false, icon: "Store" },
    { name: "New Collection Launches", autoSelected: false, icon: "Sparkles" },
    { name: "Clearance & End-of-Season", autoSelected: false, icon: "Percent" },
    { name: "Back-to-School Season", autoSelected: false, icon: "GraduationCap" },
    { name: "Wedding & Festive Season", autoSelected: false, icon: "Heart" },
    { name: "Online vs Offline Traffic", autoSelected: false, icon: "ShoppingCart" },
    { name: "Brand Collaborations", autoSelected: false, icon: "Handshake" },
  ];

  // Return feature store drivers for all study types to maintain consistency
  return featureStoreDrivers;
};