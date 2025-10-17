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
        "p-5 cursor-pointer transition-all duration-200 bg-background border overflow-hidden w-[280px] min-h-[140px] rounded-2xl",
        "hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5",
        isActive 
          ? "shadow-lg border-primary/40 bg-primary/5" 
          : "shadow-sm border-border/60",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full space-y-3">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3">
          <div className={clsx(
            "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "bg-primary/10 text-primary"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground/90 flex-1 min-w-0 truncate">
            {title}
          </h3>
        </div>
        
        {/* Value and subtitle */}
        <div className="flex-1 space-y-1.5">
          <p className="text-2xl font-bold text-foreground leading-none">
            {value}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        </div>
      </div>
    </Card>
  );
};