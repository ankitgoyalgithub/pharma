import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
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
  ArrowLeft, 
  Download, 
  Search, 
  EyeOff, 
  Database,
  Clock,
  Filter,
  MoreVertical,
  RefreshCcw,
  Edit
} from "lucide-react";
import { AirtableStyleTable } from "@/components/AirtableStyleTable";

import { entityPreviewData } from "@/data/foundry";

export default function EntityPreview() {
  const { entityName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
            <Button onClick={() => navigate(-1)} className="w-full">
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(-1)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardContent className="p-0">
            <AirtableStyleTable 
              data={rows}
              columns={columns}
              title=""
              showToolbar={false}
            />
          </CardContent>
        </Card>

        {/* Enhanced Footer Stats */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{rows.length}</strong> of <strong>{stats.totalRecords.toLocaleString()}</strong> records
            {searchTerm && (
              <span className="ml-2">
                • Filtered by: <Badge variant="outline" className="text-xs ml-1">{searchTerm}</Badge>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}