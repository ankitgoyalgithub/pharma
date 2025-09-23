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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

// Data imports
import { workbookData } from "@/data/demandForecasting/workbookData";
import { dataPreviewSample } from "@/data/demandForecasting/dataPreviewSample";
import { forecastMetrics } from "@/data/demandForecasting/forecastMetrics";
import { historicalForecastData } from "@/data/demandForecasting/historicalForecastData";
import { pieData } from "@/data/demandForecasting/pieData";
import { skuData } from "@/data/demandForecasting/skuData";
import { gapData } from "@/data/demandForecasting/gapData";
import { externalDriversPreviewData, getDriverPreviewData } from "@/data/demandForecasting/externalDriversData";
import { sampleAiResponses } from "@/data/demandForecasting/aiResponses";
import { masterObjects, timeseriesObjects } from "@/data/demandForecasting/foundryObjects";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'transactional', fromDate?: Date, toDate?: Date}>>([]);
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
  const [selectedDataType, setSelectedDataType] = useState<'master' | 'timeseries' | ''>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  // Step 3 state - moved to top level
  const [overrideForecast, setOverrideForecast] = useState(false);
  const [scenarioValue, setScenarioValue] = useState([95, 125, 110, 135, 145]);


  const handleFoundrySubmit = () => {
    if (!selectedObject) return;
    
    const newObject = {
      name: selectedObject,
      type: selectedDataType === 'timeseries' ? 'transactional' as const : 'master' as const,
      ...(selectedDataType === 'timeseries' && { fromDate, toDate })
    };
    
    setFoundryObjects(prev => [...prev, newObject]);
    
    // Reset form
    setSelectedDataType('');
    setSelectedObject('');
    setFromDate(undefined);
    setToDate(undefined);
    setIsFoundryModalOpen(false);
    
    // Set preview to new object
    setSelectedPreview(selectedObject);
    setPreviewLoading(true);
    setTimeout(() => setPreviewLoading(false), 700);
  };
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "workbook" | "impact">("overview");
  const [showImputedReview, setShowImputedReview] = useState(false);
  // Demand Analysis controls
  const [granularity, setGranularity] = useState<"weekly" | "monthly" | "quarterly">("weekly");
  const [valueMode, setValueMode] = useState<"value" | "volume">("value");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

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
          { name: "Ad Spend", autoSelected: true, icon: "DollarSign" },
          { name: "Competitor Pricing", autoSelected: true, icon: "Users" },
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

  // ---- Step 1 ----
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  
  const externalDrivers = getExternalDrivers(hasData);

  const renderStep1 = () => (
    <div className="space-y-6 p-0">
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
                <p>Upload your historical demand data, product master data, and other relevant files. Supported formats: CSV, Excel, JSON.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
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
            {" "}with pre-configured sheets (Sales, Product, Location, Channel, External Factors)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('file-upload')?.click()}>
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
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Map Data from Foundry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Type</label>
                    <Select value={selectedDataType} onValueChange={(value: 'master' | 'timeseries') => {
                      setSelectedDataType(value);
                      setSelectedObject(''); // Reset object selection
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="timeseries">Timeseries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDataType && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Object</label>
                      <Select value={selectedObject} onValueChange={setSelectedObject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select object" />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedDataType === 'master' ? masterObjects : timeseriesObjects).map((obj) => (
                            <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedDataType === 'timeseries' && (
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
                            <Calendar
                              mode="single"
                              selected={fromDate}
                              onSelect={setFromDate}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
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
                            <Calendar
                              mode="single"
                              selected={toDate}
                              onSelect={setToDate}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsFoundryModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleFoundrySubmit}
                      disabled={!selectedObject || (selectedDataType === 'timeseries' && (!fromDate || !toDate))}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </DialogContent>
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

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base font-medium text-foreground">AI Suggested External Drivers</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>AI-suggested external factors that may influence demand patterns based on your data characteristics.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {externalDrivers.map((driver) => {
            const isSelected = selectedDrivers.includes(driver.name);
            const isAutoSelected = driver.autoSelected;
            const isLoadingThis = driversLoading && isAutoSelected;
            const isDisabled = driversLoading && !isAutoSelected && !isSelected;
            
            return (
            <div
              key={driver.name}
              className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-colors ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/50 cursor-pointer'
              }`}
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => !isDisabled && !isLoadingThis && toggleDriver(driver.name)}
              >
                {driver.icon === "Calendar" && <CalendarIcon className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "DollarSign" && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "CloudRain" && <CloudRain className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "TrendingUp" && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "BarChart3" && <BarChart3 className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Users" && <Users className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "MessageCircle" && <MessageCircle className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Award" && <Award className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">{driver.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-1 h-6 text-xs"
                    onClick={() => {
                      setSelectedPreview(driver.name);
                      setPreviewLoading(true);
                      setTimeout(() => setPreviewLoading(false), 700);
                    }}
                  >
                    Preview
                  </Button>
                )}
                {isLoadingThis ? (
                  <div className="animate-spin h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full" />
                ) : (
                  <GradientSwitch 
                    checked={isSelected} 
                    disabled={isDisabled}
                  />
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>

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
                                {(() => {
                                  const driverData = getDriverPreviewData(selectedPreview || "");
                                  return driverData ? driverData.data.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-muted/20">
                                      <td className="px-3 py-2">{row.date}</td>
                                      <td className="px-3 py-2">{row.value}</td>
                                    </tr>
                                  )) : [];
                                })()}
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Data Source Info</h4>
                            <div className="text-xs text-muted-foreground space-y-2">
                              {(() => {
                                const driverData = getDriverPreviewData(selectedPreview || "");
                                return driverData ? (
                                  <>
                                    <div><strong>Source:</strong> {driverData.source}</div>
                                    <div><strong>Update Frequency:</strong> {driverData.updateFrequency}</div>
                                  </>
                                ) : (
                                  <>
                                    <div><strong>Source:</strong> Unknown</div>
                                    <div><strong>Update Frequency:</strong> Unknown</div>
                                  </>
                                );
                              })()}
                              <div><strong>Historical Coverage:</strong> 5+ years</div>
                              <div><strong>Reliability:</strong> High (99.5% uptime)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular file/foundry preview
                      <table className="min-w-full text-xs border border-border rounded">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2">SKU</th>
                            <th className="text-left px-3 py-2">Location</th>
                            <th className="text-left px-3 py-2">Channel</th>
                            <th className="text-left px-3 py-2">Week 1</th>
                            <th className="text-left px-3 py-2">Week 2</th>
                            <th className="text-left px-3 py-2">Week 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workbookData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/20">
                              <td className="px-3 py-2">{row.sku}</td>
                              <td className="px-3 py-2">{row.location}</td>
                              <td className="px-3 py-2">{row.channel}</td>
                              <td className="px-3 py-2">
                                <Input value={row.week1.toString()} className="w-16" readOnly />
                              </td>
                              <td className="px-3 py-2">
                                <Input value={row.week2.toString()} className="w-16" readOnly />
                              </td>
                              <td className="px-3 py-2">
                                <Input value={row.week3.toString()} className="w-16" readOnly />
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
    <div className="space-y-6 p-0">
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
        borderSkipped: false,
        borderDash: [6, 4],
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
    <div className="space-y-6 p-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Review your processed data and configure forecast settings.</p>
      </div>

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
                    <table className="w-full text-xs">
                      <thead className="bg-muted/20 sticky top-16">
                        <tr>
                          <th className="text-left p-2 font-medium">SKU</th>
                          <th className="text-left p-2 font-medium">Product</th>
                          <th className="text-left p-2 font-medium">Location</th>
                          <th className="text-left p-2 font-medium">Channel</th>
                          <th className="text-left p-2 font-medium">Current Demand</th>
                          <th className="text-left p-2 font-medium">Forecasted Demand</th>
                          <th className="text-left p-2 font-medium">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataPreviewSample.map((row, index) => (
                          <tr key={index} className="border-b border-border/40 hover:bg-muted/20">
                            <td className="p-2">{row.sku}</td>
                            <td className="p-2">{row.product}</td>
                            <td className="p-2">{row.location}</td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">{row.channel}</Badge>
                            </td>
                            <td className="p-2 font-medium">{row.currentDemand}</td>
                            <td className="p-2 font-medium">{row.forecastedDemand}</td>
                            <td className="p-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${row.variance.startsWith('+') ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
                              >
                                {row.variance}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
  );


  // ---- Step 4 - Results ----
  const renderStep4 = () => (
    <div className="flex h">
      {/* Left Sidebar with Clickable Cards */}
      <div className="w-full sm:w-[30%] lg:w-[25%] xl:w-[20%] bg-card border-r p-1 flex flex-col h max-h-screen">
        <div className="flex-none">
          <h2 className="text-xl font-bold text-foreground mb-2">Forecast Results</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        {/* Clickable Metric Cards */}
        <ScrollArea className="flex-1 mt-3">
          <div className="grid gap-3 pb-4 justify-items-center">
            <div>
            <ForecastCard
              title="Forecast Snapshot"
              value="94.2%"
              subtitle="Backtested Accuracy 
                        $48.2M, 125K+ units
                        sales forecasted next 12 months"
              icon={TrendingUp}
              isActive={selectedScenario === null && activeTab === "overview"}
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab("overview");
              }}
            />
            </div>

            <div>
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

            <div>
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

            {/* Dynamic Scenarios */}
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="relative group">
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
      <div className="flex-1 p-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Forecast Overview"}
              {activeTab === "insights" && "Insights Dashboard"}
              {activeTab === "workbook" && "Forecast Workbook"}
              {activeTab === "impact" && "Impact Analysis"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Comprehensive forecast insights and analytics"}
              {activeTab === "insights" && "Demand analysis, revenue projections, and classification insights"}
              {activeTab === "workbook" && "Interactive data table with collaboration features"}
              {activeTab === "impact" && "Driver contributions, sensitivity analysis, and event impact assessment"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              ← Back
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Content based on active tab or selected scenario */}
        {selectedScenario ? (
          <>
            {/* Scenario Comparison View */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Scenario Analysis: {scenarios.find(s => s.id === selectedScenario)?.name}</h2>
                  <p className="text-muted-foreground">Comparison with baseline forecast</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                  ← Back to Overview
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <>
            {/* Demand Analysis Chart with controls */}
            <Card className="shadow-card border-0 mb-4 flex-1">
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
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <Bar data={demandLineData as any} options={demandLineOptions} />
                </div>
              </CardContent>
            </Card>
            
            {/* Top KPI Row - 4 Smaller Cards */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <CompactMetricCard
                value={filterValues.skuProduct !== 'all' || filterValues.location !== 'all' ? '91%' : '89%'}
                label="Model Accuracy"
                tooltip="Percentage of forecasts that fall within acceptable accuracy range. Higher is better."
                valueColor="success"
              />

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

            {/* Revenue and Volume Projections Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <CompactProjectionCard
                title="Revenue Projection"
                value={filterValues.location === 'north' ? '₹52.8M' : filterValues.location === 'south' ? '₹41.6M' : '₹48.2M'}
                subtitle="Next 12 Months"
                tooltip="Total forecasted revenue for the next 12 months based on demand predictions and pricing models."
              />

              <CompactProjectionCard
                title="Volume Projection"
                value={filterValues.channel === 'online' ? '98K' : filterValues.channel === 'retail' ? '78K' : '125K'}
                subtitle="units (Next 12 Months)"
                tooltip="Total forecasted demand volume (units) for the next 12 months across all products and channels."
              />
            </div>

            
          </>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6">
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
          <div className="mb-6">
            <CollaborativeForecastTable />
          </div>
        )}
        {activeTab === "impact" && (
          <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
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
      </div>

      {/* Right Sidebar */}
      <div className={`${rightSidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-l p-1 flex flex-col h max-h-screen transition-all duration-200`}>
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="px-4 py-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
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

export default DemandForecasting;
