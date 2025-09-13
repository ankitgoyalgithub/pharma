import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileUp, Upload, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppendDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
}

type AppendStep = 1 | 2 | 3;

interface FileValidation {
  status: 'valid' | 'warning' | 'error';
  message: string;
  details?: string[];
}

export const AppendDataDialog: React.FC<AppendDataDialogProps> = ({
  open,
  onOpenChange,
  entityName
}) => {
  const [step, setStep] = useState<AppendStep>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [appendMode, setAppendMode] = useState<'incremental' | 'full'>('incremental');
  const [validation, setValidation] = useState<FileValidation | null>(null);
  const [uploading, setUploading] = useState(false);

  // Mock existing schema for validation
  const existingSchema = [
    { name: 'date', type: 'date', required: true },
    { name: 'sku', type: 'string', required: true },
    { name: 'location', type: 'string', required: true },
    { name: 'units', type: 'number', required: true },
    { name: 'revenue', type: 'number', required: true }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      validateFile(file);
    }
  };

  const validateFile = (file: File) => {
    // Mock validation - in reality this would parse CSV headers
    const mockValidation: FileValidation = {
      status: 'valid',
      message: 'File validation successful',
      details: [
        'Schema matches existing entity',
        'All required columns present',
        `Estimated ${Math.floor(Math.random() * 1000 + 500)} new rows`
      ]
    };

    // Simulate some validation issues for demo
    if (file.name.includes('error')) {
      mockValidation.status = 'error';
      mockValidation.message = 'Schema mismatch detected';
      mockValidation.details = [
        'Missing required column: date',
        'Unknown column: extra_field'
      ];
    } else if (file.name.includes('warn')) {
      mockValidation.status = 'warning';
      mockValidation.message = 'Minor issues detected';
      mockValidation.details = [
        'Column order differs from existing schema',
        'Some null values detected in non-required fields'
      ];
    }

    setValidation(mockValidation);
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setStep(3);
  };

  const resetDialog = () => {
    setStep(1);
    setSelectedFile(null);
    setAppendMode('incremental');
    setValidation(null);
    setUploading(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const getValidationIcon = () => {
    if (!validation) return null;
    switch (validation.status) {
      case 'valid': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Append Data to {entityName}</DialogTitle>
          <DialogDescription>
            Add new data to your existing entity by uploading a CSV file that matches the current schema.
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-sm mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-6 w-6 rounded-full grid place-items-center text-xs font-medium",
                  s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {s}
              </div>
              <span className={cn("text-xs", s === step ? "text-foreground font-medium" : "text-muted-foreground")}>
                {s === 1 ? "Upload" : s === 2 ? "Validate" : "Complete"}
              </span>
              {s !== 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <Separator />

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Append Mode</Label>
                <Select value={appendMode} onValueChange={(v: 'incremental' | 'full') => setAppendMode(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incremental">Incremental (Add new rows only)</SelectItem>
                    <SelectItem value="full">Full Refresh (Replace all data)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {appendMode === 'incremental' 
                    ? 'New rows will be added to existing data' 
                    : 'All existing data will be replaced with the uploaded file'
                  }
                </p>
              </div>

              <div>
                <Label>Select CSV File</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : 'Click to upload CSV file'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Expected Schema */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Expected Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {existingSchema.map((col) => (
                    <div key={col.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{col.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{col.type}</Badge>
                        {col.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Validation */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
              <p className="text-sm text-muted-foreground">Validating file...</p>
            </div>
          </div>
        )}

        {/* Step 2: Validation Results */}
        {step === 2 && validation && (
          <div className="space-y-6">
            <Card className={cn(
              "border-2",
              validation.status === 'valid' && "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50",
              validation.status === 'warning' && "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50",
              validation.status === 'error' && "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
            )}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {getValidationIcon()}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{validation.message}</h3>
                    {validation.details && (
                      <ul className="mt-2 space-y-1">
                        {validation.details.map((detail, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="h-1 w-1 bg-current rounded-full" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">File Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File name:</span>
                  <br />
                  <span className="font-medium">{selectedFile?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">File size:</span>
                  <br />
                  <span className="font-medium">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Append mode:</span>
                  <br />
                  <span className="font-medium capitalize">{appendMode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Entity:</span>
                  <br />
                  <span className="font-medium">{entityName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="py-8 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h3 className="text-lg font-semibold">Data Append Started</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Your file has been uploaded and the append job has been queued. 
              You can monitor the progress in the Jobs dashboard.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => console.log('Navigate to jobs')}>
                View Jobs
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {step !== 3 && (
          <DialogFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {step === 1 && "Select a CSV file that matches the expected schema"}
              {step === 2 && "Review validation results before proceeding"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step === 1 && (
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedFile}
                >
                  Next
                </Button>
              )}
              {step === 2 && validation && (
                <Button 
                  onClick={handleUpload}
                  disabled={validation.status === 'error' || uploading}
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Append
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};