// Utility to map foundry object names to their corresponding data
import { productMasterData } from "./productMasterData";
import { locationMasterData } from "./locationMasterData"; 
import { customerMasterData } from "./customerMasterData";
import { supplierMasterData } from "./supplierMasterData";
import { employeeMasterData } from "./employeeMasterData";
import { salesHistoryData } from "./salesHistoryData";
import { inventoryLevelsData } from "./inventoryLevelsData";
import { holidayCalendarData } from "./holidayCalendarData";
import { crudeOilPricesData } from "./crudeOilPricesData";
import { weatherData } from "./weatherData";
import { externalDriversData } from "../demandForecasting/externalDriversData";

export const foundryDataMapper = {
  // Master Data
  "Product_Master": productMasterData,
  "Location_Master": locationMasterData,
  "Customer_Master": customerMasterData,
  "Supplier_Master": supplierMasterData,
  "Employee_Master": employeeMasterData,
  "Channel_Master": [
    { id: "CH001", name: "Online", type: "E-commerce", status: "Active" },
    { id: "CH002", name: "Direct Sales", type: "B2B", status: "Active" },
    { id: "CH003", name: "Partner", type: "Retail", status: "Active" }
  ],
  
  // Time Series Data  
  "Sales_Historical": salesHistoryData,
  "Inventory_Data": inventoryLevelsData,
  "Price_History": [
    { date: "2024-07-01", product: "Widget A", price: 29.99, currency: "USD" },
    { date: "2024-07-02", product: "Widget A", price: 30.25, currency: "USD" },
    { date: "2024-07-03", product: "Component B", price: 15.50, currency: "USD" }
  ],
  "Promotion_Data": [
    { date: "2024-07-01", product: "Widget A", discount: 10, type: "Percentage" },
    { date: "2024-07-15", product: "Component B", discount: 5, type: "Percentage" }
  ],
  
  // Feature Store Data
  "Holiday_Calendar": holidayCalendarData,
  "Crude_Oil_Prices": crudeOilPricesData,
  "Weather_Data": weatherData,
  "NSE_Index": [
    { date: "2024-07-01", index: "NIFTY50", value: 24500, change: 125.5 },
    { date: "2024-07-02", index: "NIFTY50", value: 24350, change: -150.0 }
  ],
  "NASDAQ_Index": [
    { date: "2024-07-01", index: "NASDAQ", value: 18200, change: 85.2 },
    { date: "2024-07-02", index: "NASDAQ", value: 18150, change: -50.0 }
  ],
  "Search_Trends": [
    { date: "2023-01-01", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 38 },
    { date: "2023-01-01", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 22 },
    { date: "2023-01-01", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 41 },
    { date: "2023-01-08", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 42 },
    { date: "2023-01-08", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 25 },
    { date: "2023-01-08", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 47 },
    { date: "2023-01-15", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 45 },
    { date: "2023-01-15", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 29 },
    { date: "2023-01-15", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 50 },
    { date: "2023-01-22", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 52 },
    { date: "2023-01-22", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 35 },
    { date: "2023-01-22", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 58 },
    { date: "2023-01-29", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 57 },
    { date: "2023-01-29", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 39 },
    { date: "2023-01-29", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 61 },
    { date: "2023-02-05", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 61 },
    { date: "2023-02-05", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 45 },
    { date: "2023-02-05", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 66 },
    { date: "2023-02-12", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 68 },
    { date: "2023-02-12", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 51 },
    { date: "2023-02-12", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 72 },
    { date: "2023-02-19", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 72 },
    { date: "2023-02-19", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 57 },
    { date: "2023-02-19", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 75 },
    { date: "2023-02-26", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 76 },
    { date: "2023-02-26", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 63 },
    { date: "2023-02-26", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 78 },
    { date: "2023-03-05", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 82 },
    { date: "2023-03-05", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 71 },
    { date: "2023-03-05", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 83 },
    { date: "2023-03-12", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 88 },
    { date: "2023-03-12", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 78 },
    { date: "2023-03-12", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 89 },
    { date: "2023-03-19", search_keyword: "men tshirts", geo: "IN", category: "apparel", trend_score: 94 },
    { date: "2023-03-19", search_keyword: "summer dresses", geo: "IN", category: "apparel", trend_score: 84 },
    { date: "2023-03-19", search_keyword: "sports shoes", geo: "IN", category: "footwear", trend_score: 93 }
  ],
  
  // External Drivers Data (matching Foundry format)
  ...Object.fromEntries(
    Object.entries(externalDriversData).map(([key, value]) => [key, value])
  )
};

export const getFoundryObjectData = (objectName: string) => {
  return foundryDataMapper[objectName as keyof typeof foundryDataMapper] || [];
};