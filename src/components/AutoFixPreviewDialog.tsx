import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, CheckCircle2, ArrowRight } from "lucide-react";

interface DefectiveRow {
  rowNumber: number;
  defectiveValue: string | null;
  correctedValue?: string;
  context?: Record<string, string | number>;
}

interface AutoFixPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue: string;
  issueType: string;
  suggestedFix: string;
  affectedRows: number;
  isApproved?: boolean;
}

// Mock defective rows data
const generateDefectiveRows = (issueType: string, count: number, isApproved: boolean): DefectiveRow[] => {
  const sampleCount = Math.min(count, 10);
  const rows: DefectiveRow[] = [];
  
  for (let i = 0; i < sampleCount; i++) {
    const rowNumber = Math.floor(Math.random() * 1000) + 1;
    
    switch (issueType) {
      case "Missing Values":
        rows.push({
          rowNumber,
          defectiveValue: null,
          correctedValue: isApproved ? `AUTO_${String(rowNumber).padStart(5, '0')}` : undefined,
          context: {
            sku: `SKU-${rowNumber}`,
            product_name: `Product ${rowNumber}`,
            category: "Electronics",
          },
        });
        break;
      
      case "Duplicates":
        rows.push({
          rowNumber,
          defectiveValue: `user${i % 3}@example.com`,
          correctedValue: isApproved ? `user${i % 3}@example.com (merged)` : undefined,
          context: {
            email: `user${i % 3}@example.com`,
            name: `John Doe ${i}`,
            created_at: "2024-01-15",
          },
        });
        break;
      
      case "Data Format":
        rows.push({
          rowNumber,
          defectiveValue: `CAT-${Math.floor(Math.random() * 999)}`,
          correctedValue: isApproved ? `CATEGORY_${String(i + 1).padStart(2, '0')}` : undefined,
          context: {
            original_code: `CAT-${Math.floor(Math.random() * 999)}`,
            product_id: `P-${rowNumber}`,
            status: "active",
          },
        });
        break;
      
      case "Outliers":
        const outlierValue = Math.random() > 0.5 ? 999999 : 0.01;
        rows.push({
          rowNumber,
          defectiveValue: `$${outlierValue.toFixed(2)}`,
          correctedValue: isApproved ? `$${(Math.random() * 100 + 50).toFixed(2)}` : undefined,
          context: {
            price: outlierValue,
            product_id: `P-${rowNumber}`,
            avg_market_price: "$75.00",
          },
        });
        break;
      
      case "Stale Data":
        rows.push({
          rowNumber,
          defectiveValue: "2020-03-15",
          correctedValue: isApproved ? "Archived" : undefined,
          context: {
            record_id: `REC-${rowNumber}`,
            last_updated: "2020-03-15",
            status: "inactive",
          },
        });
        break;
      
      case "Data Integrity":
        rows.push({
          rowNumber,
          defectiveValue: `-${Math.floor(Math.random() * 50) + 1}`,
          correctedValue: isApproved ? String(Math.floor(Math.random() * 50) + 1) : undefined,
          context: {
            quantity: -Math.floor(Math.random() * 50) + 1,
            product_id: `P-${rowNumber}`,
            warehouse: "WH-01",
          },
        });
        break;
      
      default:
        rows.push({
          rowNumber,
          defectiveValue: "invalid_data",
          correctedValue: isApproved ? "valid_data" : undefined,
          context: {
            field1: "value1",
            field2: "value2",
          },
        });
    }
  }
  
  return rows;
};

export const AutoFixPreviewDialog: React.FC<AutoFixPreviewDialogProps> = ({
  open,
  onOpenChange,
  issue,
  issueType,
  suggestedFix,
  affectedRows,
  isApproved = false,
}) => {
  const defectiveRows = generateDefectiveRows(issueType, affectedRows, isApproved);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Defective Rows Preview
                {isApproved && (
                  <Badge className="bg-green-500 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Fixed
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-1 pt-2">
              <p><strong>Issue:</strong> {issue}</p>
              <p><strong>Type:</strong> {issueType}</p>
              <p><strong>Suggested Fix:</strong> {suggestedFix}</p>
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(10, affectedRows)} of {affectedRows} affected rows
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3 pb-4">
            {defectiveRows.map((row, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    Row #{row.rowNumber}
                  </Badge>
                </div>

                {/* Context Information */}
                {row.context && (
                  <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-muted/30 rounded-md">
                    {Object.entries(row.context).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground font-medium">{key}:</span>{" "}
                        <span className="font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Defective vs Corrected Values */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Defective Value
                    </p>
                    <div className="p-2 bg-destructive/10 border border-destructive/30 rounded text-sm font-mono">
                      {row.defectiveValue || (
                        <span className="italic text-muted-foreground">null</span>
                      )}
                    </div>
                  </div>

                  {isApproved && row.correctedValue && (
                    <>
                      <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-6" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Corrected Value
                        </p>
                        <div className="p-2 bg-green-50 dark:bg-green-950/30 border border-green-500/30 rounded text-sm font-mono">
                          {row.correctedValue}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
