import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Sparkles, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AutoFixPreviewDialog } from "@/components/AutoFixPreviewDialog";

interface AutoFixSuggestion {
  id: string;
  issue: string;
  issueType: string;
  detected: string;
  suggestedFix: string;
  confidence: number;
  affectedRows: number;
  status?: "approved" | "rejected";
}

const mockSuggestions: AutoFixSuggestion[] = [
  {
    id: "1",
    issue: "Missing product_id in 342 rows",
    issueType: "Missing Values",
    detected: "2 hours ago",
    suggestedFix: "Auto-map using SKU → Product lookup",
    confidence: 0.94,
    affectedRows: 342,
  },
  {
    id: "2",
    issue: "Duplicate email addresses",
    issueType: "Duplicates",
    detected: "5 hours ago",
    suggestedFix: "Merge records, keep most recent",
    confidence: 0.89,
    affectedRows: 23,
  },
  {
    id: "3",
    issue: "Invalid category codes",
    issueType: "Data Format",
    detected: "1 day ago",
    suggestedFix: "Map to closest valid category",
    confidence: 0.78,
    affectedRows: 12,
  },
  {
    id: "4",
    issue: "Missing timezone data",
    issueType: "Missing Values",
    detected: "1 day ago",
    suggestedFix: "Infer from coordinates + region",
    confidence: 0.92,
    affectedRows: 8,
  },
  {
    id: "5",
    issue: "Inconsistent date format",
    issueType: "Data Format",
    detected: "3 hours ago",
    suggestedFix: "Standardize to ISO 8601 format",
    confidence: 0.96,
    affectedRows: 156,
  },
  {
    id: "6",
    issue: "Null values in required field",
    issueType: "Missing Values",
    detected: "6 hours ago",
    suggestedFix: "Fill with default or previous value",
    confidence: 0.82,
    affectedRows: 89,
  },
  {
    id: "7",
    issue: "Price outliers detected",
    issueType: "Outliers",
    detected: "12 hours ago",
    suggestedFix: "Cap at 95th percentile value",
    confidence: 0.85,
    affectedRows: 45,
  },
  {
    id: "8",
    issue: "Invalid phone number format",
    issueType: "Data Format",
    detected: "8 hours ago",
    suggestedFix: "Apply standard formatting rules",
    confidence: 0.91,
    affectedRows: 67,
  },
  {
    id: "9",
    issue: "Stale records detected",
    issueType: "Stale Data",
    detected: "4 hours ago",
    suggestedFix: "Archive records older than 2 years",
    confidence: 0.87,
    affectedRows: 234,
  },
  {
    id: "10",
    issue: "Duplicate SKU entries",
    issueType: "Duplicates",
    detected: "7 hours ago",
    suggestedFix: "Merge based on last updated timestamp",
    confidence: 0.93,
    affectedRows: 18,
  },
  {
    id: "11",
    issue: "Missing country codes",
    issueType: "Missing Values",
    detected: "9 hours ago",
    suggestedFix: "Derive from postal code or city",
    confidence: 0.88,
    affectedRows: 52,
  },
  {
    id: "12",
    issue: "Negative quantity values",
    issueType: "Data Integrity",
    detected: "5 hours ago",
    suggestedFix: "Convert to absolute values",
    confidence: 0.79,
    affectedRows: 31,
  },
  {
    id: "13",
    issue: "Inconsistent units of measure",
    issueType: "Data Format",
    detected: "10 hours ago",
    suggestedFix: "Standardize to metric system",
    confidence: 0.84,
    affectedRows: 98,
  },
  {
    id: "14",
    issue: "Email format validation failures",
    issueType: "Data Format",
    detected: "11 hours ago",
    suggestedFix: "Apply regex validation and cleanup",
    confidence: 0.90,
    affectedRows: 43,
  },
  {
    id: "15",
    issue: "Missing latitude/longitude data",
    issueType: "Missing Values",
    detected: "13 hours ago",
    suggestedFix: "Geocode using address information",
    confidence: 0.86,
    affectedRows: 76,
  },
];

export const AutoFixSuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<AutoFixSuggestion[]>(mockSuggestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    suggestion: AutoFixSuggestion | null;
  }>({ open: false, suggestion: null });
  const itemsPerPage = 10;
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

  // Get unique issue types for filter
  const issueTypes = useMemo(() => {
    const types = new Set(mockSuggestions.map(s => s.issueType));
    return Array.from(types);
  }, []);

  // Filter and paginate suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => {
      const matchesSearch = s.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.suggestedFix.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = issueTypeFilter === "all" || s.issueType === issueTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [suggestions, searchQuery, issueTypeFilter]);

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const paginatedSuggestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuggestions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuggestions, currentPage]);

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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues or fixes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select value={issueTypeFilter} onValueChange={(value) => {
            setIssueTypeFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {issueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Issue</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Affected Rows</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Suggested Fix</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Detected</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Confidence</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Preview</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuggestions.map((suggestion) => (
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
                  <td className="px-3 py-3 font-medium">{suggestion.issue}</td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.issueType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                    {suggestion.affectedRows}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{suggestion.suggestedFix}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{suggestion.detected}</td>
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewDialog({ open: true, suggestion })}
                      className="h-8 w-8 p-0"
                      title="Preview defective rows"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSuggestions.length)} - {Math.min(currentPage * itemsPerPage, filteredSuggestions.length)} of {filteredSuggestions.length} issues
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          💡 Auto-apply if confidence ≥ 0.85. All fixes are versioned and reversible.
        </div>
      </CardContent>

      {/* Preview Dialog */}
      {previewDialog.suggestion && (
        <AutoFixPreviewDialog
          open={previewDialog.open}
          onOpenChange={(open) => setPreviewDialog({ open, suggestion: null })}
          issue={previewDialog.suggestion.issue}
          issueType={previewDialog.suggestion.issueType}
          suggestedFix={previewDialog.suggestion.suggestedFix}
          affectedRows={previewDialog.suggestion.affectedRows}
          isApproved={previewDialog.suggestion.status === "approved"}
        />
      )}
    </Card>
  );
};
