import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Database,
  Zap,
  Clock,
  BarChart3,
  Activity,
  Users,
  DollarSign,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PipelineDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    workflowName = 'Workflow Pipeline', 
    workflowData, 
    completedBlocks = [],
    executionTime 
  } = location.state || {};

  // Mock dashboard data based on workflow type
  const getDashboardData = () => {
    if (workflowName?.includes('Supply Chain')) {
      return {
        kpis: [
          { title: 'Demand Accuracy', value: '94.2%', change: '+2.3%', positive: true },
          { title: 'Inventory Turnover', value: '12.4x', change: '+1.2x', positive: true },
          { title: 'Cost Savings', value: '$2.4M', change: '+18%', positive: true },
          { title: 'Service Level', value: '98.7%', change: '+0.8%', positive: true },
        ],
        chartData: [
          { month: 'Jan', demand: 2400, supply: 2800, inventory: 1200 },
          { month: 'Feb', demand: 1398, supply: 1800, inventory: 980 },
          { month: 'Mar', demand: 9800, supply: 9200, inventory: 1100 },
          { month: 'Apr', demand: 3908, supply: 4200, inventory: 1350 },
          { month: 'May', demand: 4800, supply: 5100, inventory: 1200 },
          { month: 'Jun', demand: 3800, supply: 3900, inventory: 1400 },
        ],
        pieData: [
          { name: 'Raw Materials', value: 35, color: '#0088FE' },
          { name: 'Work in Progress', value: 25, color: '#00C49F' },
          { name: 'Finished Goods', value: 30, color: '#FFBB28' },
          { name: 'Safety Stock', value: 10, color: '#FF8042' },
        ]
      };
    } else if (workflowName?.includes('Financial')) {
      return {
        kpis: [
          { title: 'Budget Variance', value: '2.1%', change: '-0.5%', positive: true },
          { title: 'ROI', value: '24.8%', change: '+3.2%', positive: true },
          { title: 'Cash Flow', value: '$8.2M', change: '+12%', positive: true },
          { title: 'Forecast Accuracy', value: '91.5%', change: '+1.8%', positive: true },
        ],
        chartData: [
          { month: 'Q1', capex: 2400, opex: 1800, revenue: 4200 },
          { month: 'Q2', capex: 1398, opex: 2200, revenue: 3800 },
          { month: 'Q3', capex: 9800, opex: 2800, revenue: 12600 },
          { month: 'Q4', capex: 3908, opex: 2100, revenue: 6009 },
        ],
        pieData: [
          { name: 'Capex', value: 40, color: '#0088FE' },
          { name: 'Opex', value: 35, color: '#00C49F' },
          { name: 'Revenue', value: 20, color: '#FFBB28' },
          { name: 'Profit', value: 5, color: '#FF8042' },
        ]
      };
    } else {
      return {
        kpis: [
          { title: 'Efficiency', value: '87.3%', change: '+5.2%', positive: true },
          { title: 'Throughput', value: '1.2K/hr', change: '+8%', positive: true },
          { title: 'Quality Score', value: '99.1%', change: '+0.3%', positive: true },
          { title: 'Utilization', value: '92.8%', change: '+2.1%', positive: true },
        ],
        chartData: [
          { hour: '08:00', output: 120, quality: 98, efficiency: 85 },
          { hour: '10:00', output: 132, quality: 99, efficiency: 88 },
          { hour: '12:00', output: 145, quality: 97, efficiency: 90 },
          { hour: '14:00', output: 128, quality: 99, efficiency: 87 },
          { hour: '16:00', output: 155, quality: 98, efficiency: 92 },
          { hour: '18:00', output: 142, quality: 99, efficiency: 89 },
        ],
        pieData: [
          { name: 'Processing', value: 45, color: '#0088FE' },
          { name: 'Queue Time', value: 25, color: '#00C49F' },
          { name: 'Setup', value: 20, color: '#FFBB28' },
          { name: 'Maintenance', value: 10, color: '#FF8042' },
        ]
      };
    }
  };

  const dashboardData = getDashboardData();

  const formatExecutionTime = () => {
    if (!executionTime) return 'Unknown';
    const duration = Math.floor((Date.now() - executionTime) / 1000);
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  if (!workflowData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Pipeline Data</h2>
          <p className="text-muted-foreground mb-4">Please run a workflow to view dashboard.</p>
          <Button onClick={() => navigate('/workflows')}>
            Go to Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                {workflowName} Dashboard
              </h1>
              <p className="text-muted-foreground">Pipeline execution results and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {formatExecutionTime()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Pipeline Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blocks Executed</p>
                  <p className="text-xl font-bold">{completedBlocks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Execution Time</p>
                  <p className="text-xl font-bold">{formatExecutionTime()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xl font-bold text-green-600">Live</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <span className={`text-sm font-medium ${
                      kpi.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={Object.keys(dashboardData.chartData[0])[0]} />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={Object.keys(dashboardData.chartData[0])[1]} 
                    stroke="#0088FE" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={Object.keys(dashboardData.chartData[0])[2]} 
                    stroke="#00C49F" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pipeline Execution Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedBlocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{block.name}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {block.type}
                  </Badge>
                  <div className="flex-1" />
                  <div className="text-sm text-muted-foreground">
                    Completed in {Math.floor(Math.random() * 30 + 10)}s
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => navigate('/workflow-run', { state: location.state })}>
            <Activity className="h-4 w-4 mr-2" />
            Re-run Pipeline
          </Button>
          <Button variant="outline" onClick={() => navigate('/workflows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PipelineDashboard;