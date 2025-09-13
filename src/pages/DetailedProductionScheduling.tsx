
import React, { useEffect, useMemo, useState } from "react";
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
  Users,
  Activity,
  Percent,
  Package,
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
import { ModernStepper } from "@/components/ModernStepper";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";

// Chart.js
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
import { Bar, Line } from "react-chartjs-2";

// Google Charts Timeline
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
 * Detailed Planning Workbook
 * --------------------*/
function DetailedPlanningWorkbook({ rows, height }: { rows: any[], height?: number }) {
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
      (r.priority || "").toLowerCase().includes(t) ||
      (r.shift || "").toLowerCase().includes(t) ||
      (r.crew || "").toLowerCase().includes(t) ||
      String(r.resource || "").toLowerCase().includes(t)
    );
  }, [q, rows]);

  const fmt = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    } catch {
      return "";
    }
  };

  const chip = (text: string, type: "priority" | "status") => {
    const base = "px-2 py-0.5 rounded-full text-[11px] font-medium";
    if (type === "priority") {
      const map: Record<string,string> = { High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-emerald-100 text-emerald-700" };
      return <span className={`${base} ${map[text] || "bg-muted text-foreground"}`}>{text}</span>;
    }
    if (type === "status") {
      const map: Record<string,string> = { "In Progress": "bg-blue-100 text-blue-700", Planned: "bg-slate-100 text-slate-700", Risk: "bg-amber-100 text-amber-700", Done: "bg-emerald-100 text-emerald-700" };
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
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search WO, product, WC, status, shift, crew…" className="pl-9 h-8 w-72" />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="max-w-full overflow-x-auto" style={{ maxHeight: height || 420, overflowY: "auto" }}>
          <table className="min-w-[1400px] w-full text-xs">
            <thead className="sticky top-16 z-10 bg-muted/60 backdrop-blur">
              <tr className="border-b">
                <th className="text-left px-3 py-2">WO</th>
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">Op Seq</th>
                <th className="text-left px-3 py-2">Operation</th>
                <th className="text-left px-3 py-2">Work Center</th>
                <th className="text-left px-3 py-2">Shift</th>
                <th className="text-left px-3 py-2">Crew</th>
                <th className="text-left px-3 py-2">Resource</th>
                <th className="text-right px-3 py-2">Batch Size</th>
                <th className="text-right px-3 py-2">Qty</th>
                <th className="text-right px-3 py-2">Setup (h)</th>
                <th className="text-right px-3 py-2">Run (h)</th>
                <th className="text-right px-3 py-2">Changeover (min)</th>
                <th className="text-right px-3 py-2">Downtime (min)</th>
                <th className="text-right px-3 py-2">Scrap %</th>
                <th className="text-right px-3 py-2">OEE %</th>
                <th className="text-left px-3 py-2">Start</th>
                <th className="text-left px-3 py-2">End</th>
                <th className="text-left px-3 py-2">Due</th>
                <th className="text-left px-3 py-2">Priority</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Depends</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: any, i: number) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{r.order}</td>
                  <td className="px-3 py-2">{r.product}</td>
                  <td className="px-3 py-2">{r.opSeq}</td>
                  <td className="px-3 py-2">{r.operation}</td>
                  <td className="px-3 py-2">{r.workCenter}</td>
                  <td className="px-3 py-2">{r.shift}</td>
                  <td className="px-3 py-2">{r.crew}</td>
                  <td className="px-3 py-2">{r.resource}</td>
                  <td className="px-3 py-2 text-right">{r.batchSize?.toLocaleString?.() ?? r.batchSize}</td>
                  <td className="px-3 py-2 text-right">{r.qty?.toLocaleString?.() ?? r.qty}</td>
                  <td className="px-3 py-2 text-right">{r.setupHrs}</td>
                  <td className="px-3 py-2 text-right">{r.runHrs}</td>
                  <td className="px-3 py-2 text-right">{r.changeoverMin}</td>
                  <td className="px-3 py-2 text-right">{r.downtimeMin}</td>
                  <td className="px-3 py-2 text-right">{r.scrapPct}</td>
                  <td className="px-3 py-2 text-right">{r.oee}</td>
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

/** Seeded detailed production plan rows */
const detailedOps = [
  // WO-2001
  { order:"WO-2001", product:"Prod-X", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-01", batchSize:300, qty:1200, setupHrs:0.5, runHrs:8,  changeoverMin:15, downtimeMin:20, scrapPct:1.2, oee:86, start:"2025-08-01", end:"2025-08-02", due:"2025-08-08", priority:"High",   status:"In Progress", dependsOn:null },
  { order:"WO-2001", product:"Prod-X", opSeq:20, operation:"Machining", workCenter:"Machining", shift:"A", crew:"Crew-3", resource:"MAC-02", batchSize:300, qty:1200, setupHrs:0.6, runHrs:7,  changeoverMin:18, downtimeMin:15, scrapPct:1.0, oee:88, start:"2025-08-02", end:"2025-08-03", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-2001", product:"Prod-X", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  shift:"B", crew:"Crew-2", resource:"ASM-01", batchSize:200, qty:1200, setupHrs:1.0, runHrs:16, changeoverMin:25, downtimeMin:30, scrapPct:1.5, oee:82, start:"2025-08-03", end:"2025-08-05", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Machining" },
  { order:"WO-2001", product:"Prod-X", opSeq:40, operation:"Painting",  workCenter:"Painting",  shift:"B", crew:"Crew-4", resource:"PNT-01", batchSize:300, qty:1200, setupHrs:0.3, runHrs:8,  changeoverMin:10, downtimeMin:40, scrapPct:0.5, oee:80, start:"2025-08-05", end:"2025-08-06", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-2001", product:"Prod-X", opSeq:50, operation:"QC",        workCenter:"QC",        shift:"C", crew:"Crew-5", resource:"QC-01",  batchSize:300, qty:1200, setupHrs:0.1, runHrs:4,  changeoverMin:5,  downtimeMin:5,  scrapPct:0.2, oee:90, start:"2025-08-06", end:"2025-08-07", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"Painting" },
  { order:"WO-2001", product:"Prod-X", opSeq:60, operation:"Packaging", workCenter:"Packaging", shift:"C", crew:"Crew-6", resource:"PKG-01", batchSize:400, qty:1200, setupHrs:0.2, runHrs:4,  changeoverMin:8,  downtimeMin:6,  scrapPct:0.0, oee:92, start:"2025-08-07", end:"2025-08-08", due:"2025-08-08", priority:"High",   status:"Planned",     dependsOn:"QC" },

  // WO-2002
  { order:"WO-2002", product:"Prod-Y", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-02", batchSize:200, qty:800,  setupHrs:0.4, runHrs:6,  changeoverMin:15, downtimeMin:10, scrapPct:1.1, oee:87, start:"2025-08-04", end:"2025-08-05", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:null },
  { order:"WO-2002", product:"Prod-Y", opSeq:20, operation:"Machining", workCenter:"Machining", shift:"A", crew:"Crew-3", resource:"MAC-01", batchSize:200, qty:800,  setupHrs:0.5, runHrs:6,  changeoverMin:20, downtimeMin:12, scrapPct:0.9, oee:85, start:"2025-08-05", end:"2025-08-06", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"Cutting" },
  { order:"WO-2002", product:"Prod-Y", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  shift:"B", crew:"Crew-2", resource:"ASM-02", batchSize:200, qty:800,  setupHrs:0.6, runHrs:24, changeoverMin:30, downtimeMin:20, scrapPct:1.8, oee:78, start:"2025-08-06", end:"2025-08-09", due:"2025-08-14", priority:"Medium", status:"Risk",        dependsOn:"Machining" },
  { order:"WO-2002", product:"Prod-Y", opSeq:40, operation:"QC",        workCenter:"QC",        shift:"B", crew:"Crew-5", resource:"QC-02",  batchSize:200, qty:800,  setupHrs:0.1, runHrs:4,  changeoverMin:5,  downtimeMin:5,  scrapPct:0.3, oee:91, start:"2025-08-09", end:"2025-08-10", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-2002", product:"Prod-Y", opSeq:50, operation:"Packaging", workCenter:"Packaging", shift:"C", crew:"Crew-6", resource:"PKG-01", batchSize:400, qty:800,  setupHrs:0.2, runHrs:6,  changeoverMin:8,  downtimeMin:6,  scrapPct:0.0, oee:92, start:"2025-08-10", end:"2025-08-11", due:"2025-08-14", priority:"Medium", status:"Planned",     dependsOn:"QC" },

  // WO-2003
  { order:"WO-2003", product:"Prod-Z", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-03", batchSize:300, qty:600,  setupHrs:0.3, runHrs:5,  changeoverMin:12, downtimeMin:8,  scrapPct:0.8, oee:90, start:"2025-08-02", end:"2025-08-03", due:"2025-08-12", priority:"Low",    status:"Done",        dependsOn:null },
  { order:"WO-2003", product:"Prod-Z", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  shift:"A", crew:"Crew-2", resource:"ASM-03", batchSize:200, qty:600,  setupHrs:0.5, runHrs:12, changeoverMin:20, downtimeMin:12, scrapPct:1.4, oee:84, start:"2025-08-03", end:"2025-08-04", due:"2025-08-12", priority:"Low",    status:"In Progress", dependsOn:"Cutting" },
  { order:"WO-2003", product:"Prod-Z", opSeq:30, operation:"QC",        workCenter:"QC",        shift:"B", crew:"Crew-5", resource:"QC-03",  batchSize:200, qty:600,  setupHrs:0.1, runHrs:3,  changeoverMin:5,  downtimeMin:5,  scrapPct:0.1, oee:93, start:"2025-08-04", end:"2025-08-05", due:"2025-08-12", priority:"Low",    status:"Planned",     dependsOn:"Assembly" },
  { order:"WO-2003", product:"Prod-Z", opSeq:40, operation:"Packaging", workCenter:"Packaging", shift:"B", crew:"Crew-6", resource:"PKG-02", batchSize:400, qty:600,  setupHrs:0.2, runHrs:4,  changeoverMin:6,  downtimeMin:3,  scrapPct:0.0, oee:95, start:"2025-08-05", end:"2025-08-06", due:"2025-08-12", priority:"Low",    status:"Planned",     dependsOn:"QC" },

  // Additional orders for richer timeline
  { order:"WO-2004", product:"Prod-A1", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-02", batchSize:250, qty:1500, setupHrs:0.6, runHrs:10, changeoverMin:18, downtimeMin:12, scrapPct:1.0, oee:88, start:"2025-08-06", end:"2025-08-07", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:null },
  { order:"WO-2004", product:"Prod-A1", opSeq:20, operation:"Machining", workCenter:"Machining", shift:"A", crew:"Crew-3", resource:"MAC-03", batchSize:250, qty:1500, setupHrs:0.6, runHrs:10, changeoverMin:22, downtimeMin:20, scrapPct:0.7, oee:86, start:"2025-08-07", end:"2025-08-08", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:"Cutting" },
  { order:"WO-2004", product:"Prod-A1", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  shift:"B", crew:"Crew-2", resource:"ASM-02", batchSize:300, qty:1500, setupHrs:0.8, runHrs:24, changeoverMin:30, downtimeMin:24, scrapPct:1.9, oee:79, start:"2025-08-08", end:"2025-08-11", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:"Machining" },
  { order:"WO-2004", product:"Prod-A1", opSeq:40, operation:"Painting",  workCenter:"Painting",  shift:"B", crew:"Crew-4", resource:"PNT-02", batchSize:300, qty:1500, setupHrs:0.4, runHrs:12, changeoverMin:12, downtimeMin:32, scrapPct:0.6, oee:81, start:"2025-08-11", end:"2025-08-12", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:"Assembly" },
  { order:"WO-2004", product:"Prod-A1", opSeq:50, operation:"QC",        workCenter:"QC",        shift:"C", crew:"Crew-5", resource:"QC-01",  batchSize:300, qty:1500, setupHrs:0.2, runHrs:6,  changeoverMin:6,  downtimeMin:4,  scrapPct:0.2, oee:92, start:"2025-08-12", end:"2025-08-13", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:"Painting" },
  { order:"WO-2004", product:"Prod-A1", opSeq:60, operation:"Packaging", workCenter:"Packaging", shift:"C", crew:"Crew-6", resource:"PKG-03", batchSize:500, qty:1500, setupHrs:0.3, runHrs:8,  changeoverMin:10, downtimeMin:6,  scrapPct:0.0, oee:93, start:"2025-08-13", end:"2025-08-14", due:"2025-08-18", priority:"High",   status:"Planned", dependsOn:"QC" },

  // WO-2005
  { order:"WO-2005", product:"Prod-B1", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-03", batchSize:300, qty:500,  setupHrs:0.2, runHrs:4,  changeoverMin:10, downtimeMin:6,  scrapPct:0.9, oee:89, start:"2025-08-07", end:"2025-08-07", due:"2025-08-15", priority:"Low",    status:"Planned", dependsOn:null },
  { order:"WO-2005", product:"Prod-B1", opSeq:20, operation:"Assembly",  workCenter:"Assembly",  shift:"B", crew:"Crew-2", resource:"ASM-04", batchSize:250, qty:500,  setupHrs:0.4, runHrs:8,  changeoverMin:18, downtimeMin:10, scrapPct:1.2, oee:83, start:"2025-08-08", end:"2025-08-09", due:"2025-08-15", priority:"Low",    status:"Planned", dependsOn:"Cutting" },
  { order:"WO-2005", product:"Prod-B1", opSeq:30, operation:"QC",        workCenter:"QC",        shift:"C", crew:"Crew-5", resource:"QC-03",  batchSize:250, qty:500,  setupHrs:0.1, runHrs:2,  changeoverMin:4,  downtimeMin:3,  scrapPct:0.2, oee:94, start:"2025-08-09", end:"2025-08-10", due:"2025-08-15", priority:"Low",    status:"Planned", dependsOn:"Assembly" },

  // WO-2006
  { order:"WO-2006", product:"Prod-C1", opSeq:10, operation:"Cutting",   workCenter:"Cutting",   shift:"A", crew:"Crew-1", resource:"CUT-01", batchSize:300, qty:900,  setupHrs:0.3, runHrs:6,  changeoverMin:12, downtimeMin:10, scrapPct:0.7, oee:90, start:"2025-08-09", end:"2025-08-10", due:"2025-08-20", priority:"Medium", status:"Planned", dependsOn:null },
  { order:"WO-2006", product:"Prod-C1", opSeq:20, operation:"Machining", workCenter:"Machining", shift:"B", crew:"Crew-3", resource:"MAC-02", batchSize:300, qty:900,  setupHrs:0.5, runHrs:7,  changeoverMin:20, downtimeMin:16, scrapPct:0.9, oee:86, start:"2025-08-10", end:"2025-08-11", due:"2025-08-20", priority:"Medium", status:"Planned", dependsOn:"Cutting" },
  { order:"WO-2006", product:"Prod-C1", opSeq:30, operation:"Assembly",  workCenter:"Assembly",  shift:"B", crew:"Crew-2", resource:"ASM-01", batchSize:300, qty:900,  setupHrs:0.6, runHrs:18, changeoverMin:24, downtimeMin:18, scrapPct:1.6, oee:80, start:"2025-08-11", end:"2025-08-13", due:"2025-08-20", priority:"Medium", status:"Planned", dependsOn:"Machining" },
  { order:"WO-2006", product:"Prod-C1", opSeq:40, operation:"Packaging", workCenter:"Packaging", shift:"C", crew:"Crew-6", resource:"PKG-01", batchSize:450, qty:900,  setupHrs:0.2, runHrs:5,  changeoverMin:8,  downtimeMin:6,  scrapPct:0.0, oee:93, start:"2025-08-13", end:"2025-08-14", due:"2025-08-20", priority:"Medium", status:"Planned", dependsOn:"Assembly" },
] as const;

/** Colors per Work Center */
const wcColor: Record<string,string> = {
  Cutting: "#3b82f6",
  Machining: "#6366f1",
  Assembly: "#10b981",
  Painting: "#f59e0b",
  QC: "#ef4444",
  Packaging: "#8b5cf6",
};

const DetailedProductionPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    bom: null, routings: null, workcenters: null, capacity: null, shifts: null, crews: null, downtime: null, oee: null, demand: null, suppliers: null,
  });
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "workcenters" | "orders" | "timeline" | "workbook">("overview");
  const [granularity, setGranularity] = useState<"daily" | "weekly">("daily");
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Week");

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, title: "Review Data", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
    { id: 4, title: "Results", status: currentStep === 4 ? "active" : "pending" },
  ] as const;

  // ---------- STEP 1: Add Data (NO AI external driver selection) ----------
  const renderStep1 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload BOM, Routings, Work Centers, Shifts & Crews, Downtime Logs, OEE history, Demand/Orders, and Supplier Lead Times.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Planning Data Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                const newUploaded = { ...uploadedFiles };
                files.forEach(file => {
                  const name = file.name.toLowerCase();
                  if (name.includes("bom")) newUploaded.bom = file;
                  else if (name.includes("routing") || name.includes("route")) newUploaded.routings = file;
                  else if (name.includes("workcenter") || name.includes("work_center") || name.includes("wc")) newUploaded.workcenters = file;
                  else if (name.includes("capacity")) newUploaded.capacity = file;
                  else if (name.includes("shift") || name.includes("crew")) { newUploaded.shifts = file; newUploaded.crews = file; }
                  else if (name.includes("downtime")) newUploaded.downtime = file;
                  else if (name.includes("oee")) newUploaded.oee = file;
                  else if (name.includes("demand") || name.includes("order")) newUploaded.demand = file;
                  else if (name.includes("supplier") || name.includes("lead")) newUploaded.suppliers = file;
                  else {
                    for (const key of Object.keys(newUploaded)) {
                      if (!newUploaded[key as keyof typeof newUploaded]) { (newUploaded as any)[key] = file; break; }
                    }
                  }
                });
                setUploadedFiles(newUploaded);
                const first = Object.keys(newUploaded).find(k => (newUploaded as any)[k]);
                if (first) setSelectedPreview(first);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 600);
              }
            }}
          />

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(uploadedFiles).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="capitalize font-medium">{k}:</span>
                {v ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {v.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not uploaded</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {(Object.values(uploadedFiles).some(Boolean)) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(uploadedFiles)
                  .filter(k => (uploadedFiles as any)[k])
                  .map(k => (
                    <Button
                      key={k}
                      size="sm"
                      variant={selectedPreview === k ? "default" : "outline"}
                      onClick={() => { setSelectedPreview(k); setPreviewLoading(true); setTimeout(() => setPreviewLoading(false), 400); }}
                    >
                      {k}
                    </Button>
                  ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full border-2 border-border border-t-transparent animate-spin" />
              </div>
            ) : selectedPreview && (uploadedFiles as any)[selectedPreview] ? (
              <>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> {(uploadedFiles as any)[selectedPreview].name}
                </p>
                <table className="min-w-full text-xs border border-border rounded">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2">Code</th>
                      <th className="text-left px-3 py-2">Desc</th>
                      <th className="text-left px-3 py-2">Attr 1</th>
                      <th className="text-left px-3 py-2">Attr 2</th>
                      <th className="text-left px-3 py-2">Attr 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">SHF-A</td>
                      <td className="px-3 py-2">Shift A</td>
                      <td className="px-3 py-2">Crew-1</td>
                      <td className="px-3 py-2">WC: Cutting</td>
                      <td className="px-3 py-2">Cap: 8h</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">OEE-01</td>
                      <td className="px-3 py-2">OEE Historical</td>
                      <td className="px-3 py-2">Cutting: 86%</td>
                      <td className="px-3 py-2">Assembly: 82%</td>
                      <td className="px-3 py-2">QC: 92%</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a file to preview.</p>
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
    { label: "Data Integrity", value: "97.4%", icon: CheckCircle },
    { label: "Missing Routings", value: "2", icon: AlertCircle },
    { label: "Invalid BOM Links", value: "4", icon: AlertCircle },
    { label: "Capacity Conflicts", value: "3", icon: Timer },
    { label: "Missing Shift Assign.", value: "5", icon: Users },
    { label: "Crew Shortage Incidents", value: "2", icon: Users },
    { label: "Op Overlaps", value: "3", icon: Activity },
    { label: "Scrap Master Missing", value: "1", icon: Percent },
  ] as const;

  const wcUtilData = {
    labels: ["Cutting", "Machining", "Assembly", "Painting", "QC", "Packaging"],
    datasets: [
      {
        label: "Utilization %",
        data: [74, 82, 93, 66, 58, 61],
        backgroundColor: hslVar("--primary", 0.5),
        borderColor: hslVar("--primary"),
        borderWidth: 1,
      },
    ],
  };

  const wcUtilOptions = buildChartOptions({
    indexAxis: "y" as const,
    scales: {
      x: { beginAtZero: true, max: 100, ticks: { callback: (v: any) => `${v}%` } },
    },
    plugins: { legend: { display: false } },
  });

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">Detected structural, staffing and capacity issues; review and auto-fix.</p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {gapKPIs.map((k, idx) => (
          <Card key={idx} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="w-4 h-4" />
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
              <div className="text-xl font-bold">{k.value}</div>
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
              <li>Components mismatched between BOM and routing</li>
              <li>Capacity exceeds shift hours on Machining for 12–13 Aug</li>
              <li>Maintenance overlap on Assembly causing delays</li>
              <li>Crew assignment gaps on Shift C (QC)</li>
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
    { wc: "Cutting",   availableHrs: 48, requiredHrs: 36, utilization: 75, oee: 86 },
    { wc: "Machining", availableHrs: 48, requiredHrs: 44, utilization: 92, oee: 88 },
    { wc: "Assembly",  availableHrs: 48, requiredHrs: 46, utilization: 96, oee: 82 },
    { wc: "Painting",  availableHrs: 48, requiredHrs: 30, utilization: 63, oee: 81 },
    { wc: "QC",        availableHrs: 48, requiredHrs: 28, utilization: 58, oee: 92 },
    { wc: "Packaging", availableHrs: 48, requiredHrs: 29, utilization: 60, oee: 93 },
  ] as const;

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
    plugins: { legend: { position: "bottom" as const } },
  });

  const oeeBarData = {
    labels: wcCapacitySummary.map((w) => w.wc),
    datasets: [
      {
        label: "OEE %",
        data: wcCapacitySummary.map((w) => w.oee),
        backgroundColor: "rgba(59,130,246,0.4)",
        borderColor: "rgba(59,130,246,1)",
      },
    ],
  };

  const oeeBarOptions = buildChartOptions({
    scales: { y: { beginAtZero: true, max: 100 } },
    plugins: { legend: { position: "bottom" as const } },
  });

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Review capacity, utilization, OEE and configuration before creating a plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Model Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Granularity</div>
                <ToggleGroup type="single" value={granularity} onValueChange={(v) => v && setGranularity(v as any)}>
                  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Schedule Rule</div>
                <Select defaultValue="Forward">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Forward">Forward</SelectItem>
                    <SelectItem value="Backward">Backward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Priority Rule</div>
                <Select defaultValue="EDD (Earliest Due Date)">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EDD (Earliest Due Date)">EDD (Earliest Due Date)</SelectItem>
                    <SelectItem value="SPT (Shortest Proc. Time)">SPT (Shortest Proc. Time)</SelectItem>
                    <SelectItem value="LPT (Longest Proc. Time)">LPT (Longest Proc. Time)</SelectItem>
                    <SelectItem value="CR (Critical Ratio)">CR (Critical Ratio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Lot Sizing</div>
                <Select defaultValue="L4L (Lot-for-Lot)">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L4L (Lot-for-Lot)">L4L (Lot-for-Lot)</SelectItem>
                    <SelectItem value="FOQ (Fixed Order Qty)">FOQ (Fixed Order Qty)</SelectItem>
                    <SelectItem value="EOQ (Economic Order Qty)">EOQ (Economic Order Qty)</SelectItem>
                    <SelectItem value="Period Order Qty">Period Order Qty</SelectItem>
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
                    <th className="text-right py-2 px-2 text-muted-foreground">OEE</th>
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
                      <td className="py-2 px-2 text-right">
                        <Badge variant="secondary" className={w.oee < 85 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}>
                          {w.oee}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Utilization Overview</CardTitle></CardHeader>
            <CardContent><div className="h-[220px]"><Bar data={utilBarData} options={utilBarOptions} /></div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">OEE by Work Center</CardTitle></CardHeader>
            <CardContent><div className="h-[220px]"><Bar data={oeeBarData} options={oeeBarOptions} /></div></CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Preview</CardTitle></CardHeader>
        <CardContent>
          <DetailedPlanningWorkbook rows={detailedOps.slice(0, 14)} height={280} />
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

  // ---------- STEP 4: RESULTS with Timeline ----------
  const timelineColumns = [
    { type: "string", id: "Work Order" },
    { type: "string", id: "Operation" },
    { type: "string", role: "style" },
    { type: "string", role: "tooltip", p: { html: true } },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ] as const;

  const timelineRows = useMemo(() => {
    return detailedOps.map((ev) => {
      const color = wcColor[ev.workCenter] || "#64748b";
      const tooltip = `
        <div style="padding:8px 10px;font-family:Inter,system-ui,sans-serif;font-size:12px">
          <div style="font-weight:600;margin-bottom:4px">${ev.order} — ${ev.opSeq} ${ev.operation}</div>
          <div><b>Product:</b> ${ev.product}</div>
          <div><b>Qty:</b> ${ev.qty.toLocaleString()}</div>
          <div><b>Shift/Crew:</b> ${ev.shift}/${ev.crew}</div>
          <div><b>Resource:</b> ${ev.resource}</div>
          <div><b>OEE:</b> ${ev.oee}%</div>
          <div><b>Changeover:</b> ${ev.changeoverMin} min</div>
          <div><b>Downtime:</b> ${ev.downtimeMin} min</div>
          <div><b>From:</b> ${new Date(ev.start).toDateString()}</div>
          <div><b>To:</b> ${new Date(ev.end).toDateString()}</div>
          <div><b>Work Center:</b> ${ev.workCenter}</div>
          ${ev.dependsOn ? `<div><b>Depends on:</b> ${ev.dependsOn}</div>` : ""}
        </div>
      `;
      return [ev.order, `${ev.opSeq} ${ev.operation}`, `color: ${color}`, tooltip, new Date(ev.start), new Date(ev.end)];
    });
  }, []);

  const uniqueOrders = useMemo(() => Array.from(new Set(detailedOps.map(e => e.order))), []);

  const heightPx = useMemo(() => {
    const base = 60;
    const perRow = 44;
    return base + uniqueOrders.length * perRow;
  }, [uniqueOrders]);

  const axisBounds = useMemo(() => {
    const starts = detailedOps.map(e => new Date(e.start).getTime());
    const ends = detailedOps.map(e => new Date(e.end).getTime());
    let min = new Date(Math.min(...starts));
    let max = new Date(Math.max(...ends));
    const pad = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 3600 * 1000);
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

  // Derived KPIs for results (slightly taller cards)
  const totalOrders = uniqueOrders.length;
  const avgOEE = Math.round(detailedOps.reduce((s, r) => s + (r.oee as number), 0) / detailedOps.length);
  const totalDowntimeHrs = Math.round(detailedOps.reduce((s, r) => s + (r.downtimeMin as number), 0) / 60);
  const totalChangeoverHrs = Math.round(detailedOps.reduce((s, r) => s + (r.changeoverMin as number), 0) / 60);
  const lateOrders = 2; // sample
  const onTimePct = 100 - Math.round((lateOrders / totalOrders) * 100);

  const oeeTrendData = {
    labels: ["Aug 01", "Aug 03", "Aug 05", "Aug 07", "Aug 09", "Aug 11", "Aug 13"],
    datasets: [
      {
        label: "Avg OEE %",
        data: [84, 85, 83, 86, 87, 85, 88],
        fill: true,
        tension: 0.35,
        backgroundColor: "rgba(99,102,241,0.15)",
        borderColor: "rgba(99,102,241,1)",
        pointRadius: 2,
      },
    ],
  };

  const oeeTrendOptions = buildChartOptions({
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true, max: 100 } },
  });

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Sidebar with Clickable Cards */}
      <div className="w-80 bg-card border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Detailed Plan</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        {/* Clickable Metric Cards (slightly taller) */}
        <div className="space-y-4">
          <Card className={`p-4 h-36 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "overview" ? "ring-2 ring-blue-400/30" : ""}`} onClick={() => setActiveTab("overview")}>
            <div><p className="text-xs text-blue-600 dark:text-blue-400 font-medium">TOTAL ORDERS</p><p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalOrders}</p><p className="text-xs text-blue-600 dark:text-blue-400">current horizon</p></div>
          </Card>

          <Card className={`p-4 h-36 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "workcenters" ? "ring-2 ring-emerald-400/30" : ""}`} onClick={() => setActiveTab("workcenters")}>
            <div><p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">AVG OEE</p><p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{avgOEE}%</p><p className="text-xs text-emerald-600 dark:text-emerald-400">performance</p></div>
          </Card>

          <Card className={`p-4 h-36 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "orders" ? "ring-2 ring-amber-400/30" : ""}`} onClick={() => setActiveTab("orders")}>
            <div><p className="text-xs text-amber-600 dark:text-amber-400 font-medium">LATE ORDERS</p><p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{lateOrders}</p><p className="text-xs text-amber-600 dark:text-amber-400">on-time: {onTimePct}%</p></div>
          </Card>

          <Card className={`p-4 h-36 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "workbook" ? "ring-2 ring-purple-400/30" : ""}`} onClick={() => setActiveTab("workbook")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">WORKBOOK</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">Data Table</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Interactive planning data</p>
              </div>
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className={`p-4 h-36 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "timeline" ? "ring-2 ring-cyan-400/30" : ""}`} onClick={() => setActiveTab("timeline")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">VIEW</p>
                <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">Timeline</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">Production schedule</p>
              </div>
              <Timer className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <Button variant="outline" className="w-full justify-start" size="sm"><Download className="w-4 h-4 mr-2" />Export Plan</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><Share className="w-4 h-4 mr-2" />Share Results</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><FileText className="w-4 h-4 mr-2" />Generate Report</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Planning Overview"}
              {activeTab === "workcenters" && "Work Center Performance"}
              {activeTab === "orders" && "Orders Table"}
              {activeTab === "workbook" && "Planning Workbook"}
              {activeTab === "timeline" && "Timeline Schedule"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Comprehensive detailed planning insights"}
              {activeTab === "workcenters" && "Utilization and OEE by work center"}
              {activeTab === "orders" && "Orders aggregated by due dates"}
              {activeTab === "workbook" && "Interactive detailed data table"}
              {activeTab === "timeline" && "Interactive production plan (with OEE, changeovers, downtime)"} 
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>← Back</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button><Share className="w-4 h-4 mr-2" />Share</Button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="shadow-card border-0 h-36">
                <CardContent className="p-6 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Avg. OEE</div>
                  <div className="text-4xl font-bold text-primary mb-1">{avgOEE}%</div>
                  <div className="text-xs text-muted-foreground">Total Changeover</div>
                  <div className="text-lg font-semibold text-foreground">{totalChangeoverHrs}h</div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0 h-36">
                <CardContent className="p-6 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Downtime</div>
                  <div className="text-4xl font-bold text-foreground mb-1">{totalDowntimeHrs}h</div>
                  <div className="text-xs text-muted-foreground">On-Time Completion</div>
                  <div className="text-lg font-semibold text-success">{onTimePct}%</div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0 h-36">
                <CardContent className="p-6 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Orders</div>
                  <div className="text-4xl font-bold text-foreground mb-1">{totalOrders}</div>
                  <div className="text-xs text-muted-foreground">Late Orders</div>
                  <div className="text-lg font-semibold text-destructive">{lateOrders}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0 h-36">
                <CardContent className="p-6 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Bottleneck</div>
                  <div className="text-xl font-semibold text-warning mb-1">Assembly</div>
                  <div className="text-xs text-muted-foreground">Consider overtime / re-sequencing</div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card border-0 mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>OEE Trend</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" aria-label="Chart options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-50">
                    <DropdownMenuLabel>Chart controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Granularity</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={granularity} onValueChange={(v) => setGranularity((v as any) || "daily")}>
                          <DropdownMenuRadioItem value="daily">Daily</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="weekly">Weekly</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[360px]">
                  <Line data={oeeTrendData} options={oeeTrendOptions} />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "workcenters" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Utilization %</CardTitle>
              </CardHeader>
              <CardContent><div className="h-[300px]"><Bar data={utilBarData} options={utilBarOptions} /></div></CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChartIcon className="w-5 h-5" />Load Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm">Setup (h)</span><span className="font-medium">{(detailedOps.reduce((s,r)=>s + r.setupHrs, 0)).toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-sm">Run (h)</span><span className="font-medium">{(detailedOps.reduce((s,r)=>s + r.runHrs, 0)).toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-sm">Changeover (h)</span><span className="font-medium">{(detailedOps.reduce((s,r)=>s + r.changeoverMin, 0)/60).toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-sm">Downtime (h)</span><span className="font-medium">{(detailedOps.reduce((s,r)=>s + r.downtimeMin, 0)/60).toFixed(1)}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <Card className="shadow-card border-0">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Orders</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search orders..." className="pl-10 w-56" />
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground">WO</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Start</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Due</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Qty</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueOrders.map((wo,i) => {
                      const rows = detailedOps.filter(r => r.order === wo);
                      const first = rows[0];
                      const last = rows[rows.length-1];
                      const qty = rows[0]?.qty || 0;
                      const status = rows.find(r => r.status === "Risk") ? "Risk" : (rows.find(r => r.status === "In Progress") ? "In Progress" : "Planned");
                      return (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                          <td className="py-3 px-4 font-medium">{wo}</td>
                          <td className="py-3 px-4">{first?.product}</td>
                          <td className="py-3 px-4">{new Date(first?.start as any).toLocaleDateString(undefined,{month:"short",day:"2-digit"})}</td>
                          <td className="py-3 px-4">{new Date(last?.end as any).toLocaleDateString(undefined,{month:"short",day:"2-digit"})}</td>
                          <td className="py-3 px-4">{qty.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className={status==="Risk"?"bg-amber-100 text-amber-700":status==="In Progress"?"bg-blue-100 text-blue-700":"bg-slate-100 text-slate-700"}>{status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "workbook" && (
          <div className="mb-6">
            <DetailedPlanningWorkbook rows={detailedOps as any} height={480} />
          </div>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-card border-0 h-[calc(100vh-170px)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Timeline Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                  <SelectTrigger className="w-28"><SelectValue placeholder="View" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => alert("Hook to /plan API")}>Rebuild Plan</Button>
                <Button size="sm" onClick={() => alert("Hook to /publish API")}>Publish</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-hidden rounded-lg border bg-background shadow-lg">
                <div className="px-4 py-2 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span>Legend:</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.Cutting}} /> Cutting</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.Machining}} /> Machining</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.Assembly}} /> Assembly</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.Painting}} /> Painting</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.QC}} /> QC</span>
                  <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{background:wcColor.Packaging}} /> Packaging</span>
                </div>
                <Chart
                  chartType="Timeline"
                  columns={timelineColumns as any}
                  rows={timelineRows as any}
                  options={timelineOptions as any}
                  width="100%"
                  height={`${heightPx}px`}
                  loader={<div className="p-6 text-sm text-muted-foreground">Loading timeline…</div>}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <ModernStepper steps={stepperSteps as any} title="Detailed Production Planning" />
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default DetailedProductionPlanning;