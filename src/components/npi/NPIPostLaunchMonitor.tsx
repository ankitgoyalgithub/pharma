import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as RechartsTooltip, Cell, ReferenceLine
} from "recharts";
import {
  Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  ArrowUpRight, ArrowDownRight, Package, Percent
} from "lucide-react";
import type { NPIProduct } from "@/data/npiPlanner/npiProductData";

interface Props {
  products: NPIProduct[];
}

export const NPIPostLaunchMonitor: React.FC<Props> = ({ products }) => {
  const launchedProducts = products.filter(p => p.launchStatus === "launched" && p.postLaunch.length > 0);

  if (launchedProducts.length === 0) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-8 text-center">
          <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium text-muted-foreground">No Launched Products Yet</div>
          <p className="text-[10px] text-muted-foreground mt-1">Post-launch monitoring will appear here once products go live.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Post-Launch Monitoring — Actuals vs Plan</span>
      </div>

      {launchedProducts.map(product => {
        const completedWeeks = product.postLaunch.filter(w => w.actual !== null);
        const totalPlanned = completedWeeks.reduce((s, w) => s + w.planned, 0);
        const totalActual = completedWeeks.reduce((s, w) => s + (w.actual || 0), 0);
        const overallVariance = totalPlanned > 0 ? ((totalActual - totalPlanned) / totalPlanned) * 100 : 0;
        const isAhead = overallVariance >= 0;

        // Determine recommendation
        let recommendation = "";
        let recommendationCls = "";
        if (overallVariance > 10) {
          recommendation = "Demand exceeding plan — consider accelerating production ramp and procurement orders.";
          recommendationCls = "bg-success/10 border-success/20 text-success";
        } else if (overallVariance < -15) {
          recommendation = "Significant under-performance — evaluate discounting strategy and marketing spend reallocation.";
          recommendationCls = "bg-destructive/10 border-destructive/20 text-destructive";
        } else if (overallVariance < -5) {
          recommendation = "Slightly below plan — monitor next 2 weeks before adjusting production schedule.";
          recommendationCls = "bg-warning/10 border-warning/20 text-warning";
        } else {
          recommendation = "Tracking close to base scenario — maintain current production and distribution plan.";
          recommendationCls = "bg-primary/10 border-primary/20 text-primary";
        }

        return (
          <Card key={product.sku} className="border-border/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{product.product}</CardTitle>
                <Badge className="bg-success/15 text-success border-success/30 text-[9px]">Live since {product.launchDate}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/20">
                  <div className="text-[9px] text-muted-foreground">Planned (Cum.)</div>
                  <div className="text-base font-bold text-foreground">{totalPlanned.toLocaleString()}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/20">
                  <div className="text-[9px] text-muted-foreground">Actual (Cum.)</div>
                  <div className={`text-base font-bold ${isAhead ? "text-success" : "text-destructive"}`}>{totalActual.toLocaleString()}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/20">
                  <div className="text-[9px] text-muted-foreground">Variance</div>
                  <div className={`text-base font-bold flex items-center justify-center gap-0.5 ${isAhead ? "text-success" : "text-destructive"}`}>
                    {isAhead ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {overallVariance > 0 ? "+" : ""}{overallVariance.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/20">
                  <div className="text-[9px] text-muted-foreground">Weeks Tracked</div>
                  <div className="text-base font-bold text-foreground">{completedWeeks.length}/8</div>
                </div>
              </div>

              {/* Actuals vs Plan Chart */}
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={product.postLaunch}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <RechartsTooltip
                    contentStyle={{ fontSize: 10, borderRadius: 8, background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                    formatter={(v: number | null, name: string) => [v !== null ? `${v.toLocaleString()} units` : "—", name === "planned" ? "Planned" : "Actual"]}
                  />
                  <Bar dataKey="planned" fill="hsl(var(--muted-foreground))" fillOpacity={0.25} radius={[3, 3, 0, 0]} name="planned" />
                  <Bar dataKey="actual" radius={[3, 3, 0, 0]} name="actual">
                    {product.postLaunch.map((w, i) => (
                      <Cell
                        key={i}
                        fill={w.actual === null ? "transparent" : (w.variance !== null && w.variance >= 0) ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                        fillOpacity={w.actual === null ? 0 : 0.7}
                      />
                    ))}
                  </Bar>
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Week-by-week variance table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      {["Week", "Planned", "Actual", "Variance", "Status"].map(h => (
                        <th key={h} className="text-left py-1.5 px-2 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.postLaunch.map((w, i) => (
                      <tr key={i} className="border-b border-border/10 hover:bg-muted/10">
                        <td className="py-1.5 px-2 text-[10px] font-medium text-foreground">{w.week}</td>
                        <td className="py-1.5 px-2 text-[10px] text-muted-foreground">{w.planned.toLocaleString()}</td>
                        <td className="py-1.5 px-2 text-[10px] text-foreground font-medium">
                          {w.actual !== null ? w.actual.toLocaleString() : <span className="text-muted-foreground italic">Pending</span>}
                        </td>
                        <td className="py-1.5 px-2">
                          {w.variance !== null ? (
                            <Badge className={`text-[9px] px-1.5 py-0.5 ${w.variance >= 0 ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                              {w.variance > 0 ? "+" : ""}{w.variance.toFixed(1)}%
                            </Badge>
                          ) : <span className="text-[10px] text-muted-foreground">—</span>}
                        </td>
                        <td className="py-1.5 px-2">
                          {w.actual === null ? (
                            <Badge className="bg-muted text-muted-foreground text-[9px] px-1.5 py-0.5">Upcoming</Badge>
                          ) : w.variance !== null && Math.abs(w.variance) <= 10 ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Recommendation */}
              <div className={`p-3 rounded-lg border ${recommendationCls}`}>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-semibold">AI Recommendation</div>
                    <div className="text-[10px] mt-0.5 opacity-90">{recommendation}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
