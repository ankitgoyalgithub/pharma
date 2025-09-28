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
import { Download, MoreHorizontal, Search, Save, Edit3, MessageSquare, Maximize, Minimize } from "lucide-react";
import { toast } from "sonner";

interface ForecastRow {
  id: string;
  sku: string;
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
  approvalStatus: "pending" | "approved" | "rejected";
  approvalDetails?: {
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    remarks?: string;
  };
}

const sampleForecastData: ForecastRow[] = [
  { 
    id: "1", 
    sku: "SKU001-WGT-A", 
    node: "Delhi-North", 
    channel: "Online", 
    owner: "Aman Gupta",
    week1: { forecast: 2400 },
    week2: { forecast: 2550 },
    week3: { forecast: 2350, plannerInput: 2500, reason: "Marketing campaign launch" },
    week4: { forecast: 2200 },
    week5: { forecast: 2450 },
    week6: { forecast: 2600 },
    week7: { forecast: 2380 },
    week8: { forecast: 2420 },
    week9: { forecast: 2540 },
    week10: { forecast: 2610 },
    week11: { forecast: 2480 },
    week12: { forecast: 2390 },
    label: "Add Labels",
    remarks: "Seasonal adjustments",
    approvalStatus: "approved",
    approvalDetails: {
      approvedBy: "Sarah Johnson",
      approvedAt: "2024-09-27 14:30",
      remarks: "Looks good with seasonal adjustments"
    }
  },
  { 
    id: "2", 
    sku: "SKU002-WGT-B", 
    node: "Mumbai-West", 
    channel: "Retail", 
    owner: "Neha Rao",
    week1: { forecast: 1800 },
    week2: { forecast: 1920 },
    week3: { forecast: 1750 },
    week4: { forecast: 1880 },
    week5: { forecast: 1960, plannerInput: 2100, reason: "Festival season demand" },
    week6: { forecast: 2050 },
    week7: { forecast: 1890 },
    week8: { forecast: 1940 },
    week9: { forecast: 2020 },
    week10: { forecast: 2110 },
    week11: { forecast: 1980 },
    week12: { forecast: 1920 },
    label: "Add Labels",
    remarks: "Festival impact",
    approvalStatus: "pending",
    approvalDetails: {
      remarks: "Awaiting manager approval"
    }
  },
  { 
    id: "3", 
    sku: "SKU003-WGT-C", 
    node: "Bangalore-South", 
    channel: "B2B", 
    owner: "Priya Shah",
    week1: { forecast: 3200 },
    week2: { forecast: 3100 },
    week3: { forecast: 3350 },
    week4: { forecast: 3180 },
    week5: { forecast: 3280 },
    week6: { forecast: 3420 },
    week7: { forecast: 3250 },
    week8: { forecast: 3380, plannerInput: 3200, reason: "Supply chain constraints" },
    week9: { forecast: 3460 },
    week10: { forecast: 3520 },
    week11: { forecast: 3390 },
    week12: { forecast: 3310 },
    label: "Add Labels",
    remarks: "Supply constraints",
    approvalStatus: "rejected",
    approvalDetails: {
      rejectedBy: "Mike Chen",
      rejectedAt: "2024-09-26 16:45",
      remarks: "Supply chain analysis doesn't support this forecast"
    }
  },
  { 
    id: "4", 
    sku: "SKU004-WGT-D", 
    node: "Chennai-South", 
    channel: "Direct", 
    owner: "Suresh I.",
    week1: { forecast: 1600 },
    week2: { forecast: 1720 },
    week3: { forecast: 1580 },
    week4: { forecast: 1650 },
    week5: { forecast: 1780 },
    week6: { forecast: 1840 },
    week7: { forecast: 1690 },
    week8: { forecast: 1750 },
    week9: { forecast: 1820 },
    week10: { forecast: 1890 },
    week11: { forecast: 1760, plannerInput: 1900, reason: "New client onboarding" },
    week12: { forecast: 1710 },
    label: "Add Labels",
    remarks: "Client expansion",
    approvalStatus: "approved",
    approvalDetails: {
      approvedBy: "Emma Davis",
      approvedAt: "2024-09-28 10:15",
      remarks: "Approved based on confirmed client expansion"
    }
  },
  { 
    id: "5", 
    sku: "SKU005-WGT-E", 
    node: "Kolkata-East", 
    channel: "Online", 
    owner: "Ritika P.",
    week1: { forecast: 2100 },
    week2: { forecast: 2180 },
    week3: { forecast: 2050 },
    week4: { forecast: 2120 },
    week5: { forecast: 2200 },
    week6: { forecast: 2280 },
    week7: { forecast: 2140 },
    week8: { forecast: 2190 },
    week9: { forecast: 2260 },
    week10: { forecast: 2320 },
    week11: { forecast: 2180 },
    week12: { forecast: 2130 },
    label: "Add Labels",
    remarks: "Standard forecast",
    approvalStatus: "pending",
    approvalDetails: {
      remarks: "Under review by regional manager"
    }
  },
];

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

  const toggleAll = (checked: boolean) => setSelected(checked ? filteredSorted.map((r) => r.id) : []);
  const toggleOne = (id: string, checked: boolean) => setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const filteredSorted = useMemo(() => {
    let data = rows.filter((r) =>
      [r.sku, r.node, r.channel, r.owner].some((v) => v.toLowerCase().includes(search.toLowerCase()))
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
              <SelectItem value="SKU001">SKU001 Series</SelectItem>
              <SelectItem value="SKU002">SKU002 Series</SelectItem>
              <SelectItem value="SKU003">SKU003 Series</SelectItem>
              <SelectItem value="SKU004">SKU004 Series</SelectItem>
              <SelectItem value="SKU005">SKU005 Series</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterNode} onValueChange={setFilterNode}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Nodes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Nodes</SelectItem>
              <SelectItem value="Delhi">Delhi-North</SelectItem>
              <SelectItem value="Mumbai">Mumbai-West</SelectItem>
              <SelectItem value="Bangalore">Bangalore-South</SelectItem>
              <SelectItem value="Chennai">Chennai-South</SelectItem>
              <SelectItem value="Kolkata">Kolkata-East</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Channels</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
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
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[140px]" onClick={() => sortBy("sku")}>
                      SKU
                    </th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted w-[120px]" onClick={() => sortBy("node")}>
                      Node
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
                        <td className="p-3 font-medium">{r.sku}</td>
                        <td className="p-3">{r.node}</td>
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
                        <Button variant="link" className="text-sm p-0 h-auto">
                          View
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1 cursor-pointer" onClick={() => setApprovalDialog({ open: true, data: r })}>
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                r.approvalStatus === "approved" && i < 8
                                  ? "bg-green-500"
                                  : r.approvalStatus === "rejected" && i < 3
                                  ? "bg-red-500"
                                  : r.approvalStatus === "pending" && i < 5
                                  ? "bg-yellow-500"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
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
            <DialogTitle>Approval Flow Details</DialogTitle>
            <DialogDescription>
              Detailed approval information for {approvalDialog.data?.sku}
            </DialogDescription>
          </DialogHeader>
          {approvalDialog.data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">Status:</span>
                <Badge 
                  variant={
                    approvalDialog.data.approvalStatus === "approved" 
                      ? "default" 
                      : approvalDialog.data.approvalStatus === "rejected" 
                      ? "destructive" 
                      : "secondary"
                  }
                >
                  {approvalDialog.data.approvalStatus.charAt(0).toUpperCase() + approvalDialog.data.approvalStatus.slice(1)}
                </Badge>
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
    </div>
  );
};

export default CollaborativeForecastTable;