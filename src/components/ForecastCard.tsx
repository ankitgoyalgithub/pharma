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
        "p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg bg-card border-border overflow-hidden max-w-[280px] min-h-[140px]",
        "hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.1),0_8px_25px_-8px_hsl(var(--primary)/0.15)]",
        isActive && "ring-2 ring-primary/30 border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with title */}
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-primary truncate">
            {title}
          </h3>
        </div>
        
        {/* Main content with icon on left and data on right */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Enhanced icon with blue accent */}
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          
          {/* Content on right */}
          <div className="flex-1 min-w-0">
            <p className="text-lg sm:text-xl font-bold text-foreground leading-none mb-1 truncate">
              {value}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};