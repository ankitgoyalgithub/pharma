import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Database, FileText, TrendingUp, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { foundryDataMapper } from "@/data/foundry/foundryDataMapper";

interface MapFromFoundryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    selectedObjects: string[];
    selectedDataType: 'master' | 'timeseries' | 'featureStore';
    fromDate?: Date;
    toDate?: Date;
  }) => void;
}

export const MapFromFoundryDialog: React.FC<MapFromFoundryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedDataType, setSelectedDataType] = useState<'master' | 'timeseries' | 'featureStore' | ''>('');
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // Create organized foundry objects structure
  const foundryObjects = {
    master: [
      { key: 'Product_Master', title: 'Product Master', description: 'Catalog of all products with attributes', recordCount: 5 },
      { key: 'Location_Master', title: 'Location Master', description: 'List of all locations and warehouses', recordCount: 5 },
      { key: 'Customer_Master', title: 'Customer Master', description: 'Customer information and demographics', recordCount: 5 },
      { key: 'Supplier_Master', title: 'Supplier Master', description: 'Vendor and supplier details', recordCount: 5 },
      { key: 'Employee_Master', title: 'Employee Master', description: 'Employee directory and organizational data', recordCount: 5 },
      { key: 'Channel_Master', title: 'Channel Master', description: 'Sales channels and distribution networks', recordCount: 3 },
    ],
    timeseries: [
      { key: 'Sales_Historical', title: 'Sales Historical', description: 'Daily sales by product and region', recordCount: 50 },
      { key: 'Inventory_Data', title: 'Inventory Data', description: 'Historical inventory data by location', recordCount: 50 },
      { key: 'Price_History', title: 'Price History', description: 'Historical pricing data for products', recordCount: 3 },
      { key: 'Promotion_Data', title: 'Promotion Data', description: 'Marketing campaigns and promotional activities', recordCount: 2 },
    ],
    featureStore: [
      { key: 'Holiday_Calendar', title: 'Holiday Calendar', description: 'Public holidays and seasonal events data', recordCount: 10 },
      { key: 'Crude_Oil_Prices', title: 'Crude Oil Prices', description: 'Global crude oil pricing and trends', recordCount: 50 },
      { key: 'Weather_Data', title: 'Weather Data', description: 'Meteorological data and climate patterns', recordCount: 50 },
      { key: 'NSE_Index', title: 'NSE Index', description: 'National Stock Exchange market indicators', recordCount: 2 },
      { key: 'NASDAQ_Index', title: 'NASDAQ Index', description: 'NASDAQ composite and sector indices', recordCount: 2 },
    ]
  };

  const handleSubmit = () => {
    if (selectedObjects.length === 0 || !selectedDataType) return;
    
    onSubmit({
      selectedObjects,
      selectedDataType: selectedDataType as 'master' | 'timeseries' | 'featureStore',
      fromDate,
      toDate,
    });

    // Reset form
    setSelectedDataType('');
    setSelectedObjects([]);
    setFromDate(undefined);
    setToDate(undefined);
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setSelectedDataType('');
    setSelectedObjects([]);
    setFromDate(undefined);
    setToDate(undefined);
    onClose();
  };

  const toggleObjectSelection = (objectKey: string) => {
    setSelectedObjects(prev => 
      prev.includes(objectKey) 
        ? prev.filter(key => key !== objectKey)
        : [...prev, objectKey]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            Map from Foundry
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Select data objects from your Foundry data catalog to import into the planning workflow
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Data Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Data Type</Label>
            <Select value={selectedDataType} onValueChange={(value: 'master' | 'timeseries' | 'featureStore' | '') => setSelectedDataType(value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master" className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Master Data</div>
                      <div className="text-xs text-muted-foreground">Static reference data and entities</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="timeseries" className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Time Series Data</div>
                      <div className="text-xs text-muted-foreground">Historical and temporal datasets</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="featureStore" className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">Feature Store</div>
                      <div className="text-xs text-muted-foreground">External and enrichment data sources</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Object Selection */}
          {selectedDataType && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Available Objects
                {selectedObjects.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({selectedObjects.length} selected)
                  </span>
                )}
              </Label>
              <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-2">
                {selectedDataType === 'master' ? (
                  foundryObjects.master.map((entity) => (
                    <div
                      key={entity.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedObjects.includes(entity.key)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => toggleObjectSelection(entity.key)}
                    >
                      <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entity.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{entity.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {entity.recordCount.toLocaleString()} records
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Foundry
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedObjects.includes(entity.key)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {selectedObjects.includes(entity.key) && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : selectedDataType === 'timeseries' ? (
                  foundryObjects.timeseries.map((entity) => (
                    <div
                      key={entity.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedObjects.includes(entity.key)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => toggleObjectSelection(entity.key)}
                    >
                      <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entity.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{entity.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {entity.recordCount.toLocaleString()} records
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Foundry
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedObjects.includes(entity.key)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {selectedObjects.includes(entity.key) && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : selectedDataType === 'featureStore' ? (
                  foundryObjects.featureStore.map((entity) => (
                    <div
                      key={entity.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedObjects.includes(entity.key)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => toggleObjectSelection(entity.key)}
                    >
                      <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entity.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{entity.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {entity.recordCount.toLocaleString()} records
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Foundry
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedObjects.includes(entity.key)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {selectedObjects.includes(entity.key) && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          )}
          
          {/* Date Range Selection for Time Series */}
          {selectedDataType === 'timeseries' && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          
          {/* Selected Objects Preview */}
          {selectedObjects.length > 0 && (
            <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm">
                Selected Objects ({selectedObjects.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedObjects.map((objKey) => {
                  const obj = [...foundryObjects.master, ...foundryObjects.timeseries, ...foundryObjects.featureStore]
                    .find(o => o.key === objKey);
                  return (
                    <div key={objKey} className="flex items-center gap-2 text-xs p-2 rounded bg-background">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        selectedDataType === 'master' 
                          ? 'bg-blue-100 dark:bg-blue-900/20' 
                          : selectedDataType === 'timeseries'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-purple-100 dark:bg-purple-900/20'
                      }`}>
                        {selectedDataType === 'master' ? (
                          <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        ) : selectedDataType === 'timeseries' ? (
                          <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <Database className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <span className="flex-1">{obj?.title || objKey}</span>
                      <Badge variant="outline" className="text-xs">
                        {obj?.recordCount} records
                      </Badge>
                    </div>
                  );
                })}
              </div>
              {selectedDataType === 'timeseries' && fromDate && toDate && (
                <p className="text-xs text-muted-foreground">
                  Date Range: {format(fromDate, "MMM d, yyyy")} to {format(toDate, "MMM d, yyyy")}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <Button variant="outline" className="flex-1 h-12" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 h-12" 
            onClick={handleSubmit}
            disabled={selectedObjects.length === 0 || (selectedDataType === 'timeseries' && (!fromDate || !toDate))}
          >
            <Database className="w-4 h-4 mr-2" />
            Import from Foundry ({selectedObjects.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};