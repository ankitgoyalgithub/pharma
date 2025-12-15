import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, Search, Save, Edit3, MessageSquare, Maximize, Minimize, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";

// Import product images
import product1 from "@/assets/product-1.webp";
import product2 from "@/assets/product-2.webp";
import product3 from "@/assets/product-3.webp";
import product4 from "@/assets/product-4.webp";
import product5 from "@/assets/product-5.webp";
import product6 from "@/assets/product-6.webp";
import product7 from "@/assets/product-7.webp";
import product8 from "@/assets/product-8.webp";

const productImages = [product1, product2, product3, product4, product5, product6, product7, product8];

interface ForecastRow {
  id: string;
  sku: string;
  productName: string;
  imageUrl: string;
  node: string;
  channel: "Online" | "Retail" | "B2B" | "Direct";
  owner: string;
  week1: { forecast: number; plannerInput?: number; reason?: string };
  week2: { forecast: number; plannerInput?: number; reason?: string };
  week3: { forecast: number; plannerInput?: number; reason?: string };
  week4: { forecast: number; plannerInput?: number; reason?: string };
  week5: { forecast: number; plannerInput?: number; reason?: string };
  week6: { forecast: number; plannerInput?: number; reason?: string };
  week7: { forecast: number; plannerInput?: number; reason?: string };
  week8: { forecast: number; plannerInput?: number; reason?: string };
  week9: { forecast: number; plannerInput?: number; reason?: string };
  week10: { forecast: number; plannerInput?: number; reason?: string };
  week11: { forecast: number; plannerInput?: number; reason?: string };
  week12: { forecast: number; plannerInput?: number; reason?: string };
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

// Pharma SKUs based on actual data from sku_master.csv
const pharmaSKUs = [
  { sku: "SKU001", name: "Paracetamol 500mg Tablet", category: "Analgesic" },
  { sku: "SKU002", name: "Azithromycin 500mg Tablet", category: "Antibiotic" },
  { sku: "SKU003", name: "Cetirizine 10mg Tablet", category: "Antihistamine" },
  { sku: "SKU004", name: "Insulin Glargine 100U/ml", category: "Diabetes Care" },
  { sku: "SKU005", name: "Amoxicillin 500mg Capsule", category: "Antibiotic" },
  { sku: "SKU006", name: "ORS Sachet (WHO Formula)", category: "Rehydration" },
  { sku: "SKU007", name: "Salbutamol 100mcg Inhaler", category: "Respiratory" },
  { sku: "SKU008", name: "Cholecalciferol 60K IU", category: "Vitamin" },
  { sku: "SKU009", name: "Ceftriaxone 1g Injection", category: "Antibiotic" },
  { sku: "SKU010", name: "Pantoprazole 40mg Tablet", category: "GI Care" },
  { sku: "SKU011", name: "Metformin 500mg Tablet", category: "Diabetes Care" },
  { sku: "SKU012", name: "Atorvastatin 10mg Tablet", category: "Cardiac" },
  { sku: "SKU013", name: "Omeprazole 20mg Capsule", category: "GI Care" },
  { sku: "SKU014", name: "Losartan 50mg Tablet", category: "Cardiac" },
  { sku: "SKU015", name: "Montelukast 10mg Tablet", category: "Respiratory" },
  { sku: "SKU016", name: "Dolo 650mg Tablet", category: "Analgesic" },
  { sku: "SKU017", name: "Augmentin 625mg Tablet", category: "Antibiotic" },
  { sku: "SKU018", name: "Pan-D Capsule", category: "GI Care" },
  { sku: "SKU019", name: "Telmisartan 40mg Tablet", category: "Cardiac" },
  { sku: "SKU020", name: "Crocin Advance 500mg", category: "Analgesic" },
];

// India Pharma Distribution Nodes
const pharmaNodes = [
  "Mumbai Central WH",
  "Delhi North Hub",
  "Chennai Distribution",
  "Kolkata East Hub",
  "Bengaluru South WH",
  "Ahmedabad West Hub",
  "Pune Regional WH",
  "Hyderabad Hub",
  "Jaipur North WH",
  "Lucknow Distribution",
  "Apollo Hospitals Mumbai",
  "Fortis Healthcare Delhi",
  "Max Hospital Chain",
  "Medplus Retail Chain",
  "Apollo Pharmacy Network",
  "Netmeds E-Pharmacy",
  "PharmEasy Hub",
  "1mg Distribution",
  "Govt Hospital Tender",
  "CGHS Distribution"
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

// Generate realistic forecast data based on pharma demand patterns
const generateWeeklyForecast = (baseValue: number, weekIndex: number) => {
  // Pharma seasonality adjustments (monsoon, winter flu season)
  const seasonalFactors = [0.95, 0.92, 0.98, 1.02, 1.18, 1.25, 1.22, 1.15, 1.08, 0.98, 0.96, 1.05];
  return Math.round(baseValue * seasonalFactors[weekIndex] * (0.9 + Math.random() * 0.2));
};

const sampleForecastData: ForecastRow[] = pharmaSKUs.map((sku, index) => {
  const baseValue = 500 + Math.floor(Math.random() * 1500); // 500-2000 units base
  const nodeIndex = index % pharmaNodes.length;
  const channels: ("Online" | "Retail" | "B2B" | "Direct")[] = ["Online", "Retail", "B2B", "Direct"];
  const channel = channels[index % 4];
  const owner = plannerNames[index % plannerNames.length];
  const approver = approverNames[index % approverNames.length];
  const imageUrl = productImages[index % productImages.length];
  
  // Generate 12 weeks of forecast data
  const weeks: { [key: string]: { forecast: number; plannerInput?: number; reason?: string } } = {};
  for (let w = 1; w <= 12; w++) {
    const forecast = generateWeeklyForecast(baseValue, w - 1);
    weeks[`week${w}`] = { forecast };
  }
  
  // Add planner adjustments for some weeks with pharma-relevant reasons
  const pharmaReasons = [
    "Monsoon outbreak surge expected",
    "Flu season demand boost",
    "Generic drug launch impact",
    "Hospital tender fulfillment",
    "E-pharmacy promotion campaign",
    "API supply constraint adjustment",
    "Cold chain capacity limitation",
    "Medical conference Rx uplift",
    "Disease outbreak pre-positioning",
    "Chronic care refill cycle peak"
  ];
  
  // Add 1-2 planner adjustments per SKU
  const adjustmentWeeks = [3, 5, 7, 9, 11];
  const adjustWeek = adjustmentWeeks[index % adjustmentWeeks.length];
  const weekKey = `week${adjustWeek}`;
  const currentForecast = weeks[weekKey].forecast;
  const adjustmentFactor = 1 + (Math.random() * 0.3 - 0.1); // -10% to +20%
  weeks[weekKey] = {
    forecast: currentForecast,
    plannerInput: Math.round(currentForecast * adjustmentFactor),
    reason: pharmaReasons[index % pharmaReasons.length]
  };
  
  const isApproved = Math.random() > 0.15; // 85% approval rate
  
  return {
    id: String(index + 1),
    sku: sku.sku,
    productName: sku.name,
    imageUrl,
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
          approvedAt: "2024-10-15 14:30",
          remarks: "Forecast aligned with seasonal illness patterns and historical data"
        }
      : {
          rejectedBy: approver,
          rejectedAt: "2024-10-14 16:45",
          remarks: "Requires adjustment for API supply constraints"
        },
    allRemarks: [
      { date: "2024-10-12 10:00", user: owner, comment: `Adjusted ${sku.category} forecast based on disease seasonality` },
      { date: "2024-10-13 14:15", user: approver, comment: isApproved ? "Reviewed - aligned with outbreak tracking data" : "Needs revision - check cold chain capacity" },
      { date: "2024-10-15 14:30", user: approver, comment: isApproved ? "Approved with seasonal adjustments" : "Pending further review" }
    ]
  } as ForecastRow;
});

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
  
  // Edit dialog states
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    rowId: string;
    week: string;
    currentValue: number;
    plannerInput: string;
    reason: string;
  }>({ open: false, rowId: "", week: "", currentValue: 0, plannerInput: "", reason: "" });

  // Approval dialog states
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  // Remarks dialog states
  const [remarksDialog, setRemarksDialog] = useState<{
    open: boolean;
    data: ForecastRow | null;
  }>({ open: false, data: null });

  const toggleAll = (checked: boolean) => setSelected(checked ? filteredSorted.map((r) => r.id) : []);
  const toggleOne = (id: string, checked: boolean) => setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

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

  const sortBy = (key: keyof ForecastRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleEditClick = (rowId: string, week: string, currentValue: number, plannerInput?: number, reason?: string) => {
    setEditDialog({
      open: true,
      rowId,
      week,
      currentValue,
      plannerInput: plannerInput?.toString() || "",
      reason: reason || ""
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

    setEditDialog({ open: false, rowId: "", week: "", currentValue: 0, plannerInput: "", reason: "" });
    toast.success("Forecast updated successfully");
  };

  const exportCSV = () => {
    const headers = [
      "SKU",
      "Node",
      "Channel", 
      "Owner",
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Forecast`),
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Planner Input`),
      ...Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Reason`),
    ];
    
    const rowsCsv = filteredSorted.map((r) => {
      const forecastValues = [];
      const plannerValues = [];
      const reasonValues = [];
      
      for (let i = 1; i <= 12; i++) {
        const weekKey = `week${i}` as keyof ForecastRow;
        const weekData = r[weekKey] as any;
        forecastValues.push(weekData.forecast);
        plannerValues.push(weekData.plannerInput || "");
        reasonValues.push(weekData.reason || "");
      }
      
      return [r.sku, r.node, r.channel, r.owner, ...forecastValues, ...plannerValues, ...reasonValues].join(",");
    }).join("\n");
    
    const blob = new Blob([[headers.join(","), "\n", rowsCsv].join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collaborative-forecast-workbook.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
        {/* Toolbar with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filterSKU} onValueChange={setFilterSKU}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All SKUs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All SKUs</SelectItem>
              <SelectItem value="SKU001">Paracetamol 500mg</SelectItem>
              <SelectItem value="SKU002">Azithromycin 500mg</SelectItem>
              <SelectItem value="SKU004">Insulin Glargine</SelectItem>
              <SelectItem value="SKU007">Salbutamol Inhaler</SelectItem>
              <SelectItem value="SKU010">Pantoprazole 40mg</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterNode} onValueChange={setFilterNode}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Locations</SelectItem>
              <SelectItem value="Mumbai Central WH">Mumbai Central WH</SelectItem>
              <SelectItem value="Delhi North Hub">Delhi North Hub</SelectItem>
              <SelectItem value="Apollo Hospitals">Apollo Hospitals</SelectItem>
              <SelectItem value="Netmeds">Netmeds E-Pharmacy</SelectItem>
              <SelectItem value="Govt Hospital">Govt Hospital Tender</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Channels</SelectItem>
              <SelectItem value="Online">E-Pharmacy</SelectItem>
              <SelectItem value="Retail">Retail Pharmacy</SelectItem>
              <SelectItem value="B2B">Hospital</SelectItem>
              <SelectItem value="Direct">Distributor</SelectItem>
            </SelectContent>
          </Select>
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
            {/* Fixed Left Columns */}
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
                    <th className="text-center p-3 w-[60px]">
                      Image
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[100px]" onClick={() => sortBy("sku")}>
                      SKU
                    </th>
                    <th className="text-left p-3 w-[160px]">
                      Product
                    </th>
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
                  {filteredSorted.map((r) => {
                    const initials = getInitials(r.owner);
                    return (
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
                        <td className="p-2">
                          <HoverCard openDelay={200} closeDelay={100}>
                            <HoverCardTrigger asChild>
                              <img 
                                src={r.imageUrl} 
                                alt={r.productName}
                                className="w-10 h-10 object-cover rounded-md border border-border cursor-pointer transition-transform hover:scale-105"
                              />
                            </HoverCardTrigger>
                            <HoverCardContent side="right" align="start" className="w-64 p-2">
                              <div className="space-y-2">
                                <img 
                                  src={r.imageUrl} 
                                  alt={r.productName}
                                  className="w-full h-auto rounded-md object-cover"
                                />
                                <div className="text-center">
                                  <p className="text-sm font-medium">{r.productName}</p>
                                  <p className="text-xs text-muted-foreground">{r.sku}</p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </td>
                        <td className="p-3 font-medium text-xs">{r.sku}</td>
                        <td className="p-3">
                          <span className="text-sm line-clamp-2">{r.productName}</span>
                        </td>
                        <td className="p-3 text-sm">{r.node}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {r.channel}
                          </Badge>
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
                  })}
                </tbody>
              </table>
            </div>

            {/* Scrollable Middle Section */}
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
                  {filteredSorted.map((r) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fixed Right Columns */}
            <div className="flex-shrink-0 border-l bg-background">
              <table className="table-fixed">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-xs h-12">
                    <th className="text-center p-3 w-[120px]">Remarks</th>
                    <th className="text-center p-3 w-[120px]">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((r) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>{selected.length > 0 ? `${selected.length} selected` : `${filteredSorted.length} rows`}</div>
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

      {/* Approval Flow Dialog */}
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