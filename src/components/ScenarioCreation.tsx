import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    priceChange: number;
    promotionIntensity: number;
    seasonality: number;
    marketGrowth: number;
    sku: string;
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
  const [selectedSku, setSelectedSku] = useState('');
  const [factors, setFactors] = useState({
    priceChange: 0,
    promotionIntensity: 0,
    seasonality: 0,
    marketGrowth: 0
  });

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
      const totalImpact = factors.priceChange + factors.promotionIntensity + factors.seasonality + factors.marketGrowth;
      const baseAccuracy = 94.2;
      const newAccuracy = Math.max(75, Math.min(99, baseAccuracy + totalImpact));
      
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        name: scenarioName.trim(),
        value: `${newAccuracy.toFixed(1)}%`,
        subtitle: `${totalImpact > 0 ? '+' : ''}${totalImpact.toFixed(1)}% vs baseline`,
        factors: {
          ...factors,
          sku: targetSku
        }
      };

      console.log('Creating new scenario:', newScenario);
      onCreateScenario(newScenario);
      
      // Reset form
      console.log('Resetting form...');
      setScenarioName('');
      setSelectedSku('');
      setFactors({
        priceChange: 0,
        promotionIntensity: 0,
        seasonality: 0,
        marketGrowth: 0
      });
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
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Forecast Scenario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Scenario Name
              </label>
              <Input
                placeholder="e.g., Holiday Season Impact"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Select SKU
              </label>
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose SKU to analyze" />
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

            <div className="space-y-3">
              <h4 className="text-sm font-medium">External Factors (%)</h4>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Price Change Impact
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.priceChange}
                  onChange={(e) => setFactors(prev => ({ ...prev, priceChange: Number(e.target.value) }))}
                  step="0.1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Promotion Intensity
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.promotionIntensity}
                  onChange={(e) => setFactors(prev => ({ ...prev, promotionIntensity: Number(e.target.value) }))}
                  step="0.1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Seasonality Factor
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.seasonality}
                  onChange={(e) => setFactors(prev => ({ ...prev, seasonality: Number(e.target.value) }))}
                  step="0.1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Market Growth Rate
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.marketGrowth}
                  onChange={(e) => setFactors(prev => ({ ...prev, marketGrowth: Number(e.target.value) }))}
                  step="0.1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1" disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreateScenario} className="flex-1" disabled={isCreating || !scenarioName.trim()}>
                {isCreating ? 'Creating...' : 'Create Scenario'}
              </Button>
            </div>
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