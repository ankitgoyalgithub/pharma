import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, TrendingUp, 
  Package, Store, BarChart3, Settings, Play, Eye, Download,
  ArrowRight, Sparkles, Brain, Database, Target, ShoppingBag,
  Maximize, DollarSign
} from 'lucide-react';
import { useStepper } from '@/hooks/useStepper';
import { toast } from 'sonner';
import { AirtableStyleTable } from '@/components/AirtableStyleTable';
import { ExternalDriversSection } from '@/components/ExternalDriversSection';
import { CompactMetricCard } from '@/components/CompactMetricCard';
import { ForecastCard } from '@/components/ForecastCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScientificLoader } from '@/components/ScientificLoader';

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
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  // Initialize stepper for topbar display
  const stepperConfig = {
    steps: [
      { id: 1, title: 'Data Setup', status: 'active' as const },
      { id: 2, title: 'Configure', status: 'pending' as const },
      { id: 3, title: 'Preview', status: 'pending' as const },
      { id: 4, title: 'Results', status: 'pending' as const },
    ],
    title: 'Assortment Planning Study',
    initialStep: 1
  };

  useStepper(stepperConfig);

  const handleFileUpload = (fileName: string) => {
    setUploadedFiles(prev => ({ ...prev, [fileName]: true }));
    toast.success(`${fileName} uploaded successfully`);
  };

  const handleStepTransition = (nextStep: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsLoading(false);
    }, 1500);
  };

  const handleDriverToggle = (driverName: string) => {
    setSelectedDrivers(prev =>
      prev.includes(driverName)
        ? prev.filter(d => d !== driverName)
        : [...prev, driverName]
    );
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

  const allFilesUploaded = assortmentRequiredFiles
    .filter(f => f.required)
    .every(f => uploadedFiles[f.name]);

  // Step 1: Data Setup
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Upload Data Files Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Data Files
              </CardTitle>
              <CardDescription>
                Connect your product catalog, store attributes, and sales performance data
              </CardDescription>
            </div>
            <Badge variant={allFilesUploaded ? "default" : "secondary"}>
              {Object.keys(uploadedFiles).length} / {assortmentRequiredFiles.filter(f => f.required).length} Required
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assortmentRequiredFiles.map((file) => (
              <Card 
                key={file.name}
                className={`border-2 transition-all ${
                  uploadedFiles[file.name]
                    ? 'border-primary bg-primary/5'
                    : 'border-dashed border-border hover:border-primary/50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    {uploadedFiles[file.name] ? (
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    ) : (
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{file.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.description}
                      </p>
                    </div>
                    {!uploadedFiles[file.name] ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFileUpload(file.name)}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    ) : (
                      <Badge variant="default">Uploaded</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Demo Button */}
          {!allFilesUploaded && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const allFiles: Record<string, boolean> = {};
                  assortmentRequiredFiles.forEach(file => {
                    allFiles[file.name] = true;
                  });
                  setUploadedFiles(allFiles);
                  toast.success('All files uploaded!');
                }}
                className="gap-2"
              >
                <Sparkles className="w-3 h-3" />
                Quick Demo - Upload All
              </Button>
            </div>
          )}

          {allFilesUploaded && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-success mb-2">All Required Files Uploaded</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {aiResponses.dataMapping}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      {allFilesUploaded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Review your uploaded data across all sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="products">Product Catalog</TabsTrigger>
                <TabsTrigger value="stores">Store Attributes</TabsTrigger>
                <TabsTrigger value="sales">Sales Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <AirtableStyleTable 
                  data={productDataPreview}
                  showToolbar={false}
                />
              </TabsContent>
              
              <TabsContent value="stores">
                <AirtableStyleTable 
                  data={storeDataPreview}
                  showToolbar={false}
                />
              </TabsContent>
              
              <TabsContent value="sales">
                <AirtableStyleTable 
                  data={salesDataPreview}
                  showToolbar={false}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* External Drivers */}
      {allFilesUploaded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              External Drivers
            </CardTitle>
            <CardDescription>
              Select external factors that influence assortment performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExternalDriversSection
              drivers={getExternalDrivers('assortment', true)}
              selectedDrivers={selectedDrivers}
              onToggleDriver={handleDriverToggle}
            />
            
            {/* Quick Demo Button */}
            {selectedDrivers.length === 0 && (
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const autoDrivers = getExternalDrivers('assortment', true)
                      .filter(d => d.autoSelected)
                      .map(d => d.name);
                    setSelectedDrivers(autoDrivers);
                    toast.success('External drivers selected!');
                  }}
                  className="gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-Select Drivers
                </Button>
              </div>
            )}
            
            {selectedDrivers.length > 0 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-primary mb-2">Driver Analysis</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {aiResponses.driverAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => window.history.back()}>
          ← Back
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleStepTransition(2)}
          disabled={!allFilesUploaded || selectedDrivers.length === 0}
        >
          Continue to Configure →
        </Button>
      </div>
    </div>
  );

  // Step 2: Configure
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Data Quality Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Data Quality Assessment
              </CardTitle>
              <CardDescription>
                Review data completeness and quality metrics
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-success/10 text-success">
              Overall Quality: 94/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-primary mb-2">AI Quality Analysis</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {aiResponses.qualityCheck}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              View Details
            </Button>
            <Button className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Apply Auto-Fixes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Coverage Analysis
          </CardTitle>
          <CardDescription>
            Assess completeness of input data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gapData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      item.status === 'complete' ? 'default' :
                      item.status === 'partial' ? 'secondary' : 'destructive'
                    }>
                      {item.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {item.coverage}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={item.quality} className="flex-1" />
                  <span className="text-sm font-medium w-12 text-right">
                    {item.quality}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(1)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => handleStepTransition(3)}>
          Continue to Preview →
        </Button>
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
