import { useState } from "react";
import { ArrowLeft, Search, Eye, RotateCcw, AlertCircle, CheckCircle, Clock, Play, FileText, Database, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Job {
  id: string;
  name: string;
  type: "workflow" | "data_sync" | "forecast" | "optimization";
  status: "success" | "in_progress" | "failed";
  startTime: string;
  duration: string;
  source?: string;
  target?: string;
  recordCount?: number;
  errorMessage?: string;
  details?: string;
}

const mockJobs: Job[] = [
  {
    id: "job-001",
    name: "Daily Sales Forecast",
    type: "forecast",
    status: "success",
    startTime: "2024-01-15 09:30:00",
    duration: "5m 23s",
    details: "Generated forecasts for next 30 days across all product lines"
  },
  {
    id: "job-002", 
    name: "SAP to Snowflake Sync",
    type: "data_sync",
    status: "success",
    startTime: "2024-01-15 08:00:00",
    duration: "12m 45s",
    source: "SAP ERP",
    target: "Snowflake",
    recordCount: 125000
  },
  {
    id: "job-003",
    name: "Production Planning Workflow",
    type: "workflow",
    status: "in_progress",
    startTime: "2024-01-15 10:15:00",
    duration: "Running...",
    details: "Processing capacity constraints and demand forecasts"
  },
  {
    id: "job-004",
    name: "Inventory Optimization",
    type: "optimization",
    status: "failed",
    startTime: "2024-01-15 07:45:00",
    duration: "2m 15s",
    errorMessage: "Insufficient historical data for product SKU-12345",
    details: "Optimization failed due to missing demand history"
  },
  {
    id: "job-005",
    name: "Customer Data Sync",
    type: "data_sync",
    status: "success",
    startTime: "2024-01-15 06:00:00",
    duration: "8m 12s",
    source: "Salesforce",
    target: "Data Lake",
    recordCount: 45000
  }
];

const getJobIcon = (type: Job["type"]) => {
  switch (type) {
    case "workflow": return Workflow;
    case "data_sync": return Database;
    case "forecast": return FileText;
    case "optimization": return Play;
    default: return FileText;
  }
};

const getStatusBadge = (status: Job["status"]) => {
  switch (status) {
    case "success":
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
    case "in_progress":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
    case "failed":
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredJobs = mockJobs.filter(job =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (job: Job) => {
    // Navigate to different detail views based on job type
    if (job.type === "workflow") {
      navigate(`/workflow-run/${job.id}`);
    } else {
      // For other job types, show a details modal or navigate to a generic details page
      console.log("View details for job:", job);
    }
  };

  const handleViewResult = (job: Job) => {
    // Navigate to result page based on job type
    if (job.type === "forecast") {
      navigate("/demand-forecasting");
    } else if (job.type === "optimization") {
      navigate("/inventory-optimization");
    } else {
      console.log("View result for job:", job);
    }
  };

  const handleRetry = (job: Job) => {
    console.log("Retry job:", job);
    // Implement retry logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Jobs
              </h1>
              <p className="text-muted-foreground mt-2">Monitor and manage all application jobs</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const IconComponent = getJobIcon(job.type);
            
            return (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{job.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Type: {job.type.replace('_', ' ')}</span>
                          <span>Started: {job.startTime}</span>
                          <span>Duration: {job.duration}</span>
                          {job.recordCount && <span>Records: {job.recordCount.toLocaleString()}</span>}
                        </div>
                        {job.source && job.target && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {job.source} → {job.target}
                          </div>
                        )}
                        {job.errorMessage && (
                          <div className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {job.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(job.status)}
                      
                      {/* Action buttons based on status */}
                      {job.status === "success" && (
                        <div className="flex gap-2">
                          {(job.type === "forecast" || job.type === "optimization") ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResult(job)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View Result
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(job)}
                              className="flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              View Details
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {job.status === "failed" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(job)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(job)}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Retry
                          </Button>
                        </div>
                      )}
                      
                      {job.status === "in_progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(job)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;