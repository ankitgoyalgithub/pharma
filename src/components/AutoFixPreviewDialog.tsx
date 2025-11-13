import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

interface DefectiveRow {
  rowNumber: number;
  column: string;
  currentValue: string | null;
  correctedValue?: string;
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
  const rows: DefectiveRow[] = [];
  
  for (let i = 0; i < count; i++) {
    const rowNumber = Math.floor(Math.random() * 10000) + 1;
    
    switch (issueType) {
      case "Missing Values":
        rows.push({
          rowNumber,
          column: "product_id",
          currentValue: null,
          correctedValue: isApproved ? `AUTO_${String(rowNumber).padStart(5, '0')}` : undefined,
        });
        break;
      
      case "Duplicates":
        rows.push({
          rowNumber,
          column: "email",
          currentValue: `user${i % 3}@example.com`,
          correctedValue: isApproved ? `user${i % 3}_merged@example.com` : undefined,
        });
        break;
      
      case "Data Format":
        rows.push({
          rowNumber,
          column: "category_code",
          currentValue: `CAT-${Math.floor(Math.random() * 999)}`,
          correctedValue: isApproved ? `CATEGORY_${String(i + 1).padStart(2, '0')}` : undefined,
        });
        break;
      
      case "Outliers":
        const outlierValue = Math.random() > 0.5 ? 999999 : 0.01;
        rows.push({
          rowNumber,
          column: "price",
          currentValue: `$${outlierValue.toFixed(2)}`,
          correctedValue: isApproved ? `$${(Math.random() * 100 + 50).toFixed(2)}` : undefined,
        });
        break;
      
      case "Stale Data":
        rows.push({
          rowNumber,
          column: "last_updated",
          currentValue: "2020-03-15",
          correctedValue: isApproved ? "Archived" : undefined,
        });
        break;
      
      case "Data Integrity":
        rows.push({
          rowNumber,
          column: "quantity",
          currentValue: `-${Math.floor(Math.random() * 50) + 1}`,
          correctedValue: isApproved ? String(Math.floor(Math.random() * 50) + 1) : undefined,
        });
        break;
      
      default:
        rows.push({
          rowNumber,
          column: "field",
          currentValue: "invalid_data",
          correctedValue: isApproved ? "valid_data" : undefined,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const defectiveRows = useMemo(
    () => generateDefectiveRows(issueType, affectedRows, isApproved),
    [issueType, affectedRows, isApproved]
  );

  const totalPages = Math.ceil(defectiveRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return defectiveRows.slice(start, start + itemsPerPage);
  }, [defectiveRows, currentPage]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              Defective Rows Preview
              {isApproved && (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Fixed
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-1 pt-2">
              <p><strong>Issue:</strong> {issue}</p>
              <p><strong>Type:</strong> {issueType}</p>
              <p><strong>Suggested Fix:</strong> {suggestedFix}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-semibold">Row #</th>
                  <th className="text-left px-4 py-3 font-semibold">Column</th>
                  <th className="text-left px-4 py-3 font-semibold">Current Value</th>
                  {isApproved && (
                    <th className="text-left px-4 py-3 font-semibold">Corrected Value</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {row.rowNumber}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.column}</td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm">
                        {row.currentValue || (
                          <span className="italic text-muted-foreground">null</span>
                        )}
                      </div>
                    </td>
                    {isApproved && (
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm text-green-600 dark:text-green-400">
                          {row.correctedValue}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, defectiveRows.length)} - {Math.min(currentPage * itemsPerPage, defectiveRows.length)} of {defectiveRows.length} rows
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
