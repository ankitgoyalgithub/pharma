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
    <Card className={`shadow-card border-0 ${className}`}>
      <CardContent className="p-2 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <div className="text-xs text-muted-foreground">{title}</div>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-xl font-bold text-primary mb-0.5">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
};