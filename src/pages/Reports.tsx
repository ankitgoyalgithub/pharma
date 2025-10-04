import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Plus, ExternalLink, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  type: "dashboard" | "report";
  embedUrl: string;
  createdAt: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Sales Performance Dashboard",
      description: "Monthly sales trends across all regions",
      dataSource: "Foundry - Sales History",
      type: "dashboard",
      embedUrl: "https://metabase.example.com/embed/dashboard/abc123",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Inventory Analysis Report",
      description: "Current inventory levels and reorder points",
      dataSource: "Foundry - Inventory Levels",
      type: "report",
      embedUrl: "https://metabase.example.com/embed/question/xyz789",
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      name: "Workflow Execution Summary",
      description: "Daily workflow execution metrics and success rates",
      dataSource: "Workflows - Execution Logs",
      type: "dashboard",
      embedUrl: "https://metabase.example.com/embed/dashboard/def456",
      createdAt: "2024-02-01"
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    dataSource: "",
    type: "dashboard" as "dashboard" | "report",
    embedUrl: ""
  });

  const handleCreateReport = () => {
    if (!newReport.name || !newReport.dataSource || !newReport.embedUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReports([...reports, report]);
    setIsCreateDialogOpen(false);
    setNewReport({
      name: "",
      description: "",
      dataSource: "",
      type: "dashboard",
      embedUrl: ""
    });
    toast.success("Report created successfully");
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
    toast.success("Report deleted successfully");
  };

  const dataSources = [
    { value: "foundry-sales", label: "Foundry - Sales History" },
    { value: "foundry-inventory", label: "Foundry - Inventory Levels" },
    { value: "foundry-products", label: "Foundry - Product Master" },
    { value: "foundry-customers", label: "Foundry - Customer Master" },
    { value: "study-demand", label: "Study - Demand Forecasting Data" },
    { value: "study-inventory", label: "Study - Inventory Optimization Data" },
    { value: "workflow-logs", label: "Workflows - Execution Logs" },
    { value: "workflow-outputs", label: "Workflows - Generated Outputs" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage embedded Metabase reports and dashboards
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Report
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Configure a new Metabase report or dashboard embedding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Monthly Sales Dashboard"
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the report"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSource">Data Source *</Label>
                  <Select value={newReport.dataSource} onValueChange={(value) => setNewReport({ ...newReport, dataSource: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.value} value={source.label}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={newReport.type} onValueChange={(value: "dashboard" | "report") => setNewReport({ ...newReport, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="embedUrl">Metabase Embed URL *</Label>
                  <Input
                    id="embedUrl"
                    placeholder="https://metabase.example.com/embed/..."
                    value={newReport.embedUrl}
                    onChange={(e) => setNewReport({ ...newReport, embedUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get the embed URL from your Metabase dashboard or question
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport}>
                  Create Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gallery">Reports Gallery</TabsTrigger>
            <TabsTrigger value="viewer">Report Viewer</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {/* Data Sources Info */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Available Data Sources
                </CardTitle>
                <CardDescription>
                  Connect your reports to data from Foundry, Studies, or Workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg bg-card/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Foundry Data
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sales History</li>
                      <li>• Inventory Levels</li>
                      <li>• Master Data</li>
                      <li>• Time Series Data</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Study Results
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Demand Forecasts</li>
                      <li>• Inventory Analysis</li>
                      <li>• Planning Outputs</li>
                      <li>• Optimization Results</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      Workflow Data
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Execution Logs</li>
                      <li>• Generated Outputs</li>
                      <li>• Performance Metrics</li>
                      <li>• Error Reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Reports ({reports.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {report.type === "dashboard" ? (
                            <BarChart3 className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Source:</span>
                          <span className="font-medium">{report.dataSource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{report.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium">{report.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1 gap-2"
                          onClick={() => {
                            setSelectedReport(report);
                            const tabsList = document.querySelector('[value="viewer"]') as HTMLButtonElement;
                            tabsList?.click();
                          }}
                        >
                          View Report
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <a href={report.embedUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="viewer" className="space-y-4">
            {selectedReport ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedReport.type === "dashboard" ? (
                          <BarChart3 className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                        {selectedReport.name}
                      </CardTitle>
                      <CardDescription>{selectedReport.description}</CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={selectedReport.embedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Metabase
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-muted/20 rounded-lg border border-border" style={{ height: "600px" }}>
                    <iframe
                      src={selectedReport.embedUrl}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allowTransparency
                      title={selectedReport.name}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Data Source:</span>
                        <p className="font-medium">{selectedReport.dataSource}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium capitalize">{selectedReport.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">{selectedReport.createdAt}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Report ID:</span>
                        <p className="font-medium">{selectedReport.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No report selected. Choose a report from the gallery to view it here.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const tabsList = document.querySelector('[value="gallery"]') as HTMLButtonElement;
                      tabsList?.click();
                    }}
                  >
                    Go to Gallery
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
