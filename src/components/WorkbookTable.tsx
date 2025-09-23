import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, Search } from "lucide-react";

// Minimal inline sparkline for visual flair
const MiniSparkline: React.FC<{ points: number[]; className?: string }> = ({ points, className }) => {
  const width = 64;
  const height = 16;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = (v: number) => (max === min ? height / 2 : height - ((v - min) / (max - min)) * height);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * width},${norm(p)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <path d={path} className="stroke-primary" fill="none" strokeWidth={1.5} />
    </svg>
  );
};

interface RowItem {
  id: string;
  product: string;
  category: string;
  subcategory: string;
  class: "A" | "B" | "C";
  location: string;
  channel: "Online" | "Retail" | "B2B" | "Direct";
  owner: string; // Name for avatar fallback
  history: number; // value in millions
  variancePct: number; // -0.31 => -31%
  plannerInput?: string;
  signal: number[]; // sparkline data
}

const sampleRows: RowItem[] = [
  { id: "1", product: "Widget A", category: "Electronics", subcategory: "Accessories", class: "A", location: "Delhi", channel: "Online", owner: "Aman Gupta", history: 2.5, variancePct: 0.088, plannerInput: "", signal: [3, 5, 4, 6, 5, 7, 6] },
  { id: "2", product: "Widget B", category: "Electronics", subcategory: "Components", class: "A", location: "Mumbai", channel: "Retail", owner: "Neha Rao", history: 1.8, variancePct: 0.059, plannerInput: "", signal: [6, 6, 5, 7, 8, 7, 7] },
  { id: "3", product: "Widget C", category: "Electronics", subcategory: "Components", class: "B", location: "Bangalore", channel: "B2B", owner: "Priya Shah", history: 3.2, variancePct: -0.31, plannerInput: "", signal: [8, 7, 6, 5, 6, 5, 6] },
  { id: "4", product: "Widget D", category: "Electronics", subcategory: "Components", class: "A", location: "Chennai", channel: "Direct", owner: "Suresh I.", history: 1.6, variancePct: 0.067, plannerInput: "", signal: [4, 5, 6, 6, 7, 7, 8] },
  { id: "5", product: "Widget E", category: "Electronics", subcategory: "Class", class: "B", location: "Kolkata", channel: "Online", owner: "Ritika P.", history: 2.1, variancePct: 0.91, plannerInput: "", signal: [5, 4, 4, 5, 6, 6, 6] },
];

export const WorkbookTable: React.FC = () => {
  const [rows, setRows] = useState<RowItem[]>(sampleRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState<string>("All");
  const [filterClass, setFilterClass] = useState<string>("Hierarchy");
  const [sortKey, setSortKey] = useState<keyof RowItem | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleAll = (checked: boolean) => setSelected(checked ? filteredSorted.map((r) => r.id) : []);
  const toggleOne = (id: string, checked: boolean) => setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const filteredSorted = useMemo(() => {
    let data = rows.filter((r) =>
      [r.product, r.category, r.subcategory, r.location, r.channel].some((v) => v.toLowerCase().includes(search.toLowerCase()))
    );
    if (filterChannel !== "All") data = data.filter((r) => r.channel === (filterChannel as RowItem["channel"]));
    if (filterClass !== "Hierarchy") data = data.filter((r) => r.class === (filterClass as RowItem["class"]));
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey]! as any;
        const bv = b[sortKey]! as any;
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return data;
  }, [rows, search, filterChannel, filterClass, sortKey, sortDir]);

  const setPlannerInput = (id: string, value: string) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, plannerInput: value } : r)));

  const sortBy = (key: keyof RowItem) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toCurrency = (v: number) => `₹ ${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;

  const exportCSV = () => {
    const headers = [
      "Product",
      "Category",
      "Subcategory",
      "Class",
      "Location",
      "Channel",
      "Owner",
      "History",
      "Variance",
      "Planner Input",
    ];
    const rowsCsv = filteredSorted
      .map((r) => [r.product, r.category, r.subcategory, r.class, r.location, r.channel, r.owner, toCurrency(r.history), `${(r.variancePct * 100).toFixed(1)}%`, r.plannerInput ?? ""].join(","))
      .join("\n");
    const blob = new Blob([[headers.join(",") , "\n", rowsCsv].join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast-workbook.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select defaultValue={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Hierarchy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hierarchy">Hierarchy</SelectItem>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56" />
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr className="text-xs uppercase tracking-wide">
                  <th className="w-10 p-3 h-12">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      onChange={(e) => toggleAll(e.target.checked)}
                      checked={selected.length > 0 && selected.length === filteredSorted.length}
                      aria-label="Select all rows"
                    />
                  </th>
                  {[
                    { key: "product", label: "Product" },
                    { key: "category", label: "Category" },
                    { key: "subcategory", label: "Subcategory" },
                    { key: "class", label: "Class" },
                    { key: "location", label: "Location" },
                    { key: "channel", label: "Channel" },
                    { key: "owner", label: "Owner" },
                    { key: "history", label: "History" },
                    { key: "variancePct", label: "Variance" },
                    { key: "plannerInput", label: "Planner Input" },
                    { key: "signal", label: "Signal" },
                  ].map((h) => (
                    <th
                      key={h.key as string}
                      className="text-left p-3 h-12 cursor-pointer hover:bg-muted font-semibold"
                      onClick={() => sortBy(h.key as keyof RowItem)}
                    >
                      {h.label}
                    </th>
                  ))}
                  <th className="w-10 p-3 h-12" />
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map((r) => {
                  const initials = r.owner
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const positive = r.variancePct >= 0;
                  return (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={selected.includes(r.id)}
                          onChange={(e) => toggleOne(r.id, e.target.checked)}
                          aria-label={`Select row for ${r.product}`}
                        />
                      </td>
                      <td className="p-3 font-medium">{r.product}</td>
                      <td className="p-3">{r.category}</td>
                      <td className="p-3">{r.subcategory}</td>
                      <td className="p-3">{r.class}</td>
                      <td className="p-3">{r.location}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {r.channel}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="" alt={r.owner} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{r.owner}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{toCurrency(r.history)}</td>
                      <td className="p-3">
                        <Badge
                          variant="secondary"
                          className={`${positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                        >
                          {(r.variancePct * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Input
                          value={r.plannerInput ?? ""}
                          onChange={(e) => setPlannerInput(r.id, e.target.value)}
                          placeholder="Add"
                          className="h-8 w-24"
                        />
                      </td>
                      <td className="p-3">
                        <MiniSparkline points={r.signal} />
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>{selected.length > 0 ? `${selected.length} selected` : ``}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default WorkbookTable;
