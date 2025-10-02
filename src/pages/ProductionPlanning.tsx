
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  FileText,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Search,
  AlertCircle,
  Settings,
  Share,
  MoreHorizontal,
  Award,
  Factory,
  Timer,
  Wrench,
  MessageCircle,
  Filter,
  Wand2,
  X,
  Info,
  Upload,
  Database,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { GradientSwitch } from "@/components/ui/gradient-switch";
import { useStepper } from "@/hooks/useStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { MapFromFoundryDialog } from "@/components/MapFromFoundryDialog";
import { getExternalDrivers } from "@/data/demandForecasting/externalDrivers";
import { ExternalDriversSection } from "@/components/ExternalDriversSection";

// --- Chart.js for utilization / summary charts ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// --- Google Charts Timeline ---
import { Chart } from "react-google-charts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTooltip,
  ChartLegend,
  Filler,
  Title
);

/** --------------------
 * In-file Planning Workbook
 * A compact, relevant table for production planning.
 * --------------------*/
function PlanningWorkbook({ rows, height }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const t = q.toLowerCase();
    return rows.filter(r =>
      (r.order || "").toLowerCase().includes(t) ||
      (r.product || "").toLowerCase().includes(t) ||
      (r.operation || "").toLowerCase().includes(t) ||
      (r.workCenter || "").toLowerCase().includes(t) ||
      (r.status || "").toLowerCase().includes(t) ||
      (r.priority || "").toLowerCase().includes(t)
    );
  }, [q, rows]);

  const fmt = (d) => {
    try {
      return new Date(d).toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    } catch {
      return "";
    }
  };

  const chip = (text, type) => {
    const base = "px-2 py-0.5 rounded-full text-[11px] font-medium";
    if (type === "priority") {
      const map = { High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-emerald-100 text-emerald-700" };
      return <span className={`${base} ${map[text] || "bg-muted text-foreground"}`}>{text}</span>;
    }
    if (type === "status") {
      const map = { "In Progress": "bg-blue-100 text-blue-700", Planned: "bg-slate-100 text-slate-700", Risk: "bg-amber-100 text-amber-700", Done: "bg-emerald-100 text-emerald-700" };
      return <span className={`${base} ${map[text] || "bg-muted text-foreground"}`}>{text}</span>;
    }
    return <span className={base}>{text}</span>;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">Rows: <span className="font-medium">{filtered.length}</span></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search WO, product, WC, status…" className="pl-9 h-8 w-64" />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="max-w-full overflow-x-auto" style={{ maxHeight: height || 420, overflowY: "auto" }}>
          <table className="min-w-[1080px] w-full text-xs">
            <thead className="sticky top-16 z-10 bg-muted/60 backdrop-blur">
              <tr className="border-b">
                <th className="text-left px-3 py-2">WO</th>
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">Op Seq</th>
                <th className="text-left px-3 py-2">Operation</th>
                <th className="text-left px-3 py-2">Work Center</th>
                <th className="text-right px-3 py-2">Qty</th>
                <th className="text-right px-3 py-2">Setup (h)</th>
                <th className="text-right px-3 py-2">Run (h)</th>
                <th className="text-left px-3 py-2">Start</th>
                <th className="text-left px-3 py-2">End</th>
                <th className="text-left px-3 py-2">Due</th>
                <th className="text-left px-3 py-2">Priority</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Depends</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{r.order}</td>
                  <td className="px-3 py-2">{r.product}</td>
                  <td className="px-3 py-2">{r.opSeq}</td>
                  <td className="px-3 py-2">{r.operation}</td>
                  <td className="px-3 py-2">{r.workCenter}</td>
                  <td className="px-3 py-2 text-right">{r.qty.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.setupHrs}</td>
                  <td className="px-3 py-2 text-right">{r.runHrs}</td>
                  <td className="px-3 py-2">{fmt(r.start)}</td>
                  <td className="px-3 py-2">{fmt(r.end)}</td>
                  <td className="px-3 py-2">{fmt(r.due)}</td>
                  <td className="px-3 py-2">{chip(r.priority, "priority")}</td>
                  <td className="px-3 py-2">{chip(r.status, "status")}</td>
                  <td className="px-3 py-2">{r.dependsOn || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Seeded production plan rows (drive both workbook + timeline) */
const planOps = [
  // WO-1001
  { order:"WO-1001", product:"Prod-A", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:1200, setupHrs:0.5, runHrs:8, start:"2025-08-01", end:"2025-08-02", due:"2025-08-08", priority:"High",   status:"In Progress", dependsOn:null },
  { order:"WO-1001", product:"Prod-A", opSeq:20, operation:"Machining", workCenter:"Machining", qty:1200, setupHrs:0.5, runHrs:6, start:"2025-08-02", end:"2025-08-03", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1001", product:"Prod-A", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:1200, setupHrs:1.0, runHrs:16,start:"2025-08-03", end:"2025-08-05", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Machining" },
  { order:"WO-1001", product:"Prod-A", opSeq:40, operation:"Painting",  workCenter:"Painting",  qty:1200, setupHrs:0.3, runHrs:8, start:"2025-08-05", end:"2025-08-06", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1001", product:"Prod-A", opSeq:50, operation:"QC",        workCenter:"QC",        qty:1200, setupHrs:0.1, runHrs:4, start:"2025-08-06", end:"2025-08-07", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Painting" },
  { order:"WO-1001", product:"Prod-A", opSeq:60, operation:"Packaging", workCenter:"Packaging", qty:1200, setupHrs:0.2, runHrs:4, start:"2025-08-07", end:"2025-08-08", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"QC" },

  // WO-1002
  { order:"WO-1002", product:"Prod-B", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:800,  setupHrs:0.4, runHrs:6, start:"2025-08-04", end:"2025-08-05", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:null },
  { order:"WO-1002", product:"Prod-B", opSeq:20, operation:"Machining", workCenter:"Machining", qty:800,  setupHrs:0.4, runHrs:6, start:"2025-08-05", end:"2025-08-06", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1002", product:"Prod-B", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:800,  setupHrs:0.6, runHrs:24,start:"2025-08-06", end:"2025-08-09", due:"2025-08-14", priority:"Medium", status:"Risk",        dependsOn:"Machining" },
  { order:"WO-1002", product:"Prod-B", opSeq:40, operation:"QC",        workCenter:"QC",        qty:800,  setupHrs:0.1, runHrs:4, start:"2025-08-09", end:"2025-08-10", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1002", product:"Prod-B", opSeq:50, operation:"Packaging", workCenter:"Packaging", qty:800,  setupHrs:0.2, runHrs:6, start:"2025-08-10", end:"2025-08-11", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"QC" },

  // WO-1003
  { order:"WO-1003", product:"Prod-C", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:600,  setupHrs:0.3, runHrs:5, start:"2025-08-02", end:"2025-08-03", due:"2025-08-12", priority:"Low",    status:"Done",        dependsOn:null },
  { order:"WO-1003", product:"Prod-C", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  qty:600,  setupHrs:0.5, runHrs:12,start:"2025-08-03", end:"2025-08-04", due:"2025-08-12", priority:"Low",    status:"In Progress", dependsOn:"Cutting" },
  { order:"WO-1003", product:"Prod-C", opSeq:30, operation:"QC",        workCenter:"QC",        qty:600,  setupHrs:0.1, runHrs:3, start:"2025-08-04", end:"2025-08-05", due:"2025-08-12", priority:"Low",    status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1003", product:"Prod-C", opSeq:40, operation:"Packaging", workCenter:"Packaging", qty:600,  setupHrs:0.2, runHrs:4, start:"2025-08-05", end:"2025-08-06", due:"2025-08-12", priority:"Low",    status:"Planned",     dependsOn:"QC" },

  // WO-1004
  { order:"WO-1004", product:"Prod-D", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:1500, setupHrs:0.6, runHrs:10,start:"2025-08-06", end:"2025-08-07", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:null },
  { order:"WO-1004", product:"Prod-D", opSeq:20, operation:"Machining", workCenter:"Machining", qty:1500, setupHrs:0.6, runHrs:10,start:"2025-08-07", end:"2025-08-08", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1004", product:"Prod-D", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:1500, setupHrs:0.8, runHrs:24,start:"2025-08-08", end:"2025-08-11", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:"Machining" },
  { order:"WO-1004", product:"Prod-D", opSeq:40, operation:"Painting",  workCenter:"Painting",  qty:1500, setupHrs:0.4, runHrs:12,start:"2025-08-11", end:"2025-08-12", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1004", product:"Prod-D", opSeq:50, operation:"QC",        workCenter:"QC",        qty:1500, setupHrs:0.2, runHrs:6, start:"2025-08-12", end:"2025-08-13", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:"Painting" },
  { order:"WO-1004", product:"Prod-D", opSeq:60, operation:"Packaging", workCenter:"Packaging", qty:1500, setupHrs:0.3, runHrs:8, start:"2025-08-13", end:"2025-08-14", due:"2025-08-18", priority:"High",   status:"Planned",     dependsOn:"QC" },

  // WO-1005
  { order:"WO-1005", product:"Prod-E", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:500,  setupHrs:0.2, runHrs:4, start:"2025-08-07", end:"2025-08-07", due:"2025-08-15", priority:"Low",    status:"Planned",     dependsOn:null },
  { order:"WO-1005", product:"Prod-E", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  qty:500,  setupHrs:0.4, runHrs:8, start:"2025-08-08", end:"2025-08-09", due:"2025-08-15", priority:"Low",    status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1005", product:"Prod-E", opSeq:30, operation:"QC",        workCenter:"QC",        qty:500,  setupHrs:0.1, runHrs:2, start:"2025-08-09", end:"2025-08-10", due:"2025-08-15", priority:"Low",    status:"Planned",     dependsOn:"Assembly" },

  // WO-1006
  { order:"WO-1006", product:"Prod-F", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:900,  setupHrs:0.3, runHrs:6, start:"2025-08-09", end:"2025-08-10", due:"2025-08-20", priority:"Medium", status:"Planned",     dependsOn:null },
  { order:"WO-1006", product:"Prod-F", opSeq:20, operation:"Machining", workCenter:"Machining", qty:900,  setupHrs:0.5, runHrs:7, start:"2025-08-10", end:"2025-08-11", due:"2025-08-20", priority:"Medium", status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1006", product:"Prod-F", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:900,  setupHrs:0.6, runHrs:18,start:"2025-08-11", end:"2025-08-13", due:"2025-08-20", priority:"Medium", status:"Planned",     dependsOn:"Machining" },
  { order:"WO-1006", product:"Prod-F", opSeq:40, operation:"Packaging", workCenter:"Packaging", qty:900,  setupHrs:0.2, runHrs:5, start:"2025-08-13", end:"2025-08-14", due:"2025-08-20", priority:"Medium", status:"Planned",     dependsOn:"Assembly" },

  // WO-1007
  { order:"WO-1007", product:"Prod-G", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:1100, setupHrs:0.5, runHrs:8, start:"2025-08-11", end:"2025-08-12", due:"2025-08-23", priority:"High",   status:"Planned",     dependsOn:null },
  { order:"WO-1007", product:"Prod-G", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  qty:1100, setupHrs:0.7, runHrs:20,start:"2025-08-12", end:"2025-08-14", due:"2025-08-23", priority:"High",   status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1007", product:"Prod-G", opSeq:30, operation:"Painting",  workCenter:"Painting",  qty:1100, setupHrs:0.3, runHrs:10,start:"2025-08-14", end:"2025-08-15", due:"2025-08-23", priority:"High",   status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1007", product:"Prod-G", opSeq:40, operation:"QC",        workCenter:"QC",        qty:1100, setupHrs:0.2, runHrs:5, start:"2025-08-15", end:"2025-08-16", due:"2025-08-23", priority:"High",   status:"Planned",     dependsOn:"Painting" },

  // WO-1008
  { order:"WO-1008", product:"Prod-H", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:700,  setupHrs:0.3, runHrs:5, start:"2025-08-12", end:"2025-08-13", due:"2025-08-24", priority:"Low",    status:"Planned",     dependsOn:null },
  { order:"WO-1008", product:"Prod-H", opSeq:20, operation:"Machining", workCenter:"Machining", qty:700,  setupHrs:0.4, runHrs:6, start:"2025-08-13", end:"2025-08-14", due:"2025-08-24", priority:"Low",    status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1008", product:"Prod-H", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:700,  setupHrs:0.5, runHrs:14,start:"2025-08-14", end:"2025-08-16", due:"2025-08-24", priority:"Low",    status:"Planned",     dependsOn:"Machining" },
  { order:"WO-1008", product:"Prod-H", opSeq:40, operation:"Packaging", workCenter:"Packaging", qty:700,  setupHrs:0.2, runHrs:4, start:"2025-08-16", end:"2025-08-17", due:"2025-08-24", priority:"Low",    status:"Planned",     dependsOn:"Assembly" },

  // WO-1009
  { order:"WO-1009", product:"Prod-I", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:950,  setupHrs:0.4, runHrs:7, start:"2025-08-14", end:"2025-08-15", due:"2025-08-27", priority:"Medium", status:"Planned",     dependsOn:null },
  { order:"WO-1009", product:"Prod-I", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  qty:950,  setupHrs:0.6, runHrs:18,start:"2025-08-15", end:"2025-08-17", due:"2025-08-27", priority:"Medium", status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1009", product:"Prod-I", opSeq:30, operation:"QC",        workCenter:"QC",        qty:950,  setupHrs:0.2, runHrs:5, start:"2025-08-17", end:"2025-08-18", due:"2025-08-27", priority:"Medium", status:"Planned",     dependsOn:"Assembly" },

  // WO-1010
  { order:"WO-1010", product:"Prod-J", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   qty:1050, setupHrs:0.5, runHrs:8, start:"2025-08-16", end:"2025-08-17", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:null },
  { order:"WO-1010", product:"Prod-J", opSeq:20, operation:"Machining", workCenter:"Machining", qty:1050, setupHrs:0.6, runHrs:8, start:"2025-08-17", end:"2025-08-18", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-1010", product:"Prod-J", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  qty:1050, setupHrs:0.7, runHrs:22,start:"2025-08-18", end:"2025-08-20", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:"Machining" },
  { order:"WO-1010", product:"Prod-J", opSeq:40, operation:"Painting",  workCenter:"Painting",  qty:1050, setupHrs:0.3, runHrs:10,start:"2025-08-20", end:"2025-08-21", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-1010", product:"Prod-J", opSeq:50, operation:"QC",        workCenter:"QC",        qty:1050, setupHrs:0.2, runHrs:5, start:"2025-08-21", end:"2025-08-22", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:"Painting" },
  { order:"WO-1010", product:"Prod-J", opSeq:60, operation:"Packaging", workCenter:"Packaging", qty:1050, setupHrs:0.3, runHrs:7, start:"2025-08-22", end:"2025-08-23", due:"2025-08-30", priority:"High",   status:"Planned",     dependsOn:"QC" },
];

/** Colors per Work Center */
const wcColor = {
  Cutting: "#3b82f6",
  Machining: "#6366f1",
  Assembly: "#10b981",
  Painting: "#f59e0b",
  QC: "#ef4444",
  Packaging: "#8b5cf6",
};

const ProductionPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState({
    bom: null, routings: null, workcenters: null, capacity: null, shifts: null, maintenance: null, demand: null, suppliers: null,
  });
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  
  // Foundry mapping modal states
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  const [foundryObjects, setFoundryObjects] = useState<Array<{id: string, name: string, type: 'master' | 'timeseries' | 'featureStore', status: string, dateRange?: string}>>([]);

  const [activeTab, setActiveTab] = useState("overview"); // overview | workcenters | orders | timeline | workbook
  const [horizon, setHorizon] = useState("4 Weeks");
  const [lotSizing, setLotSizing] = useState("L4L (Lot-for-Lot)");
  const [scheduleRule, setScheduleRule] = useState("Forward");
  const [priorityRule, setPriorityRule] = useState("EDD (Earliest Due Date)");
  const [granularity, setGranularity] = useState("daily");

  // Right sidebar state
  const [rightSidebarTab, setRightSidebarTab] = useState<'ai' | 'filter' | 'scenario'>('filter');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);

  // Timeline zoom
  const [viewMode, setViewMode] = useState("Week"); // Day | Week | Month

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? "completed" as const : currentStep === 1 ? "active" as const : "pending" as const },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? "completed" as const : currentStep === 2 ? "active" as const : "pending" as const },
    { id: 3, title: "Review Data", status: currentStep > 3 ? "completed" as const : currentStep === 3 ? "active" as const : "pending" as const },
    { id: 4, title: "Results", status: currentStep === 4 ? "active" as const : "pending" as const },
  ];
  
  const stepperHook = useStepper({
    steps: stepperSteps,
    title: "Production Planning",
    initialStep: currentStep
  });

  const { setOnStepClick } = useStepperContext();

  // Set up step click handler - use a stable reference
  const handleStepClick = useCallback((stepId: number) => {
    // Only allow navigation to completed steps or the next step
    const targetStep = stepperSteps.find(s => s.id === stepId);
    if (targetStep && (targetStep.status === 'completed' || stepId === currentStep + 1 || stepId === currentStep)) {
      setCurrentStep(stepId);
    }
  }, [currentStep]);

  useEffect(() => {
    setOnStepClick(() => handleStepClick);
  }, [handleStepClick, setOnStepClick]);

  // Generate order data from planOps
  const orderData = useMemo(() => {
    const orderMap = new Map();
    planOps.forEach(op => {
      if (!orderMap.has(op.order)) {
        orderMap.set(op.order, {
          order: op.order,
          product: op.product,
          due: op.due,
          priority: op.priority,
          status: op.status,
          qty: op.qty,
          operations: 0,
          totalHours: 0
        });
      }
      const order = orderMap.get(op.order);
      order.operations += 1;
      order.totalHours += op.setupHrs + op.runHrs;
      // Update status to worst case
      if (op.status === "Risk" || order.status !== "Risk") {
        order.status = op.status === "Risk" ? "Risk" : 
                      op.status === "In Progress" ? "In Progress" : order.status;
      }
    });
    return Array.from(orderMap.values()).map(order => ({
      ...order,
      totalHours: Math.round(order.totalHours * 10) / 10
    }));
  }, []);

  // Generate timeline data
  const timelineData = useMemo(() => {
    const header = [
      [
        { type: "string", id: "Row" },
        { type: "string", id: "Name" },
        { type: "date", id: "Start" },
        { type: "date", id: "End" }
      ]
    ];
    
    const rows = planOps.map(op => [
      op.workCenter,
      `${op.operation} (${op.order})`,
      new Date(op.start),
      new Date(op.end)
    ]);
    
    return [...header, ...rows];
  }, []);

  const externalDrivers = [
    { name: "Maintenance Calendar", autoSelected: true, icon: "Settings" },
    { name: "Labor Availability", autoSelected: true, icon: "Factory" },
    { name: "Supplier Lead Times", autoSelected: true, icon: "Timer" },
    { name: "QC/Inspection Slots", autoSelected: false, icon: "Award" },
    { name: "Setup Family Grouping", autoSelected: false, icon: "TrendingUp" },
  ];

  useEffect(() => {
    if (selectedDrivers.length === 0) {
      setSelectedDrivers(externalDrivers.filter(d => d.autoSelected).map(d => d.name));
    }
  }, [selectedDrivers.length]);

  const toggleDriver = (driver) => {
    setSelectedDrivers(prev => prev.includes(driver) ? prev.filter(d => d !== driver) : [...prev, driver]);
  };

  const handleFoundrySubmit = (data: {
    selectedObjects: string[];
    selectedDataType: 'master' | 'timeseries' | 'featureStore';
    fromDate?: Date;
    toDate?: Date;
  }) => {
    // Create new foundry objects
    const newFoundryObjects = data.selectedObjects.map(objName => ({
      id: `foundry_${Date.now()}_${objName}`,
      name: objName,
      type: data.selectedDataType,
      status: 'imported' as const,
      dateRange: data.selectedDataType === 'timeseries' && data.fromDate && data.toDate 
        ? `${format(data.fromDate, "MMM d, yyyy")} - ${format(data.toDate, "MMM d, yyyy")}` 
        : undefined
    }));

    // Add to foundry objects list
    setFoundryObjects(prev => [...prev, ...newFoundryObjects]);
    
    // Set preview to first new object
    if (data.selectedObjects.length > 0) {
      setSelectedPreview(data.selectedObjects[0]);
      setPreviewLoading(true);
      setTimeout(() => setPreviewLoading(false), 700);
    }
  };

  // ---------- STEP 1: Add Data ----------
  const renderStep1 = () => (
    <div className="space-y-6 p-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload BOM, Routings, Work Centers, Capacity, Shifts, Maintenance, Demand/Orders, and Supplier Lead Times.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Upload Planning Data Files</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload your production planning data: BOM, routings, work centers, capacity, and other relevant files. Supported formats: CSV, Excel, JSON.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                // Create and download Excel template
                const link = document.createElement('a');
                link.href = '#'; // This would be the actual template file URL
                link.download = 'production-planning-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
            {" "}with pre-configured sheets (BOM, Routings, Work Centers, Capacity, Demand)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsFoundryModalOpen(true)}>
              <Database className="h-4 w-4 mr-2" />
              Map from Foundry
            </Button>
          </div>
          
          <Input
            id="file-upload"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                const newUploaded = { ...uploadedFiles };
                files.forEach(file => {
                  const name = file.name.toLowerCase();
                  if (name.includes("bom")) newUploaded.bom = file;
                  else if (name.includes("routing") || name.includes("route")) newUploaded.routings = file;
                  else if (name.includes("workcenter") || name.includes("work_center")) newUploaded.workcenters = file;
                  else if (name.includes("capacity")) newUploaded.capacity = file;
                  else if (name.includes("shift")) newUploaded.shifts = file;
                  else if (name.includes("maint")) newUploaded.maintenance = file;
                  else if (name.includes("demand") || name.includes("order")) newUploaded.demand = file;
                  else if (name.includes("supplier") || name.includes("lead")) newUploaded.suppliers = file;
                  else {
                    for (const key of Object.keys(newUploaded)) {
                      if (!newUploaded[key]) { newUploaded[key] = file; break; }
                    }
                  }
                });
                setUploadedFiles(newUploaded);
                const first = Object.keys(newUploaded).find(k => newUploaded[k]);
                if (first) setSelectedPreview(first);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 600);
              }
            }}
          />

          {Object.values(uploadedFiles).some(Boolean) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Data Sources:</h4>
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Uploaded Files</h5>
                <div className="space-y-1">
                  {Object.entries(uploadedFiles).filter(([k, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between p-2 rounded border bg-card">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3 text-blue-600" />
                        <span className="text-foreground">{v.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{k}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, [k]: null }));
                          if (selectedPreview === k) {
                            const remaining = Object.keys(uploadedFiles).find(key => key !== k && uploadedFiles[key]);
                            setSelectedPreview(remaining || null);
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base font-medium text-foreground">AI Suggested Planning Drivers</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>AI-suggested external factors that may influence production planning based on your data characteristics.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {externalDrivers.map((driver) => {
            const isSelected = selectedDrivers.includes(driver.name);
            
            return (
            <div
              key={driver.name}
              className="flex items-center justify-between p-3 rounded-lg border bg-card transition-colors hover:bg-accent/50 cursor-pointer"
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => toggleDriver(driver.name)}
              >
                {driver.icon === "Factory" && <Factory className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Timer" && <Timer className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Settings" && <Settings className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "TrendingUp" && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                {driver.icon === "Award" && <Award className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">{driver.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-1 h-6 text-xs"
                    onClick={() => {
                      setSelectedPreview(driver.name);
                      setPreviewLoading(true);
                      setTimeout(() => setPreviewLoading(false), 700);
                    }}
                  >
                    Preview
                  </Button>
                )}
                <GradientSwitch 
                  checked={isSelected} 
                />
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {(Object.values(uploadedFiles).some(Boolean) || selectedDrivers.length > 0) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 flex-wrap">
                   {Object.keys(uploadedFiles)
                     .filter(k => uploadedFiles[k])
                     .map(k => (
                       <Button
                         key={k}
                         size="sm"
                         variant={selectedPreview === k ? "default" : "outline"}
                         onClick={() => {
                           setSelectedPreview(k);
                           setPreviewLoading(true);
                           setTimeout(() => setPreviewLoading(false), 500);
                         }}
                       >
                         <FileText className="h-3 w-3 mr-1" />
                         {k}
                       </Button>
                     ))}
                   {foundryObjects.map((obj, index) => (
                     <Button
                       key={obj.name}
                       size="sm"
                       variant={selectedPreview === obj.name ? "default" : "outline"}
                       onClick={() => {
                         setSelectedPreview(obj.name);
                         setPreviewLoading(true);
                         setTimeout(() => setPreviewLoading(false), 500);
                       }}
                     >
                       <Database className="h-3 w-3 mr-1" />
                       {obj.name.split('_')[0]}
                     </Button>
                   ))}
                   {selectedDrivers.map((driver, index) => (
                    <Button
                      key={driver}
                      size="sm"
                      variant={selectedPreview === driver ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(driver);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      {driver}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full border-2 border-border border-t-transparent animate-spin" aria-label="Loading preview" />
              </div>
            ) : (
              <>
                {selectedPreview ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      {selectedDrivers.includes(selectedPreview) ? (
                        <Wand2 className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {selectedPreview}
                    </p>
                    {selectedDrivers.includes(selectedPreview) ? (
                      // External driver preview
                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground">
                          External planning factor data preview:
                        </div>
                        <table className="min-w-full text-xs border border-border rounded">
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              <th className="text-left px-3 py-2">Date</th>
                              <th className="text-left px-3 py-2">Factor</th>
                              <th className="text-left px-3 py-2">Value</th>
                              <th className="text-left px-3 py-2">Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-muted/20">
                              <td className="px-3 py-2">2024-08-01</td>
                              <td className="px-3 py-2">{selectedPreview}</td>
                              <td className="px-3 py-2">85%</td>
                              <td className="px-3 py-2">+12%</td>
                            </tr>
                            <tr className="hover:bg-muted/20">
                              <td className="px-3 py-2">2024-08-15</td>
                              <td className="px-3 py-2">{selectedPreview}</td>
                              <td className="px-3 py-2">92%</td>
                              <td className="px-3 py-2">+18%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      // File preview
                      <table className="min-w-full text-xs border border-border rounded">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2">Code</th>
                            <th className="text-left px-3 py-2">Description</th>
                            <th className="text-left px-3 py-2">Attribute 1</th>
                            <th className="text-left px-3 py-2">Attribute 2</th>
                            <th className="text-left px-3 py-2">Attribute 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2">WCN-01</td>
                            <td className="px-3 py-2">Cutting Station</td>
                            <td className="px-3 py-2">Capacity: 8h</td>
                            <td className="px-3 py-2">Shift A</td>
                            <td className="px-3 py-2">Setup: 30min</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2">WCN-02</td>
                            <td className="px-3 py-2">Assembly Line</td>
                            <td className="px-3 py-2">Capacity: 10h</td>
                            <td className="px-3 py-2">Shift B</td>
                            <td className="px-3 py-2">Setup: 20min</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2">WCN-03</td>
                            <td className="px-3 py-2">Quality Control</td>
                            <td className="px-3 py-2">Capacity: 6h</td>
                            <td className="px-3 py-2">Shift A</td>
                            <td className="px-3 py-2">Setup: 10min</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a file or driver to preview.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => setCurrentStep(2)}>
          Continue to Data Gaps →
        </Button>
      </div>
    </div>
  );

  // ---------- STEP 2: Data Gaps ----------
  const gapKPIs = [
    { label: "Completeness", value: "96.8%", icon: CheckCircle },
    { label: "Missing Routings", value: "3", icon: AlertCircle },
    { label: "Invalid BOM Links", value: "5", icon: AlertCircle },
    { label: "Capacity Conflicts", value: "2", icon: Timer },
  ];

  const wcUtilData = {
    labels: ["Cutting", "Assembly", "Painting", "QC"],
    datasets: [
      {
        label: "Utilization %",
        data: [72, 86, 64, 55],
        backgroundColor: hslVar("--primary", 0.5),
        borderColor: hslVar("--primary"),
        borderWidth: 1,
      },
    ],
  };

  const wcUtilOptions = buildChartOptions({
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
    },
    plugins: { legend: { display: false } },
  });

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detected structural and capacity issues; review and auto-fix.</p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gapKPIs.map((k, idx) => (
          <Card key={idx} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="w-4 h-4" />
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
              <div className="text-2xl font-bold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Work Center Utilization (Detected)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={wcUtilData} options={wcUtilOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Orders without complete routing (missing operation or duration)</li>
              <li>Components missing or mismatched between BOM and routing</li>
              <li>Capacity exceeds shift hours on WC-02 for 12–13 Aug</li>
              <li>Maintenance overlap on WC-03 causing delays</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => setCurrentStep(3)}>
          Continue to Review →
        </Button>
      </div>
    </div>
  );

  // ---------- STEP 3: Review Data ----------
  const wcCapacitySummary = [
    { wc: "Cutting", availableHrs: 48, requiredHrs: 36, utilization: 75 },
    { wc: "Assembly", availableHrs: 48, requiredHrs: 44, utilization: 92 },
    { wc: "Painting", availableHrs: 48, requiredHrs: 30, utilization: 63 },
    { wc: "QC", availableHrs: 48, requiredHrs: 28, utilization: 58 },
  ];

  const utilBarData = {
    labels: wcCapacitySummary.map((w) => w.wc),
    datasets: [
      {
        label: "Utilization %",
        data: wcCapacitySummary.map((w) => w.utilization),
        backgroundColor: "rgba(16,185,129,0.5)",
        borderColor: "rgba(16,185,129,1)",
      },
    ],
  };

  const utilBarOptions = buildChartOptions({
    scales: { y: { beginAtZero: true, max: 100 } },
    plugins: { legend: { position: "bottom" } },
  });

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Review capacity, utilization and configuration before creating a plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Model Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Planning Horizon</div>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                    <SelectItem value="4 Weeks">4 Weeks</SelectItem>
                    <SelectItem value="8 Weeks">8 Weeks</SelectItem>
                    <SelectItem value="12 Weeks">12 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Granularity</div>
                <ToggleGroup type="single" value={granularity} onValueChange={(v) => v && setGranularity(v)}>
                  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Lot Sizing</div>
                <Select value={lotSizing} onValueChange={setLotSizing}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L4L (Lot-for-Lot)">L4L (Lot-for-Lot)</SelectItem>
                    <SelectItem value="FOQ (Fixed Order Qty)">FOQ (Fixed Order Qty)</SelectItem>
                    <SelectItem value="EOQ (Economic Order Qty)">EOQ (Economic Order Qty)</SelectItem>
                    <SelectItem value="Period Order Qty">Period Order Qty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Scheduling Rule</div>
                <Select value={scheduleRule} onValueChange={setScheduleRule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Forward">Forward</SelectItem>
                    <SelectItem value="Backward">Backward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Priority Rule</div>
                <Select value={priorityRule} onValueChange={setPriorityRule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDD (Earliest Due Date)">EDD (Earliest Due Date)</SelectItem>
                    <SelectItem value="SPT (Shortest Proc. Time)">SPT (Shortest Proc. Time)</SelectItem>
                    <SelectItem value="LPT (Longest Proc. Time)">LPT (Longest Proc. Time)</SelectItem>
                    <SelectItem value="CR (Critical Ratio)">CR (Critical Ratio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Capacity Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground">Work Center</th>
                    <th className="text-right py-2 px-2 text-muted-foreground">Available (hrs)</th>
                    <th className="text-right py-2 px-2 text-muted-foreground">Required (hrs)</th>
                    <th className="text-right py-2 px-2 text-muted-foreground">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {wcCapacitySummary.map((w, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="py-2 px-2">{w.wc}</td>
                      <td className="py-2 px-2 text-right">{w.availableHrs}</td>
                      <td className="py-2 px-2 text-right">{w.requiredHrs}</td>
                      <td className="py-2 px-2 text-right">
                        <Badge variant="secondary" className={w.utilization > 90 ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}>
                          {w.utilization}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Utilization Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Bar data={utilBarData} options={utilBarOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Preview</CardTitle></CardHeader>
        <CardContent>
          <PlanningWorkbook rows={planOps.slice(0, 12)} height={280} />
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => setCurrentStep(4)}>
          Build Plan →
        </Button>
      </div>
    </div>
  );

  // ---------- STEP 4: RESULTS with Timeline (derived from planOps) ----------

  const timelineColumns = [
    { type: "string", id: "Task ID" },
    { type: "string", id: "Task Name" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ] as any;

  const timelineRows = useMemo(() => {
    if (!planOps || !Array.isArray(planOps)) return [];
    return planOps.map((ev) => {
      const color = wcColor[ev.workCenter] || "#64748b";
      const tooltip = `
        <div style="padding:8px 10px;font-family:Inter,system-ui,sans-serif;font-size:12px">
          <div style="font-weight:600;margin-bottom:4px">${ev.order} — ${ev.opSeq} ${ev.operation}</div>
          <div><b>Product:</b> ${ev.product}</div>
          <div><b>Qty:</b> ${ev.qty.toLocaleString()}</div>
          <div><b>From:</b> ${new Date(ev.start).toDateString()}</div>
          <div><b>To:</b> ${new Date(ev.end).toDateString()}</div>
          <div><b>Work Center:</b> ${ev.workCenter}</div>
          ${ev.dependsOn ? `<div><b>Depends on:</b> ${ev.dependsOn}</div>` : ""}
        </div>
      `;
      return [`${ev.order}-${ev.opSeq}`, `${ev.operation} (${ev.workCenter})`, new Date(ev.start), new Date(ev.end)];
    });
  }, []);

  const uniqueOrders = useMemo(() => Array.from(new Set(planOps.map(e => e.order))), []);

  const heightPx = useMemo(() => {
    const base = 60;
    const perRow = 44;
    return base + uniqueOrders.length * perRow;
  }, [uniqueOrders]);

  const axisBounds = useMemo(() => {
    const starts = planOps.map(e => new Date(e.start).getTime());
    const ends = planOps.map(e => new Date(e.end).getTime());
    let min = new Date(Math.min(...starts));
    let max = new Date(Math.max(...ends));
    const pad = (d, days) => new Date(d.getTime() + days * 24 * 3600 * 1000);
    if (viewMode === "Day") { min = pad(min, -1); max = pad(max, 1); }
    else if (viewMode === "Week") { min = pad(min, -3); max = pad(max, 3); }
    else { min = pad(min, -10); max = pad(max, 10); }
    return { min, max };
  }, [viewMode]);

  const timelineOptions = useMemo(() => ({
    timeline: { groupByRowLabel: true, showBarLabels: true, barLabelStyle: { fontSize: 11 }, rowLabelStyle: { fontSize: 11 } },
    hAxis: { minValue: axisBounds.min, maxValue: axisBounds.max },
    tooltip: { isHtml: true },
    avoidOverlappingGridLines: true,
    backgroundColor: "transparent",
    chartArea: { left: 120, top: 24, right: 16, height: "80%" },
  }), [axisBounds]);

  const kpiCards = [
    { label: "TOTAL ORDERS", value: String(uniqueOrders.length), icon: Factory },
    { label: "AVG UTILIZATION", value: "81%", icon: TrendingUp },
    { label: "LATE ORDERS", value: "2", icon: AlertCircle },
    { label: "SETUP TIME SAVED", value: "3.2h", icon: Wrench },
  ];

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-108px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar with Clickable Cards */}
        <div className="w-80 bg-card border-r p-6 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Production Plan</h2>
            <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
          </div>

          {/* Clickable Metric Cards */}
          <div className="space-y-4">
            <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "overview" ? "ring-2 ring-blue-400/30" : ""}`} onClick={() => setActiveTab("overview")}>
              <div><p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{kpiCards[0].label}</p><p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{kpiCards[0].value}</p><p className="text-xs text-blue-600 dark:text-blue-400">current horizon</p></div>
            </Card>

            <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "workcenters" ? "ring-2 ring-emerald-400/30" : ""}`} onClick={() => setActiveTab("workcenters")}>
              <div><p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{kpiCards[1].label}</p><p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{kpiCards[1].value}</p><p className="text-xs text-emerald-600 dark:text-emerald-400">utilization</p></div>
            </Card>

            <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "orders" ? "ring-2 ring-amber-400/30" : ""}`} onClick={() => setActiveTab("orders")}>
              <div><p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{kpiCards[2].label}</p><p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{kpiCards[2].value}</p><p className="text-xs text-amber-600 dark:text-amber-400">risk monitor</p></div>
            </Card>

            <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "workbook" ? "ring-2 ring-purple-400/30" : ""}`} onClick={() => setActiveTab("workbook")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">WORKBOOK</p>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">Data Table</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Interactive planning data</p>
                </div>
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </Card>

            <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "timeline" ? "ring-2 ring-indigo-400/30" : ""}`} onClick={() => setActiveTab("timeline")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">TIMELINE</p>
                  <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Gantt View</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">Visual schedule</p>
                </div>
                <Timer className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Production Overview</h3>
              
              {/* KPI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                      </div>
                      <kpi.icon className="w-8 h-8 text-primary" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Work Center Utilization Chart */}
              <Card className="p-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle>Work Center Utilization</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ["Cutting", "Machining", "Assembly", "Painting", "QC", "Packaging"],
                        datasets: [{
                          label: "Current Utilization (%)",
                          data: [85, 92, 78, 68, 55, 72],
                          backgroundColor: [
                            hslVar('--primary', 0.8),
                            hslVar('--success', 0.8),
                            hslVar('--warning', 0.8),
                            hslVar('--destructive', 0.8),
                            hslVar('--info', 0.8),
                            hslVar('--secondary', 0.8)
                          ],
                          borderColor: [
                            hslVar('--primary'),
                            hslVar('--success'),
                            hslVar('--warning'),
                            hslVar('--destructive'),
                            hslVar('--info'),
                            hslVar('--secondary')
                          ],
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        ...buildChartOptions(),
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: { display: true, text: 'Utilization (%)' }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "workcenters" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Work Center Analysis</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(wcColor).map(([wc, color]) => {
                  const wcOps = planOps.filter(op => op.workCenter === wc);
                  const totalHours = wcOps.reduce((sum, op) => sum + op.setupHrs + op.runHrs, 0);
                  const avgUtilization = Math.round(60 + Math.random() * 30);
                  
                  return (
                    <Card key={wc} className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
                        <h4 className="text-lg font-semibold">{wc}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operations</span>
                          <span className="font-medium">{wcOps.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Hours</span>
                          <span className="font-medium">{totalHours.toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Utilization</span>
                          <span className="font-medium">{avgUtilization}%</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Work Order Details</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {orderData.map((wo, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold">{wo.order}</h4>
                        <Badge variant={wo.status === "Risk" ? "destructive" : wo.status === "In Progress" ? "default" : "secondary"}>
                          {wo.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Due: {wo.due}</p>
                        <p className="text-sm text-muted-foreground">Priority: {wo.priority}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Product</p>
                        <p className="font-medium">{wo.product}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{wo.qty?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Operations</p>
                        <p className="font-medium">{wo.operations}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Hours</p>
                        <p className="font-medium">{wo.totalHours}h</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "workbook" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Planning Workbook</h3>
              <PlanningWorkbook rows={planOps} height={600} />
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Production Timeline</h3>
              
              <Card className="p-6">
                <CardHeader className="px-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Gantt Chart</CardTitle>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">View:</label>
                      <Select value={viewMode} onValueChange={setViewMode}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Week">Week</SelectItem>
                          <SelectItem value="Month">Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="border rounded-lg overflow-hidden">
                    <Chart
                      chartType="Timeline"
                      data={timelineData}
                      options={timelineOptions}
                      width="100%"
                      height={`${heightPx}px`}
                      loader={<div className="p-6 text-sm text-muted-foreground">Loading timeline…</div>}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`${rightSidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-l p-4 flex flex-col h-[calc(100vh-108px)] max-h-screen transition-all duration-200`}>
        {rightSidebarCollapsed ? (
          /* Collapsed Sidebar - Icons Only */
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('ai');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'ai' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Ask AI"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('filter');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'filter' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Filter"
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRightSidebarTab('scenario');
                setRightSidebarCollapsed(false);
              }}
              className={`w-10 h-10 ${rightSidebarTab === 'scenario' ? 'bg-primary text-primary-foreground' : ''}`}
              title="Optimize"
            >
              <Wand2 className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          /* Expanded Sidebar */
          <>
            {/* Header */}
            <div className="flex-none mb-4">
              <div className="flex items-center justify-between mb-4">
                {/* Tab icons always visible */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={rightSidebarTab === 'ai' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setRightSidebarTab('ai')}
                    className="w-8 h-8"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={rightSidebarTab === 'filter' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setRightSidebarTab('filter')}
                    className="w-8 h-8"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={rightSidebarTab === 'scenario' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setRightSidebarTab('scenario')}
                    className="w-8 h-8"
                  >
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightSidebarCollapsed(true)}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {rightSidebarTab === 'ai' && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Ask questions about your production plan</p>
                  </div>
                </div>
              )}

              {rightSidebarTab === 'filter' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Work Center
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select work center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Work Centers</SelectItem>
                        <SelectItem value="cutting">Cutting</SelectItem>
                        <SelectItem value="machining">Machining</SelectItem>
                        <SelectItem value="assembly">Assembly</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="qc">Quality Control</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Priority
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Status
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="risk">At Risk</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      Apply Filters
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {rightSidebarTab === 'scenario' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Optimization Options</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Factory className="w-4 h-4 mr-2" />
                        Minimize Setup Time
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Timer className="w-4 h-4 mr-2" />
                        Reduce Lead Time
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Maximize Utilization
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
      
      <MapFromFoundryDialog
        isOpen={isFoundryModalOpen}
        onClose={() => setIsFoundryModalOpen(false)}
        onSubmit={handleFoundrySubmit}
      />
    </div>
  );
};

export default ProductionPlanning;