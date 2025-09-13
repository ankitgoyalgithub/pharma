
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Send, Sparkles, Bot, User, ChevronRight, FileIcon, ImageIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

/** Optional theme helpers (no-op fallbacks if not present) */
const hslVar = (v: string, a?: number) => {
  const root = getComputedStyle(document.documentElement);
  const raw = root.getPropertyValue(v).trim();
  if (!raw) return a != null ? `rgba(99,102,241,${a})` : "rgb(99,102,241)";
  if (a == null) return `hsl(${raw})`;
  return `hsl(${raw} / ${a})`;
};

const buildChartOptions = (opts?: any) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    tooltip: { enabled: true },
    ...opts?.plugins,
  },
  scales: {
    x: { grid: { color: hslVar("--border") } },
    y: { grid: { color: hslVar("--border") }, beginAtZero: true },
    ...opts?.scales,
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  ChartTooltip,
  ChartLegend
);

/** -------- Types -------- */
type KPI = { label: string; value: string | number; delta?: string };
type UploadedFile = { name: string; size: number; type: string; url?: string };

type RichBlock =
  | { kind: "text"; content: string }
  | {
      kind: "table";
      columns: string[];
      rows: Array<Array<string | number>>;
      caption?: string;
    }
  | {
      kind: "chart";
      chartType: "line" | "bar";
      title?: string;
      labels: string[];
      datasetLabel: string;
      data: number[];
    }
  | {
      kind: "kpis";
      title?: string;
      items: KPI[];
    }
  | {
      kind: "files";
      title?: string;
      files: UploadedFile[];
    }
  | {
      kind: "image";
      title?: string;
      src: string;
      alt?: string;
    }
  | {
      kind: "code";
      language?: string;
      content: string;
      title?: string;
    }
  | {
      kind: "thinking"; // renders a thinking/typing animation
    };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  blocks: RichBlock[];
  createdAt: number;
  thinking?: boolean;
};

const recommendedPrompts = [
  "What is the current inventory turnover rate?",
  "Show me demand forecasting for Q4",
  "Analyze supply chain bottlenecks",
  "Compare this year's performance vs last year",
  "What are the top performing products?",
  "Identify cost optimization opportunities",
  "Create a replenishment plan for next month",
  "Route plan for 120 orders, 10 vehicles (8hr)",
  "Breakdown procurement spend by vendor this quarter",
];

const Analytics: React.FC = () => {
  const [mode, setMode] = useState<"landing" | "chat">("landing");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Demo data
  const demoForecast = useMemo(
    () => ({ labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], values: [320, 280, 350, 400, 380, 420] }),
    []
  );
  const demoAccuracy = useMemo(
    () => ({ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], values: [68, 72, 69, 71, 75, 78] }),
    []
  );

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const pushMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);

  const replaceMessage = (id: string, next: ChatMessage) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? next : m)));

  const handleSubmit = (query?: string) => {
    const text = (query ?? inputValue).trim();
    if (!text) return;
    if (mode === "landing") setMode("chat");
    setHasInteracted(true); // Mark that user has interacted

    // User message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      blocks: [{ kind: "text", content: text }],
      createdAt: Date.now(),
    };
    pushMessage(userMessage);
    setInputValue("");

    // Thinking placeholder
    const thinkId = crypto.randomUUID();
    const thinkingMsg: ChatMessage = {
      id: thinkId,
      role: "assistant",
      thinking: true,
      createdAt: Date.now() + 1,
      blocks: [{ kind: "thinking" }],
    };
    pushMessage(thinkingMsg);

    // Prepare final assistant message
    const files = uploadedFiles;
    const finalMsg: ChatMessage = {
      id: thinkId, // same id so we replace
      role: "assistant",
      createdAt: Date.now() + 2,
      blocks: buildAssistantBlocks(text, { demoForecast, demoAccuracy, files }),
    };

    // Small delay to let the animation play, then replace
    window.setTimeout(() => {
      replaceMessage(thinkId, finalMsg);
    }, 700);
  };

  // Upload handlers
  const onPickFiles = () => fileInputRef.current?.click();

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);

    const picked: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const url = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      picked.push({ name: f.name, size: f.size, type: f.type, url });
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      await new Promise((r) => setTimeout(r, 120)); // simulate
    }
    setUploadedFiles((prev) => [...prev, ...picked]);
    setUploading(false);

    if (mode === "landing") setMode("chat");

    pushMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: Date.now(),
      blocks: [
        { kind: "text", content: "I've received your files. I can use them for analysis in follow-up queries." },
        { kind: "files", title: "Uploaded Files", files: picked },
      ],
    });
  };

  // Drag-n-drop
  const onDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const files = Array.from(ev.dataTransfer.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);
    const picked: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const url = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      picked.push({ name: f.name, size: f.size, type: f.type, url });
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      await new Promise((r) => setTimeout(r, 120));
    }
    setUploadedFiles((prev) => [...prev, ...picked]);
    setUploading(false);
    if (mode === "landing") setMode("chat");
    pushMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: Date.now(),
      blocks: [
        { kind: "text", content: "Files dropped. I’ll consider them for the next analysis." },
        { kind: "files", title: "Uploaded Files", files: picked },
      ],
    });
  };

  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      {mode === "landing" ? (
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-5xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-3">Welcome to SynQ Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Drop files, or ask anything about your data. I’ll respond like ChatGPT with text, tables, charts, or images.
              </p>
            </div>

            {/* Centered prompt + upload */}
            <div className="w-full max-w-3xl" onDrop={onDrop} onDragOver={onDragOver}>
              <div className="relative flex gap-3 items-stretch">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Ask a question… e.g., 'What’s the overall supply chain lead time?'"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                    className="pl-12 py-6 text-base bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                  />
                </div>
                <Button onClick={() => handleSubmit()} className="px-6 rounded-xl">
                  <Send className="h-4 w-4 mr-2" /> Ask
                </Button>
                <Button variant="secondary" onClick={onPickFiles} className="rounded-xl" title="Upload files">
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
                <input ref={fileInputRef} type="file" className="hidden" multiple onChange={onFilesSelected} />
              </div>

              <div className="mt-3 text-center text-xs text-muted-foreground">
                Drag & drop files here to attach • Images will render inline
              </div>

              {uploading && (
                <div className="mt-3">
                  <Progress value={uploadProgress} />
                  <div className="text-xs text-muted-foreground mt-1">Uploading… {uploadProgress}%</div>
                </div>
              )}

              {!hasInteracted && (
                <div className="mt-8">
                  <p className="text-muted-foreground text-sm mb-3">Try asking:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {recommendedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSubmit(prompt)}
                        className="group flex items-center justify-between gap-3 text-left p-3 bg-card/60 border border-border/60 rounded-lg text-foreground text-xs hover:bg-card hover:border-border transition-colors"
                      >
                        <span>{prompt}</span>
                        <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Chat mode
        <div className="h-screen max-h-screen flex flex-col">
          <div className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3 max-w-4xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-medium text-foreground">SynQ Assistant</h2>
                <span className="text-xs text-muted-foreground">Chat · Text · Tables · Charts · Files</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto container mx-auto px-4 max-w-4xl py-6 space-y-6">
            {messages.map((m) => (<MessageBubble key={m.id} message={m} />))}
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 max-w-4xl">
              <Card className="border-border/70 p-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-2">
                    <Input
                      placeholder="Type your message…"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                      }}
                      className="bg-background border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button onClick={() => handleSubmit()} className="shrink-0">
                      <Send className="h-4 w-4 mr-2" /> Send
                    </Button>
                    <Button variant="secondary" onClick={onPickFiles} className="shrink-0" title="Upload files">
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                    <input ref={fileInputRef} type="file" className="hidden" multiple onChange={onFilesSelected} />
                  </div>
                  <div className="text-[11px] text-muted-foreground px-1">Tip: Paste any query. I’ll reply with the most useful format.</div>
                </div>
              </Card>

              {!hasInteracted && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendedPrompts.map((p) => (
                    <button key={p} onClick={() => handleSubmit(p)} className="text-xs px-3 py-1 rounded-full border border-border/60 hover:bg-card transition">
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** ---------- Thinking Dots ---------- */
const ThinkingDots: React.FC = () => {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <span className="sr-only">Thinking…</span>
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]"></span>
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]"></span>
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]"></span>
    </div>
  );
};

/** ---------- Message Bubble ---------- */
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
  const isThinking = message.thinking || message.blocks.some((b) => b.kind === "thinking");
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl border ${isUser ? "bg-primary text-primary-foreground border-primary/20" : "bg-card text-foreground border-border"}`}>
        <div className="p-3 sm:p-4 space-y-3">
          {isThinking ? (
            <div className="space-y-3">
              {/* skeleton lines */}
              <div className="h-3 w-48 bg-muted/50 rounded animate-pulse" />
              <div className="h-3 w-64 bg-muted/40 rounded animate-pulse" />
              <div className="h-3 w-40 bg-muted/30 rounded animate-pulse" />
              <ThinkingDots />
            </div>
          ) : (
            message.blocks.map((b, i) => {
              if (b.kind === "text") {
                return (<p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">{b.content}</p>);
              }
              if (b.kind === "table") {
                return (
                  <div key={i} className="rounded-lg overflow-hidden border border-border">
                    {b.caption && (<div className="px-3 py-2 text-xs text-muted-foreground bg-muted/40">{b.caption}</div>)}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                          <tr>
                            {b.columns.map((c) => (<th key={c} className="text-left font-medium px-3 py-2 border-b border-border/60">{c}</th>))}
                          </tr>
                        </thead>
                        <tbody>
                          {b.rows.map((r, ri) => (
                            <tr key={ri} className="hover:bg-muted/20">
                              {r.map((cell, ci) => (<td key={ci} className="px-3 py-2 border-b border-border/50">{cell as React.ReactNode}</td>))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }
              if (b.kind === "chart") {
                const chartData = b.chartType === "line"
                  ? { labels: b.labels, datasets: [{ label: b.datasetLabel, data: b.data, tension: 0.35, borderWidth: 3, borderColor: hslVar("--primary"), pointBackgroundColor: hslVar("--primary"), backgroundColor: hslVar("--primary", 0.15), fill: true }] }
                  : { labels: b.labels, datasets: [{ label: b.datasetLabel, data: b.data, backgroundColor: hslVar("--accent", 0.7), borderColor: hslVar("--accent"), borderWidth: 1, borderRadius: 4 }] };
                return (
                  <div key={i} className="space-y-2">
                    {b.title && (<div className="text-sm font-medium opacity-80">{b.title}</div>)}
                    <div className="h-64 w-full">
                      {b.chartType === "line"
                        ? <Line data={chartData as any} options={buildChartOptions({ plugins: { legend: { display: true } } })} />
                        : <Bar data={chartData as any} options={buildChartOptions({ plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } })} />}
                    </div>
                  </div>
                );
              }
              if (b.kind === "kpis") {
                return (
                  <div key={i} className="space-y-2">
                    {b.title && (<div className="text-sm font-medium opacity-80">{b.title}</div>)}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {b.items.map((k, idx) => (
                        <Card key={idx} className="p-3 border-border">
                          <div className="text-xs text-muted-foreground">{k.label}</div>
                          <div className="text-lg font-semibold">{k.value}</div>
                          {k.delta && <div className={`text-xs ${k.delta.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>{k.delta}</div>}
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              }
              if (b.kind === "files") {
                return (
                  <div key={i} className="space-y-2">
                    {b.title && (<div className="text-sm font-medium opacity-80">{b.title}</div>)}
                    <div className="flex flex-wrap gap-2">
                      {b.files.map((f, idx) => (
                        <Card key={idx} className="px-3 py-2 flex items-center gap-2">
                          {f.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />}
                          <div className="text-xs">
                            <div className="font-medium">{f.name}</div>
                            <div className="text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <Badge variant="outline" className="ml-auto">{f.type.split("/")[1] || "file"}</Badge>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              }
              if (b.kind === "image") {
                return (
                  <div key={i} className="space-y-2">
                    {b.title && (<div className="text-sm font-medium opacity-80">{b.title}</div>)}
                    <img src={b.src} alt={b.alt || "image"} className="rounded-lg border border-border max-h-80 object-contain" />
                  </div>
                );
              }
              if (b.kind === "code") {
                return (
                  <div key={i} className="space-y-2">
                    {b.title && (<div className="text-sm font-medium opacity-80">{b.title}</div>)}
                    <pre className="text-xs bg-muted/40 p-3 rounded-lg overflow-x-auto"><code>{b.content}</code></pre>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

/** ---------- Demo response builder (replace with backend) ---------- */
function buildAssistantBlocks(
  userText: string,
  {
    demoForecast,
    demoAccuracy,
    files,
  }: {
    demoForecast: { labels: string[]; values: number[] };
    demoAccuracy: { labels: string[]; values: number[] };
    files: UploadedFile[];
  }
): RichBlock[] {
  const lower = userText.toLowerCase();

  if (lower.includes("forecast")) {
    return [
      { kind: "text", content: "Here’s the projected demand. Peaks in Jul–Sep driven by promotions and seasonality." },
      { kind: "chart", chartType: "line", title: "Demand Forecast (Units)", labels: demoForecast.labels, datasetLabel: "Forecast", data: demoForecast.values },
      {
        kind: "kpis",
        title: "Quick Indicators",
        items: [
          { label: "Forecast Bias", value: "-2.4%", delta: "+0.6%" },
          { label: "MAPE", value: "22%", delta: "-3%" },
          { label: "Service Level", value: "95.4%", delta: "+1.2%" },
        ],
      },
      { kind: "table", caption: "Top SKUs by uplift", columns: ["SKU", "Class", "Last Month", "Forecast", "Δ %"], rows: [["A-1001", "A", 62000, 78500, "+26.6%"], ["A-1045", "A", 41100, 52700, "+28.1%"], ["B-2210", "B", 19900, 23400, "+17.6%"]] },
      ...(files.length ? [{ kind: "files", title: "Attached Context", files }] as RichBlock[] : []),
    ];
  }

  if (lower.includes("accuracy") || lower.includes("compare")) {
    return [
      { kind: "text", content: "Forecast accuracy improved to 78% in Jun (+7 pts vs Mar). Biggest gains came from causal features." },
      { kind: "chart", chartType: "bar", title: "Forecast Accuracy by Month", labels: demoAccuracy.labels, datasetLabel: "MAPE Accuracy %", data: demoAccuracy.values },
      { kind: "code", title: "Reproducible query (pseudo)", language: "sql", content: "SELECT month, mape_accuracy\nFROM forecast_metrics\nWHERE region = 'All'\nORDER BY month;" },
    ];
  }

  if (lower.includes("inventory") || lower.includes("turnover")) {
    return [
      { kind: "kpis", title: "Inventory Snapshot", items: [{ label: "Turnover", value: "5.8x", delta: "+0.3x" }, { label: "DOH", value: "42", delta: "-3" }, { label: "Stockouts (w/w)", value: "1.3%", delta: "-0.2%" }] },
      { kind: "text", content: "You can unlock ~₹1.1cr working capital by reducing safety stocks on slow movers." },
      { kind: "table", caption: "SKUs with excess stock", columns: ["SKU", "DOH", "SOH (units)", "Suggested Action"], rows: [["C-3302", "78", 12400, "Gradual markdown; hold PO"], ["B-1180", "66", 8950, "Transfer to North DC"], ["C-0141", "72", 5300, "Vendor return (consignment)"]] },
    ];
  }

  if (lower.includes("route")) {
    return [
      { kind: "text", content: "Generated a feasible mid-mile route plan under 8 hours per vehicle with balanced load." },
      { kind: "table", caption: "Vehicle Plans", columns: ["Vehicle", "Orders", "Distance (km)", "ETA (hh:mm)"], rows: [["V-01", 12, 138, "07:35"], ["V-02", 10, 124, "07:10"], ["V-03", 11, 131, "07:50"]] },
      { kind: "kpis", title: "Route KPIs", items: [{ label: "Total Distance", value: "393 km" }, { label: "Avg Utilization", value: "86%" }, { label: "On-time", value: "97%" }] },
    ];
  }

  if (lower.includes("replenishment")) {
    return [
      { kind: "text", content: "Replenishment plan generated using min-max with lead time and variability buffers." },
      { kind: "table", caption: "DC → Store Replenishment", columns: ["Store", "SKU", "Current SOH", "Target SOH", "Replenish Qty"], rows: [["S-12", "A-1001", 320, 600, 280], ["S-17", "A-1045", 150, 400, 250], ["S-03", "B-2210", 210, 350, 140]] },
    ];
  }

  if (lower.includes("procurement") || lower.includes("spend")) {
    return [
      { kind: "kpis", title: "Spend Overview (QTD)", items: [{ label: "Total Spend", value: "₹4.7cr" }, { label: "Savings vs LY", value: "₹27L", delta: "+6%" }, { label: "Top Vendor Share", value: "41%" }] },
      { kind: "table", caption: "Top Vendors", columns: ["Vendor", "Category", "Spend (₹)", "POs"], rows: [["Acme Plastics", "Packaging", "1.45cr", 42], ["Zen Steel", "Components", "1.12cr", 28], ["Nova Chem", "Chemicals", "0.77cr", 18]] },
    ];
  }

  if (lower.includes("production") || lower.includes("schedule")) {
    return [
      { kind: "text", content: "Draft detailed production schedule built from routings, capacities, and setup constraints." },
      { kind: "table", caption: "Work Center Timeline (Today)", columns: ["WC", "Job", "Start", "End", "Util%"], rows: [["WC-Press", "JOB-2411", "08:00", "10:15", "92%"], ["WC-Paint", "JOB-2412", "10:30", "12:10", "88%"], ["WC-Pack", "JOB-2413", "12:30", "15:00", "95%"]] },
    ];
  }

  if (lower.includes("finance") || lower.includes("cash flow") || lower.includes("capex") || lower.includes("opex")) {
    return [
      { kind: "kpis", title: "Financial Snapshot", items: [{ label: "Opex (Mtd)", value: "₹38.2L" }, { label: "Capex (Ytd)", value: "₹2.1cr" }, { label: "FCF (Qtd)", value: "₹73.4L" }] },
      { kind: "chart", chartType: "bar", title: "Cash Flow by Month (₹L)", labels: ["Apr", "May", "Jun", "Jul"], datasetLabel: "FCF", data: [12.1, 14.8, 20.3, 26.2] },
      { kind: "table", caption: "Major Capex Items", columns: ["Item", "₹ (L)", "Status"], rows: [["Line Automation", 78, "Approved"], ["Forklifts", 24, "RFQ"], ["Solar Roof", 112, "In Eval"]] },
    ];
  }

  if (files.length) {
    const firstImage = files.find(f => f.type.startsWith("image/") && f.url)?.url;
    return [
      { kind: "text", content: "I see you attached files. I’ll summarize what I can and you can ask deeper questions." },
      { kind: "files", title: "Files in context", files },
      ...(firstImage ? [{ kind: "image", title: "Preview", src: firstImage!, alt: "uploaded image" } as RichBlock] : []),
    ];
  }

  // Default
  return [
    { kind: "text", content: "Got it. I’ll analyze your question and reply with the most useful format—text, a table, a chart, images, or KPIs—based on data availability." },
  ];
}

export default Analytics;