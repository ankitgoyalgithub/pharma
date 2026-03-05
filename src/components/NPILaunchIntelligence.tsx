import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Rocket, TrendingUp, AlertTriangle, Target, ShieldCheck, 
  Zap, BarChart3, Info, ChevronRight, Flame, Calendar,
  DollarSign, CheckCircle, XCircle, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LineChart, Line, Tooltip as RechartsTooltip } from "recharts";

// ── NPI Product Data ──
const npiProducts = [
  {
    sku: "NEW-TWS-001", product: "Airdopes Prime 701 ANC", type: "New Launch", category: "Earbuds",
    comparableSku: "SKU_001", comparableProduct: "Airdopes 601", similarity: 84,
    launchForecast: 18000, confidence: "Medium", price: 2999,
    launchCurve: [800, 2400, 3900, 5100, 4800, 4200, 3600, 3200],
    channelMix: { amazon: 40, d2c: 35, retail: 25 },
    riskType: "Cannibalization", riskReason: "Similar to Airdopes 601, may reduce demand by 18%",
    cannibalizationTarget: "Airdopes 601", cannibalizationPct: 18,
    priceElasticity: "High", festivalDependency: "Medium (Prime Day)",
    readinessScore: 78, readiness: { inventory: true, marketing: true, supplier: false },
    successProbability: 72, successDrivers: ["Similar product success", "Category growth", "Strong online demand"],
    marketingUplift: { baseline: 18000, withCampaign: 24000, upliftPct: 33, campaignType: "Social media + brand campaign" },
    benchmark: { competitor: "Noise Buds VS104", priceGap: -8, batteryGap: 20, featureEdge: "ANC + ENC" }
  },
  {
    sku: "NEW-HP-002", product: "Rockerz 650 Pro ANC", type: "New Product", category: "Headphones",
    comparableSku: "SKU_021", comparableProduct: "Rockerz 550", similarity: 91,
    launchForecast: 12500, confidence: "High", price: 3999,
    launchCurve: [600, 1800, 3200, 4500, 4100, 3800, 3500, 3100],
    channelMix: { amazon: 35, d2c: 40, retail: 25 },
    riskType: "Cannibalization", riskReason: "Direct upgrade path from Rockerz 550",
    cannibalizationTarget: "Rockerz 550", cannibalizationPct: 24,
    priceElasticity: "Low", festivalDependency: "Low",
    readinessScore: 88, readiness: { inventory: true, marketing: true, supplier: true },
    successProbability: 85, successDrivers: ["Strong brand recall", "Proven form factor", "ANC upgrade demand"],
    marketingUplift: { baseline: 12500, withCampaign: 15600, upliftPct: 25, campaignType: "Brand ambassador campaign" },
    benchmark: { competitor: "JBL Tune 770NC", priceGap: -15, batteryGap: 10, featureEdge: "40mm drivers" }
  },
  {
    sku: "NEW-SPK-003", product: "PartyPal 500 Speaker", type: "Trending SKU", category: "Speakers",
    comparableSku: "SKU_029", comparableProduct: "PartyPal 300", similarity: 79,
    launchForecast: 9200, confidence: "Medium", price: 4999,
    launchCurve: [400, 1100, 2200, 3800, 5200, 4600, 3900, 3400],
    channelMix: { amazon: 30, d2c: 20, retail: 50 },
    riskType: "Seasonality", riskReason: "Depends heavily on festival & wedding season demand",
    cannibalizationTarget: "PartyPal 300", cannibalizationPct: 12,
    priceElasticity: "Medium", festivalDependency: "High (Diwali/Wedding)",
    readinessScore: 65, readiness: { inventory: true, marketing: false, supplier: false },
    successProbability: 68, successDrivers: ["Party speaker segment growth", "Wedding season timing", "Bass-heavy trend"],
    marketingUplift: { baseline: 9200, withCampaign: 13800, upliftPct: 50, campaignType: "YouTube creator partnerships" },
    benchmark: { competitor: "JBL Flip 6", priceGap: -12, batteryGap: 15, featureEdge: "RGB lights + mic" }
  },
  {
    sku: "RE-NB-004", product: "Rockerz 255 v3 (Re-entry)", type: "Re-entry", category: "Earbuds",
    comparableSku: "SKU_005", comparableProduct: "Rockerz 255 v2", similarity: 95,
    launchForecast: 22000, confidence: "High", price: 1299,
    launchCurve: [2200, 4800, 6500, 7200, 6800, 5500, 4900, 4200],
    channelMix: { amazon: 45, d2c: 15, retail: 40 },
    riskType: "Supply", riskReason: "Previous version sold out during BBD — supply ramp critical",
    cannibalizationTarget: null, cannibalizationPct: 0,
    priceElasticity: "High", festivalDependency: "High (BBD/Republic Day)",
    readinessScore: 72, readiness: { inventory: false, marketing: true, supplier: false },
    successProbability: 82, successDrivers: ["Proven demand history", "Budget segment leader", "Strong reviews"],
    marketingUplift: { baseline: 22000, withCampaign: 26400, upliftPct: 20, campaignType: "Flash sale + social ads" },
    benchmark: { competitor: "Realme Buds Wireless 3", priceGap: -5, batteryGap: -8, featureEdge: "Brand trust" }
  },
  {
    sku: "BDL-GM-005", product: "Immortal 350 Gaming TWS", type: "New Segment", category: "Earbuds",
    comparableSku: "SKU_018", comparableProduct: "Immortal 121", similarity: 72,
    launchForecast: 7500, confidence: "Low", price: 2499,
    launchCurve: [300, 900, 1600, 2400, 2800, 3100, 2900, 2600],
    channelMix: { amazon: 50, d2c: 35, retail: 15 },
    riskType: "Channel", riskReason: "Gaming niche — heavy online dependency, retail uncertain",
    cannibalizationTarget: "Immortal 121", cannibalizationPct: 8,
    priceElasticity: "Low", festivalDependency: "Medium (Gaming events)",
    readinessScore: 58, readiness: { inventory: false, marketing: false, supplier: true },
    successProbability: 55, successDrivers: ["Gaming audio growth", "Low latency demand", "Esports partnerships"],
    marketingUplift: { baseline: 7500, withCampaign: 11200, upliftPct: 49, campaignType: "Esports tournament sponsorship" },
    benchmark: { competitor: "Redgear Shadow Vox", priceGap: 10, batteryGap: 25, featureEdge: "50ms latency" }
  },
];

// ── Summary metrics ──
const totalExpectedRevenue = npiProducts.reduce((s, p) => s + (p.launchForecast * p.price), 0);
const highRiskCount = npiProducts.filter(p => p.readinessScore < 70).length;
const cannibalizationCount = npiProducts.filter(p => p.cannibalizationPct > 0).length;
const festivalDependent = npiProducts.filter(p => p.festivalDependency.startsWith("High")).length;

const confidenceColor: Record<string, string> = {
  High: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-destructive/15 text-destructive border-destructive/30",
};

const ReadinessIcon = ({ ok }: { ok: boolean }) => ok 
  ? <CheckCircle className="w-3 h-3 text-success" /> 
  : <AlertTriangle className="w-3 h-3 text-warning" />;

export const NPILaunchIntelligence: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof npiProducts[0] | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <p className="text-xs text-muted-foreground">
        Launch intelligence for new product introductions — demand estimates, comparable analysis, channel strategy & risk assessment.
      </p>

      {/* ── 1. NPI Launch Outlook Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border-border/40 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <Rocket className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-primary">5</div>
            <div className="text-[10px] text-muted-foreground">New SKU Launches</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 text-success mx-auto mb-1" />
            <div className="text-xl font-bold text-success">₹{(totalExpectedRevenue / 10000000).toFixed(1)}Cr</div>
            <div className="text-[10px] text-muted-foreground">Expected Revenue</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-3 text-center">
            <AlertTriangle className="w-4 h-4 text-destructive mx-auto mb-1" />
            <div className="text-xl font-bold text-destructive">{highRiskCount}</div>
            <div className="text-[10px] text-muted-foreground">High Risk Launches</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-3 text-center">
            <Zap className="w-4 h-4 text-warning mx-auto mb-1" />
            <div className="text-xl font-bold text-warning">{cannibalizationCount}</div>
            <div className="text-[10px] text-muted-foreground">Cannibalization Risk</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-3 text-center">
            <Calendar className="w-4 h-4 text-accent-foreground mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground">{festivalDependent}</div>
            <div className="text-[10px] text-muted-foreground">Festival Dependent</div>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. Launch Demand & Comparable SKU Table ── */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-primary" />
            Launch Demand Estimates & Comparable Products
          </CardTitle>
          <p className="text-[10px] text-muted-foreground">Click any row to see detailed launch intelligence.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  {["SKU", "Product", "Type", "Comparable SKU", "Similarity", "Launch Forecast", "Confidence", "Price", ""].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {npiProducts.map(p => (
                  <tr key={p.sku} className="border-b border-border/20 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => setSelectedProduct(p)}>
                    <td className="py-2 px-2 font-mono text-[10px] text-foreground">{p.sku}</td>
                    <td className="py-2 px-2 text-[10px] text-foreground font-medium">{p.product}</td>
                    <td className="py-2 px-2"><Badge className="bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5 py-0.5 whitespace-nowrap">{p.type}</Badge></td>
                    <td className="py-2 px-2 text-[10px] text-muted-foreground">{p.comparableProduct}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${p.similarity}%` }} />
                        </div>
                        <span className="text-[10px] text-foreground font-medium">{p.similarity}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-[10px] text-foreground font-semibold">{p.launchForecast.toLocaleString()} units</td>
                    <td className="py-2 px-2"><Badge className={`${confidenceColor[p.confidence]} text-[10px] px-1.5 py-0.5`}>{p.confidence}</Badge></td>
                    <td className="py-2 px-2 text-[10px] text-foreground">₹{p.price.toLocaleString()}</td>
                    <td className="py-2 px-2"><ChevronRight className="w-3 h-3 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Three-Column Insights: Launch Curves, Channel Mix, Risk Signals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Launch Curve Prediction */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Launch Ramp-Up Curves
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.from({ length: 8 }, (_, i) => ({
                week: `W${i + 1}`,
                ...Object.fromEntries(npiProducts.slice(0, 3).map(p => [p.product.split(" ").slice(0, 2).join(" "), p.launchCurve[i]]))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                {npiProducts.slice(0, 3).map((p, i) => (
                  <Line key={p.sku} type="monotone" dataKey={p.product.split(" ").slice(0, 2).join(" ")} stroke={["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))"][i]} strokeWidth={2} dot={{ r: 2 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Launch Allocation */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              Channel Launch Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {npiProducts.map(p => (
                <div key={p.sku}>
                  <div className="text-[10px] text-foreground font-medium mb-1">{p.product.split(" ").slice(0, 3).join(" ")}</div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                    <div className="bg-primary h-full" style={{ width: `${p.channelMix.amazon}%` }} title={`Amazon ${p.channelMix.amazon}%`} />
                    <div className="bg-success h-full" style={{ width: `${p.channelMix.d2c}%` }} title={`D2C ${p.channelMix.d2c}%`} />
                    <div className="bg-warning h-full" style={{ width: `${p.channelMix.retail}%` }} title={`Retail ${p.channelMix.retail}%`} />
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>Amazon {p.channelMix.amazon}%</span>
                    <span>D2C {p.channelMix.d2c}%</span>
                    <span>Retail {p.channelMix.retail}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Launch Risk Signals */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              Launch Risk Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {npiProducts.map(p => (
                <div key={p.sku} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/20">
                  <Badge className={`text-[9px] px-1.5 py-0.5 whitespace-nowrap shrink-0 ${
                    p.riskType === "Cannibalization" ? "bg-destructive/15 text-destructive border-destructive/30" :
                    p.riskType === "Seasonality" ? "bg-warning/15 text-warning border-warning/30" :
                    p.riskType === "Supply" ? "bg-accent/15 text-accent-foreground border-accent/30" :
                    "bg-primary/15 text-primary border-primary/30"
                  }`}>{p.riskType}</Badge>
                  <div>
                    <div className="text-[10px] text-foreground font-medium">{p.product.split(" ").slice(0, 3).join(" ")}</div>
                    <div className="text-[9px] text-muted-foreground">{p.riskReason}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Cannibalization + Price Elasticity + Festival Dependency ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cannibalization Risk */}
        <Card className="border-border/40 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-destructive" />
              Cannibalization Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {npiProducts.filter(p => p.cannibalizationPct > 0).map(p => (
              <div key={p.sku} className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-medium text-foreground">{p.product.split(" ").slice(0, 3).join(" ")}</span>
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] px-1.5 py-0.5">-{p.cannibalizationPct}%</Badge>
                </div>
                <div className="text-[9px] text-muted-foreground">
                  May reduce <span className="text-foreground font-medium">{p.cannibalizationTarget}</span> demand by {p.cannibalizationPct}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-warning" />
              Festival Dependency
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-1.5 px-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product</th>
                  <th className="text-left py-1.5 px-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Dependency</th>
                </tr>
              </thead>
              <tbody>
                {npiProducts.map(p => (
                  <tr key={p.sku} className="border-b border-border/20">
                    <td className="py-1.5 px-1 text-[10px] text-foreground">{p.product.split(" ").slice(0, 3).join(" ")}</td>
                    <td className="py-1.5 px-1">
                      <Badge className={`text-[9px] px-1.5 py-0.5 ${
                        p.festivalDependency.startsWith("High") ? "bg-destructive/15 text-destructive border-destructive/30" :
                        p.festivalDependency.startsWith("Medium") ? "bg-warning/15 text-warning border-warning/30" :
                        "bg-success/15 text-success border-success/30"
                      }`}>{p.festivalDependency}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ── 5. Launch Readiness + Success Probability + Marketing Uplift ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Launch Readiness Scores */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Launch Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {npiProducts.map(p => (
              <div key={p.sku} className="p-2.5 rounded-lg bg-muted/20 border border-border/20">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-medium text-foreground">{p.product.split(" ").slice(0, 3).join(" ")}</span>
                  <span className={`text-sm font-bold ${p.readinessScore >= 80 ? 'text-success' : p.readinessScore >= 65 ? 'text-warning' : 'text-destructive'}`}>{p.readinessScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1.5">
                  <div className={`h-full rounded-full ${p.readinessScore >= 80 ? 'bg-success' : p.readinessScore >= 65 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${p.readinessScore}%` }} />
                </div>
                <div className="flex gap-3 text-[9px]">
                  <span className="flex items-center gap-0.5"><ReadinessIcon ok={p.readiness.inventory} /> Inventory</span>
                  <span className="flex items-center gap-0.5"><ReadinessIcon ok={p.readiness.marketing} /> Marketing</span>
                  <span className="flex items-center gap-0.5"><ReadinessIcon ok={p.readiness.supplier} /> Supplier</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NPI Success Probability */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-success" />
              Launch Success Probability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={npiProducts.map(p => ({ name: p.product.split(" ").slice(0, 2).join(" "), probability: p.successProbability }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={70} stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                  {npiProducts.map((p, i) => (
                    <Cell key={i} fill={p.successProbability >= 80 ? "hsl(var(--success))" : p.successProbability >= 65 ? "hsl(var(--warning))" : "hsl(var(--destructive))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marketing Uplift Simulation */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Marketing Uplift Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2.5">
            {npiProducts.map(p => (
              <div key={p.sku} className="p-2 rounded-lg bg-muted/20 border border-border/20">
                <div className="text-[10px] font-medium text-foreground mb-1">{p.product.split(" ").slice(0, 3).join(" ")}</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground">{p.marketingUplift.baseline.toLocaleString()}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-success font-semibold">{p.marketingUplift.withCampaign.toLocaleString()}</span>
                  <Badge className="bg-success/15 text-success border-success/30 text-[9px] px-1 py-0">+{p.marketingUplift.upliftPct}%</Badge>
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{p.marketingUplift.campaignType}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── 6. Market Benchmark ── */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            Competitive Benchmark
          </CardTitle>
          <p className="text-[10px] text-muted-foreground">boAt NPI vs closest competitor comparison.</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  {["boAt Product", "Competitor", "Price Gap", "Battery Gap", "Feature Edge"].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {npiProducts.map(p => (
                  <tr key={p.sku} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2 px-2 text-[10px] text-foreground font-medium">{p.product.split(" ").slice(0, 3).join(" ")}</td>
                    <td className="py-2 px-2 text-[10px] text-muted-foreground">{p.benchmark.competitor}</td>
                    <td className="py-2 px-2">
                      <Badge className={`text-[9px] px-1.5 py-0.5 ${p.benchmark.priceGap <= 0 ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                        {p.benchmark.priceGap > 0 ? "+" : ""}{p.benchmark.priceGap}%
                      </Badge>
                    </td>
                    <td className="py-2 px-2">
                      <Badge className={`text-[9px] px-1.5 py-0.5 ${p.benchmark.batteryGap >= 0 ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                        {p.benchmark.batteryGap > 0 ? "+" : ""}{p.benchmark.batteryGap}%
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-[10px] text-foreground">{p.benchmark.featureEdge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Product Detail Dialog ── */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              {selectedProduct?.product} — Launch Intelligence
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold text-primary">{selectedProduct.launchForecast.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground">Launch Forecast</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className={`text-lg font-bold ${selectedProduct.successProbability >= 70 ? 'text-success' : 'text-warning'}`}>{selectedProduct.successProbability}%</div>
                    <div className="text-[9px] text-muted-foreground">Success Prob.</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className={`text-lg font-bold ${selectedProduct.readinessScore >= 70 ? 'text-success' : 'text-warning'}`}>{selectedProduct.readinessScore}%</div>
                    <div className="text-[9px] text-muted-foreground">Readiness</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className="text-lg font-bold text-foreground">{selectedProduct.similarity}%</div>
                    <div className="text-[9px] text-muted-foreground">Proxy Match</div>
                  </div>
                </div>

                {/* Launch Curve */}
                <div>
                  <div className="text-[11px] font-semibold text-foreground mb-2">8-Week Launch Ramp-Up</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={selectedProduct.launchCurve.map((v, i) => ({ week: `W${i+1}`, units: v }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                      <RechartsTooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      <Bar dataKey="units" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comparable + Channel + Risk */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-muted/20 border border-border/20">
                    <div className="text-[10px] font-semibold text-foreground mb-1">Comparable Product</div>
                    <div className="text-[10px] text-muted-foreground">{selectedProduct.comparableProduct} ({selectedProduct.comparableSku})</div>
                    <div className="text-[10px] text-primary font-medium">{selectedProduct.similarity}% similarity</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/20 border border-border/20">
                    <div className="text-[10px] font-semibold text-foreground mb-1">Marketing Uplift</div>
                    <div className="text-[10px] text-muted-foreground">{selectedProduct.marketingUplift.baseline.toLocaleString()} → {selectedProduct.marketingUplift.withCampaign.toLocaleString()} units</div>
                    <div className="text-[10px] text-success font-medium">+{selectedProduct.marketingUplift.upliftPct}% with {selectedProduct.marketingUplift.campaignType}</div>
                  </div>
                </div>

                {/* Success Drivers */}
                <div className="p-2.5 rounded-lg bg-success/5 border border-success/15">
                  <div className="text-[10px] font-semibold text-foreground mb-1">Success Drivers</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.successDrivers.map(d => (
                      <Badge key={d} className="bg-success/15 text-success border-success/30 text-[9px] px-1.5 py-0.5">{d}</Badge>
                    ))}
                  </div>
                </div>

                {/* Readiness Checklist */}
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/20">
                  <div className="text-[10px] font-semibold text-foreground mb-1.5">Launch Readiness Checklist</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px]">
                      <ReadinessIcon ok={selectedProduct.readiness.inventory} />
                      <span className={selectedProduct.readiness.inventory ? "text-foreground" : "text-warning"}>Inventory positioning {selectedProduct.readiness.inventory ? "ready" : "— not ready"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <ReadinessIcon ok={selectedProduct.readiness.marketing} />
                      <span className={selectedProduct.readiness.marketing ? "text-foreground" : "text-warning"}>Marketing campaign {selectedProduct.readiness.marketing ? "planned" : "— not planned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <ReadinessIcon ok={selectedProduct.readiness.supplier} />
                      <span className={selectedProduct.readiness.supplier ? "text-foreground" : "text-warning"}>Supplier ramp-up {selectedProduct.readiness.supplier ? "confirmed" : "— risk"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
