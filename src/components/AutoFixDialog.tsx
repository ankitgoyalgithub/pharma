import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { DataQualityIssue } from "@/data/demandForecasting/dataQualityIssues";

interface AutoFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: DataQualityIssue[];
  onApplyFixes: () => void;
}

export const AutoFixDialog = ({ open, onOpenChange, issues, onApplyFixes }: AutoFixDialogProps) => {
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);

  const handleAutoFix = async () => {
    setFixing(true);
    setProgress(0);
    setFixedIssues([]);

    // Simulate AI processing each issue
    for (let i = 0; i < issues.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(((i + 1) / issues.length) * 100);
      setFixedIssues(prev => [...prev, issues[i].id]);
    }

    setFixing(false);
  };

  const handleApply = () => {
    onApplyFixes();
    onOpenChange(false);
    setProgress(0);
    setFixedIssues([]);
  };

  const allFixed = fixedIssues.length === issues.length && !fixing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Data Quality Fix
          </DialogTitle>
          <DialogDescription>
            Using advanced ML models to analyze and fix {issues.length} data quality issues
          </DialogDescription>
        </DialogHeader>

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

          <ScrollArea className="flex-1 pr-4">
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
                          Model: gemini-2.5-flash | Confidence: {(85 + Math.random() * 10).toFixed(1)}%
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
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={fixing}>
              Cancel
            </Button>
            {!allFixed ? (
              <Button onClick={handleAutoFix} disabled={fixing}>
                {fixing ? 'Processing...' : 'Start Auto-Fix'}
              </Button>
            ) : (
              <Button onClick={handleApply}>
                Apply All Fixes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
