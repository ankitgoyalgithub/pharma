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
  showManualControls?: boolean;
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
  onPreviewDriver,
  showManualControls = false
}) => {
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = React.useState(true);
  
  // Handle AI suggestions toggle - automatically select/deselect auto-selected drivers
  React.useEffect(() => {
    console.log('AI Suggestions toggled:', aiSuggestionsEnabled);
    console.log('Current drivers:', drivers);
    console.log('Current selected drivers:', selectedDrivers);
    
    if (showManualControls) {
      const autoSelectedDrivers = drivers.filter(driver => driver.autoSelected);
      console.log('Auto-selected drivers:', autoSelectedDrivers);
      
      autoSelectedDrivers.forEach(driver => {
        const isCurrentlySelected = selectedDrivers.includes(driver.name);
        console.log(`Driver ${driver.name}: currently selected = ${isCurrentlySelected}, should be selected = ${aiSuggestionsEnabled}`);
        
        if (aiSuggestionsEnabled && !isCurrentlySelected) {
          console.log(`Auto-selecting driver: ${driver.name}`);
          onToggleDriver(driver.name);
        } else if (!aiSuggestionsEnabled && isCurrentlySelected) {
          console.log(`Auto-deselecting driver: ${driver.name}`);
          onToggleDriver(driver.name);
        }
      });
    }
  }, [aiSuggestionsEnabled, showManualControls]); // Don't include drivers/selectedDrivers to avoid infinite loops
  
  return (
    <div>
      {showManualControls && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">AI Suggestions</span>
            <GradientSwitch 
              checked={aiSuggestionsEnabled}
              onCheckedChange={setAiSuggestionsEnabled}
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-3">
        {drivers.map((driver) => {
          const isSelected = selectedDrivers.includes(driver.name);
          const isAutoSelected = driver.autoSelected && aiSuggestionsEnabled;
          const isLoadingThis = driversLoading && isAutoSelected;
          const isDisabled = driversLoading && !isAutoSelected && !isSelected;
          const IconComponent = getIconComponent(driver.icon);
          
          // Icon colors based on driver type
          const getIconColor = () => {
            if (driver.name.toLowerCase().includes('weather')) return 'text-blue-500';
            if (driver.name.toLowerCase().includes('holiday')) return 'text-purple-500';
            if (driver.name.toLowerCase().includes('promotion')) return 'text-orange-500';
            if (driver.name.toLowerCase().includes('price')) return 'text-green-500';
            if (driver.name.toLowerCase().includes('inventory')) return 'text-cyan-500';
            if (driver.name.toLowerCase().includes('competitor')) return 'text-red-500';
            return 'text-primary';
          };
          
          return (
            <div
              key={driver.name}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border bg-card transition-all hover:shadow-md ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/30'
              } ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : ''}`}
              onClick={() => !isDisabled && !isLoadingThis && onToggleDriver(driver.name)}
            >
              <div className="relative mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <IconComponent className={`h-5 w-5 ${isSelected ? 'text-primary' : getIconColor()}`} />
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icons.Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center leading-tight">{driver.name}</span>
              {isLoadingThis && (
                <div className="mt-1 animate-spin h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};