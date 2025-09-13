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
  AlertCircle, CheckCircle, FileText, Target,
  PieChart, BarChart3, Zap, Filter,
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  MessageCircle, Share, Award, Info, X,
  Package, Users, Settings, MoreHorizontal, Star
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import { buildChartOptions, hslVar, chartPalette } from "@/lib/chartTheme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, ChartTooltip, ChartLegend);

const ProjectPrioritization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "analysis" | "workbook">("overview");
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [aiPrompt, setAiPrompt] = useState('');

  // Stepper configuration
  const stepperSteps = [
    { id: 1, title: "Upload Projects", status: currentStep > 1 ? ("completed" as const) : currentStep === 1 ? ("active" as const) : ("pending" as const) },
    { id: 2, title: "Define Criteria", status: currentStep > 2 ? ("completed" as const) : currentStep === 2 ? ("active" as const) : ("pending" as const) },
    { id: 3, title: "Score & Rank", status: currentStep > 3 ? ("completed" as const) : currentStep === 3 ? ("active" as const) : ("pending" as const) },
    { id: 4, title: "Results", status: currentStep === 4 ? ("active" as const) : ("pending" as const) },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Project Prioritization",
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
    { project: "Digital Transformation", category: "Technology", business_value: "High", cost: "₹25M", timeline: "18 months", strategic_fit: "9/10", risk: "Medium" },
    { project: "Market Expansion", category: "Growth", business_value: "High", cost: "₹18M", timeline: "12 months", strategic_fit: "8/10", risk: "High" },
    { project: "Process Automation", category: "Efficiency", business_value: "Medium", cost: "₹12M", timeline: "9 months", strategic_fit: "7/10", risk: "Low" },
    { project: "Sustainability Initiative", category: "Compliance", business_value: "Medium", cost: "₹8M", timeline: "15 months", strategic_fit: "6/10", risk: "Low" }
  ];

  const projectData = [
    { name: "Digital Transformation", category: "Technology", businessValue: "High", cost: "₹25M", timeline: "18 months", strategicFit: 9, riskScore: 6, priorityScore: 87, rank: 1, status: "Approved" },
    { name: "Market Expansion", category: "Growth", businessValue: "High", cost: "₹18M", timeline: "12 months", strategicFit: 8, riskScore: 8, priorityScore: 82, rank: 2, status: "Under Review" },
    { name: "Customer Experience Platform", category: "Technology", businessValue: "High", cost: "₹15M", timeline: "10 months", strategicFit: 8, riskScore: 4, priorityScore: 79, rank: 3, status: "Approved" },
    { name: "Supply Chain Optimization", category: "Efficiency", businessValue: "Medium", cost: "₹12M", timeline: "9 months", strategicFit: 7, riskScore: 3, priorityScore: 75, rank: 4, status: "Pending" },
    { name: "Process Automation", category: "Efficiency", businessValue: "Medium", cost: "₹10M", timeline: "8 months", strategicFit: 7, riskScore: 2, priorityScore: 73, rank: 5, status: "Approved" },
    { name: "Data Analytics Platform", category: "Technology", businessValue: "Medium", cost: "₹8M", timeline: "6 months", strategicFit: 6, riskScore: 3, priorityScore: 68, rank: 6, status: "Under Review" },
    { name: "Sustainability Initiative", category: "Compliance", businessValue: "Low", cost: "₹6M", timeline: "15 months", strategicFit: 6, riskScore: 2, priorityScore: 62, rank: 7, status: "Pending" },
    { name: "Office Expansion", category: "Infrastructure", businessValue: "Low", cost: "₹5M", timeline: "6 months", strategicFit: 4, riskScore: 1, priorityScore: 45, rank: 8, status: "Rejected" }
  ];

  const criteriaData = [
    { criteria: "Strategic Alignment", weight: 30, description: "How well project aligns with business strategy" },
    { criteria: "Financial Impact", weight: 25, description: "Expected ROI and revenue impact" },
    { criteria: "Implementation Feasibility", weight: 20, description: "Technical and resource feasibility" },
    { criteria: "Risk Assessment", weight: 15, description: "Overall project risk level" },
    { criteria: "Timeline Urgency", weight: 10, description: "Time sensitivity and market timing" }
  ];

  const portfolioData = [
    { name: "Technology", value: 40, fill: "#3b82f6" },
    { name: "Growth", value: 25, fill: "#10b981" },
    { name: "Efficiency", value: 20, fill: "#8b5cf6" },
    { name: "Compliance", value: 10, fill: "#f59e0b" },
    { name: "Infrastructure", value: 5, fill: "#ef4444" }
  ];

  const monthlyResourceData = [
    { month: "Q1", approved: 3, pending: 2, rejected: 1 },
    { month: "Q2", approved: 2, pending: 3, rejected: 0 },
    { month: "Q3", approved: 1, pending: 1, rejected: 2 },
    { month: "Q4", approved: 2, pending: 1, rejected: 0 }
  ];

  const sampleAiResponses = [
    "Based on your prioritization matrix, Digital Transformation ranks highest with a score of 87. It offers the best strategic alignment and long-term value despite higher investment.",
    "Your Technology projects dominate the top ranks, representing 40% of your portfolio. Consider balancing with more efficiency and growth initiatives.",
    "Market Expansion shows high business value but carries significant risk. Consider phased implementation to mitigate uncertainty while capturing opportunities.",
    "Process Automation offers excellent ROI with low risk. This should be fast-tracked as a quick win to free up resources for larger strategic initiatives.",
    "Your current portfolio shows strong strategic focus. 75% of approved projects align with core business objectives, indicating effective prioritization."
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
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Upload Project Portfolio</h1>
        <p className="text-muted-foreground">Upload your project list with key details for comprehensive prioritization analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Download Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Must include Project Name, Category, Business Value, Cost, Timeline, Strategic Fit, Risk Level
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Project Template (CSV)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Upload Project Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your project portfolio data for prioritization analysis
                </p>
                <div className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">CSV, Excel files (max 10MB)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Sample Template Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Business Value</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timeline</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Strategic Fit</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {templateData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{item.project}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.business_value === 'High' ? 'default' : 'secondary'}>
                        {item.business_value}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-success font-medium">{item.cost}</td>
                    <td className="py-3 px-4">{item.timeline}</td>
                    <td className="py-3 px-4 text-primary font-medium">{item.strategic_fit}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.risk === 'High' ? 'destructive' : item.risk === 'Medium' ? 'secondary' : 'outline'}>
                        {item.risk}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setCurrentStep(2)} className="px-8">
          Next: Define Criteria
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Define Prioritization Criteria</h1>
        <p className="text-muted-foreground">Set evaluation criteria and their relative weights for project prioritization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Projects Loaded", value: "8" },
          { label: "Categories", value: "5" },
          { label: "High Value", value: "3" },
          { label: "High Risk", value: "1" },
          { label: "Total Investment", value: "₹99M" }
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
            <Target className="w-5 h-5" />
            Evaluation Criteria & Weights
          </CardTitle>
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Use AI Recommended Weights
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criteriaData.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 border border-border rounded-lg">
                <div className="col-span-4">
                  <div className="font-medium">{item.criteria}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <div className="col-span-4 flex items-center">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.weight}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium">{item.weight}%</span>
                </div>
                <div className="col-span-4 flex items-center">
                  <Select defaultValue={item.weight.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% - Low</SelectItem>
                      <SelectItem value="15">15% - Medium Low</SelectItem>
                      <SelectItem value="20">20% - Medium</SelectItem>
                      <SelectItem value="25">25% - Medium High</SelectItem>
                      <SelectItem value="30">30% - High</SelectItem>
                      <SelectItem value="35">35% - Very High</SelectItem>
                    </SelectContent>
                  </Select>
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
          Next: Score & Rank
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Project Scoring & Ranking</h1>
        <p className="text-muted-foreground">AI-powered scoring and ranking based on defined criteria</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Scoring Complete", value: "100%", trend: "8/8 Projects" },
          { label: "Avg Score", value: "68.9", trend: "Out of 100" },
          { label: "High Priority", value: "3", trend: "Score > 75" },
          { label: "Recommended", value: "5", trend: "For Approval" }
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
              <Star className="w-5 h-5" />
              Top Ranked Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Rank #{item.rank} | {item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-success/20 text-success">
                      {item.priorityScore}
                    </Badge>
                    <Star className="w-4 h-4 text-warning fill-warning" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Risk Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { project: "Market Expansion", risk: "High", factor: "Market uncertainty" },
                { project: "Digital Transformation", risk: "Medium", factor: "Implementation complexity" },
                { project: "Customer Experience", risk: "Low", factor: "Technology maturity" },
                { project: "Supply Chain Opt.", risk: "Low", factor: "Proven methodology" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.project}</p>
                    <p className="text-xs text-muted-foreground">{item.factor}</p>
                  </div>
                  <Badge variant={item.risk === 'High' ? 'destructive' : item.risk === 'Medium' ? 'secondary' : 'outline'}>
                    {item.risk} Risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Scoring Matrix Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Scatter 
              data={{
                datasets: [
                  {
                    label: 'High Priority',
                    data: projectData
                      .filter(p => p.priorityScore > 75)
                      .map(p => ({ x: p.strategicFit, y: p.priorityScore, label: p.name })),
                    backgroundColor: hslVar('--success', 0.8),
                    borderColor: hslVar('--success'),
                    pointRadius: 8
                  },
                  {
                    label: 'Medium Priority',
                    data: projectData
                      .filter(p => p.priorityScore >= 60 && p.priorityScore <= 75)
                      .map(p => ({ x: p.strategicFit, y: p.priorityScore, label: p.name })),
                    backgroundColor: hslVar('--warning', 0.8),
                    borderColor: hslVar('--warning'),
                    pointRadius: 6
                  },
                  {
                    label: 'Low Priority',
                    data: projectData
                      .filter(p => p.priorityScore < 60)
                      .map(p => ({ x: p.strategicFit, y: p.priorityScore, label: p.name })),
                    backgroundColor: hslVar('--muted-foreground', 0.8),
                    borderColor: hslVar('--muted-foreground'),
                    pointRadius: 4
                  }
                ]
              }}
              options={{
                ...buildChartOptions(),
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: 'Strategic Fit Score' },
                    min: 0,
                    max: 10
                  },
                  y: {
                    title: { display: true, text: 'Priority Score' },
                    min: 0,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

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
              <h1 className="text-2xl font-bold text-foreground">Project Prioritization Results</h1>
              <p className="text-sm text-muted-foreground">Strategic project ranking and portfolio optimization</p>
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
              label="Total Projects"
              value="8"
              tooltip="Portfolio Size"
            />
            <CompactMetricCard
              label="Avg Priority Score"
              value="68.9"
              tooltip="Out of 100"
            />
            <CompactMetricCard
              label="High Priority"
              value="3"
              tooltip="Recommended"
            />
            <CompactProjectionCard
              title="Total Investment"
              value="₹99M"
              subtitle="Portfolio Value"
              tooltip="Portfolio Value"
            />
            <CompactProjectionCard
              title="ROI Potential"
              value="₹245M"
              subtitle="Expected Returns"
              tooltip="Expected Returns"
            />
            <CompactMetricCard
              label="Risk Level"
              value="Medium"
              tooltip="Portfolio Risk"
            />
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="matrix">Priority Matrix</TabsTrigger>
              <TabsTrigger value="analysis">Portfolio Analysis</TabsTrigger>
              <TabsTrigger value="workbook">Workbook</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Distribution */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Priority Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Bar 
                        data={{
                          labels: projectData.map(item => item.name.split(' ')[0] + '..'),
                          datasets: [{
                            label: 'Priority Score',
                            data: projectData.map(item => item.priorityScore),
                            backgroundColor: projectData.map(item => 
                              item.priorityScore > 75 ? hslVar('--success', 0.8) :
                              item.priorityScore > 60 ? hslVar('--warning', 0.8) :
                              hslVar('--muted-foreground', 0.8)
                            ),
                            borderColor: projectData.map(item => 
                              item.priorityScore > 75 ? hslVar('--success') :
                              item.priorityScore > 60 ? hslVar('--warning') :
                              hslVar('--muted-foreground')
                            ),
                            borderWidth: 2,
                            borderRadius: 4
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
                              max: 100,
                              title: { display: true, text: 'Priority Score' }
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Mix */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Portfolio Mix by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Pie 
                        data={{
                          labels: portfolioData.map(item => item.name),
                          datasets: [{
                            data: portfolioData.map(item => item.value),
                            backgroundColor: portfolioData.map(item => item.fill),
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

              {/* Resource Allocation Timeline */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Project Allocation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: monthlyResourceData.map(item => item.month),
                        datasets: [
                          {
                            label: 'Approved',
                            data: monthlyResourceData.map(item => item.approved),
                            backgroundColor: hslVar('--success', 0.8),
                            borderColor: hslVar('--success'),
                            borderWidth: 2
                          },
                          {
                            label: 'Pending',
                            data: monthlyResourceData.map(item => item.pending),
                            backgroundColor: hslVar('--warning', 0.8),
                            borderColor: hslVar('--warning'),
                            borderWidth: 2
                          },
                          {
                            label: 'Rejected',
                            data: monthlyResourceData.map(item => item.rejected),
                            backgroundColor: hslVar('--destructive', 0.8),
                            borderColor: hslVar('--destructive'),
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: { stacked: true },
                          y: { 
                            stacked: true,
                            title: { display: true, text: 'Number of Projects' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matrix" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Priority Ranking</CardTitle>
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
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                          <SelectItem value="Efficiency">Efficiency</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
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
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                          <th 
                            className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center gap-2">
                              Project
                              {getSortIcon('name')}
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Investment</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Priority Score</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Strategic Fit</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.map((item, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">#{item.rank}</span>
                                {item.rank <= 3 && <Star className="w-4 h-4 text-warning fill-warning" />}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{item.category}</Badge>
                            </td>
                            <td className="py-3 px-4 font-medium">{item.cost}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-muted rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      item.priorityScore > 75 ? 'bg-success' : 
                                      item.priorityScore > 60 ? 'bg-warning' : 'bg-muted-foreground'
                                    }`} 
                                    style={{ width: `${item.priorityScore}%` }}
                                  />
                                </div>
                                <span className="font-medium text-sm">{item.priorityScore}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{item.strategicFit}/10</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={
                                item.riskScore > 6 ? 'destructive' : 
                                item.riskScore > 3 ? 'secondary' : 'outline'
                              }>
                                {item.riskScore > 6 ? 'High' : item.riskScore > 3 ? 'Medium' : 'Low'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={
                                item.status === 'Approved' ? 'default' :
                                item.status === 'Under Review' ? 'secondary' :
                                item.status === 'Pending' ? 'outline' : 'destructive'
                              }>
                                {item.status}
                              </Badge>
                            </td>
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
                      Top Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Digital Transformation</span>
                        <Badge variant="outline" className="bg-success/10 text-success">87</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Expansion</span>
                        <Badge variant="outline" className="bg-success/10 text-success">82</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Experience</span>
                        <Badge variant="outline" className="bg-success/10 text-success">79</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Target className="w-5 h-5" />
                      Strategic Alignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Digital Focus</p>
                        <p className="text-muted-foreground">75% of top projects</p>
                      </div>
                      <div>
                        <p className="font-medium">Growth Initiatives</p>
                        <p className="text-muted-foreground">25% portfolio allocation</p>
                      </div>
                      <div>
                        <p className="font-medium">Efficiency Gains</p>
                        <p className="text-muted-foreground">20% operational focus</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <AlertCircle className="w-5 h-5" />
                      Portfolio Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">High Risk Projects</p>
                        <p className="text-muted-foreground">1 project (Market Expansion)</p>
                      </div>
                      <div>
                        <p className="font-medium">Resource Concentration</p>
                        <p className="text-muted-foreground">40% in Technology</p>
                      </div>
                      <div>
                        <p className="font-medium">Timeline Conflicts</p>
                        <p className="text-muted-foreground">2 overlapping projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workbook" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Project Portfolio Workbook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed project portfolio workbook view would be displayed here</p>
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
              <p className="text-sm text-muted-foreground">Ask me about your project priorities</p>
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
            placeholder="e.g., Why is Digital Transformation ranked first?"
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

export default ProjectPrioritization;