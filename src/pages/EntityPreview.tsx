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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";

import { entityPreviewData } from "@/data/foundry";

type SortDirection = "asc" | "desc" | null;

export default function EntityPreview() {
  const { entityName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

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

  // Map color names to hex values
  const getColorFromName = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#22C55E',
      'yellow': '#EAB308',
      'orange': '#F97316',
      'purple': '#A855F7',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'brown': '#92400E',
      'navy': '#1E3A5A',
      'beige': '#D4C4A8',
      'cream': '#FFFDD0',
      'gold': '#D4AF37',
      'silver': '#C0C0C0',
      'maroon': '#800000',
      'teal': '#008080',
      'coral': '#FF7F50',
      'turquoise': '#40E0D0',
      'khaki': '#C3B091',
      'olive': '#808000',
      'charcoal': '#36454F',
      'burgundy': '#800020',
      'tan': '#D2B48C',
      'mint': '#98FF98',
      'lavender': '#E6E6FA',
      'peach': '#FFCBA4',
      'rose': '#FF007F',
      'wine': '#722F37',
      'slate': '#708090',
      'ivory': '#FFFFF0',
      'sand': '#C2B280',
      'rust': '#B7410E',
      'magenta': '#FF00FF',
      'cyan': '#00FFFF',
      'lime': '#32CD32',
      'indigo': '#4B0082',
      'violet': '#8B00FF',
      'aqua': '#00FFFF',
      'chocolate': '#D2691E',
      'crimson': '#DC143C',
      'mustard': '#FFDB58',
      'salmon': '#FA8072',
      'plum': '#DDA0DD',
      'multi': 'linear-gradient(135deg, #FF0000, #00FF00, #0000FF)',
      'multicolor': 'linear-gradient(135deg, #FF0000, #00FF00, #0000FF)',
    };
    
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#9CA3AF';
  };

  // Handle column sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Handle column filter
  const handleColumnFilter = (columnKey: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (value === "") {
        delete newFilters[columnKey];
      } else {
        newFilters[columnKey] = value;
      }
      return newFilters;
    });
    setCurrentPage(1);
  };

  // Clear all column filters
  const clearAllFilters = () => {
    setColumnFilters({});
    setCurrentPage(1);
  };

  // Filter, sort and paginate data
  const filteredData = useMemo(() => {
    let data = rows;
    
    // Apply global search
    if (searchTerm) {
      data = data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      data = data.filter(row =>
        String(row[columnKey]).toLowerCase().includes(filterValue.toLowerCase())
      );
    });
    
    // Apply sorting
    if (sortColumn && sortDirection) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        // Handle numbers
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        // Handle strings
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }
    
    return data;
  }, [rows, searchTerm, columnFilters, sortColumn, sortDirection]);

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

          {/* Search Bar and Filters */}
          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search within entity data..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
            {Object.keys(columnFilters).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-9"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters ({Object.keys(columnFilters).length})
              </Button>
            )}
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
                        <div className="flex items-center gap-2">
                          {/* Column Header with Sort */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(column.accessorKey)}
                            className="h-8 px-2 hover:bg-muted/50 font-semibold"
                          >
                            {column.header}
                            {sortColumn === column.accessorKey ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              )
                            ) : (
                              <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
                            )}
                          </Button>
                          
                          {/* Column Filter */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 ${
                                  columnFilters[column.accessorKey]
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted/50"
                                }`}
                              >
                                <Filter className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3 bg-background z-50" align="start">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Filter {column.header}
                                </label>
                                <Input
                                  placeholder={`Filter ${column.header}...`}
                                  value={columnFilters[column.accessorKey] || ""}
                                  onChange={(e) =>
                                    handleColumnFilter(column.accessorKey, e.target.value)
                                  }
                                  className="h-8"
                                />
                                {columnFilters[column.accessorKey] && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleColumnFilter(column.accessorKey, "")}
                                    className="h-7 w-full"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Clear
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
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
                        {columns.map((column) => {
                          const cellValue = row[column.accessorKey];
                          const isUrlColumn = column.accessorKey.toLowerCase().includes('url') || 
                                              column.accessorKey.toLowerCase().includes('image') ||
                                              (typeof cellValue === 'string' && cellValue.startsWith('http'));
                          const isColorColumn = column.accessorKey.toLowerCase() === 'color' ||
                                                column.header.toLowerCase() === 'color';
                          
                          return (
                            <TableCell key={column.accessorKey} className="whitespace-nowrap">
                              {column.accessorKey === "status" && cellValue ? (
                                <Badge variant={getStatusBadgeVariant(cellValue)}>
                                  {cellValue}
                                </Badge>
                              ) : isUrlColumn && cellValue ? (
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <a 
                                      href={cellValue} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline cursor-pointer max-w-[200px] truncate block"
                                    >
                                      {cellValue}
                                    </a>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-64 p-2" side="right">
                                    <img 
                                      src={cellValue} 
                                      alt="Preview" 
                                      className="w-full h-auto rounded-md object-contain max-h-48"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                    <p className="text-xs text-muted-foreground mt-2 truncate">{cellValue}</p>
                                  </HoverCardContent>
                                </HoverCard>
                              ) : isColorColumn && cellValue ? (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full border border-border shadow-sm"
                                    style={{ 
                                      backgroundColor: getColorFromName(cellValue)
                                    }}
                                  />
                                  <span>{cellValue}</span>
                                </div>
                              ) : (
                                cellValue
                              )}
                            </TableCell>
                          );
                        })}
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
                      <SelectItem value="15">15</SelectItem>
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