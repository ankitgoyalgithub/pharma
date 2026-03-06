import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Save, Edit3, MessageSquare, Maximize, Minimize, CheckCircle2, XCircle, ChevronRight, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { productImageMap } from "@/data/foundry/productImages";


interface ForecastRow {
  id: string;
  sku: string;
  productName: string;
  category: string;
  node: string;
  channel: "Online" | "Retail" | "B2B" | "Direct";
  owner: string;
  week1: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week2: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week3: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week4: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week5: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week6: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week7: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week8: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week9: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week10: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week11: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  week12: { forecast: number; plannerInput?: number; reason?: string; lastYear: number };
  label?: string;
  remarks?: string;
  approvalStatus: "approved" | "rejected";
  approverRole?: string;
  approvalDetails?: {
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    remarks?: string;
  };
  allRemarks?: Array<{
    date: string;
    user: string;
    comment: string;
  }>;
}

// boAt Consumer Electronics SKUs aligned with dim_product.csv
const pharmaSKUs = [
  { sku: "SKU_001", name: "Airdopes 141 (Earbuds)", category: "Earbuds" },
  { sku: "SKU_005", name: "Stone 352 (Speakers)", category: "Speakers" },
  { sku: "SKU_007", name: "Rockerz 255 Pro+ (Neckband)", category: "Headphones" },
  { sku: "SKU_012", name: "PartyPal 300 (Party Speaker)", category: "Speakers" },
  { sku: "SKU_021", name: "Rockerz 450 (Headphones)", category: "Headphones" },
  { sku: "SKU_029", name: "Stone 1200F (Speaker)", category: "Speakers" },
  { sku: "SKU_035", name: "Rockerz 238 (Neckband)", category: "Headphones" },
  { sku: "SKU_038", name: "Lunar Discovery (Smartwatch)", category: "Wearables" },
  { sku: "SKU_040", name: "Airdopes Alpha (TWS)", category: "Earbuds" },
  { sku: "SKU_043", name: "Lunar Fit (Smartwatch)", category: "Wearables" },
  { sku: "SKU_049", name: "Nirvana Ion ANC (TWS)", category: "Earbuds" },
  { sku: "SKU_003", name: "Lunar Pro (Smartwatch)", category: "Wearables" },
  { sku: "SKU_011", name: "Rockerz 330 (Neckband)", category: "Earbuds" },
  { sku: "SKU_022", name: "Airdopes 161 (TWS)", category: "Earbuds" },
  { sku: "SKU_017", name: "Airdopes 131 (TWS)", category: "Earbuds" },
  { sku: "SKU_009", name: "Stone 180 (Speaker)", category: "Speakers" },
  { sku: "SKU_044", name: "Rockerz 650 Pro (Headphones)", category: "Headphones" },
  { sku: "SKU_046", name: "Immortal 201 (Gaming TWS)", category: "Wearables" },
  { sku: "SKU_027", name: "Airdopes 441 Pro (TWS)", category: "Earbuds" },
  { sku: "SKU_050", name: "Rockerz 510 (Neckband)", category: "Earbuds" },
];

const pharmaNodes = [
  "WH_North — Delhi Hub",
  "WH_South — Chennai DC",
  "WH_West — Mumbai Hub",
  "Amazon FC — Bhiwandi",
  "Flipkart WH — Bengaluru",
  "D2C Fulfillment — Pune",
  "Distributor Hub — Ahmedabad",
  "Retail Partner — Hyderabad",
  "Amazon FC — Delhi NCR",
  "Flipkart WH — Kolkata",
];

const plannerNames = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Reddy",
  "Vikram Singh", "Ananya Gupta", "Suresh Menon", "Deepika Nair",
  "Arun Joshi", "Kavita Rao", "Sanjay Mehta", "Pooja Iyer"
];

const approverNames = [
  "Dr. Raman Khanna", "Sunita Agarwal", "Prakash Verma", "Dr. Meera Jain",
  "Anil Kapoor", "Nirmala Sitharaman", "Rajiv Gandhi", "Dr. Shyam Sundar"
];

const generateWeeklyForecast = (baseValue: number, weekIndex: number) => {
  const seasonalFactors = [0.85, 0.82, 0.88, 0.92, 0.95, 0.90, 1.15, 1.05, 0.95, 1.55, 1.20, 1.10];
  return Math.round(baseValue * seasonalFactors[weekIndex] * (0.9 + Math.random() * 0.2));
};

const generateLastYearValue = (currentForecast: number, weekIndex: number) => {
  // Last year values are typically 10-25% lower (business growth), with slight variation
  const growthFactors = [0.78, 0.80, 0.75, 0.82, 0.77, 0.79, 0.85, 0.81, 0.76, 0.83, 0.80, 0.78];
  return Math.round(currentForecast * growthFactors[weekIndex] * (0.95 + Math.random() * 0.1));
};

const sampleForecastData: ForecastRow[] = pharmaSKUs.map((sku, index) => {
  const baseValue = 500 + Math.floor(Math.random() * 1500);
  const nodeIndex = index % pharmaNodes.length;
  const channels: ("Online" | "Retail" | "B2B" | "Direct")[] = ["Online", "Retail", "B2B", "Direct"];
  const channel = channels[index % 4];
  const owner = plannerNames[index % plannerNames.length];
  const approver = approverNames[index % approverNames.length];
  
  const weeks: { [key: string]: { forecast: number; plannerInput?: number; reason?: string; lastYear: number } } = {};
  for (let w = 1; w <= 12; w++) {
    const forecast = generateWeeklyForecast(baseValue, w - 1);
    const lastYear = generateLastYearValue(forecast, w - 1);
    weeks[`week${w}`] = { forecast, lastYear };
  }
  
  const boatReasons = [
    "Big Billion Days surge expected",
    "Prime Day demand boost",
    "Competitor launch impact — JBL Wave Beam",
    "D2C promotion campaign uplift",
    "Digital marketing campaign uplift",
    "Supply constraint — chipset shortage",
    "Warehouse capacity rebalance",
    "Diwali gifting season pre-position",
    "New product launch cannibalization",
    "Flipkart flash sale allocation"
  ];
  
  const adjustmentWeeks = [3, 5, 7, 9, 11];
  const adjustWeek = adjustmentWeeks[index % adjustmentWeeks.length];
  const weekKey = `week${adjustWeek}`;
  const currentWeekData = weeks[weekKey];
  const currentForecast = currentWeekData.forecast;
  const adjustmentFactor = 1 + (Math.random() * 0.3 - 0.1);
  weeks[weekKey] = {
    forecast: currentForecast,
    plannerInput: Math.round(currentForecast * adjustmentFactor),
    reason: boatReasons[index % boatReasons.length],
    lastYear: currentWeekData.lastYear
  };
  
  const isApproved = Math.random() > 0.15;
  
  return {
    id: String(index + 1),
    sku: sku.sku,
    productName: sku.name,
    category: sku.category,
    node: pharmaNodes[nodeIndex],
    channel,
    owner,
    ...weeks,
    label: "Add Labels",
    remarks: `${sku.category} - ${channel}`,
    approvalStatus: isApproved ? "approved" : "rejected",
    approverRole: isApproved ? "Regional Manager" : "Supply Chain Lead",
    approvalDetails: isApproved
      ? {
          approvedBy: approver,
          approvedAt: "2025-10-15 14:30",
          remarks: "Forecast aligned with seasonal demand and sale event patterns"
        }
      : {
          rejectedBy: approver,
          rejectedAt: "2025-10-14 16:45",
          remarks: "Requires adjustment for supply constraints"
        },
    allRemarks: [
      { date: "2025-10-12 10:00", user: owner, comment: `Adjusted ${sku.category} forecast based on platform sale calendar` },
      { date: "2025-10-13 14:15", user: approver, comment: isApproved ? "Reviewed — aligned with search trends & competitor data" : "Needs revision — check warehouse capacity" },
      { date: "2025-10-15 14:30", user: approver, comment: isApproved ? "Approved with seasonal adjustments" : "Pending further review" }
    ]
  } as ForecastRow;
});

// Helper to get the effective value for a week
const getWeekValue = (row: ForecastRow, weekIndex: number): number => {
  const weekKey = `week${weekIndex}` as keyof ForecastRow;
  const weekData = row[weekKey] as any;
  return weekData.plannerInput !== undefined ? weekData.plannerInput : weekData.forecast;
};

// Aggregate week values for a group of rows
const aggregateWeeks = (rows: ForecastRow[]): number[] => {
  return Array.from({ length: 12 }, (_, i) =>
    rows.reduce((sum, row) => sum + getWeekValue(row, i + 1), 0)
  );
};

const categoryColors: Record<string, string> = {
  Earbuds: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  Speakers: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Headphones: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Wearables: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
};

export const CollaborativeForecastTable: React.FC = () => {
  const [rows, setRows] = useState<ForecastRow[]>(sampleForecastData);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterSKU, setFilterSKU] = useState<string>("All");
  const [filterNode, setFilterNode] = useState<string>("All");
  const [filterChannel, setFilterChannel] = useState<string>("All");
  const [sortKey, setSortKey] = useState<keyof ForecastRow | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Earbuds: true, Speakers: true, Headphones: true, Wearables: true
  });
  
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    rowId: string;
    week: string;
    weekIndex: number;
    currentValue: number;
    lastYear: number;
    plannerInput: string;
    reason: string;
    productName: string;
    sku: string;
  }>({ open: false, rowId: "", week: "", weekIndex: 0, currentValue: 0, lastYear: 0, plannerInput: "", reason: "", productName: "", sku: "" });

  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  const [remarksDialog, setRemarksDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  const toggleAll = (checked: boolean) => setSelected(checked ? filteredSorted.map((r) => r.id) : []);
  const toggleOne = (id: string, checked: boolean) => setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredSorted = useMemo(() => {
    let data = rows.filter((r) =>
      [r.sku, r.productName, r.node, r.channel, r.owner].some((v) => v.toLowerCase().includes(search.toLowerCase()))
    );
    if (filterSKU !== "All") data = data.filter((r) => r.sku.includes(filterSKU));
    if (filterNode !== "All") data = data.filter((r) => r.node.includes(filterNode));
    if (filterChannel !== "All") data = data.filter((r) => r.channel === (filterChannel as ForecastRow["channel"]));
    
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey]! as any;
        const bv = b[sortKey]! as any;
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return data;
  }, [rows, search, filterSKU, filterNode, filterChannel, sortKey, sortDir]);

  // Group by category
  const groupedData = useMemo(() => {
    const groups: Record<string, ForecastRow[]> = {};
    filteredSorted.forEach(row => {
      if (!groups[row.category]) groups[row.category] = [];
      groups[row.category].push(row);
    });
    return groups;
  }, [filteredSorted]);

  const categoryOrder = ["Earbuds", "Speakers", "Headphones", "Wearables"];
  const grandTotals = useMemo(() => aggregateWeeks(filteredSorted), [filteredSorted]);

  const sortBy = (key: keyof ForecastRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleEditClick = (rowId: string, week: string, weekIndex: number, currentValue: number, lastYear: number, productName: string, sku: string, plannerInput?: number, reason?: string) => {
    setEditDialog({
      open: true,
      rowId,
      week,
      weekIndex,
      currentValue,
      lastYear,
      plannerInput: plannerInput?.toString() || "",
      reason: reason || "",
      productName,
      sku
    });
  };

  const handleSaveEdit = () => {
    if (!editDialog.plannerInput.trim()) {
      toast.error("Please enter a planner input value");
      return;
    }
    if (!editDialog.reason.trim()) {
      toast.error("Please provide a reason for the edit");
      return;
    }

    setRows(prev => prev.map(row => {
      if (row.id === editDialog.rowId) {
        const weekData = row[editDialog.week as keyof ForecastRow] as any;
        return {
          ...row,
          [editDialog.week]: {
            ...weekData,
            plannerInput: parseFloat(editDialog.plannerInput),
            reason: editDialog.reason
          }
        };
      }
      return row;
    }));

    setEditDialog({ open: false, rowId: "", week: "", weekIndex: 0, currentValue: 0, lastYear: 0, plannerInput: "", reason: "", productName: "", sku: "" });
    toast.success("Forecast updated successfully");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  // Render a category group header row (left fixed)
  const renderCategoryHeaderLeft = (category: string, catRows: ForecastRow[]) => {
    const isExpanded = expandedCategories[category];
    return (
      <tr
        key={`cat-${category}-left`}
        className="bg-muted/40 border-b cursor-pointer hover:bg-muted/60 transition-colors"
        onClick={() => toggleCategory(category)}
      >
        <td className="p-3" colSpan={6}>
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <Badge variant="outline" className={`text-xs font-semibold ${categoryColors[category] || ""}`}>
              {category}
            </Badge>
            <span className="text-xs font-semibold text-foreground">{catRows.length} SKUs</span>
            <span className="text-xs text-muted-foreground ml-1">
              — Total: ₹{aggregateWeeks(catRows).reduce((a, b) => a + b, 0).toLocaleString()} units (12W)
            </span>
          </div>
        </td>
      </tr>
    );
  };

  // Render category header for the scrollable middle
  const renderCategoryHeaderMiddle = (category: string, catRows: ForecastRow[]) => {
    const totals = aggregateWeeks(catRows);
    const isExpanded = expandedCategories[category];
    return (
      <tr
        key={`cat-${category}-mid`}
        className="bg-muted/40 border-b cursor-pointer hover:bg-muted/60 transition-colors"
        onClick={() => toggleCategory(category)}
      >
        {totals.map((total, i) => (
          <td key={i} className="p-2 text-center border-l">
            <span className="text-xs font-bold text-foreground">{total.toLocaleString()}</span>
          </td>
        ))}
      </tr>
    );
  };

  // Render category header for the fixed right
  const renderCategoryHeaderRight = (category: string, catRows: ForecastRow[]) => {
    const approved = catRows.filter(r => r.approvalStatus === "approved").length;
    return (
      <tr
        key={`cat-${category}-right`}
        className="bg-muted/40 border-b cursor-pointer hover:bg-muted/60 transition-colors"
        onClick={() => toggleCategory(category)}
      >
        <td className="p-3 text-center text-xs text-muted-foreground">—</td>
        <td className="p-3 text-center">
          <span className="text-xs font-medium text-muted-foreground">{approved}/{catRows.length}</span>
        </td>
      </tr>
    );
  };

  // Build render order for each section
  const buildRenderItems = () => {
    const leftItems: React.ReactNode[] = [];
    const midItems: React.ReactNode[] = [];
    const rightItems: React.ReactNode[] = [];

    categoryOrder.forEach(category => {
      const catRows = groupedData[category];
      if (!catRows || catRows.length === 0) return;

      leftItems.push(renderCategoryHeaderLeft(category, catRows));
      midItems.push(renderCategoryHeaderMiddle(category, catRows));
      rightItems.push(renderCategoryHeaderRight(category, catRows));

      if (expandedCategories[category]) {
        catRows.forEach(r => {
          const initials = getInitials(r.owner);
          leftItems.push(
            <tr key={`${r.id}-fixed`} className="border-b hover:bg-muted/30 h-16">
              <td className="p-3">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  checked={selected.includes(r.id)}
                  onChange={(e) => toggleOne(r.id, e.target.checked)}
                  aria-label={`Select row for ${r.sku}`}
                />
              </td>
              <td className="p-3 font-medium text-xs">{r.sku}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {productImageMap[r.sku] && (
                    <img 
                      src={productImageMap[r.sku]} 
                      alt={r.productName}
                      className="w-8 h-8 rounded object-cover border flex-shrink-0"
                    />
                  )}
                  <span className="text-sm line-clamp-2">{r.productName}</span>
                </div>
              </td>
              <td className="p-3 text-sm">{r.node}</td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs">{r.channel}</Badge>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" alt={r.owner} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{r.owner}</span>
                </div>
              </td>
            </tr>
          );

          midItems.push(
            <tr key={`${r.id}-weeks`} className="border-b hover:bg-muted/30 h-16">
              {Array.from({ length: 12 }, (_, i) => {
                const weekKey = `week${i + 1}` as keyof ForecastRow;
                const weekData = r[weekKey] as any;
                const hasEdit = weekData.plannerInput !== undefined;
                const displayValue = hasEdit ? weekData.plannerInput : weekData.forecast;
                
                return (
                  <td key={`${r.id}-week-${i + 1}`} className="p-2 text-center border-l">
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${hasEdit ? 'text-primary' : 'text-foreground'}`}>
                        {displayValue.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditClick(r.id, weekKey, weekData.forecast, weekData.plannerInput, weekData.reason)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {hasEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground"
                            title={weekData.reason || "No reason provided"}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          );

          rightItems.push(
            <tr key={`${r.id}-approval`} className="border-b hover:bg-muted/30 h-16">
              <td className="p-3 text-center">
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  onClick={() => setRemarksDialog({ open: true, data: r })}
                >
                  View ({r.allRemarks?.length || 0})
                </Button>
              </td>
              <td className="p-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex justify-center cursor-pointer transition-transform hover:scale-110" 
                      onClick={() => setApprovalDialog({ open: true, data: r })}
                    >
                      {r.approvalStatus === "approved" ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{r.approverRole || "Approver"}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.approvalStatus === "approved" ? "Approved" : "Rejected"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </td>
            </tr>
          );
        });
      }
    });

    return { leftItems, midItems, rightItems };
  };

  const { leftItems, midItems, rightItems } = buildRenderItems();

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={filterSKU} onValueChange={setFilterSKU}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All SKUs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All SKUs</SelectItem>
                <SelectItem value="SKU_001">Airdopes 141</SelectItem>
                <SelectItem value="SKU_005">Stone 352</SelectItem>
                <SelectItem value="SKU_007">Rockerz 255 Pro+</SelectItem>
                <SelectItem value="SKU_021">Rockerz 450</SelectItem>
                <SelectItem value="SKU_049">Nirvana Ion ANC</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterNode} onValueChange={setFilterNode}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="WH_North">WH_North — Delhi Hub</SelectItem>
                <SelectItem value="WH_South">WH_South — Chennai DC</SelectItem>
                <SelectItem value="WH_West">WH_West — Mumbai Hub</SelectItem>
                <SelectItem value="Amazon">Amazon FC</SelectItem>
                <SelectItem value="Flipkart">Flipkart WH</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Channels</SelectItem>
                <SelectItem value="Online">Amazon / Flipkart</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="B2B">Distributor</SelectItem>
                <SelectItem value="Direct">D2C</SelectItem>
              </SelectContent>
            </Select>

            {/* Expand / Collapse All */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allExpanded = categoryOrder.every(c => expandedCategories[c]);
                const newState: Record<string, boolean> = {};
                categoryOrder.forEach(c => newState[c] = !allExpanded);
                setExpandedCategories(newState);
              }}
            >
              {categoryOrder.every(c => expandedCategories[c]) ? (
                <><ChevronDown className="w-4 h-4 mr-1" /> Collapse All</>
              ) : (
                <><ChevronRight className="w-4 h-4 mr-1" /> Expand All</>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56" />
            </div>
          </div>
        </div>

        {/* Table */}
        <Card className="border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              Collaborative Forecast Workbook
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                <div className="text-sm font-normal text-muted-foreground">
                  {selected.length > 0 && `${selected.length} rows selected`}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex">
              {/* Fixed Left */}
              <div className="flex-shrink-0 border-r bg-background">
                <table className="table-fixed">
                  <thead className="bg-muted/50 border-b">
                    <tr className="text-xs h-12">
                      <th className="w-10 p-3 align-middle">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          onChange={(e) => toggleAll(e.target.checked)}
                          checked={selected.length > 0 && selected.length === filteredSorted.length}
                          aria-label="Select all rows"
                        />
                      </th>
                      <th className="text-left p-3 cursor-pointer hover:bg-muted w-[100px]" onClick={() => sortBy("sku")}>
                        SKU
                      </th>
                      <th className="text-left p-3 w-[160px]">Product</th>
                      <th className="text-left p-3 cursor-pointer hover:bg-muted w-[140px]" onClick={() => sortBy("node")}>
                        Store
                      </th>
                      <th className="text-left p-3 cursor-pointer hover:bg-muted w-[80px]" onClick={() => sortBy("channel")}>
                        Channel
                      </th>
                      <th className="text-left p-3 cursor-pointer hover:bg-muted w-[140px]" onClick={() => sortBy("owner")}>
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leftItems}
                    {/* Grand Total Footer */}
                    <tr className="bg-primary/10 border-t-2 border-primary/30 font-bold h-14">
                      <td className="p-3" colSpan={6}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Grand Total</span>
                          <Badge className="text-xs bg-primary/20 text-primary border-primary/30">{filteredSorted.length} SKUs</Badge>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Scrollable Middle */}
              <div className="flex-1 overflow-x-auto">
                <table className="table-fixed">
                  <thead className="bg-muted/50 border-b">
                    <tr className="text-xs h-12">
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={`week-${i + 1}`} className="text-center p-2 w-[100px] border-l">
                          <div className="text-xs font-medium">Week {i + 1}</div>
                          <div className="text-xs text-muted-foreground">Forecast | Input</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {midItems}
                    {/* Grand Total Footer */}
                    <tr className="bg-primary/10 border-t-2 border-primary/30 font-bold h-14">
                      {grandTotals.map((total, i) => (
                        <td key={i} className="p-2 text-center border-l">
                          <span className="text-sm font-bold text-primary">{total.toLocaleString()}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fixed Right */}
              <div className="flex-shrink-0 border-l bg-background">
                <table className="table-fixed">
                  <thead className="bg-muted/50 border-b">
                    <tr className="text-xs h-12">
                      <th className="text-center p-3 w-[120px]">Remarks</th>
                      <th className="text-center p-3 w-[120px]">Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rightItems}
                    {/* Grand Total Footer */}
                    <tr className="bg-primary/10 border-t-2 border-primary/30 font-bold h-14">
                      <td className="p-3 text-center text-xs text-muted-foreground">—</td>
                      <td className="p-3 text-center">
                        <span className="text-xs font-bold text-foreground">
                          {filteredSorted.filter(r => r.approvalStatus === "approved").length}/{filteredSorted.length}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>{selected.length > 0 ? `${selected.length} selected` : `${filteredSorted.length} rows across ${Object.keys(groupedData).length} categories`}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Forecast Value</DialogTitle>
            <DialogDescription>
              Modify the forecast for {editDialog.week} and provide a reason for the change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Original Forecast: {editDialog.currentValue.toLocaleString()}
              </label>
              <Input
                type="number"
                placeholder="Enter new forecast value"
                value={editDialog.plannerInput}
                onChange={(e) => setEditDialog(prev => ({ ...prev, plannerInput: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reason for Change *
              </label>
              <Textarea
                placeholder="Explain why you're adjusting this forecast..."
                value={editDialog.reason}
                onChange={(e) => setEditDialog(prev => ({ ...prev, reason: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialog(prev => ({ ...prev, open: false }))}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ open, data: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>
              Approval information for {approvalDialog.data?.sku}
            </DialogDescription>
          </DialogHeader>
          {approvalDialog.data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">Status:</span>
                <Badge 
                  variant={approvalDialog.data.approvalStatus === "approved" ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {approvalDialog.data.approvalStatus === "approved" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {approvalDialog.data.approvalStatus.charAt(0).toUpperCase() + approvalDialog.data.approvalStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">Role:</span>
                <span className="text-sm">{approvalDialog.data.approverRole || "N/A"}</span>
              </div>
              {approvalDialog.data.approvalDetails?.approvedBy && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Approval Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved by:</span>
                      <span>{approvalDialog.data.approvalDetails.approvedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved at:</span>
                      <span>{approvalDialog.data.approvalDetails.approvedAt}</span>
                    </div>
                  </div>
                </div>
              )}
              {approvalDialog.data.approvalDetails?.rejectedBy && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Rejection Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rejected by:</span>
                      <span>{approvalDialog.data.approvalDetails.rejectedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rejected at:</span>
                      <span>{approvalDialog.data.approvalDetails.rejectedAt}</span>
                    </div>
                  </div>
                </div>
              )}
              {approvalDialog.data.approvalDetails?.remarks && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Remarks</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {approvalDialog.data.approvalDetails.remarks}
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setApprovalDialog({ open: false, data: null })}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remarks Dialog */}
      <Dialog open={remarksDialog.open} onOpenChange={(open) => setRemarksDialog({ open, data: null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>All Remarks</DialogTitle>
            <DialogDescription>
              Complete remarks history for {remarksDialog.data?.sku}
            </DialogDescription>
          </DialogHeader>
          {remarksDialog.data && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {remarksDialog.data.allRemarks && remarksDialog.data.allRemarks.length > 0 ? (
                remarksDialog.data.allRemarks.map((remark, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-md space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{remark.user}</span>
                      <span className="text-xs text-muted-foreground">{remark.date}</span>
                    </div>
                    <p className="text-sm text-foreground">{remark.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No remarks available for this SKU
                </p>
              )}
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setRemarksDialog({ open: false, data: null })}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
};

export default CollaborativeForecastTable;