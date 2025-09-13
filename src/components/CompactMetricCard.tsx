import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CompactMetricCardProps {
  value: string;
  label: string;
  tooltip: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "info";
  };
  valueColor?: "success" | "primary" | "warning" | "info";
  className?: string;
}

const colorClasses = {
  success: "text-success",
  primary: "text-primary", 
  warning: "text-warning",
  info: "text-info"
};

const badgeClasses = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info"
};

export const CompactMetricCard: React.FC<CompactMetricCardProps> = ({
  value,
  label,
  tooltip,
  badge,
  valueColor = "primary",
  className
}) => {
  return (
    <Card className={`shadow-card border-0 ${className}`}>
      <CardContent className="p-2 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <div className={`text-lg font-bold ${colorClasses[valueColor]}`}>
            {value}
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        {badge && (
          <Badge variant="secondary" className={`${badgeClasses[badge.variant]} text-xs`}>
            {badge.text}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};