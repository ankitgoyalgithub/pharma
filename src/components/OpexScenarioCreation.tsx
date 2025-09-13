import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2 } from 'lucide-react';

interface OpexScenario {
  id: string;
  name: string;
  value: string;
  subtitle: string;
  factors?: {
    energyCostChange: number;
    inflationRate: number;
    headcountChange: number;
    efficiencyGain: number;
    department: string;
  };
}

interface OpexScenarioCreationProps {
  onCreateScenario: (scenario: OpexScenario) => void;
  scenarios: OpexScenario[];
}

export const OpexScenarioCreation: React.FC<OpexScenarioCreationProps> = ({
  onCreateScenario,
  scenarios
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [factors, setFactors] = useState({
    energyCostChange: 0,
    inflationRate: 0,
    headcountChange: 0,
    efficiencyGain: 0
  });

  const departmentOptions = [
    'IT',
    'HR', 
    'Operations',
    'Finance',
    'Marketing',
    'Admin',
    'Sales'
  ];

  const calculateForecastAccuracy = (inputFactors: {
    energyCostChange: number;
    inflationRate: number;
    headcountChange: number;
    efficiencyGain: number;
  }) => {
    // Base accuracy calculation
    let baseAccuracy = 78.2; // Base OPEX in millions

    // Apply factor impacts (simplified calculation)
    const energyImpact = (inputFactors.energyCostChange / 100) * 8.5; // Energy represents ~11% of OPEX
    const inflationImpact = (inputFactors.inflationRate / 100) * baseAccuracy * 0.6; // 60% of costs affected by inflation
    const headcountImpact = (inputFactors.headcountChange / 100) * 15.2; // Personnel costs ~20% of OPEX
    const efficiencyImpact = -(inputFactors.efficiencyGain / 100) * baseAccuracy * 0.3; // Efficiency gains

    const totalImpact = energyImpact + inflationImpact + headcountImpact + efficiencyImpact;
    const finalValue = baseAccuracy + totalImpact;
    const changePercent = ((finalValue - baseAccuracy) / baseAccuracy) * 100;

    return {
      value: changePercent > 0 ? `+₹${totalImpact.toFixed(1)}M` : `-₹${Math.abs(totalImpact).toFixed(1)}M`,
      subtitle: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% vs baseline`,
    };
  };

  const handleCreateScenario = () => {
    if (!scenarioName.trim() || !selectedDepartment) return;
    
    setIsCreating(true);
    
    setTimeout(() => {
      const forecast = calculateForecastAccuracy(factors);
      
      const newScenario: OpexScenario = {
        id: `opex-scenario-${Date.now()}`,
        name: scenarioName,
        value: forecast.value,
        subtitle: forecast.subtitle,
        factors: {
          ...factors,
          department: selectedDepartment
        }
      };

      onCreateScenario(newScenario);
      
      // Reset form
      setScenarioName('');
      setSelectedDepartment('');
      setFactors({
        energyCostChange: 0,
        inflationRate: 0,
        headcountChange: 0,
        efficiencyGain: 0
      });
      
      setIsCreating(false);
      setIsDialogOpen(false);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Scenario Planning</h3>
        <Badge variant="secondary" className="text-xs">
          {scenarios.length}/3 scenarios
        </Badge>
      </div>

      {/* Create New Scenario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full"
            size="sm"
            disabled={scenarios.length >= 3}
          >
            <Plus className="w-3 h-3 mr-1" />
            Create OPEX Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create OPEX Scenario</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Scenario Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Scenario Name
              </label>
              <Input
                placeholder="e.g., Cost Reduction Initiative"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>

            {/* Department Focus */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Department Focus
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* External Factors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Key Factors</h4>
              
              {/* Energy Cost Change */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">Energy Cost Change</label>
                  <Badge variant="outline" className="text-xs">{factors.energyCostChange > 0 ? '+' : ''}{factors.energyCostChange}%</Badge>
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.energyCostChange}
                  onChange={(e) => setFactors(prev => ({ ...prev, energyCostChange: parseInt(e.target.value) || 0 }))}
                  className="text-xs"
                />
              </div>

              {/* Inflation Rate */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">Inflation Rate</label>
                  <Badge variant="outline" className="text-xs">{factors.inflationRate > 0 ? '+' : ''}{factors.inflationRate}%</Badge>
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.inflationRate}
                  onChange={(e) => setFactors(prev => ({ ...prev, inflationRate: parseInt(e.target.value) || 0 }))}
                  className="text-xs"
                />
              </div>

              {/* Headcount Change */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">Headcount Change</label>
                  <Badge variant="outline" className="text-xs">{factors.headcountChange > 0 ? '+' : ''}{factors.headcountChange}%</Badge>
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.headcountChange}
                  onChange={(e) => setFactors(prev => ({ ...prev, headcountChange: parseInt(e.target.value) || 0 }))}
                  className="text-xs"
                />
              </div>

              {/* Efficiency Gain */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-muted-foreground">Efficiency Gain</label>
                  <Badge variant="outline" className="text-xs">{factors.efficiencyGain > 0 ? '+' : ''}{factors.efficiencyGain}%</Badge>
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={factors.efficiencyGain}
                  onChange={(e) => setFactors(prev => ({ ...prev, efficiencyGain: parseInt(e.target.value) || 0 }))}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Preview */}
            {scenarioName && selectedDepartment && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Preview</div>
                <div className="text-sm font-medium">{scenarioName}</div>
                <div className="text-xs text-muted-foreground">{selectedDepartment} • {calculateForecastAccuracy(factors).subtitle}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleCreateScenario}
                disabled={!scenarioName.trim() || !selectedDepartment || isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing Scenarios */}
      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <div key={scenario.id} className="p-3 bg-muted/30 rounded-lg relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium truncate pr-2">{scenario.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                onClick={() => {
                  // Handle delete scenario
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Impact:</span>
                <span className="font-medium">{scenario.value}</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span>{scenario.factors?.department}</span>
              </div>
              <div className="text-xs text-muted-foreground">{scenario.subtitle}</div>
            </div>
          </div>
        ))}
        
        {scenarios.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scenarios created yet</p>
            <p className="text-xs">Create scenarios to analyze different cost assumptions</p>
          </div>
        )}
      </div>
    </div>
  );
};
