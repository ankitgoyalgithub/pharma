import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  AlertTriangle, Shield, Globe, TrendingUp, DollarSign, Package, Info,
  ChevronRight, ArrowRight, Download, Share, Zap, Target, BarChart3, Layers,
  Activity, Settings, FileText
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Bar, Doughnut, Line, Scatter } from "react-chartjs-2";
import { buildChartOptions, hslVar } from "@/lib/chartTheme";
import { ForecastCard } from "@/components/ForecastCard";
import {
  supplierConcentrationData, countryExposureData, overseasTrendData, fxExposureData,
  supplierRiskData, optimizationRecommendations, costComparisonData,
  safetyStockData, prepaymentExposureData, demandScenarioImpact, obsolescenceData,
  simulationDefaults, executiveSummary,
} from "@/data/procurement/procurementResultsData";

/* ── helpers ── */
const riskBg = (r: string) =>
  r === "Low" ? "bg-success/15 text-success" : r === "Medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";
const riskDot = (r: string) =>
  r === "Low" ? "bg-success" : r === "Medium" ? "bg-warning" : "bg-destructive";

const fmt = (v: number, prefix = "₹", suffix = "") => `${prefix}${v.toLocaleString("en-IN")}${suffix}`;

type TabId = "overview" | "supplier-risk" | "optimization" | "safety-stock" | "simulation";

/* ════════════════════════════════════════════════════
   TAB: Overview (Executive Summary + Risk Cards)
   ════════════════════════════════════════════════════ */
const OverviewTab = () => {
  const [fxSlider, setFxSlider] = useState([5]);
  const fxImpact = Math.round(fxExposureData.sensitivity * (fxSlider[0] / 5));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Executive Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10"><Zap className="w-5 h-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Procurement Optimization Insights</h2>
              <p className="text-xs text-muted-foreground">AI-driven recommendations based on demand forecasts, supplier risk, and supply chain constraints</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Findings</h4>
              <ul className="space-y-1.5">
                {executiveSummary.insights.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Actions</h4>
              <ul className="space-y-1.5">
                {executiveSummary.actions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Supplier Concentration */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-warning" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Supplier Concentration</span></div>
              <Badge className={riskBg("Medium")} variant="secondary">Medium</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">62%</p>
              <p className="text-xs text-muted-foreground">of procurement from top 10 suppliers</p>
            </div>
            <div className="text-xs text-muted-foreground">Top: <span className="font-medium text-foreground">Shenzhen Audio Tech</span> — 14%</div>
            <div className="space-y-1.5">
              {supplierConcentrationData.slice(0, 5).map(s => (
                <div key={s.supplier} className="flex items-center gap-2">
                  <div className="flex-1 text-[11px] truncate">{s.supplier}</div>
                  <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${s.share > 10 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${(s.share / 14) * 100}%` }} />
                  </div>
                  <div className="text-[11px] font-medium w-8 text-right">{s.share}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* China Exposure */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-destructive" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">China Exposure</span></div>
              <Badge className={riskBg("High")} variant="secondary">High</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">90%</p>
              <p className="text-xs text-muted-foreground">of overseas procurement (China + HK)</p>
            </div>
            <div className="space-y-1">
              {countryExposureData.map(c => (
                <div key={c.country} className="flex items-center gap-2">
                  <div className="flex-1 text-[11px]">{c.country}</div>
                  <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.share}%` }} />
                  </div>
                  <div className="text-[11px] font-medium w-8 text-right">{c.share}%</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {["Geopolitical risk", "Import restrictions", "Port disruptions"].map(t => (
                <Badge key={t} variant="outline" className="text-[10px] border-destructive/30 text-destructive">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overseas Trend */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overseas Mix Trend</span></div>
            <div className="flex items-baseline gap-3">
              {overseasTrendData.map(d => (
                <div key={d.year} className="text-center">
                  <p className={`text-xl font-bold ${d.year === "FY25" ? "text-primary" : "text-muted-foreground"}`}>{d.share}%</p>
                  <p className="text-[11px] text-muted-foreground">{d.year}</p>
                </div>
              ))}
            </div>
            <div className="h-16">
              <Line
                data={{
                  labels: overseasTrendData.map(d => d.year),
                  datasets: [{ data: overseasTrendData.map(d => d.share), borderColor: hslVar("--primary"), backgroundColor: hslVar("--primary", 0.1), fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: hslVar("--primary") }],
                }}
                options={buildChartOptions({ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } })}
              />
            </div>
            <p className="text-[11px] text-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Rising dependence on overseas sourcing</p>
          </CardContent>
        </Card>

        {/* FX Exposure */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">FX Risk Exposure</span></div>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-lg font-bold text-foreground">₹{fxExposureData.usdExposure}B</p><p className="text-[11px] text-muted-foreground">USD exposure</p></div>
              <div><p className="text-lg font-bold text-foreground">₹{fxExposureData.cnyExposure}B</p><p className="text-[11px] text-muted-foreground">CNY exposure</p></div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">FX sensitivity simulation</span>
                <span className="font-medium">+{fxSlider[0]}% USD move</span>
              </div>
              <Slider value={fxSlider} onValueChange={setFxSlider} min={1} max={15} step={1} />
              <p className="text-sm font-semibold text-destructive">+₹{fxImpact.toLocaleString("en-IN")}M cost impact</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prepayment + Obsolescence row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Prepayment */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Supplier Prepayment Exposure</CardTitle>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">₹1.3B <span className="text-xs font-normal text-muted-foreground">total prepaid</span></p>
                <p className="text-xs text-destructive font-medium">₹420M at risk</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Scatter
                data={{
                  datasets: prepaymentExposureData.map((p, i) => ({
                    label: p.supplier,
                    data: [{ x: p.cancellationRisk, y: p.prepayment, r: p.demandVolatility * 0.8 }],
                    backgroundColor: [hslVar("--primary", 0.6), hslVar("--destructive", 0.6), hslVar("--accent", 0.6), hslVar("--warning", 0.6), hslVar("--success", 0.6)][i],
                  })),
                }}
                options={buildChartOptions({
                  plugins: { legend: { position: "bottom" as const } },
                  scales: {
                    x: { title: { display: true, text: "Cancellation Risk (%)" }, beginAtZero: true },
                    y: { title: { display: true, text: "Prepayment (₹M)" }, beginAtZero: true },
                  },
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Obsolescence */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Inventory Obsolescence Risk</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-52">
                <Bar
                  data={{
                    labels: obsolescenceData.map(d => d.category),
                    datasets: [
                      { label: "Low Risk", data: obsolescenceData.map(d => d.low), backgroundColor: hslVar("--success", 0.7) },
                      { label: "Medium Risk", data: obsolescenceData.map(d => d.medium), backgroundColor: hslVar("--warning", 0.7) },
                      { label: "High Risk", data: obsolescenceData.map(d => d.high), backgroundColor: hslVar("--destructive", 0.7) },
                    ],
                  }}
                  options={buildChartOptions({
                    plugins: { legend: { position: "bottom" as const } },
                    scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: (v: number) => `${v}%` } } },
                  })}
                />
              </div>
              <div className="space-y-2">
                {obsolescenceData.map(d => (
                  <div key={d.category} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20">
                    <div className="flex-1">
                      <p className="text-xs font-medium">{d.category}</p>
                      <p className="text-[11px] text-muted-foreground">{d.totalUnits.toLocaleString("en-IN")} units</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <div className="h-4 rounded-l-sm bg-success" style={{ width: `${d.low * 0.8}px` }} />
                        <div className="h-4 bg-warning" style={{ width: `${d.medium * 0.8}px` }} />
                        <div className="h-4 rounded-r-sm bg-destructive" style={{ width: `${d.high * 0.8}px` }} />
                      </div>
                      <span className="text-[11px] font-medium text-destructive">{d.high}% high</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Change Impact */}
      <DemandChangeImpact />
    </div>
  );
};

/* ════════════════════════════════════════════════════
   Demand Change Impact (used in Overview)
   ════════════════════════════════════════════════════ */
const DemandChangeImpact = () => {
  const [scenario, setScenario] = useState(50);
  const label = scenario < 33 ? "-20%" : scenario > 66 ? "+20%" : "Base";
  const data = scenario < 33 ? demandScenarioImpact.negative20 : scenario > 66 ? demandScenarioImpact.positive20 : demandScenarioImpact.base;

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Demand Change Scenario Analysis</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Demand growth scenario</span>
                <Badge variant="outline" className="font-semibold">{label}</Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>-20%</span>
                <Slider value={[scenario]} onValueChange={v => setScenario(v[0])} min={0} max={100} step={1} className="flex-1" />
                <span>+20%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-destructive/20">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-destructive">₹{data.excessInventory.toLocaleString("en-IN")}M</p>
                  <p className="text-[11px] text-muted-foreground">Excess inventory risk</p>
                </CardContent>
              </Card>
              <Card className="border-warning/20">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-warning">₹{data.prepaymentExposure.toLocaleString("en-IN")}M</p>
                  <p className="text-[11px] text-muted-foreground">Prepayment exposure</p>
                </CardContent>
              </Card>
            </div>
            {"stockoutRisk" in data && (
              <Card className="border-primary/20">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">₹{(data as any).stockoutRisk.toLocaleString("en-IN")}M</p>
                  <p className="text-[11px] text-muted-foreground">Potential stockout loss</p>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="h-52">
            <Bar
              data={{
                labels: ["-20%", "Base", "+20%"],
                datasets: [
                  { label: "Excess Inventory (₹M)", data: [demandScenarioImpact.negative20.excessInventory, demandScenarioImpact.base.excessInventory, 0], backgroundColor: hslVar("--destructive", 0.6) },
                  { label: "Prepayment Risk (₹M)", data: [demandScenarioImpact.negative20.prepaymentExposure, demandScenarioImpact.base.prepaymentExposure, 0], backgroundColor: hslVar("--warning", 0.6) },
                  { label: "Stockout Risk (₹M)", data: [0, 0, demandScenarioImpact.positive20.stockoutRisk], backgroundColor: hslVar("--primary", 0.6) },
                ],
              }}
              options={buildChartOptions({ plugins: { legend: { position: "bottom" as const } }, scales: { x: {}, y: { beginAtZero: true } } })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ════════════════════════════════════════════════════
   TAB: Supplier Risk Heatmap
   ════════════════════════════════════════════════════ */
const SupplierRiskTab = () => {
  const [countryFilter, setCountryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const countries = [...new Set(supplierRiskData.map(s => s.country))];
  const filtered = useMemo(() => supplierRiskData.filter(s =>
    (countryFilter === "all" || s.country === countryFilter) &&
    (tierFilter === "all" || s.tier === tierFilter)
  ), [countryFilter, tierFilter]);

  return (
    <div className="animate-fade-in space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Supplier Risk Matrix</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>{[{ v: "all", l: "All Countries" }, ...countries.map(c => ({ v: c, l: c }))].map(o => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Tier" /></SelectTrigger>
                <SelectContent>{["all", "Tier 1", "Tier 2", "Tier 3"].map(t => <SelectItem key={t} value={t}>{t === "all" ? "All Tiers" : t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40">
                  <tr className="border-b">
                    <th className="px-3 py-2.5 text-left font-semibold">Supplier</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Country</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Component</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Share</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Lead Time</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Financial</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Capacity</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Compliance</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2.5 font-medium">{s.supplier}</td>
                      <td className="px-3 py-2.5">{s.country}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{s.component}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{s.share}%</td>
                      <td className="px-3 py-2.5 text-right">{s.leadTime}d</td>
                      {(["financialRisk", "capacityRisk", "complianceRisk", "overallRisk"] as const).map(k => (
                        <td key={k} className="px-3 py-2.5 text-center">
                          <Badge className={`${riskBg(s[k])} text-[10px]`} variant="secondary">{s[k]}</Badge>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${riskDot("Low")}`} />Low</span>
            <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${riskDot("Medium")}`} />Medium</span>
            <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${riskDot("High")}`} />High</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   TAB: Optimization (Sourcing + Local vs Overseas)
   ════════════════════════════════════════════════════ */
const OptimizationTab = () => {
  const ov = costComparisonData.overseas;
  const lc = costComparisonData.local;
  const segments = [
    { label: "Component", overseas: ov.component, local: lc.component, color: hslVar("--primary") },
    { label: "Shipping / Logistics", overseas: ov.shipping, local: lc.logistics, color: hslVar("--accent") },
    { label: "Duty", overseas: ov.duty, local: lc.duty, color: hslVar("--warning") },
    { label: "FX Risk", overseas: ov.fxRisk, local: lc.fxRisk, color: hslVar("--destructive") },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Recommendations Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Procurement Optimization Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40">
                <tr className="border-b">
                  <th className="px-3 py-2.5 text-left font-semibold">Component</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Current Strategy</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Recommended Strategy</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Savings</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Risk Reduction</th>
                </tr>
              </thead>
              <tbody>
                {optimizationRecommendations.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-3 font-medium">{r.component}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.currentStrategy}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {r.recommendedStrategy.map(s => (
                          <Badge key={s.country} variant="outline" className="text-[10px]">{s.country} {s.share}%</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-success">{r.savingsPotential}</td>
                    <td className="px-3 py-3 text-center"><Badge className={riskBg(r.riskReduction === "High" ? "Low" : r.riskReduction)} variant="secondary">{r.riskReduction}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Local vs Overseas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Local vs Overseas Sourcing Optimization</CardTitle>
            <Badge className="bg-success/15 text-success" variant="secondary">Duty Savings: {costComparisonData.netSavings}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <Bar
                data={{
                  labels: ["Overseas Sourcing", "Local Sourcing"],
                  datasets: segments.map(s => ({
                    label: s.label,
                    data: [s.overseas, s.local],
                    backgroundColor: s.color,
                  })),
                }}
                options={buildChartOptions({
                  plugins: { legend: { position: "bottom" as const } },
                  scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: (v: number) => `${v}%` } } },
                })}
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Cost Breakdown Comparison</p>
              {segments.map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                  <div className="flex-1 text-xs">{s.label}</div>
                  <div className="text-xs font-medium w-16 text-right">{s.overseas}%</div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <div className="text-xs font-medium w-16 text-right">{s.local}%</div>
                </div>
              ))}
              <Card className="border-success/30 bg-success/5 mt-3">
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-success">💡 Local manufacturing of key components (ABS housings, cable assemblies) can reduce total landed cost by {costComparisonData.netSavings}.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   TAB: Safety Stock
   ════════════════════════════════════════════════════ */
const SafetyStockTab = () => (
  <div className="animate-fade-in space-y-6">
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Safety Stock Optimization</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40">
                <tr className="border-b">
                  <th className="px-3 py-2.5 text-left font-semibold">SKU / Product</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Warehouse</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Current SS</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Recommended</th>
                  <th className="px-3 py-2.5 text-center font-semibold">SL%</th>
                  <th className="px-3 py-2.5 text-center font-semibold">LT Var.</th>
                </tr>
              </thead>
              <tbody>
                {safetyStockData.map((s, i) => (
                  <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{s.sku}</div>
                      <div className="text-[11px] text-muted-foreground">{s.product}</div>
                    </td>
                    <td className="px-3 py-2.5">{s.warehouse}</td>
                    <td className="px-3 py-2.5 text-right">{s.currentSS.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-primary">{s.recommendedSS.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2.5 text-center">{s.serviceLevel}%</td>
                    <td className="px-3 py-2.5 text-center"><Badge className={riskBg(s.leadTimeVariability === "High" ? "High" : s.leadTimeVariability === "Medium" ? "Medium" : "Low")} variant="secondary">{s.leadTimeVariability}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: safetyStockData.map(s => s.sku),
                datasets: [
                  { label: "Current", data: safetyStockData.map(s => s.currentSS), backgroundColor: hslVar("--muted-foreground", 0.3) },
                  { label: "Recommended", data: safetyStockData.map(s => s.recommendedSS), backgroundColor: hslVar("--primary", 0.7) },
                ],
              }}
              options={buildChartOptions({
                indexAxis: "y" as const,
                plugins: { legend: { position: "bottom" as const } },
                scales: { x: { beginAtZero: true } },
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ════════════════════════════════════════════════════
   TAB: Simulation
   ════════════════════════════════════════════════════ */
const SimulationTab = () => {
  const [params, setParams] = useState(simulationDefaults);
  const costIncrease = Math.round(((35 - params.leadTime) * -0.3 + (params.demandVolatility - 20) * 0.4 + (params.fxRate - 84.5) * 2 + (88 - params.supplierReliability) * 0.5) * 10) / 10;
  const ltIncrease = Math.round((35 - params.leadTime) * -0.5 + (88 - params.supplierReliability) * 0.8);

  return (
    <div className="animate-fade-in space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Procurement Simulation</CardTitle>
            <Badge variant="outline" className="text-[10px]">Interactive</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { label: "Lead Time (days)", key: "leadTime" as const, min: 10, max: 60, val: params.leadTime },
                { label: "Demand Volatility (%)", key: "demandVolatility" as const, min: 5, max: 50, val: params.demandVolatility },
                { label: "FX Rate (₹/USD)", key: "fxRate" as const, min: 78, max: 95, val: params.fxRate },
                { label: "Supplier Reliability (%)", key: "supplierReliability" as const, min: 60, max: 100, val: params.supplierReliability },
              ].map(s => (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium">{s.val}</span>
                  </div>
                  <Slider
                    value={[s.val]}
                    onValueChange={v => setParams(p => ({ ...p, [s.key]: v[0] }))}
                    min={s.min}
                    max={s.max}
                    step={s.key === "fxRate" ? 0.5 : 1}
                  />
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setParams(simulationDefaults)} className="w-full">Reset to Defaults</Button>
            </div>
            <div className="space-y-4">
              <Card className={`border ${costIncrease > 0 ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"}`}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Procurement Cost Impact</p>
                  <p className={`text-2xl font-bold ${costIncrease > 0 ? "text-destructive" : "text-success"}`}>
                    {costIncrease > 0 ? "+" : ""}{costIncrease}%
                  </p>
                </CardContent>
              </Card>
              <Card className={`border ${ltIncrease > 0 ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5"}`}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Lead Time Change</p>
                  <p className={`text-2xl font-bold ${ltIncrease > 0 ? "text-warning" : "text-success"}`}>
                    {ltIncrease > 0 ? "+" : ""}{ltIncrease} days
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Recommended Mitigation</p>
                  <p className="text-[11px] text-muted-foreground">
                    {params.supplierReliability < 80
                      ? "Increase Vietnam and India sourcing to 30% to reduce single-point dependency."
                      : params.fxRate > 88
                      ? "Hedge USD exposure via forward contracts. Accelerate local component sourcing."
                      : params.demandVolatility > 35
                      ? "Increase safety stock buffers by 20%. Reduce prepayments on volatile SKUs."
                      : "Current parameters within acceptable risk bounds. Continue monitoring."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAIN DASHBOARD — Demand Forecasting-style layout
   ════════════════════════════════════════════════════ */
const ProcurementResultsDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const tabTitle: Record<TabId, string> = {
    "overview": "Procurement Risk Overview",
    "supplier-risk": "Supplier Risk Heatmap",
    "optimization": "Sourcing Optimization",
    "safety-stock": "Safety Stock Optimization",
    "simulation": "Procurement Simulation",
  };

  const totalSavings = optimizationRecommendations.reduce((sum, r) => {
    const num = parseInt(r.savingsPotential.replace(/[^\d]/g, ""));
    return sum + num;
  }, 0);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full min-w-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
      {/* Left Sidebar — Clickable ForecastCards */}
      <div className="w-[280px] shrink-0 h-full bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col overflow-hidden shadow-lg">
        <div className="flex-none px-4 py-4 border-b border-border/50 bg-gradient-to-b from-card/90 to-card/70 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Results</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            <div className="flex justify-center">
              <ForecastCard
                title="Risk Overview"
                value="High"
                subtitle={`90% China exposure • ₹${totalSavings.toLocaleString("en-IN")}M savings potential
10 Suppliers • 5 Countries • FX ₹${fxExposureData.usdExposure}B`}
                icon={AlertTriangle}
                isActive={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Supplier Risk"
                value="10"
                subtitle={`Supplier risk heatmap with financial, capacity & compliance scoring. Filter by country & tier.`}
                icon={Shield}
                isActive={activeTab === "supplier-risk"}
                onClick={() => setActiveTab("supplier-risk")}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Sourcing Optimization"
                value={`₹${totalSavings.toLocaleString("en-IN")}M`}
                subtitle={`Diversification recommendations across ${optimizationRecommendations.length} components. Local vs overseas cost analysis.`}
                icon={Target}
                isActive={activeTab === "optimization"}
                onClick={() => setActiveTab("optimization")}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Safety Stock"
                value={`${safetyStockData.length}`}
                subtitle={`SKU-level safety stock recommendations based on lead time variability and service level targets.`}
                icon={Package}
                isActive={activeTab === "safety-stock"}
                onClick={() => setActiveTab("safety-stock")}
              />
            </div>

            <div className="flex justify-center">
              <ForecastCard
                title="Simulation"
                value="Interactive"
                subtitle={`Adjust lead time, demand volatility, FX rate & supplier reliability to simulate procurement impact.`}
                icon={Activity}
                isActive={activeTab === "simulation"}
                onClick={() => setActiveTab("simulation")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex-none flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold tracking-tight text-foreground animate-fade-in">
            {tabTitle[activeTab]}
          </h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />CSV</DropdownMenuItem>
                <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />XLSX</DropdownMenuItem>
                <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />PPTX</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/5">
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "supplier-risk" && <SupplierRiskTab />}
            {activeTab === "optimization" && <OptimizationTab />}
            {activeTab === "safety-stock" && <SafetyStockTab />}
            {activeTab === "simulation" && <SimulationTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementResultsDashboard;
