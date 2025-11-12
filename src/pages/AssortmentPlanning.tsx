import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, TrendingUp, 
  Package, Store, BarChart3, Settings, Play, Eye, Download,
  ArrowRight, Sparkles, Brain, Database, Target, ShoppingBag,
  Maximize, DollarSign, X, Zap, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { AirtableStyleTable } from '@/components/AirtableStyleTable';
import { ExternalDriversSection } from '@/components/ExternalDriversSection';
import { CompactMetricCard } from '@/components/CompactMetricCard';
import { ForecastCard } from '@/components/ForecastCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScientificLoader } from '@/components/ScientificLoader';
import { MapFromFoundryDialog } from '@/components/MapFromFoundryDialog';
import { getFoundryObjectData } from '@/data/foundry';

// Import data
import { assortmentRequiredFiles } from '@/data/assortmentPlanning/foundryObjects';
import { getExternalDrivers } from '@/data/assortmentPlanning/externalDrivers';
import { gapData } from '@/data/assortmentPlanning/gapData';
import { 
  productDataPreview, 
  storeDataPreview, 
  salesDataPreview 
} from '@/data/assortmentPlanning/dataPreviewSample';
import { aiResponses } from '@/data/assortmentPlanning/aiResponses';
import { assortmentMetrics, planMetrics } from '@/data/assortmentPlanning/assortmentMetrics';
import { assortmentRecommendations } from '@/data/assortmentPlanning/assortmentRecommendations';

const AssortmentPlanning = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [foundryObjects, setFoundryObjects] = useState<Array<{name: string, type: 'master' | 'transactional', fromDate?: Date, toDate?: Date}>>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFoundryModalOpen, setIsFoundryModalOpen] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);

  // Map external driver display names to Foundry object keys
  const driverToFoundryKey: Record<string, string> = {
    "Holiday Calendar": "Holiday_Calendar",
    "Customer Demographics": "Customer_Master",
    "Weather Data": "Weather_Data",
    "Market Trends": "Market_Trends",
  };

  // Stepper configuration

  // Auto-select drivers when data sources are added
  useEffect(() => {
    const hasData = uploadedFiles.length > 0 || foundryObjects.length > 0;
    if (hasData && selectedDrivers.length === 0) {
      setDriversLoading(true);
      setTimeout(() => {
        const driversToSelect = getExternalDrivers('assortment', true)
          .filter(d => d.autoSelected)
          .map(d => d.name);
        setSelectedDrivers(driversToSelect);
        setDriversLoading(false);
      }, 500);
    }
  }, [uploadedFiles.length, foundryObjects.length]);

  // Collapse sidebar on mount
  useEffect(() => {
    const event = new CustomEvent("collapseSidebar");
    window.dispatchEvent(event);
  }, []);

  const handleFoundrySubmit = (data: {
    selectedObjects: string[];
    selectedDataType: 'master' | 'timeseries' | 'featureStore';
    fromDate?: Date;
    toDate?: Date;
  }) => {
    const newObjects = data.selectedObjects.map(objName => ({
      name: objName,
      type: data.selectedDataType === 'timeseries' ? 'transactional' as const : 'master' as const,
      ...(data.selectedDataType === 'timeseries' && { fromDate: data.fromDate, toDate: data.toDate })
    }));
    
    setFoundryObjects(prev => [...prev, ...newObjects]);
    
    if (data.selectedObjects.length > 0) {
      setSelectedPreview(data.selectedObjects[0]);
      setPreviewLoading(true);
      setTimeout(() => setPreviewLoading(false), 700);
    }
  };

  const toggleDriver = (driver: string) => {
    setSelectedDrivers((prev) => (prev.includes(driver) ? prev.filter((d) => d !== driver) : [...prev, driver]));
  };

  const handleStepTransition = (nextStep: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsLoading(false);
    }, 1500);
  };

  const handleRunStudy = () => {
    setIsLoading(true);
    toast.loading('Optimizing assortment strategy...');
    
    setTimeout(() => {
      setIsLoading(false);
      toast.dismiss();
      toast.success('Assortment optimization complete!');
      setCurrentStep(4);
    }, 3000);
  };

  // Get external drivers
  const externalDrivers = getExternalDrivers('assortment', true);

  // Step 1: Add Data
  const renderStep1 = () => {
    return (
      <div className="relative flex flex-col min-h-[calc(100vh-var(--topbar-height,64px))] max-h-[calc(100vh-var(--topbar-height,64px))] w-full min-w-0 overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-foreground mb-1">Add Data</h2>
          <p className="text-sm text-muted-foreground">Upload all your data files at once. You can also select external factors to include in the model.</p>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-6 p-6">

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Upload Data Files</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload your product, store, and sales data. Supported formats: CSV, Excel.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload multiple files at once. Supported formats: CSV, Excel. {" "}
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-sm text-primary underline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'assortment-data-template.xlsx';
                link.click();
              }}
            >
              Download input template
            </Button>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Multiple Files
            </Button>
            <Dialog open={isFoundryModalOpen} onOpenChange={setIsFoundryModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Map from Foundry
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          <Input
            id="file-upload"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                setUploadedFiles(prev => [...prev, ...files]);
                setSelectedPreview(files[0].name);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 700);
              }
            }}
          />

          {(uploadedFiles.length > 0 || foundryObjects.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Data Sources:</h4>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">Uploaded Files</h5>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border bg-card">
                        <div className="flex items-center gap-2 text-xs flex-1">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span className="text-foreground">{file.name}</span>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {productDataPreview.length} rows
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                            if (selectedPreview === file.name) {
                              const remaining = uploadedFiles.filter((_, i) => i !== index);
                              setSelectedPreview(remaining.length > 0 ? remaining[0].name : null);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {foundryObjects.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">Foundry Objects</h5>
                  <div className="space-y-1">
                    {foundryObjects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border bg-card">
                        <div className="flex items-center gap-2 text-xs">
                          <Database className="h-3 w-3 text-green-600" />
                          <span className="text-foreground">{obj.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {obj.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setFoundryObjects(prev => prev.filter((_, i) => i !== index));
                            if (selectedPreview === obj.name) {
                              const allSources = [...uploadedFiles.map(f => f.name), ...foundryObjects.filter((_, i) => i !== index).map(o => o.name)];
                              setSelectedPreview(allSources.length > 0 ? allSources[0] : null);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {(uploadedFiles.length > 0 || foundryObjects.length > 0 || selectedDrivers.length > 0) && (
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">Preview</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 flex-wrap">
                  {uploadedFiles.map((file) => (
                    <Button
                      key={file.name}
                      size="sm"
                      variant={selectedPreview === file.name ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(file.name);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      {file.name.split('.')[0]}
                    </Button>
                  ))}
                  {foundryObjects.map((obj) => (
                    <Button
                      key={obj.name}
                      size="sm"
                      variant={selectedPreview === obj.name ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(obj.name);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <Database className="h-3 w-3 mr-1" />
                      {obj.name.split('_')[0]}
                    </Button>
                  ))}
                  {selectedDrivers.map((driver) => (
                    <Button
                      key={driver}
                      size="sm"
                      variant={selectedPreview === driver ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPreview(driver);
                        setPreviewLoading(true);
                        setTimeout(() => setPreviewLoading(false), 500);
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {driver}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {previewLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 rounded-full border-2 border-border border-t-transparent animate-spin" aria-label="Loading preview" />
              </div>
            ) : (
              <>
                {selectedPreview ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      {selectedDrivers.includes(selectedPreview) ? (
                        <Zap className="h-3 w-3" />
                      ) : foundryObjects.some(obj => obj.name === selectedPreview) ? (
                        <Database className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {selectedPreview}
                    </p>
                      {selectedDrivers.includes(selectedPreview) ? (
                       <div className="space-y-4">
                         {(() => {
                           const foundryKey = driverToFoundryKey[selectedPreview] || selectedPreview.replace(/ /g, '_');
                           const driverData = getFoundryObjectData(foundryKey) as any[];
                           if (!driverData || driverData.length === 0) {
                             return <p className="text-sm text-muted-foreground">No data available for this driver.</p>;
                           }
                           
                           const columns = Object.keys(driverData[0]);
                          
                          return (
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Sample Data Points</h4>
                                <table className="min-w-full text-xs border border-border rounded">
                                  <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                      {columns.map((col) => (
                                        <th key={col} className="text-left px-3 py-2 capitalize">
                                          {col.replace(/_/g, ' ')}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {driverData.slice(0, 3).map((row, idx) => (
                                      <tr key={idx} className="hover:bg-muted/20">
                                        {columns.map((col) => (
                                          <td key={col} className="px-3 py-2">
                                            {String((row as any)[col])}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-2">
                                <div><strong>Data Points:</strong> {driverData.length} records</div>
                                <div><strong>Source:</strong> Foundry Feature Store</div>
                                <div><strong>Update Frequency:</strong> Real-time</div>
                                <div><strong>Historical Coverage:</strong> 5+ years</div>
                                <div><strong>Reliability:</strong> High (99.5% uptime)</div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : foundryObjects.some(obj => obj.name === selectedPreview) ? (
                        (() => {
                          const data = getFoundryObjectData(selectedPreview as string) as any[];
                          const columns = data.length > 0 ? Object.keys(data[0]) : [];
                          return (
                            <table className="min-w-full text-xs border border-border rounded">
                              <thead className="bg-muted text-muted-foreground">
                                <tr>
                                  {columns.map((col) => (
                                    <th key={col} className="text-left px-3 py-2 capitalize">{col.replace(/_/g, ' ')}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {data.slice(0, 10).map((row, idx) => (
                                  <tr key={idx} className="hover:bg-muted/20">
                                    {columns.map((col) => (
                                      <td key={col} className="px-3 py-2">{String((row as any)[col])}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()
                      ) : (
                        <table className="min-w-full text-xs border border-border rounded">
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              <th className="text-left px-3 py-2">SKU</th>
                              <th className="text-left px-3 py-2">Product</th>
                              <th className="text-left px-3 py-2">Category</th>
                              <th className="text-left px-3 py-2">Brand</th>
                              <th className="text-left px-3 py-2">Price</th>
                              <th className="text-left px-3 py-2">Margin %</th>
                              <th className="text-left px-3 py-2">Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productDataPreview.slice(0, 10).map((row, idx) => (
                              <tr key={idx} className="hover:bg-muted/20 border-t">
                                <td className="px-3 py-2 font-mono">{row.sku}</td>
                                <td className="px-3 py-2 font-medium">{row.product_name}</td>
                                <td className="px-3 py-2">{row.category}</td>
                                <td className="px-3 py-2">{row.brand}</td>
                                <td className="px-3 py-2 text-success font-medium">${row.price}</td>
                                <td className="px-3 py-2">{row.margin_pct}%</td>
                                <td className="px-3 py-2 font-medium">{row.avg_rating}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a file or driver to preview.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">External Drivers</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select external factors that may influence assortment patterns in your planning model.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            External factors that may influence assortment patterns. Select drivers to include in the model.
          </p>
        </CardHeader>
        <CardContent>
          <ExternalDriversSection
            drivers={externalDrivers}
            selectedDrivers={selectedDrivers}
            driversLoading={driversLoading}
            onToggleDriver={toggleDriver}
            showManualControls={false}
          />
        </CardContent>
      </Card>

        <MapFromFoundryDialog
          isOpen={isFoundryModalOpen}
          onClose={() => setIsFoundryModalOpen(false)}
          onSubmit={handleFoundrySubmit}
        />
          </div>
        </div>
      
      {/* Sticky Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t bg-background sticky bottom-0 z-10">
        <div className="flex justify-between">
          <Button size="sm" variant="outline" onClick={() => window.history.back()}>
            ← Back
          </Button>
          <Button size="sm" onClick={() => handleStepTransition(2)}>
            Continue to Data Gaps →
          </Button>
        </div>
      </div>
    </div>
  );
  };

  // Step 2: Data Gaps
  const renderStep2 = () => (
    <div className="relative flex flex-col min-h-[calc(100vh-var(--topbar-height,64px))] max-h-[calc(100vh-var(--topbar-height,64px))] w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b bg-background sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Resolve Data Gaps</h2>
            <p className="text-sm text-muted-foreground">Review completeness and quality before proceeding.</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-6">

          {/* Quick metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Complete Datasets</div>
                <div className="text-2xl font-bold text-success">
                  {gapData.filter(g => g.status === 'complete').length}
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Partial Datasets</div>
                <div className="text-2xl font-bold text-warning">
                  {gapData.filter(g => g.status === 'partial').length}
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Missing Datasets</div>
                <div className="text-2xl font-bold text-destructive">
                  {gapData.filter(g => g.status === 'missing').length}
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Avg. Quality</div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(gapData.reduce((acc, g) => acc + g.quality, 0) / gapData.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coverage table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Coverage Analysis</CardTitle>
              <CardDescription>Assess completeness of input data sources</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-3 font-medium">Dataset</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-left py-2 px-3 font-medium">Coverage</th>
                    <th className="text-left py-2 px-3 font-medium">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {gapData.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/40">
                      <td className="py-2 px-3 font-medium">{item.name}</td>
                      <td className="py-2 px-3">
                        <Badge variant={
                          item.status === 'complete' ? 'default' :
                          item.status === 'partial' ? 'secondary' : 'destructive'
                        }>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{item.coverage}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <Progress value={item.quality} className="flex-1" />
                          <span className="text-sm font-medium w-12 text-right">{item.quality}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex-shrink-0 sticky bottom-0 w-full bg-background border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>
            ← Back
          </Button>
          <Button size="sm" onClick={() => handleStepTransition(3)}>
            Continue to Configuration →
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 3: Preview
  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Optimization Configuration
          </CardTitle>
          <CardDescription>
            Review settings before running assortment optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Data Sources</p>
              <div className="space-y-1">
                <p className="text-sm">✓ 524 SKUs across 8 categories</p>
                <p className="text-sm">✓ 82 stores in 4 clusters</p>
                <p className="text-sm">✓ 24 months sales history</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">External Drivers</p>
              <div className="space-y-1">
                {selectedDrivers.map(driver => (
                  <p key={driver} className="text-sm">✓ {driver}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Objectives */}
          <div className="space-y-3">
            <p className="font-medium">Optimization Objectives</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm">Maximize Revenue</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm">Optimize Margins</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <Maximize className="w-5 h-5 text-primary" />
                <span className="text-sm">Maximize Coverage</span>
              </div>
            </div>
          </div>

          {/* Run Study Button */}
          <div className="pt-4 border-t">
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={handleRunStudy}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                  Optimizing Assortment...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Optimization Study
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(2)}>
          ← Back
        </Button>
      </div>
    </div>
  );

  // Step 4: Results
  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {assortmentMetrics.map((metric, index) => (
          <Card key={index} className="shadow-elevated">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {metric.label}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              {metric.trend && (
                <div className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {metric.trend}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assortment Plan Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Optimized Assortment Plan
          </CardTitle>
          <CardDescription>
            Comprehensive view of recommended assortment changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {planMetrics.map((metric, index) => (
              <CompactMetricCard
                key={index}
                value={metric.value}
                label={metric.label}
                tooltip={metric.trend}
                badge={{
                  text: metric.trend,
                  variant: metric.change === 'positive' ? 'success' : 
                          metric.change === 'neutral' ? 'info' : 'warning'
                }}
                valueColor={metric.change === 'positive' ? 'primary' : 'info'}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assortment Recommendations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                SKU-Level Recommendations
              </CardTitle>
              <CardDescription>
                Detailed action plan for each product in your catalog
              </CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">SKU</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Current Stores</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Recommended</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Action</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Proj. Revenue</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Margin %</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {assortmentRecommendations.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm font-mono">{item.sku}</td>
                    <td className="p-3 text-sm font-medium">{item.product_name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.category}</td>
                    <td className="p-3 text-sm text-center">{item.current_stores}</td>
                    <td className="p-3 text-sm text-center font-medium">{item.recommended_stores}</td>
                    <td className="p-3 text-center">
                      <Badge variant={
                        item.action === 'Expand' || item.action === 'Introduce' ? 'default' :
                        item.action === 'Maintain' ? 'secondary' :
                        item.action === 'Reduce' ? 'outline' : 'destructive'
                      }>
                        {item.action}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={
                        item.priority === 'High' ? 'default' :
                        item.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-right font-medium">
                      ${(item.projected_revenue / 1000).toFixed(1)}K
                    </td>
                    <td className="p-3 text-sm text-center text-success">
                      {item.margin_pct.toFixed(1)}%
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={item.confidence} className="w-12 h-2" />
                        <span className="text-xs text-muted-foreground">{item.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(3)}>
          ← Back
        </Button>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Results
          </Button>
          <Button size="sm" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approve Plan
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="h-screen bg-gradient-subtle overflow-hidden">
        <div className="h-full px-4 py-0 overflow-hidden">
          <div className="h-full w-full overflow-hidden">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
        </div>
      </div>
      {isLoading && (
        <ScientificLoader 
          message={`Processing Step ${currentStep + 1}...`}
          size="lg"
        />
      )}
    </TooltipProvider>
  );
};

export default AssortmentPlanning;
