import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play,
  Eye,
  Settings,
  TrendingUp,
  Users,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Studies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const studies = [
    {
      id: 1,
      name: "Q4 Demand Forecasting Analysis",
      type: "Demand Forecasting",
      status: "completed",
      accuracy: "94.2%",
      createdBy: "Karthik Krishnan",
      createdDate: "2024-01-15",
      lastRun: "2024-01-15",
      runtime: "2m 34s",
      description: "Comprehensive demand analysis for Q4 products across all regions"
    },
    {
      id: 2,
      name: "Production Optimization Study",
      type: "Production Planning",
      status: "running",
      accuracy: "92.1%",
      createdBy: "Ankit Goyal",
      createdDate: "2024-01-12",
      lastRun: "2024-01-14",
      runtime: "4m 12s",
      description: "Optimizing production schedules for maximum efficiency"
    },
    {
      id: 3,
      name: "Inventory Level Analysis",
      type: "Inventory Optimization",
      status: "completed",
      accuracy: "89.8%",
      createdBy: "Pooja R",
      createdDate: "2024-01-10",
      lastRun: "2024-01-13",
      runtime: "1m 45s",
      description: "Analysis of optimal inventory levels across warehouses"
    },
    {
      id: 4,
      name: "Supply Chain Risk Assessment",
      type: "Risk Management",
      status: "failed",
      accuracy: "91.5%",
      createdBy: "Raj Kumar",
      createdDate: "2024-01-08",
      lastRun: "2024-01-12",
      runtime: "3m 21s",
      description: "Comprehensive risk analysis for supply chain vulnerabilities"
    },
    {
      id: 5,
      name: "Procurement Planning Study",
      type: "Procurement Planning",
      status: "draft",
      accuracy: "-",
      createdBy: "Karthik Krishnan",
      createdDate: "2024-01-16",
      lastRun: "-",
      runtime: "-",
      description: "Strategic procurement planning for next quarter"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "running": return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "draft": return <Settings className="w-4 h-4 text-muted-foreground" />;
      default: return <Settings className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-success/10 text-success border-success/20",
      running: "bg-warning/10 text-warning border-warning/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      draft: "bg-muted text-muted-foreground border-border"
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const handleCreateStudy = () => {
    navigate("/demand-forecasting");
  };

  const handleRunStudy = (studyId: number) => {
    console.log(`Running study ${studyId}`);
  };

  const handleViewStudy = (studyId: number) => {
    navigate("/demand-forecasting");
  };

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || study.status === statusFilter;
    const matchesType = typeFilter === "all" || study.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Studies</h1>
          <p className="text-muted-foreground">Manage and monitor your analytical studies</p>
        </div>
        <Button onClick={handleCreateStudy} className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Create New Study
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Studies</p>
                <p className="text-2xl font-bold text-foreground">{studies.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {studies.filter(s => s.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-warning">
                  {studies.filter(s => s.status === "running").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold text-primary">92.1%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search studies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Demand Forecasting">Demand Forecasting</SelectItem>
            <SelectItem value="Production Planning">Production Planning</SelectItem>
            <SelectItem value="Inventory Optimization">Inventory Optimization</SelectItem>
            <SelectItem value="Risk Management">Risk Management</SelectItem>
            <SelectItem value="Procurement Planning">Procurement Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Studies Grid */}
      <div className="grid gap-4">
        {filteredStudies.map((study) => (
          <Card key={study.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(study.status)}
                    <h3 className="text-lg font-semibold text-foreground">{study.name}</h3>
                    <Badge className={getStatusBadge(study.status)}>
                      {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{study.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {study.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {study.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {study.createdDate}
                    </div>
                    {study.accuracy !== "-" && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {study.accuracy}
                      </div>
                    )}
                    {study.runtime !== "-" && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {study.runtime}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {study.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                  {(study.status === "completed" || study.status === "draft") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunStudy(study.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                  )}
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleViewStudy(study.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No studies found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first study"
            }
          </p>
          {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
            <Button onClick={handleCreateStudy}>
              <Plus className="w-4 h-4 mr-2" />
              Create Study
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Studies;