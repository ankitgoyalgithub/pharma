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
  BrainCircuit,
  ExternalLink
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
        return 'border-green-500 shadow-lg shadow-green-500/30';
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
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
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
  const [logs, setLogs] = useState<Array<{timestamp: string, level: string, message: string}>>([]);
  const [metricsHistory, setMetricsHistory] = useState<Array<{time: string, cpu: number, memory: number, network: number, diskIO: number}>>([]);
  const [dataStats, setDataStats] = useState<{rowsProcessed: number, errors: number, warnings: number, avgProcessingTime: number}>({
    rowsProcessed: 0,
    errors: 0,
    warnings: 0,
    avgProcessingTime: 0
  });
  
  const { workflowData, workflowName, isEditing } = location.state || {};
  const dashboardUrl = workflowData?.outputDashboard;

  // Use actual workflow data or generate based on workflow type
  const generateWorkflowData = (workflow) => {
    console.log("Generating workflow data from:", workflow);
    
    // If we have actual workflow structure from builder with arrays, use it
    if (workflow?.blocks && Array.isArray(workflow.blocks) && workflow.blocks.length > 0) {
      const hasConnections = workflow?.connections && Array.isArray(workflow.connections) && workflow.connections.length > 0;
      
      console.log("Using workflow builder data. Blocks:", workflow.blocks.length, "Connections:", hasConnections ? workflow.connections.length : 0);
      
      return {
        blocks: workflow.blocks.map(block => ({
          id: block.canvasId || block.id,
          name: block.name,
          type: getBlockType(block.canvasId || block.id),
          color: block.color || 'bg-blue-500',
          x: block.x || 100,
          y: block.y || 80
        })),
        connections: hasConnections ? workflow.connections.map(conn => ({
          id: conn.id,
          from: conn.from,
          to: conn.to
        })) : []
      };
    }

    // Fallback to predefined structures based on workflow name
    console.log("Using predefined workflow structure for:", workflow?.name);
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
    } else if (workflow?.name === 'Merchandise Planning') {
      return {
        blocks: [
          { id: 'csv-1', name: 'Product Master CSV', type: 'data', color: 'bg-blue-500', x: 50, y: 50 },
          { id: 'csv-2', name: 'Location Master CSV', type: 'data', color: 'bg-blue-500', x: 50, y: 120 },
          { id: 'csv-3', name: 'Sales History CSV', type: 'data', color: 'bg-blue-500', x: 50, y: 190 },
          { id: 'csv-4', name: 'Channel Master CSV', type: 'data', color: 'bg-blue-500', x: 50, y: 260 },
          { id: 'csv-5', name: 'Inventory Data CSV', type: 'data', color: 'bg-blue-500', x: 50, y: 330 },
          { id: 'drivers-1', name: 'External Drivers', type: 'filter', color: 'bg-purple-500', x: 300, y: 190 },
          { id: 'sales-1', name: 'Sales Plan', type: 'analysis', color: 'bg-cyan-500', x: 550, y: 120 },
          { id: 'merch-1', name: 'Merchandise Plan', type: 'analysis', color: 'bg-indigo-500', x: 550, y: 190 },
          { id: 'assort-1', name: 'Assortment Plan', type: 'analysis', color: 'bg-pink-500', x: 550, y: 260 },
          { id: 'repl-1', name: 'Replenishment Plan', type: 'calculation', color: 'bg-orange-500', x: 800, y: 190 },
          { id: 'dashboard-1', name: 'Push to Dashboard', type: 'output', color: 'bg-green-500', x: 1050, y: 190 }
        ],
        connections: [
          { id: 'c1', from: 'csv-1', to: 'drivers-1' },
          { id: 'c2', from: 'csv-2', to: 'drivers-1' },
          { id: 'c3', from: 'csv-3', to: 'drivers-1' },
          { id: 'c4', from: 'csv-4', to: 'drivers-1' },
          { id: 'c5', from: 'csv-5', to: 'drivers-1' },
          { id: 'c6', from: 'drivers-1', to: 'sales-1' },
          { id: 'c7', from: 'drivers-1', to: 'merch-1' },
          { id: 'c8', from: 'drivers-1', to: 'assort-1' },
          { id: 'c9', from: 'sales-1', to: 'repl-1' },
          { id: 'c10', from: 'merch-1', to: 'repl-1' },
          { id: 'c11', from: 'assort-1', to: 'repl-1' },
          { id: 'c12', from: 'repl-1', to: 'dashboard-1' }
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
    console.log("Creating edges from connections:", workflowStructure.connections);
    const edges = workflowStructure.connections.map((connection) => ({
      id: connection.id,
      source: connection.from,
      target: connection.to,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: isRunning ? '#10b981' : '#3b82f6',
      },
      style: { 
        stroke: isRunning ? '#10b981' : '#3b82f6', 
        strokeWidth: 3,
        filter: isRunning ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))',
      },
      animated: isRunning,
      label: isRunning ? '⚡' : '',
      labelStyle: { 
        fill: isRunning ? '#10b981' : '#3b82f6',
        fontWeight: 600,
        fontSize: 14,
      },
      labelBgPadding: [8, 4] as [number, number],
      labelBgBorderRadius: 4,
      labelBgStyle: {
        fill: 'hsl(var(--background))',
        stroke: isRunning ? '#10b981' : '#3b82f6',
        strokeWidth: 1,
        fillOpacity: 0.9,
      },
    }));
    console.log("Created edges:", edges);
    return edges;
  }, [workflowStructure.connections, isRunning]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Helper to add log entry
  const addLog = (level: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, level, message }]);
  };
  
  // Helper to add metrics data point
  const addMetricsPoint = () => {
    const time = new Date().toLocaleTimeString();
    const cpu = 20 + Math.random() * 60;
    const memory = 40 + Math.random() * 40;
    const network = 10 + Math.random() * 50;
    const diskIO = 5 + Math.random() * 30;
    
    setMetricsHistory(prev => {
      const newHistory = [...prev, { time, cpu, memory, network, diskIO }];
      // Keep only last 20 points
      return newHistory.slice(-20);
    });
  };

  // Workflow execution simulation
  const runWorkflow = useCallback(() => {
    setIsRunning(true);
    setStatus('running');
    setProgress(0);
    setCurrentStep(0);
    setLogs([]);
    setMetricsHistory([]);
    setDataStats({rowsProcessed: 0, errors: 0, warnings: 0, avgProcessingTime: 0});

    addLog('info', '🚀 Workflow execution started');
    addLog('info', `📋 Total blocks to execute: ${workflowStructure.blocks.length}`);

    const totalSteps = workflowStructure.blocks.length;
    let stepProgress = 0;
    
    // Start metrics collection
    const metricsInterval = setInterval(() => {
      if (stepProgress < totalSteps) {
        addMetricsPoint();
      }
    }, 1000);

    const executeStep = () => {
      if (stepProgress >= totalSteps) {
        clearInterval(metricsInterval);
        setStatus('completed');
        setIsRunning(false);
        setProgress(100);
        addLog('success', '✅ Workflow execution completed successfully');
        addLog('info', `📊 Total rows processed: ${dataStats.rowsProcessed}`);
        
        // Show dashboard URL if available
        if (dashboardUrl) {
          addLog('success', `🔗 Dashboard available at: ${dashboardUrl}`);
        }
        return;
      }

      const currentBlock = workflowStructure.blocks[stepProgress];
      addLog('info', `⚡ Executing block: ${currentBlock.name}`);

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
        // Simulate processing data
        const rowsProcessed = Math.floor(1000 + Math.random() * 5000);
        const errors = Math.floor(Math.random() * 5);
        const warnings = Math.floor(Math.random() * 10);
        const processingTime = (stepDuration / 1000).toFixed(2);
        
        setDataStats(prev => ({
          rowsProcessed: prev.rowsProcessed + rowsProcessed,
          errors: prev.errors + errors,
          warnings: prev.warnings + warnings,
          avgProcessingTime: parseFloat(((prev.avgProcessingTime * stepProgress + parseFloat(processingTime)) / (stepProgress + 1)).toFixed(2))
        }));
        
        addLog('success', `✓ ${currentBlock.name} completed in ${processingTime}s`);
        addLog('info', `  └─ Processed ${rowsProcessed.toLocaleString()} rows`);
        
        if (errors > 0) {
          addLog('error', `  └─ ${errors} errors detected`);
        }
        if (warnings > 0) {
          addLog('warning', `  └─ ${warnings} warnings`);
        }
        
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
  }, [workflowStructure.blocks, setNodes, dataStats.rowsProcessed, dataStats.errors, dataStats.warnings, dataStats.avgProcessingTime]);

  const pauseWorkflow = () => {
    setIsRunning(false);
    setStatus('paused');
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    setStatus('ready');
    setProgress(0);
    setCurrentStep(0);
    setLogs([]);
    setMetricsHistory([]);
    setDataStats({rowsProcessed: 0, errors: 0, warnings: 0, avgProcessingTime: 0});
    addLog('info', '⏹️ Workflow execution stopped');
    
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
          stroke: isRunning ? '#10b981' : '#3b82f6',
          strokeWidth: 3,
          filter: isRunning ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isRunning ? '#10b981' : '#3b82f6',
        },
        label: isRunning ? '⚡' : '',
        labelStyle: { 
          fill: isRunning ? '#10b981' : '#3b82f6',
          fontWeight: 600,
          fontSize: 14,
        },
        labelBgStyle: {
          fill: 'hsl(var(--background))',
          stroke: isRunning ? '#10b981' : '#3b82f6',
          strokeWidth: 1,
          fillOpacity: 0.9,
        },
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
              {status === 'running' && <Activity className="h-3 w-3 mr-1" />}
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
              <>
                {dashboardUrl ? (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => window.open(dashboardUrl, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate('/pipeline-dashboard', { 
                      state: { 
                        workflowName: workflowName || 'Workflow',
                        workflowData: workflowData,
                        completedBlocks: workflowStructure.blocks,
                        executionTime: Date.now(),
                      } 
                    })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Pipeline Dashboard
                  </Button>
                )}
              </>
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
                className="h-[400px] w-full bg-background border border-border rounded-lg overflow-hidden"
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
                  minZoom={0.5}
                  maxZoom={1.5}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
                  <Activity className="h-4 w-4" />
                  Performance Metrics
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Data Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4 mt-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">CPU Utilization</div>
                      <div className="text-2xl font-bold mt-1">
                        {metricsHistory.length > 0 ? `${Math.round(metricsHistory[metricsHistory.length - 1]?.cpu || 0)}%` : '0%'}
                      </div>
                      <Progress value={metricsHistory[metricsHistory.length - 1]?.cpu || 0} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Memory</div>
                      <div className="text-2xl font-bold mt-1">
                        {metricsHistory.length > 0 ? `${Math.round(metricsHistory[metricsHistory.length - 1]?.memory || 0)}%` : '0%'}
                      </div>
                      <Progress value={metricsHistory[metricsHistory.length - 1]?.memory || 0} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Network I/O</div>
                      <div className="text-2xl font-bold mt-1">
                        {metricsHistory.length > 0 ? `${Math.round(metricsHistory[metricsHistory.length - 1]?.network || 0)} MB/s` : '0 MB/s'}
                      </div>
                      <Progress value={(metricsHistory[metricsHistory.length - 1]?.network || 0) * 2} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Disk I/O</div>
                      <div className="text-2xl font-bold mt-1">
                        {metricsHistory.length > 0 ? `${Math.round(metricsHistory[metricsHistory.length - 1]?.diskIO || 0)} MB/s` : '0 MB/s'}
                      </div>
                      <Progress value={(metricsHistory[metricsHistory.length - 1]?.diskIO || 0) * 3} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Cpu className="h-4 w-4" />
                        CPU & Memory Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={180}>
                        <RechartsLineChart data={metricsHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cpu" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="CPU %"
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="memory" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            name="Memory %"
                            dot={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <HardDrive className="h-4 w-4" />
                        Network & Disk I/O
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={180}>
                        <RechartsLineChart data={metricsHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="network" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            name="Network MB/s"
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="diskIO" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            name="Disk MB/s"
                            dot={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {metricsHistory.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No metrics data yet. Run the workflow to see performance metrics.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="logs" className="mt-4">
                <Card className="bg-slate-950 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText className="h-4 w-4" />
                        Execution Logs
                      </div>
                      <Badge variant="outline" className="font-mono text-xs border-slate-700 text-slate-400">
                        {logs.length} entries
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-slate-950 font-mono text-sm h-[400px] overflow-y-auto">
                      {logs.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No logs yet. Start the workflow to see execution logs.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 space-y-1">
                          {logs.map((log, index) => (
                            <div key={index} className="flex gap-3 text-xs leading-relaxed hover:bg-slate-900/50 px-2 py-1 rounded">
                              <span className="text-slate-500 flex-shrink-0">{log.timestamp}</span>
                              <span className={`flex-shrink-0 font-semibold ${
                                log.level === 'error' ? 'text-red-400' :
                                log.level === 'warning' ? 'text-yellow-400' :
                                log.level === 'success' ? 'text-green-400' :
                                'text-blue-400'
                              }`}>
                                [{log.level.toUpperCase()}]
                              </span>
                              <span className="text-slate-300 break-all">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-4">
                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Rows Processed</div>
                          <div className="text-2xl font-bold mt-1">{dataStats.rowsProcessed.toLocaleString()}</div>
                        </div>
                        <Database className="h-8 w-8 text-blue-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Errors</div>
                          <div className="text-2xl font-bold mt-1 text-red-500">{dataStats.errors}</div>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Warnings</div>
                          <div className="text-2xl font-bold mt-1 text-yellow-500">{dataStats.warnings}</div>
                        </div>
                        <AlertCircle className="h-8 w-8 text-yellow-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Avg Time/Block</div>
                          <div className="text-2xl font-bold mt-1">{dataStats.avgProcessingTime}s</div>
                        </div>
                        <Clock className="h-8 w-8 text-green-500 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Data Quality Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Data Quality Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsBarChart data={[
                          { metric: 'Completeness', score: 95 },
                          { metric: 'Accuracy', score: 92 },
                          { metric: 'Consistency', score: 88 },
                          { metric: 'Validity', score: 96 },
                        ]} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis dataKey="metric" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }} 
                          />
                          <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Processing Throughput */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Processing Throughput
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsLineChart data={[
                          { block: 'B1', rowsPerSec: 1200 },
                          { block: 'B2', rowsPerSec: 1800 },
                          { block: 'B3', rowsPerSec: 1500 },
                          { block: 'B4', rowsPerSec: 2100 },
                          { block: 'B5', rowsPerSec: 1900 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="block" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="rowsPerSec" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Rows/sec"
                            dot={{ fill: '#3b82f6', r: 4 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Data Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <PieChart className="h-4 w-4" />
                        Block Execution Time Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Data Loading', value: 25 },
                              { name: 'Processing', value: 35 },
                              { name: 'Analysis', value: 20 },
                              { name: 'Output', value: 20 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[0, 1, 2, 3].map((index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Error Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Issue Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsBarChart data={[
                          { type: 'Missing Data', count: dataStats.errors },
                          { type: 'Format Error', count: Math.floor(dataStats.errors * 0.6) },
                          { type: 'Validation', count: dataStats.warnings },
                          { type: 'Duplicates', count: Math.floor(dataStats.warnings * 0.4) },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-15} textAnchor="end" height={60} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }} 
                          />
                          <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {dataStats.rowsProcessed === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No analysis data yet. Run the workflow to see data insights.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRun;