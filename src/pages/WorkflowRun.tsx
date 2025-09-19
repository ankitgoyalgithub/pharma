import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ArrowLeft,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  FileText,
  Activity,
  Zap,
  TrendingUp,
  Database,
  Cpu,
  HardDrive,
  PieChart,
  LineChart,
  Settings,
  Filter,
  RotateCcw,
  Calculator,
  BrainCircuit
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';

// Enhanced workflow node component with better animations
const WorkflowNode = ({ data, selected }) => {
  const { name, status, type, color } = data;
  
  const getIcon = () => {
    switch (type) {
      case 'data': return <Database className="w-3 h-3 text-white" />;
      case 'processing': return <Cpu className="w-3 h-3 text-white" />;
      case 'analysis': return <BrainCircuit className="w-3 h-3 text-white" />;
      case 'filter': return <Filter className="w-3 h-3 text-white" />;
      case 'calculation': return <Calculator className="w-3 h-3 text-white" />;
      case 'output': return <FileText className="w-3 h-3 text-white" />;
      default: return <Database className="w-3 h-3 text-white" />;
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'running':
        return 'border-green-500 shadow-lg shadow-green-500/30 animate-pulse';
      case 'completed':
        return 'border-green-400 shadow-lg shadow-green-400/20';
      case 'failed':
        return 'border-red-500 shadow-lg shadow-red-500/20';
      case 'pending':
        return 'border-gray-300 shadow-sm';
      default:
        return 'border-gray-300 shadow-sm';
    }
  };
  
  return (
    <div className={`
      p-2 rounded-md border-2 bg-card min-w-[100px] text-center transition-all duration-300
      ${getStatusStyle()}
      ${selected ? 'ring-2 ring-primary' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="w-1.5 h-1.5" />
      
      <div className="flex flex-col items-center gap-1">
        {/* Status indicator */}
        <div className="flex items-center justify-center h-3">
          {status === 'running' && (
            <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
          )}
          {status === 'completed' && (
            <CheckCircle className="w-2.5 h-2.5 text-green-500" />
          )}
          {status === 'failed' && (
            <AlertCircle className="w-2.5 h-2.5 text-red-500" />
          )}
          {status === 'pending' && (
            <Clock className="w-2.5 h-2.5 text-muted-foreground" />
          )}
        </div>
        
        {/* Node icon */}
        <div className={`w-5 h-5 rounded-md ${color || 'bg-blue-500'} flex items-center justify-center`}>
          {getIcon()}
        </div>
        
        {/* Node name */}
        <div className="text-xs font-medium text-foreground leading-tight max-w-[90px] truncate">{name}</div>
        
        {/* Node type */}
        <div className="text-xs text-muted-foreground capitalize">{type}</div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-1.5 h-1.5" />
    </div>
  );
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const WorkflowRun = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState('ready');
  const [progress, setProgress] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const { workflowData, workflowName, isEditing } = location.state || {};

  // Use actual workflow data or generate based on workflow type
  const generateWorkflowData = (workflow) => {
    // If we have actual workflow structure from builder, use it
    if (workflow?.blocks && workflow?.connections) {
      return {
        blocks: workflow.blocks.map(block => ({
          id: block.canvasId || block.id,
          name: block.name,
          type: getBlockType(block.id),
          color: block.color || 'bg-blue-500',
          x: block.x || 100,
          y: block.y || 80
        })),
        connections: workflow.connections.map(conn => ({
          id: conn.id,
          from: conn.from,
          to: conn.to
        }))
      };
    }

    // Fallback to predefined structures that match WorkflowBuilder
    if (workflow?.name === 'Supply Chain Optimization') {
      return {
        blocks: [
          { id: 'demand-forecast-1', name: 'Demand Forecasting', type: 'analysis', color: 'bg-blue-500', x: 100, y: 100 },
          { id: 'inventory-1', name: 'Inventory Optimization', type: 'calculation', color: 'bg-cyan-500', x: 350, y: 50 },
          { id: 'production-1', name: 'Production Planning', type: 'processing', color: 'bg-purple-500', x: 350, y: 150 },
          { id: 'dashboard-1', name: 'Send to Dashboard', type: 'output', color: 'bg-green-500', x: 600, y: 100 }
        ],
        connections: [
          { id: 'c1', from: 'demand-forecast-1', to: 'inventory-1' },
          { id: 'c2', from: 'demand-forecast-1', to: 'production-1' },
          { id: 'c3', from: 'inventory-1', to: 'dashboard-1' },
          { id: 'c4', from: 'production-1', to: 'dashboard-1' }
        ]
      };
    } else if (workflow?.name === 'Financial Planning Pipeline') {
      return {
        blocks: [
          { id: 'csv-upload-1', name: 'Upload CSV', type: 'data', color: 'bg-blue-500', x: 100, y: 100 },
          { id: 'capex-1', name: 'Capex Planning', type: 'calculation', color: 'bg-red-500', x: 350, y: 50 },
          { id: 'opex-1', name: 'Opex Planning', type: 'calculation', color: 'bg-yellow-500', x: 350, y: 150 },
          { id: 'api-push-1', name: 'Push to API', type: 'output', color: 'bg-green-500', x: 600, y: 100 }
        ],
        connections: [
          { id: 'c1', from: 'csv-upload-1', to: 'capex-1' },
          { id: 'c2', from: 'csv-upload-1', to: 'opex-1' },
          { id: 'c3', from: 'capex-1', to: 'api-push-1' },
          { id: 'c4', from: 'opex-1', to: 'api-push-1' }
        ]
      };
    } else if (workflow?.name === 'Production Scheduling') {
      return {
        blocks: [
          { id: 's3-connect-1', name: 'Connect to S3', type: 'data', color: 'bg-blue-500', x: 100, y: 100 },
          { id: 'scheduling-1', name: 'Production Scheduling', type: 'processing', color: 'bg-orange-500', x: 350, y: 50 },
          { id: 'explainability-agent-1', name: 'Explainability Agent', type: 'analysis', color: 'bg-violet-500', x: 350, y: 150 },
          { id: 'save-warehouse-1', name: 'Save to Warehouse', type: 'output', color: 'bg-green-500', x: 600, y: 100 }
        ],
        connections: [
          { id: 'c1', from: 's3-connect-1', to: 'scheduling-1' },
          { id: 'c2', from: 'scheduling-1', to: 'explainability-agent-1' },
          { id: 'c3', from: 'scheduling-1', to: 'save-warehouse-1' },
          { id: 'c4', from: 'explainability-agent-1', to: 'save-warehouse-1' }
        ]
      };
    }
    
    // Default workflow
    return {
      blocks: [
        { id: 'start', name: 'Start', type: 'data', color: 'bg-blue-500', x: 100, y: 80 },
        { id: 'process', name: 'Process', type: 'processing', color: 'bg-orange-500', x: 400, y: 80 },
        { id: 'output', name: 'Output', type: 'output', color: 'bg-teal-500', x: 700, y: 80 }
      ],
      connections: [
        { id: 'e1', from: 'start', to: 'process' },
        { id: 'e2', from: 'process', to: 'output' }
      ]
    };
  };

  // Helper function to determine block type from block id
  const getBlockType = (blockId) => {
    const typeMap = {
      'csv-upload': 'data',
      's3-connect': 'data',
      'azure-blob': 'data',
      'postgresql': 'data',
      'mysql': 'data',
      'demand-forecast': 'analysis',
      'explainability-agent': 'analysis',
      'ocr-agent': 'analysis',
      'forecast-agent': 'analysis',
      'production': 'processing',
      'scheduling': 'processing',
      'replenishment': 'processing',
      'capex': 'calculation',
      'opex': 'calculation',
      'budget': 'calculation',
      'inventory': 'calculation',
      'dashboard': 'output',
      'api-push': 'output',
      'save-warehouse': 'output',
      'email-export': 'output',
      'file-export': 'output'
    };
    
    // Extract base id (remove numbers and hyphens at the end)
    const baseId = blockId.replace(/-\d+$/, '');
    return typeMap[baseId] || 'processing';
  };

  const workflowStructure = useMemo(() => {
    return generateWorkflowData(workflowData);
  }, [workflowData]);

  // Convert blocks to React Flow nodes
  const initialNodes = useMemo(() => {
    return workflowStructure.blocks.map((block) => ({
      id: block.id,
      type: 'workflowNode',
      position: { x: block.x, y: block.y },
      data: {
        name: block.name,
        status: 'pending',
        type: block.type,
        color: block.color,
      },
    }));
  }, [workflowStructure.blocks]);

  // Convert connections to React Flow edges
  const initialEdges = useMemo(() => {
    return workflowStructure.connections.map((connection) => ({
      id: connection.id,
      source: connection.from,
      target: connection.to,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { 
        stroke: 'hsl(var(--primary))', 
        strokeWidth: 3,
        strokeDasharray: isRunning ? '5,5' : 'none',
        animation: isRunning ? 'flow 2s ease-in-out infinite' : 'none'
      },
      animated: isRunning,
    }));
  }, [workflowStructure.connections, isRunning]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Mock data for metrics
  const memoryData = [
    { time: '0s', memory: 180, disk: 45 },
    { time: '30s', memory: 220, disk: 52 },
    { time: '60s', memory: 195, disk: 48 },
    { time: '90s', memory: 245, disk: 55 },
    { time: '120s', memory: 210, disk: 50 },
    { time: '150s', memory: 275, disk: 58 },
  ];

  const progressData = [
    { step: 'Data Loading', completed: 100, total: 100 },
    { step: 'Processing', completed: 85, total: 100 },
    { step: 'Analysis', completed: 60, total: 100 },
    { step: 'Output', completed: 0, total: 100 },
  ];

  const edaData = [
    { category: 'Product A', value: 30, count: 245 },
    { category: 'Product B', value: 25, count: 189 },
    { category: 'Product C', value: 20, count: 156 },
    { category: 'Product D', value: 15, count: 123 },
    { category: 'Product E', value: 10, count: 78 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Workflow execution simulation
  const runWorkflow = useCallback(() => {
    setIsRunning(true);
    setStatus('running');
    setProgress(0);
    setCurrentStep(0);

    const totalSteps = workflowStructure.blocks.length;
    let stepProgress = 0;

    const executeStep = () => {
      if (stepProgress >= totalSteps) {
        setStatus('completed');
        setIsRunning(false);
        setProgress(100);
        return;
      }

      // Update current node to running
      setNodes(currentNodes => 
        currentNodes.map((node, index) => ({
          ...node,
          data: {
            ...node.data,
            status: index < stepProgress ? 'completed' : 
                   index === stepProgress ? 'running' : 'pending'
          }
        }))
      );

      setCurrentStep(stepProgress);
      setProgress((stepProgress / totalSteps) * 100);

      // Simulate step completion time (2-4 seconds)
      const stepDuration = 2000 + Math.random() * 2000;
      
      setTimeout(() => {
        // Mark current step as completed
        setNodes(currentNodes => 
          currentNodes.map((node, index) => ({
            ...node,
            data: {
              ...node.data,
              status: index <= stepProgress ? 'completed' : 'pending'
            }
          }))
        );

        stepProgress++;
        executeStep();
      }, stepDuration);
    };

    executeStep();
  }, [workflowStructure.blocks.length, setNodes]);

  const pauseWorkflow = () => {
    setIsRunning(false);
    setStatus('paused');
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    setStatus('ready');
    setProgress(0);
    setCurrentStep(0);
    
    // Reset all nodes to pending
    setNodes(currentNodes => 
      currentNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          status: 'pending'
        }
      }))
    );
  };

  useEffect(() => {
    // Set first component as selected by default
    if (workflowStructure.blocks.length > 0 && !selectedComponent) {
      setSelectedComponent(workflowStructure.blocks[0].id);
    }
  }, [workflowStructure.blocks, selectedComponent]);

  // Update edges animation when running state changes
  useEffect(() => {
    setEdges(currentEdges => 
      currentEdges.map(edge => ({
        ...edge,
        animated: isRunning,
        style: {
          ...edge.style,
          stroke: isRunning ? '#10b981' : '#94a3b8'
        }
      }))
    );
  }, [isRunning, setEdges]);

  if (!workflowData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Workflow Selected</h2>
          <p className="text-muted-foreground mb-4">Please select a workflow from the workflows page.</p>
          <Button onClick={() => navigate('/workflows')}>
            Go to Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/workflows')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workflows
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {workflowName || 'Workflow Run'}
                {isEditing && <Badge variant="secondary" className="ml-2">Editing Mode</Badge>}
              </h1>
              <p className="text-muted-foreground">Monitor and execute your workflow pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              status === 'running' ? 'default' : 
              status === 'completed' ? 'secondary' : 
              status === 'paused' ? 'outline' : 
              status === 'ready' ? 'outline' : 'destructive'
            }>
              {status === 'running' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
              {status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
              {status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
              {status === 'ready' && <Clock className="h-3 w-3 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            
            {!isRunning && status !== 'completed' && (
              <Button onClick={runWorkflow} size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Workflow
              </Button>
            )}
            
            {isRunning && (
              <Button variant="outline" size="sm" onClick={pauseWorkflow}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {status === 'completed' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={stopWorkflow}>
              {isRunning ? <Square className="h-4 w-4 mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
              {isRunning ? 'Stop' : 'Reset'}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        {isRunning && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {workflowStructure.blocks.length}
              </div>
              <div className="text-sm font-medium">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Pipeline Visualization */}
        <div className="flex-1 min-h-[300px]">
          <Card className="h-full m-6 mb-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-4 w-4" />
                  Pipeline Execution
                </CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs">Running</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-xs">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-xs">Pending</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div 
                className="h-[250px] w-full bg-background border border-border rounded-lg overflow-hidden"
                style={{ background: 'hsl(var(--background))', width: '100%' }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-background"
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={true}
                >
                  <Background />
                  <Controls showInteractive={false} />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-border bg-card p-6">
          <div className="space-y-4">
            {/* Component Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Select Component:</label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose a component" />
                </SelectTrigger>
                <SelectContent>
                  {workflowStructure.blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Run Metrics
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Run Progress
                </TabsTrigger>
                <TabsTrigger value="eda" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Data Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Cpu className="h-5 w-5" />
                        Memory Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsLineChart data={memoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="memory" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            name="Memory (MB)"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HardDrive className="h-5 w-5" />
                        Disk Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsLineChart data={memoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="disk" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            name="Disk (GB)"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Step Progress for {workflowStructure.blocks.find(b => b.id === selectedComponent)?.name || 'Selected Component'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="step" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#10b981" name="Completed %" />
                        <Bar dataKey="total" fill="#e5e7eb" name="Remaining %" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="eda" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Data Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={edaData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ category, value }) => `${category}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {edaData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Record Counts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={edaData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRun;