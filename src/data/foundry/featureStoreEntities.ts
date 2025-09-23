import { EntityModule } from "./types";

export const featureStoreEntities: EntityModule[] = [
  {
    title: "Holiday Calendar",
    description: "Public holidays and seasonal events data",
    origin: "third-party",
    route: "/entity-preview/holiday-calendar",
    recordCount: 2456,
    lastSync: "2025-07-21T07:00:00Z",
    sourceType: "oracle",
  },
  {
    title: "Crude Oil Prices",
    description: "Global crude oil pricing and trends",
    origin: "third-party",
    route: "/entity-preview/crude-oil-prices",
    recordCount: 1825,
    lastSync: "2025-07-21T06:15:00Z",
    sourceType: "gdrive",
  },
  {
    title: "NSE Index",
    description: "National Stock Exchange market indicators",
    origin: "third-party",
    route: "/entity-preview/nse-index",
    recordCount: 3650,
    lastSync: "2025-07-21T09:45:00Z",
    sourceType: "snowflake",
  },
  {
    title: "NASDAQ Index",
    description: "NASDAQ composite and sector indices",
    origin: "third-party",
    route: "/entity-preview/nasdaq-index",
    recordCount: 4380,
    lastSync: "2025-07-21T10:30:00Z",
    sourceType: "oracle",
  },
  {
    title: "Weather Data",
    description: "Meteorological data and climate patterns",
    origin: "third-party",
    route: "/entity-preview/weather-data",
    recordCount: 87456,
    lastSync: "2025-07-21T08:20:00Z",
    sourceType: "hdfs",
  },
];