import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Download, Upload, Filter, Search, Share2, 
  Plus, Edit, Trash2, Copy, MoreHorizontal,
  SortAsc, SortDesc, Eye, MessageCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TableColumn {
  accessorKey: string;
  header: string;
}

interface TableRow {
  [key: string]: any;
}

interface AirtableStyleTableProps {
  data?: TableRow[];
  columns?: TableColumn[];
  title?: string;
  showToolbar?: boolean;
}

interface ForecastRecord {
  id: string;
  sku: string;
  product: string;
  category: string;
  currentDemand: number;
  forecastedDemand: number;
  confidence: number;
  trend: string;
  region: string;
  lastUpdated: string;
}

const sampleData: ForecastRecord[] = [
  {
    id: "1",
    sku: "SKU-001",
    product: "Premium Widget A",
    category: "Electronics",
    currentDemand: 1250,
    forecastedDemand: 1380,
    confidence: 92,
    trend: "increasing",
    region: "North",
    lastUpdated: "2024-01-15"
  },
  {
    id: "2", 
    sku: "SKU-002",
    product: "Standard Widget B",
    category: "Electronics",
    currentDemand: 890,
    forecastedDemand: 945,
    confidence: 87,
    trend: "stable",
    region: "South",
    lastUpdated: "2024-01-15"
  },
  {
    id: "3",
    sku: "SKU-003",
    product: "Deluxe Widget C",
    category: "Electronics",
    currentDemand: 2100,
    forecastedDemand: 1950,
    confidence: 84,
    trend: "decreasing",
    region: "East",
    lastUpdated: "2024-01-14"
  },
  {
    id: "4",
    sku: "SKU-004",
    product: "Basic Component X",
    category: "Components",
    currentDemand: 3200,
    forecastedDemand: 3450,
    confidence: 91,
    trend: "increasing",
    region: "West",
    lastUpdated: "2024-01-15"
  },
  {
    id: "5",
    sku: "SKU-005",
    product: "Pro Component Y",
    category: "Components",
    currentDemand: 1650,
    forecastedDemand: 1720,
    confidence: 89,
    trend: "stable",
    region: "North",
    lastUpdated: "2024-01-14"
  }
];

export const AirtableStyleTable: React.FC<AirtableStyleTableProps> = ({ 
  data: propData, 
  columns: propColumns, 
  title,
  showToolbar = true 
}) => {
  const [data, setData] = useState<TableRow[]>(propData || sampleData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Update data when props change
  React.useEffect(() => {
    if (propData) {
      setData(propData);
    }
  }, [propData]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTrendBadge = (trend: string) => {
    const styles = {
      increasing: "bg-emerald-100 text-emerald-700 border-emerald-200",
      decreasing: "bg-red-100 text-red-700 border-red-200", 
      stable: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
      <Badge variant="outline" className={styles[trend as keyof typeof styles]}>
        {trend}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-emerald-600 font-semibold";
    if (confidence >= 80) return "text-amber-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const displayColumns = propColumns || [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'product', header: 'Product' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'currentDemand', header: 'Current Demand' },
    { accessorKey: 'forecastedDemand', header: 'Forecasted Demand' },
    { accessorKey: 'confidence', header: 'Confidence' },
    { accessorKey: 'trend', header: 'Trend' },
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'lastUpdated', header: 'Last Updated' }
  ];

  const renderCellContent = (item: TableRow, column: TableColumn) => {
    const value = item[column.accessorKey];
    
    // Special rendering for certain column types
    if (column.accessorKey === 'trend' && typeof value === 'string') {
      return getTrendBadge(value);
    }
    if (column.accessorKey === 'confidence' && typeof value === 'number') {
      return <span className={getConfidenceColor(value)}>{value}%</span>;
    }
    if (column.accessorKey === 'category') {
      return <Badge variant="secondary">{value}</Badge>;
    }
    if (column.accessorKey.includes('Demand') && typeof value === 'number') {
      return <span className="font-medium">{value.toLocaleString()}</span>;
    }
    if (column.accessorKey === 'sku') {
      return <span className="font-mono text-sm">{value}</span>;
    }
    if (column.accessorKey === 'lastUpdated' || column.accessorKey === 'date') {
      return <span className="text-sm text-muted-foreground">{value}</span>;
    }
    
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Components">Components</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments ({selectedRows.length})
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="shadow-elevated border-border/30 backdrop-blur-sm bg-card/95">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-muted/20 to-muted/10 border-b border-border/40">
                <tr>
                  <th className="w-12 p-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-border"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(sortedData.map(item => item.id || String(Math.random())));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </th>
                  {displayColumns.map((column) => (
                    <th 
                      key={column.accessorKey}
                      className="text-left p-3 font-semibold text-sm cursor-pointer hover:bg-muted/40 transition-all duration-200 text-foreground border-r border-border/20 last:border-r-0"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {sortField === column.accessorKey && (
                          sortDirection === 'asc' ? 
                          <SortAsc className="w-3 h-3" /> : 
                          <SortDesc className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-12 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-border/20 hover:bg-gradient-to-r hover:from-muted/10 hover:to-muted/5 transition-all duration-200 group">
                    <td className="p-3 border-r border-border/10 last:border-r-0">
                      <input 
                        type="checkbox"
                        className="rounded border-border"
                        checked={selectedRows.includes(item.id || String(index))}
                        onChange={(e) => {
                          const itemId = item.id || String(index);
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, itemId]);
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== itemId));
                          }
                        }}
                      />
                    </td>
                    {displayColumns.map((column) => (
                      <td key={column.accessorKey} className="p-3 text-foreground border-r border-border/10 last:border-r-0 group-hover:border-border/20 transition-colors">
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-card p-3 rounded-lg border shadow-sm">
        <div>
          {selectedRows.length > 0 && (
            <span>{selectedRows.length} of {sortedData.length} selected</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>Showing {sortedData.length} records</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};