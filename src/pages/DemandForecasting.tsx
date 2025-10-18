import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScientificLoader } from "@/components/ScientificLoader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GradientSwitch } from "@/components/ui/gradient-switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  DollarSign,
  Award,
  Share,
  MoreHorizontal,
  Settings,
  AlertTriangle,
  Copy,
  AlertCircle,
  Zap,
  CheckCircle,
  X,
  Database,
  Upload,
  Plus,
  CalendarIcon,
  CloudRain,
  Users,
  MessageCircle,
  Filter,
  Wand2,
  Info,
  Trash2,
  Shield,
  Sparkles,
  Brain,
  Activity,
  Target,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import CollaborativeForecastTable from "@/components/CollaborativeForecastTable";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { ForecastCard } from "@/components/ForecastCard";
import { ScenarioCreation } from "@/components/ScenarioCreation";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";

// ---- Chart.js imports (replaces Recharts) ----
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
import { CompactMetricCard } from "@/components/CompactMetricCard";
import { CompactProjectionCard } from "@/components/CompactProjectionCard";
import { DemandAnalysisChart } from "@/components/DemandAnalysisChart";

// Data imports
import { workbookData } from "@/data/demandForecasting/workbookData";
import { dataPreviewSample } from "@/data/demandForecasting/dataPreviewSample";
import { forecastMetrics } from "@/data/demandForecasting/forecastMetrics";
import { historicalForecastData } from "@/data/demandForecasting/historicalForecastData";
import { pieData } from "@/data/demandForecasting/pieData";
import { skuData } from "@/data/demandForecasting/skuData";
import { gapData } from "@/data/demandForecasting/gapData";

import { sampleAiResponses } from "@/data/demandForecasting/aiResponses";
import { masterObjects, timeseriesObjects } from "@/data/demandForecasting/foundryObjects";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";
import { getFoundryObjectData } from "@/data/foundry";

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


const DemandForecasting = () => {
  // Check if in share mode (Upsynq unique link)
  const urlParams = new URLSearchParams(window.location.search);
  const isShareMode = urlParams.has('share') && urlParams.get('step') === '4';
  
  const [currentStep, setCurrentStep] = useState(isShareMode ? 4 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'transactional', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [previewDriverDialog, setPreviewDriverDialog] = useState<{open: boolean, driverName: string | null}>({open: false, driverName: null});

  // Map external driver display names to Foundry object keys
  const driverToFoundryKey: Record<string, string> = {
    "Holiday Calendar": "Holiday_Calendar",
    "Crude Oil Prices": "Crude_Oil_Prices",
    "NSE Index": "NSE_Index",
    "NASDAQ Index": "NASDAQ_Index",
    "Weather Data": "Weather_Data",
  };

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Review Data", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Demand Forecasting",
    initialStep: currentStep
  });

  const { setOnStepClick } = useStepperContext();

  // Set up step click handler - use a stable reference
  const handleStepClick = React.useCallback((stepId: number) => {
    // Only allow navigation to completed steps or the next step
    const targetStep = stepperSteps.find(s => s.id === stepId);
    if (targetStep && (targetStep.status === 'completed' || stepId === currentStep + 1 || stepId === currentStep)) {
      setCurrentStep(stepId);
    }
  }, [currentStep, stepperSteps]);

  useEffect(() => {
    setOnStepClick(() => handleStepClick);
  }, [handleStepClick, setOnStepClick]);

  // Auto-scroll down to avoid topbar overlap on initial load
  useEffect(() => {
    window.scrollTo({ top: 60, behavior: 'smooth' });
  }, []); // Empty dependency array means this runs once on mount

  // Auto-scroll down when Step 4 loads to avoid topbar overlap
  useEffect(() => {
    if (currentStep === 4) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  }, [currentStep]);

  const [driversLoading, setDriversLoading] = useState(false);

  // Model configuration state
  const [forecastHorizon, setForecastHorizon] = useState("12");
  const [modelGranularity, setModelGranularity] = useState("Weekly");
  const [seasonality, setSeasonality] = useState("Auto-detect");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [validationSplit, setValidationSplit] = useState("20");

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Foundry mapping modal states
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);

  // Step 3 state - moved to top level
  const [overrideForecast, setOverrideForecast] = useState(false);
  const [scenarioValue, setScenarioValue] = useState([95, 125, 110, 135, 145]);


  const handleFoundrySubmit = (data: {
    selectedObjects: string[];
    selectedDataType: 'master' | 'timeseries' | 'featureStore';
    fromDate?: Date;
    toDate?: Date;
  }) => {
    const newObjects = data.selectedObjects.map(objName => ({
      name: objName,
      type: data.selectedDataType === 'timeseries' ? 'transactional' as const : 'master' as const,
      ...(data.selectedDataType === 'timeseries' && { fromDate: data.fromDate, toDate: data.toDate })
    }));
    
    setFoundryObjects(prev => [...prev, ...newObjects]);
    
    // Set preview to first new object
    if (data.selectedObjects.length > 0) {
      setSelectedPreview(data.selectedObjects[0]);
      setPreviewLoading(true);
      setTimeout(() => setPreviewLoading(false), 700);
    }
  };
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "workbook" | "impact" | "quality">("overview");
  const [showImputedReview, setShowImputedReview] = useState(false);
  // Demand Analysis controls
  const [granularity, setGranularity] = useState<"weekly" | "monthly" | "quarterly">("weekly");
  const [valueMode, setValueMode] = useState<"value" | "volume">("value");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [chartGranularity, setChartGranularity] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');

  const handleZoomIn = () => {
    const levels: Array<'daily' | 'weekly' | 'monthly' | 'quarterly'> = ['quarterly', 'monthly', 'weekly', 'daily'];
    const currentIndex = levels.indexOf(chartGranularity);
    if (currentIndex < levels.length - 1) {
      setChartGranularity(levels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const levels: Array<'daily' | 'weekly' | 'monthly' | 'quarterly'> = ['quarterly', 'monthly', 'weekly', 'daily'];
    const currentIndex = levels.indexOf(chartGranularity);
    if (currentIndex > 0) {
      setChartGranularity(levels[currentIndex - 1]);
    }
  };

  // Right sidebar state
  const [rightSidebarTab, setRightSidebarTab] = useState<'ai' | 'filter' | 'scenario'>('filter');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [scenarios, setScenarios] = useState<Array<{
    id: string;
    name: string;
    value: string;
    subtitle: string;
    factors?: {
      priceChange: number;
      promotionIntensity: number;
      seasonality: number;
      marketGrowth: number;
      sku: string;
    };
  }>>([]);
  const [filterValues, setFilterValues] = useState({
    skuProduct: 'all',
    location: 'all',
    channel: 'all',
    timePeriod: 'all',
    businessUnits: 'all',
    dataAvailability: 'all'
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  // Auto-select drivers when data sources are added
  useEffect(() => {
    const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
    if (hasData && selectedDrivers.length === 0) {
      setDriversLoading(true);
      setTimeout(() => {
        const driversToSelect = [
          { name: "Holiday Calendar", autoSelected: true, icon: "Calendar" },
          { name: "Weather Data", autoSelected: true, icon: "CloudRain" },
        ];
        setSelectedDrivers(driversToSelect.filter(d => d.autoSelected).map(d => d.name));
        setDriversLoading(false);
      }, 500);
    }
  }, [uploadedFiles.length, foundryObjects.length]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

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
    console.log('Creating scenario:', scenario);
    console.log('Current scenarios count:', scenarios.length);
    if (scenarios.length >= 3) {
      console.log('Maximum scenarios reached, showing alert');
      alert('Maximum 3 scenarios allowed');
      return;
    }
    console.log('Adding scenario to state');
    setScenarios(prev => {
      const newScenarios = [...prev, scenario];
      console.log('New scenarios state:', newScenarios);
      return newScenarios;
    });
    // Automatically select the newly created scenario
    setSelectedScenario(scenario.id);
    setActiveTab("overview");
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    // If the deleted scenario was selected, clear the selection
    if (selectedScenario === scenarioId) {
      setSelectedScenario(null);
      setActiveTab("overview");
    }
  };

  const sendAiMessage = () => {
    if (!aiPrompt.trim()) return;
    
    const userMessage = { role: 'user' as const, content: aiPrompt };
    const randomResponse = sampleAiResponses[Math.floor(Math.random() * sampleAiResponses.length)];
    const assistantMessage = { role: 'assistant' as const, content: randomResponse };
    
    setAiMessages(prev => [...prev, userMessage, assistantMessage]);
    setAiPrompt('');
  };

  const applyFilters = () => {
    // Simulate filter application with updated data
    console.log('Filters applied:', filterValues);
    // This would trigger a re-render of the center content with filtered data
  };

  // Handle completion of forecast wizard
  const handleComplete = () => {
    toast.success("Forecast process completed successfully!");
    setCurrentStep(4);
  };

  // Export PPTX functionality
  const exportToPPTX = () => {
    const presentation = new pptx();
    presentation.layout = "LAYOUT_WIDE";

    const forecastCards = [
      {
        title: "Statistical Forecast",
        content: "Advanced time series analysis with seasonal decomposition, trend detection, and AI-powered accuracy improvements achieving 89% forecast accuracy."
      },
      {
        title: "AI/ML Models",
        content: "Deep learning neural networks (LSTM/GRU) trained on 5 years of historical data, capturing complex patterns and non-linear relationships."
      },
      {
        title: "Collaborative Intelligence",
        content: "Hybrid approach combining statistical algorithms, machine learning predictions, and human expertise for superior forecast accuracy and business alignment."
      }
    ];

    // Title slide
    const titleSlide = presentation.addSlide();
    titleSlide.addText("Demand Forecasting Results", {
      x: 0.5,
      y: 2.0,
      w: "90%",
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: "1E40AF",
      align: "center"
    });
    titleSlide.addText(`Generated on ${format(new Date(), "MMMM dd, yyyy")}`, {
      x: 0.5,
      y: 3.5,
      w: "90%",
      h: 0.5,
      fontSize: 18,
      color: "64748B",
      align: "center"
    });

    // Executive Summary slide
    const summarySlide = presentation.addSlide();
    summarySlide.addText("Executive Summary", {
      x: 0.5,
      y: 0.5,
      w: "90%",
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: "1E40AF"
    });

    forecastCards.forEach((card, index) => {
      summarySlide.addText(card.title, {
        x: 0.5,
        y: 1.5 + (index * 1.2),
        w: "90%",
        h: 0.4,
        fontSize: 20,
        bold: true,
        color: "334155"
      });
      summarySlide.addText(card.content, {
        x: 0.5,
        y: 1.9 + (index * 1.2),
        w: "90%",
        h: 0.7,
        fontSize: 14,
        color: "64748B"
      });
    });

    // Metrics slide
    const metricsSlide = presentation.addSlide();
    metricsSlide.addText("Key Metrics", {
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      bold: true,
      color: "1E40AF"
    });

    forecastMetrics.forEach((metric, index) => {
      const xPos = 0.5 + (index % 3) * 3.2;
      const yPos = 1.5 + Math.floor(index / 3) * 2;

      metricsSlide.addText(metric.label, {
        x: xPos,
        y: yPos,
        w: 2.8,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: "334155",
        align: "left"
      });

      metricsSlide.addText(metric.value, {
        x: xPos,
        y: yPos + 0.5,
        w: 2.8,
        h: 0.6,
        fontSize: 28,
        bold: true,
        color: "3B82F6",
        align: "left"
      });

      metricsSlide.addText(metric.trend, {
        x: xPos,
        y: yPos + 1.2,
        w: 2.8,
        h: 0.3,
        fontSize: 12,
        color: "94A3B8",
        align: "right"
      });
    });

    // Save the presentation
    presentation.writeFile({ fileName: `Demand_Forecasting_Results_${format(new Date(), "yyyy-MM-dd")}.pptx` });
    toast.success("PPTX export completed successfully!");
  };

  // Export CSV functionality
  const exportToCSV = () => {
    // Prepare forecast data for CSV
    const csvData = historicalForecastData.map(row => ({
      Period: row.period,
      Historical: row.historical,
      Forecast: row.forecast,
      Optimized: row.optimized
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Demand_Forecasting_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("CSV export completed successfully!");
  };

  // Export XLSX functionality
  const exportToXLSX = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Forecast Data
    const forecastData = historicalForecastData.map(row => ({
      Period: row.period,
      Historical: row.historical,
      Forecast: row.forecast,
      Optimized: row.optimized
    }));
    const ws1 = XLSX.utils.json_to_sheet(forecastData);
    XLSX.utils.book_append_sheet(wb, ws1, "Forecast Data");

    // Sheet 2: Metrics
    const metricsData = forecastMetrics.map(metric => ({
      Metric: metric.label,
      Value: metric.value,
      Trend: metric.trend
    }));
    const ws2 = XLSX.utils.json_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Metrics");

    // Sheet 3: SKU Data
    const ws3 = XLSX.utils.json_to_sheet(skuData);
    XLSX.utils.book_append_sheet(wb, ws3, "SKU Analysis");

    // Download XLSX
    XLSX.writeFile(wb, `Demand_Forecasting_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    
    toast.success("XLSX export completed successfully!");
  };

  // Export to Canva
  const exportToCanva = () => {
    // Prepare data for Canva
    const canvaData = {
      title: "Demand Forecasting Results",
      date: format(new Date(), "MMMM dd, yyyy"),
      metrics: forecastMetrics.map(m => ({ label: m.label, value: m.value, trend: m.trend })),
      forecast: historicalForecastData.slice(-12) // Last 12 periods
    };

    // Encode data and open Canva with pre-filled template
    const encodedData = encodeURIComponent(JSON.stringify(canvaData));
    const canvaUrl = `https://www.canva.com/create/presentations/?template=data-presentation&data=${encodedData}`;
    
    window.open(canvaUrl, '_blank');
    toast.success("Opening Canva with forecast data...");
  };

  // Generate and share Upsynq unique link
  const exportToUpsynqLink = () => {
    // Generate unique ID for this dashboard
    const uniqueId = `upsynq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, you'd save the dashboard state to a database
    // For now, we'll create a shareable link with the ID
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/demand-forecasting?share=${uniqueId}&step=4`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Unique Upsynq link copied to clipboard!", {
        description: shareUrl,
        duration: 5000
      });
    }).catch(() => {
      // Fallback: show the link in a prompt
      prompt("Copy this Upsynq share link:", shareUrl);
      toast.success("Upsynq link generated successfully!");
    });
  };

  // ---- Step 1 ----
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  
  const externalDrivers = getExternalDrivers("demand-forecasting", hasData);

  const renderStep1 = () => (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload all your data files at once. You can also select external factors to include in the model.</p>
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Upload Data Files</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload your historical demand data, product master data, and other relevant files. Supported formats: CSV, Excel, JSON.</p>
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
                link.download = 'forecast-data-template.xlsx';
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
                        <div className="flex items-center gap-2 text-xs flex-1">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span className="text-foreground">{file.name}</span>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {dataPreviewSample.length} rows
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
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
                           const foundryKey = driverToFoundryKey[selectedPreview] || selectedPreview.replace(/ /g, '_');
                           const driverData = getFoundryObjectData(foundryKey) as any[];
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
                              <th className="text-left px-3 py-2">Product</th>
                              <th className="text-left px-3 py-2">Location</th>
                              <th className="text-left px-3 py-2">Channel</th>
                              <th className="text-left px-3 py-2">Date</th>
                              <th className="text-left px-3 py-2">Sales</th>
                              <th className="text-left px-3 py-2">Revenue</th>
                              <th className="text-left px-3 py-2">Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataPreviewSample.map((row, idx) => (
                              <tr key={idx} className="hover:bg-muted/20 border-t">
                                <td className="px-3 py-2 font-mono">{row.sku}</td>
                                <td className="px-3 py-2 font-medium">{row.product}</td>
                                <td className="px-3 py-2">{row.location}</td>
                                <td className="px-3 py-2">
                                  <Badge variant="outline" className="text-xs">{row.channel}</Badge>
                                </td>
                                <td className="px-3 py-2 text-xs">{row.date}</td>
                                <td className="px-3 py-2 font-medium">{row.sales}</td>
                                <td className="px-3 py-2 text-success font-medium">{row.revenue}</td>
                                <td className="px-3 py-2">
                                  <Badge variant="secondary" className="text-xs">{row.stock}</Badge>
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">External Drivers</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select external factors that may influence demand patterns in your forecast model.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            External factors that may influence demand patterns. Select drivers to include in the model.
          </p>
        </CardHeader>
        <CardContent>
          <ExternalDriversSection
            drivers={externalDrivers}
            selectedDrivers={selectedDrivers}
            driversLoading={driversLoading}
            onToggleDriver={toggleDriver}
            onPreviewDriver={(driverName) => {
              setPreviewDriverDialog({open: true, driverName});
            }}
            showManualControls={false}
          />
        </CardContent>
      </Card>

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
      </ScrollArea>
    </div>
  );

  // ---- Step 2 ----

  // Chart.js datasets/options used in Step 2
  const gapLineData = {
    labels: gapData.map((g) => g.week),
    datasets: [
      {
        label: "Original",
        data: gapData.map((g) => (g.actual ?? null)),
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Imputed",
        data: gapData.map((g) => g.imputed),
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.3,
      },
    ],
  };

  const lineCommonOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for speed
    },
    plugins: {
      legend: { color: "#FF0000", position: "top" as const },
      title: { display: false },
      tooltip: { intersect: false, mode: "index" as const },
    },
    scales: {
      x: { grid: { display: true } },
      y: { grid: { display: true }, beginAtZero: true },
    },
  };

  const correlationData = {
    labels: ["Holiday Calendar", "Ad Spend", "Rainfall", "Temperature"],
    datasets: [
      {
        label: "Correlation (r)",
        data: [0.62, 0.48, -0.31, -0.12],
        backgroundColor: hslVar("--primary", 0.5),
        borderColor: hslVar("--primary"),
        borderWidth: 1,
      },
    ],
  };

  const correlationOptions: any = buildChartOptions({
    animation: { duration: 0 }, // Disable animations for speed
    scales: {
      y: { beginAtZero: true, min: -1, max: 1 },
    },
    plugins: { legend: { position: "top" as const } },
  });

  // Generate realistic scatter data for forecastability chart - memoized to prevent re-generation
  const scatterPoints = React.useMemo(() => {
    const data = [];
    // Generate points across different quadrants
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 1.8; // ADI from 0 to 1.8
      const y = Math.random() * 4; // CV² from 0 to 4
      
      // Color based on quadrants with gradient
      let pointColor;
      if (x < 1.3 && y < 1.3) {
        // Smooth quadrant - light blue
        pointColor = `hsl(200 70% ${60 + Math.random() * 20}%)`;
      } else if (x < 1.3 && y >= 1.3) {
        // Erratic quadrant - medium blue
        pointColor = `hsl(220 60% ${40 + Math.random() * 20}%)`;
      } else if (x >= 1.3 && y < 1.3) {
        // Intermittent quadrant - dark blue
        pointColor = `hsl(240 70% ${25 + Math.random() * 15}%)`;
      } else {
        // Lumpy quadrant - very dark blue
        pointColor = `hsl(260 80% ${15 + Math.random() * 15}%)`;
      }
      
      data.push({ x, y, pointColor });
    }
    return data;
  }, []); // Empty dependency array ensures this only runs once

  const forecastabilityData = {
    datasets: [
      {
        label: "Products",
        data: scatterPoints.map(point => ({ x: point.x, y: point.y })),
        backgroundColor: scatterPoints.map(point => point.pointColor),
        borderColor: scatterPoints.map(point => point.pointColor),
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 6, // Same as regular radius to prevent animation
        pointBorderWidth: 1,
        pointHoverBorderWidth: 1, // Same as regular border width
      },
      // Add the curved separation line
      {
        label: "Separation Line",
        data: Array.from({ length: 100 }, (_, i) => {
          const x = (i / 99) * 1.8;
          const y = 1.3 / (x + 0.1); // Hyperbola-like curve
          return { x, y: Math.min(y, 4) };
        }),
        borderColor: hslVar("--foreground"),
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: true,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const forecastabilityOptions: any = buildChartOptions({
    animation: false, // Completely disable all animations
    animations: false, // Alternative way to disable animations
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'point' as const
    },
    hover: {
      mode: null as any // Disable hover completely
    },
    onHover: null, // Disable hover events
    scales: {
      x: { 
        title: { display: true, text: "ADI", color: hslVar("--foreground") },
        min: 0,
        max: 1.8,
        grid: { color: hslVar("--border") },
        ticks: { stepSize: 0.5 }
      },
      y: { 
        title: { display: true, text: "CV²", color: hslVar("--foreground") },
        min: 0,
        max: 4,
        grid: { color: hslVar("--border") },
        ticks: { stepSize: 1 }
      },
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        enabled: false // Completely disable tooltips to prevent hover animations
      }
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        hoverRadius: 6, // Keep same radius on hover
        radius: 6,
        borderWidth: 1,
        hoverBorderWidth: 1
      }
    }
  });

  const renderStep2 = () => (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
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
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-success/20 to-transparent rounded-bl-full" />
        <CardContent className="p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <div className="text-xs text-muted-foreground">Completeness</div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentage of data points that are present and valid across all time periods and dimensions.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-2xl font-bold text-success">97.4%</div>
        </CardContent>
      </Card>
        
      <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-warning/20 to-transparent rounded-bl-full" />
        <CardContent className="p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <div className="text-xs text-muted-foreground">Missing Values</div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of missing data points that need to be imputed or filled using AI algorithms.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-2xl font-bold text-warning">1</div>
        </CardContent>
      </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <Copy className="w-4 h-4 text-accent" />
              <div className="text-xs text-muted-foreground">Duplicates</div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of duplicate records found in the dataset that may need to be cleaned or merged.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-accent">2</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-destructive/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <div className="text-xs text-muted-foreground">Outliers</div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Statistical outliers that deviate significantly from normal patterns and may indicate data quality issues or special events.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-destructive">4</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <div className="text-xs text-muted-foreground">Sparsity</div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Percentage of sparse data points (zero or very low values) across the dataset, affecting forecast model selection.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-primary">22%</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-warning/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              <div className="text-xs text-muted-foreground">ADI</div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average Demand Interval - measures how frequently demand occurs. Lower values indicate more consistent demand patterns.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-warning">1.8</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <div className="text-xs text-muted-foreground">CV²</div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coefficient of Variation squared - measures demand variability. Higher values indicate more unpredictable demand patterns.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-accent">0.72</div>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground">Correlation: External Factors vs Sales</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows how strongly external factors correlate with sales data. Values closer to +1 or -1 indicate stronger relationships.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="h-full">
              <Bar data={correlationData} options={correlationOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground">Forecastability Chart (ADI vs CV²)</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Classification of products based on demand patterns. ADI (Average Demand Interval) vs CV² (Coefficient of Variation squared) helps identify the best forecast methods for each product category.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] relative">
            <div className="h-full relative">
              <Scatter data={forecastabilityData} options={forecastabilityOptions} />
              
              {/* Quadrant Labels */}
              <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Smooth
              </div>
              <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Intermittent
              </div>
              <div className="absolute bottom-16 left-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Erratic
              </div>
              <div className="absolute bottom-16 right-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Lumpy
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showImputedReview && (
        <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-foreground">Review Imputed Values</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI-generated values for missing data points. Review and adjust if needed before proceeding with forecast generation.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border rounded">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Week</th>
                <th className="text-left px-3 py-2">Original</th>
                <th className="text-left px-3 py-2">AI Imputed</th>
                <th className="text-left px-3 py-2">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {gapData.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2">{row.week}</td>
                  <td className="px-3 py-2 text-red-600">{row.actual ?? "Missing"}</td>
                  <td className="px-3 py-2">
                    <Input className="w-24" value={row.imputed.toString()} readOnly />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground max-w-xs">
                    {row.explanation}
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
      </ScrollArea>
    </div>
  );

  // ---- Step 3 Chart.js datasets/options ----
  // Demand Analysis chart data based on controls
  const demandSeries = (() => {
    const mult = valueMode === "value" ? 1000 : 1;
    if (granularity === "weekly") {
      const labels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
      const hist = [120, 160, 220, 180, 240, 210, 260, 230].map((v) => v * mult);
      const fcst = [260, 280, 300, 320].map((v) => v * mult);
      const histData = [...hist, ...Array(fcst.length).fill(null)];
      const fcstData = [...Array(hist.length).fill(null), ...fcst];
      return { labels, histData, fcstData };
    }
    if (granularity === "monthly") {
      const labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const hist = [100, 120, 150, 140, 160, 170, 165, 180, 175].map((v) => v * mult);
      const fcst = [190, 210, 225].map((v) => v * mult);
      const histData = [...hist, ...Array(fcst.length).fill(null)];
      const fcstData = [...Array(hist.length).fill(null), ...fcst];
      return { labels, histData, fcstData };
    }
    // quarterly
    const labels = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"];
    const hist = [350, 420, 390, 410].map((v) => v * mult);
    const fcst = [440, 470].map((v) => v * mult);
    const histData = [...hist, ...Array(fcst.length).fill(null)];
    const fcstData = [...Array(hist.length).fill(null), ...fcst];
    return { labels, histData, fcstData };
  })();

  const demandLineData = {
    labels: demandSeries.labels,
    datasets: [
      {
        label: valueMode === "value" ? "Historical Demand" : "Historical Volume",
        data: demandSeries.histData as (number | null)[],
        type: 'bar' as const,
        backgroundColor: hslVar("--primary", 0.7),
        borderColor: hslVar("--primary"),
        borderWidth: 1,
      },
      {
        label: valueMode === "value" ? "Forecast Trend" : "Forecast Volume",
        data: demandSeries.fcstData as (number | null)[],
        type: 'bar' as const,
        backgroundColor: hslVar("--success", 0.7),
        borderColor: hslVar("--success"),
        borderWidth: 1,
      },
      {
        label: "Historical Trend Line",
        data: demandSeries.labels.map((_, i) => 
          demandSeries.histData[i] ? demandSeries.histData[i] * 1.05 : null
        ) as (number | null)[],
        type: 'line' as const,
        borderWidth: 2.5,
        tension: 0.35,
        borderColor: hslVar("--warning"),
        backgroundColor: "transparent",
        pointRadius: 3,
        pointBackgroundColor: hslVar("--warning"),
        spanGaps: false,
      },
      {
        label: "Forecast Trend Line",
        data: demandSeries.labels.map((_, i) => 
          demandSeries.fcstData[i] ? demandSeries.fcstData[i] * 1.03 : null
        ) as (number | null)[],
        type: 'line' as const,
        borderWidth: 2.5,
        tension: 0.35,
        borderColor: hslVar("--success"),
        backgroundColor: "transparent",
        pointRadius: 3,
        pointBackgroundColor: hslVar("--success"),
        spanGaps: false,
        borderDash: [8, 5],
        fill: false,
      },
    ],
  } as const;

  const demandLineOptions: any = buildChartOptions({
    animation: { duration: 0 }, // Disable animations for speed
    plugins: { legend: { position: "bottom" as const } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        grid: { display: true },
        stacked: false
      },
      y: { 
        beginAtZero: true, 
        grid: { display: true },
        stacked: false
      },
    },
    elements: { 
      point: { radius: 3 },
      bar: { borderRadius: 4 }
    },
  });

  const demandBarData = {
    labels: historicalForecastData.slice(0, 6).map((d) => d.period),
    datasets: [
      {
        label: "Historical",
        data: historicalForecastData.slice(0, 6).map((d) => d.historical),
        borderWidth: 1,
        backgroundColor: "rgba(59,130,246,0.5)", // optional
      },
      {
        label: "Forecast",
        data: historicalForecastData.slice(0, 6).map((d) => d.forecast),
        borderWidth: 1,
        backgroundColor: "rgba(16,185,129,0.5)", // optional
      },
    ],
  };

  const barCommonOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Disable animations for speed
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true }, beginAtZero: true },
    },
  };

  const channelPieData = {
    labels: pieData.map((p) => p.name),
    datasets: [
      {
        label: "Share",
        data: pieData.map((p) => p.value),
        backgroundColor: pieData.map((p) => p.fill),
      },
    ],
  };

  const pieOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Disable animations for speed
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: false },
    },
  };

  // ---- Step 3 - Review Data ----
  const renderStep3 = () => (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Review your processed data and configure forecast settings.</p>
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">

      {/* Data Quality Summary - Same as Step 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-success/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <div className="text-xs text-muted-foreground">Completeness</div>
            </div>
            <div className="text-2xl font-bold text-success">97.4%</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-warning/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <div className="text-xs text-muted-foreground">Missing Values</div>
            </div>
            <div className="text-2xl font-bold text-warning">1</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <Copy className="w-4 h-4 text-accent" />
              <div className="text-xs text-muted-foreground">Duplicates</div>
            </div>
            <div className="text-2xl font-bold text-accent">2</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-destructive/20 to-transparent rounded-bl-full" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <div className="text-xs text-muted-foreground">Outliers</div>
            </div>
            <div className="text-2xl font-bold text-destructive">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Sources Preview</CardTitle>
          <p className="text-sm text-muted-foreground">Review your uploaded and connected data sources</p>
        </CardHeader>
        <CardContent>
          {(uploadedFiles.length > 0 || foundryObjects.length > 0) ? (
            <div className="space-y-4">
              {/* Data Source Selection */}
              <div className="flex gap-2 flex-wrap">
                {uploadedFiles.map((file) => (
                  <Button
                    key={file.name}
                    variant={selectedPreview === file.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPreview(file.name)}
                    className="text-xs"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {file.name}
                  </Button>
                ))}
                {foundryObjects.map((obj) => (
                  <Button
                    key={obj.name}
                    variant={selectedPreview === obj.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPreview(obj.name)}
                    className="text-xs"
                  >
                    <Database className="w-3 h-3 mr-1" />
                    {obj.name}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {obj.type}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Data Preview Table */}
              {selectedPreview && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 p-3 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{selectedPreview}</h4>
                      <Badge variant="outline" className="text-xs">
                        {uploadedFiles.some(f => f.name === selectedPreview) ? 'File' : 'Foundry Object'}
                      </Badge>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    {foundryObjects.some(obj => obj.name === selectedPreview) ? (
                      (() => {
                        const data = getFoundryObjectData(selectedPreview as string) as any[];
                        const columns = data.length > 0 ? Object.keys(data[0]) : [];
                        return (
                          <table className="w-full text-xs">
                            <thead className="bg-muted/20 sticky top-0">
                              <tr>
                                {columns.map((col) => (
                                  <th key={col} className="text-left p-2 font-medium capitalize">
                                    {col.replace(/_/g, ' ')}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.slice(0, 10).map((row, index) => (
                                <tr key={index} className="border-b border-border/40 hover:bg-muted/20">
                                  {columns.map((col) => (
                                    <td key={col} className="p-2">
                                      {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] || '')}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()
                    ) : (
                      <table className="w-full text-xs">
                        <thead className="bg-muted/20 sticky top-0">
                          <tr>
                            <th className="text-left p-2 font-medium">SKU</th>
                            <th className="text-left p-2 font-medium">Product</th>
                            <th className="text-left p-2 font-medium">Location</th>
                            <th className="text-left p-2 font-medium">Channel</th>
                            <th className="text-left p-2 font-medium">Date</th>
                            <th className="text-left p-2 font-medium">Sales</th>
                            <th className="text-left p-2 font-medium">Revenue</th>
                            <th className="text-left p-2 font-medium">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataPreviewSample.map((row, index) => (
                            <tr key={index} className="border-b border-border/40 hover:bg-muted/20">
                              <td className="p-2 text-xs font-mono">{row.sku}</td>
                              <td className="p-2 font-medium">{row.product}</td>
                              <td className="p-2">{row.location}</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-xs">{row.channel}</Badge>
                              </td>
                              <td className="p-2 text-xs">{row.date}</td>
                              <td className="p-2 font-medium">{row.sales}</td>
                              <td className="p-2 font-medium text-success">{row.revenue}</td>
                              <td className="p-2">
                                <Badge variant="secondary" className="text-xs">
                                  {row.stock}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No data sources added yet</p>
              <p className="text-xs text-muted-foreground">Go back to Step 1 to add data sources</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration and External Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">External Drivers</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>External factors selected in Step 1 that will be included in the forecast model to improve accuracy.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedDrivers.map((driver) => (
              <div key={driver} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm">{driver}</span>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
            ))}
            {selectedDrivers.length === 0 && (
              <p className="text-sm text-muted-foreground">No external drivers selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Model Configuration</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure the AI forecast model parameters including time horizon, data granularity, seasonality detection, and confidence intervals.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="forecast-horizon">Forecast Horizon (Months)</Label>
                <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="18">18 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="granularity">Granularity</Label>
                <Select value={modelGranularity} onValueChange={setModelGranularity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seasonality">Seasonality</Label>
                <Select value={seasonality} onValueChange={setSeasonality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto-detect">Auto-detect</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confidence-level">Confidence Level (%)</Label>
                <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="85">85%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                    <SelectItem value="99">99%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validation-split">Validation Split (%)</Label>
                <Select value={validationSplit} onValueChange={setValidationSplit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="30">30%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trend-method">Trend Method</Label>
                <Select value="auto" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="damped">Damped</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="error-method">Error Method</Label>
                <Select value="auto" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-select</SelectItem>
                    <SelectItem value="additive">Additive</SelectItem>
                    <SelectItem value="multiplicative">Multiplicative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outlier-treatment">Outlier Treatment</Label>
                <Select value="auto" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-handle</SelectItem>
                    <SelectItem value="remove">Remove</SelectItem>
                    <SelectItem value="cap">Cap values</SelectItem>
                    <SelectItem value="ignore">Ignore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model-ensemble">Ensemble Method</Label>
                <Select value="weighted" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weighted">Weighted Average</SelectItem>
                    <SelectItem value="best">Best Model Only</SelectItem>
                    <SelectItem value="median">Median Ensemble</SelectItem>
                    <SelectItem value="stacking">Stacking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cross-validation">Cross Validation</Label>
                <Select value="timeseries" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timeseries">Time Series CV</SelectItem>
                    <SelectItem value="walk-forward">Walk Forward</SelectItem>
                    <SelectItem value="blocked">Blocked CV</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        <div className="flex justify-between pt-4">
          <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>
            ← Back
          </Button>
          <Button size="sm" onClick={() => handleStepTransition(4)}>
            Generate Forecast →
          </Button>
        </div>
        </div>
      </ScrollArea>
    </div>
  );


  // ---- Step 4 - Results ----
  const renderStep4 = () => (
    <div className="relative flex h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden bg-background">
      {/* Left Sidebar - Canva-style compact panel */}
      <div className="w-[280px] shrink-0 h-full bg-card border-r flex flex-col overflow-hidden">
        <div className="flex-none px-4 py-3 border-b bg-card sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-foreground">Results</h2>
        </div>

        {/* Scrollable Metric Cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            <div className="flex justify-center">
            <ForecastCard
              title="Forecast Snapshot"
              value="94.2%"
              subtitle="ML-Powered Accuracy • ₹48.2M Revenue • 125K+ Units
                        12-Month Horizon • 5 Active SKUs • 4 Channels"
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
              title="ABC, XYZ & More"
              value="65%"
              subtitle="from class A, 40% from class X
                        $ sales from class A -
                        down by x% from last cycle"
              icon={BarChart3}
              isActive={selectedScenario === null && activeTab === "insights"}
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab("insights");
              }}
            />
            </div>

            <div className="flex justify-center">
            <ForecastCard
              title="Collaborate"
              value="Planner Input"
              subtitle="Provide your inputs & comments
                        Share with your team"
              icon={Award}
              isActive={selectedScenario === null && activeTab === "workbook"}
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab("workbook");
              }}
            />
            </div>

            <div>
            <ForecastCard
              title="Impact Analysis"
              value="10K"
              subtitle="Units sold due to promotion
                        High price sensitivity"
              icon={BarChart3}
              isActive={selectedScenario === null && activeTab === "impact"}
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab("impact");
              }}
            />
            </div>

            <div className="flex justify-center">
            <ForecastCard
              title="Data Quality Review"
              value="97.4%"
              subtitle="Completeness score, 1 missing value imputed, 2 duplicates resolved. AI-enhanced data integrity verified."
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
        </div>
      </div>

      {/* Main Content Area - Canva-style workspace */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header Bar - Sticky */}
        <div className="flex-none flex items-center justify-between px-4 py-2 border-b bg-card/50 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-foreground animate-fade-in">
            {selectedScenario ? `Scenario Analysis: ${scenarios.find(s => s.id === selectedScenario)?.name}` : 
             activeTab === "overview" ? "Forecast Overview" :
             activeTab === "insights" ? "Demand Insights" :
             activeTab === "workbook" ? "Collaborative Workbook" :
             activeTab === "impact" ? "Impact Analysis" :
             activeTab === "quality" ? "Data Quality Review" : "Results"}
          </h1>
          <div className="flex items-center gap-2">
            {!isShareMode && (
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>
                ← Back
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
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
            <Button size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">
          {/* Scrollable Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4">
        {/* Content based on active tab or selected scenario */}
        {selectedScenario ? (
          <>
            {/* Scenario Comparison View */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {selectedScenario && (
                  <p className="text-sm text-muted-foreground">Comparison with baseline forecast</p>
                )}
                <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                  ← Back to Overview
                </Button>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Scenario vs Baseline Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Line data={{
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                        datasets: [
                          {
                            label: 'Baseline Forecast',
                            data: [100, 110, 105, 120, 115, 125],
                            borderColor: 'hsl(220, 13%, 69%)',
                            backgroundColor: 'hsl(220, 13%, 69%, 0.1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            pointBackgroundColor: 'hsl(220, 13%, 69%)',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                          },
                          {
                            label: 'Scenario Forecast',
                            data: [105, 118, 112, 128, 123, 133],
                            borderColor: 'hsl(142, 76%, 36%)',
                            backgroundColor: 'hsl(142, 76%, 36%, 0.1)',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4,
                            pointBackgroundColor: 'hsl(142, 76%, 36%)',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                          }
                        ]
                       }} options={buildChartOptions({ 
                         animation: { duration: 0 }, // Disable animations for speed
                         backgroundColor: hslVar('--background'),
                         responsive: true,
                         plugins: {
                           legend: {
                             position: 'top' as const,
                             labels: {
                               usePointStyle: true,
                               font: {
                                 size: 12,
                                 weight: '500'
                               }
                             }
                           }
                         },
                         scales: {
                           y: {
                             beginAtZero: false,
                             grid: {
                               color: 'hsl(var(--border))',
                             },
                             ticks: {
                               font: {
                                 size: 11
                               }
                             }
                           },
                           x: {
                             grid: {
                               color: 'hsl(var(--border))',
                             },
                             ticks: {
                               font: {
                                 size: 11
                               }
                             }
                           }
                         }
                       })} />
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
                          <div className="text-lg font-bold text-success">+8.5%</div>
                          <div className="text-xs text-muted-foreground">Volume Impact</div>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">+₹4.2M</div>
                          <div className="text-xs text-muted-foreground">Revenue Impact</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Accuracy Change</span>
                          <Badge variant="secondary" className="bg-info/10 text-info">+2.1%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <Badge variant="secondary" className="bg-warning/10 text-warning">Medium</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Confidence Score</span>
                          <Badge variant="secondary" className="bg-success/10 text-success">87%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Time Horizon</span>
                          <span className="text-sm font-medium">6 weeks</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Insights Row */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-sm">Channel Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Online</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-success rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">+12%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Retail</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-warning rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">+6%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">B2B</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">+9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-sm">Regional Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">North</span>
                      <Badge variant="secondary" className="bg-success/10 text-success text-xs">High +15%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">South</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Med +8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">East</span>
                      <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">Low +3%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">West</span>
                      <Badge variant="secondary" className="bg-info/10 text-info text-xs">Med +7%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-sm">Key Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs">
                      <div className="font-medium mb-1">Primary Drivers:</div>
                      <div className="space-y-1 text-muted-foreground">
                        {scenarios.find(s => s.id === selectedScenario)?.factors && (
                          <>
                            {scenarios.find(s => s.id === selectedScenario)?.factors?.priceChange !== 0 && (
                              <div>• Price Change: {scenarios.find(s => s.id === selectedScenario)?.factors?.priceChange}%</div>
                            )}
                            {scenarios.find(s => s.id === selectedScenario)?.factors?.promotionIntensity !== 0 && (
                              <div>• Promotion: {scenarios.find(s => s.id === selectedScenario)?.factors?.promotionIntensity}%</div>
                            )}
                            {scenarios.find(s => s.id === selectedScenario)?.factors?.seasonality !== 0 && (
                              <div>• Seasonality: {scenarios.find(s => s.id === selectedScenario)?.factors?.seasonality}%</div>
                            )}
                            {scenarios.find(s => s.id === selectedScenario)?.factors?.marketGrowth !== 0 && (
                              <div>• Market Growth: {scenarios.find(s => s.id === selectedScenario)?.factors?.marketGrowth}%</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs font-medium">Target SKU:</div>
                      <div className="text-xs text-muted-foreground">
                        {scenarios.find(s => s.id === selectedScenario)?.factors?.sku || 'All SKUs'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : activeTab === "overview" && (
          <div className="animate-fade-in">
            {/* Demand Analysis Chart with controls */}
            <Card className="shadow-card border-0 mb-4 flex-1 bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Demand Analysis</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Historical demand vs forecast trend showing model performance over time with confidence intervals.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-lg p-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleZoomOut}
                      disabled={chartGranularity === 'quarterly'}
                      className="h-7 w-7 p-0"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs font-medium px-2 capitalize min-w-[60px] text-center">{chartGranularity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleZoomIn}
                      disabled={chartGranularity === 'daily'}
                      className="h-7 w-7 p-0"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" aria-label="Chart options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-50">
                    <DropdownMenuLabel>Chart controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Group by</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={granularity} onValueChange={(v) => setGranularity(v as any)}>
                          <DropdownMenuRadioItem value="weekly">Weekly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="monthly">Monthly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="quarterly">Quarterly</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Measure</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={valueMode} onValueChange={(v) => setValueMode(v as any)}>
                          <DropdownMenuRadioItem value="value">Value</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="volume">Volume</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Filters</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-64">
                        <DropdownMenuLabel>Class</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={classFilter} onValueChange={setClassFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="A">Class A</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="B">Class B</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="C">Class C</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Location</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={locationFilter} onValueChange={setLocationFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="north">North</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="south">South</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="east">East</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="west">West</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <DemandAnalysisChart
                  granularity={granularity}
                  valueMode={valueMode}
                  classFilter={classFilter}
                  locationFilter={locationFilter}
                  chartGranularity={chartGranularity}
                />
              </CardContent>
            </Card>
            
            {/* Top KPI Row - 3 Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 mb-3">
              <CompactMetricCard
                value={filterValues.businessUnits === 'enterprise' ? '7.2%' : '8.7%'}
                label="MAPE"
                tooltip="Mean Absolute Percentage Error - average forecast error as percentage. Lower is better."
                valueColor="primary"
                badge={{
                  text: "Optimizing",
                  variant: "success"
                }}
              />

              <CompactMetricCard
                value="-2.1%"
                label="BIAS"
                tooltip="Systematic error showing if forecasts are consistently over (+) or under (-) predicting demand."
                valueColor="warning"
                badge={{
                  text: "Under-forecast",
                  variant: "warning"
                }}
              />

              <CompactMetricCard
                value={filterValues.businessUnits === 'enterprise' ? '6.8%' : '9.3%'}
                label="VMAPE"
                tooltip="Volume-weighted MAPE - accuracy metric accounting for volume importance of each forecast."
                valueColor="info"
              />
            </div>

            {/* Enhanced Forecast Snapshot - Logility & Kinexis Inspired */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 mb-4">
              {/* AI Insights & Recommendations */}
              <Card className="shadow-card border-0 lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI-Powered Insights & Recommendations
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Brain className="w-3 h-3 mr-1" />
                      ML Enhanced
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">High Confidence Forecast Detected</span>
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">+12% Uplift</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          SKU001 & SKU002 showing strong correlation with marketing events. Confidence: 94%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Exception Alert: SKU003</span>
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">Review Needed</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Demand volatility increased by 23%. Consider safety stock adjustment for weeks 6-8.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-info mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Optimization Opportunity</span>
                          <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/20">₹2.1M Potential</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Channel reallocation suggested: Shift 15% from Retail to Online for improved margins.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forecast Value Added (FVA) */}
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Forecast Value Added</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">FVA measures the improvement your forecast provides over a naive baseline. Positive FVA indicates value creation.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-lg border border-success/20">
                    <div className="text-3xl font-bold text-success">+18.4%</div>
                    <div className="text-xs text-muted-foreground mt-1">vs Naive Forecast</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Statistical Model</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-primary"></div>
                        </div>
                        <span className="font-medium">+12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">ML Enhancement</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="w-5/6 h-full bg-success"></div>
                        </div>
                        <span className="font-medium">+6.4%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Planner Input</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-info"></div>
                        </div>
                        <span className="font-medium text-destructive">-2.8%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Consensus Progress</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-primary to-success"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Forecast Accuracy Trend & Exceptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-5 h-5" />
                    Accuracy Trend (Rolling 12 Weeks)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] flex items-end justify-between gap-2 px-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const heights = [85, 87, 89, 91, 88, 92, 94, 93, 95, 94, 96, 94];
                      const actualHeight = heights[i];
                      const colors = actualHeight >= 90 ? 'bg-success shadow-sm shadow-success/50' : actualHeight >= 85 ? 'bg-warning shadow-sm shadow-warning/50' : 'bg-destructive shadow-sm shadow-destructive/50';
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group">
                              <div 
                                className={`w-full ${colors} rounded-t-md transition-all group-hover:opacity-80 group-hover:scale-105 min-h-[20px]`}
                                style={{ height: `${actualHeight}%` }}
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">W{i+1}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">Week {i+1}</p>
                            <p className="text-sm">Accuracy: {actualHeight}%</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {actualHeight >= 90 ? 'Excellent Performance' : actualHeight >= 85 ? 'Good Performance' : 'Needs Attention'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-xs text-muted-foreground">≥90% (Excellent)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-xs text-muted-foreground">85-89% (Good)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      <span className="text-xs text-muted-foreground">&lt;85% (Review)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-5 h-5" />
                    Top Exception Items (Requires Action)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { sku: 'SKU003-WGT-C', issue: 'High Variability', priority: 'high', variance: '+34%' },
                      { sku: 'SKU001-WGT-A', issue: 'Trend Shift', priority: 'medium', variance: '+18%' },
                      { sku: 'SKU005-WGT-E', issue: 'Outlier Detected', priority: 'medium', variance: '-12%' },
                      { sku: 'SKU002-WGT-B', issue: 'Low Confidence', priority: 'low', variance: '+8%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-8 rounded-full ${
                            item.priority === 'high' ? 'bg-destructive' : 
                            item.priority === 'medium' ? 'bg-warning' : 'bg-info'
                          }`} />
                          <div>
                            <div className="font-medium text-sm">{item.sku}</div>
                            <div className="text-xs text-muted-foreground">{item.issue}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          item.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          item.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-info/10 text-info border-info/20'
                        }`}>
                          {item.variance}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Row - Channel Distribution and ABC Classification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <PieChartIcon className="w-4 h-4" />
                    Channel Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <Pie data={channelPieData} options={pieOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4" />
                      ABC Classification
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Categorizes items by revenue value: A (high), B (medium), C (low). Helps prioritize forecasting efforts.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Class A (High Value)</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">65%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Class B (Medium Value)</span>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">25%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Class C (Low Value)</span>
                      <Badge variant="secondary" className="bg-muted/10 text-muted-foreground">10%</Badge>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="text-2xl font-bold text-primary">₹84.6M</div>
                      <p className="text-xs text-muted-foreground">Total Revenue Impact</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row - Combined Value & Variability Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4" />
                      XYZ Classification
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Groups items by demand variability: X (stable), Y (variable), Z (highly unpredictable). Indicates forecast difficulty.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">X (Low Variability)</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">40%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Y (Medium Variability)</span>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">35%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Z (High Variability)</span>
                      <Badge variant="secondary" className="bg-destructive/10 text-destructive">25%</Badge>
                    </div>
                    <div className="mt-4 pt-3 border-t space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Q1 2024</span>
                        <span className="text-xs font-medium">₹21.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs">Q2 2024</span>
                        <span className="text-xs font-medium">₹22.1M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs">Q3 2024</span>
                        <span className="text-xs font-medium">₹20.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs">Q4 2024</span>
                        <span className="text-xs font-medium">₹20.5M</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      Combined Value & Variability Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revenue breakdown by channel with statistical measures of demand patterns and forecast reliability.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs font-medium">Revenue by Channel</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Direct Sales</span>
                      <span className="text-sm font-medium">₹29.6M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Online</span>
                      <span className="text-sm font-medium">₹23.7M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retail</span>
                      <span className="text-sm font-medium">₹21.2M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">B2B</span>
                      <span className="text-sm font-medium">₹10.1M</span>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="text-xs font-medium mb-2">Variability Metrics</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Standard Deviation</span>
                        <span className="text-xs font-medium">12.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Coefficient of Variation</span>
                        <span className="text-xs font-medium">15.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Seasonal Index</span>
                        <span className="text-xs font-medium">1.23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Channel Efficiency</span>
                        <span className="text-xs font-medium text-primary">85.2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {activeTab === "workbook" && (
          <div className="mb-6 animate-fade-in">
            <CollaborativeForecastTable />
          </div>
        )}
        {activeTab === "impact" && (
          <div className="space-y-4 animate-fade-in">
            {/* Simplified Layout - Two Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Waterfall Chart - Contribution Analysis */}
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5" />
                      Contribution Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Shows how different factors adjust the base forecast.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: ['Base Forecast', 'Seasonality', 'Promotions', 'Price Change', 'Final Forecast'],
                        datasets: [{
                          label: 'Contribution',
                          data: [85, 8, 12, -3, 108],
                          backgroundColor: [
                            hslVar('--primary', 0.8),
                            hslVar('--success', 0.8),
                            hslVar('--warning', 0.8),
                            hslVar('--destructive', 0.8),
                            hslVar('--primary', 0.9)
                          ],
                          borderColor: [
                            hslVar('--primary'),
                            hslVar('--success'),
                            hslVar('--warning'),
                            hslVar('--destructive'),
                            hslVar('--primary')
                          ],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Impact (M units)' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Analysis */}
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5" />
                      Sensitivity Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Drivers ranked by forecast impact.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: ['Price Elasticity', 'Promotion Depth', 'Seasonality', 'Market Growth'],
                        datasets: [{
                          label: 'Impact Range (%)',
                          data: [15, 12, 8, 6],
                          backgroundColor: [
                            hslVar('--destructive', 0.8),
                            hslVar('--warning', 0.8),
                            hslVar('--primary', 0.8),
                            hslVar('--success', 0.8)
                          ],
                          borderColor: [
                            hslVar('--destructive'),
                            hslVar('--warning'),
                            hslVar('--primary'),
                            hslVar('--success')
                          ],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            title: { display: true, text: 'Sensitivity (±%)' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Insights */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Key Impact Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-primary">Primary Drivers</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price Sensitivity</span>
                        <Badge variant="secondary" className="bg-destructive/10 text-destructive">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Promotion Response</span>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">Medium</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seasonal Effect</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Medium</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-success">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Forecast Accuracy</span>
                        <span className="font-medium">89.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Impact</span>
                        <span className="font-medium">+21%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence</span>
                        <Badge variant="secondary" className="bg-success/10 text-success">87%</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-info">Risk Assessment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prediction Interval</span>
                        <span className="font-medium">±12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">Medium</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model Bias</span>
                        <span className="font-medium">-2.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === "quality" && (
          <div className="space-y-6 animate-fade-in">
            {/* Data Quality Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-success/20 to-transparent rounded-bl-full" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div className="text-xs text-muted-foreground">Completeness</div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of data points that are present and valid across all time periods and dimensions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-2xl font-bold text-success">97.4%</div>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-warning/20 to-transparent rounded-bl-full" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <div className="text-xs text-muted-foreground">Missing Values</div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of missing data points that were imputed using AI algorithms.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-2xl font-bold text-warning">1</div>
                  <div className="text-xs text-muted-foreground mt-1">Successfully imputed</div>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="w-4 h-4 text-accent" />
                    <div className="text-xs text-muted-foreground">Duplicates</div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of duplicate records that were identified and resolved.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-2xl font-bold text-accent">2</div>
                  <div className="text-xs text-muted-foreground mt-1">Automatically resolved</div>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <div className="text-xs text-muted-foreground">AI Quality Score</div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Overall data quality score calculated by AI analysis including pattern validation and anomaly detection.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-2xl font-bold text-primary">A+</div>
                  <div className="text-xs text-muted-foreground mt-1">High confidence</div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Insights */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  AI-Enhanced Data Quality Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-primary">Data Validation Results</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm">Pattern Consistency</span>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">Excellent</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm">Seasonal Alignment</span>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">Validated</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm">Outlier Detection</span>
                        </div>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">3 Flagged</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-primary">Imputation Quality</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Method Used</span>
                        <span className="font-medium">Linear Interpolation + Seasonal Adjustment</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Confidence Level</span>
                        <span className="font-medium text-success">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cross-Validation Score</span>
                        <span className="font-medium text-success">0.96</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Impact on Forecast</span>
                        <Badge variant="secondary" className="bg-success/10 text-success">Minimal</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`${rightSidebarCollapsed ? 'w-16' : 'w-80'} shrink-0 flex-none h-full max-h-screen bg-card border-l p-4 flex flex-col overflow-hidden transition-all duration-200`}>
        {rightSidebarCollapsed ? (
          /* Collapsed Sidebar - Icons Only */
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('ai');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'ai' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Ask AI"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('filter');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'filter' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Filter"
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('scenario');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'scenario' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Create Scenario"
            >
              <Wand2 className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          /* Expanded Sidebar */
          <>
             {/* Header */}
             <div className="flex-none mb-4">
               <div className="flex items-center justify-between mb-4">
                 {/* Tab icons always visible */}
                 <div className="flex items-center gap-2">
                   <Button
                     variant={rightSidebarTab === 'ai' ? 'default' : 'ghost'}
                     size="icon"
                     onClick={() => setRightSidebarTab('ai')}
                     className="w-8 h-8"
                   >
                     <MessageCircle className="w-4 h-4" />
                   </Button>
                   <Button
                     variant={rightSidebarTab === 'filter' ? 'default' : 'ghost'}
                     size="icon"
                     onClick={() => setRightSidebarTab('filter')}
                     className="w-8 h-8"
                   >
                     <Filter className="w-4 h-4" />
                   </Button>
                   <Button
                     variant={rightSidebarTab === 'scenario' ? 'default' : 'ghost'}
                     size="icon"
                     onClick={() => setRightSidebarTab('scenario')}
                     className="w-8 h-8"
                   >
                     <Wand2 className="w-4 h-4" />
                   </Button>
                 </div>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => setRightSidebarCollapsed(true)}
                   className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {rightSidebarTab === 'ai' && (
                <div className="space-y-4 flex flex-col h-full">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-auto space-y-3 mb-4">
                    {aiMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Ask me anything about your forecast data</p>
                      </div>
                    ) : (
                      aiMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Input Area */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="e.g., What factors are driving demand in Q4?"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendAiMessage();
                        }
                      }}
                    />
                    <Button onClick={sendAiMessage} className="w-full" disabled={!aiPrompt.trim()}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              )}

              {rightSidebarTab === 'filter' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      SKU / Product
                    </label>
                    <Select value={filterValues.skuProduct} onValueChange={(value) => setFilterValues(prev => ({ ...prev, skuProduct: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Location
                    </label>
                    <Select value={filterValues.location} onValueChange={(value) => setFilterValues(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="north">North Region</SelectItem>
                        <SelectItem value="south">South Region</SelectItem>
                        <SelectItem value="east">East Region</SelectItem>
                        <SelectItem value="west">West Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Channel
                    </label>
                    <Select value={filterValues.channel} onValueChange={(value) => setFilterValues(prev => ({ ...prev, channel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="direct">Direct Sales</SelectItem>
                        <SelectItem value="b2b">B2B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Time Period
                    </label>
                    <Select value={filterValues.timePeriod} onValueChange={(value) => setFilterValues(prev => ({ ...prev, timePeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Periods</SelectItem>
                        <SelectItem value="q1">Q1 2024</SelectItem>
                        <SelectItem value="q2">Q2 2024</SelectItem>
                        <SelectItem value="q3">Q3 2024</SelectItem>
                        <SelectItem value="q4">Q4 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Business Units
                    </label>
                    <Select value={filterValues.businessUnits} onValueChange={(value) => setFilterValues(prev => ({ ...prev, businessUnits: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        <SelectItem value="consumer">Consumer</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Data Availability
                    </label>
                    <Select value={filterValues.dataAvailability} onValueChange={(value) => setFilterValues(prev => ({ ...prev, dataAvailability: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="complete">Complete Data</SelectItem>
                        <SelectItem value="partial">Partial Data</SelectItem>
                        <SelectItem value="limited">Limited Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={applyFilters} className="flex-1">
                      Apply Local
                    </Button>
                    <Button onClick={applyFilters} variant="outline" className="flex-1">
                      Apply Global
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Reset All
                  </Button>
                </div>
              )}

              {rightSidebarTab === 'scenario' && (
                <ScenarioCreation 
                  onCreateScenario={createScenario}
                  scenarios={scenarios}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // If in share mode, show only Step 4 dashboard without navigation
  if (isShareMode) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-subtle overflow-x-hidden">
          <div className="px-4 py-6 overflow-x-hidden">
            {renderStep4()}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-screen bg-gradient-subtle overflow-hidden">
        <div className="h-full px-4 py-0 overflow-hidden">
          <div className="h-full w-full overflow-hidden">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
        </div>
      </div>
        {isLoading && (
          <ScientificLoader 
            message={`Processing Step ${currentStep + 1}...`}
            size="lg"
          />
        )}
        
        {/* External Driver Preview Dialog */}
        <Dialog open={previewDriverDialog.open} onOpenChange={(open) => setPreviewDriverDialog({open, driverName: null})}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                {previewDriverDialog.driverName} - Sample Data
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              {previewDriverDialog.driverName && (() => {
                const keyName = previewDriverDialog.driverName;
                const foundryKey = keyName ? (driverToFoundryKey[keyName] || keyName.replace(/ /g, '_')) : '';
                const driverData = getFoundryObjectData(foundryKey) as any[];
                if (!driverData || driverData.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Database className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No sample data available for this driver</p>
                    </div>
                  );
                }
                
                const columns = Object.keys(driverData[0]);
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Data Preview</p>
                        <p className="text-xs text-muted-foreground">Showing {driverData.length} sample records from {previewDriverDialog.driverName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {columns.length} columns
                      </Badge>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-muted sticky top-0">
                            <tr>
                              {columns.map((col) => (
                                <th key={col} className="text-left p-3 font-medium capitalize border-b">
                                  {col.replace(/_/g, ' ')}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {driverData.map((row: any, index: number) => (
                              <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                                {columns.map((col) => (
                                  <td key={col} className="p-3">
                                    {typeof row[col] === 'number' ? (
                                      <span className="font-mono">{row[col].toLocaleString()}</span>
                                    ) : (
                                      row[col]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
    </TooltipProvider>
  );
};

export default DemandForecasting;
