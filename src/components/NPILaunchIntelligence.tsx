import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Rocket, DollarSign, AlertTriangle, Calendar, Zap, Target, 
  FlaskConical, BarChart3, Activity, Package
} from "lucide-react";
import { npiProducts } from "@/data/npiPlanner/npiProductData";
import { NPIRoadmapView } from "@/components/npi/NPIRoadmapView";
import { NPIScenarioPlanner } from "@/components/npi/NPIScenarioPlanner";
import { NPIPostLaunchMonitor } from "@/components/npi/NPIPostLaunchMonitor";
import type { NPIProduct } from "@/data/npiPlanner/npiProductData";

// ── Summary metrics ──
const totalExpectedRevenue = npiProducts.reduce((s, p) => s + (p.scenarios.base.forecast * p.asp), 0);
const highRiskCount = npiProducts.filter(p => p.readinessScore < 70).length;
const launchedCount = npiProducts.filter(p => p.launchStatus === "launched").length;
const preLaunchCount = npiProducts.filter(p => p.launchStatus === "pre-launch").length;

export const NPILaunchIntelligence: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<NPIProduct | null>(null);
  const [activePhase, setActivePhase] = useState("roadmap");

  return (
    <div className="space-y-5 animate-fade-in">
      <p className="text-xs text-muted-foreground">
        End-to-end NPI planning — from boAt Labs roadmap to post-launch monitoring with scenario-based demand simulation.
      </p>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border-border/40 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3 text-center">
            <Rocket className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-primary">{npiProducts.length}</div>
            <div className="text-[10px] text-muted-foreground">Pipeline SKUs</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 text-success mx-auto mb-1" />
            <div className="text-xl font-bold text-success">₹{(totalExpectedRevenue / 10000000).toFixed(1)}Cr</div>
            <div className="text-[10px] text-muted-foreground">Expected Revenue</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-3 text-center">
            <Activity className="w-4 h-4 text-warning mx-auto mb-1" />
            <div className="text-xl font-bold text-warning">{launchedCount}</div>
            <div className="text-[10px] text-muted-foreground">Live / Monitoring</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-3 text-center">
            <Package className="w-4 h-4 text-accent-foreground mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground">{preLaunchCount}</div>
            <div className="text-[10px] text-muted-foreground">Pre-Launch</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-3 text-center">
            <AlertTriangle className="w-4 h-4 text-destructive mx-auto mb-1" />
            <div className="text-xl font-bold text-destructive">{highRiskCount}</div>
            <div className="text-[10px] text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Phase Tabs ── */}
      <Tabs value={activePhase} onValueChange={(v) => { setActivePhase(v); if (v !== "scenarios") setSelectedProduct(null); }}>
        <TabsList className="w-full grid grid-cols-3 h-9">
          <TabsTrigger value="roadmap" className="text-[10px] gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            Labs Roadmap
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="text-[10px] gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Scenario Planner
          </TabsTrigger>
          <TabsTrigger value="monitor" className="text-[10px] gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Post-Launch Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="mt-4">
          <NPIRoadmapView
            products={npiProducts}
            onSelectProduct={(p) => { setSelectedProduct(p); setActivePhase("scenarios"); }}
            selectedSku={selectedProduct?.sku || null}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="mt-4">
          {selectedProduct ? (
            <NPIScenarioPlanner product={selectedProduct} />
          ) : (
            <Card className="border-border/40">
              <CardContent className="p-8 text-center">
                <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <div className="text-sm font-medium text-muted-foreground">Select a Product</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Go to Labs Roadmap and click a product to view launch scenarios.
                </p>
                {/* Quick select buttons */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {npiProducts.map(p => (
                    <button
                      key={p.sku}
                      onClick={() => setSelectedProduct(p)}
                      className="px-3 py-1.5 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors text-[10px] text-foreground font-medium"
                    >
                      {p.product.split(" ").slice(0, 3).join(" ")}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitor" className="mt-4">
          <NPIPostLaunchMonitor products={npiProducts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
