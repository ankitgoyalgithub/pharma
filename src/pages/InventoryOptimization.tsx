import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScientificLoader } from "@/components/ScientificLoader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import pptx from "pptxgenjs";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  FileText,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Share,
  MoreHorizontal,
  AlertTriangle,
  X,
  Database,
  Upload,
  Plus,
  Info,
  Trash2,
  Shield,
  Wand2,
  Boxes,
  ShieldCheck,
  Wallet,
  Zap,
  Activity,
  Target,
  ZoomIn,
  ZoomOut,
  MessageCircle,
  Filter,
  TrendingDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { ForecastCard } from "@/components/ForecastCard";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { getExternalDriverData } from "@/data/demandForecasting/externalDriversData";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";
import { InventoryAnalysisChart } from "@/components/InventoryAnalysisChart";
import { InventoryScenarioCreation } from "@/components/InventoryScenarioCreation";
import { getFoundryObjectData } from "@/data/foundry";

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
import { Line, Bar, Pie } from "react-chartjs-2";

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

// Sample AI responses
const sampleAiResponses = [
  "Based on current inventory levels, I recommend increasing safety stock for Widget A by 15% to maintain 95% service level during peak season.",
  "Analysis shows that Lead Time variability is impacting stockout risk. Consider negotiating shorter lead times with suppliers or adding buffer stock.",
  "The current reorder point for SKU002 appears too low. Increasing it by 10% would reduce stockout probability by 23%.",
  "Cost optimization suggests consolidating orders for Component B to reduce ordering costs while maintaining service levels.",
  "Inventory turnover rate is below target. Consider implementing more frequent reviews for slow-moving SKUs.",
];

// Network Diagram Components
type EchelonMode = "single" | "multi";

const Node: React.FC<{ x: number; y: number; label: string; kind: "plant" | "dc" | "store" }> = ({ x, y, label, kind }) => {
  const color = kind === "plant" ? "#22c55e" : kind === "dc" ? "#3b82f6" : "#f59e0b";
  return (
    <g>
      <rect x={x - 48} y={y - 18} rx="10" ry="10" width="96" height="36" fill={color} opacity="0.9" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fill="#ffffff">
        {label}
      </text>
    </g>
  );
};

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => {
  const dx = x2 - x1,
    dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len,
    uy = dy / len;
  const ax = x2 - ux * 12,
    ay = y2 - uy * 12;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - ux * 12} y2={y2 - uy * 12} stroke="#94a3b8" strokeWidth="2" />
      <polygon points={`${ax},${ay} ${ax - uy * 6},${ay + ux * 6} ${ax + uy * 6},${ay - ux * 6}`} fill="#94a3b8" />
    </g>
  );
};

const NetworkDiagram: React.FC<{ mode: EchelonMode }> = ({ mode }) => {
  return (
    <div className="w-full h-[280px] bg-muted rounded-lg border flex items-center justify-center">
      <svg viewBox="0 0 800 240" className="w-full h-full">
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

const InventoryOptimization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{ name: string; type: "master" | "transactional"; fromDate?: Date; toDate?: Date }>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

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
    initialStep: currentStep,
  });

  const { setOnStepClick } = useStepperContext();

  const handleStepClick = React.useCallback(
    (stepId: number) => {
      const targetStep = stepperSteps.find((s) => s.id === stepId);
      if (targetStep && (targetStep.status === "completed" || stepId === currentStep + 1 || stepId === currentStep)) {
        setCurrentStep(stepId);
      }
    },
    [currentStep, stepperSteps]
  );

  useEffect(() => {
    setOnStepClick(() => handleStepClick);
  }, [handleStepClick, setOnStepClick]);

  useEffect(() => {
    window.scrollTo({ top: 60, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (currentStep === 4) {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  }, [currentStep]);

  const [driversLoading, setDriversLoading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  const [serviceLevel, setServiceLevel] = useState<number>(95);
  const [holdingCostPct, setHoldingCostPct] = useState<number>(14);
  const [orderingCost, setOrderingCost] = useState<number>(1500);
  const [leadTimeMode, setLeadTimeMode] = useState<"static" | "variable">("variable");
  const [echelonMode, setEchelonMode] = useState<EchelonMode>("single");

  const handleFoundrySubmit = (data: {
    selectedObjects: string[];
    selectedDataType: "master" | "timeseries" | "featureStore";
    fromDate?: Date;
    toDate?: Date;
  }) => {
    const newObjects = data.selectedObjects.map((objName) => ({
      name: objName,
      type: data.selectedDataType === "timeseries" ? ("transactional" as const) : ("master" as const),
      ...(data.selectedDataType === "timeseries" && { fromDate: data.fromDate, toDate: data.toDate }),
    }));

    setFoundryObjects((prev) => [...prev, ...newObjects]);

    if (data.selectedObjects.length > 0) {
      setSelectedPreview(data.selectedObjects[0]);
      setPreviewLoading(true);
      setTimeout(() => setPreviewLoading(false), 700);
    }
  };

  const [activeTab, setActiveTab] = useState<"overview" | "policies" | "capital" | "workbook" | "quality">("overview");
  const [showImputedReview, setShowImputedReview] = useState(false);
  const [chartGranularity, setChartGranularity] = useState<"daily" | "weekly" | "monthly" | "quarterly">("weekly");

  const handleZoomIn = () => {
    const levels: Array<"daily" | "weekly" | "monthly" | "quarterly"> = ["quarterly", "monthly", "weekly", "daily"];
    const currentIndex = levels.indexOf(chartGranularity);
    if (currentIndex < levels.length - 1) {
      setChartGranularity(levels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const levels: Array<"daily" | "weekly" | "monthly" | "quarterly"> = ["quarterly", "monthly", "weekly", "daily"];
    const currentIndex = levels.indexOf(chartGranularity);
    if (currentIndex > 0) {
      setChartGranularity(levels[currentIndex - 1]);
    }
  };

  // Right sidebar state
  const [rightSidebarTab, setRightSidebarTab] = useState<"ai" | "filter" | "scenario">("filter");
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [scenarios, setScenarios] = useState<
    Array<{
      id: string;
      name: string;
      value: string;
      subtitle: string;
      factors?: any;
    }>
  >([]);
  const [filterValues, setFilterValues] = useState({
    skuProduct: "all",
    location: "all",
    channel: "all",
    timePeriod: "all",
    businessUnits: "all",
    dataAvailability: "all",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isScenarioDialogOpen, setIsScenarioDialogOpen] = useState(false);

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
    if (hasData && selectedDrivers.length === 0) {
      setDriversLoading(true);
      setTimeout(() => {
        const driversToSelect = [
          { name: "Lead Time Variability", autoSelected: true },
          { name: "Supplier Reliability", autoSelected: true },
          { name: "Seasonal Patterns", autoSelected: true },
        ];
        setSelectedDrivers(driversToSelect.filter((d) => d.autoSelected).map((d) => d.name));
        setDriversLoading(false);
      }, 500);
    }
  }, [uploadedFiles.length, foundryObjects.length]);

  const toggleDriver = (driver: string) => {
    setSelectedDrivers((prev) => (prev.includes(driver) ? prev.filter((d) => d !== driver) : [...prev, driver]));
  };

  const handleStepTransition = (nextStep: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsLoading(false);
    }, 1500);
  };

  const createScenario = (scenario: any) => {
    if (scenarios.length >= 3) {
      alert("Maximum 3 scenarios allowed");
      return;
    }
    setScenarios((prev) => [...prev, scenario]);
    setSelectedScenario(scenario.id);
    setActiveTab("overview");
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
    if (selectedScenario === scenarioId) {
      setSelectedScenario(null);
      setActiveTab("overview");
    }
  };

  const sendAiMessage = () => {
    if (!aiPrompt.trim()) return;

    const userMessage = { role: "user" as const, content: aiPrompt };
    const randomResponse = sampleAiResponses[Math.floor(Math.random() * sampleAiResponses.length)];
    const assistantMessage = { role: "assistant" as const, content: randomResponse };

    setAiMessages((prev) => [...prev, userMessage, assistantMessage]);
    setAiPrompt("");
  };

  const applyFilters = () => {
    console.log("Filters applied:", filterValues);
  };

  // Export PPTX functionality
  const exportToPPTX = () => {
    const presentation = new pptx();
    presentation.layout = "LAYOUT_WIDE";

    const titleSlide = presentation.addSlide();
    titleSlide.addText("Inventory Optimization Results", {
      x: 0.5,
      y: 2.0,
      w: "90%",
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: "1E40AF",
      align: "center",
    });
    titleSlide.addText(`Generated on ${format(new Date(), "MMMM dd, yyyy")}`, {
      x: 0.5,
      y: 3.5,
      w: "90%",
      h: 0.5,
      fontSize: 18,
      color: "64748B",
      align: "center",
    });

    presentation.writeFile({ fileName: `Inventory_Optimization_${format(new Date(), "yyyy-MM-dd")}.pptx` });
    toast.success("PPTX exported successfully!");
  };

  const exportToCSV = () => {
    toast.success("CSV exported successfully!");
  };

  const exportToXLSX = () => {
    toast.success("XLSX exported successfully!");
  };

  const exportToCanva = () => {
    toast.success("Opening in Canva...");
  };

  const exportToUpsynqLink = () => {
    const shareLink = `${window.location.origin}${window.location.pathname}?share=true&step=4`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Upsynq link copied to clipboard!");
  };

  // Sample data for workbook, policies, gaps
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
    indexAxis: "y" as const,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Number of Issues" } },
      y: { ticks: { autoSkip: false } },
    },
  });

  const leadTimeHist = {
    labels: ["0-5", "6-10", "11-15", "16-20", "21-25", "26-30", "31+"],
    datasets: [
      {
        label: "Frequency",
        data: [3, 8, 15, 20, 12, 6, 2],
        backgroundColor: hslVar("--chart-1", 0.6),
        borderColor: hslVar("--chart-1"),
        borderWidth: 1,
      },
    ],
  };

  const histOptions: any = buildChartOptions({
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Count" } },
      x: { title: { display: true, text: "Lead Time (days)" } },
    },
  });

  // Step 1 - Add Data
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  const externalDrivers = getExternalDrivers("inventory-optimization", hasData);

  const renderStep1 = () => (
    <div className="space-y-6 pt-10 px-0 pb-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload all your data files at once. You can also select external factors to include in the model.</p>
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
                <p>Upload your inventory data, product master data, and other relevant files. Supported formats: CSV, Excel, JSON.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload multiple files at once. Supported formats: CSV, Excel, JSON. {" "}
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                // Create and download Excel template
                const link = document.createElement('a');
                link.href = '#'; // This would be the actual template file URL
                link.download = 'inventory-data-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Multiple Files
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
          
          <Input
            id="file-upload"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
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
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span className="text-foreground">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
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
                          <Badge variant="secondary" className="text-xs">
                            {obj.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
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
        title="External Drivers"
        description="External factors that may influence inventory patterns. Toggle AI suggestions on/off and manually select additional drivers."
        drivers={externalDrivers}
        selectedDrivers={selectedDrivers}
        driversLoading={driversLoading}
        onToggleDriver={toggleDriver}
        onPreviewDriver={(driverName) => {
          setSelectedPreview(driverName);
          setPreviewLoading(true);
          setTimeout(() => setPreviewLoading(false), 700);
        }}
        showManualControls={true}
      />

      {(uploadedFiles.length > 0 || foundryObjects.length > 0 || selectedDrivers.length > 0) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 flex-wrap">
                  {uploadedFiles.map((file, index) => (
                    <Button
                      key={file.name}
                      size="sm"
                      variant={selectedPreview === file.name ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(file.name);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      {file.name.split('.')[0]}
                    </Button>
                  ))}
                  {foundryObjects.map((obj, index) => (
                    <Button
                      key={obj.name}
                      size="sm"
                      variant={selectedPreview === obj.name ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(obj.name);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <Database className="h-3 w-3 mr-1" />
                      {obj.name.split('_')[0]}
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
                      // External driver preview - showing Foundry format data
                      <div className="space-y-4">
                        {(() => {
                          const driverData = getExternalDriverData(selectedPreview || "");
                          if (!driverData || driverData.length === 0) {
                            return <p className="text-sm text-muted-foreground">No data available for this driver.</p>;
                          }
                          
                          // Get column headers from first data object
                          const columns = Object.keys(driverData[0]);
                          
                          return (
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Sample Data Points</h4>
                                <table className="min-w-full text-xs border border-border rounded">
                                  <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                      {columns.map((col) => (
                                        <th key={col} className="text-left px-3 py-2 capitalize">
                                          {col.replace(/_/g, ' ')}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {driverData.slice(0, 3).map((row, idx) => (
                                      <tr key={idx} className="hover:bg-muted/20">
                                        {columns.map((col) => (
                                          <td key={col} className="px-3 py-2">
                                            {String((row as any)[col])}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-2">
                                <div><strong>Data Points:</strong> {driverData.length} records</div>
                                <div><strong>Source:</strong> Foundry Feature Store</div>
                                <div><strong>Update Frequency:</strong> Real-time</div>
                                <div><strong>Historical Coverage:</strong> 5+ years</div>
                                <div><strong>Reliability:</strong> High (99.5% uptime)</div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : foundryObjects.some(obj => obj.name === selectedPreview) ? (
                        (() => {
                          const data = getFoundryObjectData(selectedPreview as string) as any[];
                          const columns = data.length > 0 ? Object.keys(data[0]) : [];
                          return (
                            <table className="min-w-full text-xs border border-border rounded">
                              <thead className="bg-muted text-muted-foreground">
                                <tr>
                                  {columns.map((col) => (
                                    <th key={col} className="text-left px-3 py-2 capitalize">{col.replace(/_/g, ' ')}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {data.slice(0, 10).map((row, idx) => (
                                  <tr key={idx} className="hover:bg-muted/20">
                                    {columns.map((col) => (
                                      <td key={col} className="px-3 py-2">{String((row as any)[col])}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()
                      ) : (
                        <table className="min-w-full text-xs border border-border rounded">
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              <th className="text-left px-3 py-2">SKU</th>
                              <th className="text-left px-3 py-2">Location</th>
                              <th className="text-left px-3 py-2">On-Hand</th>
                              <th className="text-left px-3 py-2">On-Order</th>
                              <th className="text-left px-3 py-2">Lead Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workbookData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-muted/20">
                                <td className="px-3 py-2">{row.sku}</td>
                                <td className="px-3 py-2">{row.location}</td>
                                <td className="px-3 py-2">
                                  <Input value={row.onHand.toString()} className="w-16" readOnly />
                                </td>
                                <td className="px-3 py-2">
                                  <Input value={row.onOrder.toString()} className="w-16" readOnly />
                                </td>
                                <td className="px-3 py-2">
                                  <Input value={row.leadTime.toString()} className="w-16" readOnly />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a file or driver to preview.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => handleStepTransition(2)}>
          Continue to Data Gaps →
        </Button>
      </div>

      <MapFromFoundryDialog
        isOpen={isFoundryModalOpen}
        onClose={() => setIsFoundryModalOpen(false)}
        onSubmit={handleFoundrySubmit}
      />
    </div>
  );

  // Step 2 - Data Gaps
  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Data Gaps & Quality Check</h2>
          <p className="text-sm text-muted-foreground">AI-detected issues and suggested corrections</p>
        </div>
        <Badge variant="secondary" className="bg-warning/10 text-warning">
          {gapData.reduce((acc, g) => acc + g.issues, 0)} issues detected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
              <span className="text-sm">Products Analyzed</span>
              <span className="font-bold text-lg">82</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="text-sm">Locations Covered</span>
              <span className="font-bold text-lg">5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
              <span className="text-sm">Avg Fill Rate</span>
              <span className="font-bold text-lg">94.2%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
              <span className="text-sm">Total Inventory Value</span>
              <span className="font-bold text-lg">₹4.2Cr</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Gap Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <Bar data={gapsBarData} options={gapsBarOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base font-medium text-foreground">Inventory Workbook Preview</h3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border rounded">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">Location</th>
                <th className="text-left px-3 py-2">On-Hand</th>
                <th className="text-left px-3 py-2">On-Order</th>
                <th className="text-left px-3 py-2">Backorder</th>
                <th className="text-left px-3 py-2">Lead Time</th>
                <th className="text-left px-3 py-2">Demand μ</th>
                <th className="text-left px-3 py-2">Demand σ</th>
              </tr>
            </thead>
            <tbody>
              {workbookData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="px-3 py-2">{row.sku}</td>
                  <td className="px-3 py-2">{row.location}</td>
                  <td className="px-3 py-2">{row.onHand}</td>
                  <td className="px-3 py-2">{row.onOrder}</td>
                  <td className="px-3 py-2">{row.backorder}</td>
                  <td className="px-3 py-2">{row.leadTime}</td>
                  <td className="px-3 py-2">{row.demandMean}</td>
                  <td className="px-3 py-2">{row.demandStd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showImputedReview && (
        <Card>
          <CardHeader>
            <h3 className="text-base font-medium text-foreground">Review Imputed Values</h3>
          </CardHeader>
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
                    <td className="px-3 py-2">
                      <Input className="w-24" value={row.imputed.toString()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => handleStepTransition(3)}>
          Continue to Review →
        </Button>
      </div>
    </div>
  );

  // Step 3 - Review Data
  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Review Data & Configure Policies</h2>
          <p className="text-sm text-muted-foreground">
            Tune service levels, costs, and lead-time model. Visualize single vs multi-echelon flows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={echelonMode === "single" ? "default" : "outline"} onClick={() => setEchelonMode("single")}>
            Single Echelon
          </Button>
          <Button size="sm" variant={echelonMode === "multi" ? "default" : "outline"} onClick={() => setEchelonMode("multi")}>
            Multi Echelon
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Target Service Level (%)</label>
              <Input type="number" value={serviceLevel} onChange={(e) => setServiceLevel(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Holding Cost (% per year)</label>
              <Input type="number" value={holdingCostPct} onChange={(e) => setHoldingCostPct(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Ordering Cost (₹ per order)</label>
              <Input type="number" value={orderingCost} onChange={(e) => setOrderingCost(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Lead Time Model</label>
              <Select value={leadTimeMode} onValueChange={(v: "static" | "variable") => setLeadTimeMode(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="variable">Variable (Probabilistic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Network Diagram ({echelonMode === "single" ? "Single" : "Multi"}-Echelon)</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkDiagram mode={echelonMode} />
            <div className="text-[11px] text-muted-foreground mt-2">
              {echelonMode === "single"
                ? "Plant ships directly to stores; ROP/Safety Stock per store only."
                : "Plant → DCs → Stores; safety stock pooled at DCs + local buffers at stores."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <Bar data={leadTimeHist} options={histOptions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Policy Workbook</CardTitle>
        </CardHeader>
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
                  <td className="px-3 py-2">
                    <Input defaultValue={r.service} className="w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Input defaultValue={r.reorderPoint} className="w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Input defaultValue={r.safetyStock} className="w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Input defaultValue={r.orderQty} className="w-24" />
                  </td>
                  <td className="px-3 py-2">{r.policy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => handleStepTransition(4)}>
          Optimize Inventory →
        </Button>
      </div>
    </div>
  );

  // Step 4 - Results (3-column layout like Demand Forecasting)
  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-108px)]">
      {/* Left Sidebar with ForecastCards */}
      <div className="w-full sm:w-[30%] lg:w-[25%] xl:w-[20%] bg-card border-r flex flex-col h-[calc(100vh-108px)] max-h-screen">
        <div className="flex-none p-4">
          <h2 className="text-xl font-bold text-foreground mb-2">Inventory Results</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        <ScrollArea className="flex-1 mt-3">
          <div className="flex flex-col items-center gap-3 pb-4 px-4">
            <div className="flex justify-center">
              <ForecastCard
                title="Inventory Snapshot"
                value="96.5%"
                subtitle={`Fill Rate • ₹4.2Cr Capital • 37 Stockouts Avoided
                          5 Locations • 82 SKUs • Optimized`}
                icon={TrendingUp}
                isActive={selectedScenario === null && activeTab === "overview"}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab("overview");
                }}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Policy Insights"
                value="65%"
                subtitle={`Class A items, Safety stock optimized
                          Reorder points adjusted`}
                icon={BarChart3}
                isActive={selectedScenario === null && activeTab === "policies"}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab("policies");
                }}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Capital Impact"
                value="₹4.2Cr"
                subtitle={`Working capital tied up
                          14% carrying cost`}
                icon={Wallet}
                isActive={selectedScenario === null && activeTab === "capital"}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab("capital");
                }}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Policy Workbook"
                value="Data Table"
                subtitle={`Optimized reorder points
                          Safety stock levels`}
                icon={Package}
                isActive={selectedScenario === null && activeTab === "workbook"}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab("workbook");
                }}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Data Quality Review"
                value="98.1%"
                subtitle="Completeness score, 2 missing values imputed. AI-enhanced integrity verified."
                icon={Shield}
                isActive={selectedScenario === null && activeTab === "quality"}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab("quality");
                }}
              />
            </div>

            {/* Dynamic Scenarios */}
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="relative group flex justify-center">
                <ForecastCard
                  title={scenario.name}
                  value={scenario.value}
                  subtitle={scenario.subtitle}
                  icon={Wand2}
                  isActive={selectedScenario === scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScenario(scenario.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-auto pt-4 max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Inventory Overview"}
              {activeTab === "policies" && "Policy Insights"}
              {activeTab === "capital" && "Capital & Cost Impact"}
              {activeTab === "workbook" && "Policy Workbook"}
              {activeTab === "quality" && "Data Quality Review"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Comprehensive inventory insights and analytics"}
              {activeTab === "policies" && "Reorder points, safety stock, and policy recommendations"}
              {activeTab === "workbook" && "Interactive data table with optimization results"}
              {activeTab === "capital" && "Working capital analysis and cost optimization"}
              {activeTab === "quality" && "Data integrity assessment and AI-enhanced quality insights"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              ← Back
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export As
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToPPTX}>
                  <FileText className="w-4 h-4 mr-2" />
                  PPTX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToXLSX}>
                  <FileText className="w-4 h-4 mr-2" />
                  XLSX
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCanva}>
                  <Share className="w-4 h-4 mr-2" />
                  Canva
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToUpsynqLink}>
                  <Share className="w-4 h-4 mr-2" />
                  Upsynq Unique Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Content based on active tab */}
        {selectedScenario ? (
          <>
            {/* Scenario Comparison View */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Scenario Analysis: {scenarios.find((s) => s.id === selectedScenario)?.name}</h2>
                  <p className="text-muted-foreground">Comparison with baseline inventory</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                  ← Back to Overview
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Scenario vs Baseline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Line
                        data={{
                          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
                          datasets: [
                            {
                              label: "Baseline Stock",
                              data: [1000, 1100, 1050, 1200, 1150, 1250],
                              borderColor: "hsl(220, 13%, 69%)",
                              backgroundColor: "hsl(220, 13%, 69%, 0.1)",
                              borderWidth: 2,
                            },
                            {
                              label: "Scenario Stock",
                              data: [1050, 1180, 1120, 1280, 1230, 1330],
                              borderColor: "hsl(142, 76%, 36%)",
                              backgroundColor: "hsl(142, 76%, 36%, 0.1)",
                              borderWidth: 3,
                            },
                          ],
                        }}
                        options={buildChartOptions({ animation: { duration: 0 } })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Impact Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <div className="text-lg font-bold text-success">+6.5%</div>
                          <div className="text-xs text-muted-foreground">Service Level Impact</div>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">-₹0.5M</div>
                          <div className="text-xs text-muted-foreground">Capital Reduction</div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Stockouts Avoided</span>
                          <Badge variant="secondary" className="bg-info/10 text-info">
                            +12
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <Badge variant="secondary" className="bg-warning/10 text-warning">
                            Low
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Confidence Score</span>
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            92%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Regular Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <TooltipProvider>
                  <Card className="bg-gradient-to-br from-card via-card to-muted/20 shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-base font-medium">Inventory Analysis</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomIn}
                          disabled={chartGranularity === "daily"}
                          className="h-8 w-8"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomOut}
                          disabled={chartGranularity === "quarterly"}
                          className="h-8 w-8"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>View Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Export Chart</DropdownMenuItem>
                            <DropdownMenuItem>Download Data</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <InventoryAnalysisChart chartGranularity={chartGranularity} valueMode="stock" productFilter="all" locationFilter="all" />
                    </CardContent>
                  </Card>
                </TooltipProvider>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                      <ShieldCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">96.5%</div>
                      <p className="text-xs text-muted-foreground">+2.3% from baseline</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Stockouts Avoided</CardTitle>
                      <Boxes className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">37</div>
                      <p className="text-xs text-muted-foreground">In last 90 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
                      <Wallet className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹4.2Cr</div>
                      <p className="text-xs text-muted-foreground">Inventory tied up</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inventory Turns</CardTitle>
                      <Activity className="h-4 w-4 text-info" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">9.1x</div>
                      <p className="text-xs text-muted-foreground">Annual turnover</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "policies" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reorder Points by ABC Class</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Bar
                        data={{
                          labels: ["Class A", "Class B", "Class C"],
                          datasets: [
                            {
                              label: "Avg Reorder Point",
                              data: [650, 380, 200],
                              backgroundColor: [
                                hslVar("--chart-1", 0.6),
                                hslVar("--chart-2", 0.6),
                                hslVar("--chart-3", 0.6),
                              ],
                            },
                          ],
                        }}
                        options={buildChartOptions({})}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Safety Stock Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Pie
                        data={{
                          labels: ["Class A", "Class B", "Class C"],
                          datasets: [
                            {
                              data: [45, 35, 20],
                              backgroundColor: [
                                hslVar("--chart-1", 0.8),
                                hslVar("--chart-2", 0.8),
                                hslVar("--chart-3", 0.8),
                              ],
                            },
                          ],
                        }}
                        options={buildChartOptions({})}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "capital" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Total Investment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">₹4.2Cr</div>
                      <p className="text-sm text-muted-foreground mt-2">Working capital tied up in inventory</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Carrying Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-warning">14%</div>
                      <p className="text-sm text-muted-foreground mt-2">Annual carrying cost rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Potential Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-success">₹0.6Cr</div>
                      <p className="text-sm text-muted-foreground mt-2">Through optimization</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "workbook" && (
              <Card>
                <CardHeader>
                  <CardTitle>Policy Workbook</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-border rounded">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="text-left px-3 py-2">SKU</th>
                        <th className="text-left px-3 py-2">ABC</th>
                        <th className="text-left px-3 py-2">Service Level</th>
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
                          <td className="px-3 py-2">{r.service}%</td>
                          <td className="px-3 py-2">{r.reorderPoint}</td>
                          <td className="px-3 py-2">{r.safetyStock}</td>
                          <td className="px-3 py-2">{r.orderQty}</td>
                          <td className="px-3 py-2">{r.policy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {activeTab === "quality" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completeness Score</span>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          98.1%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Missing Values</span>
                        <Badge variant="secondary" className="bg-info/10 text-info">
                          2 imputed
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Duplicate Records</span>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">
                          0 found
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Enhancements</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          3 applied
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Sidebar - AI Chat, Filters, Scenarios */}
      <div className={`${rightSidebarCollapsed ? "w-12" : "w-80"} bg-card border-l transition-all duration-300 flex flex-col h-[calc(100vh-108px)]`}>
        {rightSidebarCollapsed ? (
          <div className="flex flex-col items-center py-4 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarCollapsed(false);
                setRightSidebarTab("ai");
              }}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarCollapsed(false);
                setRightSidebarTab("filter");
              }}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarCollapsed(false);
                setRightSidebarTab("scenario");
              }}
            >
              <Wand2 className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-2">
                <Button variant={rightSidebarTab === "ai" ? "default" : "ghost"} size="sm" onClick={() => setRightSidebarTab("ai")}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI
                </Button>
                <Button variant={rightSidebarTab === "filter" ? "default" : "ghost"} size="sm" onClick={() => setRightSidebarTab("filter")}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant={rightSidebarTab === "scenario" ? "default" : "ghost"} size="sm" onClick={() => setRightSidebarTab("scenario")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Scenario
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setRightSidebarCollapsed(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              {rightSidebarTab === "ai" && (
                <div className="h-full flex flex-col p-4">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {aiMessages.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center mt-8">Ask me anything about your inventory optimization results!</div>
                    ) : (
                      aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.role === "user" ? "bg-primary/10 ml-4" : "bg-muted mr-4"
                          }`}
                        >
                          <div className="text-xs font-medium mb-1">{msg.role === "user" ? "You" : "AI Assistant"}</div>
                          <div className="text-sm">{msg.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask about inventory..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendAiMessage();
                        }
                      }}
                    />
                    <Button onClick={sendAiMessage} size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {rightSidebarTab === "filter" && (
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>SKU / Product</Label>
                    <Select value={filterValues.skuProduct} onValueChange={(val) => setFilterValues((prev) => ({ ...prev, skuProduct: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="widget-a">Widget A</SelectItem>
                        <SelectItem value="component-b">Component B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={filterValues.location} onValueChange={(val) => setFilterValues((prev) => ({ ...prev, location: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="delhi">Delhi FC</SelectItem>
                        <SelectItem value="mumbai">Mumbai FC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Select value={filterValues.timePeriod} onValueChange={(val) => setFilterValues((prev) => ({ ...prev, timePeriod: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last-30">Last 30 Days</SelectItem>
                        <SelectItem value="last-90">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              )}

              {rightSidebarTab === "scenario" && (
                <div className="p-4 space-y-4">
                  <Button className="w-full" onClick={() => setIsScenarioDialogOpen(true)} disabled={scenarios.length >= 3}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Scenario
                  </Button>

                  <div className="text-xs text-muted-foreground">{scenarios.length}/3 scenarios created</div>

                  <div className="text-sm text-muted-foreground">
                    Create what-if scenarios to model different inventory conditions and policies.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <InventoryScenarioCreation isOpen={isScenarioDialogOpen} onClose={() => setIsScenarioDialogOpen(false)} onCreateScenario={createScenario} />
    </div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="px-4 py-6">
          {renderStep()}
        </div>
        {isLoading && (
          <ScientificLoader 
            message={`Processing Step ${currentStep + 1}...`}
            size="lg"
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default InventoryOptimization;
