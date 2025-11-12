import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutoFixSuggestion {
  id: string;
  entity: string;
  issue: string;
  detected: string;
  suggestedFix: string;
  confidence: number;
  status?: "approved" | "rejected";
}

const mockSuggestions: AutoFixSuggestion[] = [
  {
    id: "1",
    entity: "Sales History",
    issue: "Missing product_id in 342 rows",
    detected: "2 hours ago",
    suggestedFix: "Auto-map using SKU → Product lookup",
    confidence: 0.94,
  },
  {
    id: "2",
    entity: "Customer Master",
    issue: "Duplicate email addresses (23 records)",
    detected: "5 hours ago",
    suggestedFix: "Merge records, keep most recent",
    confidence: 0.89,
  },
  {
    id: "3",
    entity: "Product Master",
    issue: "Invalid category codes (12 items)",
    detected: "1 day ago",
    suggestedFix: "Map to closest valid category",
    confidence: 0.78,
  },
  {
    id: "4",
    entity: "Location Master",
    issue: "Missing timezone data (8 locations)",
    detected: "1 day ago",
    suggestedFix: "Infer from coordinates + region",
    confidence: 0.92,
  },
];

export const AutoFixSuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<AutoFixSuggestion[]>(mockSuggestions);
  const { toast } = useToast();

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: action } : s))
    );

    toast({
      title: action === "approved" ? "Fix Approved" : "Fix Rejected",
      description: action === "approved" 
        ? "The fix will be applied in the next sync cycle." 
        : "This suggestion has been rejected.",
    });
  };

  return (
    <Card className="shadow-elevated border border-border/40 hover:shadow-glow transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle>AutoFix Suggestions</CardTitle>
        </div>
        <CardDescription>
          Foundry detected fixable issues — review and apply with confidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Entity</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Issue</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Detected</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Suggested Fix</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Confidence</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion) => (
                <tr
                  key={suggestion.id}
                  className={`border-b border-border/50 transition-colors ${
                    suggestion.status === "approved"
                      ? "bg-success/5"
                      : suggestion.status === "rejected"
                      ? "bg-destructive/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <td className="px-3 py-3 font-medium">{suggestion.entity}</td>
                  <td className="px-3 py-3 text-muted-foreground">{suggestion.issue}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{suggestion.detected}</td>
                  <td className="px-3 py-3">{suggestion.suggestedFix}</td>
                  <td className="px-3 py-3">
                    <Badge
                      variant={suggestion.confidence >= 0.85 ? "default" : "secondary"}
                      className={
                        suggestion.confidence >= 0.85
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }
                    >
                      {(suggestion.confidence * 100).toFixed(0)}%
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    {!suggestion.status ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAction(suggestion.id, "approved")}
                          className="h-8 px-3"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(suggestion.id, "rejected")}
                          className="h-8 px-3"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className={
                          suggestion.status === "approved"
                            ? "border-success text-success"
                            : "border-destructive text-destructive"
                        }
                      >
                        {suggestion.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          💡 Auto-apply if confidence ≥ 0.85. All fixes are versioned and reversible.
        </div>
      </CardContent>
    </Card>
  );
};
