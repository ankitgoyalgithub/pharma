import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ArrowRight, Sparkles, Download, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { DataQualityIssue } from "@/data/demandForecasting/dataQualityIssues";

interface AutoFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: DataQualityIssue[];
  onApplyFixes: () => void;
}

type DialogPhase = "fix" | "review";

export const AutoFixDialog = ({ open, onOpenChange, issues, onApplyFixes }: AutoFixDialogProps) => {
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);
  const [phase, setPhase] = useState<DialogPhase>("fix");
  const [showOnlyChanged, setShowOnlyChanged] = useState(true);
  
  // Generate stable confidence values for each issue
  const confidenceValues = useMemo(() => {
    return issues.reduce((acc, issue) => {
      acc[issue.id] = (85 + Math.random() * 10).toFixed(1);
      return acc;
    }, {} as Record<string, string>);
  }, [issues]);

  const handleAutoFix = async () => {
    setFixing(true);
    setProgress(0);
    setFixedIssues([]);

    for (let i = 0; i < issues.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(((i + 1) / issues.length) * 100);
      setFixedIssues(prev => [...prev, issues[i].id]);
    }

    setFixing(false);
  };

  const handleApply = () => {
    onApplyFixes();
    setPhase("review");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setProgress(0);
      setFixedIssues([]);
      setPhase("fix");
      setShowOnlyChanged(true);
    }, 300);
  };

  const allFixed = fixedIssues.length === issues.length && !fixing;

  // Summary stats for review phase
  const reviewStats = useMemo(() => {
    const totalRows = issues.reduce((sum, i) => sum + (i.rowNumber || 1), 0);
    const avgConfidence = issues.length
      ? (issues.reduce((sum, i) => sum + parseFloat(confidenceValues[i.id] || "90"), 0) / issues.length).toFixed(1)
      : "0";
    const issueTypes = [...new Set(issues.map(i => i.issueType))];
    return { totalRows, avgConfidence, issueTypes, totalIssues: issues.length };
  }, [issues, confidenceValues]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {phase === "fix" ? (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Data Quality Fix
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Fixed Data Review
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {phase === "fix"
              ? `Using advanced ML models to analyze and fix ${issues.length} data quality issues`
              : `All ${issues.length} issues have been resolved. Review the changes below.`
            }
          </DialogDescription>
        </DialogHeader>

        {phase === "fix" ? (
          /* ===================== FIX PHASE ===================== */
          <>
            <div className="space-y-4 flex-1 overflow-hidden">
              {fixing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing issues...</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Model: gemini-2.5-flash | Analyzing patterns and applying statistical imputation
                  </p>
                </div>
              )}

              <ScrollArea className="flex-1 pr-4" style={{ maxHeight: "50vh" }}>
                <div className="space-y-3">
                  {issues.map((issue) => {
                    const isFixed = fixedIssues.includes(issue.id);
                    const isProcessing = fixing && !isFixed && fixedIssues.length === issues.indexOf(issue);

                    return (
                      <div
                        key={issue.id}
                        className={`border rounded-lg p-4 transition-all ${
                          isFixed
                            ? 'border-primary bg-primary/5'
                            : isProcessing
                            ? 'border-primary bg-primary/10 animate-pulse'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm">{issue.file}</span>
                              <Badge variant="outline" className="text-xs">
                                Row {issue.rowNumber}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {issue.column}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.issueType}</p>
                          </div>
                          {isFixed && (
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>

                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mt-3">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Current Value</p>
                            <code className="block px-2 py-1 bg-muted rounded text-sm font-mono">
                              {issue.currentValue || <span className="italic text-muted-foreground">null</span>}
                            </code>
                          </div>

                          <ArrowRight className={`h-4 w-4 flex-shrink-0 ${isFixed ? 'text-primary' : 'text-muted-foreground'}`} />

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Suggested Fix</p>
                            <code className={`block px-2 py-1 rounded text-sm font-mono ${
                              isFixed ? 'bg-primary/20 text-primary' : 'bg-muted'
                            }`}>
                              {issue.suggestedFix}
                            </code>
                          </div>
                        </div>

                        {(isFixed || isProcessing) && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">
                              <span className="font-medium">AI Explanation:</span>
                            </p>
                            <p className="text-xs">{issue.explanation}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Model: gemini-2.5-flash | Confidence: {confidenceValues[issue.id]}%
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {allFixed ? (
                  <span className="text-primary font-medium">✓ All issues resolved</span>
                ) : fixing ? (
                  <span>Processing {fixedIssues.length} of {issues.length} issues...</span>
                ) : (
                  <span>Ready to process {issues.length} issues</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} disabled={fixing}>
                  Cancel
                </Button>
                {!allFixed ? (
                  <Button onClick={handleAutoFix} disabled={fixing}>
                    {fixing ? 'Processing...' : 'Start Auto-Fix'}
                  </Button>
                ) : (
                  <Button onClick={handleApply}>
                    Apply & Review Fixes
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ===================== REVIEW PHASE ===================== */
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{reviewStats.totalIssues}</p>
                <p className="text-xs text-muted-foreground">Issues Fixed</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{reviewStats.totalRows}</p>
                <p className="text-xs text-muted-foreground">Rows Affected</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{reviewStats.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{reviewStats.issueTypes.length}</p>
                <p className="text-xs text-muted-foreground">Issue Types</p>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnlyChanged(!showOnlyChanged)}
                className="text-xs gap-1.5"
              >
                {showOnlyChanged ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {showOnlyChanged ? "Showing changed values only" : "Showing all columns"}
              </Button>
              <div className="flex gap-1.5">
                {reviewStats.issueTypes.map(type => (
                  <Badge key={type} variant="outline" className="text-[10px]">{type}</Badge>
                ))}
              </div>
            </div>

            {/* Fixed Data Table */}
            <ScrollArea className="flex-1" style={{ maxHeight: "45vh" }}>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">FILE</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">ROW</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">COLUMN</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">ISSUE</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">BEFORE</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-xs text-muted-foreground">AFTER</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-xs text-muted-foreground">CONF.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground max-w-[120px] truncate" title={issue.file}>
                          {issue.file}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                          {issue.rowNumber}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant="secondary" className="text-[10px] font-mono">
                            {issue.column}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[140px] truncate" title={issue.issueType}>
                          {issue.issueType}
                        </td>
                        <td className="px-3 py-2.5">
                          <code className="px-1.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs font-mono line-through">
                            {issue.currentValue || "null"}
                          </code>
                        </td>
                        <td className="px-3 py-2.5">
                          <code className="px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs font-mono font-semibold">
                            {issue.suggestedFix}
                          </code>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="text-xs font-mono text-green-600">{confidenceValues[issue.id]}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPhase("fix"); }}
                className="text-xs gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Fix Details
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Export Report
                </Button>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};