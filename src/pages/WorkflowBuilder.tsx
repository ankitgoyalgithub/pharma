import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  Play, 
  Download, 
  Upload, 
  Zap,
  Database,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Settings,
  Plus,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Brain,
  Eye,
  FileText,
  Scan,
  Layout,
  Grid2X2,
  Layers3,
  PanelLeftOpen,
  Rows3,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Coins,
  Factory,
  Truck,
  Package,
  Users,
  Target,
  Clock,
  GitBranch,
  LineChart,
  PieChart,
  DollarSign,
  Gauge,
  Activity,
  TrendingDown,
  RefreshCw,
  Calendar,
  MapPin,
  Globe,
  Building2,
  Briefcase,
  FileCheck,
  Scale,
  AlertCircle,
  Workflow,
  Network,
  CloudDownload,
  HardDrive,
  Webhook,
  FileOutput,
  Send,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [draggedCanvasBlock, setDraggedCanvasBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionsOpen, setSectionsOpen] = useState({
    functionalBlocks: true,
    aiAgents: true,
    dataConnectors: true
  });
  const canvasRef = useRef(null);

  // Get existing workflow data from navigation state
  const { workflow, isEditing } = location.state || {};

  // Load existing workflow data when component mounts
  useEffect(() => {
    if (workflow && isEditing) {
      const existingBlocks = generateExistingWorkflowBlocks(workflow);
      setCanvasBlocks(existingBlocks.blocks);
      setConnections(existingBlocks.connections);
    }
  }, [workflow, isEditing]);

  // Generate existing workflow blocks based on workflow type
  const generateExistingWorkflowBlocks = (workflowData) => {
    if (workflowData?.name === 'Supply Chain Optimization') {
      return {
        blocks: [
          { 
            id: 'demand-forecast', 
            canvasId: 'demand-forecast-1', 
            name: 'Demand Forecasting', 
            icon: TrendingUp, 
            color: 'bg-blue-500', 
            x: 100, 
            y: 100,
            config: { name: 'Demand Forecasting', description: 'Forecast future demand', parameters: { forecastPeriod: '12', algorithm: 'arima' } }
          },
          { 
            id: 'inventory', 
            canvasId: 'inventory-1', 
            name: 'Inventory Optimization', 
            icon: Database, 
            color: 'bg-cyan-500', 
            x: 350, 
            y: 50,
            config: { name: 'Inventory Optimization', description: 'Optimize inventory levels', parameters: { safetyStock: '20', reorderPoint: '100' } }
          },
          { 
            id: 'production', 
            canvasId: 'production-1', 
            name: 'Production Planning', 
            icon: Settings, 
            color: 'bg-purple-500', 
            x: 350, 
            y: 150,
            config: { name: 'Production Planning', description: 'Plan production schedule', parameters: { capacity: '1000', efficiency: '85' } }
          },
          { 
            id: 'dashboard', 
            canvasId: 'dashboard-1', 
            name: 'Send to Dashboard', 
            icon: BarChart3, 
            color: 'bg-green-500', 
            x: 600, 
            y: 100,
            config: { name: 'Send to Dashboard', description: 'Send results to dashboard', parameters: { format: 'json', frequency: 'daily' } }
          }
        ],
        connections: [
          { id: 'c1', from: 'demand-forecast-1', to: 'inventory-1' },
          { id: 'c2', from: 'demand-forecast-1', to: 'production-1' },
          { id: 'c3', from: 'inventory-1', to: 'dashboard-1' },
          { id: 'c4', from: 'production-1', to: 'dashboard-1' }
        ]
      };
    } else if (workflowData?.name === 'Financial Planning Pipeline') {
      return {
        blocks: [
          { 
            id: 'csv-upload', 
            canvasId: 'csv-upload-1', 
            name: 'Upload CSV', 
            icon: FileSpreadsheet, 
            color: 'bg-blue-500', 
            x: 100, 
            y: 100,
            config: { name: 'Upload CSV', description: 'Upload financial data', parameters: { fileName: 'financial_data.csv', delimiter: ',' } }
          },
          { 
            id: 'capex', 
            canvasId: 'capex-1', 
            name: 'Capex Planning', 
            icon: TrendingUp, 
            color: 'bg-red-500', 
            x: 350, 
            y: 50,
            config: { name: 'Capex Planning', description: 'Plan capital expenditures', parameters: { budget: '1000000', period: '12' } }
          },
          { 
            id: 'opex', 
            canvasId: 'opex-1', 
            name: 'Opex Planning', 
            icon: BarChart3, 
            color: 'bg-yellow-500', 
            x: 350, 
            y: 150,
            config: { name: 'Opex Planning', description: 'Plan operational expenditures', parameters: { budget: '500000', category: 'all' } }
          },
          { 
            id: 'api-push', 
            canvasId: 'api-push-1', 
            name: 'Push to API', 
            icon: Zap, 
            color: 'bg-green-500', 
            x: 600, 
            y: 100,
            config: { name: 'Push to API', description: 'Send results to external API', parameters: { endpoint: '/api/financial', format: 'json' } }
          }
        ],
        connections: [
          { id: 'c1', from: 'csv-upload-1', to: 'capex-1' },
          { id: 'c2', from: 'csv-upload-1', to: 'opex-1' },
          { id: 'c3', from: 'capex-1', to: 'api-push-1' },
          { id: 'c4', from: 'opex-1', to: 'api-push-1' }
        ]
      };
    } else if (workflowData?.name === 'Production Scheduling') {
      return {
        blocks: [
          { 
            id: 's3-connect', 
            canvasId: 's3-connect-1', 
            name: 'Connect to S3', 
            icon: Database, 
            color: 'bg-blue-500', 
            x: 100, 
            y: 100,
            config: { name: 'Connect to S3', description: 'Connect to S3 bucket', parameters: { bucket: 'production-data', region: 'us-east-1' } }
          },
          { 
            id: 'scheduling', 
            canvasId: 'scheduling-1', 
            name: 'Production Scheduling', 
            icon: Zap, 
            color: 'bg-orange-500', 
            x: 350, 
            y: 50,
            config: { name: 'Production Scheduling', description: 'Schedule production tasks', parameters: { algorithm: 'genetic', iterations: '1000' } }
          },
          { 
            id: 'explainability-agent', 
            canvasId: 'explainability-agent-1', 
            name: 'Explainability Agent', 
            icon: Eye, 
            color: 'bg-violet-500', 
            x: 350, 
            y: 150,
            config: { name: 'Explainability Agent', description: 'Explain scheduling decisions', parameters: { data: '', prompt: 'Explain the scheduling decisions' } }
          },
          { 
            id: 'save-warehouse', 
            canvasId: 'save-warehouse-1', 
            name: 'Save to Warehouse', 
            icon: Database, 
            color: 'bg-green-500', 
            x: 600, 
            y: 100,
            config: { name: 'Save to Warehouse', description: 'Save results to data warehouse', parameters: { table: 'production_schedule', format: 'parquet' } }
          }
        ],
        connections: [
          { id: 'c1', from: 's3-connect-1', to: 'scheduling-1' },
          { id: 'c2', from: 'scheduling-1', to: 'explainability-agent-1' },
          { id: 'c3', from: 'scheduling-1', to: 'save-warehouse-1' },
          { id: 'c4', from: 'explainability-agent-1', to: 'save-warehouse-1' }
        ]
      };
    }
    
    return { blocks: [], connections: [] };
  };

  const functionalBlocks = [
    // Core Planning Modules
    { id: 'demand-forecast', name: 'Demand Forecasting', icon: TrendingUp, color: 'bg-gradient-to-r from-blue-500 to-blue-600', category: 'Planning' },
    { id: 'replenishment', name: 'Replenishment Planning', icon: RefreshCw, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', category: 'Planning' },
    { id: 'production', name: 'Production Planning', icon: Factory, color: 'bg-gradient-to-r from-purple-500 to-purple-600', category: 'Planning' },
    { id: 'scheduling', name: 'Production Scheduling', icon: Calendar, color: 'bg-gradient-to-r from-orange-500 to-orange-600', category: 'Planning' },
    { id: 'inventory', name: 'Inventory Optimization', icon: Package, color: 'bg-gradient-to-r from-cyan-500 to-cyan-600', category: 'Planning' },

    // Financial Planning
    { id: 'capex', name: 'Capex Planning', icon: Building2, color: 'bg-gradient-to-r from-red-500 to-red-600', category: 'Finance' },
    { id: 'opex', name: 'Opex Planning', icon: Calculator, color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', category: 'Finance' },
    { id: 'budget', name: 'Budget Analysis', icon: DollarSign, color: 'bg-gradient-to-r from-green-500 to-green-600', category: 'Finance' },
    { id: 'procurement', name: 'Procurement Planning', icon: Briefcase, color: 'bg-gradient-to-r from-indigo-500 to-indigo-600', category: 'Finance' },
    { id: 'raw-material', name: 'Raw Material Planning', icon: Coins, color: 'bg-gradient-to-r from-pink-500 to-pink-600', category: 'Finance' },

    // Analytics & Intelligence
    { id: 'kpi-analysis', name: 'KPI Analysis', icon: Gauge, color: 'bg-gradient-to-r from-violet-500 to-violet-600', category: 'Analytics' },
    { id: 'trend-analysis', name: 'Trend Analysis', icon: LineChart, color: 'bg-gradient-to-r from-sky-500 to-sky-600', category: 'Analytics' },
    { id: 'performance', name: 'Performance Metrics', icon: Activity, color: 'bg-gradient-to-r from-teal-500 to-teal-600', category: 'Analytics' },
    { id: 'variance', name: 'Variance Analysis', icon: TrendingDown, color: 'bg-gradient-to-r from-rose-500 to-rose-600', category: 'Analytics' },

    // Supply Chain
    { id: 'logistics', name: 'Logistics Optimization', icon: Truck, color: 'bg-gradient-to-r from-amber-500 to-amber-600', category: 'Supply Chain' },
    { id: 'supplier', name: 'Supplier Management', icon: Users, color: 'bg-gradient-to-r from-lime-500 to-lime-600', category: 'Supply Chain' },
    { id: 'quality', name: 'Quality Control', icon: CheckCircle2, color: 'bg-gradient-to-r from-green-600 to-green-700', category: 'Supply Chain' },
    { id: 'location', name: 'Location Analysis', icon: MapPin, color: 'bg-gradient-to-r from-blue-600 to-blue-700', category: 'Supply Chain' },

    // Risk & Compliance
    { id: 'risk-analysis', name: 'Risk Analysis', icon: Shield, color: 'bg-gradient-to-r from-red-600 to-red-700', category: 'Risk' },
    { id: 'compliance', name: 'Compliance Check', icon: Scale, color: 'bg-gradient-to-r from-gray-600 to-gray-700', category: 'Risk' },
    { id: 'audit', name: 'Audit Trail', icon: FileCheck, color: 'bg-gradient-to-r from-slate-600 to-slate-700', category: 'Risk' },
    { id: 'alert', name: 'Alert System', icon: AlertTriangle, color: 'bg-gradient-to-r from-orange-600 to-orange-700', category: 'Risk' },
  ];

  const aiAgents = [
    { id: 'ocr-agent', name: 'OCR Document Reader', icon: Scan, color: 'bg-gradient-to-r from-emerald-600 to-emerald-700', description: 'Extract text from documents and images' },
    { id: 'explainability-agent', name: 'AI Explainer', icon: Eye, color: 'bg-gradient-to-r from-violet-600 to-violet-700', description: 'Explain AI decisions and recommendations' },
    { id: 'summarization-agent', name: 'Content Summarizer', icon: FileText, color: 'bg-gradient-to-r from-teal-600 to-teal-700', description: 'Generate intelligent summaries' },
    { id: 'anomaly-detector', name: 'Anomaly Detector', icon: AlertCircle, color: 'bg-gradient-to-r from-red-600 to-red-700', description: 'Detect unusual patterns and outliers' },
    { id: 'forecast-agent', name: 'AI Forecaster', icon: Brain, color: 'bg-gradient-to-r from-blue-600 to-blue-700', description: 'Advanced forecasting algorithms' },
    { id: 'optimizer', name: 'Process Optimizer', icon: Target, color: 'bg-gradient-to-r from-orange-600 to-orange-700', description: 'Optimize processes and workflows' },
    { id: 'recommendation', name: 'Smart Advisor', icon: Workflow, color: 'bg-gradient-to-r from-purple-600 to-purple-700', description: 'Provide intelligent recommendations' },
  ];

  const dataConnectors = [
    // Source Connectors
    { id: 'csv-upload', name: 'CSV File Upload', icon: FileSpreadsheet, type: 'source', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { id: 's3-connect', name: 'Amazon S3', icon: CloudDownload, type: 'source', color: 'bg-gradient-to-r from-orange-500 to-orange-600' },
    { id: 'azure-blob', name: 'Azure Blob Storage', icon: Database, type: 'source', color: 'bg-gradient-to-r from-blue-600 to-blue-700' },
    { id: 'postgresql', name: 'PostgreSQL Database', icon: HardDrive, type: 'source', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
    { id: 'mysql', name: 'MySQL Database', icon: Database, type: 'source', color: 'bg-gradient-to-r from-cyan-500 to-cyan-600' },
    { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, type: 'source', color: 'bg-gradient-to-r from-sky-500 to-sky-600' },
    { id: 'sap', name: 'SAP Integration', icon: Network, type: 'source', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { id: 'oracle', name: 'Oracle Database', icon: Database, type: 'source', color: 'bg-gradient-to-r from-red-500 to-red-600' },
    
    // Target Connectors  
    { id: 'save-warehouse', name: 'Data Warehouse', icon: HardDrive, type: 'target', color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { id: 'dashboard', name: 'Analytics Dashboard', icon: BarChart3, type: 'target', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { id: 'api-push', name: 'REST API Endpoint', icon: Webhook, type: 'target', color: 'bg-gradient-to-r from-teal-500 to-teal-600' },
    { id: 'email-export', name: 'Email Report', icon: Send, type: 'target', color: 'bg-gradient-to-r from-rose-500 to-rose-600' },
    { id: 'file-export', name: 'File Export', icon: FileOutput, type: 'target', color: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { id: 'slack-notify', name: 'Slack Notification', icon: Send, type: 'target', color: 'bg-gradient-to-r from-violet-500 to-violet-600' },
  ];

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedBlock || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBlock = {
      ...draggedBlock,
      canvasId: `${draggedBlock.id}-${Date.now()}`,
      x: Math.max(0, x - 50),
      y: Math.max(0, y - 25),
      config: {
        name: draggedBlock.name,
        description: '',
        parameters: getDefaultParameters(draggedBlock.id)
      }
    };

    setCanvasBlocks(prev => [...prev, newBlock]);
    setDraggedBlock(null);
  };

  const getDefaultParameters = (blockId) => {
    const paramMap = {
      'demand-forecast': { forecastPeriod: '12', algorithm: 'arima', confidence: '95' },
      'csv-upload': { fileName: '', delimiter: ',', encoding: 'utf-8' },
      's3-connect': { bucket: '', region: 'us-east-1', accessKey: '' },
      'postgresql': { host: '', database: '', username: '', password: '' },
      'dashboard': { format: 'json', frequency: 'daily', layout: 'grid' },
      'ocr-agent': { data: '', prompt: 'Extract text from the provided image or document' },
      'explainability-agent': { data: '', prompt: 'Explain the decision or prediction from the provided data' },
      'summarization-agent': { data: '', prompt: 'Summarize the key points from the provided text or data' },
    };
    return paramMap[blockId] || {};
  };

  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filterComponents = (components) => {
    if (!searchTerm) return components;
    return components.filter(component => 
      component.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleBlockClick = (block, e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    if (connecting) {
      if (connecting.canvasId !== block.canvasId) {
        const newConnection = {
          id: `${connecting.canvasId}-${block.canvasId}`,
          from: connecting.canvasId,
          to: block.canvasId
        };
        setConnections(prev => [...prev, newConnection]);
        toast.success("Blocks connected successfully");
      }
      setConnecting(null);
    } else {
      setSelectedBlock(block);
      setRightPanelCollapsed(false); // Expand right panel when block is selected
    }
  };

  const startConnection = (block, e) => {
    e.stopPropagation();
    setConnecting(block);
  };

  const handleCanvasBlockMouseDown = (block, e) => {
    if (e.button !== 0) return; // Only left mouse button
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - block.x;
    const offsetY = e.clientY - rect.top - block.y;
    
    setDraggedCanvasBlock(block);
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Prevent text selection
    e.preventDefault();
  };

  const handleCanvasMouseMove = (e) => {
    if (!draggedCanvasBlock || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
    const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);
    
    setCanvasBlocks(prev => 
      prev.map(block => 
        block.canvasId === draggedCanvasBlock.canvasId 
          ? { ...block, x: newX, y: newY }
          : block
      )
    );
    
    // Update selected block position if it's being dragged
    if (selectedBlock?.canvasId === draggedCanvasBlock.canvasId) {
      setSelectedBlock(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedCanvasBlock(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const runWorkflow = () => {
    if (canvasBlocks.length === 0) {
      toast.error("Please add blocks to your workflow before running");
      return;
    }
    
    // Create serializable workflow data without React icons
    const workflowData = {
      blocks: canvasBlocks.map(block => ({
        id: block.id,
        name: block.name,
        color: block.color,
        x: block.x,
        y: block.y,
        config: block.config
      })),
      connections
    };
    
    console.log("Running workflow with data:", workflowData);
    toast.success("Starting workflow execution...");
    
    navigate('/workflow-run', { 
      state: { 
        workflowData,
        workflowName: 'Current Workflow'
      }
    });
  };

  const updateBlockConfig = (field, value) => {
    if (!selectedBlock) return;
    
    setCanvasBlocks(prev => 
      prev.map(block => 
        block.canvasId === selectedBlock.canvasId 
          ? { ...block, config: { ...block.config, [field]: value } }
          : block
      )
    );
    
    setSelectedBlock(prev => ({
      ...prev,
      config: { ...prev.config, [field]: value }
    }));
  };

  const updateBlockParameter = (param, value) => {
    if (!selectedBlock) return;
    
    const updatedBlock = {
      ...selectedBlock,
      config: {
        ...selectedBlock.config,
        parameters: { ...selectedBlock.config.parameters, [param]: value }
      }
    };

    setCanvasBlocks(prev => 
      prev.map(block => 
        block.canvasId === selectedBlock.canvasId ? updatedBlock : block
      )
    );
    
    setSelectedBlock(updatedBlock);
  };

  const deleteBlock = (blockId) => {
    setCanvasBlocks(prev => prev.filter(block => block.canvasId !== blockId));
    if (selectedBlock?.canvasId === blockId) {
      setSelectedBlock(null);
    }
  };

  const renderParameterInputs = () => {
    if (!selectedBlock?.config?.parameters) return null;

    return Object.entries(selectedBlock.config.parameters).map(([key, value]) => {
      // Special handling for dashboard layout parameter
      if (selectedBlock.id === 'dashboard' && key === 'layout') {
        return (
          <div key={key}>
            <Label htmlFor={key} className="text-sm font-medium text-foreground">
              Dashboard Layout
            </Label>
            <div className="mt-2">
              {renderDashboardLayoutSelector(value)}
            </div>
          </div>
        );
      }

      return (
        <div key={key}>
          <Label htmlFor={key} className="text-sm font-medium text-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          <Input
            id={key}
            value={String(value)}
            onChange={(e) => updateBlockParameter(key, e.target.value)}
            className="mt-1"
          />
        </div>
      );
    });
  };

  const dashboardLayouts = [
    {
      id: 'grid',
      name: 'Grid Layout',
      icon: Grid2X2,
      description: 'Organized grid with equal-sized widgets',
      preview: (
        <div className="w-full h-8 bg-muted/50 rounded border-2 border-border grid grid-cols-2 gap-0.5 p-0.5">
          <div className="bg-primary/20 rounded-sm"></div>
          <div className="bg-primary/20 rounded-sm"></div>
          <div className="bg-primary/20 rounded-sm"></div>
          <div className="bg-primary/20 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'masonry',
      name: 'Masonry',
      icon: Layers3,
      description: 'Pinterest-style layout with varying heights',
      preview: (
        <div className="w-full h-8 bg-muted/50 rounded border-2 border-border flex gap-0.5 p-0.5">
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
          <div className="flex flex-col flex-1 gap-0.5">
            <div className="flex-1 bg-primary/20 rounded-sm"></div>
            <div className="flex-1 bg-primary/20 rounded-sm"></div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'sidebar',
      name: 'Sidebar Focus',
      icon: PanelLeftOpen,
      description: 'Main content with sidebar panels',
      preview: (
        <div className="w-full h-8 bg-muted/50 rounded border-2 border-border flex gap-0.5 p-0.5">
          <div className="w-2 bg-primary/20 rounded-sm"></div>
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'vertical',
      name: 'Vertical Stack',
      icon: Rows3,
      description: 'Stacked layout for detailed views',
      preview: (
        <div className="w-full h-8 bg-muted/50 rounded border-2 border-border flex flex-col gap-0.5 p-0.5">
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
          <div className="flex-1 bg-primary/20 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'executive',
      name: 'Executive',
      icon: Layout,
      description: 'Clean layout for executive summaries',
      preview: (
        <div className="w-full h-8 bg-muted/50 rounded border-2 border-border p-0.5">
          <div className="w-full h-2 bg-primary/20 rounded-sm mb-0.5"></div>
          <div className="flex gap-0.5 h-4">
            <div className="flex-2 bg-primary/20 rounded-sm"></div>
            <div className="flex-1 bg-primary/20 rounded-sm"></div>
          </div>
        </div>
      )
    }
  ];

  const renderDashboardLayoutSelector = (currentLayout) => {
    return (
      <div className="space-y-2">
        {dashboardLayouts.map((layout) => (
          <div
            key={layout.id}
            className={`p-2 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
              currentLayout === layout.id 
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                : 'border-border bg-card hover:bg-muted/30'
            }`}
            onClick={() => updateBlockParameter('layout', layout.id)}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <layout.icon className={`h-3 w-3 ${
                  currentLayout === layout.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${
                    currentLayout === layout.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {layout.name}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mb-1.5">
                  {layout.description}
                </p>
                {layout.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Workflow Builder
              {isEditing && <Badge variant="secondary" className="ml-2">Editing: {workflow?.name}</Badge>}
            </h1>
            <p className="text-muted-foreground">Build Your Own Planning Workflow</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={runWorkflow}>
              <Play className="h-4 w-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-89px)]">
        {/* Left Panel - Compact Block Palette with Search */}
        <div className="w-72 border-r bg-background overflow-y-auto">
          <div className="p-3 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Functional Blocks */}
            <Collapsible open={sectionsOpen.functionalBlocks} onOpenChange={() => toggleSection('functionalBlocks')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Functional Modules</span>
                  <Badge variant="secondary" className="text-xs">{filterComponents(functionalBlocks).length}</Badge>
                </div>
                {sectionsOpen.functionalBlocks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                {['Planning', 'Finance', 'Analytics', 'Supply Chain', 'Risk'].map((category) => {
                  const categoryBlocks = filterComponents(functionalBlocks.filter(block => block.category === category));
                  if (categoryBlocks.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-2">{category}</div>
                      <div className="space-y-1">
                        {categoryBlocks.map((block) => (
                          <div
                            key={block.id}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing border border-transparent hover:border-border/50 transition-all"
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                          >
                            <div className={`p-1.5 rounded-md ${block.color} flex-shrink-0`}>
                              <block.icon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium truncate">{block.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            {/* AI Agents */}
            <Collapsible open={sectionsOpen.aiAgents} onOpenChange={() => toggleSection('aiAgents')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-sm font-medium">AI Agents</span>
                  <Badge variant="secondary" className="text-xs">{filterComponents(aiAgents).length}</Badge>
                </div>
                {sectionsOpen.aiAgents ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {filterComponents(aiAgents).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing border border-transparent hover:border-border/50 transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(e, agent)}
                  >
                    <div className={`p-1.5 rounded-md ${agent.color} flex-shrink-0`}>
                      <agent.icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{agent.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{agent.description}</div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Data Connectors */}
            <Collapsible open={sectionsOpen.dataConnectors} onOpenChange={() => toggleSection('dataConnectors')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm font-medium">Data Connectors</span>
                  <Badge variant="secondary" className="text-xs">{filterComponents(dataConnectors).length}</Badge>
                </div>
                {sectionsOpen.dataConnectors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-2 flex items-center justify-between">
                    <span>Sources</span>
                    <Badge variant="outline" className="text-xs">Input</Badge>
                  </div>
                  <div className="space-y-1">
                    {filterComponents(dataConnectors.filter(c => c.type === 'source')).map((connector) => (
                      <div
                        key={connector.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing border border-transparent hover:border-border/50 transition-all"
                        draggable
                        onDragStart={(e) => handleDragStart(e, connector)}
                      >
                        <div className={`p-1.5 rounded-md ${connector.color} flex-shrink-0`}>
                          <connector.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium truncate">{connector.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-2 flex items-center justify-between">
                    <span>Targets</span>
                    <Badge variant="outline" className="text-xs">Output</Badge>
                  </div>
                  <div className="space-y-1">
                    {filterComponents(dataConnectors.filter(c => c.type === 'target')).map((connector) => (
                      <div
                        key={connector.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing border border-transparent hover:border-border/50 transition-all"
                        draggable
                        onDragStart={(e) => handleDragStart(e, connector)}
                      >
                        <div className={`p-1.5 rounded-md ${connector.color} flex-shrink-0`}>
                          <connector.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium truncate">{connector.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Center Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={() => {
            setSelectedBlock(null);
            setConnecting(null);
          }}
        >
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <Button variant="outline" size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Canvas Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Connections */}
          <svg 
            className="absolute inset-0 pointer-events-none" 
            style={{ zIndex: 15, width: '100%', height: '100%' }}
            width="100%"
            height="100%"
          >
            {connections.map((connection) => {
              const fromBlock = canvasBlocks.find(b => b.canvasId === connection.from);
              const toBlock = canvasBlocks.find(b => b.canvasId === connection.to);
              
              if (!fromBlock || !toBlock) return null;
              
              const fromX = fromBlock.x + 192; // Right edge of block (block width is 192px)
              const fromY = fromBlock.y + 40;  // Middle of block height
              const toX = toBlock.x;           // Left edge of target block
              const toY = toBlock.y + 40;      // Middle of target block height
              
              // Calculate control points for smooth curve
              const deltaX = toX - fromX;
              const controlOffset = Math.max(50, Math.abs(deltaX) * 0.5);
              const control1X = fromX + controlOffset;
              const control1Y = fromY;
              const control2X = toX - controlOffset;
              const control2Y = toY;
              
              const pathData = `M ${fromX} ${fromY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${toX} ${toY}`;
              
              return (
                <g key={connection.id}>
                  {/* Curved connection line */}
                  <path
                    d={pathData}
                    stroke="#2563eb"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Connection point indicators */}
                  <circle
                    cx={fromX}
                    cy={fromY}
                    r="4"
                    fill="#2563eb"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle
                    cx={toX}
                    cy={toY}
                    r="4"
                    fill="#2563eb"
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="11"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#2563eb"
                />
              </marker>
            </defs>
          </svg>

          {/* Dropped Blocks */}
          {canvasBlocks.map((block) => (
            <div
              key={block.canvasId}
              className={`absolute group ${
                selectedBlock?.canvasId === block.canvasId ? 'ring-2 ring-primary' : ''
              } ${connecting ? 'cursor-crosshair' : 'cursor-move'} ${
                draggedCanvasBlock?.canvasId === block.canvasId ? 'z-50' : 'z-10'
              }`}
              style={{ left: block.x, top: block.y }}
              onMouseDown={(e) => handleCanvasBlockMouseDown(block, e)}
              onClick={(e) => handleBlockClick(block, e)}
            >
              <Card className="w-48 shadow-elevated hover:shadow-floating transition-all duration-300 bg-card border-border/50 select-none group/block">
                <CardContent className="p-4 relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-lg ${block.color || 'bg-gradient-to-r from-muted to-muted-foreground/20'} shadow-sm flex-shrink-0`}>
                        <block.icon className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-label-md text-foreground font-medium leading-tight truncate">
                          {block.config?.name || block.name}
                        </div>
                        <div className="text-caption text-muted-foreground mt-0.5">
                          {block.type === 'source' ? 'Data Source' : block.type === 'target' ? 'Data Target' : 'Function Block'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground transition-colors ${
                          connecting?.canvasId === block.canvasId 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : ''
                        }`}
                        onClick={(e) => startConnection(block, e)}
                        title="Connect to another block"
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.canvasId);
                        }}
                        title="Delete block"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Connection ports */}
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background opacity-0 group-hover/block:opacity-100 transition-all duration-200 shadow-sm"></div>
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background opacity-0 group-hover/block:opacity-100 transition-all duration-200 shadow-sm"></div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Empty State */}
          {canvasBlocks.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                <p className="text-sm">Drag blocks from the left panel to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Block Configuration */}
        {!rightPanelCollapsed && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Block Properties</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelCollapsed(true)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {connecting && (
                <Card className="border-primary bg-primary/5">
                  <CardContent className="p-3">
                    <div className="text-sm text-primary font-medium">Connection Mode</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Click another block to connect to "{connecting.config?.name || connecting.name}"
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7"
                      onClick={() => setConnecting(null)}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {selectedBlock ? (
                <div className="space-y-4">
                   <Card>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-sm">Block Configuration</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div>
                         <Label htmlFor="blockName" className="text-sm font-medium text-foreground">
                           Block Name
                         </Label>
                         <Input
                           id="blockName"
                           value={selectedBlock.config?.name || ''}
                           onChange={(e) => updateBlockConfig('name', e.target.value)}
                           className="mt-1"
                         />
                       </div>
                       <div>
                         <Label htmlFor="blockDescription" className="text-sm font-medium text-foreground">
                           Description
                         </Label>
                         <Textarea
                           id="blockDescription"
                           value={selectedBlock.config?.description || ''}
                           onChange={(e) => updateBlockConfig('description', e.target.value)}
                           className="mt-1 h-20"
                           placeholder="Describe what this block does..."
                         />
                       </div>
                     </CardContent>
                   </Card>

                   {/* Block Parameters */}
                   {selectedBlock.config?.parameters && Object.keys(selectedBlock.config.parameters).length > 0 && (
                     <Card>
                       <CardHeader className="pb-3">
                         <CardTitle className="text-sm">Parameters</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         {renderParameterInputs()}
                       </CardContent>
                     </Card>
                   )}

                   {/* Block Info */}
                   <Card>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-sm">Block Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className={`p-1.5 rounded ${selectedBlock.color || 'bg-muted'}`}>
                           <selectedBlock.icon className="h-3 w-3 text-white" />
                         </div>
                         <span className="text-sm font-medium">{selectedBlock.name}</span>
                       </div>
                       <div className="text-xs text-muted-foreground">
                         Type: {selectedBlock.type === 'source' ? 'Data Source' : selectedBlock.type === 'target' ? 'Data Target' : 'Function Block'}
                       </div>
                       <div className="text-xs text-muted-foreground">
                         ID: {selectedBlock.canvasId}
                       </div>
                     </CardContent>
                   </Card>
                 </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Settings className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a block to configure properties</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Collapsed Right Panel Toggle */}
        {rightPanelCollapsed && (
          <div className="border-l border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(false)}
              className="h-12 w-8 rounded-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;