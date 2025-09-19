import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  Package, 
  DollarSign,
  Users,
  Factory,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  AlertCircle,
  Download,
  Share,
  Eye,
  Calendar
} from "lucide-react";
import { ForecastCard } from "@/components/ForecastCard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample analytics data
  const overallMetrics = [
    { title: "Total Revenue", value: "$48.2M", change: "+12.5%", trend: "up", icon: DollarSign },
    { title: "Active Studies", value: "24", change: "+8", trend: "up", icon: BarChart3 },
    { title: "Forecast Accuracy", value: "94.2%", change: "+2.1%", trend: "up", icon: TrendingUp },
    { title: "Processing Time", value: "2.3s", change: "-0.8s", trend: "up", icon: Clock }
  ];

  const qualityMetrics = [
    { title: "Completeness", value: "97.4%", color: "success", icon: CheckCircle },
    { title: "Missing Values", value: "1", color: "warning", icon: AlertTriangle },
    { title: "Duplicates", value: "2", color: "accent", icon: Copy },
    { title: "Outliers", value: "4", color: "destructive", icon: AlertCircle }
  ];

  const moduleUsage = [
    { name: "Demand Forecasting", value: 35, color: "hsl(var(--primary))" },
    { name: "Production Planning", value: 25, color: "hsl(var(--secondary))" },
    { name: "Inventory Optimization", value: 20, color: "hsl(var(--accent))" },
    { name: "Financial Planning", value: 12, color: "hsl(var(--success))" },
    { name: "Others", value: 8, color: "hsl(var(--muted-foreground))" }
  ];

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Forecast Accuracy',
        data: [89, 91, 88, 93, 92, 94],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Data Quality Score',
        data: [95, 94, 96, 97, 96, 97],
        borderColor: 'hsl(var(--success))',
        backgroundColor: 'hsl(var(--success) / 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      }
    ]
  };

  const usageData = {
    labels: moduleUsage.map(m => m.name),
    datasets: [{
      data: moduleUsage.map(m => m.value),
      backgroundColor: moduleUsage.map(m => m.color),
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: { usePointStyle: true, font: { size: 12 } }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'hsl(var(--border))' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { color: 'hsl(var(--border))' },
        ticks: { font: { size: 11 } }
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-subtle">
      {/* Left Sidebar with Clickable Cards */}
      <div className="w-[25%] bg-card border-r p-4 flex flex-col max-h-screen">
        <div className="flex-none mb-4">
          <h2 className="text-xl font-bold text-foreground mb-2">Pipeline Dashboard</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        {/* Clickable Metric Cards */}
        <ScrollArea className="flex-1">
          <div className="grid gap-3 pb-4">
            <ForecastCard
              title="Overview"
              value="94.2%"
              subtitle="System performance and key metrics across all studies"
              icon={TrendingUp}
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            
            <ForecastCard
              title="Data Quality"
              value="97.4%"
              subtitle="Data completeness, accuracy, and processing metrics"
              icon={CheckCircle}
              isActive={activeTab === "quality"}
              onClick={() => setActiveTab("quality")}
            />
            
            <ForecastCard
              title="Module Usage"
              value="24"
              subtitle="Active studies and module utilization statistics"
              icon={BarChart3}
              isActive={activeTab === "usage"}
              onClick={() => setActiveTab("usage")}
            />
            
            <ForecastCard
              title="Performance"
              value="2.3s"
              subtitle="Processing times and system efficiency metrics"
              icon={Award}
              isActive={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
            />

            <ForecastCard
              title="Recent Studies"
              value="8"
              subtitle="Latest completed studies and their results"
              icon={Clock}
              isActive={activeTab === "recent"}
              onClick={() => setActiveTab("recent")}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "System Overview"}
              {activeTab === "quality" && "Data Quality Dashboard"}
              {activeTab === "usage" && "Module Usage Analytics"}
              {activeTab === "performance" && "Performance Metrics"}
              {activeTab === "recent" && "Recent Studies"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Comprehensive system insights and analytics"}
              {activeTab === "quality" && "Data quality metrics and validation results"}
              {activeTab === "usage" && "Module utilization and study distribution"}
              {activeTab === "performance" && "System performance and efficiency metrics"}
              {activeTab === "recent" && "Latest completed studies and outcomes"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
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

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Overall Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overallMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className={
                        metric.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }>
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={performanceData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Module Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Doughnut 
                      data={usageData} 
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: { position: 'bottom' as const }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "quality" && (
          <div className="space-y-6">
            {/* Data Quality Summary */}
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

            {/* Quality Details */}
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar 
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                      datasets: [
                        {
                          label: 'Completeness %',
                          data: [95, 96, 97, 98, 97, 97],
                          backgroundColor: 'hsl(var(--success) / 0.6)',
                        },
                        {
                          label: 'Accuracy %',
                          data: [92, 94, 95, 96, 95, 94],
                          backgroundColor: 'hsl(var(--primary) / 0.6)',
                        }
                      ]
                    }}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "usage" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Module Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moduleUsage.map((module, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{module.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${module.value}%`, 
                                backgroundColor: module.color 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{module.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                      <span className="text-sm">Completed</span>
                      <Badge variant="secondary" className="bg-success/20 text-success">18</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                      <span className="text-sm">In Progress</span>
                      <Badge variant="secondary" className="bg-warning/20 text-warning">4</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                      <span className="text-sm">Failed</span>
                      <Badge variant="secondary" className="bg-destructive/20 text-destructive">2</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={performanceData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="space-y-4">
            {[
              { title: "Q4 Demand Forecasting Analysis", module: "Demand Forecasting", accuracy: "94.2%", date: "2024-01-15" },
              { title: "Production Optimization Study", module: "Production Planning", accuracy: "92.1%", date: "2024-01-12" },
              { title: "Inventory Level Analysis", module: "Inventory Optimization", accuracy: "89.8%", date: "2024-01-10" },
              { title: "Supply Chain Risk Assessment", module: "Risk Management", accuracy: "91.5%", date: "2024-01-08" }
            ].map((study, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{study.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {study.module}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {study.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {study.accuracy}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;