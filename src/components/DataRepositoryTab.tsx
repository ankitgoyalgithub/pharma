import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, FileSpreadsheet, TrendingUp, AlertTriangle, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// ── Input Data ──
const salesHistoryData = [
  { sku: "SKU_001", product: "Product_1 (Earbuds)", channel: "Amazon", region: "North", month: "2024-01", units: 1245, revenue: "₹48.2L" },
  { sku: "SKU_005", product: "Product_5 (Speakers)", channel: "Flipkart", region: "Central", month: "2024-01", units: 980, revenue: "₹45.6L" },
  { sku: "SKU_007", product: "Product_7 (Headphones)", channel: "D2C", region: "East", month: "2024-01", units: 1102, revenue: "₹47.3L" },
  { sku: "SKU_012", product: "Product_12 (Speakers)", channel: "Amazon", region: "Central", month: "2024-02", units: 856, revenue: "₹29.2L" },
  { sku: "SKU_021", product: "Product_21 (Headphones)", channel: "Flipkart", region: "Central", month: "2024-02", units: 1340, revenue: "₹75.4L" },
  { sku: "SKU_029", product: "Product_29 (Speakers)", channel: "Distributor", region: "South", month: "2024-02", units: 1580, revenue: "₹80.7L" },
  { sku: "SKU_035", product: "Product_35 (Headphones)", channel: "Retail", region: "West", month: "2024-03", units: 1450, revenue: "₹60.9L" },
  { sku: "SKU_040", product: "Product_40 (Earbuds)", channel: "Distributor", region: "South", month: "2024-03", units: 1620, revenue: "₹78.1L" },
  { sku: "SKU_043", product: "Product_43 (Wearables)", channel: "D2C", region: "South", month: "2024-03", units: 1380, revenue: "₹26.8L" },
  { sku: "SKU_049", product: "Product_49 (Earbuds)", channel: "Amazon", region: "West", month: "2024-04", units: 1050, revenue: "₹33.9L" },
];

const productMasterData = [
  { sku: "SKU_001", product: "Product_1", category: "Earbuds", subCategory: "TWS", mrp: 3872, status: "Active" },
  { sku: "SKU_005", product: "Product_5", category: "Speakers", subCategory: "Portable", mrp: 4657, status: "Active" },
  { sku: "SKU_007", product: "Product_7", category: "Headphones", subCategory: "OverEar", mrp: 4296, status: "Active" },
  { sku: "SKU_012", product: "Product_12", category: "Speakers", subCategory: "TWS", mrp: 3411, status: "Active" },
  { sku: "SKU_021", product: "Product_21", category: "Headphones", subCategory: "OverEar", mrp: 5627, status: "Active" },
  { sku: "SKU_029", product: "Product_29", category: "Speakers", subCategory: "Premium", mrp: 5106, status: "Active" },
  { sku: "SKU_035", product: "Product_35", category: "Headphones", subCategory: "OnEar", mrp: 4196, status: "Active" },
  { sku: "SKU_040", product: "Product_40", category: "Earbuds", subCategory: "Neckband", mrp: 4819, status: "Active" },
  { sku: "SKU_043", product: "Product_43", category: "Wearables", subCategory: "Smartwatch", mrp: 1946, status: "Active" },
  { sku: "SKU_049", product: "Product_49", category: "Earbuds", subCategory: "TWS", mrp: 3230, status: "Active" },
];

const channelMasterData = [
  { channelId: "CH_001", channel: "Amazon", type: "Marketplace", region: "Pan India", contribution: "35%" },
  { channelId: "CH_002", channel: "Flipkart", type: "Marketplace", region: "Pan India", contribution: "25%" },
  { channelId: "CH_003", channel: "D2C", type: "Own Platform", region: "Pan India", contribution: "20%" },
  { channelId: "CH_004", channel: "Retail", type: "Offline", region: "Metro Cities", contribution: "12%" },
  { channelId: "CH_005", channel: "Distributor", type: "Wholesale", region: "Tier 2/3", contribution: "8%" },
];

// ── Output Data ──
const forecastOutputData = [
  { sku: "SKU_001", product: "Product_1 (Earbuds)", channel: "Amazon", region: "North", forecastW1: 1320, forecastW2: 1285, forecastW3: 1410, forecastW4: 1380, mape: "7.0%", model: "LightGBM" },
  { sku: "SKU_005", product: "Product_5 (Speakers)", channel: "Flipkart", region: "Central", forecastW1: 1015, forecastW2: 1042, forecastW3: 998, forecastW4: 1060, mape: "5.5%", model: "XGBoost" },
  { sku: "SKU_007", product: "Product_7 (Headphones)", channel: "D2C", region: "East", forecastW1: 1085, forecastW2: 1120, forecastW3: 1095, forecastW4: 1140, mape: "2.4%", model: "Prophet" },
  { sku: "SKU_012", product: "Product_12 (Speakers)", channel: "Amazon", region: "Central", forecastW1: 890, forecastW2: 920, forecastW3: 875, forecastW4: 945, mape: "5.8%", model: "LightGBM" },
  { sku: "SKU_021", product: "Product_21 (Headphones)", channel: "Flipkart", region: "Central", forecastW1: 1280, forecastW2: 1310, forecastW3: 1350, forecastW4: 1295, mape: "4.6%", model: "XGBoost" },
  { sku: "SKU_029", product: "Product_29 (Speakers)", channel: "Distributor", region: "South", forecastW1: 1620, forecastW2: 1580, forecastW3: 1650, forecastW4: 1600, mape: "9.7%", model: "Prophet" },
  { sku: "SKU_035", product: "Product_35 (Headphones)", channel: "Retail", region: "West", forecastW1: 1490, forecastW2: 1460, forecastW3: 1520, forecastW4: 1480, mape: "3.1%", model: "LightGBM" },
  { sku: "SKU_040", product: "Product_40 (Earbuds)", channel: "Distributor", region: "South", forecastW1: 1670, forecastW2: 1710, forecastW3: 1640, forecastW4: 1695, mape: "9.3%", model: "XGBoost" },
  { sku: "SKU_043", product: "Product_43 (Wearables)", channel: "D2C", region: "South", forecastW1: 1350, forecastW2: 1390, forecastW3: 1340, forecastW4: 1410, mape: "3.6%", model: "Prophet" },
  { sku: "SKU_049", product: "Product_49 (Earbuds)", channel: "Amazon", region: "West", forecastW1: 1080, forecastW2: 1060, forecastW3: 1100, forecastW4: 1075, mape: "2.6%", model: "LightGBM" },
];

const outlierData = [
  { sku: "SKU_029", product: "Product_29 (Speakers)", channel: "Distributor", month: "2024-10", actual: 3420, expected: 1620, deviation: "+111%", type: "Spike", reason: "Diwali sale surge" },
  { sku: "SKU_001", product: "Product_1 (Earbuds)", channel: "Amazon", month: "2024-11", actual: 2890, expected: 1320, deviation: "+119%", type: "Spike", reason: "Big Billion Day promo" },
  { sku: "SKU_040", product: "Product_40 (Earbuds)", channel: "Distributor", month: "2024-07", actual: 580, expected: 1650, deviation: "-65%", type: "Drop", reason: "Supply chain disruption" },
  { sku: "SKU_043", product: "Product_43 (Wearables)", channel: "D2C", month: "2024-08", actual: 420, expected: 1380, deviation: "-70%", type: "Drop", reason: "Product recall" },
  { sku: "SKU_021", product: "Product_21 (Headphones)", channel: "Flipkart", month: "2024-12", actual: 2650, expected: 1340, deviation: "+98%", type: "Spike", reason: "Year-end clearance" },
  { sku: "SKU_012", product: "Product_12 (Speakers)", channel: "Amazon", month: "2024-03", actual: 320, expected: 860, deviation: "-63%", type: "Drop", reason: "New competitor launch" },
];

const featureImportanceData = [
  { feature: "Lag_1_Sales", importance: 0.284, category: "Temporal", description: "Previous week sales volume" },
  { feature: "Channel_Type", importance: 0.198, category: "Channel", description: "Sales channel (Amazon, Flipkart, D2C, etc.)" },
  { feature: "Promotional_Flag", importance: 0.152, category: "Promotion", description: "Whether a promotion is active" },
  { feature: "Seasonality_Index", importance: 0.118, category: "Temporal", description: "Month-level seasonal decomposition" },
  { feature: "Price_Discount_%", importance: 0.087, category: "Pricing", description: "Discount percentage from MRP" },
  { feature: "Festival_Proximity", importance: 0.062, category: "External", description: "Days to nearest major festival/sale event" },
  { feature: "Category_Growth_Rate", importance: 0.042, category: "Market", description: "Category-level QoQ growth rate" },
  { feature: "Competitor_Price_Index", importance: 0.031, category: "Competition", description: "Relative pricing vs. competitors" },
  { feature: "Weather_Index", importance: 0.018, category: "External", description: "Regional weather-based demand factor" },
  { feature: "Day_of_Week", importance: 0.008, category: "Temporal", description: "Day-of-week effect on online orders" },
];

interface DataTableProps {
  headers: string[];
  keys: string[];
  data: Record<string, any>[];
  searchKey?: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, keys, data, searchKey }) => {
  const [search, setSearch] = useState("");
  const filtered = searchKey
    ? data.filter(row => String(row[searchKey]).toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <div className="space-y-3">
      {searchKey && (
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      )}
      <ScrollArea className="h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border/40 bg-muted/50">
                {headers.map(col => (
                  <th key={col} className="text-left py-2.5 px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  {keys.map((key, ci) => {
                    const val = row[key];
                    return (
                      <td key={ci} className="py-2 px-3 text-xs text-foreground whitespace-nowrap">
                        {typeof val === 'number' ? val.toLocaleString() : String(val ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
      <div className="text-[10px] text-muted-foreground text-right">
        Showing {filtered.length} of {data.length} records
      </div>
    </div>
  );
};

const datasetConfigs = [
  {
    id: "sales",
    label: "Sales History",
    icon: FileSpreadsheet,
    badge: `${salesHistoryData.length} rows`,
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    columns: Object.keys(salesHistoryData[0]),
    data: salesHistoryData,
    searchKey: "sku",
    description: "Historical sales transactions by SKU, channel, and region",
  },
  {
    id: "products",
    label: "Product Master",
    icon: Database,
    badge: `${productMasterData.length} rows`,
    badgeClass: "bg-success/15 text-success border-success/30",
    columns: Object.keys(productMasterData[0]),
    data: productMasterData,
    searchKey: "sku",
    description: "Product catalog with categories, pricing, and status",
  },
  {
    id: "channels",
    label: "Channel Master",
    icon: Database,
    badge: `${channelMasterData.length} rows`,
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    columns: Object.keys(channelMasterData[0]),
    data: channelMasterData,
    searchKey: "channel",
    description: "Sales channels with type and regional contribution",
  },
  {
    id: "forecast",
    label: "Forecast Output",
    icon: TrendingUp,
    badge: `${forecastOutputData.length} rows`,
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    columns: Object.keys(forecastOutputData[0]),
    data: forecastOutputData,
    searchKey: "sku",
    description: "4-week demand forecast with model accuracy (MAPE)",
  },
  {
    id: "outliers",
    label: "Outlier Detection",
    icon: AlertTriangle,
    badge: `${outlierData.length} flagged`,
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
    columns: Object.keys(outlierData[0]),
    data: outlierData,
    searchKey: "sku",
    description: "Detected anomalies with deviation analysis and root causes",
  },
  {
    id: "features",
    label: "Feature Importance",
    icon: Sparkles,
    badge: `${featureImportanceData.length} features`,
    badgeClass: "bg-accent/15 text-accent-foreground border-accent/30",
    columns: Object.keys(featureImportanceData[0]),
    data: featureImportanceData,
    searchKey: "feature",
    description: "ML model feature rankings with contribution scores",
  },
];

export const DataRepositoryTab: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState("sales");
  const config = datasetConfigs.find(d => d.id === activeDataset)!;

  return (
    <div className="space-y-5 animate-fade-in">
      <p className="text-xs text-muted-foreground">
        Centralized data repository — browse all input datasets and model output tables used in this forecast study.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="border-border/40 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <Database className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-primary">6</div>
            <div className="text-[10px] text-muted-foreground">Datasets</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-3 text-center">
            <FileSpreadsheet className="w-4 h-4 text-success mx-auto mb-1" />
            <div className="text-xl font-bold text-success">3</div>
            <div className="text-[10px] text-muted-foreground">Input Tables</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-4 h-4 text-warning mx-auto mb-1" />
            <div className="text-xl font-bold text-warning">3</div>
            <div className="text-[10px] text-muted-foreground">Output Tables</div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Tabs */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Data Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeDataset} onValueChange={setActiveDataset}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/30 p-1 mb-4">
              {datasetConfigs.map(d => (
                <TabsTrigger key={d.id} value={d.id} className="text-xs flex items-center gap-1.5 data-[state=active]:bg-background">
                  <d.icon className="w-3.5 h-3.5" />
                  {d.label}
                  <Badge className={`${d.badgeClass} text-[9px] px-1 py-0 ml-1`}>{d.badge}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {datasetConfigs.map(d => (
              <TabsContent key={d.id} value={d.id} className="mt-0">
                <p className="text-[11px] text-muted-foreground mb-3">{d.description}</p>
                <DataTable
                  columns={d.columns.map(c => c.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/_/g, ' '))}
                  data={d.data}
                  searchKey={d.searchKey}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
