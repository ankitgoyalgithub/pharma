import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { GradientSwitch } from "@/components/ui/gradient-switch";
import { format } from "date-fns";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import { CompactMetricCard } from "@/components/CompactMetricCard";
import { CompactProjectionCard } from "@/components/CompactProjectionCard";
import { ForecastCard } from "@/components/ForecastCard";
import { OpexScenarioCreation } from "@/components/OpexScenarioCreation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  Download, Upload, Check, ChevronRight, 
  FileSpreadsheet, DollarSign, TrendingUp, 
  AlertCircle, CheckCircle, FileText,
  PieChart, BarChart3, Zap, Filter,
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  MessageCircle, Share, Award, Info, X,
  Package, Users, Settings, MoreHorizontal,
  Database, Calendar as CalendarIcon, Building,
  Wand2, Trash2, Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { buildChartOptions, hslVar, chartPalette } from "@/lib/chartTheme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, ChartTooltip, ChartLegend);

const OpexPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "workbook" | "departments" | "accuracy" | "optimization" | "variance" | "efficiency" | "department">("overview");
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [aiPrompt, setAiPrompt] = useState('');

  // Step 1 data state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'transactional', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<'master' | 'timeseries' | ''>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  // Step 3 auto-fix state
  const [autoFixesApplied, setAutoFixesApplied] = useState(false);
  const [showAutoFixes, setShowAutoFixes] = useState(false);

  // Step 4 state
  const [rightSidebarTab, setRightSidebarTab] = useState<'ai' | 'filter' | 'scenario'>('filter');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [filterValues, setFilterValues] = useState({
    department: 'all',
    costHead: 'all',
    period: 'all',
    budgetVariance: 'all'
  });

  // Scenario management state
  const [scenarios, setScenarios] = useState<Array<{
    id: string;
    name: string;
    value: string;
    subtitle: string;
    factors?: {
      energyCostChange: number;
      inflationRate: number;
      headcountChange: number;
      efficiencyGain: number;
      department: string;
    };
  }>>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Upload Opex", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Categorize Expenses", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Data Gaps", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Opex Planning",
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
    // Auto-collapse sidebar when entering usecase
    const event = new CustomEvent('collapseSidebar');
    window.dispatchEvent(event);
  }, []);

  const templateData = [
    { cost_head: "Travel", dept: "Sales", month: "Jan-25", budget_amt: "₹230,000", actual_amt: "₹214,000" },
    { cost_head: "Rent", dept: "Admin", month: "Jan-25", budget_amt: "₹180,000", actual_amt: "₹190,000" },
    { cost_head: "Utilities", dept: "Factory Ops", month: "Jan-25", budget_amt: "₹65,000", actual_amt: "₹59,000" },
    { cost_head: "Advertising", dept: "Marketing", month: "Jan-25", budget_amt: "₹420,000", actual_amt: "₹376,000" },
    { cost_head: "Training", dept: "HR", month: "Jan-25", budget_amt: "₹15,000", actual_amt: "₹9,500" }
  ];

  const categorizeData = [
    { detected: "T&E", category: "Travel & Entertainment", group: "Variable Costs", status: "suggested" },
    { detected: "Electricity Bill", category: "Utilities", group: "Fixed Costs", status: "confirmed" },
    { detected: "Manpower Contract", category: "Contracted Services", group: "Variable Costs", status: "suggested" },
    { detected: "IT Infra Lease", category: "IT Rentals", group: "Fixed Costs", status: "confirmed" },
    { detected: "Paid Campaigns", category: "Advertising", group: "Variable Costs", status: "suggested" },
    { detected: "Office Supplies", category: "General & Admin", group: "Variable Costs", status: "suggested" },
    { detected: "Insurance Premium", category: "Fixed Overhead", group: "Fixed Costs", status: "confirmed" },
    { detected: "Legal Fees", category: "Professional Services", group: "Variable Costs", status: "suggested" }
  ];

  const monthlySpendData = [
    { month: "Jan", "T&E": 2.3, "Utilities": 1.8, "Rent": 3.2, "Services": 1.5, "G&A": 2.1 },
    { month: "Feb", "T&E": 2.1, "Utilities": 1.7, "Rent": 3.2, "Services": 1.8, "G&A": 1.9 },
    { month: "Mar", "T&E": 2.5, "Utilities": 1.9, "Rent": 3.2, "Services": 2.0, "G&A": 2.3 },
    { month: "Apr", "T&E": 2.8, "Utilities": 2.1, "Rent": 3.4, "Services": 1.6, "G&A": 2.0 },
    { month: "May", "T&E": 2.4, "Utilities": 2.3, "Rent": 3.4, "Services": 1.9, "G&A": 2.2 },
    { month: "Jun", "T&E": 2.6, "Utilities": 2.0, "Rent": 3.4, "Services": 2.1, "G&A": 2.4 }
  ];

  const pieData = [
    { name: "T&E", value: 18, fill: "#3b82f6" },
    { name: "Utilities", value: 15, fill: "#10b981" },
    { name: "Rent", value: 25, fill: "#8b5cf6" },
    { name: "Services", value: 20, fill: "#f59e0b" },
    { name: "G&A", value: 22, fill: "#ef4444" }
  ];

  const waterfallData = [
    { name: "Budget", value: 82.4, cumulative: 82.4 },
    { name: "Overruns", value: 3.2, cumulative: 85.6 },
    { name: "Savings", value: -7.4, cumulative: 78.2 },
    { name: "Actual", value: 78.2, cumulative: 78.2 }
  ];

  const departmentData = [
    { department: "Sales", budgeted: "₹14.5M", actual: "₹13.8M", deviation: "₹-700K", deviationPct: "-4.8%", topCostHead: "Travel" },
    { department: "Marketing", budgeted: "₹9.6M", actual: "₹10.1M", deviation: "₹+500K", deviationPct: "+5.2%", topCostHead: "Advertising" },
    { department: "Operations", budgeted: "₹11.2M", actual: "₹10.6M", deviation: "₹-600K", deviationPct: "-5.3%", topCostHead: "Maintenance" },
    { department: "HR", budgeted: "₹6.4M", actual: "₹5.9M", deviation: "₹-500K", deviationPct: "-7.8%", topCostHead: "Training" },
    { department: "Admin", budgeted: "₹7.5M", actual: "₹8.2M", deviation: "₹+700K", deviationPct: "+9.3%", topCostHead: "Rent" },
    { department: "IT", budgeted: "₹5.8M", actual: "₹5.4M", deviation: "₹-400K", deviationPct: "-6.9%", topCostHead: "Infrastructure" },
    { department: "Finance", budgeted: "₹4.2M", actual: "₹4.5M", deviation: "₹+300K", deviationPct: "+7.1%", topCostHead: "Professional Services" },
    { department: "Legal", budgeted: "₹3.1M", actual: "₹3.3M", deviation: "₹+200K", deviationPct: "+6.5%", topCostHead: "Legal Fees" }
  ];

  const historicalForecastData = [
    { period: "Week 1", historical: 120, forecast: 115, optimized: 110 },
    { period: "Week 2", historical: 125, forecast: 122, optimized: 118 },
    { period: "Week 3", historical: 135, forecast: 140, optimized: 132 },
    { period: "Week 4", historical: 145, forecast: 150, optimized: 142 },
    { period: "Week 5", historical: 155, forecast: 160, optimized: 152 },
    { period: "Week 6", historical: 150, forecast: 155, optimized: 148 },
    { period: "Week 7", historical: 165, forecast: 170, optimized: 162 },
    { period: "Week 8", historical: 170, forecast: 175, optimized: 168 },
    { period: "Week 9", historical: 160, forecast: 165, optimized: 158 },
    { period: "Week 10", historical: 175, forecast: 180, optimized: 172 },
    { period: "Week 11", historical: 180, forecast: 185, optimized: 178 },
    { period: "Week 12", historical: 185, forecast: 190, optimized: 182 }
  ];

  const sampleAiResponses = [
    "Based on your OPEX data, I notice T&E expenses have increased 15% this quarter. Consider implementing approval workflows for expenses above ₹50K.",
    "Your utilities costs show seasonal patterns - 20% higher in summer months. Budget planning should account for this variance.",
    "Marketing spend efficiency has improved 12% compared to last year. ROI on digital campaigns shows 3.2x return vs traditional channels.",
    "Admin costs are 8% above budget due to office rent increases. Consider renegotiating lease terms or exploring co-working options.",
    "IT infrastructure costs decreased 5% after cloud migration. Server maintenance savings total ₹2.3M annually."
  ];

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const filteredData = departmentData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topCostHead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === '' || filterDept === 'all' || item.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === '') return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const sendAiMessage = () => {
    if (!aiPrompt.trim()) return;
    
    const userMessage = { role: 'user' as const, content: aiPrompt };
    const randomResponse = sampleAiResponses[Math.floor(Math.random() * sampleAiResponses.length)];
    const assistantMessage = { role: 'assistant' as const, content: randomResponse };
    
    setAiMessages(prev => [...prev, userMessage, assistantMessage]);
    setAiPrompt('');
  };

  // Mock data for foundry objects
  const masterObjects = [
    'Cost_Master',
    'Department_Master', 
    'Vendor_Master',
    'Employee_Master'
  ];

  const timeseriesObjects = [
    'Expense_Historical',
    'Budget_Data',
    'Invoice_History',
    'Payment_Data'
  ];

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

  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  
  const externalDriversOpex = [
    { name: "Holiday Calendar", autoSelected: hasData, icon: "Calendar" },
    { name: "Headcount Changes", autoSelected: hasData, icon: "Users" },
    { name: "Inflation Index", autoSelected: false, icon: "TrendingUp" },
    { name: "Energy Prices", autoSelected: false, icon: "Zap" },
    { name: "Office Occupancy", autoSelected: hasData, icon: "Package" },
    { name: "IT Infrastructure", autoSelected: false, icon: "Settings" },
    { name: "Vendor Performance", autoSelected: false, icon: "Award" },
    { name: "Regulatory Changes", autoSelected: false, icon: "AlertCircle" },
  ];

  // Auto-select drivers when data sources are added
  useEffect(() => {
    const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
    if (hasData && selectedDrivers.length === 0) {
      setDriversLoading(true);
      setTimeout(() => {
        const driversToSelect = [
          { name: "Holiday Calendar", autoSelected: true, icon: "Calendar" },
          { name: "Headcount Changes", autoSelected: true, icon: "Users" },
          { name: "Office Occupancy", autoSelected: true, icon: "Package" },
        ];
        setSelectedDrivers(driversToSelect.filter(d => d.autoSelected).map(d => d.name));
        setDriversLoading(false);
      }, 500);
    }
  }, [uploadedFiles.length, foundryObjects.length]);

  const toggleDriver = (driver: string) => {
    setSelectedDrivers((prev) => (prev.includes(driver) ? prev.filter((d) => d !== driver) : [...prev, driver]));
  };

  const renderStep1 = () => (
    <div className="space-y-6 p-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload your OPEX data files at once. You can also select external factors to include in the model.</p>
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
                <p>Upload your historical OPEX data, budget data, and other relevant files. Supported formats: CSV, Excel, JSON.</p>
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
                link.download = 'opex-data-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
            {" "}with pre-configured sheets (Expenses, Cost Centers, Departments, Budget vs Actual)
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
                          <Calendar className="mr-2 h-4 w-4" />
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
                          <Calendar className="mr-2 h-4 w-4" />
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
              <p>AI-suggested external factors that may influence OPEX patterns based on your data characteristics.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {externalDriversOpex.map((driver) => {
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
                {driver.icon === "Users" && <Users className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "TrendingUp" && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Zap" && <Zap className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Package" && <Package className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Settings" && <Settings className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Award" && <Award className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "AlertCircle" && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
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
                    onCheckedChange={() => !isDisabled && toggleDriver(driver.name)}
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
                  <div className="space-y-4">
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
                      <table className="min-w-full text-xs border border-border rounded">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2">Date</th>
                            <th className="text-left px-3 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: "2024-01-01", value: selectedPreview === "Holiday Calendar" ? "New Year" : 
                              selectedPreview === "Headcount Changes" ? "+5 employees" :
                              selectedPreview === "Inflation Index" ? "5.2%" :
                              selectedPreview === "Energy Prices" ? "$0.12/kWh" :
                              selectedPreview === "Office Occupancy" ? "85%" :
                              selectedPreview === "IT Infrastructure" ? "Cloud costs" :
                              selectedPreview === "Vendor Performance" ? "98%" : "Low impact" },
                            { date: "2024-01-02", value: selectedPreview === "Holiday Calendar" ? "Regular" : 
                              selectedPreview === "Headcount Changes" ? "+2 employees" :
                              selectedPreview === "Inflation Index" ? "5.1%" :
                              selectedPreview === "Energy Prices" ? "$0.11/kWh" :
                              selectedPreview === "Office Occupancy" ? "92%" :
                              selectedPreview === "IT Infrastructure" ? "On-premise" :
                              selectedPreview === "Vendor Performance" ? "95%" : "Medium impact" },
                          ].map((item, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="px-3 py-2">{item.date}</td>
                              <td className="px-3 py-2">{item.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      // File/Foundry object preview
                      <table className="min-w-full text-xs border border-border rounded">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2">Cost Head</th>
                            <th className="text-left px-3 py-2">Department</th>
                            <th className="text-left px-3 py-2">Month</th>
                            <th className="text-left px-3 py-2">Budget Amount</th>
                            <th className="text-left px-3 py-2">Actual Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {templateData.slice(0, 3).map((item, index) => (
                            <tr key={index} className="border-b border-border/50">
                              <td className="px-3 py-2 font-medium">{item.cost_head}</td>
                              <td className="px-3 py-2">{item.dept}</td>
                              <td className="px-3 py-2">{item.month}</td>
                              <td className="px-3 py-2 text-success font-medium">{item.budget_amt}</td>
                              <td className="px-3 py-2 text-primary font-medium">{item.actual_amt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Select a data source to preview</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={() => setCurrentStep(2)} className="px-8">
          Next: Categorize Data
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Smart Expense Categorization</h1>
          <p className="text-muted-foreground">AI-powered categorization with manual review capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            AI Confidence: 91.3%
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Mapping
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Records", value: "4,832", color: "text-primary" },
          { label: "Cost Heads", value: "26", color: "text-info" },
          { label: "Auto-Mapped", value: "87.5%", color: "text-success" },
          { label: "Need Review", value: "8", color: "text-warning" },
          { label: "Confidence", value: "91.3%", color: "text-primary" },
          { label: "Time Saved", value: "4.2 hrs", color: "text-success" }
        ].map((item, index) => (
          <Card key={index} className="shadow-card border-0">
            <CardContent className="p-3 text-center">
              <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">5 Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium">3 Need Review</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure Rules
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Apply AI Suggestions
          </Button>
        </div>
      </div>

      {/* Enhanced Mapping Table */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Expense Classification
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                High Priority: 3 items
              </Badge>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="review">Need Review</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 p-3 text-xs font-medium text-muted-foreground border-b">
              <div>Detected Expense</div>
              <div>AI Category</div>
              <div>Cost Type</div>
              <div>Confidence</div>
              <div>Status</div>
            </div>
            
            {categorizeData.map((item, index) => (
              <div key={index} className={`grid grid-cols-5 gap-4 p-3 rounded-lg border transition-colors hover:bg-accent/30 ${
                item.status === 'suggested' ? 'border-warning/20 bg-warning/5' : 'border-border'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  <span className="font-medium text-sm">{item.detected}</span>
                </div>
                
                <Select defaultValue={item.category}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel & Entertainment">Travel & Entertainment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Contracted Services">Contracted Services</SelectItem>
                    <SelectItem value="IT Rentals">IT Rentals</SelectItem>
                    <SelectItem value="Advertising">Advertising</SelectItem>
                    <SelectItem value="General & Admin">General & Admin</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Fixed Overhead">Fixed Overhead</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue={item.group}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Variable Costs">Variable Costs</SelectItem>
                    <SelectItem value="Fixed Costs">Fixed Costs</SelectItem>
                    <SelectItem value="Semi-Variable">Semi-Variable</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'confirmed' ? 'bg-success' : 'bg-warning'
                    }`}></div>
                    <span className="text-xs font-medium">
                      {item.status === 'confirmed' ? '95%' : '73%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {item.status === 'confirmed' ? (
                    <Badge variant="default" className="bg-success/10 text-success text-xs border-success/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-warning border-warning/20 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Review
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Footer */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Classification Progress:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full">
                    <div className="w-[87%] h-2 bg-success rounded-full"></div>
                  </div>
                  <span className="font-medium">87% Complete</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                3 items pending review
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="px-8">
          Next: Data Quality
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Data Quality & Gaps Analysis</h1>
        <p className="text-muted-foreground">Review data completeness and identify areas requiring attention</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Data Completeness", value: "94.2%", trend: "+2.1%" },
          { label: "Missing Records", value: "127", trend: "-15" },
          { label: "Data Quality Score", value: "8.7/10", trend: "+0.3" },
          { label: "Outliers Detected", value: "23", trend: "-8" }
        ].map((item, index) => (
          <CompactMetricCard
            key={index}
            label={item.label}
            value={item.value}
            tooltip={item.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Data Issues Detected
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowAutoFixes(true);
              setTimeout(() => {
                setAutoFixesApplied(true);
              }, 2000);
            }}
            disabled={autoFixesApplied}
          >
            <Zap className="w-4 h-4 mr-2" />
            {autoFixesApplied ? 'Auto-fixes Applied' : 'Auto Fix with SynqAI'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { issue: "Missing budget data for Q4 2024", severity: "High", count: "47 records", fixed: autoFixesApplied, solution: "Interpolated missing Q4 budget using Q3 data and growth trends" },
              { issue: "Duplicate entries in Travel expenses", severity: "Medium", count: "12 records", fixed: autoFixesApplied, solution: "Identified and merged duplicate transactions based on amount, date, and description" },
              { issue: "Inconsistent cost center codes", severity: "Low", count: "8 records", fixed: autoFixesApplied, solution: "Standardized cost center codes using organizational mapping rules" },
              { issue: "Missing department mapping", severity: "Medium", count: "23 records", fixed: autoFixesApplied, solution: "Mapped expenses to departments using employee hierarchy and cost center associations" }
            ].map((item, index) => (
              <div key={index} className={`p-3 rounded-lg transition-all duration-500 ${item.fixed ? 'bg-success/10' : 'bg-muted'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.issue}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                    {showAutoFixes && item.fixed && (
                      <div className="mt-2 p-2 bg-success/5 rounded border-l-2 border-success">
                        <p className="text-xs text-success font-medium">SynqAI Fix Applied:</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.solution}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.fixed && showAutoFixes ? (
                      <Badge variant="outline" className="bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fixed
                      </Badge>
                    ) : (
                      <Badge variant={item.severity === 'High' ? 'destructive' : item.severity === 'Medium' ? 'secondary' : 'outline'}>
                        {item.severity}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {showAutoFixes && autoFixesApplied && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">SynqAI Auto-Fix Summary</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Fixed 90 data quality issues across 4 categories</p>
                <p>• Applied ML-based data imputation for missing budget values</p>
                <p>• Standardized 31 inconsistent data formats</p>
                <p>• Data completeness improved from 85.7% to 97.2%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Auto-fixes Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { fix: "Standardized currency formats", count: "234 records" },
                { fix: "Filled missing dates with interpolation", count: "45 records" },
                { fix: "Corrected department codes", count: "67 records" },
                { fix: "Removed duplicate entries", count: "12 records" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.fix}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(4)} className="px-8">
          Next: View Results
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const applyFilters = () => {
    // Simulate filter application with updated data
    console.log('Filters applied:', filterValues);
  };

  const createScenario = (scenario: any) => {
    console.log('Creating scenario:', scenario);
    if (scenarios.length >= 3) {
      alert('Maximum 3 scenarios allowed');
      return;
    }
    setScenarios(prev => [...prev, scenario]);
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    // If the deleted scenario was selected, clear the selection
    if (selectedScenario === scenarioId) {
      setSelectedScenario(null);
      setActiveTab("overview");
    }
  };

  const renderStep4 = () => {
    return (
      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar with Forecast Cards */}
        <div className="w-full sm:w-[30%] lg:w-[25%] xl:w-[20%] bg-card border-r p-1 flex flex-col h-[calc(100vh-60px)] max-h-screen">
          <div className="flex-none">
            <h2 className="text-xl font-bold text-foreground mb-2">OPEX Insights</h2>
            <p className="text-sm text-muted-foreground">Click cards to explore analysis</p>
          </div>

          {/* Clickable Metric Cards */}
          <ScrollArea className="flex-1 mt-3">
            <div className="grid gap-3 pb-4">
              <div>
                 <ForecastCard
                   title="BUDGET ACCURACY"
                   value="87.3%"
                   subtitle="+2.8% vs last period"
                   icon={TrendingUp}
                   isActive={selectedScenario === null && activeTab === "accuracy"}
                   onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab("accuracy");
                   }}
                 />
              </div>

              <div>
                 <ForecastCard
                   title="COST OPTIMIZATION"
                   value="₹12.8M"
                   subtitle="Potential savings identified"
                   icon={DollarSign}
                   isActive={selectedScenario === null && activeTab === "optimization"}
                   onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab("optimization");
                   }}
                 />
              </div>

              <div>
                 <ForecastCard
                   title="VARIANCE ANALYSIS"
                   value="23 Items"
                   subtitle="High variance cost heads"
                   icon={BarChart3}
                   isActive={selectedScenario === null && activeTab === "variance"}
                   onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab("variance");
                   }}
                 />
              </div>

              <div>
                 <ForecastCard
                   title="EFFICIENCY SCORE"
                   value="8.2/10"
                   subtitle="Overall operational efficiency"
                   icon={Award}
                   isActive={selectedScenario === null && activeTab === "efficiency"}
                   onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab("efficiency");
                   }}
                 />
              </div>

              <div>
                 <ForecastCard
                   title="DEPARTMENT ANALYSIS"
                   value="5 Depts"
                   subtitle="Performance breakdown"
                   icon={Building}
                   isActive={selectedScenario === null && activeTab === "department"}
                   onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab("department");
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

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {!selectedScenario && (activeTab === "overview" || activeTab === "accuracy") && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">OPEX Analysis Results</h1>
                    <p className="text-sm text-muted-foreground">Comprehensive analysis of operational expenses</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Top KPI Row - 4 Smaller Cards */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <CompactMetricCard
                    value="87.3%"
                    label="Budget Accuracy"
                    tooltip="Percentage of budget estimates that were within acceptable variance range. Higher is better."
                    valueColor="success"
                  />

                  <CompactMetricCard
                    value="₹2.4M"
                    label="Total Variance"
                    tooltip="Total deviation from budgeted amounts across all cost heads."
                    valueColor="primary"
                    badge={{
                      text: "Under Budget",
                      variant: "success"
                    }}
                  />

                  <CompactMetricCard
                    value="8.2/10"
                    label="Efficiency Score"
                    tooltip="Overall operational efficiency score based on spend optimization and cost control."
                    valueColor="warning"
                    badge={{
                      text: "+0.5 vs LY",
                      variant: "success"
                    }}
                  />

                  <CompactMetricCard
                    value="23"
                    label="High Variance Items"
                    tooltip="Number of cost heads with variance greater than 10% from budget."
                    valueColor="info"
                  />
                </div>

                {/* Revenue and Volume Projections Row */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <CompactProjectionCard
                    title="Cost Optimization"
                    value="₹12.8M"
                    subtitle="Next 12 Months"
                    tooltip="Total projected cost optimization opportunities for the next 12 months."
                  />

                  <CompactProjectionCard
                    title="Savings Potential"
                    value="₹3.2M"
                    subtitle="Identified Opportunities"
                    tooltip="Total potential savings from process improvements and vendor renegotiation."
                  />
                </div>
              </>
            )}

            {/* Dynamic Content Based on Active Tab or Selected Scenario */}
            {selectedScenario ? (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Scenario Comparison: {scenarios.find(s => s.id === selectedScenario)?.name}</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comparison between the selected scenario and baseline case showing cost impact.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedScenario(null)}>
                    Back to Overview
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Scenario vs Baseline Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Baseline Case</div>
                        <div className="text-2xl font-bold text-primary">₹78.2M</div>
                        <div className="text-sm text-muted-foreground">Current OPEX</div>
                      </div>
                      <div className="p-4 bg-accent/30 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Scenario Impact</div>
                        <div className="text-2xl font-bold text-success">{scenarios.find(s => s.id === selectedScenario)?.value}</div>
                        <div className="text-sm text-muted-foreground">{scenarios.find(s => s.id === selectedScenario)?.subtitle}</div>
                      </div>
                    </div>

                    {/* Factor Analysis */}
                    <div>
                      <h4 className="font-medium mb-3">Key Factors</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {(() => {
                          const scenario = scenarios.find(s => s.id === selectedScenario);
                          if (!scenario?.factors) return null;
                          
                          return Object.entries(scenario.factors).map(([key, value], index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                              <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                              <span className="font-medium">
                                {typeof value === 'number' ? 
                                  (key.includes('Rate') || key.includes('Change') || key.includes('Gain') ? `${value > 0 ? '+' : ''}${value}%` : value) : 
                                  value
                                }
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Impact Chart */}
                    <div>
                      <h4 className="font-medium mb-3">Monthly Impact Projection</h4>
                      <div className="h-64">
                        <Line 
                          data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            datasets: [
                              {
                                label: 'Baseline OPEX',
                                data: [6.5, 6.8, 6.7, 6.9, 7.1, 6.8, 6.6, 6.9, 7.0, 6.7, 6.8, 7.2],
                                borderColor: hslVar('--muted-foreground'),
                                backgroundColor: hslVar('--muted-foreground', 0.1),
                                borderDash: [5, 5],
                                fill: false
                              },
                              {
                                label: 'Scenario Impact',
                                data: [6.2, 6.4, 6.3, 6.5, 6.7, 6.4, 6.2, 6.5, 6.6, 6.3, 6.4, 6.8],
                                borderColor: hslVar('--success'),
                                backgroundColor: hslVar('--success', 0.1),
                                fill: true,
                                tension: 0.4
                              }
                            ]
                          }}
                          options={{
                            ...buildChartOptions(),
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                title: { display: true, text: 'OPEX (₹M)' }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : activeTab === "overview" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">OPEX Analysis Overview</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Historical spending vs budget trends showing cost control performance over time.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={{
                        labels: historicalForecastData.map(item => item.period),
                        datasets: [
                          {
                            label: 'Actual Spend',
                            data: historicalForecastData.map(item => item.historical),
                            borderColor: hslVar('--primary'),
                            backgroundColor: hslVar('--primary', 0.1),
                            fill: true,
                            tension: 0.4
                          },
                          {
                            label: 'Budgeted',
                            data: historicalForecastData.map(item => item.forecast),
                            borderColor: hslVar('--warning'),
                            backgroundColor: hslVar('--warning', 0.1),
                            borderDash: [5, 5],
                            fill: false
                          },
                          {
                            label: 'Optimized',
                            data: historicalForecastData.map(item => item.optimized),
                            borderColor: hslVar('--success'),
                            backgroundColor: hslVar('--success', 0.1),
                            fill: false,
                            tension: 0.4
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Amount (₹ Lakhs)' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "accuracy" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Budget Accuracy Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-success">87.3%</div>
                        <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">+2.8%</div>
                        <div className="text-sm text-muted-foreground">vs Last Period</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-warning">23</div>
                        <div className="text-sm text-muted-foreground">Items Off Target</div>
                      </div>
                    </div>
                    <div className="h-48">
                      <Bar 
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          datasets: [{
                            label: 'Budget Accuracy %',
                            data: [85, 88, 91, 87, 89, 90],
                            backgroundColor: hslVar('--success', 0.8),
                            borderRadius: 4
                          }]
                        }}
                        options={{
                          ...buildChartOptions(),
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: { 
                              beginAtZero: true,
                              max: 100,
                              title: { display: true, text: 'Accuracy %' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "optimization" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Cost Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">₹12.8M</div>
                        <div className="text-sm text-muted-foreground">Total Savings Potential</div>
                      </div>
                      <div className="text-center p-4 bg-success/10 rounded-lg">
                        <div className="text-2xl font-bold text-success">₹3.2M</div>
                        <div className="text-sm text-muted-foreground">Quick Wins</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { area: "Vendor Renegotiation", saving: "₹4.2M", effort: "Medium" },
                        { area: "Process Automation", saving: "₹2.8M", effort: "High" },
                        { area: "Space Optimization", saving: "₹3.1M", effort: "Low" },
                        { area: "Energy Efficiency", saving: "₹2.7M", effort: "Medium" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{item.area}</div>
                            <div className="text-sm text-muted-foreground">Effort: {item.effort}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{item.saving}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "variance" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Variance Analysis Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-warning">23</div>
                      <div className="text-sm text-muted-foreground">High Variance Cost Heads</div>
                    </div>
                    <div className="h-64">
                      <Bar 
                        data={{
                          labels: departmentData.slice(0, 6).map(item => item.department),
                          datasets: [{
                            label: 'Variance %',
                            data: departmentData.slice(0, 6).map(item => parseFloat(item.deviationPct.replace('%', '').replace('+', ''))),
                            backgroundColor: departmentData.slice(0, 6).map(item => 
                              item.deviationPct.startsWith('+') ? hslVar('--destructive', 0.8) : hslVar('--success', 0.8)
                            ),
                            borderRadius: 4
                          }]
                        }}
                        options={{
                          ...buildChartOptions(),
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: { 
                              title: { display: true, text: 'Variance %' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "efficiency" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Efficiency Score Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-warning/10 rounded-lg">
                        <div className="text-2xl font-bold text-warning">8.2/10</div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </div>
                      <div className="text-center p-4 bg-success/10 rounded-lg">
                        <div className="text-2xl font-bold text-success">+0.5</div>
                        <div className="text-sm text-muted-foreground">vs Last Year</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { metric: "Cost per Unit", score: 8.5, trend: "+0.3" },
                        { metric: "Process Efficiency", score: 7.8, trend: "+0.7" },
                        { metric: "Resource Utilization", score: 8.3, trend: "+0.2" },
                        { metric: "Vendor Performance", score: 8.1, trend: "+0.8" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{item.metric}</div>
                            <div className="text-sm text-success">Trend: {item.trend}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-warning">{item.score}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "department" && (
              <Card className="shadow-card border-0 mb-4 flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Department Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-success/10 rounded-lg">
                        <div className="text-lg font-bold text-success">3</div>
                        <div className="text-xs text-muted-foreground">Under Budget</div>
                      </div>
                      <div className="text-center p-4 bg-destructive/10 rounded-lg">
                        <div className="text-lg font-bold text-destructive">2</div>
                        <div className="text-xs text-muted-foreground">Over Budget</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-primary">3</div>
                        <div className="text-xs text-muted-foreground">On Track</div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-muted-foreground">Department</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Variance</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Top Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departmentData.slice(0, 6).map((item, index) => (
                            <tr key={index} className="border-b border-border/50">
                              <td className="py-2 font-medium">{item.department}</td>
                              <td className="py-2 text-right">
                                <Badge variant={item.deviationPct.startsWith('+') ? 'destructive' : 'outline'} className="text-xs">
                                  {item.deviationPct}
                                </Badge>
                              </td>
                              <td className="py-2 text-right text-muted-foreground">{item.topCostHead}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Distribution and Variance Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Distribution */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Cost Head Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie 
                      data={{
                        labels: pieData.map(item => item.name),
                        datasets: [{
                          data: pieData.map(item => item.value),
                          backgroundColor: pieData.map(item => item.fill),
                          borderWidth: 2,
                          borderColor: hslVar('--background')
                        }]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Department Variance Analysis */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Department Variance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: departmentData.slice(0, 6).map(item => item.department),
                        datasets: [{
                          label: 'Variance %',
                          data: departmentData.slice(0, 6).map(item => parseFloat(item.deviationPct.replace('%', '').replace('+', ''))),
                          backgroundColor: departmentData.slice(0, 6).map(item => 
                            item.deviationPct.startsWith('+') ? hslVar('--destructive', 0.8) : hslVar('--success', 0.8)
                          ),
                          borderRadius: 4
                        }]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { 
                            title: { display: true, text: 'Variance %' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance Table */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budgeted</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actual</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Variance</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Top Cost Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.slice(0, 5).map((item, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.department}</td>
                          <td className="py-3 px-4">{item.budgeted}</td>
                          <td className="py-3 px-4">{item.actual}</td>
                          <td className="py-3 px-4">
                            <Badge variant={item.deviationPct.startsWith('+') ? 'destructive' : 'outline'}>
                              {item.deviationPct}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{item.topCostHead}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`${rightSidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-l p-1 flex flex-col h-[calc(100vh-60px)] max-h-screen transition-all duration-200`}>
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
                title="Scenario Planning"
              >
                <BarChart3 className="w-5 h-5" />
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
                        <BarChart3 className="w-4 h-4" />
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
                          <p className="text-sm text-muted-foreground">Ask me about your OPEX analysis</p>
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
                        placeholder="e.g., Why is Admin spending above budget?"
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
                 <div className="p-4 space-y-4">
                   <div>
                     <label className="text-sm font-medium text-foreground mb-2 block">
                       Department
                     </label>
                     <Select value={filterValues.department} onValueChange={(value) => setFilterValues(prev => ({ ...prev, department: value }))}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select department" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">All Departments</SelectItem>
                         <SelectItem value="sales">Sales</SelectItem>
                         <SelectItem value="marketing">Marketing</SelectItem>
                         <SelectItem value="operations">Operations</SelectItem>
                         <SelectItem value="hr">HR</SelectItem>
                         <SelectItem value="admin">Admin</SelectItem>
                         <SelectItem value="it">IT</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <label className="text-sm font-medium text-foreground mb-2 block">
                       Cost Head
                     </label>
                     <Select value={filterValues.costHead} onValueChange={(value) => setFilterValues(prev => ({ ...prev, costHead: value }))}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select cost head" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">All Cost Heads</SelectItem>
                         <SelectItem value="travel">Travel & Entertainment</SelectItem>
                         <SelectItem value="utilities">Utilities</SelectItem>
                         <SelectItem value="rent">Rent</SelectItem>
                         <SelectItem value="advertising">Advertising</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <label className="text-sm font-medium text-foreground mb-2 block">
                       Time Period
                     </label>
                     <Select value={filterValues.period} onValueChange={(value) => setFilterValues(prev => ({ ...prev, period: value }))}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select period" />
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
                       Budget Variance
                     </label>
                     <Select value={filterValues.budgetVariance} onValueChange={(value) => setFilterValues(prev => ({ ...prev, budgetVariance: value }))}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select variance" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">All Variances</SelectItem>
                         <SelectItem value="over">Over Budget</SelectItem>
                         <SelectItem value="under">Under Budget</SelectItem>
                         <SelectItem value="on-track">On Track</SelectItem>
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
                   <OpexScenarioCreation 
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
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="px-4 py-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default OpexPlanning;
