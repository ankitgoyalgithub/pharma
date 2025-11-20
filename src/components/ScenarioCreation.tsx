import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2 } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  value: string;
  subtitle: string;
  factors?: {
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
    channelMix?: {
      online: number;
      retail: number;
      b2b: number;
    };
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
  };
}

interface ScenarioCreationProps {
  onCreateScenario: (scenario: Scenario) => void;
  scenarios: Scenario[];
}

export const ScenarioCreation: React.FC<ScenarioCreationProps> = ({
  onCreateScenario,
  scenarios
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSku, setSelectedSku] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('12');
  const [granularity, setGranularity] = useState('monthly');
  const [priceChange, setPriceChange] = useState([0]);
  const [promotionIntensity, setPromotionIntensity] = useState([0]);
  const [seasonalityImpact, setSeasonalityImpact] = useState([0]);
  const [marketGrowth, setMarketGrowth] = useState([0]);

  const skuOptions = [
    'SKU001 - Electronics',
    'SKU002 - Clothing',
    'SKU003 - Home & Garden',
    'SKU004 - Sports',
    'SKU005 - Books'
  ];

  const handleCreateScenario = async () => {
    console.log('handleCreateScenario called');
    console.log('scenarioName:', scenarioName);
    console.log('selectedSku:', selectedSku);
    console.log('isCreating:', isCreating);
    
    if (isCreating) {
      console.log('Already creating, preventing duplicate');
      return;
    }
    
    if (!scenarioName.trim()) {
      console.log('Missing scenario name, returning early');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Use default SKU if none selected
      const targetSku = selectedSku || 'SKU001 - Electronics';
      
      // Calculate impact based on factors
      const totalImpact = priceChange[0] + promotionIntensity[0]/10 + seasonalityImpact[0] + marketGrowth[0];
      const baseAccuracy = 94.2;
      const newAccuracy = Math.max(75, Math.min(99, baseAccuracy + totalImpact));
      
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        name: scenarioName.trim(),
        value: `${newAccuracy.toFixed(1)}%`,
        subtitle: `${totalImpact > 0 ? '+' : ''}${totalImpact.toFixed(1)}% vs baseline`,
        factors: {
          description,
          timeHorizon,
          granularity,
          priceChange: priceChange[0],
          promotionIntensity: promotionIntensity[0],
          seasonality: seasonalityImpact[0],
          marketGrowth: marketGrowth[0],
          sku: targetSku
        }
      };

      console.log('Creating new scenario:', newScenario);
      onCreateScenario(newScenario);
      
      // Reset form
      console.log('Resetting form...');
      setScenarioName('');
      setDescription('');
      setSelectedSku('');
      setTimeHorizon('12');
      setGranularity('monthly');
      setPriceChange([0]);
      setPromotionIntensity([0]);
      setSeasonalityImpact([0]);
      setMarketGrowth([0]);
      setIsDialogOpen(false);
      console.log('Form reset and dialog closed');
    } catch (error) {
      console.error('Error creating scenario:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create New Demand Scenario</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-8 py-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenario-name">Scenario Name *</Label>
                    <Input
                      id="scenario-name"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="e.g., Holiday Season 2024"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the scenario context, assumptions, and key drivers..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Select value={selectedSku} onValueChange={setSelectedSku}>
                      <SelectTrigger id="sku" className="h-10">
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {skuOptions.map((sku) => (
                          <SelectItem key={sku} value={sku}>
                            {sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="time-horizon">Time Horizon</Label>
                      <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                        <SelectTrigger id="time-horizon" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Weeks</SelectItem>
                          <SelectItem value="12">12 Weeks</SelectItem>
                          <SelectItem value="26">26 Weeks</SelectItem>
                          <SelectItem value="52">52 Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="granularity">Granularity</Label>
                      <Select value={granularity} onValueChange={setGranularity}>
                        <SelectTrigger id="granularity" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - External Drivers */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">External Drivers</h3>
                <div className="space-y-6 bg-muted/30 rounded-lg p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Price Change</Label>
                      <span className="text-sm font-semibold text-primary">{priceChange[0]}%</span>
                    </div>
                    <Slider
                      value={priceChange}
                      onValueChange={setPriceChange}
                      min={-50}
                      max={50}
                      step={5}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Impact of pricing changes on demand</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Promotion Intensity</Label>
                      <span className="text-sm font-semibold text-primary">{promotionIntensity[0]}%</span>
                    </div>
                    <Slider
                      value={promotionIntensity}
                      onValueChange={setPromotionIntensity}
                      min={0}
                      max={100}
                      step={10}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Marketing and promotional activity level</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Seasonality Impact</Label>
                      <span className="text-sm font-semibold text-primary">{seasonalityImpact[0]}%</span>
                    </div>
                    <Slider
                      value={seasonalityImpact}
                      onValueChange={setSeasonalityImpact}
                      min={-30}
                      max={30}
                      step={5}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Seasonal variation adjustment</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Market Growth</Label>
                      <span className="text-sm font-semibold text-primary">{marketGrowth[0]}%</span>
                    </div>
                    <Slider
                      value={marketGrowth}
                      onValueChange={setMarketGrowth}
                      min={-20}
                      max={20}
                      step={2}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Overall market trend impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setIsCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateScenario}
              disabled={isCreating || !scenarioName.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8"
            >
              {isCreating ? 'Creating...' : 'Create Scenario'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="text-xs text-muted-foreground">
        {scenarios.length > 0 
          ? `${scenarios.length} scenarios created. They appear as new forecast cards on the left.`
          : 'Create scenarios to explore different forecast possibilities with external factors.'
        }
      </div>
      
      {scenarios.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Created Scenarios:</h4>
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="text-xs p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{scenario.name}</div>
                <Badge variant="secondary" className="text-xs">
                  {scenario.value}
                </Badge>
              </div>
              <div className="text-muted-foreground mb-2">{scenario.subtitle}</div>
              {scenario.factors && (
                <div className="text-xs space-y-1">
                  <div className="font-medium">SKU: {scenario.factors.sku}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Price: {scenario.factors.priceChange}%</div>
                    <div>Promo: {scenario.factors.promotionIntensity}%</div>
                    <div>Season: {scenario.factors.seasonality}%</div>
                    <div>Growth: {scenario.factors.marketGrowth}%</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};