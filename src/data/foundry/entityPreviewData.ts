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
      { accessorKey: "unit", header: "Unit" },
      { accessorKey: "price", header: "Price ($)" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "PRD001", name: "Widget A", category: "Electronics", brand: "TechCorp", unit: "pieces", price: 29.99, status: "Active" },
      { id: "PRD002", name: "Component B", category: "Hardware", brand: "BuildCorp", unit: "units", price: 15.50, status: "Active" },
      { id: "PRD003", name: "Assembly C", category: "Manufacturing", brand: "MakeCorp", unit: "sets", price: 45.25, status: "Inactive" },
      { id: "PRD004", name: "Tool D", category: "Industrial", brand: "WorkCorp", unit: "pieces", price: 125.00, status: "Active" },
      { id: "PRD005", name: "Material E", category: "Raw Materials", brand: "SupplyCorp", unit: "kg", price: 8.75, status: "Active" }
    ],
    stats: { totalRecords: 5, lastSync: "2025-07-21 15:20", source: "Snowflake" }
  },
  "location": {
    title: "Location Master",
    description: "Network of warehouses, distribution centers, and retail locations across the US",
    columns: [
      { accessorKey: "id", header: "Location ID" },
      { accessorKey: "name", header: "Location Name" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "capacity", header: "Capacity" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "LOC001", name: "New York Warehouse", type: "Warehouse", address: "New York, NY", capacity: 50000, status: "Active" },
      { id: "LOC002", name: "Chicago Distribution Center", type: "Distribution Center", address: "Chicago, IL", capacity: 75000, status: "Active" },
      { id: "LOC003", name: "Los Angeles Port Terminal", type: "Port", address: "Los Angeles, CA", capacity: 100000, status: "Active" },
      { id: "LOC004", name: "Dallas Manufacturing Plant", type: "Manufacturing", address: "Dallas, TX", capacity: 25000, status: "Under Maintenance" },
      { id: "LOC005", name: "Miami Retail Store", type: "Retail", address: "Miami, FL", capacity: 5000, status: "Active" }
    ],
    stats: { totalRecords: 5, lastSync: "2025-07-18 09:45", source: "CSV Upload" }
  },
  "customer": {
    title: "Customer Master",
    description: "Customer demographics, account information, and credit details",
    columns: [
      { accessorKey: "id", header: "Customer ID" },
      { accessorKey: "name", header: "Customer Name" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "industry", header: "Industry" },
      { accessorKey: "creditLimit", header: "Credit Limit ($)" },
      { accessorKey: "status", header: "Status" }
    ],
    rows: [
      { id: "CUST001", name: "Acme Corporation", type: "Enterprise", industry: "Manufacturing", creditLimit: 500000, status: "Active" },
      { id: "CUST002", name: "Global Tech Solutions", type: "Enterprise", industry: "Technology", creditLimit: 750000, status: "Active" },
      { id: "CUST003", name: "Regional Retail Chain", type: "Mid-Market", industry: "Retail", creditLimit: 250000, status: "Active" },
      { id: "CUST004", name: "StartUp Innovations Inc", type: "Small Business", industry: "Technology", creditLimit: 50000, status: "Active" },
      { id: "CUST005", name: "Heritage Manufacturing", type: "Enterprise", industry: "Manufacturing", creditLimit: 400000, status: "Under Review" }
    ],
    stats: { totalRecords: 5, lastSync: "2025-07-20 14:30", source: "Salesforce" }
  },
  "sales-history": {
    title: "Sales History",
    description: "Detailed transaction records with temporal patterns and trends",
    columns: [
      { accessorKey: "date", header: "Transaction Date" },
      { accessorKey: "product", header: "Product" },
      { accessorKey: "customer", header: "Customer" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "quantity", header: "Quantity" },
      { accessorKey: "revenue", header: "Revenue ($)" },
      { accessorKey: "channel", header: "Channel" }
    ],
    rows: [
      { id: 1, date: "2024-07-01", product: "Widget A", customer: "Acme Corporation", location: "New York", quantity: 150, revenue: 4497.50, channel: "Online" },
      { id: 2, date: "2024-07-01", product: "Component B", customer: "Global Tech Solutions", location: "Chicago", quantity: 200, revenue: 3100.00, channel: "Direct Sales" },
      { id: 3, date: "2024-07-02", product: "Assembly C", customer: "Regional Retail Chain", location: "Los Angeles", quantity: 75, revenue: 3393.75, channel: "B2B" },
      { id: 4, date: "2024-07-02", product: "Tool D", customer: "Heritage Manufacturing", location: "Dallas", quantity: 50, revenue: 6250.00, channel: "Direct Sales" }
    ],
    stats: { totalRecords: 10, lastSync: "2025-07-19 18:15", source: "HDFS" }
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
      { accessorKey: "temperature", header: "Temp (°F)" },
      { accessorKey: "humidity", header: "Humidity %" },
      { accessorKey: "precipitation", header: "Rainfall (in)" },
      { accessorKey: "weatherCondition", header: "Conditions" }
    ],
    rows: [
      { id: 1, date: "2024-07-01", location: "New York", temperature: 78, humidity: 65, precipitation: 0.0, weatherCondition: "Sunny" },
      { id: 2, date: "2024-07-01", location: "Chicago", temperature: 75, humidity: 70, precipitation: 0.12, weatherCondition: "Partly Cloudy" },
      { id: 3, date: "2024-07-01", location: "Los Angeles", temperature: 82, humidity: 55, precipitation: 0.0, weatherCondition: "Clear" },
      { id: 4, date: "2024-07-02", location: "Dallas", temperature: 88, humidity: 60, precipitation: 0.0, weatherCondition: "Hot" }
    ],
    stats: { totalRecords: 10, lastSync: "2025-07-21 08:20", source: "HDFS" }
  }
};