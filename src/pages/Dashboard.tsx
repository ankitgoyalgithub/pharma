import { ModuleTile } from "@/components/ModuleTile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Package, 
  Factory, 
  Calendar, 
  Boxes, 
  DollarSign, 
  Building2, 
  FileSpreadsheet, 
  Database,
  BarChart3,
  Search,
  Sparkles,
  ShoppingCart,
  Truck,
  Target,
  Users,
  Clock,
  Eye,
  Copy
} from "lucide-react";

// Sample past studies data
const pastStudies = [
  {
    id: 1,
    title: "Q3 Demand Forecasting Analysis",
    description: "Machine learning demand prediction for electronics division",
    module: "Demand Forecasting",
    createdDate: "2024-01-15",
    status: "Completed",
    accuracy: "87%"
  },
  {
    id: 2,
    title: "Supply Chain Optimization Study",
    description: "End-to-end supply chain analysis for cost reduction",
    module: "Production Planning", 
    createdDate: "2024-01-10",
    status: "Completed",
    accuracy: "92%"
  },
  {
    id: 3,
    title: "CAPEX Budget Planning FY25",
    description: "Strategic capital expenditure planning and allocation",
    module: "CAPEX Planning",
    createdDate: "2024-01-08",
    status: "In Progress",
    accuracy: "N/A"
  },
  {
    id: 4,
    title: "Inventory Optimization - Warehouse Network",
    description: "Multi-location inventory level optimization",
    module: "Inventory Optimisation",
    createdDate: "2024-01-05",
    status: "Completed",
    accuracy: "85%"
  }
];

// Supply Chain modules (8)
const supplyChainModules = [
  {
    title: "Demand Forecasting",
    description: "Predict future demand using advanced ML models",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Operations" as const,
    recentlyUsed: true,
    route: "/demand-forecasting"
  },
  {
    title: "Inventory Optimisation", 
    description: "Optimize stock levels across all locations",
    icon: <Package className="w-6 h-6" />,
    category: "Operations" as const,
    recentlyUsed: true,
    route: "/inventory-optimization"
  },
  {
    title: "Replenishment Planning", 
    description: "Optimize replenishment across warehouses and nodes",
    icon: <Package className="w-6 h-6" />,
    category: "Operations" as const,
    recentlyUsed: true,
    route: "/replenishment-planning"
  },
  {
    title: "Production Planning",
    description: "Convert demand to feasible production volumes", 
    icon: <Factory className="w-6 h-6" />,
    category: "Operations" as const,
    recentlyUsed: true,
    route: "/production-planning"
  },
  {
    title: "Detailed Production Scheduling",
    description: "Step-by-step production scheduling with data validation and optimization",
    icon: <Calendar className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/detailed-production-scheduling"
  },
  {
    title: "Raw Material Planning", 
    description: "Reverse BOM planning for material needs",
    icon: <Boxes className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/raw-material-planning"
  },
  {
    title: "Procurement Planning",
    description: "Optimize procurement strategies and supplier management",
    icon: <ShoppingCart className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/procurement-planning"
  },
  {
    title: "First Mile & Mid Mile Optimisation",
    description: "Optimize transportation and logistics networks",
    icon: <Truck className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/logistics-optimization"
  }
];

// Finance modules (9)
const financeModules = [
  {
    title: "OPEX Planning",
    description: "Project and optimize operational expenditure",
    icon: <DollarSign className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/opex-planning"
  },
  {
    title: "CAPEX Planning", 
    description: "Capital budgeting for strategic investments",
    icon: <Building2 className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/capex-planning"
  },
  {
    title: "Financial Planning",
    description: "Integrated financial forecasting and planning",
    icon: <FileSpreadsheet className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/financial-planning"
  },
  {
    title: "Budget Management",
    description: "Track and manage organizational budgets",
    icon: <BarChart3 className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/budget-management"
  },
  {
    title: "Cost Analysis",
    description: "Analyze and optimize cost structures",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/cost-analysis"
  },
  {
    title: "Revenue Planning",
    description: "Strategic revenue forecasting and planning",
    icon: <DollarSign className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/revenue-planning"
  },
  {
    title: "Risk Management",
    description: "Financial risk assessment and mitigation",
    icon: <Users className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/risk-management"
  },
  {
    title: "Investment Analysis",
    description: "Evaluate investment opportunities and ROI",
    icon: <Building2 className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/investment-analysis"
  },
  {
    title: "Cash Flow Management",
    description: "Monitor and optimize cash flow patterns",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Finance" as const,
    route: "/cash-flow"
  }
];

// Pricing modules (2)
const pricingModules = [
  {
    title: "Dynamic Pricing",
    description: "AI-powered dynamic pricing optimization",
    icon: <Target className="w-6 h-6" />,
    category: "Revenue" as const,
    route: "/dynamic-pricing"
  },
  {
    title: "Price Optimization",
    description: "Strategic pricing analysis and optimization",
    icon: <BarChart3 className="w-6 h-6" />,
    category: "Revenue" as const,
    route: "/price-optimization"
  }
];

// ESG modules (6)
const esgModules = [
  {
    title: "Carbon Footprint Tracking",
    description: "Monitor and reduce carbon emissions across operations",
    icon: <Sparkles className="w-6 h-6" />,
    category: "Data" as const,
    route: "/carbon-tracking"
  },
  {
    title: "Sustainability Metrics",
    description: "Track environmental sustainability indicators",
    icon: <Database className="w-6 h-6" />,
    category: "Data" as const,
    route: "/sustainability-metrics"
  },
  {
    title: "ESG Reporting",
    description: "Generate comprehensive ESG compliance reports",
    icon: <FileSpreadsheet className="w-6 h-6" />,
    category: "Data" as const,
    route: "/esg-reporting"
  },
  {
    title: "Waste Management",
    description: "Optimize waste reduction and recycling programs",
    icon: <Package className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/waste-management"
  },
  {
    title: "Energy Optimization",
    description: "Reduce energy consumption and costs",
    icon: <Sparkles className="w-6 h-6" />,
    category: "Operations" as const,
    route: "/energy-optimization"
  },
  {
    title: "Social Impact Analysis",
    description: "Measure and improve social impact initiatives",
    icon: <Users className="w-6 h-6" />,
    category: "Data" as const,
    route: "/social-impact"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleModuleClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  const handleRequestNewStudy = () => {
    // Placeholder for request new study functionality
    console.log("Request new study clicked");
  };

  const allModules = [...supplyChainModules, ...financeModules, ...pricingModules, ...esgModules];
  
  const filteredModules = (modules: typeof allModules) => {
    if (!searchQuery) return modules;
    return modules.filter(module => 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background/50">
      <div className="p-6 space-y-6">
        {/* Modern Header Section */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Select your Study</h1>
          <p className="text-muted-foreground text-base max-w-4xl leading-relaxed">
            All studies are powered by AI Insight Engine. Just add your data - our models handle the rest. No coding or configuration required ⚡
          </p>
        </div>

        {/* Modern Tabs and Search */}
        <div className="flex items-center justify-between">
          <Tabs defaultValue="supply-chain" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground border overflow-hidden">
                <TabsTrigger 
                  value="supply-chain" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Supply Chain ({supplyChainModules.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="finance" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Finance ({financeModules.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Pricing ({pricingModules.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="esg" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  ESG ({esgModules.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="past-studies" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Past Studies ({pastStudies.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search All Studies"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border shadow-sm"
                />
              </div>
            </div>

            {/* Modern Tab Contents */}
            <TabsContent value="supply-chain" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules(supplyChainModules).map((module, index) => (
                  <ModuleTile
                    key={module.title}
                    {...module}
                    onClick={() => handleModuleClick(module.route)}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules(financeModules).map((module, index) => (
                  <ModuleTile
                    key={module.title}
                    {...module}
                    onClick={() => handleModuleClick(module.route)}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules(pricingModules).map((module, index) => (
                  <ModuleTile
                    key={module.title}
                    {...module}
                    onClick={() => handleModuleClick(module.route)}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="esg" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules(esgModules).map((module, index) => (
                  <ModuleTile
                    key={module.title}
                    {...module}
                    onClick={() => handleModuleClick(module.route)}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past-studies" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {pastStudies.map((study, index) => (
                  <Card key={study.id} className="hover:shadow-md transition-all duration-200 bg-card border-border animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground mb-1">
                            {study.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {study.description}
                          </p>
                        </div>
                        <Badge 
                          variant={study.status === "Completed" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {study.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Database className="w-4 h-4 mr-2" />
                          <span>{study.module}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{new Date(study.createdDate).toLocaleDateString()}</span>
                        </div>
                        {study.status === "Completed" && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            <span>Accuracy: {study.accuracy}</span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Copy className="w-4 h-4 mr-2" />
                            Clone Study
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modern Request New Study Section */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Don't see your use case?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Feeling unstructured? We've got you. Throw in any supply chain chaos, wild idea, or vague problem—no need to fit into a box.
                </p>
              </div>
            </div>
            <Button onClick={handleRequestNewStudy} className="bg-primary hover:bg-primary/90 shadow-sm">
              Request a New Study
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}