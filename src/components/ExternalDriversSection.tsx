import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GradientSwitch } from "@/components/ui/gradient-switch";
import { Info, Zap } from "lucide-react";
import * as Icons from "lucide-react";

interface ExternalDriver {
  name: string;
  autoSelected: boolean;
  icon: string;
}

interface ExternalDriversSectionProps {
  title?: string;
  description?: string;
  drivers: ExternalDriver[];
  selectedDrivers: string[];
  driversLoading?: boolean;
  onToggleDriver: (driverName: string) => void;
  onPreviewDriver?: (driverName: string) => void;
}

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Circle;
};

export const ExternalDriversSection: React.FC<ExternalDriversSectionProps> = ({
  title = "AI Suggested External Drivers",
  description = "AI-suggested external factors that may influence patterns based on your data characteristics.",
  drivers,
  selectedDrivers,
  driversLoading = false,
  onToggleDriver,
  onPreviewDriver
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {drivers.map((driver) => {
          const isSelected = selectedDrivers.includes(driver.name);
          const isAutoSelected = driver.autoSelected;
          const isLoadingThis = driversLoading && isAutoSelected;
          const isDisabled = driversLoading && !isAutoSelected && !isSelected;
          const IconComponent = getIconComponent(driver.icon);
          
          return (
            <div
              key={driver.name}
              className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-colors ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/50 cursor-pointer'
              }`}
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => !isDisabled && !isLoadingThis && onToggleDriver(driver.name)}
              >
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{driver.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {isSelected && onPreviewDriver && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-1 h-6 text-xs"
                    onClick={() => onPreviewDriver(driver.name)}
                  >
                    Preview
                  </Button>
                )}
                {isLoadingThis ? (
                  <div className="animate-spin h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full" />
                ) : (
                  <GradientSwitch 
                    checked={isSelected} 
                    disabled={isDisabled}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};