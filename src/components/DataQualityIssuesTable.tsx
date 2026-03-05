import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle, AlertCircle, Info, Lightbulb, FileText, Hash, Columns, Activity } from "lucide-react";
import { DataQualityIssue } from "@/data/demandForecasting/dataQualityIssues";

interface DataQualityIssuesTableProps {
  issues: DataQualityIssue[];
}

const severityConfig = {
  high: { label: "High", variant: "destructive" as const, icon: AlertTriangle, color: "text-red-500" },
  medium: { label: "Medium", variant: "default" as const, icon: AlertCircle, color: "text-amber-500" },
  low: { label: "Low", variant: "secondary" as const, icon: Info, color: "text-blue-500" },
};

export const DataQualityIssuesTable = ({ issues }: DataQualityIssuesTableProps) => {
  const [previewIssue, setPreviewIssue] = useState<DataQualityIssue | null>(null);

  return (
    <>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Value</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Impact</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Preview</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{issue.file}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{issue.rowNumber}</td>
                    <td className="py-3 px-4 text-sm font-medium">{issue.column}</td>
                    <td className="py-3 px-4 text-sm">{issue.issueType}</td>
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
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewIssue(issue)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Issue Preview Dialog */}
      <Dialog open={!!previewIssue} onOpenChange={(open) => !open && setPreviewIssue(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Issue Details
            </DialogTitle>
            <DialogDescription>
              Detailed view of the detected data quality issue
            </DialogDescription>
          </DialogHeader>

          {previewIssue && (() => {
            const sev = severityConfig[previewIssue.severity];
            const SevIcon = sev.icon;
            return (
              <div className="space-y-4">
                {/* Severity & Type */}
                <div className="flex items-center justify-between">
                  <Badge variant={sev.variant} className="gap-1">
                    <SevIcon className="h-3 w-3" />
                    {sev.label} Severity
                  </Badge>
                  <Badge variant="outline">{previewIssue.issueType}</Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">File</p>
                      <p className="text-sm font-mono font-medium">{previewIssue.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Row</p>
                      <p className="text-sm font-medium">{previewIssue.rowNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Columns className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Column</p>
                      <p className="text-sm font-medium">{previewIssue.column}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Impact Score</p>
                      <p className="text-sm font-medium">{previewIssue.impactScore}/10</p>
                    </div>
                  </div>
                </div>

                {/* Current vs Suggested */}
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="text-sm font-mono font-medium">
                      {previewIssue.currentValue || <span className="italic text-muted-foreground">null</span>}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" /> Suggested Fix
                    </p>
                    <p className="text-sm font-mono font-medium text-green-700 dark:text-green-400">
                      {previewIssue.suggestedFix}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">AI Explanation</p>
                  <p className="text-sm leading-relaxed">{previewIssue.explanation}</p>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};
