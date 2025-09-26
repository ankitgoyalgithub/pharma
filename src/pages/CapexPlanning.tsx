import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import { CompactMetricCard } from "@/components/CompactMetricCard";
import { CompactProjectionCard } from "@/components/CompactProjectionCard";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  Download, Upload, Check, ChevronRight, 
  FileSpreadsheet, DollarSign, TrendingUp, 
  AlertCircle, CheckCircle, FileText, Building2,
  PieChart, BarChart3, Zap, Filter,
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  MessageCircle, Share, Award, Info, X,
  Package, Users, Settings, MoreHorizontal,
  Database
} from "lucide-react";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { buildChartOptions, hslVar, chartPalette } from "@/lib/chartTheme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, ChartTooltip, ChartLegend);

const CapexPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlant, setFilterPlant] = useState('');
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "analysis" | "workbook">("overview");
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [aiPrompt, setAiPrompt] = useState('');

  // Add Data states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'timeseries', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Upload Data", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Project Planning", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Investment Analysis", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Capex Planning",
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
    { project: "New Production Line", asset_type: "Machinery", plant: "Mumbai", budget: "₹15,200,000", timeline: "Q2-Q4 2024", roi: "22.5%" },
    { project: "Warehouse Automation", asset_type: "Technology", plant: "Delhi", budget: "₹8,700,000", timeline: "Q1-Q3 2024", roi: "18.3%" },
    { project: "Quality Lab Setup", asset_type: "Equipment", plant: "Bangalore", budget: "₹5,500,000", timeline: "Q3 2024", roi: "15.7%" },
    { project: "ERP System Upgrade", asset_type: "Technology", plant: "All", budget: "₹12,300,000", timeline: "Q1-Q2 2025", roi: "25.1%" }
  ];

  const projectData = [
    { name: "New Production Line", plant: "Mumbai", type: "Machinery", budget: "₹15.2M", committed: "₹12.0M", actual: "₹8.5M", status: "In Progress", roi: "22.5%", payback: "3.2 yrs" },
    { name: "Warehouse Automation", plant: "Delhi", type: "Technology", budget: "₹8.7M", committed: "₹8.7M", actual: "₹2.1M", status: "Planning", roi: "18.3%", payback: "4.1 yrs" },
    { name: "Quality Lab Setup", plant: "Bangalore", type: "Equipment", budget: "₹5.5M", committed: "₹5.5M", actual: "₹5.5M", status: "Completed", roi: "15.7%", payback: "5.2 yrs" },
    { name: "ERP System Upgrade", plant: "All", type: "Technology", budget: "₹12.3M", committed: "₹0", actual: "₹0", status: "Proposed", roi: "25.1%", payback: "2.8 yrs" },
    { name: "Solar Panel Installation", plant: "Chennai", type: "Infrastructure", budget: "₹6.8M", committed: "₹3.4M", actual: "₹1.2M", status: "In Progress", roi: "14.2%", payback: "6.1 yrs" },
    { name: "Conveyor Belt Upgrade", plant: "Pune", type: "Machinery", budget: "₹4.2M", committed: "₹4.2M", actual: "₹3.8M", status: "Nearly Complete", roi: "19.6%", payback: "3.8 yrs" }
  ];

  const monthlyCapexData = [
    { month: "Jan", planned: 4.2, actual: 3.8, committed: 4.0 },
    { month: "Feb", planned: 3.8, actual: 4.1, committed: 3.9 },
    { month: "Mar", planned: 5.1, actual: 4.8, committed: 5.0 },
    { month: "Apr", planned: 6.2, actual: 5.9, committed: 6.1 },
    { month: "May", planned: 7.5, actual: 7.2, committed: 7.4 },
    { month: "Jun", planned: 8.1, actual: 7.8, committed: 8.0 }
  ];

  const categoryData = [
    { name: "Machinery", value: 63, fill: "#3b82f6" },
    { name: "Technology", value: 27, fill: "#10b981" },
    { name: "Infrastructure", value: 10, fill: "#8b5cf6" }
  ];

  const sampleAiResponses = [
    "Based on your CAPEX portfolio, the New Production Line project shows the highest ROI at 22.5%. Consider prioritizing this for faster payback.",
    "Your technology investments (ERP upgrade) have excellent ROI potential at 25.1%. This should be fast-tracked given the 2.8 year payback period.",
    "Infrastructure projects show longer payback periods but provide operational efficiency. Solar installation will reduce operational costs by 12% annually.",
    "Current budget utilization is at 71%. You have ₹13.1M remaining for additional strategic investments this fiscal year.",
    "Machinery investments are your largest category at 63% of budget. Consider diversifying into more technology upgrades for better long-term returns."
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

  const filteredData = projectData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlant = filterPlant === '' || filterPlant === 'all' || item.plant === filterPlant;
    return matchesSearch && matchesPlant;
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

  // External drivers logic
  const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
  const externalDrivers = getExternalDrivers("capex-planning", hasData);

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

  const handleFoundrySubmit = (data: {
    selectedObject: string;
    selectedDataType: 'master' | 'timeseries';
    fromDate?: Date;
    toDate?: Date;
  }) => {
    const newObject = {
      name: data.selectedObject,
      type: data.selectedDataType === 'timeseries' ? 'timeseries' as const : 'master' as const,
      ...(data.selectedDataType === 'timeseries' && { fromDate: data.fromDate, toDate: data.toDate })
    };
    setFoundryObjects(prev => [...prev, newObject]);

    setSelectedPreview(newObject.name);
    setPreviewLoading(true);
    setTimeout(() => setPreviewLoading(false), 600);
  };

  const renderStep1 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload your capital expenditure projects and budget data to begin analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Data Files</CardTitle>
          <p className="text-sm text-muted-foreground">
            <Button variant="link" size="sm" className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'capex-planning-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
            {" "}with sheets (Projects, Asset Types, Budget, Timeline, ROI)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('capex-file-upload')?.click()}>
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

          <Input id="capex-file-upload" type="file" multiple accept=".csv,.xlsx,.xls" className="hidden"
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
                              setSelectedPreview(null);
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
                          <Database className="h-3 w-3 text-blue-700" />
                          <span className="text-foreground">{obj.name}</span>
                          <Badge variant="outline" className="text-xs">{obj.type}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                          onClick={() => {
                            setFoundryObjects(prev => prev.filter((_, i) => i !== index));
                            if (selectedPreview === obj.name) {
                              setSelectedPreview(null);
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

      {hasData && (
        <ExternalDriversSection
          drivers={externalDrivers}
          selectedDrivers={selectedDrivers}
          driversLoading={driversLoading}
          onToggleDriver={toggleDriver}
        />
      )}

      {(uploadedFiles.length > 0 || foundryObjects.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-32 bg-muted rounded" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plant</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budget</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timeline</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expected ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templateData.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{item.project}</td>
                        <td className="py-3 px-4">{item.asset_type}</td>
                        <td className="py-3 px-4">{item.plant}</td>
                        <td className="py-3 px-4 text-success font-medium">{item.budget}</td>
                        <td className="py-3 px-4">{item.timeline}</td>
                        <td className="py-3 px-4 text-primary font-medium">{item.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <MapFromFoundryDialog
        isOpen={isFoundryModalOpen}
        onOpenChange={setIsFoundryModalOpen}
        onSubmit={handleFoundrySubmit}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCurrentStep(2)} className="px-8">
          Next: Project Planning
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Project Planning & Prioritization</h1>
        <p className="text-muted-foreground">Review and prioritize capital investment projects based on strategic value</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Projects", value: "6" },
          { label: "Total Budget", value: "₹52.7M" },
          { label: "High Priority", value: "3" },
          { label: "Avg ROI", value: "19.2%" },
          { label: "Plants Covered", value: "5" },
          { label: "Strategic Score", value: "8.4/10" }
        ].map((item, index) => (
          <Card key={index} className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-foreground">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Project Prioritization Matrix
          </CardTitle>
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Prioritize by ROI
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {projectData.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 p-3 border border-border rounded-lg">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm">{item.plant}</div>
                <div className="text-sm font-medium text-success">{item.budget}</div>
                <div className="text-sm font-medium text-primary">{item.roi}</div>
                <div className="text-sm text-muted-foreground">{item.payback}</div>
                <div className="flex items-center">
                  <Badge variant={
                    parseFloat(item.roi.replace('%', '')) > 20 ? 'default' :
                    parseFloat(item.roi.replace('%', '')) > 15 ? 'secondary' : 'outline'
                  }>
                    {parseFloat(item.roi.replace('%', '')) > 20 ? 'High Priority' :
                     parseFloat(item.roi.replace('%', '')) > 15 ? 'Medium' : 'Low Priority'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="px-8">
          Next: Investment Analysis
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Investment Analysis & Risk Assessment</h1>
        <p className="text-muted-foreground">Comprehensive analysis of investment viability and risk factors</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Portfolio ROI", value: "19.2%", trend: "+2.3%" },
          { label: "Risk Score", value: "Medium", trend: "Acceptable" },
          { label: "Payback Period", value: "4.1 yrs", trend: "Avg" },
          { label: "NPV Total", value: "₹18.7M", trend: "+₹3.2M" }
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              High-Value Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { project: "ERP System Upgrade", roi: "25.1%", risk: "Low", value: "₹12.3M" },
                { project: "New Production Line", roi: "22.5%", risk: "Medium", value: "₹15.2M" },
                { project: "Conveyor Belt Upgrade", roi: "19.6%", risk: "Low", value: "₹4.2M" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.project}</p>
                    <p className="text-xs text-muted-foreground">ROI: {item.roi} | Value: {item.value}</p>
                  </div>
                  <Badge variant="outline" className="bg-success/20 text-success">
                    {item.risk} Risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { factor: "Market demand uncertainty", impact: "Medium", projects: "2 projects affected" },
                { factor: "Technology adoption risk", impact: "Low", projects: "1 project affected" },
                { factor: "Regulatory compliance", impact: "Low", projects: "All projects covered" },
                { factor: "Resource availability", impact: "Medium", projects: "3 projects affected" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.factor}</p>
                    <p className="text-xs text-muted-foreground">{item.projects}</p>
                  </div>
                  <Badge variant={item.impact === 'High' ? 'destructive' : item.impact === 'Medium' ? 'secondary' : 'outline'}>
                    {item.impact}
                  </Badge>
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

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">CAPEX Investment Analysis</h1>
              <p className="text-sm text-muted-foreground">Strategic capital allocation and ROI optimization</p>
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <CompactMetricCard
              label="Total Budget"
              value="₹52.7M"
              tooltip="6 Projects"
            />
            <CompactMetricCard
              label="Portfolio ROI"
              value="19.2%"
              tooltip="Above Target: 15%"
            />
            <CompactMetricCard
              label="Committed"
              value="₹33.8M"
              tooltip="64% Utilization"
            />
            <CompactProjectionCard
              title="NPV"
              value="₹18.7M"
              subtitle="5-Year Value"
              tooltip="5-Year Value"
            />
            <CompactProjectionCard
              title="Payback"
              value="4.1 yrs"
              subtitle="Average Period"
              tooltip="Average Period"
            />
            <CompactMetricCard
              label="Risk Score"
              value="Medium"
              tooltip="Acceptable Level"
            />
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Project Portfolio</TabsTrigger>
              <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
              <TabsTrigger value="workbook">Workbook</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly CAPEX Trend */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Monthly CAPEX Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Line 
                        data={{
                          labels: monthlyCapexData.map(item => item.month),
                          datasets: [
                            {
                              label: 'Planned',
                              data: monthlyCapexData.map(item => item.planned),
                              borderColor: hslVar('--primary'),
                              backgroundColor: hslVar('--primary', 0.1),
                              fill: true,
                              tension: 0.4
                            },
                            {
                              label: 'Actual',
                              data: monthlyCapexData.map(item => item.actual),
                              borderColor: hslVar('--success'),
                              backgroundColor: hslVar('--success', 0.1),
                              fill: false,
                              tension: 0.4
                            },
                            {
                              label: 'Committed',
                              data: monthlyCapexData.map(item => item.committed),
                              borderColor: hslVar('--warning'),
                              backgroundColor: hslVar('--warning', 0.1),
                              borderDash: [5, 5],
                              fill: false
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
                              title: { display: true, text: 'Amount (₹ Crores)' }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Category Distribution */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Investment by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Pie 
                        data={{
                          labels: categoryData.map(item => item.name),
                          datasets: [{
                            data: categoryData.map(item => item.value),
                            backgroundColor: categoryData.map(item => item.fill),
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
              </div>

              {/* ROI vs Investment Chart */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    ROI vs Investment by Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: projectData.map(item => item.name.split(' ')[0] + '..'),
                        datasets: [
                          {
                            label: 'Investment (₹M)',
                            data: projectData.map(item => parseFloat(item.budget.replace('₹', '').replace('M', ''))),
                            backgroundColor: hslVar('--primary', 0.8),
                            borderColor: hslVar('--primary'),
                            borderWidth: 2,
                            yAxisID: 'y'
                          },
                          {
                            label: 'ROI (%)',
                            data: projectData.map(item => parseFloat(item.roi.replace('%', ''))),
                            backgroundColor: hslVar('--success', 0.8),
                            borderColor: hslVar('--success'),
                            borderWidth: 2,
                            yAxisID: 'y1'
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: { display: true, text: 'Investment (₹M)' }
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: { display: true, text: 'ROI (%)' },
                            grid: { drawOnChartArea: false }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Portfolio Analysis</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search projects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Select value={filterPlant} onValueChange={setFilterPlant}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Plants" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Plants</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th 
                            className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center gap-2">
                              Project
                              {getSortIcon('name')}
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plant</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budget</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Committed</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROI</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.map((item, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4">{item.plant}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{item.type}</Badge>
                            </td>
                            <td className="py-3 px-4 font-medium">{item.budget}</td>
                            <td className="py-3 px-4">{item.committed}</td>
                            <td className="py-3 px-4">
                              <Badge variant={
                                item.status === 'Completed' ? 'default' :
                                item.status === 'In Progress' ? 'secondary' :
                                item.status === 'Nearly Complete' ? 'outline' : 'destructive'
                              }>
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-medium text-success">{item.roi}</td>
                            <td className="py-3 px-4 text-muted-foreground">{item.payback}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <Award className="w-5 h-5" />
                      High ROI Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>ERP System Upgrade</span>
                        <Badge variant="outline" className="bg-success/10 text-success">25.1%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>New Production Line</span>
                        <Badge variant="outline" className="bg-success/10 text-success">22.5%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Conveyor Belt</span>
                        <Badge variant="outline" className="bg-success/10 text-success">19.6%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Building2 className="w-5 h-5" />
                      Strategic Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Production Capacity</p>
                        <p className="text-muted-foreground">+35% increase planned</p>
                      </div>
                      <div>
                        <p className="font-medium">Automation Level</p>
                        <p className="text-muted-foreground">68% → 85% target</p>
                      </div>
                      <div>
                        <p className="font-medium">Energy Efficiency</p>
                        <p className="text-muted-foreground">15% reduction in costs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <AlertCircle className="w-5 h-5" />
                      Investment Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Technology Risk</p>
                        <p className="text-muted-foreground">2 projects affected</p>
                      </div>
                      <div>
                        <p className="font-medium">Market Demand</p>
                        <p className="text-muted-foreground">Medium uncertainty</p>
                      </div>
                      <div>
                        <p className="font-medium">Resource Availability</p>
                        <p className="text-muted-foreground">Manageable risk</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workbook" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Investment Data Workbook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed investment workbook view would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar for AI Chat */}
      <div className="w-80 border-l bg-card p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        
        <div className="flex-1 overflow-auto space-y-3 mb-4">
          {aiMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Ask me about your CAPEX investments</p>
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
        
        <div className="space-y-2">
          <Textarea
            placeholder="e.g., Which project has the best ROI?"
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
      </div>
    </TooltipProvider>
  );
};

export default CapexPlanning;