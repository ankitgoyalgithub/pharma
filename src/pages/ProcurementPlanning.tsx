
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CheckCircle,
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Search,
  AlertCircle,
  Settings,
  Share,
  MoreHorizontal,
  Truck,
  Package,
  Percent,
  DollarSign,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ModernStepper } from "@/components/ModernStepper";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, Filler, Title } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "react-google-charts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, ChartTooltip, ChartLegend, Filler, Title);

/** ---------- Pagination ---------- */
function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const jump = (p: number) => onChange(Math.min(Math.max(1, p), totalPages));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.max(5, Math.min(totalPages, page + 2))
  );
  return (
    <div className="flex items-center justify-between gap-2 text-xs mt-3">
      <div className="text-muted-foreground">
        Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span> —{" "}
        <span className="font-medium">{total}</span> rows
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" disabled={!canPrev} onClick={() => jump(1)}>⏮</Button>
        <Button size="sm" variant="outline" disabled={!canPrev} onClick={() => jump(page - 1)}>Prev</Button>
        {pages.map((p) => (
          <Button key={p} size="sm" variant={p === page ? "default" : "outline"} onClick={() => jump(p)}>{p}</Button>
        ))}
        <Button size="sm" variant="outline" disabled={!canNext} onClick={() => jump(page + 1)}>Next</Button>
        <Button size="sm" variant="outline" disabled={!canNext} onClick={() => jump(totalPages)}>⏭</Button>
      </div>
    </div>
  );
}

/** ---------- Sample Data ---------- */
type ProcLine = {
  item: string;
  description: string;
  uom: string;
  location: string;
  supplier: string;
  incoterm: string;
  currency: string;
  unitPrice: number;
  onHand: number;
  onOrder: number;
  backorder: number;
  demandNext30: number;
  safetyStock: number;
  reorderPoint: number;
  minOrderQty: number;
  eoq: number;
  leadTimeDays: number;
  ltStdDev: number;
  deliveryPerformance: number;
  otif: number;
  riskScore: number;
  lastPO: string;
  needBy: string;
  status: "Planned" | "Risk" | "Confirmed";
};

const procLines: ProcLine[] = [
  { item:"RM-1001", description:"Cold Rolled Steel Sheet 2mm", uom:"kg", location:"Plant-A", supplier:"SteelWorks Ltd", incoterm:"FOB", currency:"USD", unitPrice:1.80, onHand:12000, onOrder:5000, backorder:0, demandNext30:18000, safetyStock:4000, reorderPoint:10000, minOrderQty:5000, eoq:6000, leadTimeDays:14, ltStdDev:3, deliveryPerformance:92, otif:93, riskScore:18, lastPO:"2025-08-02", needBy:"2025-08-18", status:"Planned" },
  { item:"RM-1002", description:"Aluminum Ingot A7", uom:"kg", location:"Plant-A", supplier:"AluPrime", incoterm:"CIF", currency:"USD", unitPrice:2.40, onHand:6000, onOrder:4000, backorder:200, demandNext30:15000, safetyStock:3000, reorderPoint:8000, minOrderQty:3000, eoq:4500, leadTimeDays:21, ltStdDev:5, deliveryPerformance:88, otif:85, riskScore:34, lastPO:"2025-08-04", needBy:"2025-08-24", status:"Risk" },
  { item:"RM-1003", description:"ABS Resin Natural", uom:"kg", location:"Plant-B", supplier:"Polymatech", incoterm:"EXW", currency:"USD", unitPrice:1.20, onHand:9000, onOrder:0, backorder:0, demandNext30:7000, safetyStock:2000, reorderPoint:4000, minOrderQty:2000, eoq:2500, leadTimeDays:7, ltStdDev:1, deliveryPerformance:95, otif:97, riskScore:10, lastPO:"2025-08-06", needBy:"2025-08-16", status:"Confirmed" },
  { item:"RM-2001", description:"Motor 0.5 HP", uom:"pcs", location:"Plant-B", supplier:"ElectroMotion", incoterm:"DAP", currency:"INR", unitPrice:3800, onHand:150, onOrder:100, backorder:25, demandNext30:420, safetyStock:60, reorderPoint:120, minOrderQty:80, eoq:90, leadTimeDays:10, ltStdDev:2, deliveryPerformance:90, otif:89, riskScore:23, lastPO:"2025-08-03", needBy:"2025-08-14", status:"Planned" },
  { item:"RM-3007", description:"Paint Thinner", uom:"ltr", location:"Plant-A", supplier:"ChemNova", incoterm:"FCA", currency:"USD", unitPrice:0.90, onHand:2000, onOrder:1000, backorder:0, demandNext30:2400, safetyStock:600, reorderPoint:1200, minOrderQty:500, eoq:700, leadTimeDays:5, ltStdDev:1, deliveryPerformance:86, otif:84, riskScore:41, lastPO:"2025-08-05", needBy:"2025-08-11", status:"Risk" },
  { item:"PK-5001", description:"Corrugated Box L", uom:"pcs", location:"Plant-A", supplier:"PackRight", incoterm:"DDP", currency:"INR", unitPrice:38.5, onHand:900, onOrder:800, backorder:50, demandNext30:2800, safetyStock:400, reorderPoint:900, minOrderQty:600, eoq:700, leadTimeDays:6, ltStdDev:1, deliveryPerformance:94, otif:95, riskScore:12, lastPO:"2025-08-07", needBy:"2025-08-13", status:"Planned" },
  { item:"PK-5002", description:"Bubble Wrap", uom:"m", location:"Plant-B", supplier:"WrapCo", incoterm:"DAP", currency:"INR", unitPrice:5.2, onHand:1200, onOrder:0, backorder:0, demandNext30:900, safetyStock:200, reorderPoint:500, minOrderQty:300, eoq:350, leadTimeDays:4, ltStdDev:1, deliveryPerformance:96, otif:98, riskScore:8, lastPO:"2025-08-08", needBy:"2025-08-12", status:"Confirmed" },
  { item:"RM-4010", description:"Ball Bearing 6203", uom:"pcs", location:"Plant-A", supplier:"BearingHub", incoterm:"CPT", currency:"USD", unitPrice:1.15, onHand:1000, onOrder:500, backorder:0, demandNext30:1800, safetyStock:300, reorderPoint:800, minOrderQty:400, eoq:500, leadTimeDays:9, ltStdDev:2, deliveryPerformance:89, otif:90, riskScore:27, lastPO:"2025-08-01", needBy:"2025-08-15", status:"Planned" },
  { item:"RM-5005", description:"Wiring Harness 12-pin", uom:"pcs", location:"Plant-B", supplier:"WireWorks", incoterm:"FOB", currency:"USD", unitPrice:2.85, onHand:400, onOrder:600, backorder:30, demandNext30:1600, safetyStock:200, reorderPoint:600, minOrderQty:300, eoq:350, leadTimeDays:12, ltStdDev:2, deliveryPerformance:83, otif:82, riskScore:45, lastPO:"2025-08-02", needBy:"2025-08-19", status:"Risk" },
  { item:"RM-6001", description:"Adhesive 3M 77", uom:"can", location:"Plant-A", supplier:"BondIt", incoterm:"CIF", currency:"USD", unitPrice:7.5, onHand:120, onOrder:0, backorder:0, demandNext30:200, safetyStock:50, reorderPoint:100, minOrderQty:60, eoq:80, leadTimeDays:8, ltStdDev:1, deliveryPerformance:93, otif:94, riskScore:14, lastPO:"2025-08-06", needBy:"2025-08-20", status:"Planned" },
];

type Supplier = { name: string; country: string; currency: string; paymentTerms: string; incoterms: string[]; otif: number; qualityScore: number; riskScore: number; ppvYtd: number; leadTimeAvg: number; leadTimeStd: number; };
const suppliers: Supplier[] = [
  { name:"SteelWorks Ltd", country:"JP", currency:"USD", paymentTerms:"Net 30", incoterms:["FOB"], otif:93, qualityScore:92, riskScore:16, ppvYtd:-1.4, leadTimeAvg:14, leadTimeStd:3 },
  { name:"AluPrime", country:"AE", currency:"USD", paymentTerms:"Net 45", incoterms:["CIF"], otif:86, qualityScore:88, riskScore:33, ppvYtd:2.1, leadTimeAvg:21, leadTimeStd:5 },
  { name:"Polymatech", country:"IN", currency:"USD", paymentTerms:"Net 15", incoterms:["EXW"], otif:97, qualityScore:96, riskScore:9, ppvYtd:-0.8, leadTimeAvg:7, leadTimeStd:1 },
  { name:"ElectroMotion", country:"IN", currency:"INR", paymentTerms:"Net 30", incoterms:["DAP"], otif:89, qualityScore:91, riskScore:22, ppvYtd:1.7, leadTimeAvg:10, leadTimeStd:2 },
  { name:"ChemNova", country:"SG", currency:"USD", paymentTerms:"Net 30", incoterms:["FCA"], otif:84, qualityScore:86, riskScore:40, ppvYtd:3.2, leadTimeAvg:5, leadTimeStd:1 },
  { name:"PackRight", country:"IN", currency:"INR", paymentTerms:"Net 15", incoterms:["DDP"], otif:95, qualityScore:92, riskScore:11, ppvYtd:-0.5, leadTimeAvg:6, leadTimeStd:1 },
  { name:"WrapCo", country:"IN", currency:"INR", paymentTerms:"Net 15", incoterms:["DAP"], otif:98, qualityScore:95, riskScore:7, ppvYtd:-1.1, leadTimeAvg:4, leadTimeStd:1 },
  { name:"BearingHub", country:"CN", currency:"USD", paymentTerms:"Net 30", incoterms:["CPT"], otif:90, qualityScore:90, riskScore:25, ppvYtd:0.9, leadTimeAvg:9, leadTimeStd:2 },
  { name:"WireWorks", country:"VN", currency:"USD", paymentTerms:"Net 45", incoterms:["FOB"], otif:82, qualityScore:85, riskScore:46, ppvYtd:4.5, leadTimeAvg:12, leadTimeStd:2 },
  { name:"BondIt", country:"US", currency:"USD", paymentTerms:"Net 30", incoterms:["CIF"], otif:94, qualityScore:93, riskScore:13, ppvYtd:-0.7, leadTimeAvg:8, leadTimeStd:1 },
];

/** ---------- Utility ---------- */
function usePaginated<T>(rows: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const total = rows.length;
  const data = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [page, pageSize, rows]);
  return { data, page, setPage, total };
}

function chip(text: string, tone: "ok" | "warn" | "risk" = "ok") {
  const base = "px-2 py-0.5 rounded-full text-[11px] font-medium";
  const cls = tone === "ok" ? "bg-emerald-100 text-emerald-700" : tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`${base} ${cls}`}>{text}</span>;
}

/** ---------- Components ---------- */
function ProcurementWorkbookTable({ rows }: { rows: ProcLine[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return rows.filter(r =>
      !t ||
      r.item.toLowerCase().includes(t) ||
      r.description.toLowerCase().includes(t) ||
      r.supplier.toLowerCase().includes(t) ||
      r.location.toLowerCase().includes(t)
    );
  }, [q, rows]);

  const pageSize = 6;
  const { data, page, setPage, total } = usePaginated(filtered, pageSize);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">Rows: <span className="font-medium">{filtered.length}</span></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search item, description, supplier…" className="pl-9 h-8 w-72" />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="max-w-full overflow-x-auto" style={{ maxHeight: 360, overflowY: "auto" }}>
          <table className="min-w-[1400px] w-full text-xs">
            <thead className="sticky top-16 z-10 bg-muted/60 backdrop-blur">
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Supplier</th>
                <th className="px-3 py-2 text-left">Incoterm</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">On Hand</th>
                <th className="px-3 py-2 text-right">On Order</th>
                <th className="px-3 py-2 text-right">Backorder</th>
                <th className="px-3 py-2 text-right">Lead Time (d)</th>
                <th className="px-3 py-2 text-right">Demand 30d</th>
                <th className="px-3 py-2 text-right">Safety</th>
                <th className="px-3 py-2 text-right">ROP</th>
                <th className="px-3 py-2 text-right">MOQ</th>
                <th className="px-3 py-2 text-right">EOQ</th>
                <th className="px-3 py-2 text-left">Need By</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{r.item}</td>
                  <td className="px-3 py-2">{r.description}</td>
                  <td className="px-3 py-2">{r.location}</td>
                  <td className="px-3 py-2">{r.supplier}</td>
                  <td className="px-3 py-2">{r.incoterm}</td>
                  <td className="px-3 py-2 text-right">{r.currency} {r.unitPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{r.onHand.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.onOrder.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.backorder.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.leadTimeDays}</td>
                  <td className="px-3 py-2 text-right">{r.demandNext30.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.safetyStock.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.reorderPoint.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.minOrderQty.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{r.eoq.toLocaleString()}</td>
                  <td className="px-3 py-2">{new Date(r.needBy).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    {r.status === "Risk" ? chip("Risk", "risk") : r.status === "Confirmed" ? chip("Confirmed", "ok") : chip("Planned", "warn")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
    </div>
  );
}

function SuppliersTable({ rows }: { rows: Supplier[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return rows.filter(r => !t || r.name.toLowerCase().includes(t) || r.country.toLowerCase().includes(t));
  }, [q, rows]);

  const pageSize = 5;
  const { data, page, setPage, total } = usePaginated(filtered, pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">Suppliers: <span className="font-medium">{filtered.length}</span></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search supplier or country…" className="pl-9 h-8 w-72" />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 280, overflowY: "auto" }}>
          <table className="min-w-[1000px] w-full text-xs">
            <thead className="sticky top-16 z-10 bg-muted/60 backdrop-blur">
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Supplier</th>
                <th className="px-3 py-2 text-left">Country</th>
                <th className="px-3 py-2 text-left">Currency</th>
                <th className="px-3 py-2 text-left">Payment Terms</th>
                <th className="px-3 py-2 text-left">Incoterms</th>
                <th className="px-3 py-2 text-right">OTIF</th>
                <th className="px-3 py-2 text-right">Quality</th>
                <th className="px-3 py-2 text-right">Risk</th>
                <th className="px-3 py-2 text-right">PPV YTD</th>
                <th className="px-3 py-2 text-right">LT Avg / Std</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2">{s.country}</td>
                  <td className="px-3 py-2">{s.currency}</td>
                  <td className="px-3 py-2">{s.paymentTerms}</td>
                  <td className="px-3 py-2">{s.incoterms.join(", ")}</td>
                  <td className="px-3 py-2 text-right">{s.otif}%</td>
                  <td className="px-3 py-2 text-right">{s.qualityScore}%</td>
                  <td className="px-3 py-2 text-right">{s.riskScore}</td>
                  <td className="px-3 py-2 text-right">{s.ppvYtd}%</td>
                  <td className="px-3 py-2 text-right">{s.leadTimeAvg} / {s.leadTimeStd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
    </div>
  );
}

/** ---------- Main Component ---------- */
const ProcurementPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "workbook" | "suppliers" | "timeline">("overview");
  const [granularity, setGranularity] = useState<"weekly" | "monthly">("weekly");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    items: null, suppliers: null, leadtimes: null, prices: null, inventory: null, demand: null, pos: null,
  });

  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, title: "Review Data", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
    { id: 4, title: "Results", status: currentStep === 4 ? "active" : "pending" },
  ] as const;

  // KPIs
  const totalItems = procLines.length;
  const riskItems = procLines.filter(p => p.status === "Risk" || p.riskScore >= 35).length;
  const avgLead = Math.round(procLines.reduce((s, r) => s + r.leadTimeDays, 0) / procLines.length);
  const coverageDays = Math.round(procLines.reduce((s, r) => s + (r.onHand + r.onOrder - r.backorder) / (r.demandNext30 / 30), 0) / procLines.length);

  // Charts
  const coverageData = {
    labels: ["0-5", "6-10", "11-15", "16-20", "21-30", "30+"],
    datasets: [{ label: "SKU Count", data: [4, 8, 10, 6, 5, 3], backgroundColor: hslVar("--primary", 0.5), borderColor: hslVar("--primary") }],
  };
  const coverageOptions = buildChartOptions({ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } });

  const leadTimeData = {
    labels: suppliers.map(s => s.name),
    datasets: [
      { label: "Lead Time (days)", data: suppliers.map(s => s.leadTimeAvg), backgroundColor: "rgba(16,185,129,0.5)", borderColor: "rgba(16,185,129,1)" },
      { label: "Std Dev", data: suppliers.map(s => s.leadTimeStd), backgroundColor: "rgba(59,130,246,0.4)", borderColor: "rgba(59,130,246,1)" },
    ],
  };
  const leadTimeOptions = buildChartOptions({ plugins: { legend: { position: "bottom" as const } }, scales: { y: { beginAtZero: true } } });

  // Timeline (PO schedule)
  const timelineColumns = [
    { type: "string", id: "PO" },
    { type: "string", id: "Item" },
    { type: "string", role: "style" },
    { type: "string", role: "tooltip", p: { html: true } },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ] as const;

  const poRows = [
    ["PO-9001", "RM-1001", "color: #3b82f6", `<div style='padding:8px;font-size:12px'><b>PO-9001</b><br/>SteelWorks Ltd<br/>Qty 5000, USD 1.80<br/>ETA: Aug 18</div>`, new Date("2025-08-02"), new Date("2025-08-18")],
    ["PO-9002", "RM-1002", "color: #f59e0b", `<div style='padding:8px;font-size:12px'><b>PO-9002</b><br/>AluPrime<br/>Qty 3000, USD 2.40<br/>ETA: Aug 24</div>`, new Date("2025-08-04"), new Date("2025-08-24")],
    ["PO-9003", "RM-2001", "color: #10b981", `<div style='padding:8px;font-size:12px'><b>PO-9003</b><br/>ElectroMotion<br/>Qty 100, INR 3800<br/>ETA: Aug 14</div>`, new Date("2025-08-03"), new Date("2025-08-14")],
    ["PO-9004", "PK-5001", "color: #8b5cf6", `<div style='padding:8px;font-size:12px'><b>PO-9004</b><br/>PackRight<br/>Qty 800, INR 38.5<br/>ETA: Aug 13</div>`, new Date("2025-08-07"), new Date("2025-08-13")],
  ];

  const renderStep1 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload Items, Suppliers, Lead Times, Prices, Inventory, Demand, and PO history.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Upload Procurement Data</CardTitle></CardHeader>
        <CardContent>
          <Input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const next = { ...uploadedFiles };
              files.forEach(file => {
                const name = file.name.toLowerCase();
                if (name.includes("item")) next.items = file;
                else if (name.includes("supplier")) next.suppliers = file;
                else if (name.includes("lead")) next.leadtimes = file;
                else if (name.includes("price") || name.includes("cost")) next.prices = file;
                else if (name.includes("invent")) next.inventory = file;
                else if (name.includes("demand") || name.includes("forecast")) next.demand = file;
                else if (name.includes("po")) next.pos = file;
              });
              setUploadedFiles(next);
            }}
          />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(uploadedFiles).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="capitalize font-medium">{k}:</span>
                {v ? <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {v.name}</span> : <span className="text-muted-foreground">Not uploaded</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(2)}>Continue to Data Gaps →</Button>
      </div>
    </div>
  );

  const gapKPIs = [
    { label: "Missing Lead Times", value: "3", icon: AlertCircle },
    { label: "MOQ > EOQ", value: "5", icon: Package },
    { label: "ROP < Safety", value: "2", icon: ShieldCheck },
    { label: "Supplier Risk > 40", value: "2", icon: AlertCircle },
    { label: "Price Variance > 3%", value: "2", icon: DollarSign },
    { label: "Late POs", value: "1", icon: Calendar },
  ] as const;

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">Review detected inconsistencies and risk flags; optionally auto-fix.</p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {gapKPIs.map((k, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2"><k.icon className="w-4 h-4" /><div className="text-xs text-muted-foreground">{k.label}</div></div>
              <div className="text-xl font-bold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Inventory Coverage (days)</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={coverageData} options={coverageOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Lead Time Profile by Supplier</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={leadTimeData} options={leadTimeOptions} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(3)}>Continue to Review →</Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Tune planning rules and validate procurement dataset before generating the plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Planning Parameters</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Granularity</div>
                <ToggleGroup type="single" value={granularity} onValueChange={(v) => v && setGranularity(v as any)}>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Reorder Policy</div>
                <Select defaultValue="ROP">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROP">ROP (Reorder Point)</SelectItem>
                    <SelectItem value="Min/Max">Min/Max</SelectItem>
                    <SelectItem value="EOQ">EOQ Driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Supplier Strategy</div>
                <Select defaultValue="Dual">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single Source</SelectItem>
                    <SelectItem value="Dual">Dual Source</SelectItem>
                    <SelectItem value="Multi">Multi Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Service Level Target</div>
                <Select defaultValue="95%">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90%">90%</SelectItem>
                    <SelectItem value="95%">95%</SelectItem>
                    <SelectItem value="98%">98%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base">Procurement Workbook Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProcurementWorkbookTable rows={procLines} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>← Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(4)}>Build Plan →</Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Procurement Plan</h2>
          <p className="text-sm text-muted-foreground">Explore insights</p>
        </div>

        <div className="space-y-4">
          <Card className={`p-4 h-36 cursor-pointer hover:shadow-lg ${activeTab==="overview"?"ring-2 ring-blue-400/30":""}`} onClick={()=>setActiveTab("overview")}>
            <div><p className="text-xs text-blue-600 font-medium">TOTAL ITEMS</p><p className="text-3xl font-bold text-blue-700">{totalItems}</p><p className="text-xs text-blue-600">in scope</p></div>
          </Card>
          <Card className={`p-4 h-36 cursor-pointer hover:shadow-lg ${activeTab==="workbook"?"ring-2 ring-purple-400/30":""}`} onClick={()=>setActiveTab("workbook")}>
            <div><p className="text-xs text-purple-600 font-medium">RISK ITEMS</p><p className="text-3xl font-bold text-purple-700">{riskItems}</p><p className="text-xs text-purple-600">≥ risk 35 or flagged</p></div>
          </Card>
          <Card className={`p-4 h-36 cursor-pointer hover:shadow-lg ${activeTab==="suppliers"?"ring-2 ring-emerald-400/30":""}`} onClick={()=>setActiveTab("suppliers")}>
            <div><p className="text-xs text-emerald-600 font-medium">AVG LEAD TIME</p><p className="text-3xl font-bold text-emerald-700">{avgLead}d</p><p className="text-xs text-emerald-600">across vendors</p></div>
          </Card>
          <Card className={`p-4 h-36 cursor-pointer hover:shadow-lg ${activeTab==="timeline"?"ring-2 ring-cyan-400/30":""}`} onClick={()=>setActiveTab("timeline")}>
            <div><p className="text-xs text-cyan-600 font-medium">AVG COVERAGE</p><p className="text-3xl font-bold text-cyan-700">{coverageDays}d</p><p className="text-xs text-cyan-600">on-hand + on-order</p></div>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <Button variant="outline" className="w-full justify-start" size="sm"><Download className="w-4 h-4 mr-2" />Export Plan</Button>
          <Button variant="outline" className="w-full justify-start" size="sm"><Share className="w-4 h-4 mr-2" />Share Results</Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Overview"}
              {activeTab === "workbook" && "Procurement Workbook"}
              {activeTab === "suppliers" && "Suppliers"}
              {activeTab === "timeline" && "PO Timeline"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Inventory coverage, lead time and risk insights"}
              {activeTab === "workbook" && "Line items with ROP, EOQ and risk flags"}
              {activeTab === "suppliers" && "Vendor performance and risk profile"}
              {activeTab === "timeline" && "PO schedules by expected delivery"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>← Back</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Button variant="ghost" className="w-full justify-start" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card border-0">
              <CardHeader><CardTitle>Inventory Coverage Distribution</CardTitle></CardHeader>
              <CardContent><div className="h-[320px]"><Bar data={coverageData} options={coverageOptions} /></div></CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardHeader><CardTitle>Lead Time & Variability</CardTitle></CardHeader>
              <CardContent><div className="h-[320px]"><Bar data={leadTimeData} options={leadTimeOptions} /></div></CardContent>
            </Card>
          </div>
        )}

        {activeTab === "workbook" && (
          <Card className="shadow-card border-0">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Procurement Lines</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProcurementWorkbookTable rows={procLines} />
            </CardContent>
          </Card>
        )}

        {activeTab === "suppliers" && (
          <Card className="shadow-card border-0">
            <CardHeader><CardTitle>Supplier Performance</CardTitle></CardHeader>
            <CardContent>
              <SuppliersTable rows={suppliers} />
            </CardContent>
          </Card>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-card border-0 h-[calc(100vh-170px)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">PO Expected Delivery Timeline</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="Week">
                  <SelectTrigger className="w-28"><SelectValue placeholder="View" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Chart
                chartType="Timeline"
                columns={timelineColumns as any}
                rows={poRows as any}
                options={{ tooltip:{ isHtml:true }, backgroundColor:"transparent", timeline:{ rowLabelStyle:{fontSize:11}, barLabelStyle:{fontSize:11} } }}
                width="100%"
                height="100%"
                loader={<div className="p-6 text-sm text-muted-foreground">Loading timeline…</div>}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <ModernStepper steps={stepperSteps as any} title="Procurement Planning" />
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default ProcurementPlanning;