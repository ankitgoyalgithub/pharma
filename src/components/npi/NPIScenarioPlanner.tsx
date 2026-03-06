import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip as RechartsTooltip, Cell, Legend, ComposedChart, Line
} from "recharts";
import { 
  TrendingUp, Target, Shield, Flame, BarChart3, Package, 
  Truck, ShoppingCart, Store, Globe, AlertTriangle, Zap
} from "lucide-react";
import type { NPIProduct, NPIScenario } from "@/data/npiPlanner/npiProductData";

interface Props {
  product: NPIProduct;
}

const scenarioColors = {
  conservative: { fill: "hsl(var(--info))", label: "Conservative", icon: Shield },
  base: { fill: "hsl(var(--primary))", label: "Base", icon: Target },
  aggressive: { fill: "hsl(var(--warning))", label: "Aggressive", icon: Flame },
};

const channelIcons = {
  amazon: ShoppingCart,
  flipkart: Store,
  d2c: Globe,
  retail: Truck,
};

export const NPIScenarioPlanner: React.FC<Props> = ({ product }) => {
  const [activeScenario, setActiveScenario] = useState<"conservative" | "base" | "aggressive">("base");
  const scenario = product.scenarios[activeScenario];
  const sc = scenarioColors[activeScenario];

  // Build demand curve data with all 3 scenarios for comparison
  const demandCurveData = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    conservative: product.scenarios.conservative.rampWeeks[i],
    base: product.scenarios.base.rampWeeks[i],
    aggressive: product.scenarios.aggressive.rampWeeks[i],
  }));

  // Channel mix data for selected scenario
  const channelData = Object.entries(scenario.channelMix).map(([ch, pct]) => ({
    channel: ch.charAt(0).toUpperCase() + ch.slice(1),
    key: ch,
    allocation: pct,
    units: Math.round((scenario.forecast * pct) / 100),
  }));

  return (
    <div className="space-y-4">
      {/* Scenario Selector */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Launch Scenarios — {product.product}
          </CardTitle>
          <p className="text-[10px] text-muted-foreground">
            Simulated demand curves under different marketing & price assumptions.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Scenario Pills */}
          <div className="flex gap-2 mb-4">
            {(["conservative", "base", "aggressive"] as const).map(key => {
              const cfg = scenarioColors[key];
              const s = product.scenarios[key];
              const Icon = cfg.icon;
              const isActive = activeScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveScenario(key)}
                  className={`flex-1 p-3 rounded-lg border transition-all duration-200 text-left ${
                    isActive
                      ? "border-primary/50 bg-primary/5 shadow-sm"
                      : "border-border/30 bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-[10px] font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-foreground">{s.forecast.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">
                    {s.confidenceLow.toLocaleString()} – {s.confidenceHigh.toLocaleString()} units
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.confidence}%`, backgroundColor: cfg.fill }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{s.confidence}% conf.</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Demand Curve Chart — all 3 overlaid */}
          <div className="text-[10px] font-semibold text-foreground mb-2">8-Week Demand Simulation</div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={demandCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <RechartsTooltip
                contentStyle={{ fontSize: 10, borderRadius: 8, background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                formatter={(v: number, name: string) => [`${v.toLocaleString()} units`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Area
                dataKey="conservative"
                fill="hsl(var(--info))"
                fillOpacity={activeScenario === "conservative" ? 0.2 : 0.05}
                stroke="hsl(var(--info))"
                strokeWidth={activeScenario === "conservative" ? 2.5 : 1}
                strokeDasharray={activeScenario === "conservative" ? "0" : "4 4"}
                type="monotone"
              />
              <Area
                dataKey="base"
                fill="hsl(var(--primary))"
                fillOpacity={activeScenario === "base" ? 0.2 : 0.05}
                stroke="hsl(var(--primary))"
                strokeWidth={activeScenario === "base" ? 2.5 : 1}
                strokeDasharray={activeScenario === "base" ? "0" : "4 4"}
                type="monotone"
              />
              <Area
                dataKey="aggressive"
                fill="hsl(var(--warning))"
                fillOpacity={activeScenario === "aggressive" ? 0.2 : 0.05}
                stroke="hsl(var(--warning))"
                strokeWidth={activeScenario === "aggressive" ? 2.5 : 1}
                strokeDasharray={activeScenario === "aggressive" ? "0" : "4 4"}
                type="monotone"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Build Quantity & Channel Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Build Recommendation */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Build Quantity & Ramp Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                <div className="text-[9px] text-muted-foreground mb-0.5">Initial Build</div>
                <div className="text-base font-bold text-foreground">{scenario.buildQty.toLocaleString()}</div>
                <div className="text-[9px] text-muted-foreground">units</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                <div className="text-[9px] text-muted-foreground mb-0.5">Forecast</div>
                <div className="text-base font-bold text-primary">{scenario.forecast.toLocaleString()}</div>
                <div className="text-[9px] text-muted-foreground">units</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                <div className="text-[9px] text-muted-foreground mb-0.5">Buffer</div>
                <div className="text-base font-bold text-warning">
                  {(((scenario.buildQty - scenario.forecast) / scenario.forecast) * 100).toFixed(0)}%
                </div>
                <div className="text-[9px] text-muted-foreground">safety stock</div>
              </div>
            </div>

            {/* Ramp bars */}
            <div className="space-y-1">
              <div className="text-[10px] font-medium text-foreground">Weekly Ramp Schedule</div>
              {scenario.rampWeeks.map((qty, i) => {
                const maxQty = Math.max(...scenario.rampWeeks);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[9px] text-muted-foreground w-6">W{i + 1}</span>
                    <div className="flex-1 h-4 bg-muted/30 rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-300"
                        style={{
                          width: `${(qty / maxQty) * 100}%`,
                          backgroundColor: sc.fill,
                          opacity: 0.7 + (qty / maxQty) * 0.3,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-foreground font-medium w-12 text-right">{qty.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Channel Mix Strategy */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Channel Mix Strategy
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Recommended inventory allocation at launch.
            </p>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {channelData.map(ch => {
              const Icon = channelIcons[ch.key as keyof typeof channelIcons] || Store;
              return (
                <div key={ch.key} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 border border-border/20">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-semibold text-foreground">{ch.channel}</span>
                      <span className="text-[10px] font-bold text-foreground">{ch.allocation}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${ch.allocation}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">
                      {ch.units.toLocaleString()} units allocated
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Risk callout */}
            {product.riskType && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-medium text-destructive">{product.riskType} Risk</div>
                  <div className="text-[9px] text-muted-foreground">{product.riskReason}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
