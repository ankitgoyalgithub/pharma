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
  "Complete_India_USA_Event_Calendar": [
    {
      date: "2024-01-01",
      event: "New Year's Day",
      type: "National Holiday",
      country: "USA & India",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "New Year celebration"
    },
    {
      date: "2024-01-26",
      event: "Republic Day",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "Indian Republic Day celebration"
    },
    {
      date: "2024-02-14",
      event: "Valentine's Day",
      type: "Commercial Event",
      country: "USA & India",
      region: "All",
      impact: "High",
      businessClosure: false,
      description: "Valentine's Day retail event"
    },
    {
      date: "2024-03-08",
      event: "Holi",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "Festival of Colors"
    },
    {
      date: "2024-03-29",
      event: "Good Friday",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "Medium",
      businessClosure: true,
      description: "Christian holiday"
    },
    {
      date: "2024-05-27",
      event: "Memorial Day",
      type: "National Holiday",
      country: "USA",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "US Memorial Day"
    },
    {
      date: "2024-07-04",
      event: "Independence Day",
      type: "National Holiday",
      country: "USA",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "US Independence Day"
    },
    {
      date: "2024-08-15",
      event: "Independence Day",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "Indian Independence Day"
    },
    {
      date: "2024-10-02",
      event: "Gandhi Jayanti",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "High",
      businessClosure: true,
      description: "Mahatma Gandhi's Birthday"
    },
    {
      date: "2024-10-31",
      event: "Diwali",
      type: "National Holiday",
      country: "India",
      region: "All",
      impact: "Very High",
      businessClosure: true,
      description: "Festival of Lights"
    },
    {
      date: "2024-11-28",
      event: "Thanksgiving",
      type: "National Holiday",
      country: "USA",
      region: "All",
      impact: "Very High",
      businessClosure: true,
      description: "US Thanksgiving Day"
    },
    {
      date: "2024-11-29",
      event: "Black Friday",
      type: "Commercial Event",
      country: "USA & India",
      region: "All",
      impact: "Very High",
      businessClosure: false,
      description: "Major retail shopping event"
    },
    {
      date: "2024-12-25",
      event: "Christmas",
      type: "National Holiday",
      country: "USA & India",
      region: "All",
      impact: "Very High",
      businessClosure: true,
      description: "Christmas celebration"
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
      location: "New York",
      precipitation: 2.3,
      unit: "mm",
      intensity: "Light",
      duration: 45,
      weatherCondition: "Light Rain"
    },
    {
      date: "2024-01-02",
      location: "Chicago",
      precipitation: 0.0,
      unit: "mm",
      intensity: "None",
      duration: 0,
      weatherCondition: "Clear"
    },
    {
      date: "2024-01-03",
      location: "Los Angeles",
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
      location: "New York",
      temperature: 24,
      unit: "Celsius",
      humidity: 65,
      windSpeed: 8,
      weatherCondition: "Partly Cloudy",
      feelsLike: 26
    },
    {
      date: "2024-01-02",
      location: "Chicago",
      temperature: 26,
      unit: "Celsius",
      humidity: 60,
      windSpeed: 6,
      weatherCondition: "Sunny",
      feelsLike: 28
    },
    {
      date: "2024-01-03",
      location: "Los Angeles",
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
  ],
  "Crude_Oil_Prices": [
    {
      date: "2024-01-01",
      benchmark: "Brent Crude",
      price: 78.45,
      currency: "USD",
      change: 1.2,
      changePercent: 1.55,
      volume: 125000000
    },
    {
      date: "2024-01-02",
      benchmark: "Brent Crude",
      price: 79.12,
      currency: "USD",
      change: 0.67,
      changePercent: 0.85,
      volume: 132000000
    }
  ],
  "NSE_Index": [
    {
      date: "2024-01-01",
      index: "NIFTY 50",
      value: 21850.45,
      change: 125.30,
      changePercent: 0.58,
      volume: 2500000000,
      sector: "All"
    },
    {
      date: "2024-01-02",
      index: "NIFTY 50",
      value: 21920.15,
      change: 69.70,
      changePercent: 0.32,
      volume: 2350000000,
      sector: "All"
    }
  ],
  "NASDAQ_Index": [
    {
      date: "2024-01-01",
      index: "NASDAQ Composite",
      value: 15240.85,
      change: 85.40,
      changePercent: 0.56,
      volume: 4200000000,
      sector: "Technology"
    },
    {
      date: "2024-01-02",
      index: "NASDAQ Composite",
      value: 15310.20,
      change: 69.35,
      changePercent: 0.45,
      volume: 4100000000,
      sector: "Technology"
    }
  ],
  "Weather_Data": [
    {
      date: "2024-01-01",
      location: "US Regions",
      avgTemperature: 65.5,
      precipitation: 0.15,
      humidity: 65,
      windSpeed: 8,
      condition: "Partly Cloudy"
    },
    {
      date: "2024-01-02",
      location: "US Regions",
      avgTemperature: 67.2,
      precipitation: 0.0,
      humidity: 58,
      windSpeed: 6,
      condition: "Clear"
    }
  ],
  "Exchange_Rates": [
    {
      date: "2024-01-01",
      baseCurrency: "USD",
      targetCurrency: "EUR",
      rate: 0.92,
      change: 0.002,
      changePercent: 0.22,
      bidRate: 0.919,
      askRate: 0.921
    },
    {
      date: "2024-01-02",
      baseCurrency: "USD",
      targetCurrency: "EUR",
      rate: 0.918,
      change: -0.002,
      changePercent: -0.22,
      bidRate: 0.917,
      askRate: 0.919
    }
  ],
  "Interest_Rates": [
    {
      date: "2024-01-01",
      country: "USA",
      centralBank: "Federal Reserve",
      rate: 5.50,
      change: 0.0,
      rateType: "Federal Funds Rate",
      decision: "Hold"
    },
    {
      date: "2024-02-01",
      country: "USA",
      centralBank: "Federal Reserve",
      rate: 5.50,
      change: 0.0,
      rateType: "Federal Funds Rate",
      decision: "Hold"
    }
  ],
  "Inflation_Data": [
    {
      date: "2024-01-01",
      country: "USA",
      cpiValue: 308.2,
      change: 0.3,
      changePercent: 3.4,
      category: "All Items",
      period: "Monthly"
    },
    {
      date: "2024-02-01",
      country: "USA",
      cpiValue: 309.1,
      change: 0.9,
      changePercent: 3.2,
      category: "All Items",
      period: "Monthly"
    }
  ],
  "GDP_Growth": [
    {
      date: "2024-Q1",
      country: "USA",
      gdpValue: 27.5,
      currency: "Trillion USD",
      growthRate: 2.5,
      changePercent: 2.5,
      sector: "All"
    },
    {
      date: "2024-Q2",
      country: "USA",
      gdpValue: 27.8,
      currency: "Trillion USD",
      growthRate: 2.8,
      changePercent: 2.8,
      sector: "All"
    }
  ],
  "Commodity_Prices": [
    {
      date: "2024-01-01",
      commodity: "Gold",
      price: 2065.50,
      currency: "USD",
      unit: "oz",
      change: 12.30,
      changePercent: 0.60,
      exchange: "COMEX"
    },
    {
      date: "2024-01-02",
      commodity: "Gold",
      price: 2072.80,
      currency: "USD",
      unit: "oz",
      change: 7.30,
      changePercent: 0.35,
      exchange: "COMEX"
    }
  ],
  "Labor_Market_Data": [
    {
      date: "2024-01-01",
      country: "USA",
      unemploymentRate: 3.7,
      laborForceParticipation: 62.5,
      avgHourlyEarnings: 34.25,
      change: 0.15,
      sector: "All"
    },
    {
      date: "2024-02-01",
      country: "USA",
      unemploymentRate: 3.8,
      laborForceParticipation: 62.6,
      avgHourlyEarnings: 34.50,
      change: 0.25,
      sector: "All"
    }
  ],
  "Supply_Chain_Events": [
    {
      date: "2024-01-01",
      eventType: "Port Congestion",
      location: "Los Angeles Port",
      severity: "Medium",
      impactedRoutes: "Asia-USA",
      delayDays: 3,
      status: "Ongoing"
    },
    {
      date: "2024-01-05",
      eventType: "Weather Disruption",
      location: "Suez Canal",
      severity: "Low",
      impactedRoutes: "Asia-Europe",
      delayDays: 1,
      status: "Resolved"
    }
  ],
  "Regulatory_Changes": [
    {
      date: "2024-01-01",
      regulation: "Data Privacy Act",
      country: "USA",
      industry: "Technology",
      impactLevel: "High",
      complianceDeadline: "2024-12-31",
      status: "Proposed"
    },
    {
      date: "2024-01-15",
      regulation: "Environmental Standards",
      country: "EU",
      industry: "Manufacturing",
      impactLevel: "Medium",
      complianceDeadline: "2025-06-30",
      status: "Active"
    }
  ]
};

// Helper function to get external driver data
export const getExternalDriverData = (driverName: string) => {
  // Map driver display names to data keys - aligned with Feature Store entities
  const driverKeyMap: Record<string, string> = {
    "Holiday Calendar": "Holiday_Calendar",
    "Complete India and USA Event Calendar": "Complete_India_USA_Event_Calendar",
    "Crude Oil Prices": "Crude_Oil_Prices",
    "NSE Index": "NSE_Index",
    "NASDAQ Index": "NASDAQ_Index",
    "Weather Data": "Weather_Data",
    "Exchange Rates": "Exchange_Rates",
    "Interest Rates": "Interest_Rates",
    "Inflation Data": "Inflation_Data",
    "GDP Growth": "GDP_Growth",
    "Commodity Prices": "Commodity_Prices",
    "Labor Market Data": "Labor_Market_Data",
    "Supply Chain Events": "Supply_Chain_Events",
    "Regulatory Changes": "Regulatory_Changes",
  };
  
  const dataKey = driverKeyMap[driverName];
  return dataKey ? externalDriversData[dataKey as keyof typeof externalDriversData] : [];
};