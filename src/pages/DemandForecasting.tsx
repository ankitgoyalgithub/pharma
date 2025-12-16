import React, { useState, useEffect, useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
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
  Box,
  MapPin,
  XCircle,
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
import { ScenarioComparisonDashboard } from "@/components/ScenarioComparisonDashboard";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { gapData } from '@/data/demandForecasting/gapData';
import { dataQualityIssues, dataQualitySummary } from '@/data/demandForecasting/dataQualityIssues';
import { DataQualityIssuesTable } from '@/components/DataQualityIssuesTable';
import { AutoFixDialog } from '@/components/AutoFixDialog';

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
import { ABCXYZMatrix } from "@/components/ABCXYZMatrix";
import { ModelConfigurationCard } from "@/components/ModelConfigurationCard";
import { getStoreMetrics, getABCRevenueImpact, getFMRUnits } from "@/lib/storeMetrics";

// Data imports
import { workbookData } from "@/data/demandForecasting/workbookData";
import { dataPreviewSample } from "@/data/demandForecasting/dataPreviewSample";
import { forecastMetrics } from "@/data/demandForecasting/forecastMetrics";
import { historicalForecastData } from "@/data/demandForecasting/historicalForecastData";
import { pieData } from "@/data/demandForecasting/pieData";
import { skuData } from "@/data/demandForecasting/skuData";

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
  const [driverFilters, setDriverFilters] = useState<Record<string, string>>({});
  const [driverSortConfig, setDriverSortConfig] = useState<{column: string, direction: 'asc' | 'desc'} | null>(null);

  // Map external driver display names to Foundry object keys
  const driverToFoundryKey: Record<string, string> = {
    // Pharma industry external drivers
    "Seasonal Illness Patterns": "Seasonal_Illness_Patterns",
    "Disease Outbreak Tracking": "Disease_Outbreak_Tracking",
    "Weather & Climate Data": "Weather_Climate_Data",
    "Healthcare Policy Changes": "Healthcare_Policy_Changes",
    "Generic Drug Launches": "Generic_Drug_Launches",
    "Medical Conference Calendar": "Medical_Conference_Calendar",
    "Prescription Trends": "Prescription_Trends",
    "Holiday Calendar": "Holiday_Calendar",
    "Promotions & Discounts": "Promotions_Discounts",
  };

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Configuration", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
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


  const [driversLoading, setDriversLoading] = useState(false);

  // Model configuration state
  const [forecastHorizon, setForecastHorizon] = useState("12");
  const [modelGranularity, setModelGranularity] = useState("Weekly");
  const [seasonality, setSeasonality] = useState("Auto-detect");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [validationSplit, setValidationSplit] = useState("20");
  
  // Classification threshold state
  const [classificationBasis, setClassificationBasis] = useState("value");
  const [abcThresholdA, setAbcThresholdA] = useState("80");
  const [abcThresholdB, setAbcThresholdB] = useState("15");
  const [xyzThresholdX, setXyzThresholdX] = useState("20");
  const [xyzThresholdY, setXyzThresholdY] = useState("50");
  const [fmrThresholdF, setFmrThresholdF] = useState("80");
  const [fmrThresholdM, setFmrThresholdM] = useState("40");

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [parsedCsvData, setParsedCsvData] = useState<Record<string, any[]>>({});
  
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
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "workbook" | "impact" | "npi" | "quality">("overview");
  const [showImputedReview, setShowImputedReview] = useState(false);
  const [showAutoFixDialog, setShowAutoFixDialog] = useState(false);
  
  // Generate dynamic data quality issues based on uploaded files
  const dynamicDataQualityIssues = useMemo(() => {
    // Get file names from uploaded files and foundry objects
    const fileNames = [
      ...uploadedFiles.map(f => f.name),
      ...foundryObjects.map(obj => `${obj.name.toLowerCase().replace(/ /g, '_')}.csv`)
    ];
    
    // If no files uploaded, use the default static issues
    if (fileNames.length === 0) {
      return dataQualityIssues;
    }
    
    // Map static issue file references to dynamic uploaded file names
    const fileMapping: Record<string, string> = {
      'sales_history.csv': fileNames.find(f => f.toLowerCase().includes('sales') || f.toLowerCase().includes('history')) || fileNames[0],
      'location_master.csv': fileNames.find(f => f.toLowerCase().includes('location') || f.toLowerCase().includes('store')) || fileNames[Math.min(1, fileNames.length - 1)],
      'product_master.csv': fileNames.find(f => f.toLowerCase().includes('product') || f.toLowerCase().includes('sku')) || fileNames[Math.min(2, fileNames.length - 1)],
      'mapping_master.csv': fileNames.find(f => f.toLowerCase().includes('mapping')) || fileNames[Math.min(3, fileNames.length - 1)],
      'channel_master.csv': fileNames.find(f => f.toLowerCase().includes('channel')) || fileNames[Math.min(4, fileNames.length - 1)],
    };
    
    return dataQualityIssues.map(issue => ({
      ...issue,
      file: fileMapping[issue.file] || issue.file
    }));
  }, [uploadedFiles, foundryObjects]);
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
      description?: string;
      timeHorizon?: string;
      granularity?: string;
      priceChange: number;
      promotionIntensity: number;
      seasonality: number;
      marketGrowth: number;
      newProductLaunch?: boolean;
      productLifecycle?: string;
      cannibalization?: number;
      channelMix?: {
        online: number;
        retail: number;
        b2b: number;
      };
      locationExpansion?: number;
      competitorActivity?: number;
      economicIndicator?: number;
      weatherImpact?: number;
      minOrderQuantity?: number;
      maxCapacity?: number;
      safetyStockDays?: number;
      targetServiceLevel?: number;
      inventoryTurnover?: number;
      leadTime?: number;
      sku?: string;
      affectedProducts?: string[];
      affectedLocations?: string[];
      affectedChannels?: string[];
    };
  }>>([]);
  const [filterValues, setFilterValues] = useState({
    skuProduct: 'all',
    location: 'all',
    store: 'all',
    channel: 'all',
    timePeriod: 'all',
    businessUnits: 'all',
    dataAvailability: 'all',
    npiSku: 'none'
  });
  const [appliedFilters, setAppliedFilters] = useState({
    skuProduct: 'all',
    location: 'all',
    store: 'all',
    channel: 'all',
    timePeriod: 'all',
    businessUnits: 'all',
    dataAvailability: 'all',
    npiSku: 'none'
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
          { name: "Promotions & Discounts", autoSelected: true, icon: "Tag" },
          { name: "Seasonality Trends", autoSelected: true, icon: "CalendarDays" },
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

  const applyFilters = (scope: 'local' | 'global') => {
    console.log('Filters applied:', filterValues, 'Scope:', scope);
    setAppliedFilters(filterValues);
    toast.success(`Filters applied ${scope === 'local' ? 'locally' : 'globally'}`);
  };

  const resetFilters = () => {
    const defaultFilters = {
      skuProduct: 'all',
      location: 'all',
      store: 'all',
      channel: 'all',
      timePeriod: 'all',
      businessUnits: 'all',
      dataAvailability: 'all',
      npiSku: 'none'
    };
    setFilterValues(defaultFilters);
    setAppliedFilters(defaultFilters);
    toast.success('All filters reset');
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
    <div className="relative flex flex-col min-h-[calc(100vh-var(--topbar-height,64px))] max-h-[calc(100vh-var(--topbar-height,64px))] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload all your data files at once. You can also select external factors to include in the model.</p>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
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
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                setUploadedFiles(prev => [...prev, ...files]);
                setSelectedPreview(files[0].name);
                setPreviewLoading(true);
                
                // Parse CSV files
                const newParsedData: Record<string, any[]> = {};
                for (const file of files) {
                  if (file.name.endsWith('.csv')) {
                    try {
                      const text = await file.text();
                      const rows = text.trim().split('\n');
                      const headers = rows[0].split(',').map(h => h.trim());
                      const data = rows.slice(1).map(row => {
                        const values = row.split(',');
                        const obj: any = {};
                        headers.forEach((header, i) => {
                          obj[header] = values[i]?.trim() || '';
                        });
                        return obj;
                      });
                      newParsedData[file.name] = data;
                    } catch (error) {
                      console.error(`Error parsing ${file.name}:`, error);
                      toast.error(`Failed to parse ${file.name}`);
                    }
                  }
                }
                
                setParsedCsvData(prev => ({ ...prev, ...newParsedData }));
                setPreviewLoading(false);
              }
              // Reset the input value to allow re-uploading the same files
              e.target.value = '';
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
                            {parsedCsvData[file.name]?.length || 0} rows
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
                        (() => {
                          // Display actual uploaded CSV data
                          const csvData = parsedCsvData[selectedPreview || ''];
                          if (csvData && csvData.length > 0) {
                            const columns = Object.keys(csvData[0]);
                            return (
                              <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">
                                  Showing {Math.min(10, csvData.length)} of {csvData.length} rows
                                </div>
                                <table className="min-w-full text-xs border border-border rounded">
                                  <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                      {columns.map((col) => (
                                        <th key={col} className="text-left px-3 py-2 capitalize">{col.replace(/_/g, ' ')}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {csvData.slice(0, 10).map((row, idx) => (
                                      <tr key={idx} className="hover:bg-muted/20 border-t">
                                        {columns.map((col) => (
                                          <td key={col} className="px-3 py-2">{String(row[col])}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          
                          // Fallback to sample data if no CSV data available
                          return (
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
                          );
                        })()
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
      </div>
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
    <div className="relative flex flex-col min-h-[calc(100vh-var(--topbar-height,64px))] max-h-[calc(100vh-var(--topbar-height,64px))] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
            <p className="text-sm text-muted-foreground">AI detected missing data and suggested imputed values.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{dataQualitySummary.totalIssues} Issues Detected</div>
              <div className="text-xs text-muted-foreground">
                {dataQualitySummary.highSeverity} high · {dataQualitySummary.mediumSeverity} medium · {dataQualitySummary.lowSeverity} low
              </div>
            </div>
            <Button size="sm" onClick={() => setShowAutoFixDialog(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Auto Fix with AI
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
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


      {/* Data Quality Issues Table */}
      <DataQualityIssuesTable 
        issues={dynamicDataQualityIssues}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Data Completeness by Entity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground">Data Completeness by Entity</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows the percentage of complete records for each data entity required for demand forecasting.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar 
              data={{
                labels: ['Sales History', 'Product Master', 'Channel Master', 'Promotions'],
                datasets: [{
                  label: 'Completeness %',
                  data: [94.2, 98.5, 100, 89.3],
                  backgroundColor: [
                    'hsla(142, 76%, 36%, 0.7)',
                    'hsla(142, 76%, 36%, 0.7)',
                    'hsla(142, 76%, 36%, 0.7)',
                    'hsla(45, 93%, 47%, 0.7)',
                  ],
                  borderColor: [
                    'hsl(142, 76%, 36%)',
                    'hsl(142, 76%, 36%)',
                    'hsl(142, 76%, 36%)',
                    'hsl(45, 93%, 47%)',
                  ],
                  borderWidth: 1,
                  borderRadius: 4,
                }]
              }}
              options={{
                indexAxis: 'y' as const,
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => `${context.raw}% complete`
                    }
                  }
                },
                scales: {
                  x: {
                    min: 0,
                    max: 100,
                    grid: { color: hslVar('--border', 0.3) },
                    ticks: { 
                      color: hslVar('--muted-foreground'),
                      callback: (value: any) => `${value}%`
                    }
                  },
                  y: {
                    grid: { display: false },
                    ticks: { color: hslVar('--foreground') }
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <AutoFixDialog
        open={showAutoFixDialog}
        onOpenChange={setShowAutoFixDialog}
        issues={dynamicDataQualityIssues}
        onApplyFixes={() => {
          console.log('Applying fixes...');
          // Here you would apply the fixes to the actual data
        }}
      />

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
      </div>
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

  // ---- Step 3 - Configuration ----
  const renderStep3 = () => (
    <div className="relative flex flex-col min-h-[calc(100vh-var(--topbar-height,64px))] max-h-[calc(100vh-var(--topbar-height,64px))] w-full min-w-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-foreground mb-1">Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure forecast model parameters and review data specifications.</p>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-6">

      {/* Data Configuration Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <div className="text-xs font-medium text-muted-foreground">Data Period</div>
            </div>
            <div className="text-base font-bold text-foreground">Jan 2024 - Dec 2024</div>
            <div className="text-xs text-muted-foreground">12 months</div>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-accent" />
              <div className="text-xs font-medium text-muted-foreground">Total Records</div>
            </div>
            <div className="text-base font-bold text-foreground">82,577</div>
            <div className="text-xs text-muted-foreground">Across all sources</div>
          </CardContent>
        </Card>
        
        <Card className="border-success/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Box className="w-4 h-4 text-success" />
              <div className="text-xs font-medium text-muted-foreground">SKUs/Products</div>
            </div>
            <div className="text-base font-bold text-foreground">100</div>
            <div className="text-xs text-muted-foreground">Unique items</div>
          </CardContent>
        </Card>
        
        <Card className="border-warning/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-warning" />
              <div className="text-xs font-medium text-muted-foreground">Locations</div>
            </div>
            <div className="text-base font-bold text-foreground">45</div>
            <div className="text-xs text-muted-foreground">Geographic points</div>
          </CardContent>
        </Card>
      </div>

      {/* Model Configuration - Elevated */}
      <ModelConfigurationCard
        forecastHorizon={forecastHorizon}
        setForecastHorizon={setForecastHorizon}
        modelGranularity={modelGranularity}
        setModelGranularity={setModelGranularity}
        seasonality={seasonality}
        setSeasonality={setSeasonality}
        confidenceLevel={confidenceLevel}
        setConfidenceLevel={setConfidenceLevel}
        validationSplit={validationSplit}
        setValidationSplit={setValidationSplit}
        abcThresholdA={abcThresholdA}
        setAbcThresholdA={setAbcThresholdA}
        abcThresholdB={abcThresholdB}
        setAbcThresholdB={setAbcThresholdB}
        xyzThresholdX={xyzThresholdX}
        setXyzThresholdX={setXyzThresholdX}
        xyzThresholdY={xyzThresholdY}
        setXyzThresholdY={setXyzThresholdY}
        fmrThresholdF={fmrThresholdF}
        setFmrThresholdF={setFmrThresholdF}
        fmrThresholdM={fmrThresholdM}
        setFmrThresholdM={setFmrThresholdM}
        classificationBasis={classificationBasis}
        setClassificationBasis={setClassificationBasis}
      />

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
                      (() => {
                        // Check for actual uploaded CSV data first
                        const csvData = parsedCsvData[selectedPreview || ''];
                        if (csvData && csvData.length > 0) {
                          const columns = Object.keys(csvData[0]);
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
                                {csvData.slice(0, 10).map((row, index) => (
                                  <tr key={index} className="border-b border-border/40 hover:bg-muted/20">
                                    {columns.map((col) => (
                                      <td key={col} className="p-2">
                                        {String(row[col])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        }
                        
                        // Fallback to sample data
                        return (
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
                        );
                      })()
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

        <div className="flex justify-between pt-4">
          <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>
            ← Back
          </Button>
          <Button size="sm" onClick={() => handleStepTransition(4)}>
            Generate Forecast →
          </Button>
        </div>
        </div>
      </div>
    </div>
  );


  // ---- Step 4 - Results ----
  const renderStep4 = () => (
    <div className="relative flex h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
      {/* Left Sidebar - Canva-style compact panel */}
      <div className="w-[280px] shrink-0 h-full bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col overflow-hidden shadow-lg">
        <div className="flex-none px-4 py-4 border-b border-border/50 bg-gradient-to-b from-card/90 to-card/70 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Results</h2>
        </div>

        {/* Scrollable Metric Cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            <div className="flex justify-center">
            <ForecastCard
              title="Forecast Snapshot"
              value="82%"
              subtitle={(() => {
                const metrics = getStoreMetrics(appliedFilters.store);
                return `Backtested Accuracy • $${metrics.revenueFormatted}M Value • ${metrics.unitsFormatted} Units
                        12-Week Horizon • ${appliedFilters.store === 'all' ? '50' : '1'} Active Store${appliedFilters.store === 'all' ? 's' : ''} • 4 Channels`;
              })()}
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
              value={`${abcThresholdA}%`}
              subtitle={`ABC-XYZ Segmentation • FMR Analysis
                        Impact Analysis • Channel Distribution`}
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

            <div className="flex justify-center">
            <ForecastCard
              title="NPIs & Limited History"
              value="80"
              subtitle="New molecules, generic launches, and outbreak-sensitive SKUs. Items requiring manual review."
              icon={Sparkles}
              isActive={selectedScenario === null && activeTab === "npi"}
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab("npi");
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
        <div className="flex-none flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold tracking-tight text-foreground animate-fade-in">
            {selectedScenario ? `Scenario Analysis: ${scenarios.find(s => s.id === selectedScenario)?.name}` : 
             activeTab === "overview" ? "Forecast Overview" :
             activeTab === "insights" ? "Insights & Impact Analysis" :
             activeTab === "workbook" ? "Collaborative Workbook" :
             activeTab === "npi" ? "New & Limited History Forecast" :
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
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/5">
          {/* Scrollable Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">
        {/* Content based on active tab or selected scenario */}
        {selectedScenario ? (
          <>
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                ← Back to Overview
              </Button>
            </div>
            <ScenarioComparisonDashboard
              scenario={scenarios.find(s => s.id === selectedScenario)!}
              baseline={{
                accuracy: 94.2,
                revenue: 1000000,
                units: 85000
              }}
            />
          </>
        ) : activeTab === "overview" && (
          <div className="animate-fade-in">
            {/* Demand Analysis Chart with controls */}
            <Card className="shadow-elevated border border-border/40 mb-6 flex-1 bg-gradient-to-br from-card via-card to-card/50 hover:shadow-glow transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">Demand Analysis</CardTitle>
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
                  storeFilter={appliedFilters.store}
                  npiSku={appliedFilters.npiSku}
                />
              </CardContent>
            </Card>
            
            {/* Top KPI Row - 3 Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mb-4">
              <CompactMetricCard
                value={appliedFilters.businessUnits === 'enterprise' ? '7.2%' : '8.7%'}
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
                value={appliedFilters.businessUnits === 'enterprise' ? '6.8%' : '9.3%'}
                label="VMAPE"
                tooltip="Volume-weighted MAPE - accuracy metric accounting for volume importance of each forecast."
                valueColor="info"
              />
            </div>

            {/* Enhanced Forecast Snapshot - Logility & Kinexis Inspired */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 mb-5">
              {/* AI Insights & Recommendations */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300 lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      AI-Powered Insights & Recommendations
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/15 text-primary border border-primary/20 shadow-sm">
                      <Brain className="w-3 h-3 mr-1" />
                      ML Enhanced
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-xl bg-success/10 border border-success/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-sm">ABC Revenue Concentration Alert</span>
                          <Badge variant="outline" className="text-xs bg-success/15 text-success border-success/30 shadow-sm">₹52.8Cr Impact</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Class A items (Insulin Glargine SKU004, Azithromycin SKU002, Amoxicillin SKU005) drive 68.5% revenue but show 12% forecast variance in Delhi and Mumbai hospital chains. Recommend daily inventory reviews and +22% safety stock for Q1 2025 to prevent ₹2.4Cr stockout risk on life-saving medications.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-sm">Generic Drug Launch Alert - Cholecalciferol</span>
                          <Badge variant="outline" className="text-xs bg-warning/15 text-warning border-warning/30 shadow-sm">Nov 2024</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Generic Vitamin D3 launch expected to trigger 18% volume surge and 12% price erosion. D3Max (SKU008) faces competition. Secure API supply now and build 8 weeks safety stock to capture market opportunity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-info/10 border border-info/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-sm">Monsoon Disease Outbreak Intelligence</span>
                          <Badge variant="outline" className="text-xs bg-info/15 text-info border-info/30 shadow-sm">+42% Peak</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Seasonal illness data shows 42% surge in respiratory medications during winter (Nov-Feb) and dengue outbreak spike in monsoon (Jul-Sep). Pre-position Azithromycin (SKU002), Paracetamol (SKU001), and Cetirizine (SKU003) in affected regions 4 weeks ahead.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forecast Value Added (FVA) */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">Forecast Value Added</CardTitle>
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
                    <div className="text-3xl font-bold text-success">+15.6%</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Activity className="w-5 h-5 text-primary" />
                    Accuracy Trend (Rolling 12 Weeks)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] flex items-end justify-between gap-2 px-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      // Varied accuracy data - fewer reds, good variation
                      const accuracyValues = [82, 78, 88, 94, 86, 91, 96, 89, 85, 93, 98, 92];
                      const actualAccuracy = accuracyValues[i];
                      // Calculate bar height in pixels (max 150px, min 40px based on 70-100% range)
                      const maxBarHeight = 150;
                      const minBarHeight = 40;
                      const barHeight = minBarHeight + ((actualAccuracy - 70) / 30) * (maxBarHeight - minBarHeight);
                      // Consistent color logic based on accuracy thresholds
                      const colors = actualAccuracy >= 90 
                        ? 'bg-success shadow-sm shadow-success/50' 
                        : actualAccuracy >= 85 
                          ? 'bg-warning shadow-sm shadow-warning/50' 
                          : 'bg-destructive shadow-sm shadow-destructive/50';
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div className="flex-1 flex flex-col items-end justify-end gap-1.5 cursor-pointer group h-full">
                              <div 
                                className={`w-full ${colors} rounded-t-md transition-all group-hover:opacity-80 group-hover:scale-105`}
                                style={{ height: `${barHeight}px` }}
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">W{i+1}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">Week {i+1}</p>
                            <p className="text-sm">Accuracy: {actualAccuracy}%</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {actualAccuracy >= 90 ? 'Excellent Performance' : actualAccuracy >= 85 ? 'Good Performance' : 'Needs Attention'}
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
                      { sku: 'Insulin Glargine SKU004', issue: 'Cold Chain Variability', priority: 'high', variance: '+34%' },
                      { sku: 'Azithromycin SKU002', issue: 'Outbreak Spike', priority: 'medium', variance: '+18%' },
                      { sku: 'Cetirizine SKU003', issue: 'Seasonal Shift', priority: 'medium', variance: '-12%' },
                      { sku: 'Pantoprazole SKU010', issue: 'Low Confidence', priority: 'low', variance: '+8%' },
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
            {/* Top Row: ABC-XYZ Matrix (half) + Channel Distribution (half) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ABC-XYZ Segmentation Matrix */}
              <ABCXYZMatrix />

              {/* Channel Distribution */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <PieChartIcon className="w-5 h-5" />
                    Channel Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie data={channelPieData} options={pieOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row: ABC, XYZ, FMR Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ABC Analysis Chart */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <BarChart3 className="w-5 h-5" />
                      ABC Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>SKU classification by {classificationBasis === 'value' ? 'revenue value' : 'volume'}: A (high), B (medium), C (low).</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <Bar 
                      data={{
                        labels: ['Class A', 'Class B', 'Class C'],
                        datasets: [
                          {
                            label: 'Revenue ($M)',
                            data: [42.3, 18.6, 7.2],
                            backgroundColor: hslVar('--success', 0.7),
                            borderColor: hslVar('--success'),
                            borderWidth: 2,
                            yAxisID: 'y'
                          },
                          {
                            label: 'SKU Count',
                            data: [128, 384, 768],
                            backgroundColor: hslVar('--primary', 0.7),
                            borderColor: hslVar('--primary'),
                            borderWidth: 2,
                            yAxisID: 'y1'
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true,
                            title: { display: true, text: 'Revenue ($M)', font: { size: 10 } }
                          },
                          y1: {
                            type: 'linear',
                            position: 'right',
                            beginAtZero: true,
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'SKU Count', font: { size: 10 } }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xl font-bold text-primary">₹82.4Cr</div>
                    <p className="text-xs text-muted-foreground">Total Revenue Impact</p>
                  </div>
                </CardContent>
              </Card>

              {/* XYZ Analysis Chart */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <BarChart3 className="w-5 h-5" />
                      XYZ Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Demand variability: X (stable), Y (variable), Z (highly unpredictable).</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <Bar 
                      data={{
                        labels: ['X (Stable)', 'Y (Variable)', 'Z (Erratic)'],
                        datasets: [
                          {
                            label: 'Revenue ($M)',
                            data: [38.4, 21.2, 8.5],
                            backgroundColor: hslVar('--success', 0.7),
                            borderColor: hslVar('--success'),
                            borderWidth: 2,
                            yAxisID: 'y'
                          },
                          {
                            label: 'SKU Count',
                            data: [512, 448, 320],
                            backgroundColor: hslVar('--warning', 0.7),
                            borderColor: hslVar('--warning'),
                            borderWidth: 2,
                            yAxisID: 'y1'
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true,
                            title: { display: true, text: 'Revenue ($M)', font: { size: 10 } }
                          },
                          y1: {
                            type: 'linear',
                            position: 'right',
                            beginAtZero: true,
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'SKU Count', font: { size: 10 } }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xl font-bold text-warning">14.2%</div>
                    <p className="text-xs text-muted-foreground">Avg Coefficient of Variation</p>
                  </div>
                </CardContent>
              </Card>

              {/* FMR Analysis Chart */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Activity className="w-5 h-5" />
                      FMR Analysis
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Movement frequency: F (fast), M (medium), R (rare/slow).</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <Bar 
                      data={{
                        labels: ['F (Fast)', 'M (Medium)', 'R (Rare)'],
                        datasets: [
                          {
                            label: 'Units (K)',
                            data: [156, 89, 32],
                            backgroundColor: hslVar('--success', 0.7),
                            borderColor: hslVar('--success'),
                            borderWidth: 2,
                            yAxisID: 'y'
                          },
                          {
                            label: 'SKU Count',
                            data: [384, 512, 384],
                            backgroundColor: hslVar('--info', 0.7),
                            borderColor: hslVar('--info'),
                            borderWidth: 2,
                            yAxisID: 'y1'
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true,
                            title: { display: true, text: 'Units (K)', font: { size: 10 } }
                          },
                          y1: {
                            type: 'linear',
                            position: 'right',
                            beginAtZero: true,
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'SKU Count', font: { size: 10 } }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xl font-bold text-success">156K</div>
                    <p className="text-xs text-muted-foreground">Fast-Moving Units</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Impact Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contribution Analysis */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
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
                  <div className="h-56">
                    <Bar 
                      data={{
                        labels: ['Base Forecast', 'Seasonality', 'Promotions', 'Price Change', 'Final Forecast'],
                        datasets: [{
                          label: 'Contribution ($M)',
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
                            title: { display: true, text: 'Impact ($M)', font: { size: 10 } }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Analysis */}
              <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
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
                  <div className="h-56">
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
                            title: { display: true, text: 'Sensitivity (±%)', font: { size: 10 } }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Impact Insights */}
            <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
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
                        <span className="text-muted-foreground">Revenue Impact</span>
                        <span className="font-medium">+$14.2M</span>
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
                        <span className="font-medium">±$8.1M</span>
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
        {activeTab === "workbook" && (
          <div className="mb-6 animate-fade-in">
            <CollaborativeForecastTable />
          </div>
        )}
        {activeTab === "npi" && (
          <div className="space-y-6 animate-fade-in">
            {/* NPI Overview Subtitle */}
            <p className="text-xs text-muted-foreground">
              SKU categorization based on history reliability — new colours, NPIs, and items requiring manual review.
            </p>
            
            {/* NPI Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="relative overflow-hidden border-border/40 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Total SKUs in Scope</div>
                  <div className="text-2xl font-bold text-foreground mb-1">542</div>
                  <div className="text-[10px] text-muted-foreground mb-2">All pharmacy channels & locations</div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Pharmaceuticals</Badge>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Reliable History</div>
                  <div className="text-2xl font-bold text-success mb-1">320</div>
                  <div className="text-[10px] text-muted-foreground mb-2">12+ months, stable demand patterns</div>
                  <Badge className="bg-success/15 text-success border-success/30 text-[10px] px-1.5 py-0.5">Trusted patterns</Badge>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Limited / Unreliable</div>
                  <div className="text-2xl font-bold text-warning mb-1">142</div>
                  <div className="text-[10px] text-muted-foreground mb-2">Outbreak-driven or seasonal gaps</div>
                  <Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5">Needs similar items</Badge>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">New / Generic Launch</div>
                  <div className="text-2xl font-bold text-destructive mb-1">80</div>
                  <div className="text-[10px] text-muted-foreground mb-2">New formulations & generic entries</div>
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] px-1.5 py-0.5">Manual review</Badge>
                </CardContent>
              </Card>
            </div>
            
            {/* Two Column Layout: Items Table + Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Left: New Items & Out-of-Stock Table */}
              <Card className="lg:col-span-3 border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-foreground">New Items & Out-of-Stock Last Season</CardTitle>
                  <p className="text-[10px] text-muted-foreground">High-impact items with missing or unreliable history.</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/30">
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">SKU</th>
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product</th>
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold min-w-[100px]">Type</th>
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">History</th>
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Last Season</th>
                          <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Strategy</th>
                        </tr>
                      </thead>
                    <tbody>
                        <tr className="border-b border-border/20 hover:bg-muted/20">
                          <td className="py-2 px-2 font-mono text-[10px] text-foreground">GEN-VD3-001</td>
                          <td className="py-2 px-2 text-[10px] text-foreground">Generic Cholecalciferol 60K IU</td>
                          <td className="py-2 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">Generic Launch</Badge></td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">None</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">New Nov 2024</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Use D3Max history +18%</td>
                        </tr>
                        <tr className="border-b border-border/20 hover:bg-muted/20">
                          <td className="py-2 px-2 font-mono text-[10px] text-foreground">NEW-INS-002</td>
                          <td className="py-2 px-2 text-[10px] text-foreground">Insulin Degludec 100U/ml</td>
                          <td className="py-2 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">New Molecule</Badge></td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">3 months</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Limited launch</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Start 1.3× Glargine baseline</td>
                        </tr>
                        <tr className="border-b border-border/20 hover:bg-muted/20">
                          <td className="py-2 px-2 font-mono text-[10px] text-foreground">OB-AZI-003</td>
                          <td className="py-2 px-2 text-[10px] text-foreground">Azithromycin 500mg (Outbreak)</td>
                          <td className="py-2 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">Outbreak SKU</Badge></td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">12 months</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">OOS monsoon</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Blend with outbreak tracking</td>
                        </tr>
                        <tr className="border-b border-border/20 hover:bg-muted/20">
                          <td className="py-2 px-2 font-mono text-[10px] text-foreground">RE-CET-004</td>
                          <td className="py-2 px-2 text-[10px] text-foreground">Cetirizine 10mg (Re-entry)</td>
                          <td className="py-2 px-2"><Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">Re-entry</Badge></td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">6 months</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Sold out allergy season</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Relaunch +25% safety stock</td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 px-2 font-mono text-[10px] text-foreground">BDL-ORS-005</td>
                          <td className="py-2 px-2 text-[10px] text-foreground">ORS + Zinc Combo Pack</td>
                          <td className="py-2 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">Bundle</Badge></td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">8 months</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">N/A</td>
                          <td className="py-2 px-2 text-[10px] text-muted-foreground">Use ORS history + outbreak factor</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              {/* Right: Strategy Summary */}
              <Card className="lg:col-span-2 border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-foreground">Forecast Strategy by Item Group</CardTitle>
                  <p className="text-[10px] text-muted-foreground">How the engine treats each item type.</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-[11px]">
                      <span className="text-foreground font-medium min-w-[90px]">Reliable history</span>
                      <span className="text-muted-foreground">— Trust data, follow chronic medication patterns.</span>
                    </li>
                    <li className="flex gap-2 text-[11px]">
                      <span className="text-foreground font-medium min-w-[90px]">Outbreak-driven</span>
                      <span className="text-muted-foreground">— Blend with disease outbreak tracking data.</span>
                    </li>
                    <li className="flex gap-2 text-[11px]">
                      <span className="text-foreground font-medium min-w-[90px]">Generic launch</span>
                      <span className="text-muted-foreground">— Start from branded molecule, apply price elasticity.</span>
                    </li>
                    <li className="flex gap-2 text-[11px]">
                      <span className="text-foreground font-medium min-w-[90px]">NPI</span>
                      <span className="text-muted-foreground">— Use "look-alike" families as launch guide.</span>
                    </li>
                    <li className="flex gap-2 text-[11px]">
                      <span className="text-foreground font-medium min-w-[90px]">Stock-out items</span>
                      <span className="text-muted-foreground">— Treat OOS as lost demand, plan higher.</span>
                    </li>
                  </ul>
                  
                  <div className="border-t border-border/40 pt-3 mt-3">
                    <div className="text-[10px] text-foreground font-semibold mb-2 uppercase tracking-wider">Launch Playbook</div>
                    <ul className="space-y-1 text-[10px] text-muted-foreground list-disc list-inside">
                      <li>Hospital pharmacies & large chains get stronger launch quantities.</li>
                      <li>Cold chain SKUs: extra safety stock in metros with reliable storage.</li>
                      <li>Outbreak drugs: pre-position 4 weeks before monsoon season.</li>
                      <li>Generic launches: match distribution to branded molecule footprint.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Mix & Risk View */}
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-foreground">Mix & Risk View</CardTitle>
                <p className="text-[10px] text-muted-foreground">SKU group split and stock-out risk from last monsoon season.</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Forecast Coverage Mix */}
                  <div>
                    <div className="text-[11px] font-semibold text-foreground mb-3">Forecast Coverage Mix</div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-28 text-[10px] text-muted-foreground">Reliable history</div>
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-success to-success/80 rounded-full" style={{ width: '52%' }} />
                        </div>
                        <div className="text-[10px] font-semibold text-foreground w-8">52%</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-28 text-[10px] text-muted-foreground">Limited / unreliable</div>
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-warning to-warning/80 rounded-full" style={{ width: '28%' }} />
                        </div>
                        <div className="text-[10px] font-semibold text-foreground w-8">28%</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-28 text-[10px] text-muted-foreground">New & NPI</div>
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" style={{ width: '20%' }} />
                        </div>
                        <div className="text-[10px] font-semibold text-foreground w-8">20%</div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        Model-led
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        Hybrid
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Rule + analogue
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock-out Risk Table */}
                  <div>
                    <div className="text-[11px] font-semibold text-foreground mb-3">Stock-out Risk (Last Monsoon)</div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40 bg-muted/30">
                          <th className="text-left py-1.5 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Group</th>
                          <th className="text-left py-1.5 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Rate</th>
                          <th className="text-left py-1.5 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk</th>
                          <th className="text-left py-1.5 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-1.5 px-2 text-[10px] text-foreground">Chronic Care</td>
                          <td className="py-1.5 px-2 text-[10px] text-foreground">4%</td>
                          <td className="py-1.5 px-2"><Badge className="bg-success/15 text-success border-success/30 text-[10px] px-1.5 py-0.5">Low</Badge></td>
                          <td className="py-1.5 px-2 text-[10px] text-muted-foreground">Stable refill patterns</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-1.5 px-2 text-[10px] text-foreground">Seasonal</td>
                          <td className="py-1.5 px-2 text-[10px] text-foreground">12%</td>
                          <td className="py-1.5 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5">Med</Badge></td>
                          <td className="py-1.5 px-2 text-[10px] text-muted-foreground">Monsoon surge timing</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-1.5 px-2 text-[10px] text-foreground">Outbreak</td>
                          <td className="py-1.5 px-2 text-[10px] text-foreground">22%</td>
                          <td className="py-1.5 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5">High</Badge></td>
                          <td className="py-1.5 px-2 text-[10px] text-muted-foreground">Dengue spike OOS</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 text-[10px] text-foreground">Generic Launch</td>
                          <td className="py-1.5 px-2 text-[10px] text-foreground">18%</td>
                          <td className="py-1.5 px-2"><Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] px-1.5 py-0.5">V. High</Badge></td>
                          <td className="py-1.5 px-2 text-[10px] text-muted-foreground">API supply constraints</td>
                        </tr>
                      </tbody>
                    </table>
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
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="SKU001">Paracetamol 500mg Tablet</SelectItem>
                        <SelectItem value="SKU002">Azithromycin 500mg Tablet</SelectItem>
                        <SelectItem value="SKU003">Cetirizine 10mg Tablet</SelectItem>
                        <SelectItem value="SKU004">Insulin Glargine 100U/ml</SelectItem>
                        <SelectItem value="SKU005">Amoxicillin 500mg Capsule</SelectItem>
                        <SelectItem value="SKU006">ORS Sachet (WHO Formula)</SelectItem>
                        <SelectItem value="SKU007">Salbutamol 100mcg Inhaler</SelectItem>
                        <SelectItem value="SKU008">Cholecalciferol 60K IU</SelectItem>
                        <SelectItem value="SKU009">Ceftriaxone 1g Injection</SelectItem>
                        <SelectItem value="SKU010">Pantoprazole 40mg Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      NPI (New Product)
                    </label>
                    <Select value={filterValues.npiSku} onValueChange={(value) => setFilterValues(prev => ({ ...prev, npiSku: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select NPI" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="NPI001">Generic Cholecalciferol 60K IU</SelectItem>
                        <SelectItem value="NPI002">Insulin Degludec 100U/ml</SelectItem>
                        <SelectItem value="NPI003">Favipiravir 200mg Tablet</SelectItem>
                        <SelectItem value="NPI004">Remdesivir 100mg Injection</SelectItem>
                        <SelectItem value="NPI005">Molnupiravir 200mg Capsule</SelectItem>
                        <SelectItem value="NPI006">Ivermectin 12mg Tablet</SelectItem>
                        <SelectItem value="NPI007">Dexamethasone 6mg Tablet</SelectItem>
                        <SelectItem value="NPI008">Tocilizumab 400mg Injection</SelectItem>
                        <SelectItem value="NPI009">Baricitinib 4mg Tablet</SelectItem>
                        <SelectItem value="NPI010">Enoxaparin 60mg Injection</SelectItem>
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
                        <SelectItem value="retail">Retail Pharmacy</SelectItem>
                        <SelectItem value="hospital">Hospital Pharmacy</SelectItem>
                        <SelectItem value="epharmacy">E-Pharmacy</SelectItem>
                        <SelectItem value="distributor">Distributor/Stockist</SelectItem>
                        <SelectItem value="govt">Government Tender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Store
                    </label>
                    <Select value={filterValues.store} onValueChange={(value) => setFilterValues(prev => ({ ...prev, store: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Stores</SelectItem>
                        <SelectItem value="L001">Pune Store L001</SelectItem>
                        <SelectItem value="L002">Mumbai Store L002</SelectItem>
                        <SelectItem value="L003">Delhi Store L003</SelectItem>
                        <SelectItem value="L004">Kolkata Store L004</SelectItem>
                        <SelectItem value="L005">Mumbai Store L005</SelectItem>
                        <SelectItem value="L006">Chennai Store L006</SelectItem>
                        <SelectItem value="L007">Kolkata Store L007</SelectItem>
                        <SelectItem value="L008">Bengaluru Store L008</SelectItem>
                        <SelectItem value="L009">Bengaluru Store L009</SelectItem>
                        <SelectItem value="L010">Chennai Store L010</SelectItem>
                        <SelectItem value="L015">Mumbai Store L015</SelectItem>
                        <SelectItem value="L020">Ahmedabad Store L020</SelectItem>
                        <SelectItem value="L030">Mumbai Store L030</SelectItem>
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
                    <Button onClick={() => applyFilters('local')} className="flex-1">
                      Apply
                    </Button>
                    <Button onClick={resetFilters} variant="outline" className="flex-1">
                      Reset
                    </Button>
                  </div>
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
        <Dialog open={previewDriverDialog.open} onOpenChange={(open) => {
          setPreviewDriverDialog({open, driverName: null});
          if (!open) {
            setDriverFilters({});
            setDriverSortConfig(null);
          }
        }}>
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
                let driverData = getFoundryObjectData(foundryKey) as any[];
                if (!driverData || driverData.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Database className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No sample data available for this driver</p>
                    </div>
                  );
                }
                
                const columns = Object.keys(driverData[0]);
                
                // Apply filters
                let filteredData = driverData.filter((row: any) => {
                  return columns.every((col) => {
                    const filterValue = driverFilters[col];
                    if (!filterValue) return true;
                    const cellValue = String(row[col]).toLowerCase();
                    return cellValue.includes(filterValue.toLowerCase());
                  });
                });

                // Apply sorting
                if (driverSortConfig) {
                  filteredData = [...filteredData].sort((a, b) => {
                    const aVal = a[driverSortConfig.column];
                    const bVal = b[driverSortConfig.column];
                    
                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                      return driverSortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                    }
                    
                    const aStr = String(aVal).toLowerCase();
                    const bStr = String(bVal).toLowerCase();
                    
                    if (driverSortConfig.direction === 'asc') {
                      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
                    } else {
                      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
                    }
                  });
                }

                const handleSort = (column: string) => {
                  setDriverSortConfig((current) => {
                    if (current?.column === column) {
                      return current.direction === 'asc' 
                        ? { column, direction: 'desc' }
                        : null;
                    }
                    return { column, direction: 'asc' };
                  });
                };
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Data Preview</p>
                        <p className="text-xs text-muted-foreground">
                          Showing {filteredData.length} of {driverData.length} records from {previewDriverDialog.driverName}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {columns.length} columns
                      </Badge>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                              {columns.map((col) => (
                                <th key={col} className="text-left p-2 font-medium border-b">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleSort(col)}
                                      className="flex items-center gap-1 hover:text-primary transition-colors capitalize"
                                    >
                                      {col.replace(/_/g, ' ')}
                                      {driverSortConfig?.column === col && (
                                        driverSortConfig.direction === 'asc' ? (
                                          <ArrowUp className="w-3 h-3" />
                                        ) : (
                                          <ArrowDown className="w-3 h-3" />
                                        )
                                      )}
                                    </button>
                                  </div>
                                  <Input
                                    placeholder="Filter..."
                                    value={driverFilters[col] || ''}
                                    onChange={(e) => setDriverFilters(prev => ({
                                      ...prev,
                                      [col]: e.target.value
                                    }))}
                                    className="mt-1 h-7 text-xs bg-background"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((row: any, index: number) => (
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
