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
  
  // External Drivers Data (matching Foundry format)
  ...Object.fromEntries(
    Object.entries(externalDriversData).map(([key, value]) => [key, value])
  )
};

export const getFoundryObjectData = (objectName: string) => {
  return foundryDataMapper[objectName as keyof typeof foundryDataMapper] || [];
};