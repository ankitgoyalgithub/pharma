import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CompactProjectionCardProps {
  title: string;
  value: string;
  subtitle: string;
  tooltip: string;
  className?: string;
}

export const CompactProjectionCard: React.FC<CompactProjectionCardProps> = ({
  title,
  value,
  subtitle,
  tooltip,
  className
}) => {
  return (
    <Card className={`shadow-elevated border border-border/40 hover:shadow-glow hover:border-border/60 transition-all duration-300 ${className}`}>
      <CardContent className="p-3 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <div className="text-xs text-muted-foreground font-medium">{title}</div>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-2xl font-bold text-primary mb-1">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
};