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
        "p-5 cursor-pointer bg-card/80 backdrop-blur-sm border overflow-hidden w-[280px] min-h-[140px]",
        "rounded-2xl shadow-elevated",
        "transition-all duration-500 ease-out",
        "hover:shadow-glow hover:-translate-y-1.5 hover:scale-[1.03]",
        "hover:border-primary/40 hover:bg-card",
        "active:scale-[0.98]",
        isActive && "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/40 shadow-glow scale-[1.02] ring-2 ring-primary/20",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full min-h-0 gap-3">
        {/* Header with title */}
        <div>
          <h3 className="text-xs font-bold text-primary/80 uppercase tracking-wider truncate">
            {title}
          </h3>
        </div>
        
        {/* Main content with icon on left and data on right */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon with gradient background */}
          <div className={clsx(
            "flex-shrink-0 p-3 rounded-xl transition-all duration-300",
            isActive ? "bg-primary/20 shadow-md ring-2 ring-primary/30" : "bg-primary/10"
          )}>
            <Icon className="w-6 h-6 text-primary" />
          </div>
          
          {/* Content on right */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-2xl font-bold text-foreground leading-tight mb-1.5 truncate">
              {value}
            </p>
            <p className="text-sm text-muted-foreground leading-snug break-words line-clamp-3">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};