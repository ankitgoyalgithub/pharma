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
  Settings,
  CheckCircle,
  AlertCircle,
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
import { InventoryAnalysisChart } from "@/components/InventoryAnalysisChart";
import { InventoryScenarioCreation } from "@/components/InventoryScenarioCreation";
import { getFoundryObjectData } from "@/data/foundry";
import { NetworkDiagram } from "@/components/NetworkDiagram";

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

// Sample AI responses - Pharma context
const sampleAiResponses = [
  "ORS Sachet (SKU006) at DC_WEST is critically below safety stock. With monsoon season approaching, recommend emergency replenishment of 32,000 units to prevent stockouts during peak diarrheal illness period.",
  "Insulin Glargine (SKU004) requires cold chain capacity verification at DEP_EAST before any stock transfer. Current cold storage utilization at 92% - consider temporary cold chain rental.",
  "Batch B52280 of Salbutamol Inhaler expires May 2025. Recommend promotional push to hospital pharmacies or transfer to higher-velocity nodes to minimize write-off risk.",
  "Lead time variability from Hyderabad Injectables Plant to DC_NCR ranges 1-7 days. For critical injectables, recommend maintaining additional 3-day buffer stock.",
  "Vitamin D3 (SKU008) at DEP_EAST is 41% below reorder point. East region shows consistent demand - expedite order of 15,000 units before next review cycle.",
  "Ceftriaxone demand forecast indicates 18% surge in Q3 aligned with monsoon infection patterns. Pre-position additional stock at DC_NCR and DC_SOUTH.",
  "Pantoprazole and ORS show correlated demand patterns in GI therapy area. Consider bundled replenishment to optimize ordering costs.",
];

// Network Diagram Types
type EchelonMode = "single" | "multi";

const InventoryOptimization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedFileData, setParsedFileData] = useState<Record<string, { columns: string[]; rows: any[] }>>({});
  const [foundryObjects, setFoundryObjects] = useState<Array<{ name: string; type: "master" | "transactional"; fromDate?: Date; toDate?: Date }>>([]);

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

  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  const [serviceLevel, setServiceLevel] = useState<number>(95);
  const [holdingCostPct, setHoldingCostPct] = useState<number>(14);
  const [orderingCost, setOrderingCost] = useState<number>(1500);
  const [leadTimeMode, setLeadTimeMode] = useState<"static" | "variable">("variable");
  const [echelonMode, setEchelonMode] = useState<EchelonMode>("single");
  const [solver, setSolver] = useState<string>("gurobi");

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

  const [activeTab, setActiveTab] = useState<"overview" | "policies" | "workbook" | "quality">("overview");
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

  // Sample data for workbook, policies, gaps - Pharma context
  const workbookData = [
    { sku: "SKU001", product: "Paracetamol 500mg Tablet", location: "DC_NCR", onHand: 5214, onOrder: 1500, backorder: 0, leadTime: 7, demandMean: 285, demandStd: 43, therapyArea: "Analgesic" },
    { sku: "SKU004", product: "Insulin Glargine Pen", location: "DC_NCR", onHand: 2934, onOrder: 500, backorder: 0, leadTime: 7, demandMean: 145, demandStd: 17, therapyArea: "Diabetes" },
    { sku: "SKU006", product: "ORS Sachet 21g", location: "DC_WEST", onHand: 1502, onOrder: 0, backorder: 850, leadTime: 30, demandMean: 320, demandStd: 112, therapyArea: "GI" },
    { sku: "SKU007", product: "Salbutamol Inhaler", location: "DC_SOUTH", onHand: 4975, onOrder: 1500, backorder: 0, leadTime: 7, demandMean: 228, demandStd: 57, therapyArea: "Respiratory" },
    { sku: "SKU009", product: "Ceftriaxone 1g Injection", location: "DC_NCR", onHand: 4438, onOrder: 1000, backorder: 0, leadTime: 7, demandMean: 298, demandStd: 42, therapyArea: "Antibiotic" },
  ];

  const policyRows = [
    { sku: "SKU001", product: "Paracetamol 500mg", abc: "A", service: 94, reorderPoint: 3967, safetyStock: 3967, orderQty: 1500, policy: "Min/Max 3967-9774", therapyArea: "Analgesic" },
    { sku: "SKU004", product: "Insulin Glargine", abc: "A", service: 96, reorderPoint: 2025, safetyStock: 2025, orderQty: 500, policy: "Min/Max 2025-4626", therapyArea: "Diabetes" },
    { sku: "SKU006", product: "ORS Sachet", abc: "A", service: 96, reorderPoint: 4071, safetyStock: 4071, orderQty: 1000, policy: "Min/Max 4071-9012", therapyArea: "GI" },
    { sku: "SKU009", product: "Ceftriaxone 1g", abc: "A", service: 97, reorderPoint: 4438, safetyStock: 4438, orderQty: 1000, policy: "Min/Max 4438-9525", therapyArea: "Antibiotic" },
    { sku: "SKU002", product: "Azithromycin 500mg", abc: "B", service: 94, reorderPoint: 1558, safetyStock: 1558, orderQty: 1500, policy: "Min/Max 1558-6787", therapyArea: "Antibiotic" },
    { sku: "SKU003", product: "Cetirizine 10mg", abc: "B", service: 95, reorderPoint: 4226, safetyStock: 4226, orderQty: 1500, policy: "Min/Max 4226-7676", therapyArea: "Allergy" },
    { sku: "SKU010", product: "Pantoprazole 40mg", abc: "B", service: 94, reorderPoint: 4319, safetyStock: 4319, orderQty: 1500, policy: "Min/Max 4319-9132", therapyArea: "GI" },
  ];

  const gapData = [
    { bucket: "Below Safety Stock", issues: 3 },
    { bucket: "Near Expiry (< 90 days)", issues: 5 },
    { bucket: "Lead Time Variance", issues: 4 },
    { bucket: "Cold Chain Gap", issues: 1 },
    { bucket: "Overstock (> Max)", issues: 2 },
    { bucket: "Policy Mismatch", issues: 2 },
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
                
                // Parse CSV files
                files.forEach(file => {
                  if (file.name.endsWith('.csv')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target?.result as string;
                      const lines = text.split('\n').filter(line => line.trim());
                      if (lines.length > 0) {
                        const columns = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
                        const rows = lines.slice(1, 11).map(line => {
                          const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
                          const row: Record<string, string> = {};
                          columns.forEach((col, idx) => {
                            row[col] = values[idx] || '';
                          });
                          return row;
                        });
                        setParsedFileData(prev => ({
                          ...prev,
                          [file.name]: { columns, rows }
                        }));
                      }
                    };
                    reader.readAsText(file);
                  }
                });
                
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


      {(uploadedFiles.length > 0 || foundryObjects.length > 0) && (
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
                      {foundryObjects.some(obj => obj.name === selectedPreview) ? (
                        <Database className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {selectedPreview}
                    </p>
                     {foundryObjects.some(obj => obj.name === selectedPreview) ? (
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
                      ) : parsedFileData[selectedPreview || ''] ? (
                        (() => {
                          const fileData = parsedFileData[selectedPreview || ''];
                          return (
                            <table className="min-w-full text-xs border border-border rounded">
                              <thead className="bg-muted text-muted-foreground">
                                <tr>
                                  {fileData.columns.map((col) => (
                                    <th key={col} className="text-left px-3 py-2 capitalize">{col.replace(/_/g, ' ')}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {fileData.rows.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-muted/20">
                                    {fileData.columns.map((col) => (
                                      <td key={col} className="px-3 py-2">{String(row[col] || '')}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Loading file preview...
                        </div>
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
    <div className="space-y-6 pt-10 px-0 pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detected missing data and suggested imputed values.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowImputedReview(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-success/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-success">Complete</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">85%</div>
            <div className="text-xs text-muted-foreground">Data Completeness</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-warning/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-warning">Missing</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">12</div>
            <div className="text-xs text-muted-foreground">Lead Time Gaps</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-info/10 to-info/5 border-info/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-info/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-info" />
              <span className="text-xs font-medium text-info">Auto-fixed</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">8</div>
            <div className="text-xs text-muted-foreground">AI Corrections</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-destructive/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">Critical</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">4</div>
            <div className="text-xs text-muted-foreground">Requires Review</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critical Data Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Missing Lead Time Data</div>
                <div className="text-xs text-muted-foreground mt-1">12 SKUs lack supplier lead time information</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Incomplete Demand History</div>
                <div className="text-xs text-muted-foreground mt-1">8 products with less than 6 months data</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Missing Cost Parameters</div>
                <div className="text-xs text-muted-foreground mt-1">Holding & ordering costs undefined for 15 SKUs</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-info/5 border border-info/10 rounded-lg">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">ABC Classification Gaps</div>
                <div className="text-xs text-muted-foreground mt-1">6 items need ABC category assignment</div>
              </div>
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
                  <th className="text-left px-3 py-2">Manual Override</th>
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
                      <Input className="w-24" value={row.imputed.toString()} disabled />
                    </td>
                    <td className="px-3 py-2">
                      <Input className="w-24" placeholder="Override" />
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
            <CardTitle className="text-base">Planning Inputs</CardTitle>
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
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Solver</label>
              <Select value={solver} onValueChange={setSolver}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose solver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gurobi">Gurobi</SelectItem>
                  <SelectItem value="cplex">CPLEX</SelectItem>
                  <SelectItem value="cbc">CBC</SelectItem>
                  <SelectItem value="glpk">GLPK</SelectItem>
                  <SelectItem value="scip">SCIP</SelectItem>
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
                value="96.4%"
                subtitle={`Fill Rate • ₹8.6Cr Stock Value • 17 Stockouts Avoided
                          4 DCs • 10 SKUs • Pharma Optimized`}
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
                title="Insights"
                value="7"
                subtitle={`Therapy areas tracked, Antibiotics lead
                          GI highest stockout risk`}
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
                title="Replenishment Workbook"
                value="10 SKUs"
                subtitle={`MIN-MAX policies optimized
                          Cold chain requirements flagged`}
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
                value="94.2%"
                subtitle="Completeness score, 8 batch expiry gaps fixed. Cold chain compliance verified."
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
              {activeTab === "workbook" && "Policy Workbook"}
              {activeTab === "quality" && "Data Quality Review"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Comprehensive inventory insights and analytics"}
              {activeTab === "policies" && "Reorder points, safety stock, and policy recommendations"}
              {activeTab === "workbook" && "Interactive data table with optimization results"}
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
                  <Card className="bg-gradient-to-br from-card to-blue-50/10 dark:to-blue-950/10 shadow-lg">
                    <CardHeader>
                      <CardTitle>Reorder Points by ABC Class</CardTitle>
                      <p className="text-xs text-muted-foreground">Optimal reorder levels across inventory tiers</p>
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
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(168, 85, 247, 0.8)",
                                "rgba(236, 72, 153, 0.8)",
                              ],
                              borderColor: [
                                "rgba(59, 130, 246, 1)",
                                "rgba(168, 85, 247, 1)",
                                "rgba(236, 72, 153, 1)",
                              ],
                              borderWidth: 2,
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={buildChartOptions({
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: "Reorder Point (units)" },
                            },
                          },
                        })}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-purple-50/10 dark:to-purple-950/10 shadow-lg">
                    <CardHeader>
                      <CardTitle>Safety Stock Distribution</CardTitle>
                      <p className="text-xs text-muted-foreground">Buffer inventory allocation by category</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Pie
                        data={{
                          labels: ["Class A", "Class B", "Class C"],
                          datasets: [
                            {
                              data: [45, 35, 20],
                              backgroundColor: [
                                "rgba(34, 197, 94, 0.8)",
                                "rgba(251, 191, 36, 0.8)",
                                "rgba(239, 68, 68, 0.8)",
                              ],
                              borderColor: [
                                "rgba(34, 197, 94, 1)",
                                "rgba(251, 191, 36, 1)",
                                "rgba(239, 68, 68, 1)",
                              ],
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={buildChartOptions({
                          plugins: {
                            legend: {
                              position: "bottom" as const,
                              labels: {
                                padding: 15,
                                font: { size: 12 },
                              },
                            },
                          },
                        })}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-green-50/10 dark:to-green-950/10 shadow-lg">
                    <CardHeader>
                      <CardTitle>Service Level Achievement</CardTitle>
                      <p className="text-xs text-muted-foreground">Target vs actual service levels</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Line
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                          datasets: [
                            {
                              label: "Target",
                              data: [95, 95, 95, 95, 95, 95],
                              borderColor: "rgba(156, 163, 175, 0.8)",
                              borderDash: [5, 5],
                              borderWidth: 2,
                              pointRadius: 0,
                            },
                            {
                              label: "Actual",
                              data: [93.5, 94.8, 96.2, 97.1, 95.8, 96.5],
                              borderColor: "rgba(34, 197, 94, 1)",
                              backgroundColor: "rgba(34, 197, 94, 0.1)",
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={buildChartOptions({
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 90,
                              max: 100,
                              title: { display: true, text: "Service Level (%)" },
                            },
                          },
                        })}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-amber-50/10 dark:to-amber-950/10 shadow-lg">
                    <CardHeader>
                      <CardTitle>Order Frequency Analysis</CardTitle>
                      <p className="text-xs text-muted-foreground">Replenishment cycle patterns</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Bar
                        data={{
                          labels: ["Weekly", "Bi-Weekly", "Monthly", "Quarterly"],
                          datasets: [
                            {
                              label: "Number of SKUs",
                              data: [28, 35, 15, 4],
                              backgroundColor: [
                                "rgba(14, 165, 233, 0.8)",
                                "rgba(99, 102, 241, 0.8)",
                                "rgba(168, 85, 247, 0.8)",
                                "rgba(236, 72, 153, 0.8)",
                              ],
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={buildChartOptions({
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: "SKU Count" } },
                          },
                        })}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}


            {activeTab === "workbook" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Policy Workbook</h3>
                    <p className="text-sm text-muted-foreground">Interactive planning table with AI-recommended policies</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Submit for Approval
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gradient-to-r from-primary/5 to-primary/10 sticky top-0 z-10">
                          <tr>
                            <th className="text-left px-3 py-3 font-semibold">
                              <div className="flex items-center gap-1">
                                SKU
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </div>
                            </th>
                            <th className="text-left px-3 py-3 font-semibold">ABC</th>
                            <th className="text-left px-3 py-3 font-semibold">
                              <div className="flex items-center gap-1">
                                AI Recommended
                                <Badge variant="secondary" className="ml-1 text-xs bg-primary/10 text-primary">AI</Badge>
                              </div>
                            </th>
                            <th className="text-left px-3 py-3 font-semibold">
                              <div className="flex items-center gap-1">
                                Planner Override
                                <Badge variant="secondary" className="ml-1 text-xs bg-warning/10 text-warning">Manual</Badge>
                              </div>
                            </th>
                            <th className="text-left px-3 py-3 font-semibold">Service Level %</th>
                            <th className="text-left px-3 py-3 font-semibold">Reorder Point</th>
                            <th className="text-left px-3 py-3 font-semibold">Safety Stock</th>
                            <th className="text-left px-3 py-3 font-semibold">Order Qty</th>
                            <th className="text-left px-3 py-3 font-semibold">Policy Type</th>
                            <th className="text-left px-3 py-3 font-semibold">Status</th>
                            <th className="text-left px-3 py-3 font-semibold">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {policyRows.map((r, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 border-b border-border transition-colors">
                              <td className="px-3 py-3 font-medium">{r.sku}</td>
                              <td className="px-3 py-3">
                                <Badge
                                  variant="secondary"
                                  className={
                                    r.abc === "A"
                                      ? "bg-success/10 text-success"
                                      : r.abc === "B"
                                      ? "bg-warning/10 text-warning"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {r.abc}
                                </Badge>
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-xs text-success font-medium">Accepted</span>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <Select defaultValue="none">
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">No Override</SelectItem>
                                    <SelectItem value="increase">Increase +10%</SelectItem>
                                    <SelectItem value="decrease">Decrease -10%</SelectItem>
                                    <SelectItem value="custom">Custom Value</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-3">
                                <Input type="number" value={r.service} className="w-20 h-8" />
                              </td>
                              <td className="px-3 py-3">
                                <Input type="number" value={r.reorderPoint} className="w-24 h-8" />
                              </td>
                              <td className="px-3 py-3">
                                <Input type="number" value={r.safetyStock} className="w-24 h-8" />
                              </td>
                              <td className="px-3 py-3">
                                <Input type="number" value={r.orderQty} className="w-24 h-8" />
                              </td>
                              <td className="px-3 py-3">
                                <Select defaultValue={r.policy.split(" ")[0].toLowerCase()}>
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="min/max">Min/Max</SelectItem>
                                    <SelectItem value="eoq">EOQ</SelectItem>
                                    <SelectItem value="review-period">Review Period</SelectItem>
                                    <SelectItem value="(s,s)">(s, S) Policy</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-3">
                                <Badge variant="secondary" className="bg-info/10 text-info">
                                  Pending Review
                                </Badge>
                              </td>
                              <td className="px-3 py-3">
                                <Textarea placeholder="Add notes..." className="w-40 h-8 text-xs resize-none" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-success/5 border-success/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-success">{policyRows.length}</div>
                          <div className="text-xs text-muted-foreground">AI Recommendations Accepted</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-warning/5 border-warning/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-warning">0</div>
                          <div className="text-xs text-muted-foreground">Manual Overrides Pending</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">96.5%</div>
                          <div className="text-xs text-muted-foreground">Avg Service Level Target</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "quality" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">98.1%</div>
                          <div className="text-xs text-muted-foreground">Completeness</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-info/10 rounded-lg">
                          <Zap className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">2</div>
                          <div className="text-xs text-muted-foreground">AI Imputations</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">0</div>
                          <div className="text-xs text-muted-foreground">Duplicates</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">A+</div>
                          <div className="text-xs text-muted-foreground">Quality Grade</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Quality Score by Dimension</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Bar
                        data={{
                          labels: ["Accuracy", "Completeness", "Consistency", "Timeliness", "Validity"],
                          datasets: [
                            {
                              label: "Quality Score",
                              data: [96, 98, 94, 99, 97],
                              backgroundColor: [
                                "rgba(34, 197, 94, 0.8)",
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(168, 85, 247, 0.8)",
                                "rgba(251, 191, 36, 0.8)",
                                "rgba(236, 72, 153, 0.8)",
                              ],
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={buildChartOptions({
                          indexAxis: "y" as const,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { beginAtZero: true, max: 100, title: { display: true, text: "Score (%)" } },
                          },
                        })}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Validation Rules Applied</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">Lead Time Range Check</div>
                            <div className="text-xs text-muted-foreground mt-1">All values within 0-60 days ✓</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">Demand Non-Negativity</div>
                            <div className="text-xs text-muted-foreground mt-1">No negative demand values ✓</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">SKU Master Integrity</div>
                            <div className="text-xs text-muted-foreground mt-1">All SKUs match master data ✓</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-info/5 border border-info/10 rounded-lg">
                          <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">Statistical Outliers</div>
                            <div className="text-xs text-muted-foreground mt-1">4 outliers detected, flagged for review</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Data Enhancement Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left px-3 py-2">Field</th>
                            <th className="text-left px-3 py-2">Issue Type</th>
                            <th className="text-left px-3 py-2">Records Affected</th>
                            <th className="text-left px-3 py-2">AI Action</th>
                            <th className="text-left px-3 py-2">Confidence</th>
                            <th className="text-left px-3 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-muted/20 border-b">
                            <td className="px-3 py-3">Lead Time</td>
                            <td className="px-3 py-3">Missing Value</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">Imputed from similar SKUs (avg: 12 days)</td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-success/10 text-success">94%</Badge>
                            </td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-success/10 text-success">Applied</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20 border-b">
                            <td className="px-3 py-3">On-Order Qty</td>
                            <td className="px-3 py-3">Missing Value</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">Set to 0 (no pending orders detected)</td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-success/10 text-success">99%</Badge>
                            </td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-success/10 text-success">Applied</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-3">Demand Std Dev</td>
                            <td className="px-3 py-3">Outlier Detection</td>
                            <td className="px-3 py-3">4</td>
                            <td className="px-3 py-3">Capped at 3σ threshold for stability</td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-warning/10 text-warning">87%</Badge>
                            </td>
                            <td className="px-3 py-3">
                              <Badge variant="secondary" className="bg-info/10 text-info">Pending Review</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                        <SelectItem value="sku001">Paracetamol 500mg</SelectItem>
                        <SelectItem value="sku004">Insulin Glargine</SelectItem>
                        <SelectItem value="sku006">ORS Sachet</SelectItem>
                        <SelectItem value="sku009">Ceftriaxone 1g</SelectItem>
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
                        <SelectItem value="dc_ncr">NCR Distribution Center</SelectItem>
                        <SelectItem value="dc_west">West Distribution Center</SelectItem>
                        <SelectItem value="dc_south">South Distribution Center</SelectItem>
                        <SelectItem value="dep_east">East Depot</SelectItem>
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
