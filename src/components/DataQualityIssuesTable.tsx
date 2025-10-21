import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { DataQualityIssue } from "@/data/demandForecasting/dataQualityIssues";

interface DataQualityIssuesTableProps {
  issues: DataQualityIssue[];
}

export const DataQualityIssuesTable = ({ issues }: DataQualityIssuesTableProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Info className="h-4 w-4 text-warning" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Quality Issues Detected</CardTitle>
        <CardDescription>
          {issues.length} issues found across {new Set(issues.map(i => i.file)).size} files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">File</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Row</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Column</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Value</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Impact</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono">{issue.file}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{issue.rowNumber}</td>
                  <td className="py-3 px-4 text-sm font-medium">{issue.column}</td>
                  <td className="py-3 px-4 text-sm">{issue.issueType}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getSeverityColor(issue.severity)} className="gap-1">
                      {getSeverityIcon(issue.severity)}
                      {issue.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                    {issue.currentValue || <span className="italic">null</span>}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary" 
                          style={{ width: `${issue.impactScore * 10}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{issue.impactScore}/10</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
