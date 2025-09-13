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
  AlertTriangle,
  AlertCircle,
  Settings,
  Share,
  MoreHorizontal,
  Package,
  Truck,
  Boxes,
  ShieldCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ModernStepper } from "@/components/ModernStepper";
import WorkbookTable from "@/components/WorkbookTable";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";

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

type Uploaded = File | null;

const RawMaterialPlanning = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, Uploaded>>({
    bom: null,
    materials: null,
    demand: null,
    onhand: null,
    openpo: null,
    suppliers: null,
    policies: null,
  });

  const [selectedPreview, setSelectedPreview] = useState<keyof typeof uploadedFiles | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  // Results tab state (consistent layout)
  const [activeTab, setActiveTab] = useState<"overview" | "suppliers" | "materials" | "purchase" | "workbook">("overview");

  // Step 3 config states
  const [horizon, setHorizon] = useState<string>("12 Weeks");
  const [reorderPolicy, setReorderPolicy] = useState<string>("Continuous (s,S)");
  const [serviceLevel, setServiceLevel] = useState<string>("95%");
  const [aggregation, setAggregation] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  // --- UI Stepper ---
  const stepperSteps = [
    { id: 1, title: "Add Data", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, title: "Data Gaps", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, title: "Review Data", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
    { id: 4, title: "Results", status: currentStep === 4 ? "active" : "pending" },
  ] as const;

  // --- External drivers for planning ---
  const externalDrivers = [
    { name: "Supplier Lead Times", autoSelected: true },
    { name: "MOQ / Price Breaks", autoSelected: true },
    { name: "Transit & Customs", autoSelected: false },
    { name: "Quality Hold Buffer", autoSelected: false },
    { name: "Safety Stock Policy", autoSelected: true },
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
        <p className="text-sm text-muted-foreground">Upload BOM, Material Master, Demand, On-hand, Open POs, Suppliers, and Inventory Policies.</p>
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
                  else if (name.includes("material") || name.includes("sku") || name.includes("item")) newUploaded.materials = file;
                  else if (name.includes("demand") || name.includes("forecast")) newUploaded.demand = file;
                  else if (name.includes("onhand") || name.includes("inventory") || name.includes("stock")) newUploaded.onhand = file;
                  else if (name.includes("openpo") || name.includes("po") || name.includes("purchase")) newUploaded.openpo = file;
                  else if (name.includes("supplier") || name.includes("vendor")) newUploaded.suppliers = file;
                  else if (name.includes("policy") || name.includes("safety")) newUploaded.policies = file;
                  else {
                    for (const key of Object.keys(newUploaded)) {
                      if (!(newUploaded as any)[key]) { (newUploaded as any)[key] = file; break; }
                    }
                  }
                });
                setUploadedFiles(newUploaded);
                const first = (Object.keys(newUploaded) as (keyof typeof uploadedFiles)[]).find(k => newUploaded[k]);
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
                ) : (
                  <span className="text-muted-foreground">Not uploaded</span>
                )}
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
                      <th className="text-left px-3 py-2">Item</th>
                      <th className="text-left px-3 py-2">Desc</th>
                      <th className="text-left px-3 py-2">UOM</th>
                      <th className="text-left px-3 py-2">Lead Time</th>
                      <th className="text-left px-3 py-2">MOQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">RM-1001</td>
                      <td className="px-3 py-2">Steel Coil</td>
                      <td className="px-3 py-2">Kg</td>
                      <td className="px-3 py-2">14 d</td>
                      <td className="px-3 py-2">1,000</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="px-3 py-2">RM-2005</td>
                      <td className="px-3 py-2">Resin A32</td>
                      <td className="px-3 py-2">Kg</td>
                      <td className="px-3 py-2">21 d</td>
                      <td className="px-3 py-2">500</td>
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
    { label: "Completeness", value: "98.3%", icon: CheckCircle },
    { label: "Missing Lead Times", value: "4", icon: AlertCircle },
    { label: "MOQ Mismatch", value: "3", icon: AlertTriangle },
    { label: "Stockouts (Next 4w)", value: "2", icon: AlertTriangle },
  ] as const;

  // Shortage heat (items vs weeks)
  const heatLabels = ["W1", "W2", "W3", "W4", "W5", "W6"];
  const matLabels = ["RM-1001", "RM-2005", "RM-3402", "RM-4010", "RM-8801"];
  const heatData = {
    labels: heatLabels,
    datasets: matLabels.map((m, i) => ({
      label: m,
      data: [2, 1, 0, 3, 1, 0].map((v, j) => (i + j) % 3 === 0 ? v + 2 : v),
      backgroundColor: hslVar("--primary", 0.12 + (i * 0.06)),
      borderColor: hslVar("--primary"),
      borderWidth: 1,
      stack: "shortages",
    })),
  };
  const heatOptions: any = buildChartOptions({
    responsive: true,
    plugins: { legend: { position: "bottom" as const } },
    scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: "Shortage (days)" } } }
  });

  const renderStep2 = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
          <p className="text-sm text-muted-foreground">AI detected lead time, MOQ and policy issues; review and auto-fix.</p>
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
            <CardTitle className="text-base">Shortage Heat (Next 6 Weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={heatData} options={heatOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Unknown supplier lead time for RM-3402 and RM-8801</li>
              <li>MOQ higher than weekly demand causing excess inventory</li>
              <li>Safety stock not aligned with service level (95%)</li>
              <li>Open POs without promised date</li>
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
  const supplierSummary = [
    { supplier: "Alpha Metals", items: 8, avgLT: 12, otif: 96 },
    { supplier: "Novaresin", items: 5, avgLT: 21, otif: 92 },
    { supplier: "ChemPro", items: 11, avgLT: 18, otif: 88 },
  ];

  const otifBarData = {
    labels: supplierSummary.map((s) => s.supplier),
    datasets: [{
      label: "OTIF %",
      data: supplierSummary.map((s) => s.otif),
      backgroundColor: "rgba(59,130,246,0.5)",
      borderColor: "rgba(59,130,246,1)",
    }]
  };
  const otifBarOptions: any = buildChartOptions({
    scales: { y: { beginAtZero: true, max: 100 } },
    plugins: { legend: { position: "bottom" as const } },
  });

  const policyPieData = {
    labels: ["(s,S) Continuous", "Periodic Review", "Min-Max"],
    datasets: [{
      label: "Policy Mix",
      data: [48, 32, 20],
      backgroundColor: ["rgba(16,185,129,0.5)","rgba(245,158,11,0.5)","rgba(59,130,246,0.5)"],
      borderColor: ["rgba(16,185,129,1)","rgba(245,158,11,1)","rgba(59,130,246,1)"],
      borderWidth: 1
    }]
  };

  const renderStep3 = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review Data</h2>
        <p className="text-sm text-muted-foreground">Validate suppliers, policies and risk before creating a purchase plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Policy & Objective</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Planning Horizon</div>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8 Weeks">8 Weeks</SelectItem>
                    <SelectItem value="12 Weeks">12 Weeks</SelectItem>
                    <SelectItem value="16 Weeks">16 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Aggregation</div>
                <ToggleGroup type="single" value={aggregation} onValueChange={(v) => v && setAggregation(v as any)}>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Reorder Policy</div>
                <Select value={reorderPolicy} onValueChange={setReorderPolicy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Continuous (s,S)">(s,S) Continuous</SelectItem>
                    <SelectItem value="Periodic Review">Periodic Review</SelectItem>
                    <SelectItem value="Min/Max">Min/Max</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Service Level</div>
                <Select value={serviceLevel} onValueChange={setServiceLevel}>
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

        <Card>
          <CardHeader><CardTitle className="text-base">Supplier Performance (OTIF)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Bar data={otifBarData} options={otifBarOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Policy Mix</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <Pie data={policyPieData} />
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

  // ---------- STEP 4: RESULTS (consistent layout) ----------

  const kpiCards = [
    { label: "TOTAL ITEMS", value: "152", icon: Boxes },
    { label: "STOCKOUT RISK", value: "7", icon: AlertTriangle },
    { label: "COVERAGE (WKS)", value: "5.8", icon: ShieldCheck },
    { label: "OPEN PO VALUE", value: "₹ 1.9 Cr", icon: Truck },
  ] as const;

  // Charts for results
  const coverageData = {
    labels: ["W1","W2","W3","W4","W5","W6","W7","W8"],
    datasets: [
      {
        label: "Avg Coverage (weeks)",
        data: [6.2,5.9,5.6,5.4,5.9,6.1,6.0,5.8],
        borderColor: hslVar("--primary"),
        backgroundColor: hslVar("--primary", 0.2),
        fill: true,
        tension: 0.35,
      },
    ],
  };
  const coverageOptions: any = buildChartOptions({
    scales: { y: { beginAtZero: false } },
    plugins: { legend: { position: "bottom" as const } },
  });

  const purchaseBarData = {
    labels: ["Steel Coil","Resin A32","Solvent B12","Pigment P7","Alumina"],
    datasets: [
      {
        label: "Recommended PO Qty",
        data: [12000, 4800, 2200, 900, 3000],
        backgroundColor: "rgba(99,102,241,0.5)",
        borderColor: "rgba(99,102,241,1)",
      }
    ]
  };
  const purchaseBarOptions: any = buildChartOptions({
    indexAxis: "y",
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  });

  const supplierPieData = {
    labels: ["Alpha Metals","Novaresin","ChemPro","GlobalPigments"],
    datasets: [{
      label: "Spend Share",
      data: [46, 28, 18, 8],
      backgroundColor: ["rgba(37,99,235,0.55)","rgba(16,185,129,0.55)","rgba(245,158,11,0.55)","rgba(239,68,68,0.55)"],
      borderColor: ["rgba(37,99,235,1)","rgba(16,185,129,1)","rgba(245,158,11,1)","rgba(239,68,68,1)"],
      borderWidth: 1
    }]
  };

  const renderStep4 = () => (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-card border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Raw Material Plan</h2>
          <p className="text-sm text-muted-foreground">Click cards to explore insights</p>
        </div>

        {/* Clickable Metric Cards */}
        <div className="space-y-4">
          <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "overview" ? "ring-2 ring-blue-400/30" : ""}`} onClick={() => setActiveTab("overview")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{kpiCards[0].label}</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{kpiCards[0].value}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">active SKUs</p>
              </div>
              <Boxes className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "materials" ? "ring-2 ring-amber-400/30" : ""}`} onClick={() => setActiveTab("materials")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{kpiCards[1].label}</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{kpiCards[1].value}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">items flagged</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "purchase" ? "ring-2 ring-emerald-400/30" : ""}`} onClick={() => setActiveTab("purchase")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{kpiCards[2].label}</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{kpiCards[2].value}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">average</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${activeTab === "suppliers" ? "ring-2 ring-purple-400/30" : ""}`} onClick={() => setActiveTab("suppliers")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{kpiCards[3].label}</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">Spend Mix</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">top 4 suppliers</p>
              </div>
              <Truck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>
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
              {activeTab === "suppliers" && "Suppliers"}
              {activeTab === "materials" && "Materials at Risk"}
              {activeTab === "purchase" && "Recommended Purchase Plan"}
              {activeTab === "workbook" && "Planning Workbook"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "overview" && "Coverage, risk and overall material posture"}
              {activeTab === "suppliers" && "Spend mix and supplier performance"}
              {activeTab === "materials" && "Items flagged for stockout or MOQ issues"}
              {activeTab === "purchase" && "Quantities and timing to meet service level"}
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

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">5.8</div>
                  <div className="text-sm text-muted-foreground">Avg. Coverage (Weeks)</div>
                  <div className="text-xs text-muted-foreground mt-1">Service Level Target</div>
                  <div className="text-lg font-semibold text-primary mt-2">95%</div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-lg text-muted-foreground mb-2">Purchase Value (Next 4w)</div>
                  <div className="text-3xl font-bold text-primary mb-2">₹ 74.3L</div>
                  <div className="text-sm text-muted-foreground">across 24 POs</div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Card className="shadow-card border-0">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Top Risk Item</span>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">
                        RM-2005 Resin A32
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Coverage 1.6 weeks, MOQ=500</div>
                  </CardContent>
                </Card>
                <Card className="shadow-card border-0">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Critical Supplier</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                        Alpha Metals
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">48% of spend, OTIF 96%</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-card border-0 mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Coverage Trend</CardTitle>
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
                      <DropdownMenuSubTrigger>Aggregation</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={aggregation} onValueChange={(v) => setAggregation((v as any) || "weekly")}>
                          <DropdownMenuRadioItem value="weekly">Weekly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="monthly">Monthly</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[360px]">
                  <Line data={coverageData} options={coverageOptions} />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "materials" && (
          <Card className="shadow-card border-0">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Items at Risk</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search materials..." className="pl-10 w-56" />
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground">Item</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Description</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Coverage (wks)</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">MOQ</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Supplier</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/10">
                      <td className="py-3 px-4 font-medium">RM-2005</td>
                      <td className="py-3 px-4">Resin A32</td>
                      <td className="py-3 px-4">1.6</td>
                      <td className="py-3 px-4">500</td>
                      <td className="py-3 px-4">Novaresin</td>
                      <td className="py-3 px-4"><Badge variant="secondary" className="bg-warning/20 text-warning">Expedite</Badge></td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/10">
                      <td className="py-3 px-4 font-medium">RM-3402</td>
                      <td className="py-3 px-4">Solvent B12</td>
                      <td className="py-3 px-4">2.1</td>
                      <td className="py-3 px-4">1000</td>
                      <td className="py-3 px-4">ChemPro</td>
                      <td className="py-3 px-4"><Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Order</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "purchase" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recommended PO Quantities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={purchaseBarData} options={purchaseBarOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Spend Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie data={supplierPieData} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "suppliers" && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" /> Supplier Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground">Supplier</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Items</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Avg LT (d)</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">OTIF %</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierSummary.map((s,i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/10">
                        <td className="py-3 px-4 font-medium">{s.supplier}</td>
                        <td className="py-3 px-4">{s.items}</td>
                        <td className="py-3 px-4">{s.avgLT}</td>
                        <td className="py-3 px-4"><Badge variant="secondary" className={s.otif >= 95 ? "bg-success/20 text-success":"bg-warning/20 text-warning"}>{s.otif}</Badge></td>
                        <td className="py-3 px-4">{s.otif >= 95 ? "Preferred" : "Improve terms"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "workbook" && (
          <div className="mb-6">
            <WorkbookTable />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <ModernStepper steps={stepperSteps as any} title="Raw Material Planning" />
      <div className="p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default RawMaterialPlanning;
