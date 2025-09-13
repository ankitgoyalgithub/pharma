import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  FileSpreadsheet,
  TrendingUp,
  CheckCircle,
  DollarSign,
  BarChart3,
  Filter,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Data Integration", description: "Integrate sales, production & cost data", completed: true },
  { id: 2, title: "Scenario Planning", description: "Create multiple scenarios", completed: true },
  { id: 3, title: "Financial Model", description: "Generate unified financial statements", current: true }
];

const financialMetrics = [
  { label: "Revenue", value: "₹125.4M", trend: "+12%" },
  { label: "EBITDA", value: "₹28.9M", trend: "+15%" },
  { label: "Cash Flow", value: "₹18.2M", trend: "+8%" },
  { label: "Profit Margin", value: "23.1%", trend: "+2.1%" }
];

const scenarioData = [
  { lineItem: "Revenue", scenario1: "₹125.4M", scenario2: "₹118.2M", delta: "+6.1%", comments: "Higher volumes in Q4" },
  { lineItem: "COGS", scenario1: "₹78.5M", scenario2: "₹74.8M", delta: "+4.9%", comments: "Raw material inflation" },
  { lineItem: "Gross Profit", scenario1: "₹46.9M", scenario2: "₹43.4M", delta: "+8.1%", comments: "Improved margins" },
  { lineItem: "EBITDA", scenario1: "₹28.9M", scenario2: "₹26.1M", delta: "+10.7%", comments: "Operational efficiency" }
];

export default function FinancialPlanning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">Integrated Financial Planning</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar with Steps */}
        <div className="w-80 border-r border-border bg-card p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-success text-success-foreground' 
                    : step.current 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${
                      step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      Step {step.id}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold ${
                    step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-10 mt-8 w-px h-12 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-foreground">
                  <p className="font-medium mb-1">Financial model ready</p>
                  <p>All data sources integrated. Base case shows 23.1% margin with positive cash flow. Model stress-tested across scenarios.</p>
                </div>
              </div>
            </div>
            <Button className="w-full">Generate Financial Statements</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="pnl">P&L</TabsTrigger>
                <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-4 gap-4">
                {financialMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <Badge variant="default">
                          {metric.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Financial Summary Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Revenue, COGS, Profit, Margin Trend Chart</p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <TrendingUp className="w-8 h-8 text-success mb-2" />
                    <h3 className="font-medium text-sm mb-1">Revenue Growth</h3>
                    <p className="text-lg font-bold">12% YoY</p>
                    <p className="text-xs text-muted-foreground">Driven by volume increase</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <BarChart3 className="w-8 h-8 text-primary mb-2" />
                    <h3 className="font-medium text-sm mb-1">Margin Expansion</h3>
                    <p className="text-lg font-bold">+210 bps</p>
                    <p className="text-xs text-muted-foreground">Operational efficiency gains</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <DollarSign className="w-8 h-8 text-accent mb-2" />
                    <h3 className="font-medium text-sm mb-1">Cash Generation</h3>
                    <p className="text-lg font-bold">₹18.2M</p>
                    <p className="text-xs text-muted-foreground">Strong working capital mgmt</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pnl" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">P&L Line Chart: Revenue, COGS, Operating Expenses, Net Profit</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cashflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Cash Flow Chart: Operating, Investing, Financing Cash Flows</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Line Item</th>
                          <th className="text-left p-3">Base Case</th>
                          <th className="text-left p-3">Conservative</th>
                          <th className="text-left p-3">Delta %</th>
                          <th className="text-left p-3">Key Drivers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarioData.map((row, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{row.lineItem}</td>
                            <td className="p-3">{row.scenario1}</td>
                            <td className="p-3">{row.scenario2}</td>
                            <td className="p-3">
                              <Badge variant="default">{row.delta}</Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">{row.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}