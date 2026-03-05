// Utility to map foundry object names to their corresponding data
import { productMasterData } from "./productMasterData";
import { locationMasterData } from "./locationMasterData"; 
import { customerMasterData } from "./customerMasterData";
import { supplierMasterData } from "./supplierMasterData";
import { costParametersData } from "./costParametersData";
import { salesHistoryData } from "./salesHistoryData";
import { inventoryLevelsData } from "./inventoryLevelsData";
import { holidayCalendarData } from "./holidayCalendarData";
import { crudeOilPricesData } from "./crudeOilPricesData";
import { weatherData } from "./weatherData";
import { channelMasterData } from "./channelMasterData";
import { externalDriversData } from "../demandForecasting/externalDriversData";
import { weatherClimateData } from "./weatherClimateData";
import { seasonalIllnessData } from "./seasonalIllnessData";
import { prescriptionTrendsData } from "./prescriptionTrendsData";
import { medicalConferenceData } from "./medicalConferenceData";
import { healthcarePolicyData } from "./healthcarePolicyData";
import { genericDrugLaunchesData } from "./genericDrugLaunchesData";
import { diseaseOutbreakData } from "./diseaseOutbreakData";
import { seasonalityTrendsData } from "./seasonalityTrendsData";
import { promotionalCampaignsData } from "./promotionalCampaignsData";

export const foundryDataMapper = {
  // Master Data
  "Product_Master": productMasterData,
  "Location_Master": locationMasterData,
  "Customer_Master": customerMasterData,
  "Supplier_Master": supplierMasterData,
  "Cost_Parameters": costParametersData,
  "Channel_Master": channelMasterData,
  
  // Time Series Data  
  "Sales_Historical": salesHistoryData,
  "Inventory_Data": inventoryLevelsData,
  "Price_History": [
    { date: "2023-07-01", product: "Product_1 Earbuds", price: 3872, currency: "INR" },
    { date: "2023-07-02", product: "Product_1 Earbuds", price: 3699, currency: "INR" },
    { date: "2023-07-03", product: "Product_5 Speakers", price: 4657, currency: "INR" }
  ],
  "Promotion_Data": [
    { date: "2025-07-01", product: "Product_1 Earbuds", discount: 15, type: "Flash Sale" },
    { date: "2025-07-15", product: "Product_5 Speakers", discount: 20, type: "Prime Day" }
  ],
  
  // Feature Store Data
  "Holiday_Calendar": holidayCalendarData,
  "Crude_Oil_Prices": crudeOilPricesData,
  "Weather_Data": weatherData,
  "Weather_Climate_Data": weatherClimateData,
  "Search_Trends": [
    { date: "2023-01-01", search_keyword: "wireless earbuds", geo: "IN", category: "Earbuds", trend_score: 38 },
    { date: "2023-01-01", search_keyword: "bluetooth speaker", geo: "IN", category: "Speakers", trend_score: 22 },
    { date: "2023-01-01", search_keyword: "noise cancelling headphones", geo: "IN", category: "Headphones", trend_score: 41 },
  ],
  "Platform_Sale_Events": [...seasonalIllnessData.map(s => ({ ...s, type: "Sale Event" }))],
  "Competitor_Pricing": prescriptionTrendsData,
  "Social_Media_Sentiment": medicalConferenceData,
  "Consumer_Sentiment_Index": healthcarePolicyData,
  "New_Product_Launches": genericDrugLaunchesData,
  "Competitor_Activity": diseaseOutbreakData,
  "Seasonality_Trends": seasonalityTrendsData,
  "Promotional_Campaigns": promotionalCampaignsData,
  "Promotions_Discounts": promotionalCampaignsData,
  "NSE_Index": [
    { date: "2025-07-01", index: "NIFTY50", value: 24500, change: 125.5 },
    { date: "2025-07-02", index: "NIFTY50", value: 24350, change: -150.0 }
  ],
  "NASDAQ_Index": [
    { date: "2025-07-01", index: "NASDAQ", value: 18200, change: 85.2 },
    { date: "2025-07-02", index: "NASDAQ", value: 18150, change: -50.0 }
  ],
  
  // External Drivers Data (matching Foundry format)
  ...Object.fromEntries(
    Object.entries(externalDriversData).map(([key, value]) => [key, value])
  )
};

export const getFoundryObjectData = (objectName: string) => {
  return foundryDataMapper[objectName as keyof typeof foundryDataMapper] || [];
};
