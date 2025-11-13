import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Download, 
  Search, 
  EyeOff, 
  Database,
  Clock,
  Filter,
  MoreVertical,
  RefreshCcw,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

import { entityPreviewData } from "@/data/foundry";

export default function EntityPreview() {
  const { entityName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const entityData = entityPreviewData[entityName || "product"];
  
  if (!entityData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Entity Not Found</CardTitle>
            <CardDescription>
              The requested entity "{entityName}" could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/foundry')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { title, description, columns, rows, stats } = entityData;

  const exportCSV = () => {
    const headers = columns.map((col) => col.header);
    const csv = [
      headers.join(","),
      ...rows.map(row =>
        columns.map(col => row[col.accessorKey]).join(",")
      )
    ].join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entityName || "data"}-preview.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "default";
      case "inactive": return "secondary"; 
      case "pending": return "outline";
      case "discontinued": return "destructive";
      case "premium": return "default";
      default: return "secondary";
    }
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when search or rows per page changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/foundry')}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary" />
                    {title}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">{description}</p>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {stats.totalRecords.toLocaleString()} records
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last sync: {stats.lastSync}
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Source: {stats.source}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Schema
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Filter className="w-4 h-4 mr-2" />
                    Add Filter
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Entity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search within entity data..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div className="px-6 py-6">
        <Card className="shadow-sm border bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.accessorKey} className="whitespace-nowrap">
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((column) => (
                          <TableCell key={column.accessorKey} className="whitespace-nowrap">
                            {column.accessorKey === "status" && row[column.accessorKey] ? (
                              <Badge variant={getStatusBadgeVariant(row[column.accessorKey])}>
                                {row[column.accessorKey]}
                              </Badge>
                            ) : (
                              row[column.accessorKey]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-muted/20">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredData.length)}</strong> of{" "}
                  <strong>{filteredData.length}</strong> entries
                  {searchTerm && " (filtered)"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Rows per page:</span>
                  <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1 px-3 text-sm">
                  Page <strong className="mx-1">{currentPage}</strong> of <strong className="ml-1">{totalPages}</strong>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}