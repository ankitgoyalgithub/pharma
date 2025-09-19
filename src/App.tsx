import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { StepperProvider } from "./contexts/StepperContext";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

import DemandForecasting from "./pages/DemandForecasting";
import InventoryOptimization from "./pages/InventoryOptimization";
import ReplenishmentPlanning from "./pages/ReplenishmentPlanning";
import OpexPlanning from "./pages/OpexPlanning";
import Foundry from "./pages/Foundry";
import Jobs from "./pages/Jobs";
import AddLookupPage from "./pages/AddLookupPage";
import EntityPreview from "./pages/EntityPreview";
import DetailedProductionScheduling from "./pages/DetailedProductionScheduling";
import ProcurementPlanning from "./pages/ProcurementPlanning";
import Workflows from "./pages/Workflows";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import WorkflowMonitor from "./pages/WorkflowMonitor";
import WorkflowRun from "./pages/WorkflowRun";
import Build from "./pages/Build";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProductionPlanning from "./pages/ProductionPlanning";
import RawMaterialPlanning from "./pages/RawMaterialPlanning";
import FirstMidMileOptimization from "./pages/FirstMidMileOptimization";
import CapexPlanning from "./pages/CapexPlanning";
import ProjectPrioritization from "./pages/ProjectPrioritization";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StepperProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Analytics />} />
            <Route path="study" element={<Dashboard />} />
            
            <Route path="foundry" element={<Foundry />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="/data-jobs" element={<Jobs />} />
            <Route path="/add-lookup" element={<AddLookupPage />} />
            <Route path="/entity-preview/:entityName" element={<EntityPreview />} />
            <Route path="demand-forecasting" element={<DemandForecasting />} />
            <Route path="inventory-optimization" element={<InventoryOptimization />} />
            <Route path="replenishment-planning" element={<ReplenishmentPlanning />} />
            <Route path="production-planning" element={<ProductionPlanning />} />
            <Route path="raw-material-planning" element={<RawMaterialPlanning />} />
            <Route path="logistics-optimization" element={<FirstMidMileOptimization />} />
            <Route path="opex-planning" element={<OpexPlanning />} />
            <Route path="capex-planning" element={<CapexPlanning />} />
            <Route path="project-prioritization" element={<ProjectPrioritization />} />
            <Route path="detailed-production-scheduling" element={<DetailedProductionScheduling />} />
            <Route path="procurement-planning" element={<ProcurementPlanning />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="workflow-builder" element={<WorkflowBuilder />} />
            <Route path="workflow-monitor" element={<WorkflowMonitor />} />
            <Route path="workflow-run" element={<WorkflowRun />} />
            <Route path="build" element={<Build />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<Billing />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </StepperProvider>
  </QueryClientProvider>
);

export default App;
