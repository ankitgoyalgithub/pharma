import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, FlaskConical, ArrowRight, CheckCircle, AlertTriangle, 
  Clock, Package, ChevronRight, Zap, TrendingUp
} from "lucide-react";
import type { NPIProduct } from "@/data/npiPlanner/npiProductData";

interface Props {
  products: NPIProduct[];
  onSelectProduct: (p: NPIProduct) => void;
  selectedSku: string | null;
}

const statusConfig = {
  "pre-launch": { label: "Pre-Launch", icon: Clock, cls: "bg-warning/15 text-warning border-warning/30" },
  "launched": { label: "Launched", icon: Rocket, cls: "bg-success/15 text-success border-success/30" },
  "monitoring": { label: "Monitoring", icon: TrendingUp, cls: "bg-primary/15 text-primary border-primary/30" },
};

const readinessItems = [
  { key: "inventory" as const, label: "Inventory" },
  { key: "marketing" as const, label: "Marketing" },
  { key: "supplier" as const, label: "Supplier" },
  { key: "listing" as const, label: "Listing" },
];

export const NPIRoadmapView: React.FC<Props> = ({ products, onSelectProduct, selectedSku }) => {
  return (
    <div className="space-y-4">
      {/* Pipeline header */}
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">boAt Labs Roadmap → Demand & Supply Planning</span>
      </div>

      {/* Pipeline cards */}
      <div className="grid gap-3">
        {products.map((p) => {
          const sc = statusConfig[p.launchStatus];
          const StatusIcon = sc.icon;
          const isSelected = selectedSku === p.sku;
          const readyCount = readinessItems.filter(r => p.readiness[r.key]).length;

          return (
            <Card
              key={p.sku}
              className={`border-border/40 cursor-pointer transition-all duration-200 hover:shadow-elevated ${
                isSelected ? "ring-2 ring-primary/50 border-primary/40" : ""
              }`}
              onClick={() => onSelectProduct(p)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: product info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className={`${sc.cls} text-[9px] px-1.5 py-0.5`}>
                        <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                        {sc.label}
                      </Badge>
                      <Badge className="bg-muted text-muted-foreground border-border/30 text-[9px] px-1.5 py-0.5">
                        {p.category}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground font-mono">{p.labsRoadmapId}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground truncate">{p.product}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{p.featureSet}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      ASP: <span className="text-foreground font-medium">₹{p.asp.toLocaleString()}</span>
                      <span className="mx-1.5">·</span>
                      Launch: <span className="text-foreground font-medium">{p.launchDate}</span>
                    </div>
                  </div>

                  {/* Middle: analogous product */}
                  <div className="hidden md:flex flex-col items-center gap-1 px-4 border-l border-r border-border/20 min-w-[140px]">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Analogous Product</div>
                    <div className="text-[10px] text-foreground font-medium text-center">{p.comparableProduct}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.similarity}%` }} />
                      </div>
                      <span className="text-[10px] text-primary font-semibold">{p.similarity}%</span>
                    </div>
                  </div>

                  {/* Right: readiness gauge */}
                  <div className="flex flex-col items-end gap-1.5 min-w-[100px]">
                    <div className="text-[9px] text-muted-foreground">Readiness</div>
                    <div className="flex gap-1">
                      {readinessItems.map(r => (
                        <div
                          key={r.key}
                          className={`w-5 h-5 rounded flex items-center justify-center text-[8px] ${
                            p.readiness[r.key]
                              ? "bg-success/15 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                          title={`${r.label}: ${p.readiness[r.key] ? "Ready" : "Not Ready"}`}
                        >
                          {p.readiness[r.key] ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] font-medium text-foreground">{readyCount}/4 ready</div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
