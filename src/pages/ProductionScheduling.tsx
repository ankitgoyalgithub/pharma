import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Filter,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Schedule Setup", description: "Configure scheduling parameters", completed: true },
  { id: 2, title: "Resource Allocation", description: "Assign lines and shifts", completed: true },
  { id: 3, title: "Schedule Optimization", description: "Generate optimal schedule", current: true }
];

const scheduleMetrics = [
  { label: "Planned SKUs", value: "45", trend: "+8" },
  { label: "Scheduled SKUs", value: "42", trend: "93%" },
  { label: "Line Utilization", value: "87%", trend: "+12%" },
  { label: "Backlog", value: "8%", trend: "-3%" }
];

const scheduleData = [
  { sku: "SKU-A001", line: "Line 1", shift: "Day", date: "2024-01-15", start: "08:00", end: "16:00", qty: "2,400" },
  { sku: "SKU-B002", line: "Line 2", shift: "Day", date: "2024-01-15", start: "08:00", end: "14:00", qty: "1,800" },
  { sku: "SKU-C003", line: "Line 3", shift: "Night", date: "2024-01-15", start: "22:00", end: "06:00", qty: "3,200" },
  { sku: "SKU-D004", line: "Line 1", shift: "Night", date: "2024-01-15", start: "22:00", end: "04:00", qty: "1,500" }
];

export default function ProductionScheduling() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("gantt");

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
            <h1 className="text-2xl font-semibold text-foreground">Production Scheduling</h1>
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
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-foreground">
                  <p className="font-medium mb-1">Schedule optimized for next 2 weeks</p>
                  <p>93% of planned SKUs scheduled with 87% average line utilization. 8% backlog remains for Line 3 capacity constraints.</p>
                </div>
              </div>
            </div>
            <Button className="w-full">Optimize Schedule</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="gantt">Gantt View</TabsTrigger>
                <TabsTrigger value="schedule">Schedule Table</TabsTrigger>
                <TabsTrigger value="capacity">Capacity View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="gantt" className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-4 gap-4">
                {scheduleMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <Badge variant={metric.trend.includes('-') ? 'destructive' : 'default'}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Gantt Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Production Schedule - Gantt View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Lines</span>
                      <div className="flex-1 grid grid-cols-7 gap-1 text-center">
                        <span>Mon 15</span>
                        <span>Tue 16</span>
                        <span>Wed 17</span>
                        <span>Thu 18</span>
                        <span>Fri 19</span>
                        <span>Sat 20</span>
                        <span>Sun 21</span>
                      </div>
                    </div>
                    
                    {/* Line 1 */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">Line 1</div>
                      <div className="flex-1 grid grid-cols-7 gap-1 h-12">
                        <div className="bg-primary/20 border border-primary rounded p-1 text-xs">
                          <div className="font-medium">SKU-A001</div>
                          <div>Day: 2,400</div>
                        </div>
                        <div className="bg-accent/20 border border-accent rounded p-1 text-xs">
                          <div className="font-medium">SKU-D004</div>
                          <div>Night: 1,500</div>
                        </div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                      </div>
                    </div>

                    {/* Line 2 */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">Line 2</div>
                      <div className="flex-1 grid grid-cols-7 gap-1 h-12">
                        <div className="bg-purple-100 border border-purple-300 rounded p-1 text-xs">
                          <div className="font-medium">SKU-B002</div>
                          <div>Day: 1,800</div>
                        </div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                      </div>
                    </div>

                    {/* Line 3 */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">Line 3</div>
                      <div className="flex-1 grid grid-cols-7 gap-1 h-12">
                        <div className="bg-orange-100 border border-orange-300 rounded p-1 text-xs">
                          <div className="font-medium">SKU-C003</div>
                          <div>Night: 3,200</div>
                        </div>
                        <div className="bg-red-100 border border-red-300 rounded p-1 text-xs">
                          <div className="font-medium">Backlog</div>
                          <div>8% items</div>
                        </div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                        <div className="border border-dashed border-muted-foreground/30"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">SKU</th>
                          <th className="text-left p-3">Line</th>
                          <th className="text-left p-3">Shift</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Start Time</th>
                          <th className="text-left p-3">End Time</th>
                          <th className="text-left p-3">Scheduled Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleData.map((row, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{row.sku}</td>
                            <td className="p-3">
                              <Badge variant="outline">{row.line}</Badge>
                            </td>
                            <td className="p-3">{row.shift}</td>
                            <td className="p-3">{row.date}</td>
                            <td className="p-3">{row.start}</td>
                            <td className="p-3">{row.end}</td>
                            <td className="p-3">{row.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="capacity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Line Capacity Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Capacity Utilization Chart</p>
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