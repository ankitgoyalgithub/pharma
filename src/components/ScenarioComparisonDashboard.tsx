import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Line, Bar } from 'react-chartjs-2';
import { buildChartOptions, hslVar } from '@/lib/chartTheme';
import { TrendingUp, TrendingDown, DollarSign, Package, Target, AlertCircle, CheckCircle, Activity, BarChart3, LineChart, Sparkles } from 'lucide-react';

interface ScenarioFactors {
  description?: string;
  timeHorizon?: string;
  granularity?: string;
  priceChange: number;
  promotionIntensity: number;
  seasonality: number;
  marketGrowth: number;
  newProductLaunch?: boolean;
  productLifecycle?: string;
  cannibalization?: number;
  channelMix?: { online: number; retail: number; b2b: number };
  locationExpansion?: number;
  competitorActivity?: number;
  economicIndicator?: number;
  weatherImpact?: number;
  minOrderQuantity?: number;
  maxCapacity?: number;
  safetyStockDays?: number;
  targetServiceLevel?: number;
  inventoryTurnover?: number;
  leadTime?: number;
  sku?: string;
  affectedProducts?: string[];
  affectedLocations?: string[];
  affectedChannels?: string[];
}

interface Scenario {
  id: string;
  name: string;
  value: string;
  subtitle: string;
  factors?: ScenarioFactors;
}

interface ScenarioComparisonDashboardProps {
  scenario: Scenario;
  baseline: {
    accuracy: number;
    revenue: number;
    units: number;
  };
}

export const ScenarioComparisonDashboard: React.FC<ScenarioComparisonDashboardProps> = ({
  scenario,
  baseline
}) => {
  const factors = scenario.factors;
  if (!factors) return null;

  const scenarioAccuracy = parseFloat(scenario.value);
  const accuracyDelta = scenarioAccuracy - baseline.accuracy;
  
  // Calculate scenario metrics with safe defaults
  const totalImpact = 
    (factors.priceChange * -0.3) +
    (factors.promotionIntensity * 0.5) +
    (factors.seasonality * 0.3) +
    (factors.marketGrowth * 0.8) +
    ((factors.competitorActivity || 0) * -0.2) +
    ((factors.economicIndicator || 0) * 0.4);
  
  const revenueMultiplier = 1 + (totalImpact / 100);
  const scenarioRevenue = baseline.revenue * revenueMultiplier;
  const revenueDelta = scenarioRevenue - baseline.revenue;
  const revenuePercentChange = (revenueDelta / baseline.revenue) * 100;

  const unitsMultiplier = 1 + ((totalImpact * 0.8) / 100); // Units have slightly lower elasticity
  const scenarioUnits = baseline.units * unitsMultiplier;
  const unitsDelta = scenarioUnits - baseline.units;
  const unitsPercentChange = (unitsDelta / baseline.units) * 100;

  // Generate weekly forecast data
  const generateWeeklyData = () => {
    const weeks = 13;
    const baselineData = [];
    const scenarioData = [];
    
    for (let i = 0; i < weeks; i++) {
      const weekBase = 1000 + Math.sin(i / 2) * 100 + Math.random() * 50;
      const seasonalFactor = 1 + (factors.seasonality / 100) * Math.sin((i / weeks) * Math.PI * 2);
      const trendFactor = 1 + ((factors.marketGrowth / 100) * (i / weeks));
      
      baselineData.push(Math.round(weekBase));
      scenarioData.push(Math.round(weekBase * seasonalFactor * trendFactor * revenueMultiplier));
    }
    
    return { baselineData, scenarioData };
  };

  const { baselineData, scenarioData } = generateWeeklyData();
  const weekLabels = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);

  // Key drivers impact breakdown with safe defaults
  const driverImpacts = [
    { name: 'Price Change', value: factors.priceChange * -0.3, weight: factors.priceChange },
    { name: 'Promotions', value: factors.promotionIntensity * 0.5, weight: factors.promotionIntensity },
    { name: 'Seasonality', value: factors.seasonality * 0.3, weight: factors.seasonality },
    { name: 'Market Growth', value: factors.marketGrowth * 0.8, weight: factors.marketGrowth },
    { name: 'Competition', value: (factors.competitorActivity || 0) * -0.2, weight: factors.competitorActivity || 0 },
    { name: 'Economic', value: (factors.economicIndicator || 0) * 0.4, weight: factors.economicIndicator || 0 },
  ].filter(d => Math.abs(d.weight) > 0).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="shadow-elevated border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{scenario.name}</CardTitle>
              {factors.description && (
                <CardDescription className="text-sm">{factors.description}</CardDescription>
              )}
            </div>
            <Badge variant={accuracyDelta > 0 ? "default" : "secondary"} className="text-lg px-3 py-1">
              {accuracyDelta > 0 ? '+' : ''}{accuracyDelta.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-background/60 border">
              <div className="text-xs text-muted-foreground mb-1">Forecast Accuracy</div>
              <div className="text-2xl font-bold text-primary">{scenarioAccuracy.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                vs {baseline.accuracy.toFixed(1)}% baseline
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-background/60 border">
              <div className="text-xs text-muted-foreground mb-1">Revenue Impact</div>
              <div className={`text-2xl font-bold ${revenueDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {revenueDelta >= 0 ? '+' : ''}${(revenueDelta / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {revenuePercentChange >= 0 ? '+' : ''}{revenuePercentChange.toFixed(1)}% change
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-background/60 border">
              <div className="text-xs text-muted-foreground mb-1">Volume Impact</div>
              <div className={`text-2xl font-bold ${unitsDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {unitsDelta >= 0 ? '+' : ''}{(unitsDelta / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {unitsPercentChange >= 0 ? '+' : ''}{unitsPercentChange.toFixed(1)}% units
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-background/60 border">
              <div className="text-xs text-muted-foreground mb-1">Planning Horizon</div>
              <div className="text-2xl font-bold text-primary">
                {factors.timeHorizon ? factors.timeHorizon.split('-')[0] : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {factors.granularity || 'weekly'} granularity
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Comparison Chart */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            Forecast Comparison: Baseline vs Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line
              data={{
                labels: weekLabels,
                datasets: [
                  {
                    label: 'Baseline Forecast',
                    data: baselineData,
                    borderColor: 'hsl(220, 13%, 69%)',
                    backgroundColor: 'hsl(220, 13%, 69%, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: 'hsl(220, 13%, 69%)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                  },
                  {
                    label: `${scenario.name} Scenario`,
                    data: scenarioData,
                    borderColor: 'hsl(262, 83%, 58%)',
                    backgroundColor: 'hsl(262, 83%, 58%, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: 'hsl(262, 83%, 58%)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                  }
                ]
              }}
              options={buildChartOptions({
                animation: { duration: 600 },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: { size: 12, weight: '500' }
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: { color: 'hsl(var(--border))' },
                    ticks: {
                      callback: (value) => `${(Number(value) / 1000).toFixed(1)}K`,
                      font: { size: 11 }
                    }
                  },
                  x: {
                    grid: { color: 'hsl(var(--border))' },
                    ticks: { font: { size: 11 } }
                  }
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Driver Impact Analysis */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Key Driver Contributions
            </CardTitle>
            <CardDescription>Individual impact of each demand driver</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <Bar
                data={{
                  labels: driverImpacts.map(d => d.name),
                  datasets: [{
                    label: 'Impact (%)',
                    data: driverImpacts.map(d => d.value),
                    backgroundColor: driverImpacts.map(d => 
                      d.value > 0 ? 'hsl(142, 76%, 36%, 0.7)' : 'hsl(0, 84%, 60%, 0.7)'
                    ),
                    borderColor: driverImpacts.map(d => 
                      d.value > 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'
                    ),
                    borderWidth: 2,
                  }]
                }}
                options={buildChartOptions({
                  animation: { duration: 600 },
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y' as const,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { color: 'hsl(var(--border))' },
                      ticks: {
                        callback: (value) => `${value}%`,
                        font: { size: 11 }
                      }
                    },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } }
                    }
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Scenario Assumptions */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Scenario Assumptions
            </CardTitle>
            <CardDescription>Configured parameters and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              {factors.newProductLaunch && (
                <div className="flex items-center justify-between p-2 rounded bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">New Product Launch</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              )}

              {factors.productLifecycle && (
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">Product Lifecycle</span>
                  <Badge variant="outline" className="text-xs capitalize">{factors.productLifecycle}</Badge>
                </div>
              )}

              {factors.targetServiceLevel && (
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">Service Level Target</span>
                  <Badge variant="outline" className="text-xs">{factors.targetServiceLevel}%</Badge>
                </div>
              )}

              {factors.safetyStockDays && (
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">Safety Stock</span>
                  <Badge variant="outline" className="text-xs">{factors.safetyStockDays} days</Badge>
                </div>
              )}

              {factors.leadTime && (
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">Lead Time</span>
                  <Badge variant="outline" className="text-xs">{factors.leadTime} days</Badge>
                </div>
              )}

              <Separator />

              {factors.channelMix && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Channel Mix</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Online</span>
                      <span className="font-mono">{factors.channelMix.online}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Retail</span>
                      <span className="font-mono">{factors.channelMix.retail}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>B2B</span>
                      <span className="font-mono">{factors.channelMix.b2b}%</span>
                    </div>
                  </div>
                </div>
              )}

              {factors.affectedProducts && factors.affectedProducts.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Affected Products</div>
                    <div className="flex flex-wrap gap-1">
                      {factors.affectedProducts.map(product => (
                        <Badge key={product} variant="secondary" className="text-xs">{product}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {factors.affectedLocations && factors.affectedLocations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Affected Locations</div>
                    <div className="flex flex-wrap gap-1">
                      {factors.affectedLocations.map(location => (
                        <Badge key={location} variant="secondary" className="text-xs">{location}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Accuracy Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline Accuracy</span>
              <span className="font-mono">{baseline.accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scenario Accuracy</span>
              <span className="font-mono text-primary font-semibold">{scenarioAccuracy.toFixed(1)}%</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Improvement</span>
              <span className={`font-mono font-semibold ${accuracyDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {accuracyDelta >= 0 ? '+' : ''}{accuracyDelta.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline Revenue</span>
              <span className="font-mono">${(baseline.revenue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scenario Revenue</span>
              <span className="font-mono text-primary font-semibold">${(scenarioRevenue / 1000000).toFixed(2)}M</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delta</span>
              <span className={`font-mono font-semibold ${revenueDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {revenueDelta >= 0 ? '+' : ''}${(revenueDelta / 1000).toFixed(0)}K
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Volume Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline Units</span>
              <span className="font-mono">{(baseline.units / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scenario Units</span>
              <span className="font-mono text-primary font-semibold">{(scenarioUnits / 1000).toFixed(1)}K</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delta</span>
              <span className={`font-mono font-semibold ${unitsDelta >= 0 ? 'text-success' : 'text-destructive'}`}>
                {unitsDelta >= 0 ? '+' : ''}{(unitsDelta / 1000).toFixed(1)}K
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};