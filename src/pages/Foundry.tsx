// Foundry.tsx — Popup Create Entity (5-step) + Inline Data Health page (no popup) + source-specific Query step
import React, { useMemo, useState } from "react";
import { AppendDataDialog } from "@/components/AppendDataDialog";
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

// Image imports (adjust paths if needed)
import csvIcon from "@/assets/csv.png";
import hdfsIcon from "@/assets/hdfs.svg";
import s3Icon from "@/assets/s3.svg";
import snowflakeIcon from "@/assets/snowflake.svg";
import gdriveIcon from "@/assets/gdrive.png";

type SourceType =
  | "csv"
  | "hdfs"
  | "s3"
  | "snowflake"
  | "gdrive"
  | "oracle"
  | "salesforce"
  | "sap"
  | "upload_csv";

type EntityType = "master" | "timeseries" | "featurestore";

interface EntityModule {
  title: string;
  description: string;
  origin: "csv" | "third-party";
  route: string;
  recordCount: number;
  lastSync: string; // ISO string
  sourceType: SourceType;
}

const sourceTypeIcon: Record<SourceType, string> = {
  csv: csvIcon,
  hdfs: hdfsIcon,
  s3: s3Icon,
  snowflake: snowflakeIcon,
  gdrive: gdriveIcon,
  oracle: hdfsIcon, // placeholder
  salesforce: gdriveIcon, // placeholder
  sap: hdfsIcon, // placeholder
  upload_csv: csvIcon,
};

const masterEntities: EntityModule[] = [
  {
    title: "Product Master",
    description: "Catalog of all products with attributes",
    origin: "third-party",
    route: "/entity-preview/product",
    recordCount: 3582,
    lastSync: "2025-07-21T15:20:00Z",
    sourceType: "snowflake",
  },
  {
    title: "Location Master",
    description: "List of all locations and warehouses",
    origin: "csv",
    route: "/entity-preview/location",
    recordCount: 213,
    lastSync: "2025-07-18T09:45:00Z",
    sourceType: "csv",
  },
  {
    title: "Customer Master",
    description: "Customer information and demographics",
    origin: "third-party",
    route: "/entity-preview/customer",
    recordCount: 15420,
    lastSync: "2025-07-20T14:30:00Z",
    sourceType: "salesforce",
  },
  {
    title: "Supplier Master",
    description: "Vendor and supplier details",
    origin: "csv",
    route: "/entity-preview/supplier",
    recordCount: 847,
    lastSync: "2025-07-19T11:15:00Z",
    sourceType: "csv",
  },
  {
    title: "Employee Master",
    description: "Employee directory and organizational data",
    origin: "third-party",
    route: "/entity-preview/employee",
    recordCount: 2156,
    lastSync: "2025-07-21T08:45:00Z",
    sourceType: "sap",
  },
  {
    title: "Category Master",
    description: "Product categories and hierarchy",
    origin: "csv",
    route: "/entity-preview/category",
    recordCount: 89,
    lastSync: "2025-07-20T16:00:00Z",
    sourceType: "csv",
  },
  {
    title: "Currency Master",
    description: "Currency codes and exchange rates",
    origin: "third-party",
    route: "/entity-preview/currency",
    recordCount: 156,
    lastSync: "2025-07-21T06:00:00Z",
    sourceType: "oracle",
  },
  {
    title: "Brand Master",
    description: "Brand information and attributes",
    origin: "csv",
    route: "/entity-preview/brand",
    recordCount: 342,
    lastSync: "2025-07-20T12:30:00Z",
    sourceType: "gdrive",
  },
  {
    title: "Unit Master",
    description: "Units of measurement definitions",
    origin: "csv",
    route: "/entity-preview/unit",
    recordCount: 78,
    lastSync: "2025-07-19T15:20:00Z",
    sourceType: "csv",
  },
  {
    title: "Contract Master",
    description: "Active contracts and agreements",
    origin: "third-party",
    route: "/entity-preview/contract",
    recordCount: 1234,
    lastSync: "2025-07-21T10:15:00Z",
    sourceType: "snowflake",
  },
];

const timeseriesEntities: EntityModule[] = [
  {
    title: "Sales History",
    description: "Daily sales by product and region",
    origin: "csv",
    route: "/entity-preview/sales-history",
    recordCount: 14236,
    lastSync: "2025-07-19T18:15:00Z",
    sourceType: "hdfs",
  },
  {
    title: "Copper Prices",
    description: "Time-indexed prices of key raw materials",
    origin: "third-party",
    route: "/entity-preview/copper-prices",
    recordCount: 846,
    lastSync: "2025-07-20T22:00:00Z",
    sourceType: "gdrive",
  },
  {
    title: "Inventory Levels",
    description: "Historical inventory data by location",
    origin: "csv",
    route: "/entity-preview/inventory-levels",
    recordCount: 28456,
    lastSync: "2025-07-21T16:30:00Z",
    sourceType: "snowflake",
  },
  {
    title: "Production Data",
    description: "Manufacturing output and efficiency metrics",
    origin: "third-party",
    route: "/entity-preview/production-data",
    recordCount: 9872,
    lastSync: "2025-07-20T20:15:00Z",
    sourceType: "sap",
  },
  {
    title: "Customer Transactions",
    description: "Customer purchase history and patterns",
    origin: "csv",
    route: "/entity-preview/customer-transactions",
    recordCount: 156789,
    lastSync: "2025-07-21T12:45:00Z",
    sourceType: "hdfs",
  },
  {
    title: "Market Prices",
    description: "Commodity and material market prices",
    origin: "third-party",
    route: "/entity-preview/market-prices",
    recordCount: 3456,
    lastSync: "2025-07-21T09:30:00Z",
    sourceType: "oracle",
  },
  {
    title: "Quality Metrics",
    description: "Product quality scores over time",
    origin: "csv",
    route: "/entity-preview/quality-metrics",
    recordCount: 12678,
    lastSync: "2025-07-20T14:20:00Z",
    sourceType: "csv",
  },
  {
    title: "Shipment Tracking",
    description: "Logistics and delivery timeline data",
    origin: "third-party",
    route: "/entity-preview/shipment-tracking",
    recordCount: 45123,
    lastSync: "2025-07-21T11:00:00Z",
    sourceType: "gdrive",
  },
  {
    title: "Energy Consumption",
    description: "Facility energy usage patterns",
    origin: "csv",
    route: "/entity-preview/energy-consumption",
    recordCount: 8765,
    lastSync: "2025-07-20T18:45:00Z",
    sourceType: "csv",
  },
  {
    title: "Revenue Analytics",
    description: "Revenue trends and financial metrics",
    origin: "third-party",
    route: "/entity-preview/revenue-analytics",
    recordCount: 23456,
    lastSync: "2025-07-21T13:15:00Z",
    sourceType: "snowflake",
  },
];

const featureStoreEntities: EntityModule[] = [
  {
    title: "Holiday Calendar",
    description: "Public holidays and seasonal events data",
    origin: "third-party",
    route: "/entity-preview/holiday-calendar",
    recordCount: 2456,
    lastSync: "2025-07-21T07:00:00Z",
    sourceType: "oracle",
  },
  {
    title: "Crude Oil Prices",
    description: "Global crude oil pricing and trends",
    origin: "third-party",
    route: "/entity-preview/crude-oil-prices",
    recordCount: 1825,
    lastSync: "2025-07-21T06:15:00Z",
    sourceType: "gdrive",
  },
  {
    title: "NSE Index",
    description: "National Stock Exchange market indicators",
    origin: "third-party",
    route: "/entity-preview/nse-index",
    recordCount: 3650,
    lastSync: "2025-07-21T09:45:00Z",
    sourceType: "snowflake",
  },
  {
    title: "NASDAQ Index",
    description: "NASDAQ composite and sector indices",
    origin: "third-party",
    route: "/entity-preview/nasdaq-index",
    recordCount: 4380,
    lastSync: "2025-07-21T10:30:00Z",
    sourceType: "oracle",
  },
  {
    title: "Weather Data",
    description: "Meteorological data and climate patterns",
    origin: "third-party",
    route: "/entity-preview/weather-data",
    recordCount: 87456,
    lastSync: "2025-07-21T08:20:00Z",
    sourceType: "hdfs",
  },
];

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

  // Data volume trends
  const volumeTrend = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Data Volume (GB)",
        data: [45, 52, 48, 61, 58, 67, 73],
        backgroundColor: "rgba(16,185,129,0.2)",
        borderColor: "rgba(16,185,129,1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

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
    <div className="flex items-center gap-3 text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-full grid place-items-center text-xs font-medium",
              s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {s}
          </div>
          <span className={cn("hidden sm:block", s === step ? "text-foreground font-medium" : "text-muted-foreground")}>
            {stepLabel(s as StepType)}
          </span>
          {s !== 5 && <Separator orientation="vertical" className="h-8" />}
        </div>
      ))}
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
        "flex items-center gap-2 px-3 py-2 rounded-xl border hover:shadow-sm transition",
        source === value ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
    >
      <img src={icon} alt={label} className="h-4 w-4" />
      <span className="text-sm">{label}</span>
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
                <SelectContent>
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
                      <SelectContent>
                        {(sfObject ? salesforceObjects[sfObject] : commonColumns).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateSfFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent>
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
                <SelectContent>
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
                      <SelectContent>
                        {commonColumns.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateGdFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent>
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
                      <SelectContent>
                        {commonColumns.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Select value={f.op} onValueChange={(v) => updateFileFilter(i, { op: v })}>
                      <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent>
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

  const EntityCard = ({ module }: { module: EntityModule }) => (
    <Card
      key={module.title}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={() => handlePreview(module)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-1 flex items-center gap-2">
              <img
                src={sourceTypeIcon[module.sourceType]}
                alt={module.sourceType}
                className="h-4 w-4"
                loading="lazy"
              />
              {module.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={module.origin === "csv" ? "secondary" : "default"}
                className="text-xs"
              >
                {module.origin === "csv" ? "Uploaded" : "Synced"}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(module)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(module)}>
                <Download className="h-4 w-4 mr-2" /> Export
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(module)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {module.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            {module.recordCount.toLocaleString()} records
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last sync: {formatDate(module.lastSync)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleSync(module);
            }}
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            {module.origin === "csv" ? "Append" : "Sync"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handlePreview(module);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // ---------- Render ----------
  // Inline Data Health page (if toggled)
  if (showHealth) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Data Health Dashboard</h1>
              <p className="text-muted-foreground mt-1">Comprehensive insights into data quality, freshness and stability across all entities.</p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <Separator />
                  {allEntities.filter(e => e !== "all").map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowHealth(false)}>
                ← Back to Entities
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className={cn("overflow-hidden border", "bg-gradient-to-br", kpi.bg)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{kpi.label}</div>
                      <div className={cn("text-2xl font-bold", kpi.tone)}>{kpi.value}</div>
                    </div>
                    <kpi.icon className={cn("h-6 w-6", kpi.tone)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts - Enhanced with more insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Ingestion Trend (7d)</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <Line data={ingestionTrend} options={ingestionOptions} />
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Entity</h1>
              <p className="text-muted-foreground mt-1">
                These Master and Time Series entities fuel AI models. You can preview, sync, or append them below.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowHealth(true)}>
                <PieChartIcon className="h-4 w-4 mr-2" />
                Data Health
              </Button>
              <Button onClick={() => setOpenWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Entity
              </Button>
              <Button onClick={() => navigate("/add-lookup")} variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Lookup
              </Button>
              <Button onClick={() => navigate("/data-jobs")} variant="outline">
                <ListChecks className="h-4 w-4 mr-2" />
                Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="master" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-auto grid-cols-3 bg-card border shadow-sm">
              <TabsTrigger value="master" className="text-sm font-medium">
                Master ({masterEntities.length})
              </TabsTrigger>
              <TabsTrigger value="timeseries" className="text-sm font-medium">
                Timeseries ({timeseriesEntities.length})
              </TabsTrigger>
              <TabsTrigger value="featurestore" className="text-sm font-medium">
                Feature Store ({featureStoreEntities.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Entities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border shadow-sm"
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
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Create Entity</DialogTitle>
            <DialogDescription>
              Multi‑step wizard to configure your data source, query/filters, fields and review before submitting a job.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-between">
            <Stepper />
            <div className="text-xs text-muted-foreground">Step {step} of 5</div>
          </div>

          <Separator />

          {/* Steps */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 space-y-2">
                  <Label>Entity Name</Label>
                  <Input
                    placeholder="e.g., product_master"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>Type</Label>
                  <Select value={entityType} onValueChange={(v: EntityType) => setEntityType(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="timeseries">Timeseries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex items-end gap-3">
                  <div className="space-y-1">
                    <Label className="block">Snapshot Enabled</Label>
                    <div className="flex items-center gap-2">
                      <Switch checked={snapshotEnabled} onCheckedChange={setSnapshotEnabled} />
                      <span className="text-sm text-muted-foreground">
                        Keep historical snapshots
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Source</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <SourcePill value="s3" label="Amazon S3" icon={s3Icon} />
                  <SourcePill value="oracle" label="Oracle" icon={hdfsIcon} />
                  <SourcePill value="snowflake" label="Snowflake" icon={snowflakeIcon} />
                  <SourcePill value="salesforce" label="Salesforce" icon={gdriveIcon} />
                  <SourcePill value="sap" label="SAP" icon={hdfsIcon} />
                  <SourcePill value="csv" label="CSV (Path)" icon={csvIcon} />
                  <SourcePill value="upload_csv" label="Upload CSV" icon={csvIcon} />
                  <SourcePill value="gdrive" label="Google Drive" icon={gdriveIcon} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && renderQueryStep()}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Field Mapping</h3>
                  <p className="text-sm text-muted-foreground">
                    Rename columns, change data types, or add computed (formula) fields.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addFormulaField}>
                    + Add Formula Field
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium w-[18%]">Source Column</th>
                      <th className="text-left px-3 py-2 font-medium w-[22%]">New Name</th>
                      <th className="text-left px-3 py-2 font-medium w-[18%]">Data Type</th>
                      <th className="text-left px-3 py-2 font-medium">Sample</th>
                      <th className="text-left px-3 py-2 font-medium w-[28%]">Formula (for new)</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground text-sm">
                          Run a preview in Step 2 to infer fields, or add formula fields manually.
                        </td>
                      </tr>
                    ) : (
                      fields.map((f, i) => (
                        <tr key={i} className="border-t align-top">
                          <td className="px-3 py-2">
                            <Input
                              value={f.sourceName}
                              onChange={(e) => updateField(i, { sourceName: e.target.value })}
                              disabled={!f.isNew}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={f.newName}
                              onChange={(e) => updateField(i, { newName: e.target.value })}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Select
                              value={f.dataType}
                              onValueChange={(v) => updateField(i, { dataType: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">string</SelectItem>
                                <SelectItem value="number">number</SelectItem>
                                <SelectItem value="integer">integer</SelectItem>
                                <SelectItem value="boolean">boolean</SelectItem>
                                <SelectItem value="date">date</SelectItem>
                                <SelectItem value="timestamp">timestamp</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {f.sample === null ? <em>—</em> : String(f.sample)}
                          </td>
                          <td className="px-3 py-2">
                            {f.isNew ? (
                              <Textarea
                                value={f.expression || ""}
                                onChange={(e) => updateField(i, { expression: e.target.value })}
                                placeholder="e.g., price * 1.18 or concat(product_id, '-', uom)"
                                className="min-h-[40px] font-mono text-xs"
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button size="sm" variant="ghost" onClick={() => removeField(i)}>
                              Remove
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
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Confirm details before creating the entity and scheduling the ingest job.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Basics</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">Name:</span> {reviewSummary.name}</div>
                    <div><span className="text-muted-foreground">Type:</span> {reviewSummary.type}</div>
                    <div><span className="text-muted-foreground">Source:</span> {String(reviewSummary.source)}</div>
                    <div><span className="text-muted-foreground">Snapshot:</span> {reviewSummary.snapshot ? "Enabled" : "Disabled"}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Schema</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">Fields:</span> {reviewSummary.fieldCount}</div>
                    <div><span className="text-muted-foreground">New/Formula:</span> {reviewSummary.newFields}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Query / Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">{reviewSummary.query}</pre>
                  </CardContent>
                </Card>
              </div>

              {hasPreview && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Sample Rows</h4>
                  <div className="rounded-md border overflow-auto">
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
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="py-8 flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h3 className="text-lg font-semibold">Create Job Submitted</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Your entity creation job has been submitted. You can track progress in the Jobs page,
                or continue configuring more entities.
              </p>
              <div className="flex gap-3 mt-2">
                <Button onClick={() => navigate("/data-jobs")}>
                  <ListChecks className="h-4 w-4 mr-2" />
                  View Jobs
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" onClick={closeWizard}>
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {step !== 5 && (
            <DialogFooter className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {step === 2 ? "You can update filters and re-run preview as needed." : "Use Back/Next to navigate."}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={gotoPrev} disabled={step === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                {step < 4 && (
                  <Button
                    onClick={gotoNext}
                    disabled={(step === 1 && !source) || (step === 2 && !hasPreview)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                {step === 4 && (
                  <Button onClick={submitJob}>
                    Submit
                    <ChevronRight className="h-4 w-4 ml-1" />
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