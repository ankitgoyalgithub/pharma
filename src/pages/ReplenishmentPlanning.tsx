
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ModernStepper } from "@/components/ModernStepper";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { ForecastCard } from "@/components/ForecastCard";
import {
  Download,
  Upload,
  Database,
  FileText,
  AlertCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle,
  Package,
  TrendingUp,
  BarChart3,
  Percent,
  Share,
  Settings,
  X,
  Info,
} from "lucide-react";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

// ---- Chart.js imports ----
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
  Title,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTooltip,
  ChartLegend,
  Filler,
  Title
);

// -------------------- Mock Data --------------------
type ItemRow = {
  sku: string;
  description: string;
  location: string;
  supplier: string;
  uom: string;
  current_stock: number;
  on_order: number;
  safety_stock: number;
  lead_time_days: number;
  moq: number;
  lot_size: number;
  avg_daily_demand: number;
  demand_cv: number; // coefficient of variation
};

const baseItems: ItemRow[] = [
  { sku: "SKU-1001", description: "Premium Widget A", location: "Delhi-DC", supplier: "Alpha Co", uom: "EA", current_stock: 820, on_order: 0, safety_stock: 300, lead_time_days: 10, moq: 200, lot_size: 100, avg_daily_demand: 95, demand_cv: 0.25 },
  { sku: "SKU-1002", description: "Premium Widget B", location: "Mumbai-DC", supplier: "Alpha Co", uom: "EA", current_stock: 260, on_order: 150, safety_stock: 180, lead_time_days: 7, moq: 150, lot_size: 50, avg_daily_demand: 60, demand_cv: 0.32 },
  { sku: "SKU-1003", description: "Gadget Pro X", location: "Bengaluru-DC", supplier: "Bravo Supplies", uom: "EA", current_stock: 120, on_order: 0, safety_stock: 200, lead_time_days: 14, moq: 250, lot_size: 50, avg_daily_demand: 55, demand_cv: 0.40 },
  { sku: "SKU-1004", description: "Gadget Pro Y", location: "Chennai-DC", supplier: "Bravo Supplies", uom: "EA", current_stock: 980, on_order: 0, safety_stock: 220, lead_time_days: 9, moq: 100, lot_size: 100, avg_daily_demand: 80, demand_cv: 0.22 },
  { sku: "SKU-2001", description: "Spare Part K", location: "Delhi-DC", supplier: "Cobalt Ltd", uom: "EA", current_stock: 45, on_order: 0, safety_stock: 80, lead_time_days: 21, moq: 120, lot_size: 20, avg_daily_demand: 8, demand_cv: 0.60 },
  { sku: "SKU-2002", description: "Spare Part L", location: "Mumbai-DC", supplier: "Cobalt Ltd", uom: "EA", current_stock: 400, on_order: 200, safety_stock: 300, lead_time_days: 30, moq: 300, lot_size: 100, avg_daily_demand: 40, demand_cv: 0.55 },
  { sku: "SKU-3001", description: "Accessory M1", location: "Delhi-DC", supplier: "Delta Traders", uom: "EA", current_stock: 150, on_order: 0, safety_stock: 120, lead_time_days: 5, moq: 50, lot_size: 25, avg_daily_demand: 30, demand_cv: 0.28 },
  { sku: "SKU-3002", description: "Accessory M2", location: "Bengaluru-DC", supplier: "Delta Traders", uom: "EA", current_stock: 60, on_order: 0, safety_stock: 100, lead_time_days: 6, moq: 80, lot_size: 20, avg_daily_demand: 18, demand_cv: 0.35 },
  { sku: "SKU-3003", description: "Accessory M3", location: "Chennai-DC", supplier: "Delta Traders", uom: "EA", current_stock: 380, on_order: 0, safety_stock: 200, lead_time_days: 12, moq: 150, lot_size: 50, avg_daily_demand: 42, demand_cv: 0.30 },
  { sku: "SKU-4001", description: "Consumable C1", location: "Mumbai-DC", supplier: "Echo Global", uom: "EA", current_stock: 90, on_order: 0, safety_stock: 160, lead_time_days: 8, moq: 120, lot_size: 20, avg_daily_demand: 25, demand_cv: 0.45 },
  { sku: "SKU-4002", description: "Consumable C2", location: "Delhi-DC", supplier: "Echo Global", uom: "EA", current_stock: 510, on_order: 0, safety_stock: 200, lead_time_days: 10, moq: 100, lot_size: 25, avg_daily_demand: 52, demand_cv: 0.33 },
  { sku: "SKU-5001", description: "Bundle Z", location: "Bengaluru-DC", supplier: "Foxtrot Parts", uom: "EA", current_stock: 35, on_order: 0, safety_stock: 120, lead_time_days: 18, moq: 150, lot_size: 50, avg_daily_demand: 12, demand_cv: 0.70 },
];

// forward demand series used for a quick coverage plot
const forwardDays = 30;
const forwardDemandBySku: Record<string, number[]> = baseItems.reduce((acc, it) => {
  const series: number[] = [];
  for (let d = 0; d < forwardDays; d++) {
    const base = it.avg_daily_demand * (1 + 0.15 * Math.sin((2 * Math.PI * d) / 7));
    const noise = base * (it.demand_cv * 0.2) * (Math.random() - 0.5);
    series.push(Math.max(0, Math.round(base + noise)));
  }
  acc[it.sku] = series;
  return acc;
}, {} as Record<string, number[]>);

// -------------------- Helpers --------------------
function roundUpToLot(qty: number, lot: number) {
  if (lot <= 0) return Math.max(0, Math.round(qty));
  return Math.max(0, Math.ceil(qty / lot) * lot);
}

type Scenario = { safetyMult: number; moqMult: number; leadTimeDelta: number };

type ComputedRow = ItemRow & {
  reorderPoint: number;
  need: number;
  willOrder: number;
  daysOfCover: number;
  scenarioLt: number;
  scenarioSafety: number;
  scenarioMoq: number;
};

function computeRows(base: ItemRow[], scenario: Scenario): ComputedRow[] {
  return base.map(it => {
    const safety = Math.max(0, scenario.safetyMult * it.safety_stock);
    const lt = Math.max(1, Math.round(it.lead_time_days + scenario.leadTimeDelta));
    const moq = Math.max(0, Math.round(it.moq * scenario.moqMult));
    const demandDuringLT = it.avg_daily_demand * lt;
    const reorderPoint = Math.ceil(demandDuringLT + safety);
    const projected = it.current_stock + it.on_order - reorderPoint;
    const need = projected < 0 ? -projected : 0;
    let rec = Math.max(need, moq);
    rec = roundUpToLot(rec, it.lot_size);
    const willOrder = need > 0 ? rec : 0;
    const daysOfCover = (it.current_stock + it.on_order) / Math.max(1, it.avg_daily_demand);
    return { ...it, reorderPoint, need, willOrder, daysOfCover, scenarioLt: lt, scenarioSafety: safety, scenarioMoq: moq };
  });
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  const weight = idx - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function toCSV(columns: { key: string; title: string }[], rows: any[]) {
  const header = columns.map(c => c.title).join(",");
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const body = rows.map(r => columns.map(c => esc(r[c.key])).join(",")).join("\n");
  return header + "\n" + body;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// -------------------- Pagination Hook & Table --------------------
function usePagination<T>(rows: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const data = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [pageCount]); // clamp
  return { page, pageCount, data, go, setPage };
}

function WorkbookTable({ rows, pageSize = 8 }: { rows: ComputedRow[], pageSize?: number }) {
  const { page, pageCount, data, go } = usePagination(rows, pageSize);
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-2 py-2 text-left">SKU</th>
              <th className="px-2 py-2 text-left">Desc</th>
              <th className="px-2 py-2 text-left">Location</th>
              <th className="px-2 py-2 text-left">Supplier</th>
              <th className="px-2 py-2 text-right">On-hand</th>
              <th className="px-2 py-2 text-right">On-order</th>
              <th className="px-2 py-2 text-right">ROP</th>
              <th className="px-2 py-2 text-right">Need</th>
              <th className="px-2 py-2 text-right">Rec Order</th>
              <th className="px-2 py-2 text-right">LT(d)</th>
              <th className="px-2 py-2 text-right">Cover(d)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-muted/20">
                <td className="px-2 py-2">{r.sku}</td>
                <td className="px-2 py-2">{r.description}</td>
                <td className="px-2 py-2">{r.location}</td>
                <td className="px-2 py-2">{r.supplier}</td>
                <td className="px-2 py-2 text-right">{r.current_stock}</td>
                <td className="px-2 py-2 text-right">{r.on_order}</td>
                <td className="px-2 py-2 text-right">{r.reorderPoint}</td>
                <td className="px-2 py-2 text-right">{r.need}</td>
                <td className="px-2 py-2 text-right">{r.willOrder}</td>
                <td className="px-2 py-2 text-right">{r.scenarioLt}</td>
                <td className="px-2 py-2 text-right">{r.daysOfCover.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span>Page {page} of {pageCount}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => go(page - 1)} disabled={page === 1}>Prev</Button>
          <Button size="sm" variant="outline" onClick={() => go(page + 1)} disabled={page === pageCount}>Next</Button>
        </div>
      </div>
    </div>
  );
}

// -------------------- Component --------------------
  const ReplenishmentPlanning: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: add data preview - align with DemandForecasting flow
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string; type: 'master' | 'timeseries' | 'featureStore', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  
  // Modal state variables
  const [selectedDataType, setSelectedDataType] = useState<'master' | 'timeseries' | ''>('');
  const [selectedObject, setSelectedObject] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // what-if controls (used in Review + Results)
  const [safetyMult, setSafetyMult] = useState(1.0);
  const [moqMult, setMoqMult] = useState(1.0);
  const [leadTimeDelta, setLeadTimeDelta] = useState(0);

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  const scenario = useMemo(() => ({ safetyMult, moqMult, leadTimeDelta }), [safetyMult, moqMult, leadTimeDelta]);
  const computed = useMemo(() => computeRows(baseItems, scenario), [scenario]);

  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Review Data", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];

  // External drivers logic
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  const externalDrivers = getExternalDrivers("replenishment-planning", hasData);

  const toggleDriver = (driver: string) => {
    setSelectedDrivers((prev) => (prev.includes(driver) ? prev.filter((d) => d !== driver) : [...prev, driver]));
  };

  useEffect(() => {
    if (hasData && selectedDrivers.length === 0) {
      setDriversLoading(true);
      setTimeout(() => {
        const driversToSelect = externalDrivers.filter(d => d.autoSelected).map(d => d.name);
        setSelectedDrivers(driversToSelect);
        setDriversLoading(false);
      }, 500);
    }
  }, [uploadedFiles.length, foundryObjects.length]);

  // ---------- STEP 1: Add Data ----------
  const handleFoundrySubmit = (data: {
    selectedObjects: string[];
    selectedDataType: 'master' | 'timeseries' | 'featureStore';
    fromDate?: Date;
    toDate?: Date;
  }) => {
    const newObjects = data.selectedObjects.map(objName => ({
      name: objName,
      type: data.selectedDataType === 'timeseries' ? 'timeseries' as const : 'master' as const,
      ...(data.selectedDataType === 'timeseries' && { fromDate: data.fromDate, toDate: data.toDate })
    }));
    setFoundryObjects(prev => [...prev, ...newObjects]);

    if (data.selectedObjects.length > 0) {
      setSelectedPreview(data.selectedObjects[0]);
      setPreviewLoading(true);
      setTimeout(() => setPreviewLoading(false), 600);
    }
    setIsFoundryModalOpen(false);
  };

  const handleSubmitFoundryModal = () => {
    if (selectedObject) {
      handleFoundrySubmit({
        selectedObjects: [selectedObject],
        selectedDataType: selectedDataType as 'master' | 'timeseries',
        fromDate,
        toDate
      });
    }
  };

  const renderPreviewPanel = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {previewLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        ) : selectedPreview ? (
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-2 py-2 text-left">SKU</th>
                  <th className="px-2 py-2 text-left">Location</th>
                  <th className="px-2 py-2 text-left">Supplier</th>
                  <th className="px-2 py-2 text-right">On-hand</th>
                  <th className="px-2 py-2 text-right">On-order</th>
                  <th className="px-2 py-2 text-right">Safety</th>
                  <th className="px-2 py-2 text-right">LT(d)</th>
                  <th className="px-2 py-2 text-right">MOQ</th>
                  <th className="px-2 py-2 text-right">Lot</th>
                  <th className="px-2 py-2 text-right">Avg DD</th>
                </tr>
              </thead>
              <tbody>
                {baseItems.slice(0, 8).map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-2 py-2">{r.sku}</td>
                    <td className="px-2 py-2">{r.location}</td>
                    <td className="px-2 py-2">{r.supplier}</td>
                    <td className="px-2 py-2 text-right">{r.current_stock}</td>
                    <td className="px-2 py-2 text-right">{r.on_order}</td>
                    <td className="px-2 py-2 text-right">{r.safety_stock}</td>
                    <td className="px-2 py-2 text-right">{r.lead_time_days}</td>
                    <td className="px-2 py-2 text-right">{r.moq}</td>
                    <td className="px-2 py-2 text-right">{r.lot_size}</td>
                    <td className="px-2 py-2 text-right">{r.avg_daily_demand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a data source to preview.</p>
        )}
      </CardContent>
    </Card>
  );

  const renderStep1 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">
          Upload or map inventory, forecast and policies. Select a source to see a quick preview.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Upload Data Files</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload inventory data, forecast files, and replenishment policies. Supported formats: CSV, Excel, JSON.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            <Button variant="link" size="sm" className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'replenishment-planning-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
            {" "}with sheets (Inventory, Demand, Suppliers, Lead Times, Policies)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById("rep-file-upload-adv")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>

            <Dialog open={isFoundryModalOpen} onOpenChange={setIsFoundryModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Map from Foundry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Map from Foundry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Type</label>
                    <Select value={selectedDataType} onValueChange={(value) => setSelectedDataType(value as 'master' | 'timeseries' | '')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="timeseries">Time Series</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!!selectedDataType && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Object</label>
                      <Select value={selectedObject} onValueChange={setSelectedObject}>
                        <SelectTrigger><SelectValue placeholder="Select object" /></SelectTrigger>
                        <SelectContent>
                          {(selectedDataType === "master" ? ["Item_Master","Supplier_Master","Policy_Master"] : ["Inventory_Position","Demand_Forecast"]).map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedDataType === "timeseries" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {toDate ? format(toDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsFoundryModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitFoundryModal} disabled={!selectedObject}>Submit</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <input
            type="file"
            id="rep-file-upload-adv"
            multiple
            accept=".csv,.xlsx,.json"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setUploadedFiles(prev => [...prev, ...files]);
              if (files.length > 0) {
                setSelectedPreview(files[0].name);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 600);
              }
            }}
          />

          {(uploadedFiles.length > 0 || foundryObjects.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Selected Data Sources</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-accent/10 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">Upload</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {foundryObjects.map((obj, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-accent/10 rounded border">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{obj.name}</span>
                      <Badge variant="secondary" className="text-xs">Foundry</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setFoundryObjects(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExternalDriversSection
        title="External Drivers"
        description="Select external factors that could impact your replenishment planning."
        drivers={externalDrivers}
        selectedDrivers={selectedDrivers}
        onToggleDriver={toggleDriver}
        driversLoading={driversLoading}
      />

      {renderPreviewPanel()}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(2)}>Continue to Data Gaps →</Button>
      </div>
    </div>
  );

  // ---------- STEP 2: Data Gaps ----------
  const gaps = useMemo(() => {
    return [
      { type: "Missing Lead Time", count: 1, severity: "High", sample: "SKU-3002 @ Bengaluru-DC" },
      { type: "Invalid MOQ/Lot Size", count: 2, severity: "Medium", sample: "SKU-2002, SKU-5001" },
      { type: "Missing Safety Stock", count: 1, severity: "Medium", sample: "SKU-4001" },
      { type: "Stale Forecast (older than 30d)", count: 3, severity: "Low", sample: "Multiple SKUs" },
    ];
  }, []);

  const [showImputedReview, setShowImputedReview] = useState(false);

  function applyAutoFixes(rows: ItemRow[]): ItemRow[] {
    return rows.map(r => {
      let updated = { ...r };
      if (r.sku === "SKU-3002" && r.lead_time_days <= 0) updated.lead_time_days = 7; // fill missing
      if (r.sku === "SKU-4001" && r.safety_stock <= 0) updated.safety_stock = Math.round(r.avg_daily_demand * 5); // heuristic
      // MOQ/Lot: ensure MOQ at least one lot and is a multiple of lot_size
      if (updated.moq < updated.lot_size) updated.moq = updated.lot_size;
      if (updated.moq % updated.lot_size !== 0) updated.moq = Math.ceil(updated.moq / updated.lot_size) * updated.lot_size;
      return updated;
    });
  }

  const handleDownloadFixed = () => {
    const fixed = applyAutoFixes(baseItems);
    const cols = [
      { key: "sku", title: "SKU" },
      { key: "description", title: "Description" },
      { key: "location", title: "Location" },
      { key: "supplier", title: "Supplier" },
      { key: "uom", title: "UOM" },
      { key: "current_stock", title: "OnHand" },
      { key: "on_order", title: "OnOrder" },
      { key: "safety_stock", title: "SafetyStock" },
      { key: "lead_time_days", title: "LeadTimeDays" },
      { key: "moq", title: "MOQ" },
      { key: "lot_size", title: "LotSize" },
      { key: "avg_daily_demand", title: "AvgDailyDemand" },
      { key: "demand_cv", title: "DemandCV" },
    ];
    const csv = toCSV(cols, fixed);
    download("replenishment_fixed_inputs.csv", csv);
  };

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detected gaps and suggested fixes.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowImputedReview(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Auto Fix with AI
          </Button>
          {showImputedReview && (
            <Button size="sm" onClick={handleDownloadFixed}>
              <Download className="w-4 h-4 mr-2" />
              Apply All & Download Fixed File
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatTile label="Completeness" value="96.1%" icon={CheckCircle} tone="success" />
        <StatTile label="Missing LT" value="1" icon={AlertTriangle} tone="warning" />
        <StatTile label="Invalid MOQ/Lot" value="2" icon={AlertCircle} tone="accent" />
        <StatTile label="Missing Safety" value="1" icon={AlertCircle} tone="destructive" />
        <StatTile label="Stale Forecasts" value="3" icon={TrendingUp} tone="warning" />
      </div>

      {showImputedReview && (
        <Card>
          <CardHeader><CardTitle className="text-base">AI Fix Preview</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm border border-border rounded">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Gap</th>
                  <th className="text-left px-3 py-2">Detected</th>
                  <th className="text-left px-3 py-2">Examples</th>
                  <th className="text-left px-3 py-2">Suggested Fix</th>
                  <th className="text-left px-3 py-2">Confidence</th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2">{g.type}</td>
                    <td className="px-3 py-2">{g.count}</td>
                    <td className="px-3 py-2">{(g as any).sample}</td>
                    <td className="px-3 py-2">Estimate from history / supplier defaults</td>
                    <td className="px-3 py-2">{g.severity === "High" ? "0.92" : g.severity === "Medium" ? "0.88" : "0.80"}</td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="outline" onClick={handleDownloadFixed}>Apply & Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Fixes are applied to a copy; your originals remain unchanged.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(3)}>Continue to Review →</Button>
      </div>
    </div>
  );

  function StatTile({ label, value, icon: Icon, tone }:{ label: string; value: string; icon: any; tone: "success"|"warning"|"accent"|"destructive"|"primary" }){
    const map:any = {
      success: { bg: "from-success/10 to-success/5", text: "text-success", border: "border-success/20" },
      warning: { bg: "from-warning/10 to-warning/5", text: "text-warning", border: "border-warning/20" },
      accent: { bg: "from-accent/10 to-accent/5", text: "text-accent", border: "border-accent/20" },
      destructive: { bg: "from-destructive/10 to-destructive/5", text: "text-destructive", border: "border-destructive/20" },
      primary: { bg: "from-primary/10 to-primary/5", text: "text-primary", border: "border-primary/20" },
    };
    const c = map[tone];
    return (
      <Card className={`relative overflow-hidden bg-gradient-to-br ${c.bg} ${c.border} hover:shadow-lg transition-shadow`}>
        <CardContent className="p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${c.text}`} />
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
          <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
        </CardContent>
      </Card>
    );
  }

  // ---------- STEP 3: Review Data ----------
  const totalStock = computed.reduce((s, r) => s + r.current_stock, 0);
  const totalOnOrder = computed.reduce((s, r) => s + r.on_order, 0);
  const avgCover = (computed.reduce((s, r) => s + r.daysOfCover, 0) / computed.length).toFixed(1);

  // Supplier P50/P90/P95 of lead times
  const supplierPercentiles = useMemo(() => {
    const map: Record<string, number[]> = {};
    computed.forEach(r => {
      map[r.supplier] = map[r.supplier] || [];
      map[r.supplier].push(r.scenarioLt);
    });
    return Object.keys(map).map(sup => ({
      supplier: sup,
      p50: Math.round(percentile(map[sup], 0.5)),
      p90: Math.round(percentile(map[sup], 0.9)),
      p95: Math.round(percentile(map[sup], 0.95)),
      items: map[sup].length,
    }));
  }, [computed]);

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Check inventory posture, lead times and coverage before generating the plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Inventory Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total On-hand</span><span className="font-medium">{totalStock.toLocaleString()} EA</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">On-Order</span><span className="font-medium">{totalOnOrder.toLocaleString()} EA</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Days of Cover</span><span className="font-medium">{avgCover} days</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Items Below ROP</span><span className="font-medium">{computed.filter(r => r.need > 0).length}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lead Time Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Bar
                data={{
                  labels: ["≤7d", "8–14d", "15–21d", "22–30d"],
                  datasets: [
                    {
                      label: "Items",
                      data: [
                        computed.filter(r => r.scenarioLt <= 7).length,
                        computed.filter(r => r.scenarioLt > 7 && r.scenarioLt <= 14).length,
                        computed.filter(r => r.scenarioLt > 14 && r.scenarioLt <= 21).length,
                        computed.filter(r => r.scenarioLt > 21).length,
                      ],
                      backgroundColor: hslVar("--primary", 0.5),
                      borderColor: hslVar("--primary"),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={buildChartOptions({
                  plugins: { legend: { display: false } },
                  scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Supplier Lead-time Percentiles</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {supplierPercentiles.map((s) => (
              <div key={s.supplier} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm">{s.supplier}</span>
                <div className="text-xs text-muted-foreground">
                  P50: <b>{s.p50}d</b> · P90: <b>{s.p90}d</b> · P95: <b>{s.p95}d</b> · Items: <b>{s.items}</b>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Workbook Preview (Paginated)</CardTitle></CardHeader>
        <CardContent>
          <WorkbookTable rows={computed} pageSize={8} />
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(4)}>Generate Plan →</Button>
      </div>
    </div>
  );

  // ---------- STEP 4: Results ----------
  const [resultsTab, setResultsTab] = useState<"overview"|"orders"|"suppliers"|"workbook">("overview");
  const [selectedSku, setSelectedSku] = useState<string>(baseItems[0].sku);

  const coverageSeries = useMemo(() => {
    const series = forwardDemandBySku[selectedSku] || [];
    const row = computed.find(r => r.sku === selectedSku);
    let onHand = row ? row.current_stock : 0;
    const projected: number[] = [];
    for (let i = 0; i < series.length; i++) {
      onHand -= series[i];
      projected.push(Math.max(0, onHand));
    }
    return { labels: Array.from({ length: series.length }, (_, i) => `D${i + 1}`), demand: series, onHand: projected };
  }, [selectedSku, computed]);

  const orders = useMemo(() => computed
    .filter(r => r.willOrder > 0)
    .map((r, i) => ({
      id: i + 1,
      sku: r.sku,
      description: r.description,
      supplier: r.supplier,
      location: r.location,
      recommended_qty: r.willOrder,
      moq: r.scenarioMoq,
      lot_size: r.lot_size,
      reorder_point: r.reorderPoint,
      current_stock: r.current_stock,
      lead_time_days: r.scenarioLt,
      eta: `${r.scenarioLt} days`,
    })), [computed]);

  const ordersPagination = usePagination(orders, 8);

  // Supplier pre/post fill (mock)
  const supplierPerf = useMemo(() => [
    { supplier: "Alpha Co", preFill: 0.91, postFill: 0.95 + Math.min(0.04, (1 - safetyMult) * 0.1) },
    { supplier: "Bravo Supplies", preFill: 0.83, postFill: 0.90 + Math.min(0.07, (1 - safetyMult) * 0.15) },
    { supplier: "Cobalt Ltd", preFill: 0.78, postFill: 0.88 + Math.min(0.08, (1 - safetyMult) * 0.18) },
    { supplier: "Delta Traders", preFill: 0.88, postFill: 0.93 + Math.min(0.05, (1 - safetyMult) * 0.12) },
    { supplier: "Echo Global", preFill: 0.86, postFill: 0.92 + Math.min(0.05, (1 - safetyMult) * 0.12) },
    { supplier: "Foxtrot Parts", preFill: 0.72, postFill: 0.85 + Math.min(0.10, (1 - safetyMult) * 0.2) },
  ], [safetyMult]);

  const activeFill = supplierPerf.map(s => s.postFill).reduce((a,b)=>a+b,0)/supplierPerf.length;
  const preFill = supplierPerf.map(s => s.preFill).reduce((a,b)=>a+b,0)/supplierPerf.length;

  const exportOrdersCSV = () => {
    const cols = [
      { key: "id", title: "#" },
      { key: "sku", title: "SKU" },
      { key: "description", title: "Description" },
      { key: "supplier", title: "Supplier" },
      { key: "location", title: "Location" },
      { key: "recommended_qty", title: "RecommendedQty" },
      { key: "moq", title: "MOQ" },
      { key: "lot_size", title: "LotSize" },
      { key: "reorder_point", title: "ReorderPoint" },
      { key: "current_stock", title: "OnHand" },
      { key: "lead_time_days", title: "LeadTimeDays" },
      { key: "eta", title: "ETA" },
    ];
    download("recommended_orders.csv", toCSV(cols, orders));
  };

  const renderScenarioToolbar = () => (
    <div className="sticky top-16 z-10 bg-background border-b mb-4">
      <div className="flex flex-wrap items-center gap-6 p-3">
        <div className="text-sm font-medium">Scenario Plan</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-40">Safety Stock Multiplier</span>
          <input type="range" min={0.6} max={1.6} step={0.05} value={safetyMult} onChange={(e)=>setSafetyMult(parseFloat(e.target.value))} className="w-40" />
          <span className="text-xs w-10">{safetyMult.toFixed(2)}×</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-28">MOQ Mult</span>
          <input type="range" min={0.5} max={2} step={0.05} value={moqMult} onChange={(e)=>setMoqMult(parseFloat(e.target.value))} className="w-40" />
          <span className="text-xs w-10">{moqMult.toFixed(2)}×</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-28">Lead Time Δ</span>
          <input type="range" min={-10} max={10} step={1} value={leadTimeDelta} onChange={(e)=>setLeadTimeDelta(parseInt(e.target.value))} className="w-40" />
          <span className="text-xs w-10">{leadTimeDelta}d</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={()=>{setSafetyMult(1.1); setMoqMult(1.2); setLeadTimeDelta(3);}}>Conservative</Button>
          <Button size="sm" variant="outline" onClick={()=>{setSafetyMult(1.0); setMoqMult(1.0); setLeadTimeDelta(0);}}>Balanced</Button>
          <Button size="sm" variant="outline" onClick={()=>{setSafetyMult(0.8); setMoqMult(0.8); setLeadTimeDelta(-2);}}>Aggressive</Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-108px)]">
      {/* Left Sidebar with ForecastCard tiles */}
      <div className="sm:w-64 w-full bg-card border-r p-4 flex flex-col h-[calc(100vh-108px)] max-h-screen">
        <div className="flex-none mb-2">
          <h2 className="text-xl font-bold text-foreground">Replenishment Results</h2>
          <p className="text-sm text-muted-foreground">Click a card to switch views</p>
        </div>

        <div className="grid gap-3">
          <ForecastCard
            className="h-full"
            title="FILL RATE"
            value={`${Math.round(activeFill*100)}%`}
            subtitle={`was ${Math.round(preFill*100)}%`}
            icon={TrendingUp}
            isActive={resultsTab === "overview"}
            onClick={() => setResultsTab("overview")}
          />
          <ForecastCard
            className="h-full"
            title="ORDERS"
            value={`${orders.length}`}
            subtitle="SKUs to order"
            icon={Package}
            isActive={resultsTab === "orders"}
            onClick={() => setResultsTab("orders")}
          />
          <ForecastCard
            className="h-full"
            title="SUPPLIERS"
            value={`${supplierPerf.length}`}
            subtitle="performance view"
            icon={BarChart3}
            isActive={resultsTab === "suppliers"}
            onClick={() => setResultsTab("suppliers")}
          />
          <ForecastCard
            className="h-full"
            title="WORKBOOK"
            value="Data"
            subtitle="plan-level table"
            icon={Percent}
            isActive={resultsTab === "workbook"}
            onClick={() => setResultsTab("workbook")}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-0 overflow-hidden">
        {renderScenarioToolbar()}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {resultsTab === "overview" && "Plan Overview"}
                {resultsTab === "orders" && "Recommended Orders"}
                {resultsTab === "suppliers" && "Supplier Impact"}
                {resultsTab === "workbook" && "Workbook"}
              </h1>
              <p className="text-muted-foreground">
                {resultsTab === "overview" && "Coverage and demand vs on-hand"}
                {resultsTab === "orders" && "Purchase order recommendations with MOQ/lot rounding"}
                {resultsTab === "suppliers" && "Fill rate change by supplier"}
                {resultsTab === "workbook" && "Detailed table of plan inputs & outputs"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>← Back</Button>
              {resultsTab === "orders" && (
                <Button variant="outline" onClick={exportOrdersCSV}><Download className="w-4 h-4 mr-2" />Export Orders CSV</Button>
              )}
              <Button><Share className="w-4 h-4 mr-2" />Share</Button>
            </div>
          </div>

          {/* Tab content */}
          {resultsTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Coverage Projection ({selectedSku})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground">Switch SKU:</span>
                    <Select value={selectedSku} onValueChange={setSelectedSku}>
                      <SelectTrigger className="w-56"><SelectValue placeholder="Select SKU" /></SelectTrigger>
                      <SelectContent>
                        {baseItems.map(i => <SelectItem value={i.sku} key={i.sku}>{i.sku}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[280px]">
                    <Line
                      data={{
                        labels: coverageSeries.labels,
                        datasets: [
                          {
                            label: "Projected On-hand",
                            data: coverageSeries.onHand,
                            borderWidth: 2.5,
                            tension: 0.35,
                            borderColor: hslVar("--primary"),
                            backgroundColor: "transparent",
                          },
                          {
                            label: "Demand (next 30 days)",
                            data: coverageSeries.demand,
                            borderWidth: 2.5,
                            tension: 0.35,
                            borderDash: [6,4],
                            borderColor: hslVar("--primary", 0.6),
                            backgroundColor: "transparent",
                          },
                        ],
                      }}
                      options={buildChartOptions({
                        plugins: { legend: { position: "bottom" as const } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Quick Scenario Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">SKUs to Order</span><span className="font-medium">{orders.length}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Lead Time</span><span className="font-medium">{(computed.reduce((s,r)=>s+r.scenarioLt,0)/computed.length).toFixed(1)} d</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Cover</span><span className="font-medium">{(computed.reduce((s,r)=>s+r.daysOfCover,0)/computed.length/computed.length).toFixed(1)}</span></div>
                </CardContent>
              </Card>
            </div>
          )}

          {resultsTab === "orders" && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-base">Recommended Orders (Paginated)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="overflow-x-auto rounded border">
                  <table className="min-w-full text-xs">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">SKU</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-left">Supplier</th>
                        <th className="px-2 py-2 text-left">Location</th>
                        <th className="px-2 py-2 text-right">Rec Qty</th>
                        <th className="px-2 py-2 text-right">MOQ</th>
                        <th className="px-2 py-2 text-right">Lot</th>
                        <th className="px-2 py-2 text-right">ROP</th>
                        <th className="px-2 py-2 text-right">On-hand</th>
                        <th className="px-2 py-2 text-right">LT</th>
                        <th className="px-2 py-2 text-left">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersPagination.data.map((r: any) => (
                        <tr key={r.id} className="hover:bg-muted/20">
                          <td className="px-2 py-2">{r.id}</td>
                          <td className="px-2 py-2">{r.sku}</td>
                          <td className="px-2 py-2">{r.description}</td>
                          <td className="px-2 py-2">{r.supplier}</td>
                          <td className="px-2 py-2">{r.location}</td>
                          <td className="px-2 py-2 text-right">{r.recommended_qty}</td>
                          <td className="px-2 py-2 text-right">{r.moq}</td>
                          <td className="px-2 py-2 text-right">{r.lot_size}</td>
                          <td className="px-2 py-2 text-right">{r.reorder_point}</td>
                          <td className="px-2 py-2 text-right">{r.current_stock}</td>
                          <td className="px-2 py-2 text-right">{r.lead_time_days}</td>
                          <td className="px-2 py-2">{r.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Page {ordersPagination.page} of {ordersPagination.pageCount}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => ordersPagination.go(ordersPagination.page - 1)} disabled={ordersPagination.page === 1}>Prev</Button>
                    <Button size="sm" variant="outline" onClick={() => ordersPagination.go(ordersPagination.page + 1)} disabled={ordersPagination.page === ordersPagination.pageCount}>Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {resultsTab === "suppliers" && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-base">Supplier Fill Rate Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: supplierPerf.map(s => s.supplier),
                      datasets: [
                        {
                          label: "Before",
                          data: supplierPerf.map(s => Math.round(s.preFill * 100)),
                          backgroundColor: "rgba(148,163,184,0.6)",
                          borderColor: "rgba(148,163,184,1)",
                          borderWidth: 1,
                        },
                        {
                          label: "After",
                          data: supplierPerf.map(s => Math.round(s.postFill * 100)),
                          backgroundColor: hslVar("--primary", 0.5),
                          borderColor: hslVar("--primary"),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={buildChartOptions({
                      plugins: { legend: { position: "bottom" as const } },
                      scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100 } }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {resultsTab === "workbook" && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-base">Workbook (Paginated)</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkbookTable rows={computed} pageSize={10} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <ModernStepper steps={stepperSteps} title="Replenishment Planning" />
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default ReplenishmentPlanning;