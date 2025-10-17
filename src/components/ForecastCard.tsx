import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface ForecastCardProps {
  title?: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}


export const ForecastCard: React.FC<ForecastCardProps> = ({
  title = "Forecast SnapShot",
  value,
  subtitle,
  icon: Icon,
  isActive = false,
  onClick,
  className,
}) => {
  return (
    <Card
      className={clsx(
        "p-5 cursor-pointer transition-all duration-300 bg-card border-border/40 overflow-hidden w-[280px] min-h-[140px]",
        "rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5",
        "hover:border-primary/20 hover:shadow-primary/5",
        isActive && "bg-primary/5 border-primary/30 shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full min-h-0 gap-3">
        {/* Header with title */}
        <div>
          <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wide truncate">
            {title}
          </h3>
        </div>
        
        {/* Main content with icon on left and data on right */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon with gradient background */}
          <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          
          {/* Content on right */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-2xl font-bold text-foreground leading-tight mb-1.5 truncate">
              {value}
            </p>
            <p className="text-sm text-muted-foreground leading-snug break-words">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};