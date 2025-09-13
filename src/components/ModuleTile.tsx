import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "Sales" | "Operations" | "Finance" | "Revenue" | "Data";
  recentlyUsed?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const categoryColors = {
  Sales: "bg-primary-glow text-primary dark:bg-primary/20 dark:text-primary-light",
  Operations: "bg-accent-light/30 text-accent dark:bg-accent/20 dark:text-accent-light",
  Finance: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Revenue: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Data: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
};

const categoryGradients = {
  Sales: "bg-gradient-sales",
  Operations: "bg-gradient-operations", 
  Finance: "bg-gradient-finance",
  Revenue: "bg-gradient-revenue",
  Data: "bg-gradient-data"
};

export const ModuleTile = ({
  title,
  description,
  icon,
  category,
  recentlyUsed,
  className,
  style,
  onClick
}: ModuleTileProps) => {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-card/80 backdrop-blur-sm min-h-[200px] relative overflow-hidden",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.08]",
        categoryGradients[category]
      )} />
      <CardContent className="p-5 h-full flex flex-col relative z-10">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon}
          </div>
          {recentlyUsed && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-accent/10 text-accent border-accent/20 font-medium">
              Recent
            </Badge>
          )}
        </div>

        {/* Category + Text */}
        <div className="space-y-2 mb-4">
          <Badge className={cn("text-xs px-2 py-0.5 font-medium", categoryColors[category])}>
            {category}
          </Badge>

          <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Button (pushed to bottom) */}
        <Button
          variant="default"
          className="mt-auto self-end bg-[#4f74f9] hover:bg-[#3f64e0] text-white h-8 px-4 rounded-full text-sm font-medium flex items-center gap-2 shadow"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          Run
        </Button>
      </CardContent>
    </Card>
  );
};
