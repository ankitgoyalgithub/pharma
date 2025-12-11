import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info, FileJson, FormInput, ChevronDown } from "lucide-react";

interface ModelConfigurationCardProps {
  forecastHorizon: string;
  setForecastHorizon: (value: string) => void;
  modelGranularity: string;
  setModelGranularity: (value: string) => void;
  seasonality: string;
  setSeasonality: (value: string) => void;
  confidenceLevel: string;
  setConfidenceLevel: (value: string) => void;
  validationSplit: string;
  setValidationSplit: (value: string) => void;
  abcThresholdA: string;
  setAbcThresholdA: (value: string) => void;
  abcThresholdB: string;
  setAbcThresholdB: (value: string) => void;
  xyzThresholdX: string;
  setXyzThresholdX: (value: string) => void;
  xyzThresholdY: string;
  setXyzThresholdY: (value: string) => void;
  fmrThresholdF: string;
  setFmrThresholdF: (value: string) => void;
  fmrThresholdM: string;
  setFmrThresholdM: (value: string) => void;
  classificationBasis: string;
  setClassificationBasis: (value: string) => void;
}

export const ModelConfigurationCard: React.FC<ModelConfigurationCardProps> = ({
  forecastHorizon,
  setForecastHorizon,
  modelGranularity,
  setModelGranularity,
  seasonality,
  setSeasonality,
  confidenceLevel,
  setConfidenceLevel,
  validationSplit,
  setValidationSplit,
  abcThresholdA,
  setAbcThresholdA,
  abcThresholdB,
  setAbcThresholdB,
  xyzThresholdX,
  setXyzThresholdX,
  xyzThresholdY,
  setXyzThresholdY,
  fmrThresholdF,
  setFmrThresholdF,
  fmrThresholdM,
  setFmrThresholdM,
  classificationBasis,
  setClassificationBasis,
}) => {
  const [viewMode, setViewMode] = useState<"form" | "json">("form");
  const [isPrimaryOpen, setIsPrimaryOpen] = useState(true);
  const [isClassificationOpen, setIsClassificationOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAlgorithmOpen, setIsAlgorithmOpen] = useState(false);
  // Configuration object for JSON view
  const configObject = {
    primarySettings: {
      forecastHorizon: `${forecastHorizon} Months`,
      dataGranularity: modelGranularity,
      seasonalityDetection: seasonality,
      confidenceLevel: `${confidenceLevel}%`,
    },
    advancedModelSettings: {
      validationSplit: `${validationSplit}%`,
      trendMethod: "Auto-detect",
      errorMethod: "Auto-select",
      outlierTreatment: "Auto-handle",
      ensembleMethod: "Weighted Average",
      crossValidation: "Time Series CV",
      missingDataStrategy: "Interpolation",
      featureEngineering: "Auto-generate",
      dataNormalization: "Standard Scaling",
    },
    algorithmSelection: {
      primaryAlgorithm: "Auto-select Best",
      optimizationMetric: "MAPE",
      hyperparameterTuning: "Bayesian Optimization",
      trainingIterations: 100,
    },
    classificationThresholds: {
      abcClassification: {
        basis: classificationBasis,
        thresholds: {
          classA: `${abcThresholdA}%`,
          classB: `${abcThresholdB}%`,
          classC: `${100 - parseInt(abcThresholdA) - parseInt(abcThresholdB)}%`,
        },
      },
      xyzClassification: {
        basis: "Coefficient of Variation",
        thresholds: {
          classX: `≤ ${xyzThresholdX}%`,
          classY: `${xyzThresholdX}% - ${xyzThresholdY}%`,
          classZ: `> ${xyzThresholdY}%`,
        },
      },
      fmrClassification: {
        basis: "Demand Frequency",
        thresholds: {
          fast: `≥ ${fmrThresholdF}%`,
          medium: `${fmrThresholdM}% - ${fmrThresholdF}%`,
          rare: `< ${fmrThresholdM}%`,
        },
      },
    },
  };

  const handleJsonChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      // Update state from JSON if valid
      if (parsed.primarySettings) {
        setForecastHorizon(parsed.primarySettings.forecastHorizon.split(" ")[0]);
        setModelGranularity(parsed.primarySettings.dataGranularity);
        setSeasonality(parsed.primarySettings.seasonalityDetection);
        setConfidenceLevel(parsed.primarySettings.confidenceLevel.replace("%", ""));
      }
      if (parsed.advancedModelSettings) {
        setValidationSplit(parsed.advancedModelSettings.validationSplit.replace("%", ""));
      }
      if (parsed.classificationThresholds) {
        const abc = parsed.classificationThresholds.abcClassification;
        if (abc) {
          setClassificationBasis(abc.basis);
          setAbcThresholdA(abc.thresholds.classA.replace("%", ""));
          setAbcThresholdB(abc.thresholds.classB.replace("%", ""));
        }
        const xyz = parsed.classificationThresholds.xyzClassification;
        if (xyz?.thresholds) {
          setXyzThresholdX(xyz.thresholds.classX.replace("≤ ", "").replace("%", ""));
          setXyzThresholdY(xyz.thresholds.classZ.replace("> ", "").replace("%", ""));
        }
        const fmr = parsed.classificationThresholds.fmrClassification;
        if (fmr?.thresholds) {
          setFmrThresholdF(fmr.thresholds.fast.replace("≥ ", "").replace("%", ""));
          setFmrThresholdM(fmr.thresholds.rare.replace("< ", "").replace("%", ""));
        }
      }
    } catch (error) {
      console.error("Invalid JSON", error);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Model Configuration</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure the AI forecast model parameters including time horizon, data granularity, seasonality detection, classification thresholds, and advanced model settings.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "form" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("form")}
              className="h-7 px-3"
            >
              <FormInput className="w-3.5 h-3.5 mr-1.5" />
              Form
            </Button>
            <Button
              variant={viewMode === "json" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("json")}
              className="h-7 px-3"
            >
              <FileJson className="w-3.5 h-3.5 mr-1.5" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewMode === "form" ? (
          <>
            {/* Primary Settings */}
            <Collapsible open={isPrimaryOpen} onOpenChange={setIsPrimaryOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md py-1 px-1 -mx-1">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isPrimaryOpen ? '' : '-rotate-90'}`} />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Primary Settings</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="forecast-horizon">Forecast Horizon</Label>
                    <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="18">18 Months</SelectItem>
                        <SelectItem value="24">24 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="granularity">Data Granularity</Label>
                    <Select value={modelGranularity} onValueChange={setModelGranularity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seasonality">Seasonality Detection</Label>
                    <Select value={seasonality} onValueChange={setSeasonality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Auto-detect">Auto-detect</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confidence-level">Confidence Level</Label>
                    <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="85">85%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                        <SelectItem value="99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-3" />

            {/* Classification Thresholds */}
            <Collapsible open={isClassificationOpen} onOpenChange={setIsClassificationOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md py-1 px-1 -mx-1">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isClassificationOpen ? '' : '-rotate-90'}`} />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Classification Thresholds</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-4">
                  {/* Classification Basis */}
                  <div>
                    <Label htmlFor="classification-basis">Classification Basis</Label>
                    <Select value={classificationBasis} onValueChange={setClassificationBasis}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Value (Revenue)</SelectItem>
                        <SelectItem value="volume">Volume (Units)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ABC Classification */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <span className="text-primary">ABC Classification</span>
                      <span className="text-xs text-muted-foreground">(Based on {classificationBasis === "value" ? "Revenue" : "Units"})</span>
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="abc-threshold-a">Class A (Top %)</Label>
                        <Input
                          id="abc-threshold-a"
                          type="number"
                          value={abcThresholdA}
                          onChange={(e) => setAbcThresholdA(e.target.value)}
                          placeholder="80"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">High value items</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abc-threshold-b">Class B (Next %)</Label>
                        <Input
                          id="abc-threshold-b"
                          type="number"
                          value={abcThresholdB}
                          onChange={(e) => setAbcThresholdB(e.target.value)}
                          placeholder="15"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">Medium value items</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Class C (Remaining)</Label>
                        <Input
                          type="text"
                          value={`${100 - parseInt(abcThresholdA || "0") - parseInt(abcThresholdB || "0")}%`}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Low value items</p>
                      </div>
                    </div>
                  </div>

                  {/* XYZ Classification */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <span className="text-accent">XYZ Classification</span>
                      <span className="text-xs text-muted-foreground">(Based on Coefficient of Variation)</span>
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="xyz-threshold-x">Class X (CV ≤ %)</Label>
                        <Input
                          id="xyz-threshold-x"
                          type="number"
                          value={xyzThresholdX}
                          onChange={(e) => setXyzThresholdX(e.target.value)}
                          placeholder="20"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">Stable demand</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="xyz-threshold-y">Class Y (CV ≤ %)</Label>
                        <Input
                          id="xyz-threshold-y"
                          type="number"
                          value={xyzThresholdY}
                          onChange={(e) => setXyzThresholdY(e.target.value)}
                          placeholder="50"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">Variable demand</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Class Z (CV &gt; {xyzThresholdY}%)</Label>
                        <Input
                          type="text"
                          value="Calculated"
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Erratic demand</p>
                      </div>
                    </div>
                  </div>

                  {/* FMR Classification */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <span className="text-success">FMR Classification</span>
                      <span className="text-xs text-muted-foreground">(Based on Demand Frequency)</span>
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="fmr-threshold-f">Fast (Frequency ≥ %)</Label>
                        <Input
                          id="fmr-threshold-f"
                          type="number"
                          value={fmrThresholdF}
                          onChange={(e) => setFmrThresholdF(e.target.value)}
                          placeholder="80"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">Frequent demand</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fmr-threshold-m">Medium (Frequency ≥ %)</Label>
                        <Input
                          id="fmr-threshold-m"
                          type="number"
                          value={fmrThresholdM}
                          onChange={(e) => setFmrThresholdM(e.target.value)}
                          placeholder="40"
                          min="0"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground">Moderate demand</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Rare (Frequency &lt; {fmrThresholdM}%)</Label>
                        <Input
                          type="text"
                          value="Calculated"
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Sporadic demand</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-3" />

            {/* Advanced Model Settings */}
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md py-1 px-1 -mx-1">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isAdvancedOpen ? '' : '-rotate-90'}`} />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Advanced Model Settings</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="validation-split">Validation Split</Label>
                    <Select value={validationSplit} onValueChange={setValidationSplit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trend-method">Trend Method</Label>
                    <Select value="auto" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="exponential">Exponential</SelectItem>
                        <SelectItem value="damped">Damped</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="error-method">Error Method</Label>
                    <Select value="auto" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-select</SelectItem>
                        <SelectItem value="additive">Additive</SelectItem>
                        <SelectItem value="multiplicative">Multiplicative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outlier-treatment">Outlier Treatment</Label>
                    <Select value="auto" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-handle</SelectItem>
                        <SelectItem value="remove">Remove</SelectItem>
                        <SelectItem value="cap">Cap values</SelectItem>
                        <SelectItem value="interpolate">Interpolate</SelectItem>
                        <SelectItem value="ignore">Ignore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model-ensemble">Ensemble Method</Label>
                    <Select value="weighted" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weighted">Weighted Average</SelectItem>
                        <SelectItem value="best">Best Model Only</SelectItem>
                        <SelectItem value="median">Median Ensemble</SelectItem>
                        <SelectItem value="stacking">Stacking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cross-validation">Cross Validation</Label>
                    <Select value="timeseries" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timeseries">Time Series CV</SelectItem>
                        <SelectItem value="walk-forward">Walk Forward</SelectItem>
                        <SelectItem value="blocked">Blocked CV</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="missing-data">Missing Data Strategy</Label>
                    <Select value="interpolation" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interpolation">Interpolation</SelectItem>
                        <SelectItem value="forward-fill">Forward Fill</SelectItem>
                        <SelectItem value="backward-fill">Backward Fill</SelectItem>
                        <SelectItem value="mean">Mean Imputation</SelectItem>
                        <SelectItem value="median">Median Imputation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feature-engineering">Feature Engineering</Label>
                    <Select value="auto" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-generate</SelectItem>
                        <SelectItem value="lags">Lags Only</SelectItem>
                        <SelectItem value="rolling">Rolling Stats</SelectItem>
                        <SelectItem value="all">All Features</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="normalization">Data Normalization</Label>
                    <Select value="standard" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Scaling</SelectItem>
                        <SelectItem value="minmax">Min-Max Scaling</SelectItem>
                        <SelectItem value="robust">Robust Scaling</SelectItem>
                        <SelectItem value="log">Log Transform</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-3" />

            {/* Algorithm Selection */}
            <Collapsible open={isAlgorithmOpen} onOpenChange={setIsAlgorithmOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md py-1 px-1 -mx-1">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isAlgorithmOpen ? '' : '-rotate-90'}`} />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Algorithm Selection</h4>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="primary-algorithm">Primary Algorithm</Label>
                    <Select value="auto" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-select Best</SelectItem>
                        <SelectItem value="prophet">Prophet</SelectItem>
                        <SelectItem value="arima">ARIMA</SelectItem>
                        <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                        <SelectItem value="xgboost">XGBoost</SelectItem>
                        <SelectItem value="lightgbm">LightGBM</SelectItem>
                        <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optimization-metric">Optimization Metric</Label>
                    <Select value="mape" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mape">MAPE</SelectItem>
                        <SelectItem value="rmse">RMSE</SelectItem>
                        <SelectItem value="mae">MAE</SelectItem>
                        <SelectItem value="smape">sMAPE</SelectItem>
                        <SelectItem value="mase">MASE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hyperparameter-tuning">Hyperparameter Tuning</Label>
                    <Select value="bayesian" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bayesian">Bayesian Optimization</SelectItem>
                        <SelectItem value="grid">Grid Search</SelectItem>
                        <SelectItem value="random">Random Search</SelectItem>
                        <SelectItem value="none">Use Defaults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="training-iterations">Training Iterations</Label>
                    <Select value="100" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 (Fast)</SelectItem>
                        <SelectItem value="100">100 (Balanced)</SelectItem>
                        <SelectItem value="200">200 (Thorough)</SelectItem>
                        <SelectItem value="500">500 (Maximum)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <div className="space-y-2">
            <Label>Configuration JSON</Label>
            <Textarea
              value={JSON.stringify(configObject, null, 2)}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="font-mono text-xs min-h-[500px] bg-muted/30"
              placeholder="Edit configuration as JSON..."
            />
            <p className="text-xs text-muted-foreground">Edit the JSON directly. Valid changes will be reflected in the form.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
