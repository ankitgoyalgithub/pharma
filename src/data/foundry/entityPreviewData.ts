import { EntityPreviewMap } from "./types";

export const entityPreviewData: EntityPreviewMap = {
  "product": {
    title: "Product Master",
    description: "Comprehensive product catalog with detailed attributes and specifications",
    columns: [
      { accessorKey: "id", header: "Product ID" },
      { accessorKey: "name", header: "Product Name" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "brand", header: "Brand" },
      { accessorKey: "uom", header: "UOM" },
      { accessorKey: "price", header: "Price ($)" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "P-1001", name: "Widget A Pro", category: "Gadgets", brand: "TechCorp", uom: "PCS", price: 29.99, status: "Active" },
      { id: "P-1002", name: "Widget B Elite", category: "Gadgets", brand: "TechCorp", uom: "PCS", price: 45.50, status: "Active" },
      { id: "P-1003", name: "Tool X Premium", category: "Tools", brand: "ToolMaster", uom: "SET", price: 125.00, status: "Active" },
      { id: "P-1004", name: "Tool Y Standard", category: "Tools", brand: "ToolMaster", uom: "PCS", price: 78.25, status: "Active" },
      { id: "P-1005", name: "Accessory M", category: "Accessories", brand: "AccessPro", uom: "PCS", price: 15.75, status: "Active" },
      { id: "P-1006", name: "Accessory N", category: "Accessories", brand: "AccessPro", uom: "PCS", price: 22.50, status: "Pending" },
      { id: "P-1007", name: "Widget Z Legacy", category: "Gadgets", brand: "OldTech", uom: "PCS", price: 12.99, status: "Discontinued" },
      { id: "P-1008", name: "Gizmo P Advanced", category: "Devices", brand: "GizmoInc", uom: "BOX", price: 89.99, status: "Active" }
    ],
    stats: { totalRecords: 3582, lastSync: "2025-07-21 15:20", source: "Snowflake" }
  },
  "location": {
    title: "Location Master",
    description: "Global network of warehouses, distribution centers, and fulfillment locations",
    columns: [
      { accessorKey: "id", header: "Location ID" },
      { accessorKey: "name", header: "Location Name" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "region", header: "Region" },
      { accessorKey: "capacity", header: "Capacity (sq ft)" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "LOC-201", name: "Delhi Warehouse", type: "Warehouse", region: "North", capacity: 50000, status: "Active" },
      { id: "LOC-202", name: "Mumbai Distribution Center", type: "Distribution", region: "West", capacity: 75000, status: "Active" },
      { id: "LOC-203", name: "Bangalore Fulfillment", type: "Fulfillment", region: "South", capacity: 45000, status: "Active" },
      { id: "LOC-204", name: "Kolkata Distribution", type: "Distribution", region: "East", capacity: 60000, status: "Active" },
      { id: "LOC-205", name: "Chennai Warehouse", type: "Warehouse", region: "South", capacity: 40000, status: "Inactive" }
    ],
    stats: { totalRecords: 213, lastSync: "2025-07-18 09:45", source: "CSV Upload" }
  },
  "customer": {
    title: "Customer Master",
    description: "Customer demographics, preferences, and account information",
    columns: [
      { accessorKey: "id", header: "Customer ID" },
      { accessorKey: "name", header: "Customer Name" },
      { accessorKey: "segment", header: "Segment" },
      { accessorKey: "region", header: "Region" },
      { accessorKey: "lifetime_value", header: "LTV ($)" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "C-10001", name: "TechSolutions Inc", segment: "Enterprise", region: "North", lifetime_value: 125000, status: "Active" },
      { id: "C-10002", name: "Global Retail Corp", segment: "Corporate", region: "West", lifetime_value: 87500, status: "Active" },
      { id: "C-10003", name: "StartUp Dynamics", segment: "SMB", region: "South", lifetime_value: 23000, status: "Active" },
      { id: "C-10004", name: "Innovation Labs", segment: "Enterprise", region: "East", lifetime_value: 156000, status: "Premium" }
    ],
    stats: { totalRecords: 15420, lastSync: "2025-07-20 14:30", source: "Salesforce" }
  },
  "sales-history": {
    title: "Sales History",
    description: "Detailed transaction records with temporal patterns and trends",
    columns: [
      { accessorKey: "date", header: "Transaction Date" },
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "customer", header: "Customer" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "units", header: "Units Sold" },
      { accessorKey: "revenue", header: "Revenue ($)" },
      { accessorKey: "profit_margin", header: "Margin %" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", sku: "P-1001", customer: "TechSolutions", location: "Delhi", units: 120, revenue: 3598.80, profit_margin: 22.5 },
      { id: 2, date: "2024-01-16", sku: "P-1002", customer: "Global Retail", location: "Mumbai", units: 85, revenue: 3867.50, profit_margin: 18.7 },
      { id: 3, date: "2024-01-17", sku: "P-1003", customer: "StartUp Dynamics", location: "Bangalore", units: 98, revenue: 12250.00, profit_margin: 35.2 },
      { id: 4, date: "2024-01-18", sku: "P-1004", customer: "Innovation Labs", location: "Chennai", units: 110, revenue: 8607.50, profit_margin: 28.9 }
    ],
    stats: { totalRecords: 14236, lastSync: "2025-07-19 18:15", source: "HDFS" }
  },
  "copper-prices": {
    title: "Copper Prices",
    description: "Real-time commodity pricing data with market indicators",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "commodity", header: "Commodity" },
      { accessorKey: "exchange", header: "Exchange" },
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "price", header: "Price ($)" },
      { accessorKey: "change", header: "Change %" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", commodity: "Copper", exchange: "LME", unit: "USD/MT", price: 8720.50, change: 1.2 },
      { id: 2, date: "2024-01-16", commodity: "Copper", exchange: "LME", unit: "USD/MT", price: 8755.25, change: 0.4 },
      { id: 3, date: "2024-01-17", commodity: "Copper", exchange: "LME", unit: "USD/MT", price: 8690.75, change: -0.7 },
      { id: 4, date: "2024-01-18", commodity: "Copper", exchange: "LME", unit: "USD/MT", price: 8800.00, change: 1.3 }
    ],
    stats: { totalRecords: 846, lastSync: "2025-07-20 22:00", source: "Google Drive" }
  },
  "holiday-calendar": {
    title: "Holiday Calendar",
    description: "Global holiday and seasonal events affecting business operations",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "holiday", header: "Holiday Name" },
      { accessorKey: "country", header: "Country" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "impact", header: "Business Impact" }
    ],
    rows: [
      { id: 1, date: "2024-01-01", holiday: "New Year's Day", country: "Global", type: "Public", impact: "High" },
      { id: 2, date: "2024-01-26", holiday: "Republic Day", country: "India", type: "National", impact: "Medium" },
      { id: 3, date: "2024-02-14", holiday: "Valentine's Day", country: "Global", type: "Commercial", impact: "Low" },
      { id: 4, date: "2024-03-08", holiday: "Holi Festival", country: "India", type: "Religious", impact: "Medium" }
    ],
    stats: { totalRecords: 2456, lastSync: "2025-07-21 07:00", source: "Oracle" }
  },
  "crude-oil-prices": {
    title: "Crude Oil Prices",
    description: "Global crude oil market data and price movements",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "benchmark", header: "Benchmark" },
      { accessorKey: "price", header: "Price ($/barrel)" },
      { accessorKey: "volume", header: "Volume" },
      { accessorKey: "change", header: "Daily Change %" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", benchmark: "Brent Crude", price: 82.45, volume: "2.1M", change: 0.8 },
      { id: 2, date: "2024-01-16", benchmark: "WTI Crude", price: 78.92, volume: "1.8M", change: -0.3 },
      { id: 3, date: "2024-01-17", benchmark: "Brent Crude", price: 83.12, volume: "2.3M", change: 0.8 },
      { id: 4, date: "2024-01-18", benchmark: "WTI Crude", price: 79.67, volume: "1.9M", change: 0.9 }
    ],
    stats: { totalRecords: 1825, lastSync: "2025-07-21 06:15", source: "Google Drive" }
  },
  "nse-index": {
    title: "NSE Index",
    description: "National Stock Exchange market indicators and sector performance",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "index", header: "Index" },
      { accessorKey: "value", header: "Value" },
      { accessorKey: "change", header: "Change" },
      { accessorKey: "change_percent", header: "Change %" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", index: "NIFTY 50", value: 21456.78, change: 234.56, change_percent: 1.11 },
      { id: 2, date: "2024-01-16", index: "NIFTY Bank", value: 47832.45, change: -123.89, change_percent: -0.26 },
      { id: 3, date: "2024-01-17", index: "NIFTY IT", value: 32567.23, change: 456.78, change_percent: 1.42 },
      { id: 4, date: "2024-01-18", index: "NIFTY Auto", value: 18956.34, change: 89.12, change_percent: 0.47 }
    ],
    stats: { totalRecords: 3650, lastSync: "2025-07-21 09:45", source: "Snowflake" }
  },
  "nasdaq-index": {
    title: "NASDAQ Index",
    description: "NASDAQ composite and technology sector market data",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "index", header: "Index" },
      { accessorKey: "value", header: "Value" },
      { accessorKey: "change", header: "Change" },
      { accessorKey: "volume", header: "Volume (M)" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", index: "NASDAQ Composite", value: 15234.67, change: 89.45, volume: 4.2 },
      { id: 2, date: "2024-01-16", index: "NASDAQ 100", value: 17896.23, change: -45.78, volume: 3.8 },
      { id: 3, date: "2024-01-17", index: "NASDAQ Tech", value: 12678.90, change: 156.34, volume: 5.1 },
      { id: 4, date: "2024-01-18", index: "NASDAQ Biotech", value: 4567.89, change: 23.67, volume: 2.3 }
    ],
    stats: { totalRecords: 4380, lastSync: "2025-07-21 10:30", source: "Oracle" }
  },
  "weather-data": {
    title: "Weather Data",
    description: "Comprehensive meteorological data affecting supply chain operations",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "temperature", header: "Temp (°C)" },
      { accessorKey: "humidity", header: "Humidity %" },
      { accessorKey: "precipitation", header: "Rainfall (mm)" },
      { accessorKey: "conditions", header: "Conditions" }
    ],
    rows: [
      { id: 1, date: "2024-01-15", location: "Delhi", temperature: 18.5, humidity: 65, precipitation: 0, conditions: "Clear" },
      { id: 2, date: "2024-01-16", location: "Mumbai", temperature: 26.8, humidity: 78, precipitation: 2.3, conditions: "Light Rain" },
      { id: 3, date: "2024-01-17", location: "Bangalore", temperature: 22.1, humidity: 72, precipitation: 0, conditions: "Partly Cloudy" },
      { id: 4, date: "2024-01-18", location: "Chennai", temperature: 28.9, humidity: 81, precipitation: 5.7, conditions: "Thunderstorm" }
    ],
    stats: { totalRecords: 87456, lastSync: "2025-07-21 08:20", source: "HDFS" }
  }
};