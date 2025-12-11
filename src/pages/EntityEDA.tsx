import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Database,
  BarChart3,
  PieChart,
  Hash,
  Type,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
} from "lucide-react";
import { entityPreviewData } from "@/data/foundry";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
];

interface ColumnStats {
  name: string;
  header: string;
  type: "numeric" | "categorical" | "text" | "url";
  unique: number;
  missing: number;
  missingPct: number;
  // Numeric stats
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  q25?: number;
  q75?: number;
  // Categorical stats
  topValues?: { value: string; count: number; pct: number }[];
}

export default function EntityEDA() {
  const { entityName } = useParams();
  const navigate = useNavigate();

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

  const { title, columns, rows } = entityData;

  // Calculate column statistics
  const columnStats = useMemo((): ColumnStats[] => {
    return columns.map(col => {
      const values = rows.map(row => row[col.accessorKey]);
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== "");
      const missing = values.length - nonNullValues.length;
      const unique = new Set(nonNullValues.map(String)).size;
      
      // Determine column type
      const sampleValues = nonNullValues.slice(0, 10);
      const isNumeric = sampleValues.every(v => !isNaN(Number(v)) && typeof v !== "boolean");
      const isUrl = col.accessorKey.toLowerCase().includes('url') || 
                    sampleValues.some(v => String(v).startsWith('http'));
      
      let type: "numeric" | "categorical" | "text" | "url" = "categorical";
      if (isUrl) type = "url";
      else if (isNumeric && unique > 10) type = "numeric";
      else if (unique > 50) type = "text";
      
      const stats: ColumnStats = {
        name: col.accessorKey,
        header: col.header,
        type,
        unique,
        missing,
        missingPct: (missing / values.length) * 100,
      };
      
      if (type === "numeric") {
        const numericValues = nonNullValues.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
        if (numericValues.length > 0) {
          stats.min = Math.min(...numericValues);
          stats.max = Math.max(...numericValues);
          stats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          stats.median = numericValues[Math.floor(numericValues.length / 2)];
          stats.q25 = numericValues[Math.floor(numericValues.length * 0.25)];
          stats.q75 = numericValues[Math.floor(numericValues.length * 0.75)];
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - stats.mean!, 2), 0) / numericValues.length;
          stats.std = Math.sqrt(variance);
        }
      }
      
      if (type === "categorical" || type === "text") {
        const valueCounts: Record<string, number> = {};
        nonNullValues.forEach(v => {
          const key = String(v);
          valueCounts[key] = (valueCounts[key] || 0) + 1;
        });
        stats.topValues = Object.entries(valueCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([value, count]) => ({
            value,
            count,
            pct: (count / nonNullValues.length) * 100,
          }));
      }
      
      return stats;
    });
  }, [columns, rows]);

  const numericColumns = columnStats.filter(c => c.type === "numeric");
  const categoricalColumns = columnStats.filter(c => c.type === "categorical");
  const totalMissing = columnStats.reduce((sum, c) => sum + c.missing, 0);
  const totalCells = rows.length * columns.length;
  const completeness = ((totalCells - totalMissing) / totalCells) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "numeric": return <Hash className="w-4 h-4 text-blue-500" />;
      case "categorical": return <Layers className="w-4 h-4 text-purple-500" />;
      case "text": return <Type className="w-4 h-4 text-green-500" />;
      case "url": return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/entity-preview/${entityName}`)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    {title} - Exploratory Data Analysis
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Kaggle-style data profiling and statistical analysis
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(`/entity-preview/${entityName}`)}>
              <Database className="w-4 h-4 mr-2" />
              View Data
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{rows.length.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Rows</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">{columns.length}</div>
              <div className="text-sm text-muted-foreground">Columns</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{numericColumns.length}</div>
              <div className="text-sm text-muted-foreground">Numeric</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{categoricalColumns.length}</div>
              <div className="text-sm text-muted-foreground">Categorical</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-teal-600">{completeness.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Completeness</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/50">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-red-600">{totalMissing}</div>
              <div className="text-sm text-muted-foreground">Missing Values</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
            <TabsTrigger value="correlations">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Data Types Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Column Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={[
                            { name: "Numeric", value: numericColumns.length },
                            { name: "Categorical", value: categoricalColumns.length },
                            { name: "Text/URL", value: columns.length - numericColumns.length - categoricalColumns.length },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {CHART_COLORS.slice(0, 3).map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Missing Values Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Missing Values by Column
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {columnStats.map(col => (
                      <div key={col.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{col.header}</span>
                          <span className={col.missingPct > 0 ? "text-orange-500" : "text-green-500"}>
                            {col.missingPct.toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={100 - col.missingPct} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Column Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Unique</TableHead>
                      <TableHead className="text-right">Missing</TableHead>
                      <TableHead className="text-right">Completeness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columnStats.map(col => (
                      <TableRow key={col.name}>
                        <TableCell className="font-medium">{col.header}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(col.type)}
                            <Badge variant="outline" className="capitalize">{col.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{col.unique.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {col.missing > 0 ? (
                            <span className="text-orange-500">{col.missing}</span>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500 inline" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={col.missingPct > 5 ? "text-orange-500" : "text-green-500"}>
                            {(100 - col.missingPct).toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variables Tab */}
          <TabsContent value="variables" className="space-y-4">
            <div className="grid gap-4">
              {columnStats.map(col => (
                <Card key={col.name}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getTypeIcon(col.type)}
                        {col.header}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{col.type}</Badge>
                        <Badge variant={col.missingPct > 0 ? "destructive" : "secondary"}>
                          {col.missingPct > 0 ? `${col.missingPct.toFixed(1)}% missing` : "Complete"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {col.type === "numeric" ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Min</div>
                          <div className="font-semibold">{col.min?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Q25</div>
                          <div className="font-semibold">{col.q25?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Median</div>
                          <div className="font-semibold">{col.median?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Mean</div>
                          <div className="font-semibold">{col.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Q75</div>
                          <div className="font-semibold">{col.q75?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Max</div>
                          <div className="font-semibold">{col.max?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Std Dev</div>
                          <div className="font-semibold">{col.std?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    ) : col.topValues ? (
                      <div className="space-y-2">
                        {col.topValues.slice(0, 5).map((tv, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-32 truncate text-sm">{tv.value}</div>
                            <Progress value={tv.pct} className="flex-1 h-2" />
                            <div className="text-sm text-muted-foreground w-20 text-right">
                              {tv.count} ({tv.pct.toFixed(1)}%)
                            </div>
                          </div>
                        ))}
                        {col.topValues.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            ... and {col.unique - 5} more unique values
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">{col.unique} unique values</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Distributions Tab */}
          <TabsContent value="distributions" className="space-y-6">
            {/* Numeric Distributions */}
            {numericColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Numeric Column Distributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {numericColumns.slice(0, 6).map(col => {
                      // Create histogram data
                      const values = rows.map(r => Number(r[col.name])).filter(n => !isNaN(n));
                      const min = Math.min(...values);
                      const max = Math.max(...values);
                      const binCount = 10;
                      const binSize = (max - min) / binCount || 1;
                      const bins: { range: string; count: number }[] = [];
                      
                      for (let i = 0; i < binCount; i++) {
                        const binMin = min + i * binSize;
                        const binMax = binMin + binSize;
                        const count = values.filter(v => v >= binMin && (i === binCount - 1 ? v <= binMax : v < binMax)).length;
                        bins.push({
                          range: `${binMin.toFixed(0)}`,
                          count,
                        });
                      }
                      
                      return (
                        <div key={col.name}>
                          <h4 className="font-medium mb-2 text-sm">{col.header}</h4>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bins}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categorical Distributions */}
            {categoricalColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categorical Column Distributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {categoricalColumns.slice(0, 6).map(col => (
                      <div key={col.name}>
                        <h4 className="font-medium mb-2 text-sm">{col.header}</h4>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                              data={col.topValues?.slice(0, 8) || []} 
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                              <YAxis 
                                dataKey="value" 
                                type="category" 
                                width={80} 
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                              />
                              <Tooltip />
                              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="correlations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Data Quality Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Completeness Score */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Data Completeness</span>
                    <span className={completeness >= 95 ? "text-green-500" : completeness >= 80 ? "text-yellow-500" : "text-red-500"}>
                      {completeness.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={completeness} className="h-3" />
                </div>

                {/* Key Insights */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {columnStats.filter(c => c.missingPct === 0).length > 0 && (
                        <li>• {columnStats.filter(c => c.missingPct === 0).length} columns have 100% completeness</li>
                      )}
                      {numericColumns.length > 0 && (
                        <li>• {numericColumns.length} numeric columns available for analysis</li>
                      )}
                      <li>• Dataset has {rows.length} records across {columns.length} features</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {columnStats.filter(c => c.missingPct > 0).length > 0 && (
                        <li>• {columnStats.filter(c => c.missingPct > 0).length} columns have missing values</li>
                      )}
                      {categoricalColumns.filter(c => c.unique && c.unique > 20).length > 0 && (
                        <li>• High cardinality in {categoricalColumns.filter(c => c.unique && c.unique > 20).length} categorical columns</li>
                      )}
                      {totalMissing > 0 && (
                        <li>• Total of {totalMissing} missing values to address</li>
                      )}
                      {totalMissing === 0 && completeness === 100 && (
                        <li>• No major issues identified</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Top Numeric Correlations - simplified */}
                {numericColumns.length >= 2 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-medium mb-3">Numeric Column Statistics Summary</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead className="text-right">Range</TableHead>
                          <TableHead className="text-right">Mean</TableHead>
                          <TableHead className="text-right">Std Dev</TableHead>
                          <TableHead className="text-right">CV%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {numericColumns.map(col => (
                          <TableRow key={col.name}>
                            <TableCell className="font-medium">{col.header}</TableCell>
                            <TableCell className="text-right">
                              {col.min?.toFixed(0)} - {col.max?.toFixed(0)}
                            </TableCell>
                            <TableCell className="text-right">{col.mean?.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{col.std?.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              {col.mean && col.std ? ((col.std / col.mean) * 100).toFixed(1) : "-"}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
