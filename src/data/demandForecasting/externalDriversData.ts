// External drivers data in Foundry Feature Store format
export const externalDriversData = {
  "Holiday_Calendar": [
    {
      date: "2024-01-01",
      holiday: "New Year's Day",
      type: "National",
      country: "USA",
      region: "All",
      impact: "High",
      businessClosure: true
    },
    {
      date: "2024-02-14",
      holiday: "Valentine's Day",
      type: "Commercial",
      country: "USA",
      region: "All",
      impact: "High",
      businessClosure: false
    },
    {
      date: "2024-07-04",
      holiday: "Independence Day",
      type: "National",
      country: "USA",
      region: "All",
      impact: "High",
      businessClosure: true
    }
  ],
  "Ad_Spend": [
    {
      date: "2024-01-01",
      platform: "Google Ads",
      amount: 12500,
      currency: "USD",
      campaign: "Holiday Campaign",
      impressions: 45000,
      clicks: 1250,
      ctr: 2.78,
      cpc: 10.00
    },
    {
      date: "2024-01-02",
      platform: "Facebook Ads",
      amount: 8200,
      currency: "USD",
      campaign: "Brand Awareness",
      impressions: 32000,
      clicks: 850,
      ctr: 2.66,
      cpc: 9.65
    },
    {
      date: "2024-01-03",
      platform: "Google Ads",
      amount: 15000,
      currency: "USD",
      campaign: "Product Launch",
      impressions: 52000,
      clicks: 1580,
      ctr: 3.04,
      cpc: 9.49
    }
  ],
  "Rainfall": [
    {
      date: "2024-01-01",
      location: "New York, NY",
      precipitation: 2.3,
      unit: "mm",
      intensity: "Light",
      duration: 45,
      weatherCondition: "Light Rain"
    },
    {
      date: "2024-01-02",
      location: "New York, NY",
      precipitation: 0.0,
      unit: "mm",
      intensity: "None",
      duration: 0,
      weatherCondition: "Clear"
    },
    {
      date: "2024-01-03",
      location: "New York, NY",
      precipitation: 1.2,
      unit: "mm",
      intensity: "Light",
      duration: 20,
      weatherCondition: "Drizzle"
    }
  ],
  "Temperature": [
    {
      date: "2024-01-01",
      location: "New York, NY",
      temperature: 24,
      unit: "Celsius",
      humidity: 65,
      windSpeed: 8,
      weatherCondition: "Partly Cloudy",
      feelsLike: 26
    },
    {
      date: "2024-01-02",
      location: "New York, NY",
      temperature: 26,
      unit: "Celsius",
      humidity: 60,
      windSpeed: 6,
      weatherCondition: "Sunny",
      feelsLike: 28
    },
    {
      date: "2024-01-03",
      location: "New York, NY",
      temperature: 22,
      unit: "Celsius",
      humidity: 70,
      windSpeed: 10,
      weatherCondition: "Cloudy",
      feelsLike: 23
    }
  ],
  "Economic_Index": [
    {
      date: "2024-01-01",
      index: "Consumer Price Index",
      value: 102.4,
      change: 0.2,
      changePercent: 0.20,
      category: "Inflation",
      region: "USA"
    },
    {
      date: "2024-01-02",
      index: "Consumer Price Index",
      value: 102.6,
      change: 0.2,
      changePercent: 0.20,
      category: "Inflation",
      region: "USA"
    },
    {
      date: "2024-01-03",
      index: "Consumer Price Index",
      value: 102.8,
      change: 0.2,
      changePercent: 0.19,
      category: "Inflation",
      region: "USA"
    }
  ],
  "Competitor_Pricing": [
    {
      date: "2024-01-01",
      product: "Widget A",
      competitor: "Competitor X",
      price: 49.99,
      currency: "USD",
      channel: "Online",
      availability: "In Stock",
      priceChange: 0.00
    },
    {
      date: "2024-01-02",
      product: "Widget A",
      competitor: "Competitor X",
      price: 51.99,
      currency: "USD",
      channel: "Online",
      availability: "In Stock",
      priceChange: 2.00
    },
    {
      date: "2024-01-03",
      product: "Widget A",
      competitor: "Competitor X",
      price: 48.99,
      currency: "USD",
      channel: "Online",
      availability: "In Stock",
      priceChange: -3.00
    }
  ],
  "Social_Media_Trends": [
    {
      date: "2024-01-01",
      platform: "Twitter",
      sentiment: 0.82,
      mentions: 1250,
      engagement: 3400,
      reach: 45000,
      hashtags: "#product #trending"
    },
    {
      date: "2024-01-02",
      platform: "Twitter",
      sentiment: 0.75,
      mentions: 980,
      engagement: 2850,
      reach: 38000,
      hashtags: "#brand #quality"
    },
    {
      date: "2024-01-03",
      platform: "Twitter",
      sentiment: 0.91,
      mentions: 1680,
      engagement: 4200,
      reach: 52000,
      hashtags: "#launch #innovation"
    }
  ],
  "Stock_Market": [
    {
      date: "2024-01-01",
      index: "S&P 500",
      value: 1245,
      change: 12.5,
      changePercent: 1.01,
      volume: 2850000,
      sector: "Technology"
    },
    {
      date: "2024-01-02",
      index: "S&P 500",
      value: 1382,
      change: 137.0,
      changePercent: 11.01,
      volume: 3200000,
      sector: "Technology"
    },
    {
      date: "2024-01-03",
      index: "S&P 500",
      value: 1156,
      change: -226.0,
      changePercent: -16.35,
      volume: 4100000,
      sector: "Technology"
    }
  ]
};

// Helper function to get external driver data
export const getExternalDriverData = (driverName: string) => {
  // Map driver display names to data keys
  const driverKeyMap: Record<string, string> = {
    "Holiday Calendar": "Holiday_Calendar",
    "Ad Spend": "Ad_Spend", 
    "Rainfall": "Rainfall",
    "Temperature": "Temperature",
    "Economic Index": "Economic_Index",
    "Competitor Pricing": "Competitor_Pricing",
    "Social Media Trends": "Social_Media_Trends",
    "Stock Market": "Stock_Market"
  };
  
  const dataKey = driverKeyMap[driverName];
  return dataKey ? externalDriversData[dataKey as keyof typeof externalDriversData] : [];
};