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
  AlertTriangle,
  AlertCircle,
  Settings,
  Share,
  MoreHorizontal,
  Package,
  Truck,
  Clock,
  DollarSign,
  MapPin,
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
import WorkbookTable from "@/components/WorkbookTable";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";

// --- Chart.js for visuals ---
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
import { Line, Bar, Pie } from "react-chartjs-2";

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

// --- Map (Leaflet) ---
// Install (React 18): npm i react-leaflet@^4.2.1 leaflet@^1.9.4 && npm i -D @types/leaflet
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

// Fix default marker icons in Vite (so markers show up)
const DefaultIcon = L.icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Uploaded = File | null;

// ---------- Types for plans ----------
type Stop = {
  id: string;
  name: string;
  coords: LatLngExpression;
  type: "Origin" | "Hub" | "Destination";
  eta?: string;
  note?: string;
};

type Plan = {
  id: string;
  vehicle: string;
  capacity: number; // units or kg
  utilization: number; // 0-100
  color: string;
  lane: string;
  costPerKg: number;
  distanceKm: number;
  stops: Stop[];
};

// Sample multi-vehicle route plans
const PLANS: Plan[] = [
  {
    id: "V-A1",
    vehicle: "MH12 AB 1021",
    capacity: 3200,
    utilization: 0.82,
    color: "#06b6d4",
    lane: "BAN → BLR (Hub) → CJB",
    costPerKg: 11.6,
    distanceKm: 438,
    stops: [
      { id: "ban", name: "BAN (Bengaluru North)", coords: [13.05, 77.59], type: "Origin", eta: "08:15" },
      { id: "blr", name: "BLR Hub", coords: [12.9716, 77.5946], type: "Hub", eta: "12:00", note: "Cutoff 22:00" },
      { id: "cjb", name: "CJB (Coimbatore)", coords: [11.0168, 76.9558], type: "Destination", eta: "20:30" },
    ],
  },
  {
    id: "V-B3",
    vehicle: "KA03 XY 8899",
    capacity: 2800,
    utilization: 0.73,
    color: "#22c55e",
    lane: "PUN → MUM",
    costPerKg: 12.2,
    distanceKm: 149,
    stops: [
      { id: "pun", name: "Pune", coords: [18.5204, 73.8567], type: "Origin", eta: "09:45" },
      { id: "mum", name: "Mumbai", coords: [19.076, 72.8777], type: "Destination", eta: "13:20" },
    ],
  },
  {
    id: "V-C7",
    vehicle: "DL01 QZ 5530",
    capacity: 3000,
    utilization: 0.64,
    color: "#f59e0b",
    lane: "NCR → LKO",
    costPerKg: 10.9,
    distanceKm: 555,
    stops: [
      { id: "ncr", name: "NCR (Delhi)", coords: [28.6139, 77.209], type: "Origin", eta: "06:30" },
      { id: "lko", name: "Lucknow", coords: [26.8467, 80.9462], type: "Destination", eta: "16:45" },
    ],
  },
  {
    id: "V-D4",
    vehicle: "KA01 MN 2210",
    capacity: 2600,
    utilization: 0.91,
    color: "#ef4444",
    lane: "BLR → HYD",
    costPerKg: 11.2,
    distanceKm: 570,
    stops: [
      { id: "blr", name: "Bengaluru", coords: [12.9716, 77.5946], type: "Origin", eta: "07:10" },
      { id: "hyd", name: "Hyderabad", coords: [17.385, 78.4867], type: "Destination", eta: "17:20" },
    ],
  },
];

// Utility: fit map to selected (or all) plan stops
const FitToBounds: React.FC<{ selected?: Plan | null }> = ({ selected }) => {
  const map = useMap();
  useEffect(() => {
    const pts = (selected ? selected.stops : PLANS.flatMap(p => p.stops)).map(s => s.coords);
    if (pts.length === 0) return;
    const bounds = L.latLngBounds(pts as any);
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [map, selected?.id]);
  return null;
};

const FirstMidMileOptimizationFlow = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, Uploaded>>({
    shipments: null,
    stops: null,
    lanes: null,
    carriers: null,
    capacities: null,
    costs: null,
    calendars: null,
    hubs: null,
    slas: null,
  });

  const [selectedPreview, setSelectedPreview] = useState<keyof typeof uploadedFiles | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  // Results tabs
  const [activeTab, setActiveTab] = useState<"overview" | "lanes" | "routes" | "shipments" | "costs" | "workbook">("routes");

  // Step 3 configuration
  const [horizon, setHorizon] = useState<string>("4 Weeks");
  const [objective, setObjective] = useState<string>("Min Cost (service ≥ target)");
  const [serviceTarget, setServiceTarget] = useState<string>("95%");
  const [consolidationWindow, setConsolidationWindow] = useState<string>("24h");
  const [timeAgg, setTimeAgg] = useState<"daily" | "weekly">("daily");

  // Route/Map selection
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = useMemo(() => PLANS.find(p => p.id === selectedPlanId) || null, [selectedPlanId]);

  useEffect(() => { const e = new CustomEvent("collapseSidebar"); window.dispatchEvent(e); }, []);

  // --- Stepper ---
  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, title: "Review Data", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
    { id: 4, title: "Results", status: currentStep === 4 ? "active" : "pending" },
  ] as const;

  // --- External drivers ---
  const externalDrivers = [
    { name: "Carrier Capacity Calendars", autoSelected: true },
    { name: "Consolidation Policy", autoSelected: true },
    { name: "Hub Cut-off Times", autoSelected: true },
    { name: "Geo-fence / Dwell Rules", autoSelected: false },
    { name: "SLA Matrix (Pickup/Transit/Delivery)", autoSelected: true },
  ];

  useEffect(() => {
    if (selectedDrivers.length === 0) {
      setSelectedDrivers(externalDrivers.filter(d => d.autoSelected).map(d => d.name));
    }
  }, [selectedDrivers.length]);

  const toggleDriver = (driver: string) => {
    setSelectedDrivers(prev => prev.includes(driver) ? prev.filter(d => d !== driver) : [...prev, driver]);
  };

  // ---------- STEP 1: Add Data ----------
  const renderStep1 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
        <p className="text-sm text-muted-foreground">Upload Shipments, Stops, Lanes, Carriers, Capacities, Costs/Tariffs, Calendars, Hubs and SLAs.</p>
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
                const nu = { ...uploadedFiles };
                files.forEach(file => {
                  const name = file.name.toLowerCase();
                  if (name.includes("shipment")) nu.shipments = file;
                  else if (name.includes("stop")) nu.stops = file;
                  else if (name.includes("lane")) nu.lanes = file;
                  else if (name.includes("carrier")) nu.carriers = file;
                  else if (name.includes("capacit")) nu.capacities = file;
                  else if (name.includes("cost") || name.includes("tariff") || name.includes("rate")) nu.costs = file;
                  else if (name.includes("calendar") || name.includes("holiday")) nu.calendars = file;
                  else if (name.includes("hub") || name.includes("dc") || name.includes("sort")) nu.hubs = file;
                  else if (name.includes("sla") || name.includes("service")) nu.slas = file;
                  else { for (const key of Object.keys(nu)) { if (!(nu as any)[key]) { (nu as any)[key] = file; break; } } }
                });
                setUploadedFiles(nu);
                const first = (Object.keys(nu) as (keyof typeof uploadedFiles)[]).find(k => nu[k]);
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
                    <CheckCircle className="h-3 w-3" /> {(v as File).name}
                  </span>
                ) : (<span className="text-muted-foreground">Not uploaded</span>)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-medium text-foreground mb-2">AI Suggested Planning Drivers</h3>
        <div className="flex flex-wrap gap-2">
          {externalDrivers.map(d => (
            <div
              key={d.name}
              className={`${selectedDrivers.includes(d.name) ? "bg-primary text-white" : "bg-muted text-muted-foreground"} px-3 py-1 rounded-full border text-sm cursor-pointer flex items-center gap-2`}
              onClick={() => toggleDriver(d.name)}
            >
              <Switch checked={selectedDrivers.includes(d.name)} /> {d.name}
            </div>
          ))}
        </div>
      </div>

      {(Object.values(uploadedFiles).some(Boolean)) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex gap-2">
                {(Object.keys(uploadedFiles) as (keyof typeof uploadedFiles)[])
                  .filter(k => uploadedFiles[k])
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
            ) : selectedPreview && uploadedFiles[selectedPreview] ? (
              <>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> {(uploadedFiles[selectedPreview] as File).name}
                </p>
                <table className="min-w-full text-xs border border-border rounded">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2">Field</th>
                      <th className="text-left px-3 py-2">Desc</th>
                      <th className="text-left px-3 py-2">Example</th>
                      <th className="text-left px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">lane_id</td>
                      <td className="px-3 py-2">Origin → Hub/DC → Destination</td>
                      <td className="px-3 py-2">BAN–BLR–CJB</td>
                      <td className="px-3 py-2">Mid-mile via BLR</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">cutoff_time</td>
                      <td className="px-3 py-2">Hub departure cut-off</td>
                      <td className="px-3 py-2">22:00</td>
                      <td className="px-3 py-2">Local time</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (<p className="text-sm text-muted-foreground">Select a file to preview.</p>)}
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
    { label: "Completeness", value: "97.6%", icon: CheckCircle },
    { label: "Missing Cap Calendars", value: "5", icon: AlertCircle },
    { label: "SLA Gaps", value: "3", icon: AlertTriangle },
    { label: "Geofence Mismatch", value: "7", icon: AlertTriangle },
  ] as const;

  // Lane Service Heat (lanes x weeks) – stacked bars
  const laneLabels = ["W1","W2","W3","W4","W5","W6"];
  const lanes = ["BAN–BLR–CJB","PUN–MUM","NCR–LKO","BLR–HYD","CJB–BLR"];
  const serviceHeatData = {
    labels: laneLabels,
    datasets: lanes.map((l, i) => ({
      label: l,
      data: [92, 89, 95, 90, 96, 93].map((v, j) => v - ((i+j)%3===0 ? 6 : 0)),
      backgroundColor: hslVar("--primary", 0.16 + i*0.06),
      borderColor: hslVar("--primary"),
      borderWidth: 1,
      stack: "svc",
    })),
  };
  const serviceHeatOptions: any = buildChartOptions({
    responsive: true,
    plugins: { legend: { position: "bottom" as const } },
    scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: "On-time %" }, min: 60, max: 100 } },
  });

  // Dwell time distribution (first-mile pickup)
  const dwellData = {
    labels: ["0-15m","15-30m","30-45m","45-60m","60-90m","90m+"],
    datasets: [{
      label: "Pickup Dwell (Shipments %)",
      data: [18, 32, 22, 14, 9, 5],
      backgroundColor: "rgba(16,185,129,0.5)",
      borderColor: "rgba(16,185,129,1)",
    }]
  };
  const dwellOptions: any = buildChartOptions({
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true, max: 40, ticks: { callback: (v: any) => v + "%" } } },
  });

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detected capacity calendars & SLA issues; review and auto-fix.</p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Auto Fix with AI
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gapKPIs.map((k, idx) => {
          const Icon = k.icon as any;
          return (
            <Card key={idx} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lane Service Heat (Next 6 Weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={serviceHeatData} options={serviceHeatOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pickup Dwell Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={dwellData} options={dwellOptions} />
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
  const carrierPerf = [
    { carrier: "BlueTrans", otif: 96, avgCost: 12.8 },
    { carrier: "SwiftLines", otif: 92, avgCost: 11.9 },
    { carrier: "RoadRunner", otif: 88, avgCost: 10.6 },
  ];

  const otifBarData = {
    labels: carrierPerf.map(c => c.carrier),
    datasets: [{
      label: "OTIF %",
      data: carrierPerf.map(c => c.otif),
      backgroundColor: "rgba(59,130,246,0.5)",
      borderColor: "rgba(59,130,246,1)",
    }]
  };
  const otifBarOptions: any = buildChartOptions({
    scales: { y: { beginAtZero: true, max: 100 } },
    plugins: { legend: { position: "bottom" as const } },
  });

  const costMixData = {
    labels: ["First-mile","Mid-mile","Handling","Surcharges"],
    datasets: [{
      label: "Cost Mix",
      data: [26, 54, 12, 8],
      backgroundColor: ["rgba(16,185,129,0.5)","rgba(99,102,241,0.5)","rgba(245,158,11,0.5)","rgba(239,68,68,0.5)"],
      borderColor: ["rgba(16,185,129,1)","rgba(99,102,241,1)","rgba(245,158,11,1)","rgba(239,68,68,1)"],
      borderWidth: 1
    }]
  };

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Validate objective, constraints and carriers before building the plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Objective & Constraints</CardTitle></CardHeader>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Time Aggregation</div>
                <ToggleGroup type="single" value={timeAgg} onValueChange={(v) => v && (setTimeAgg(v as any))}>
                  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Objective</div>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Min Cost (service ≥ target)">Min Cost (service ≥ target)</SelectItem>
                    <SelectItem value="Max Service (cost ≤ budget)">Max Service (cost ≤ budget)</SelectItem>
                    <SelectItem value="Balance (cost-service)">Balance (cost-service)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Service Target</div>
                <Select value={serviceTarget} onValueChange={setServiceTarget}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90%">90%</SelectItem>
                    <SelectItem value="95%">95%</SelectItem>
                    <SelectItem value="98%">98%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Consolidation Window</div>
                <Select value={consolidationWindow} onValueChange={setConsolidationWindow}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="36h">36 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Carrier OTIF</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Bar data={otifBarData} options={otifBarOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Cost Mix</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <Pie data={costMixData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Preview</CardTitle></CardHeader>
        <CardContent>
          <WorkbookTable />
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

  // ---------- STEP 4: RESULTS ----------
  const kpiCards = [
    { label: "ON-TIME PICKUP", value: "94%", icon: Clock },
    { label: "FILL RATE", value: "89%", icon: Package },
    { label: "AVG LINEHAUL COST", value: "₹ 11.7 / kg", icon: DollarSign },
    { label: "AT-RISK SHIPMENTS", value: "6", icon: AlertTriangle },
  ] as const;

  // Charts
  const costTrend = {
    labels: ["W1","W2","W3","W4","W5","W6","W7","W8"],
    datasets: [{
      label: "Avg Cost per Kg",
      data: [12.3, 12.1, 11.9, 11.8, 12.0, 11.7, 11.6, 11.7],
      borderColor: hslVar("--primary"),
      backgroundColor: hslVar("--primary", 0.2),
      fill: true,
      tension: 0.35
    }]
  };
  const costTrendOptions: any = buildChartOptions({
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { title: { display: true, text: "₹ / kg" } } }
  });

  const laneFillBar = {
    labels: ["BAN–BLR–CJB","PUN–MUM","NCR–LKO","BLR–HYD","CJB–BLR"],
    datasets: [{
      label: "Fill Rate %",
      data: [92, 86, 79, 88, 83],
      backgroundColor: "rgba(99,102,241,0.5)",
      borderColor: "rgba(99,102,241,1)"
    }]
  };
  const laneFillOptions: any = buildChartOptions({
    indexAxis: "y",
    scales: { x: { beginAtZero: true, max: 100 } },
    plugins: { legend: { display: false } }
  });

  const consolidationImpact = {
    labels: ["W1","W2","W3","W4","W5","W6"],
    datasets: [
      { label: "Savings (₹ L)", data: [3.2, 2.8, 3.6, 3.1, 3.7, 3.3], backgroundColor: "rgba(16,185,129,0.5)", borderColor: "rgba(16,185,129,1)", stack: "impact" },
      { label: "Extra Dwell (hrs)", data: [2.1, 1.8, 2.5, 2.0, 2.4, 1.9], backgroundColor: "rgba(245,158,11,0.5)", borderColor: "rgba(245,158,11,1)", stack: "impact" },
    ]
  };
  const consolidationOptions: any = buildChartOptions({
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true } }
  });

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-card border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">First & Mid‑mile Plan</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        {/* KPI Cards */}
        <div className="space-y-4">
          {kpiCards.map((k, idx) => {
            const Icon = k.icon as any;
            const tabs = ["overview","lanes","routes","costs"] as const;
            const mapToTab = tabs[idx] || "overview";
            return (
              <Card
                key={idx}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === mapToTab ? "ring-2 ring-blue-400/30" : ""}`}
                onClick={() => setActiveTab(mapToTab as any)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
                    <p className="text-2xl font-bold text-foreground">{k.value}</p>
                  </div>
                  <Icon className="w-8 h-8" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Planning Overview"}
              {activeTab === "lanes" && "Lane Performance"}
              {activeTab === "routes" && "Route Plans (Vehicles)"} 
              {activeTab === "shipments" && "Shipments"} 
              {activeTab === "costs" && "Cost Trends"}
              {activeTab === "workbook" && "Planning Workbook"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Service, fill and cost posture"} 
              {activeTab === "lanes" && "Fill rate and reliability by lane"}
              {activeTab === "routes" && "All plans drawn; select a vehicle to focus route"} 
              {activeTab === "shipments" && "Planned and at-risk shipments"}
              {activeTab === "costs" && "Cost per kg and spend mix"}
              {activeTab === "workbook" && "Interactive data table with collaboration features"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              ← Back
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <Card className="shadow-card border-0 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Avg Cost per Kg (Trend)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[360px]">
                <Line data={costTrend} options={costTrendOptions} />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "lanes" && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Fill Rate by Lane
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <Bar data={laneFillBar} options={laneFillOptions} />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "routes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map: takes 2 cols on large screens */}
            <Card className="shadow-card border-0 lg:col-span-2">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Vehicle Route Plans (Interactive Map)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant={selectedPlanId ? "outline" : "default"} onClick={() => setSelectedPlanId(null)}>
                    Show All
                  </Button>
                  {selectedPlan && (
                    <Badge variant="secondary" className="ml-2">
                      Focusing: {selectedPlan.vehicle}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[520px] rounded-lg overflow-hidden border bg-muted">
                  <MapContainer style={{ height: "100%", width: "100%" }} center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitToBounds selected={selectedPlan || null} />
                    {/* Draw all plans (thin) */}
                    {PLANS.map(plan => (
                      <Polyline
                        key={plan.id}
                        positions={plan.stops.map(s => s.coords)}
                        pathOptions={{ color: plan.color, weight: selectedPlanId === plan.id ? 7 : 4, opacity: selectedPlanId && selectedPlanId !== plan.id ? 0.25 : 0.9 }}
                      />
                    ))}
                    {/* Markers only for the selected plan (reduces clutter) */}
                    {(selectedPlan || null) && selectedPlan!.stops.map((s, idx) => (
                      <Marker key={s.id} position={s.coords}>
                        <Popup>
                          <div className="text-sm">
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-muted-foreground">{s.type}</div>
                            {s.eta && <div className="text-muted-foreground">ETA: {s.eta}</div>}
                            {s.note && <div className="text-muted-foreground">{s.note}</div>}
                            <div className="mt-1 text-xs text-muted-foreground">Seq: {idx + 1}</div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Plans list */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Plans (Vehicles)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PLANS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedPlanId === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                          <div>
                            <div className="font-medium text-sm">{p.vehicle}</div>
                            <div className="text-xs text-muted-foreground">{p.lane}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{Math.round(p.utilization * 100)}% util</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Package className="w-3 h-3" /> Cap {p.capacity}</div>
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Stops {p.stops.length}</div>
                        <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ₹/kg {p.costPerKg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "costs" && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Cost Trends & Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <Line data={costTrend} options={costTrendOptions} />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie data={{ labels: ["First-mile","Mid-mile","Handling","Surcharges"], datasets: [{ label: "Cost Mix", data: [26, 54, 12, 8], backgroundColor: ["rgba(16,185,129,0.5)","rgba(99,102,241,0.5)","rgba(245,158,11,0.5)","rgba(239,68,68,0.5)"], borderColor: ["rgba(16,185,129,1)","rgba(99,102,241,1)","rgba(245,158,11,1)","rgba(239,68,68,1)"] }] }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <ModernStepper steps={stepperSteps as any} title="First & Mid‑mile Optimization" />
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default FirstMidMileOptimizationFlow;