import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ForecastCard } from "@/components/ForecastCard";
import { TrendingUp, CheckCircle, BarChart3, Award, Download, Share, Eye, Calendar, Clock } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";

const PipelineDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const overallMetrics = [
    { title: "Total Throughput", value: "124 runs", change: "+12%", trend: "up" },
    { title: "Avg. Duration", value: "2.3m", change: "-8%", trend: "up" },
    { title: "Success Rate", value: "97.4%", change: "+1.2%", trend: "up" },
    { title: "Errors", value: "3", change: "-2", trend: "up" },
  ];

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Runs Completed',
        data: [14, 18, 12, 22, 25, 16, 17],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ]
  };

  const usageData = {
    labels: ['Ingestion', 'Processing', 'Analysis', 'Output'],
    datasets: [{
      data: [30, 25, 25, 20],
      backgroundColor: [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
        'hsl(var(--success))'
      ],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { position: 'top' as const, labels: { usePointStyle: true, font: { size: 12 } } },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'hsl(var(--border))' }, ticks: { font: { size: 11 } } },
      x: { grid: { color: 'hsl(var(--border))' }, ticks: { font: { size: 11 } } }
    }
  } as const;

  return (
    <div className="flex h-screen bg-gradient-subtle">
      {/* Left Sidebar */}
      <div className="w-[25%] bg-card border-r p-4 flex flex-col max-h-screen">
        <div className="flex-none mb-4">
          <h2 className="text-xl font-bold text-foreground mb-2">Pipeline Dashboard</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid gap-3 pb-4">
            <ForecastCard
              title="Overview"
              value="94.2%"
              subtitle="System performance and key metrics"
              icon={TrendingUp}
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <ForecastCard
              title="Data Quality"
              value="97.4%"
              subtitle="Completeness and accuracy"
              icon={CheckCircle}
              isActive={activeTab === 'quality'}
              onClick={() => setActiveTab('quality')}
            />
            <ForecastCard
              title="Module Usage"
              value="24"
              subtitle="Utilization statistics"
              icon={BarChart3}
              isActive={activeTab === 'usage'}
              onClick={() => setActiveTab('usage')}
            />
            <ForecastCard
              title="Performance"
              value="2.3m"
              subtitle="Run duration and efficiency"
              icon={Award}
              isActive={activeTab === 'performance'}
              onClick={() => setActiveTab('performance')}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'quality' && 'Data Quality Dashboard'}
              {activeTab === 'usage' && 'Module Usage Analytics'}
              {activeTab === 'performance' && 'Performance Metrics'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'overview' && 'Comprehensive pipeline insights and analytics'}
              {activeTab === 'quality' && 'Data quality metrics and validation results'}
              {activeTab === 'usage' && 'Module utilization and study distribution'}
              {activeTab === 'performance' && 'Run performance and efficiency'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button><Share className="w-4 h-4 mr-2" />Share</Button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overallMetrics.map((m, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="bg-success/10 text-success">{m.change}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{m.value}</div>
                    <div className="text-sm text-muted-foreground">{m.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Runs Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]"><Line data={performanceData} options={chartOptions as any} /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]"><Doughnut data={usageData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'bottom' } } } as any} /></div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Completeness</div>
                <div className="text-2xl font-bold text-success">97.4%</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Missing Values</div>
                <div className="text-2xl font-bold text-warning">1</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Duplicates</div>
                <div className="text-2xl font-bold text-accent">2</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Outliers</div>
                <div className="text-2xl font-bold text-destructive">4</div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-4">
            {[{ title: 'Q4 Demand Forecasting Analysis', module: 'Demand Forecasting', accuracy: '94.2%', date: '2024-01-15' }].map((s, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{s.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><BarChart3 className="w-4 h-4" />{s.module}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{s.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-success/10 text-success">{s.accuracy}</Badge>
                      <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-2" />View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <Card>
            <CardHeader>
              <CardTitle>Run Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]"><Line data={performanceData} options={chartOptions as any} /></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PipelineDashboard;
