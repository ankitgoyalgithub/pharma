import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { abcXyzMatrixData, abcXyzHeaders, abcXyzLegend } from "@/data/demandForecasting/abcXyzMatrix";

const getPriorityColors = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-success/10 border-success/30 hover:bg-success/20";
    case "medium":
      return "bg-warning/10 border-warning/30 hover:bg-warning/20";
    case "risk":
      return "bg-destructive/10 border-destructive/30 hover:bg-destructive/20";
    case "low":
      return "bg-muted/10 border-muted-foreground/20 hover:bg-muted/20";
    default:
      return "bg-card border-border";
  }
};

const getLegendColor = (color: string) => {
  switch (color) {
    case "success":
      return "bg-success";
    case "warning":
      return "bg-warning";
    case "destructive":
      return "bg-destructive";
    case "muted":
      return "bg-muted-foreground";
    default:
      return "bg-primary";
  }
};

export const ABCXYZMatrix: React.FC = () => {
  const getCellData = (row: string, col: string) => {
    return abcXyzMatrixData.find((item) => item.row === row && item.col === col);
  };

  return (
    <TooltipProvider>
      <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">
                ABC-XYZ Segmentation Matrix
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Matrix combining value (ABC) and variability (XYZ) analysis.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Column Headers */}
              <div className="flex mb-1">
                <div className="w-16 shrink-0" /> {/* Empty corner */}
                {abcXyzHeaders.cols.map((col) => (
                  <div
                    key={col.id}
                    className="flex-1 min-w-[140px] text-center px-1"
                  >
                    <div className="font-semibold text-xs text-foreground">
                      {col.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {col.sublabel}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {abcXyzHeaders.rows.map((row) => (
                <div key={row.id} className="flex mb-1">
                  {/* Row Header */}
                  <div className="w-16 shrink-0 flex flex-col items-center justify-center pr-2">
                    <div className="font-semibold text-sm text-foreground">
                      {row.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground text-center">
                      {row.sublabel}
                    </div>
                  </div>

                  {/* Cells */}
                  {abcXyzHeaders.cols.map((col) => {
                    const cellData = getCellData(row.id, col.id);
                    if (!cellData) return null;

                    return (
                      <Tooltip key={`${row.id}${col.id}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex-1 min-w-[140px] p-2 mx-0.5 rounded-md border transition-all cursor-help ${getPriorityColors(
                              cellData.priority
                            )}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-semibold text-xs text-foreground">
                                {cellData.segment}
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-foreground">
                                {cellData.skuCount} SKUs
                              </div>
                              <div className="text-xs font-semibold text-foreground">
                                {cellData.revenue}
                              </div>
                              <div className="text-[10px] text-muted-foreground italic">
                                {cellData.label}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs font-medium">{cellData.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 pt-2 border-t border-border/40">
            <div className="flex flex-wrap gap-3 justify-center">
              {abcXyzLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded ${getLegendColor(item.color)}`} />
                  <div className="text-[10px]">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-muted-foreground ml-1">- {item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
