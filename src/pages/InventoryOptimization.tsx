
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScientificLoader } from "@/components/ScientificLoader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  FileText,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  Share,
  MoreHorizontal,
  Settings,
  X,
  Database,
  Upload,
  CalendarIcon,
  Boxes,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import WorkbookTable from "@/components/WorkbookTable";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { ForecastCard } from "@/components/ForecastCard";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";

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
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";

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

// ---------- Sample mock data ----------
const workbookData = [
  { sku: "SKU001", location: "Delhi FC", onHand: 520, onOrder: 200, backorder: 0, leadTime: 12, demandMean: 45, demandStd: 18 },
  { sku: "SKU002", location: "Mumbai FC", onHand: 140, onOrder: 80, backorder: 10, leadTime: 18, demandMean: 22, demandStd: 9 },
  { sku: "SKU003", location: "Bengaluru FC", onHand: 60, onOrder: 0, backorder: 5, leadTime: 25, demandMean: 15, demandStd: 15 },
];

const policyRows = [
  { sku: "SKU001", abc: "A", service: 95, reorderPoint: 700, safetyStock: 220, orderQty: 500, policy: "Min/Max 700-1200" },
  { sku: "SKU002", abc: "B", service: 92, reorderPoint: 330, safetyStock: 150, orderQty: 300, policy: "EOQ 300" },
  { sku: "SKU003", abc: "C", service: 85, reorderPoint: 190, safetyStock: 140, orderQty: 200, policy: "Review-Period 2W" },
];

const kpi = {
  fillRate: 0.965,
  stockoutsAvoided: 37,
  workingCapital: 4.2,
  turns: 9.1,
  carryingCost: 0.14,
};

const skuServicePie = [
  { name: ">=95%", value: 38, fill: "#10b981" },
  { name: "90–95%", value: 27, fill: "#3b82f6" },
  { name: "<90%", value: 12, fill: "#f59e0b" },
  { name: "Unclassified", value: 5, fill: "#8b5cf6" },
];

// ---------- Lightweight Network Diagram ----------
type EchelonMode = "single" | "multi";

const Node: React.FC<{ x: number; y: number; label: string; kind: "plant" | "dc" | "store"}> = ({ x, y, label, kind }) => {
  const color = kind === "plant" ? "#22c55e" : kind === "dc" ? "#3b82f6" : "#f59e0b";
  return (
    <g>
      <rect x={x-48} y={y-18} rx="10" ry="10" width="96" height="36" fill={color} opacity="0.9" />
      <text x={x} y={y+4} textAnchor="middle" fontSize="12" fill="#ffffff">{label}</text>
    </g>
  );
};

const Arrow: React.FC<{ x1:number; y1:number; x2:number; y2:number }> = ({ x1, y1, x2, y2 }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 12, ay = y2 - uy * 12;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2-ux*12} y2={y2-uy*12} stroke="#94a3b8" strokeWidth="2" />
      <polygon points={`${ax},${ay} ${ax-uy*6},${ay+ux*6} ${ax+uy*6},${ay-ux*6}`} fill="#94a3b8" />
    </g>
  );
};

const NetworkDiagram: React.FC<{ mode: EchelonMode }> = ({ mode }) => {
  return (
    <div className="w-full h-[280px] bg-muted rounded-lg border flex items-center justify-center">
      <svg viewBox="0 0 800 240" className="w-full h-full">
        {/* single echelon: Plant -> Stores */}
        {mode === "single" && (
          <>
            <Node x={120} y={120} label="Plant" kind="plant" />
            <Node x={420} y={60} label="Store A" kind="store" />
            <Node x={420} y={120} label="Store B" kind="store" />
            <Node x={420} y={180} label="Store C" kind="store" />
            <Arrow x1={168} y1={120} x2={372} y2={60} />
            <Arrow x1={168} y1={120} x2={372} y2={120} />
            <Arrow x1={168} y1={120} x2={372} y2={180} />
          </>
        )}

        {/* multi echelon: Plant -> DCs -> Stores */}
        {mode === "multi" && (
          <>
            <Node x={120} y={120} label="Plant" kind="plant" />
            <Node x={360} y={80} label="DC North" kind="dc" />
            <Node x={360} y={160} label="DC South" kind="dc" />
            <Node x={620} y={40} label="Store A" kind="store" />
            <Node x={620} y={100} label="Store B" kind="store" />
            <Node x={620} y={160} label="Store C" kind="store" />
            <Node x={620} y={220} label="Store D" kind="store" />
            <Arrow x1={168} y1={120} x2={312} y2={80} />
            <Arrow x1={168} y1={120} x2={312} y2={160} />
            <Arrow x1={408} y1={80} x2={572} y2={40} />
            <Arrow x1={408} y1={80} x2={572} y2={100} />
            <Arrow x1={408} y1={160} x2={572} y2={160} />
            <Arrow x1={408} y1={160} x2={572} y2={220} />
          </>
        )}
      </svg>
    </div>
  );
};

// ---------- Component ----------
const InventoryOptimization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Add Data states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'timeseries', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Data Gaps
  const [showImputedReview, setShowImputedReview] = useState(false);

  // Review step controls
  const [serviceLevel, setServiceLevel] = useState<number>(95);
  const [holdingCostPct, setHoldingCostPct] = useState<number>(14);
  const [orderingCost, setOrderingCost] = useState<number>(1500);
  const [leadTimeMode, setLeadTimeMode] = useState<"static" | "variable">("variable");
  const [echelonMode, setEchelonMode] = useState<EchelonMode>("single");

  // Results tabs
  const [activeTab, setActiveTab] = useState<"overview" | "policies" | "capital" | "workbook">("overview");

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Review Data", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Inventory Optimization",
    initialStep: currentStep
  });

  const { setOnStepClick } = useStepperContext();

  // Set up step click handler
  const handleStepClick = React.useCallback((stepId: number) => {
    const targetStep = stepperSteps.find(s => s.id === stepId);
    if (targetStep && (targetStep.status === 'completed' || stepId === currentStep + 1 || stepId === currentStep)) {
      setCurrentStep(stepId);
    }
  }, [currentStep, stepperSteps]);

  useEffect(() => {
    setOnStepClick(() => handleStepClick);
  }, [handleStepClick, setOnStepClick]);

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  const handleStepTransition = (nextStep: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsLoading(false);
    }, 900);
  };

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
  };

  // Auto-select drivers when data sources are added
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  const externalDrivers = getExternalDrivers("inventory-optimization", hasData);

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

  // ---------- Charts: Step 2 (Data Gaps) ----------
  const gapData = [
    { bucket: "Service Gap (by ABC)", issues: 7 },
    { bucket: "Lead Time Variability", issues: 5 },
    { bucket: "Supplier Reliability", issues: 3 },
    { bucket: "Dead/Slow Movers", issues: 6 },
    { bucket: "Overstock Hotspots", issues: 4 },
    { bucket: "Stockout Hotspots", issues: 2 },
  ];

  const gapsBarData = {
    labels: gapData.map((g) => g.bucket),
    datasets: [
      {
        label: "Detected Issues",
        data: gapData.map((g) => g.issues),
        backgroundColor: hslVar("--primary", 0.5),
        borderColor: hslVar("--primary"),
        borderWidth: 1,
      },
    ],
  };

  const gapsBarOptions: any = buildChartOptions({
    plugins: { legend: { position: "top" } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { display: true } },
    },
  });
  // Inventory Exposure by Location (₹ Lakhs) - stacked bar
  const exposureBarData = {
    labels: ["Delhi FC", "Mumbai FC", "Bengaluru FC"],
    datasets: [
      {
        label: "Overstock (₹L)",
        data: [12, 9, 7],
        backgroundColor: "rgba(239,68,68,0.7)",
        stack: "exposure",
      },
      {
        label: "Healthy (₹L)",
        data: [30, 22, 18],
        backgroundColor: "rgba(16,185,129,0.7)",
        stack: "exposure",
      },
      {
        label: "At-Risk (₹L)",
        data: [5, 8, 6],
        backgroundColor: "rgba(245,158,11,0.8)",
        stack: "exposure",
      },
    ],
  };

  const exposureBarOptions: any = buildChartOptions({
    plugins: { legend: { position: "bottom" as const } },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, title: { display: true, text: "₹ Lakhs" } },
    },
  });


  // Lead time distribution (Step 3 visualization)
  const leadTimeHist = {
    labels: ["8", "10", "12", "14", "16", "18", "20", "22", "24", "26"],
    datasets: [
      {
        label: "Lead Time (days) Frequency",
        data: [1, 3, 7, 10, 14, 9, 6, 3, 2, 1],
        backgroundColor: "rgba(59,130,246,0.5)",
      },
    ],
  };

  const histOptions: any = buildChartOptions({
    plugins: { legend: { position: "top" } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
  });

  // Stock position vs reorder point line (Step 4)
  const stockPositionData = {
    labels: Array.from({ length: 24 }, (_, i) => `W${i + 1}`),
    datasets: [
      {
        label: "Stock Position",
        data: [920, 870, 810, 760, 710, 670, 620, 570, 530, 510, 480, 450, 880, 830, 780, 740, 710, 670, 640, 590, 560, 520, 490, 460],
        borderColor: hslVar("--primary"),
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 0,
      },
      {
        label: "Reorder Point",
        data: Array(24).fill(700),
        borderColor: hslVar("--destructive"),
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [6,4],
        pointRadius: 0,
      },
      {
        label: "Safety Stock Band",
        data: Array(24).fill(920),
        fill: "+1",
        borderColor: "transparent",
        backgroundColor: "rgba(16,185,129,0.10)",
        pointRadius: 0,
      },
      {
        label: "Safety Stock Floor",
        data: Array(24).fill(700),
        borderColor: "transparent",
        backgroundColor: "rgba(16,185,129,0.10)",
        pointRadius: 0,
      },
    ],
  };

  const stockPositionOptions: any = buildChartOptions({
    plugins: { legend: { position: "bottom" } },
    scales: { x: { grid: { display: true } }, y: { beginAtZero: false } },
  });

  const serviceLevelPie = {
    labels: skuServicePie.map(d => d.name),
    datasets: [
      {
        label: "SKUs",
        data: skuServicePie.map(d => d.value),
        backgroundColor: skuServicePie.map(d => d.fill),
      }
    ]
  };

  const pieOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } }
  };

  // ---------- Step 1 ----------
  const renderStep1 = () => (
    <div className="space-y-6 px-6 pt-10 pb-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">
          Upload demand history, on-hand/on-order, lead times, supplier constraints (MOQ/LOT), and costs. Or map directly from Foundry.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Data Files</CardTitle>
          <p className="text-sm text-muted-foreground">
            <Button variant="link" size="sm" className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'inventory-optimization-input-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
            {" "}with sheets (Demand, OnHand, OnOrder, LeadTimes, Supplier, Costs)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('io-file-upload')?.click()}>
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
            </Dialog>
          </div>

          <Input id="io-file-upload" type="file" multiple accept=".csv,.xlsx,.xls" className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                setUploadedFiles(prev => [...prev, ...files]);
                setSelectedPreview(files[0].name);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 700);
              }
            }}
          />

          {(uploadedFiles.length > 0 || foundryObjects.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Data Sources:</h4>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">Uploaded Files</h5>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border bg-card">
                        <div className="flex items-center gap-2 text-xs">
                          <FileText className="h-3 w-3 text-violet-700" />
                          <span className="text-foreground">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                            if (selectedPreview === file.name) {
                              const remaining = uploadedFiles.filter((_, i) => i !== index);
                              setSelectedPreview(remaining.length > 0 ? remaining[0].name : null);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {foundryObjects.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">Foundry Objects</h5>
                  <div className="space-y-1">
                    {foundryObjects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border bg-card">
                        <div className="flex items-center gap-2 text-xs">
                          <Database className="h-3 w-3 text-green-600" />
                          <span className="text-foreground">{obj.name}</span>
                          <Badge variant="secondary" className="text-xs">{obj.type}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                          onClick={() => {
                            setFoundryObjects(prev => prev.filter((_, i) => i !== index));
                            if (selectedPreview === obj.name) {
                              const allSources = [...uploadedFiles.map(f => f.name), ...foundryObjects.filter((_, i) => i !== index).map(o => o.name)];
                              setSelectedPreview(allSources.length > 0 ? allSources[0] : null);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ExternalDriversSection
        title="AI Suggested External Drivers"
        description="AI-suggested external factors that may influence inventory patterns based on your data characteristics."
        drivers={externalDrivers}
        selectedDrivers={selectedDrivers}
        driversLoading={driversLoading}
        onToggleDriver={toggleDriver}
        onPreviewDriver={(driverName) => {
          setSelectedPreview(driverName);
          setPreviewLoading(true);
          setTimeout(() => setPreviewLoading(false), 700);
        }}
      />

      {(uploadedFiles.length > 0 || foundryObjects.length > 0 || selectedDrivers.length > 0) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  {uploadedFiles.map((file) => (
                    <Button key={file.name} size="sm" variant={selectedPreview === file.name ? "default" : "outline"}
                      onClick={() => { setSelectedPreview(file.name); setPreviewLoading(true); setTimeout(() => setPreviewLoading(false), 500); }}
                    >
                      <FileText className="h-3 w-3 mr-1" />{file.name.split(".")[0]}
                    </Button>
                  ))}
                  {foundryObjects.map((obj) => (
                    <Button key={obj.name} size="sm" variant={selectedPreview === obj.name ? "default" : "outline"}
                      onClick={() => { setSelectedPreview(obj.name); setPreviewLoading(true); setTimeout(() => setPreviewLoading(false), 500); }}
                    >
                      <Database className="h-3 w-3 mr-1" />{obj.name.split("_")[0]}
                    </Button>
                  ))}
                  {selectedDrivers.map((driver, index) => (
                    <Button
                      key={driver}
                      size="sm"
                      variant={selectedPreview === driver ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(driver);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {driver}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full border-2 border-border border-t-transparent animate-spin" aria-label="Loading preview" />
              </div>
            ) : (
              <>
                {selectedPreview ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      {selectedDrivers.includes(selectedPreview) ? (
                        <Zap className="h-3 w-3" />
                      ) : foundryObjects.some(obj => obj.name === selectedPreview) ? (
                        <Database className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {selectedPreview}
                    </p>
                    {selectedDrivers.includes(selectedPreview) ? (
                      // External driver preview
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Sample Data Points</h4>
                            <table className="min-w-full text-xs border border-border rounded">
                              <thead className="bg-muted text-muted-foreground">
                                <tr>
                                  <th className="text-left px-3 py-2">Date</th>
                                  <th className="text-left px-3 py-2">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-muted/20">
                                  <td className="px-3 py-2">2024-01-01</td>
                                  <td className="px-3 py-2">85.2</td>
                                </tr>
                                <tr className="hover:bg-muted/20">
                                  <td className="px-3 py-2">2024-01-15</td>
                                  <td className="px-3 py-2">87.1</td>
                                </tr>
                                <tr className="hover:bg-muted/20">
                                  <td className="px-3 py-2">2024-02-01</td>
                                  <td className="px-3 py-2">83.9</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Impact Analysis</h4>
                            <div className="text-xs space-y-1">
                              <p><span className="font-medium">Correlation:</span> 0.74 (Strong)</p>
                              <p><span className="font-medium">Forecast Lift:</span> +12.3%</p>
                              <p><span className="font-medium">Data Quality:</span> High</p>
                              <p><span className="font-medium">Coverage:</span> 98.2%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // File or foundry object preview
                      <table className="min-w-full text-xs border border-border rounded">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2">SKU</th>
                            <th className="text-left px-3 py-2">Location</th>
                            <th className="text-left px-3 py-2">On-hand</th>
                            <th className="text-left px-3 py-2">On-order</th>
                            <th className="text-left px-3 py-2">Backorder</th>
                            <th className="text-left px-3 py-2">Lead Time (d)</th>
                            <th className="text-left px-3 py-2">μ Demand</th>
                            <th className="text-left px-3 py-2">σ Demand</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workbookData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/20">
                              <td className="px-3 py-2">{row.sku}</td>
                              <td className="px-3 py-2">{row.location}</td>
                              <td className="px-3 py-2"><Input value={row.onHand.toString()} className="w-20" /></td>
                              <td className="px-3 py-2"><Input value={row.onOrder.toString()} className="w-20" /></td>
                              <td className="px-3 py-2"><Input value={row.backorder.toString()} className="w-20" /></td>
                              <td className="px-3 py-2"><Input value={row.leadTime.toString()} className="w-20" /></td>
                              <td className="px-3 py-2"><Input value={row.demandMean.toString()} className="w-20" /></td>
                              <td className="px-3 py-2"><Input value={row.demandStd.toString()} className="w-20" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a file to preview.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>← Back</Button>
        <Button size="sm" onClick={() => handleStepTransition(2)}>Continue to Data Gaps →</Button>
      </div>
    </div>
  );

  // ---------- Step 2 (Inventory-First Insights) ----------
  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detects inventory-specific issues like lead-time variability, service gaps by ABC, and stock imbalance.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowImputedReview(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">ABC Service Coverage</div>
            <div className="text-2xl font-bold text-emerald-700">A: 97% / B: 94% / C: 89%</div>
            <div className="text-[11px] text-muted-foreground mt-1">Target ≥ A: 98%, B: 95%, C: 90%</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br bg-amber-50 border-amber-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">Lead-Time CV</div>
            <div className="text-2xl font-bold text-amber-700">0.34</div>
            <div className="text-[11px] text-muted-foreground mt-1">High variability on 12 SKUs</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br bg-sky-50 border-sky-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">Supplier Reliability</div>
            <div className="text-2xl font-bold text-sky-700">92.1%</div>
            <div className="text-[11px] text-muted-foreground mt-1">OTIF {"<"} 90% for 3 suppliers</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br bg-violet-50 border-violet-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">Dead/Slow Movers</div>
            <div className="text-2xl font-bold text-violet-700">36</div>
            <div className="text-[11px] text-muted-foreground mt-1">Recommend: review phase-out & transfer</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br bg-amber-50 border-amber-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">Overstock Hotspots</div>
            <div className="text-2xl font-bold text-amber-700">5</div>
            <div className="text-[11px] text-muted-foreground mt-1">₹ 28.3L tied-up capital</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br bg-red-50 border-red-200">
          <CardContent className="p-4 relative">
            <div className="text-xs text-muted-foreground mb-1">Stockout Hotspots</div>
            <div className="text-2xl font-bold text-red-700">2</div>
            <div className="text-[11px] text-muted-foreground mt-1">High risk within next 2 weeks</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h3 className="text-base font-medium text-foreground">Issues by Category</h3></CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={gapsBarData} options={gapsBarOptions} />
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader><h3 className="text-base font-medium text-foreground">Inventory Exposure by Location (₹ Lakhs)</h3></CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={exposureBarData} options={exposureBarOptions} />
          </CardContent>
        </Card>

      </div>

      <Card>
        <CardHeader><h3 className="text-base font-medium text-foreground">High-Risk SKUs (Top 10)</h3></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border rounded">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">ABC</th>
                <th className="text-left px-3 py-2">Location</th>
                <th className="text-left px-3 py-2">Risk Reason</th>
                <th className="text-left px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({length:10}).map((_,i)=> (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-3 py-2">SKU{(100+i)}</td>
                  <td className="px-3 py-2">{["A","B","C"][i%3]}</td>
                  <td className="px-3 py-2">{["Delhi","Mumbai","Bengaluru"][i%3]} FC</td>
                  <td className="px-3 py-2">{["Lead-time CV high","Overstock","Service < target","Supplier OTIF < 90%"][i%4]}</td>
                  <td className="px-3 py-2">
                    <Button size="sm" variant="outline">Auto-fix</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showImputedReview && (
        <Card>
          <CardHeader><h3 className="text-base font-medium text-foreground">Review Imputed Values</h3></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm border border-border rounded">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">SKU</th>
                  <th className="text-left px-3 py-2">Field</th>
                  <th className="text-left px-3 py-2">Original</th>
                  <th className="text-left px-3 py-2">AI Imputed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sku: "SKU001", field: "Lead Time", original: "", imputed: 12 },
                  { sku: "SKU003", field: "On-order", original: "", imputed: 120 },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="px-3 py-2">{row.sku}</td>
                    <td className="px-3 py-2">{row.field}</td>
                    <td className="px-3 py-2 text-red-700">{row.original || "Missing"}</td>
                    <td className="px-3 py-2"><Input className="w-24" value={row.imputed.toString()} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>← Back</Button>
        <Button size="sm" onClick={() => handleStepTransition(3)}>Continue to Review →</Button>
      </div>
    </div>
  );

  // ---------- Step 3 (Review Data & Policy + Network Diagram) ----------
  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Review Data & Configure Policies</h2>
          <p className="text-sm text-muted-foreground">Tune service levels, costs, and lead-time model. Visualize single vs multi-echelon flows.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={echelonMode==='single'?'default':'outline'} onClick={()=>setEchelonMode('single')}>
            Single Echelon
          </Button>
          <Button size="sm" variant={echelonMode==='multi'?'default':'outline'} onClick={()=>setEchelonMode('multi')}>
            Multi Echelon
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Policy Targets</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Target Service Level (%)</label>
              <Input type="number" value={serviceLevel} onChange={(e)=>setServiceLevel(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Holding Cost (% per year)</label>
              <Input type="number" value={holdingCostPct} onChange={(e)=>setHoldingCostPct(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Ordering Cost (₹ per order)</label>
              <Input type="number" value={orderingCost} onChange={(e)=>setOrderingCost(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Lead Time Model</label>
              <Select value={leadTimeMode} onValueChange={(v: "static"|"variable")=>setLeadTimeMode(v)}>
                <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="variable">Variable (Probabilistic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Network Diagram ({echelonMode === 'single' ? 'Single' : 'Multi'}-Echelon)</CardTitle></CardHeader>
          <CardContent>
            <NetworkDiagram mode={echelonMode} />
            <div className="text-[11px] text-muted-foreground mt-2">
              {echelonMode === 'single'
                ? "Plant ships directly to stores; ROP/Safety Stock per store only."
                : "Plant → DCs → Stores; safety stock pooled at DCs + local buffers at stores."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lead Time Distribution</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <Bar data={leadTimeHist} options={histOptions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Policy Workbook</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border rounded">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">ABC</th>
                <th className="text-left px-3 py-2">Target Service</th>
                <th className="text-left px-3 py-2">Reorder Point</th>
                <th className="text-left px-3 py-2">Safety Stock</th>
                <th className="text-left px-3 py-2">Order Qty</th>
                <th className="text-left px-3 py-2">Policy</th>
              </tr>
            </thead>
            <tbody>
              {policyRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="px-3 py-2">{r.sku}</td>
                  <td className="px-3 py-2">{r.abc}</td>
                  <td className="px-3 py-2"><Input defaultValue={r.service} className="w-24" /></td>
                  <td className="px-3 py-2"><Input defaultValue={r.reorderPoint} className="w-24" /></td>
                  <td className="px-3 py-2"><Input defaultValue={r.safetyStock} className="w-24" /></td>
                  <td className="px-3 py-2"><Input defaultValue={r.orderQty} className="w-24" /></td>
                  <td className="px-3 py-2">{r.policy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>← Back</Button>
        <Button size="sm" onClick={() => handleStepTransition(4)}>Optimize Inventory →</Button>
      </div>
    </div>
  );

  // ---------- Step 4 (Results) ----------
  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-108px)]">
      {/* Left Sidebar */}
      <div className="w-full sm:w-[30%] lg:w-[25%] xl:w-[20%] bg-card border-r p-4 flex flex-col h-[calc(100vh-108px)] max-h-screen">
        <div className="flex-none">
          <h2 className="text-xl font-bold text-foreground mb-2">Inventory Results</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        <div className="flex-1 grid grid-rows-5 gap-3 min-h-0 mt-3">
          <div className="min-h-0">
            <ForecastCard
              className="h-full"
              title="FILL RATE"
              value={(kpi.fillRate*100).toFixed(1) + '%'}
              subtitle="post-optimization"
              icon={ShieldCheck}
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
          </div>
          <div className="min-h-0">
            <ForecastCard
              className="h-full"
              title="STOCKOUTS AVOIDED"
              value={`${kpi.stockoutsAvoided}`}
              subtitle="last 90 days projection"
              icon={Boxes}
              isActive={activeTab === "policies"}
              onClick={() => setActiveTab("policies")}
            />
          </div>
          <div className="min-h-0">
            <ForecastCard
              className="h-full"
              title="WORKING CAPITAL"
              value={`₹${kpi.workingCapital.toFixed(1)} Cr`}
              subtitle="inventory tied up"
              icon={Wallet}
              isActive={activeTab === "capital"}
              onClick={() => setActiveTab("capital")}
            />
          </div>
          <div className="min-h-0">
            <ForecastCard
              className="h-full"
              title="WORKBOOK"
              value="Data Table"
              subtitle="Optimized policies"
              icon={Wallet}
              isActive={activeTab === "workbook"}
              onClick={() => setActiveTab("workbook")}
            />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Inventory Overview"}
              {activeTab === "policies" && "Policy Insights"}
              {activeTab === "capital" && "Capital & Cost Impact"}
              {activeTab === "workbook" && "Policy Workbook"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Overall inventory health and risk bands"}
              {activeTab === "policies" && "SKU-level reorder points and suggested policy types"}
              {activeTab === "capital" && "Working capital and carrying cost implications"}
              {activeTab === "workbook" && "Interactive data table for governance and edit tracking"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>← Back</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button><Share className="w-4 h-4 mr-2" />Share</Button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card className="shadow-card border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">{(kpi.fillRate*100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Fill Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">Inventory Turns</div>
                  <div className="text-lg font-semibold text-primary mt-1">{kpi.turns}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Carrying Cost</div>
                  <div className="text-2xl font-bold text-primary mb-1">{(kpi.carryingCost*100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">annualized</div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                <Card className="shadow-card border-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Backorders (proj.)</span>
                      <Badge variant="secondary" className="bg-success/10 text-emerald-700 text-xs">↓ 11%</Badge>
                    </div>
                    <div className="text-lg font-bold">Lower Risk</div>
                  </CardContent>
                </Card>
                <Card className="shadow-card border-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Supplier Risk</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Moderate</Badge>
                    </div>
                    <div className="text-lg font-bold">Monitor</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-card border-0 mb-4 flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Stock Position vs Reorder Bands</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" aria-label="Chart options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-50">
                    <DropdownMenuLabel>Chart controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">This chart overlays stock position against ROP and safety stock bands.</DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[calc(100vh-500px)]">
                  <Line data={stockPositionData as any} options={stockPositionOptions} />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "policies" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Reorder Point Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: ["<200","200-400","400-600","600-800","800+"],
                      datasets: [{ label: "SKUs", data: [12, 36, 58, 44, 23], backgroundColor: "rgba(16,185,129,0.5)" }],
                    }}
                    options={buildChartOptions({ plugins: { legend: { position: "top" } } })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Service Level Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]"><Pie data={serviceLevelPie} options={pieOptions} /></div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "capital" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-card border-0">
              <CardHeader><CardTitle>Working Capital Trend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: ["Q1","Q2","Q3","Q4","Q1","Q2"],
                      datasets: [
                        { label: "Before", data: [5.4,5.2,5.0,4.9,4.8,4.7], borderWidth:2, tension:0.35, borderColor: "rgba(239,68,68,0.8)", pointRadius:0 },
                        { label: "After", data: [4.9,4.7,4.5,4.4,4.3,4.2], borderWidth:2, tension:0.35, borderDash:[6,4], borderColor: "rgba(16,185,129,0.8)", pointRadius:0 },
                      ]
                    }}
                    options={buildChartOptions({ plugins:{ legend:{ position:"bottom" }}})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader><CardTitle>Carrying Cost Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: ["Storage","Capital","Obsolescence","Shrinkage","Handling"],
                      datasets: [{ label: "₹ Lakhs / Qtr", data: [18, 22, 9, 6, 12], backgroundColor: "rgba(59,130,246,0.5)" }]
                    }}
                    options={buildChartOptions({ plugins:{ legend:{ position:"top" }}})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "workbook" && (
          <div className="mb-6"><WorkbookTable /></div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {isLoading && <ScientificLoader message={`Processing Step ${currentStep + 1}...`} size="lg" />}
    </div>
  );
};

export default InventoryOptimization;