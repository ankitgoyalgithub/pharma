// Foundry.tsx — Popup Create Entity (5-step) + Inline Data Health page (no popup) + source-specific Query step
import React, { useMemo, useState } from "react";
import { AppendDataDialog } from "@/components/AppendDataDialog";
import { AutoFixSuggestionsPanel } from "@/components/AutoFixSuggestionsPanel";
import { SynqAIAssistant } from "@/components/SynqAIAssistant";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  RefreshCcw,
  Eye,
  Database,
  Clock,
  Plus,
  FolderPlus,
  ListChecks,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle2,
  Filter,
  FileUp,
  Wand2,
  PieChart as PieChartIcon,
  Gauge,
  Activity,
  BarChart3,
  Sparkles,
  X,
  PlusCircle,
} from "lucide-react";

// shadcn/ui extras
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Chart.js (used for Data Health dashboard)
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
  Title as ChartTitleJS,
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
  ChartTitleJS
);

// Remove these image imports - now in shared sourceIcons file

import { 
  SourceType, 
  EntityType, 
  EntityModule, 
  masterEntities, 
  timeseriesEntities, 
  featureStoreEntities,
  sourceTypeIcon
} from "@/data/foundry";

// ---------- Create Entity Wizard Types ----------
interface SourcePreviewRow {
  [key: string]: string | number | null;
}

interface FieldDef {
  sourceName: string;
  newName: string;
  dataType: string;
  sample: string | number | null;
  isNew?: boolean; // for added (formula) fields
  expression?: string; // for formula fields
}

// a tiny mock of preview rows
const MOCK_PREVIEW: SourcePreviewRow[] = [
  { product_id: "P-1001", product_name: "Widget A", uom: "EA", price: 12.5 },
  { product_id: "P-1002", product_name: "Widget B", uom: "EA", price: 17.0 },
  { product_id: "P-1003", product_name: "Widget C", uom: "EA", price: 9.99 },
];

const inferFieldsFromPreview = (rows: SourcePreviewRow[]): FieldDef[] => {
  const first = rows[0] || {};
  return Object.keys(first).map((k) => ({
    sourceName: k,
    newName: k,
    dataType: typeof first[k] === "number" ? "number" : "string",
    sample: first[k] ?? null,
  }));
};

// helpers
const projectRows = (rows: SourcePreviewRow[], columns: string[] | null) => {
  if (!rows.length) return rows;
  if (!columns || columns.length === 0) return rows;
  return rows.map((r) => {
    const obj: SourcePreviewRow = {};
    columns.forEach((c) => {
      obj[c] = r[c] ?? null;
    });
    return obj;
  });
};

export default function Foundry() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handlePreview = (module: EntityModule) => navigate(module.route);
  const handleSync = (module: EntityModule) => {
    if (module.origin === "csv") {
      // Handle append workflow for CSV entities
      setSelectedAppendEntity(module.title);
      setOpenAppendDialog(true);
    } else {
      console.log("Sync", module.title);
    }
  };
  const handleEdit = (module: EntityModule) => console.log("Edit", module.title);
  const handleDelete = (module: EntityModule) => console.log("Delete", module.title);
  const handleExport = (module: EntityModule) => console.log("Export", module.title);

  const filteredModules = (modules: EntityModule[]) => {
    if (!searchQuery) return modules;
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------- Inline Data Health (no popup) ----------
  const [showHealth, setShowHealth] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Mock health KPIs - entity specific
  interface KPI {
    label: string;
    value: string;
    icon: any;
    tone: string;
    bg: string;
  }

  const getEntityKpis = (entityName: string): KPI[] => {
    const baseKpis: KPI[] = [
      { label: "Completeness", value: "97.4%", icon: Gauge, tone: "text-green-600", bg: "from-green-500/10 to-green-500/5" },
      { label: "Freshness (hrs)", value: "2.3", icon: Activity, tone: "text-blue-600", bg: "from-blue-500/10 to-blue-500/5" },
      { label: "Duplicates", value: "0.8%", icon: BarChart3, tone: "text-amber-600", bg: "from-amber-500/10 to-amber-500/5" },
      { label: "Outliers", value: "0.4%", icon: Sparkles, tone: "text-purple-600", bg: "from-purple-500/10 to-purple-500/5" },
    ];

    if (entityName === "all") return baseKpis;
    
    // Mock entity-specific variations
    const variations: Record<string, KPI[]> = {
      "Product Master": [
        { label: "Completeness", value: "98.1%", icon: Gauge, tone: "text-green-600", bg: "from-green-500/10 to-green-500/5" },
        { label: "Freshness (hrs)", value: "1.2", icon: Activity, tone: "text-green-600", bg: "from-green-500/10 to-green-500/5" },
        { label: "Duplicates", value: "0.3%", icon: BarChart3, tone: "text-green-600", bg: "from-green-500/10 to-green-500/5" },
        { label: "Outliers", value: "0.1%", icon: Sparkles, tone: "text-green-600", bg: "from-green-500/10 to-green-500/5" },
      ],
      "Sales History": [
        { label: "Completeness", value: "94.2%", icon: Gauge, tone: "text-amber-600", bg: "from-amber-500/10 to-amber-500/5" },
        { label: "Freshness (hrs)", value: "4.8", icon: Activity, tone: "text-red-600", bg: "from-red-500/10 to-red-500/5" },
        { label: "Duplicates", value: "2.1%", icon: BarChart3, tone: "text-red-600", bg: "from-red-500/10 to-red-500/5" },
        { label: "Outliers", value: "1.2%", icon: Sparkles, tone: "text-amber-600", bg: "from-amber-500/10 to-amber-500/5" },
      ],
    };

    return variations[entityName] || baseKpis;
  };

  const kpis = getEntityKpis(selectedEntity);

  // Enhanced charts with entity-specific data
  const getIngestionTrend = (entityName: string) => {
    const baseTrend = [120000, 150000, 160000, 170000, 165000, 180000, 175000];
    const entityTrends: Record<string, number[]> = {
      "Product Master": [3582, 3582, 3585, 3589, 3592, 3595, 3598],
      "Sales History": [12000, 13500, 14200, 15100, 14800, 16200, 15900],
      "Location Master": [213, 213, 213, 215, 215, 216, 216],
      "Copper Prices": [840, 842, 844, 846, 848, 850, 852],
    };

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: `${entityName === "all" ? "Total" : entityName} Rows`,
          data: entityName === "all" ? baseTrend : entityTrends[entityName] || baseTrend,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          backgroundColor: "rgba(59,130,246,0.15)",
          borderColor: "rgba(59,130,246,1)",
        },
      ],
    } as any;
  };

  const ingestionTrend = getIngestionTrend(selectedEntity);

  const ingestionOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true } },
  };

  // Enhanced data quality charts
  const getQualityMetrics = (entityName: string) => {
    const baseNulls = {
      labels: ["price", "uom", "product_name", "location_id", "category"],
      datasets: [
        {
          label: "% Nulls",
          data: [0.2, 0, 1.8, 0.4, 0.1],
          borderWidth: 1,
          backgroundColor: "rgba(234,88,12,0.5)",
        },
      ],
    };

    const entityNulls: Record<string, any> = {
      "Product Master": {
        labels: ["name", "category", "uom", "price", "active"],
        datasets: [
          {
            label: "% Nulls",
            data: [0.1, 0.3, 0, 0.5, 0],
            backgroundColor: "rgba(34,197,94,0.5)",
          },
        ],
      },
      "Sales History": {
        labels: ["date", "sku", "location", "units", "revenue"],
        datasets: [
          {
            label: "% Nulls",
            data: [0, 0.2, 0.8, 1.2, 0.5],
            backgroundColor: "rgba(239,68,68,0.5)",
          },
        ],
      },
    };

    return entityName === "all" ? baseNulls : entityNulls[entityName] || baseNulls;
  };

  const nullsByColumn = getQualityMetrics(selectedEntity);

  // Data volume trends with time range support
  const getVolumeTrend = (range: string) => {
    const labels = range === "7d" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
                   range === "30d" ? ["Week 1", "Week 2", "Week 3", "Week 4"] :
                   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    const data = range === "7d" ? [45, 52, 48, 61, 58, 67, 73] :
                 range === "30d" ? [180, 195, 210, 225] :
                 [420, 445, 468, 492, 515, 540, 565, 590, 615];
    
    return {
      labels,
      datasets: [
        {
          label: "Data Volume (GB)",
          data,
          backgroundColor: "rgba(16,185,129,0.2)",
          borderColor: "rgba(16,185,129,1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const volumeTrend = getVolumeTrend(timeRange);

  // Anomaly detection timeline
  const anomalyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Anomalies Detected",
        data: [3, 1, 7, 2],
        backgroundColor: "rgba(239,68,68,0.7)",
        borderRadius: 4,
      },
      {
        label: "Anomalies Resolved",
        data: [2, 1, 5, 2],
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 4,
      },
    ],
  };

  // Quality score trend
  const qualityScoreTrend = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Overall Quality Score",
        data: [92, 94, 91, 97],
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Target Quality",
        data: [95, 95, 95, 95],
        backgroundColor: "rgba(34,197,94,0.1)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  // Data freshness heatmap data
  const freshnessHeatmap = [
    { entity: "Product Master", Mon: 1.2, Tue: 1.5, Wed: 1.1, Thu: 1.8, Fri: 1.3, Sat: 2.1, Sun: 1.9 },
    { entity: "Sales History", Mon: 4.8, Tue: 5.2, Wed: 4.5, Thu: 5.8, Fri: 4.2, Sat: 6.1, Sun: 5.5 },
    { entity: "Location Master", Mon: 0.8, Tue: 0.9, Wed: 0.7, Thu: 1.1, Fri: 0.9, Sat: 1.3, Sun: 1.2 },
    { entity: "Inventory Data", Mon: 2.1, Tue: 2.4, Wed: 2.0, Thu: 2.7, Fri: 2.2, Sat: 3.1, Sun: 2.8 },
  ];

  // Data quality issues
  const qualityIssues = [
    { id: "1", entity: "Sales History", type: "Missing Values", severity: "High", count: 847, field: "revenue", trend: "+12%" },
    { id: "2", entity: "Product Master", type: "Duplicates", severity: "Medium", count: 23, field: "product_id", trend: "-5%" },
    { id: "3", entity: "Location Master", type: "Outliers", severity: "Low", count: 8, field: "coordinates", trend: "0%" },
    { id: "4", entity: "Inventory Data", type: "Stale Data", severity: "High", count: 156, field: "last_updated", trend: "+8%" },
    { id: "5", entity: "Customer Master", type: "Format Issues", severity: "Medium", count: 42, field: "phone", trend: "-3%" },
  ];

  const dtypeDistribution = {
    labels: ["string", "number", "integer", "boolean", "date", "timestamp"],
    datasets: [
      {
        label: "Columns",
        data: [8, 5, 3, 1, 2, 1],
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(16,185,129,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(245,158,11,0.8)",
          "rgba(244,63,94,0.8)",
          "rgba(99,163,0,0.8)",
        ],
      },
    ],
  };

  const barCommon: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true } },
  };

  // Enhanced schema drift with more detailed tracking
  const schemaDriftRows = [
    { version: "v1.8.0", date: "2024-01-15", added: 1, removed: 0, renamed: 0, broken: 0, impact: "Low" },
    { version: "v1.7.0", date: "2024-01-10", added: 0, removed: 0, renamed: 1, broken: 0, impact: "Medium" },
    { version: "v1.6.0", date: "2024-01-05", added: 0, removed: 1, renamed: 0, broken: 0, impact: "Low" },
    { version: "v1.5.0", date: "2024-01-01", added: 2, removed: 0, renamed: 0, broken: 1, impact: "High" },
    { version: "v1.4.0", date: "2023-12-28", added: 0, removed: 0, renamed: 0, broken: 0, impact: "None" },
  ];

  // All entities for dropdown
  const allEntities = ["all", ...masterEntities.map(e => e.title), ...timeseriesEntities.map(e => e.title), ...featureStoreEntities.map(e => e.title)];

  // ---------- Create Entity Wizard State ----------
  const [openWizard, setOpenWizard] = useState(false);
  const [openAppendDialog, setOpenAppendDialog] = useState(false);
  const [selectedAppendEntity, setSelectedAppendEntity] = useState<string>("");
  type StepType = 1 | 2 | 3 | 4 | 5;
  const [step, setStep] = useState<StepType>(1);

  // Step 1
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("master");
  const [snapshotEnabled, setSnapshotEnabled] = useState(true);
  const [source, setSource] = useState<SourceType | null>(null);

  // Step 2 (Query & Preview) — source-specific configs
  // Generic SQL-like sources
  const [sqlQuery, setSqlQuery] = useState("");
  // Salesforce
  const [sfObject, setSfObject] = useState<string | null>(null);
  const [sfFields, setSfFields] = useState<string[]>([]);
  const [sfFilters, setSfFilters] = useState<{ field: string; op: string; value: string }[]>([{ field: "", op: "=", value: "" }]);
  // Google Drive
  const [gdFile, setGdFile] = useState<string | null>(null);
  const [gdColumns, setGdColumns] = useState<string[]>([]);
  const [gdFilters, setGdFilters] = useState<{ column: string; op: string; value: string }[]>([{ column: "", op: "=", value: "" }]);
  // S3 / CSV / Upload
  const [filePath, setFilePath] = useState("");
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [fileFilters, setFileFilters] = useState<{ column: string; op: string; value: string }[]>([{ column: "", op: "=", value: "" }]);

  const [hasPreview, setHasPreview] = useState(false);
  const [previewRows, setPreviewRows] = useState<SourcePreviewRow[]>([]);

  // Step 3 (Fields & Formulae)
  const initialFields = useMemo(() => inferFieldsFromPreview(previewRows), [previewRows]);
  const [fields, setFields] = useState<FieldDef[]>(initialFields);

  // derived for review
  const queryDisplay: string = useMemo(() => {
    if (!source) return "(none)";
    if (["snowflake", "oracle", "sap", "hdfs"].includes(source)) {
      return sqlQuery || "(SQL not set)";
    }
    if (source === "salesforce") {
      const flds = sfFields.length ? sfFields.join(", ") : "*";
      const where = sfFilters.filter(f => f.field && f.value).map(f => `${f.field} ${f.op} '${f.value}'`).join(" AND ");
      return `SELECT ${flds} FROM ${sfObject || "<Object>"}${where ? " WHERE " + where : ""}`;
    }
    if (source === "gdrive") {
      const cols = gdColumns.length ? gdColumns.join(", ") : "*";
      const where = gdFilters.filter(f => f.column && f.value).map(f => `${f.column} ${f.op} '${f.value}'`).join(" AND ");
      return `FILE ${gdFile || "<Select File>"} | COLUMNS ${cols}${where ? " | FILTER " + where : ""}`;
    }
    // s3/csv/upload
    const cols = fileColumns.length ? fileColumns.join(", ") : "*";
    const where = fileFilters.filter(f => f.column && f.value).map(f => `${f.column} ${f.op} '${f.value}'`).join(" AND ");
    return `PATH ${filePath || "<path>"} | COLUMNS ${cols}${where ? " | FILTER " + where : ""}`;
  }, [source, sqlQuery, sfObject, sfFields, sfFilters, gdFile, gdColumns, gdFilters, filePath, fileColumns, fileFilters]);

  const reviewSummary = useMemo(
    () => ({
      name: entityName || "(unnamed)",
      type: entityType,
      source: source ?? "(not selected)",
      snapshot: snapshotEnabled,
      fieldCount: fields.length,
      newFields: fields.filter((f) => f.isNew).length,
      query: queryDisplay,
    }),
    [entityName, entityType, source, snapshotEnabled, fields, queryDisplay]
  );

  // Reset preview whenever source or its config changes (soft reset to require rerun)
  const softResetPreview = () => {
    setHasPreview(false);
    setPreviewRows([]);
    setFields([]);
  };

  // Handlers to mutate filters
  const updateSfFilter = (i: number, patch: Partial<{ field: string; op: string; value: string }>) => {
    setSfFilters(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
    softResetPreview();
  };
  const addSfFilter = () => setSfFilters(prev => [...prev, { field: "", op: "=", value: "" }]);
  const removeSfFilter = (i: number) => setSfFilters(prev => prev.filter((_, idx) => idx !== i));

  const updateGdFilter = (i: number, patch: Partial<{ column: string; op: string; value: string }>) => {
    setGdFilters(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
    softResetPreview();
  };
  const addGdFilter = () => setGdFilters(prev => [...prev, { column: "", op: "=", value: "" }]);
  const removeGdFilter = (i: number) => setGdFilters(prev => prev.filter((_, idx) => idx !== i));

  const updateFileFilter = (i: number, patch: Partial<{ column: string; op: string; value: string }>) => {
    setFileFilters(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
    softResetPreview();
  };
  const addFileFilter = () => setFileFilters(prev => [...prev, { column: "", op: "=", value: "" }]);
  const removeFileFilter = (i: number) => setFileFilters(prev => prev.filter((_, idx) => idx !== i));

  const handleRunPreview = () => {
    if (!source) {
      console.warn("Select a source first");
      setHasPreview(false);
      setPreviewRows([]);
      setFields([]);
      return;
    }

    // Simulate preview by projecting MOCK_PREVIEW using selected columns per source
    let selectedCols: string[] | null = null;
    if (source === "salesforce") selectedCols = sfFields.length ? sfFields : null;
    else if (source === "gdrive") selectedCols = gdColumns.length ? gdColumns : null;
    else if (["csv", "s3", "upload_csv"].includes(source)) selectedCols = fileColumns.length ? fileColumns : null;
    else selectedCols = null; // SQL-like uses whatever query returns (use all mock columns)

    const rows = projectRows(MOCK_PREVIEW, selectedCols);
    setPreviewRows(rows);
    setHasPreview(true);
    const inferred = inferFieldsFromPreview(rows);
    setFields(inferred);
  };

  const addFormulaField = () => {
    const idx = fields.filter((f) => f.isNew).length + 1;
    setFields((prev) => [
      ...prev,
      {
        sourceName: `formula_${idx}`,
        newName: `formula_${idx}`,
        dataType: "number",
        sample: null,
        isNew: true,
        expression: "",
      },
    ]);
  };

  const updateField = (index: number, patch: Partial<FieldDef>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const gotoNext = () => setStep((s) => (Math.min(5, (s + 1)) as StepType));
  const gotoPrev = () => setStep((s) => (Math.max(1, (s - 1)) as StepType));
  const closeWizard = () => {
    setOpenWizard(false);
    setStep(1);
    // reset all states
    setEntityName("");
    setEntityType("master");
    setSnapshotEnabled(true);
    setSource(null);

    setSqlQuery("");
    setSfObject(null);
    setSfFields([]);
    setSfFilters([{ field: "", op: "=", value: "" }]);

    setGdFile(null);
    setGdColumns([]);
    setGdFilters([{ column: "", op: "=", value: "" }]);

    setFilePath("");
    setFileColumns([]);
    setFileFilters([{ column: "", op: "=", value: "" }]);

    setHasPreview(false);
    setPreviewRows([]);
    setFields([]);
  };

  const submitJob = () => {
    console.log("Submitting Create Entity Job", {
      reviewSummary,
      fields,
      sample: previewRows.slice(0, 3),
    });
    setStep(5);
  };

  const stepLabel = (s: StepType) =>
    s === 1
      ? "Source & Basics"
      : s === 2
      ? "Query & Preview"
      : s === 3
      ? "Fields & Formulae"
      : s === 4
      ? "Review"
      : "Submitted";

  const Stepper = () => (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>
      
      {/* Steps */}
      <div className="relative flex items-start justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={cn(
                "h-10 w-10 rounded-full grid place-items-center text-sm font-semibold transition-all duration-300 border-2 z-10 bg-background",
                s < step ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" :
                s === step ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg" : 
                "border-border bg-background text-muted-foreground"
              )}
            >
              {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <span className={cn(
                "text-xs font-medium transition-colors",
                s === step ? "text-foreground" : s < step ? "text-primary" : "text-muted-foreground"
              )}>
                {stepLabel(s as StepType)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SourcePill = ({
    value,
    label,
    icon,
  }: {
    value: SourceType;
    label: string;
    icon: string;
  }) => (
    <button
      onClick={() => {
        setSource(value);
        softResetPreview();
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border-2 hover:shadow-md transition-all duration-200",
        source === value 
          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm" 
          : "border-border hover:border-primary/50 bg-background"
      )}
    >
      <img src={icon} alt={label} className="h-5 w-5" />
      <span className={cn(
        "text-sm font-medium",
        source === value ? "text-primary" : "text-foreground"
      )}>{label}</span>
    </button>
  );

  // ---------- UI Blocks for Step 2 (Query & Preview), vary by source ----------
  const salesforceObjects: Record<string, string[]> = {
    Product2: ["Id", "Name", "Family", "IsActive", "CreatedDate", "LastModifiedDate"],
    Account: ["Id", "Name", "Industry", "Rating", "CreatedDate"],
    Opportunity: ["Id", "Name", "StageName", "Amount", "CloseDate"],
  };
  const sampleGDriveFiles = ["Products_2025_Q2.csv", "Locations_master.xlsx", "Sales_History_July.csv"];
  const commonColumns = ["product_id", "product_name", "uom", "price"];

  const toggleFromList = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    softResetPreview();
  };

  const renderQueryStep = () => (
    <div className="space-y-6">
      {!source ? (
        <div className="text-sm text-muted-foreground">
          Please select a source in Step 1, then configure query/filters here.
        </div>
      ) : null}

      {/* Salesforce */}
      {source === "salesforce" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Salesforce Object</Label>
              <Select value={sfObject ?? ""} onValueChange={(v) => { setSfObject(v); softResetPreview(); }}>
                <SelectTrigger><SelectValue placeholder="Select object" /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {Object.keys(salesforceObjects).map((obj) => (
                    <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Fields</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/40">
                {(sfObject ? salesforceObjects[sfObject] : []).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full text-xs border",
                      sfFields.includes(f) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground"
                    )}
                    onClick={() => toggleFromList(sfFields, setSfFields, f)}
                  >
                    {f}
                  </button>
                ))}
                {!sfObject && <span className="text-xs text-muted-foreground">Select an object to see its fields</span>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button variant="ghost" size="sm" onClick={addSfFilter}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Filter
              </Button>
            </div>
            <div className="space-y-2">
              {sfFilters.map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select value={f.field} onValueChange={(v) => updateSfFilter(i, { field: v })}>
                      <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {(sfObject ? salesforceObjects[sfObject] : commonColumns).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateSfFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {["=", "!=", ">", "<", ">=", "<=", "contains", "startsWith"].map((op) => (
                          <SelectItem key={op} value={op}>{op}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Input value={f.value} onChange={(e) => updateSfFilter(i, { value: e.target.value })} placeholder="Value" />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button size="icon" variant="ghost" onClick={() => removeSfFilter(i)} aria-label="Remove filter">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRunPreview} disabled={!sfObject || sfFields.length === 0}>
              <Play className="h-4 w-4 mr-1" />
              Run Preview
            </Button>
          </div>
        </div>
      )}

      {/* Google Drive */}
      {source === "gdrive" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>File</Label>
              <Select value={gdFile ?? ""} onValueChange={(v) => { setGdFile(v); softResetPreview(); }}>
                <SelectTrigger><SelectValue placeholder="Select file" /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {sampleGDriveFiles.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Columns</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/40">
                {commonColumns.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full text-xs border",
                      gdColumns.includes(c) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground"
                    )}
                    onClick={() => toggleFromList(gdColumns, setGdColumns, c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button variant="ghost" size="sm" onClick={addGdFilter}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Filter
              </Button>
            </div>
            <div className="space-y-2">
              {gdFilters.map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select value={f.column} onValueChange={(v) => updateGdFilter(i, { column: v })}>
                      <SelectTrigger><SelectValue placeholder="Column" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {commonColumns.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateGdFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {["=", "!=", ">", "<", ">=", "<=", "contains", "startsWith"].map((op) => (
                          <SelectItem key={op} value={op}>{op}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Input value={f.value} onChange={(e) => updateGdFilter(i, { value: e.target.value })} placeholder="Value" />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button size="icon" variant="ghost" onClick={() => removeGdFilter(i)} aria-label="Remove filter">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRunPreview} disabled={!gdFile || gdColumns.length === 0}>
              <Play className="h-4 w-4 mr-1" />
              Run Preview
            </Button>
          </div>
        </div>
      )}

      {/* SQL-like sources */}
      {source && ["snowflake", "oracle", "sap", "hdfs"].includes(source) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>SQL Query</Label>
            <Button variant="ghost" size="sm">
              <Wand2 className="h-4 w-4 mr-1" />
              AI Assist
            </Button>
          </div>
          <Textarea
            value={sqlQuery}
            onChange={(e) => { setSqlQuery(e.target.value); softResetPreview(); }}
            className="min-h-[140px] font-mono text-sm"
            placeholder="SELECT product_id, product_name, uom, price FROM schema.table WHERE price > 0"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRunPreview} disabled={!sqlQuery.trim()}>
              <Play className="h-4 w-4 mr-1" />
              Run Preview
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" />
              Save Query
            </Button>
          </div>
        </div>
      )}

      {/* File-based sources */}
      {source && ["csv", "s3", "upload_csv"].includes(source) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{source === "upload_csv" ? "Upload CSV" : "Path / Bucket / Key"}</Label>
              {source === "upload_csv" ? (
                <Button variant="outline">
                  <FileUp className="h-4 w-4 mr-1" />
                  Upload File
                </Button>
              ) : (
                <Input
                  placeholder={source === "s3" ? "s3://bucket/path/to/file.csv" : "/path/to/file.csv"}
                  value={filePath}
                  onChange={(e) => { setFilePath(e.target.value); softResetPreview(); }}
                />
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Columns</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/40">
                {commonColumns.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded-full text-xs border",
                      fileColumns.includes(c) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground"
                    )}
                    onClick={() => toggleFromList(fileColumns, setFileColumns, c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button variant="ghost" size="sm" onClick={addFileFilter}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Filter
              </Button>
            </div>
            <div className="space-y-2">
              {fileFilters.map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select value={f.column} onValueChange={(v) => updateFileFilter(i, { column: v })}>
                      <SelectTrigger><SelectValue placeholder="Column" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {commonColumns.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateFileFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {["=", "!=", ">", "<", ">=", "<=", "contains", "startsWith"].map((op) => (
                          <SelectItem key={op} value={op}>{op}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Input value={f.value} onChange={(e) => updateFileFilter(i, { value: e.target.value })} placeholder="Value" />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button size="icon" variant="ghost" onClick={() => removeFileFilter(i)} aria-label="Remove filter">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRunPreview}
              disabled={source !== "upload_csv" && !filePath}
            >
              <Play className="h-4 w-4 mr-1" />
              Run Preview
            </Button>
          </div>
        </div>
      )}

      {/* Preview Pane */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="rounded-md border overflow-auto min-h-[160px] grid place-items-center p-2">
          {!hasPreview ? (
            <div className="text-xs text-muted-foreground p-6 text-center">
              Configure your {source ?? "source"} and click <span className="font-medium">Run Preview</span> to load sample rows.
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {Object.keys(previewRows[0] || {}).map((k) => (
                      <th key={k} className="text-left px-3 py-2 font-medium">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      {Object.keys(previewRows[0] || {}).map((k) => (
                        <td key={k} className="px-3 py-2 whitespace-nowrap">
                          {String(r[k] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const EntityCard = ({ module }: { module: EntityModule }) => {
    // Calculate data quality score (mock)
    const qualityScore = Math.floor(95 + Math.random() * 5);
    const isHealthy = qualityScore >= 98;
    const isWarning = qualityScore >= 95 && qualityScore < 98;
    
    return (
      <Card
        key={module.title}
        className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-border/50 hover:border-primary/30 overflow-hidden relative bg-gradient-to-br from-card via-card to-card/80 hover:scale-[1.02]"
        onClick={() => handlePreview(module)}
      >
        {/* Quality indicator bar */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          isHealthy ? "bg-gradient-to-r from-success via-success to-success/70" : 
          isWarning ? "bg-gradient-to-r from-warning via-warning to-warning/70" : 
          "bg-gradient-to-r from-destructive via-destructive to-destructive/70"
        )} />
        
        <CardHeader className="pb-3 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Source icon with enhanced styling */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-2.5 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all">
                    <img
                      src={sourceTypeIcon[module.sourceType]}
                      alt={module.sourceType}
                      className="h-5 w-5 relative z-10"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      variant={module.origin === "csv" ? "secondary" : "default"}
                      className="text-xs font-medium"
                    >
                      {module.origin === "csv" ? "Uploaded" : "Synced"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        isHealthy ? "bg-success" : isWarning ? "bg-warning" : "bg-destructive"
                      )} />
                      <span className={cn(
                        isHealthy ? "text-success" : isWarning ? "text-warning" : "text-destructive"
                      )}>
                        {qualityScore}% Quality
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleEdit(module)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(module)}>
                  <Download className="h-4 w-4 mr-2" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(module)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {module.description}
          </p>

          {/* Enhanced metrics section */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Database className="h-3.5 w-3.5" />
                <span className="font-medium">Records</span>
              </div>
              <div className="text-base font-bold text-foreground">
                {module.recordCount.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">Last Sync</span>
              </div>
              <div className="text-xs font-semibold text-foreground">
                {formatDate(module.lastSync).split(',')[0]}
              </div>
            </div>
          </div>

          {/* Action buttons with enhanced styling */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              onClick={(e) => {
                e.stopPropagation();
                handleSync(module);
              }}
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1.5 group-hover/btn:rotate-180 transition-transform duration-500" />
              {module.origin === "csv" ? "Append" : "Sync"}
            </Button>
            <Button
              size="sm"
              variant="default"
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(module);
              }}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ---------- Render ----------
  // Inline Data Health page (if toggled)
  if (showHealth) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Data Health Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Comprehensive insights into data quality, freshness and stability across all entities.</p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select Entity" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Entities</SelectItem>
                  <Separator />
                  {allEntities.filter(e => e !== "all").map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" onClick={() => setShowHealth(false)}>
                ← Back to Entities
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card 
                key={kpi.label} 
                className={cn("overflow-hidden border cursor-pointer transition-all hover:shadow-lg", "bg-gradient-to-br", kpi.bg)}
                onClick={() => console.log(`Drill down into ${kpi.label}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{kpi.label}</div>
                      <div className={cn("text-2xl font-bold", kpi.tone)}>{kpi.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">Click for details</div>
                    </div>
                    <kpi.icon className={cn("h-6 w-6", kpi.tone)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Overall Quality Score</div>
                    <div className="text-3xl font-bold text-primary">96.2%</div>
                    <div className="text-xs text-success mt-1">↑ 2.1% from last week</div>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-warning">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Active Issues</div>
                    <div className="text-3xl font-bold text-warning">13</div>
                    <div className="text-xs text-muted-foreground mt-1">5 need attention</div>
                  </div>
                  <Activity className="h-10 w-10 text-warning/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-success">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Data Entities</div>
                    <div className="text-3xl font-bold text-success">24</div>
                    <div className="text-xs text-success mt-1">All healthy</div>
                  </div>
                  <Database className="h-10 w-10 text-success/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts - Enhanced with more insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Data Ingestion Trend</CardTitle>
                  <Badge variant="outline" className="text-xs">{timeRange}</Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Line data={ingestionTrend} options={ingestionOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quality Score Trend</CardTitle>
                  <Badge variant="outline" className="text-xs">Target: 95%</Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Line data={qualityScoreTrend} options={ingestionOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Volume Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Line data={volumeTrend} options={ingestionOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Null Values by Column</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Bar data={nullsByColumn as any} options={barCommon} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Bar data={anomalyData} options={barCommon} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Types Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Pie data={dtypeDistribution as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" as const }}}} />
              </CardContent>
            </Card>
          </div>

          {/* Data Freshness Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Data Freshness Heatmap (Hours Since Last Update)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Entity</th>
                      <th className="text-center px-3 py-2 font-medium">Mon</th>
                      <th className="text-center px-3 py-2 font-medium">Tue</th>
                      <th className="text-center px-3 py-2 font-medium">Wed</th>
                      <th className="text-center px-3 py-2 font-medium">Thu</th>
                      <th className="text-center px-3 py-2 font-medium">Fri</th>
                      <th className="text-center px-3 py-2 font-medium">Sat</th>
                      <th className="text-center px-3 py-2 font-medium">Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {freshnessHeatmap.map((row) => (
                      <tr key={row.entity} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="px-3 py-2 font-medium">{row.entity}</td>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                          const value = row[day as keyof typeof row] as number;
                          const bgColor = value < 2 ? "bg-success/20" : value < 4 ? "bg-warning/20" : "bg-destructive/20";
                          const textColor = value < 2 ? "text-success" : value < 4 ? "text-warning" : "text-destructive";
                          return (
                            <td key={day} className={cn("px-3 py-2 text-center font-mono", bgColor, textColor)}>
                              {value.toFixed(1)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AutoFix Suggestions Panel */}
          <AutoFixSuggestionsPanel />

          {/* Schema Changes History */}
          <Card>
            <CardHeader>
              <CardTitle>Schema Changes History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Version</th>
                      <th className="text-left px-3 py-2 font-medium">Date</th>
                      <th className="text-left px-3 py-2 font-medium">Added</th>
                      <th className="text-left px-3 py-2 font-medium">Removed</th>
                      <th className="text-left px-3 py-2 font-medium">Renamed</th>
                      <th className="text-left px-3 py-2 font-medium">Broken</th>
                      <th className="text-left px-3 py-2 font-medium">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemaDriftRows.map((r) => (
                      <tr key={r.version} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="px-3 py-2 font-mono text-sm">{r.version}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.date}</td>
                        <td className="px-3 py-2">
                          <Badge variant={r.added > 0 ? "default" : "secondary"} className="text-xs">
                            {r.added}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={r.removed > 0 ? "destructive" : "secondary"} className="text-xs">
                            {r.removed}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={r.renamed > 0 ? "secondary" : "outline"} className="text-xs">
                            {r.renamed}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={r.broken > 0 ? "destructive" : "outline"} className="text-xs">
                            {r.broken}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge 
                            variant={r.impact === "High" ? "destructive" : r.impact === "Medium" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {r.impact}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* SynqAI Assistant */}
        <SynqAIAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SynqAI Assistant */}
      <SynqAIAssistant />
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-card via-card to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="px-6 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl" />
                  <Database className="h-10 w-10 text-primary relative" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    Entity Explorer
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Turning "Garbage In, Garbage Out" on its head
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Master and Time Series entities that fuel your AI models with clean, validated, high-quality data. 
                Preview, sync, or append data with confidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowHealth(true)}
                className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                Data Health
              </Button>
              <Button 
                onClick={() => setOpenWizard(true)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Entity
              </Button>
              <Button 
                onClick={() => navigate("/add-lookup")} 
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Lookup
              </Button>
              <Button 
                onClick={() => navigate("/data-jobs")} 
                variant="outline"
                className="hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              >
                <ListChecks className="h-4 w-4 mr-2" />
                Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="px-6 py-8">
        <Tabs defaultValue="master" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <TabsList className="bg-muted/60 border border-border/50 h-11">
              <TabsTrigger 
                value="master" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Master ({masterEntities.length})
              </TabsTrigger>
              <TabsTrigger 
                value="timeseries" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Timeseries ({timeseriesEntities.length})
              </TabsTrigger>
              <TabsTrigger 
                value="featurestore" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Feature Store ({featureStoreEntities.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border/50 shadow-sm"
              />
            </div>
          </div>

          <TabsContent value="master" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules(masterEntities).map((module) => (
                <EntityCard key={module.title} module={module} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeseries" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules(timeseriesEntities).map((module) => (
                <EntityCard key={module.title} module={module} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featurestore" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules(featureStoreEntities).map((module) => (
                <EntityCard key={module.title} module={module} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ---------- Create Entity Wizard (Dialog) ---------- */}
      <Dialog open={openWizard} onOpenChange={(v) => (v ? setOpenWizard(true) : closeWizard())}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">Create New Entity</DialogTitle>
            <DialogDescription className="text-base">
              Configure your data source, query filters, field mappings, and review before creating the entity.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="py-6 px-2">
            <Stepper />
          </div>

          <Separator className="mb-4" />

          {/* Steps Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-1 pb-4">
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Entity Name</Label>
                      <Input
                        placeholder="e.g., product_master"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type</Label>
                      <Select value={entityType} onValueChange={(v: EntityType) => setEntityType(v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="timeseries">Timeseries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Snapshot Enabled</Label>
                      <div className="flex items-center h-11 gap-3 px-3 border rounded-md bg-muted/20">
                        <Switch checked={snapshotEnabled} onCheckedChange={setSnapshotEnabled} />
                        <span className="text-sm">
                          Keep historical snapshots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-lg font-semibold">Select Data Source</Label>
                    <p className="text-sm text-muted-foreground mt-1">Choose where your data will be ingested from</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <SourcePill value="s3" label="Amazon S3" icon={sourceTypeIcon.s3} />
                    <SourcePill value="oracle" label="Oracle" icon={sourceTypeIcon.oracle} />
                    <SourcePill value="snowflake" label="Snowflake" icon={sourceTypeIcon.snowflake} />
                    <SourcePill value="salesforce" label="Salesforce" icon={sourceTypeIcon.salesforce} />
                    <SourcePill value="sap" label="SAP" icon={sourceTypeIcon.sap} />
                    <SourcePill value="csv" label="CSV (Path)" icon={sourceTypeIcon.csv} />
                    <SourcePill value="upload_csv" label="Upload CSV" icon={sourceTypeIcon.upload_csv} />
                    <SourcePill value="gdrive" label="Google Drive" icon={sourceTypeIcon.gdrive} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && renderQueryStep()}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Field Mapping</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rename columns, change data types, or add computed (formula) fields.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={addFormulaField} className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add Formula Field
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border overflow-auto bg-background shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0 z-10">
                      <tr className="border-b">
                        <th className="text-left px-4 py-3 font-semibold w-[18%]">Source Column</th>
                        <th className="text-left px-4 py-3 font-semibold w-[22%]">New Name</th>
                        <th className="text-left px-4 py-3 font-semibold w-[18%]">Data Type</th>
                        <th className="text-left px-4 py-3 font-semibold">Sample</th>
                        <th className="text-left px-4 py-3 font-semibold w-[28%]">Formula (for new)</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Database className="h-8 w-8 text-muted-foreground/50" />
                              <p>Run a preview in Step 2 to infer fields, or add formula fields manually.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        fields.map((f, i) => (
                          <tr key={i} className="border-b hover:bg-muted/20 transition-colors align-top">
                            <td className="px-4 py-3">
                              <Input
                                value={f.sourceName}
                                onChange={(e) => updateField(i, { sourceName: e.target.value })}
                                disabled={!f.isNew}
                                className="h-10"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={f.newName}
                                onChange={(e) => updateField(i, { newName: e.target.value })}
                                className="h-10"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                value={f.dataType}
                                onValueChange={(v) => updateField(i, { dataType: v })}
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-background z-50">
                                  <SelectItem value="string">string</SelectItem>
                                  <SelectItem value="number">number</SelectItem>
                                  <SelectItem value="integer">integer</SelectItem>
                                  <SelectItem value="boolean">boolean</SelectItem>
                                  <SelectItem value="date">date</SelectItem>
                                  <SelectItem value="timestamp">timestamp</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {f.sample === null ? <em>—</em> : String(f.sample)}
                            </td>
                            <td className="px-4 py-3">
                              {f.isNew ? (
                                <Textarea
                                  value={f.expression || ""}
                                  onChange={(e) => updateField(i, { expression: e.target.value })}
                                  placeholder="e.g., price * 1.18 or concat(product_id, '-', uom)"
                                  className="min-h-[60px] font-mono text-xs"
                                />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button size="sm" variant="ghost" onClick={() => removeField(i)} className="hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold">Review & Confirm</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verify all details before creating the entity and scheduling the ingest job.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-sm border-2">
                    <CardHeader className="pb-3 bg-muted/20">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        Basics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3 pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{reviewSummary.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{reviewSummary.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span className="font-medium">{String(reviewSummary.source)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Snapshot:</span>
                        <Badge variant={reviewSummary.snapshot ? "default" : "secondary"}>
                          {reviewSummary.snapshot ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-2">
                    <CardHeader className="pb-3 bg-muted/20">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" />
                        Schema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3 pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Fields:</span>
                        <span className="font-medium text-lg">{reviewSummary.fieldCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Formula Fields:</span>
                        <span className="font-medium text-lg">{reviewSummary.newFields}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-2">
                    <CardHeader className="pb-3 bg-muted/20">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        Query
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <pre className="text-xs bg-muted/50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap font-mono border">{reviewSummary.query}</pre>
                    </CardContent>
                  </Card>
                </div>

                {hasPreview && (
                  <div>
                    <h4 className="text-base font-semibold mb-3">Sample Data Preview</h4>
                    <div className="rounded-lg border overflow-auto bg-background shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 sticky top-0">
                          <tr className="border-b">
                            {Object.keys(previewRows[0] || {}).map((k) => (
                              <th key={k} className="text-left px-4 py-3 font-semibold">
                                {k}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((r, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/20 transition-colors">
                              {Object.keys(previewRows[0] || {}).map((k) => (
                                <td key={k} className="px-4 py-3 whitespace-nowrap">
                                  {String(r[k] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="py-12 flex flex-col items-center text-center gap-4">
                <div className="rounded-full bg-green-100 p-4 mb-2">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">Entity Creation Submitted!</h3>
                <p className="text-base text-muted-foreground max-w-lg">
                  Your entity creation job has been successfully submitted. You can track the progress in the Jobs page,
                  or continue configuring more entities.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => navigate("/data-jobs")} size="lg" className="gap-2">
                    <ListChecks className="h-5 w-5" />
                    View Jobs
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={closeWizard} size="lg">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 5 && (
            <DialogFooter className="flex items-center justify-between gap-3 pt-4 border-t mt-4 bg-muted/20 rounded-b-lg px-6 py-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                {step === 2 && <span>💡 Update filters and re-run preview as needed</span>}
                {step !== 2 && <span>Use Back/Next to navigate between steps</span>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={gotoPrev} disabled={step === 1} size="lg" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                {step < 4 && (
                  <Button
                    onClick={gotoNext}
                    disabled={(step === 1 && !source) || (step === 2 && !hasPreview)}
                    size="lg"
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                {step === 4 && (
                  <Button onClick={submitJob} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary-glow">
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Entity
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Append Data Dialog */}
      <AppendDataDialog 
        open={openAppendDialog}
        onOpenChange={setOpenAppendDialog}
        entityName={selectedAppendEntity}
      />
    </div>
  );
}