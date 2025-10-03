import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Wand2 } from "lucide-react";

interface InventoryScenarioCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateScenario: (scenario: any) => void;
}

export const InventoryScenarioCreation: React.FC<InventoryScenarioCreationProps> = ({
  isOpen,
  onClose,
  onCreateScenario,
}) => {
  const [scenarioName, setScenarioName] = useState("");
  const [demandChange, setDemandChange] = useState([0]);
  const [leadTimeChange, setLeadTimeChange] = useState([0]);
  const [serviceLevel, setServiceLevel] = useState([95]);
  const [costReduction, setCostReduction] = useState([0]);
  const [product, setProduct] = useState("All Products");

  const handleCreate = () => {
    if (!scenarioName.trim()) {
      alert("Please enter a scenario name");
      return;
    }

    const scenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      value: `${serviceLevel[0]}%`,
      subtitle: `Service Level • ${demandChange[0] > 0 ? '+' : ''}${demandChange[0]}% demand • ${product}`,
      factors: {
        demandChange: demandChange[0],
        leadTimeChange: leadTimeChange[0],
        serviceLevel: serviceLevel[0],
        costReduction: costReduction[0],
        product,
      },
    };

    onCreateScenario(scenario);
    
    // Reset form
    setScenarioName("");
    setDemandChange([0]);
    setLeadTimeChange([0]);
    setServiceLevel([95]);
    setCostReduction([0]);
    setProduct("All Products");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Create Inventory Scenario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="scenario-name">Scenario Name</Label>
            <Input
              id="scenario-name"
              placeholder="e.g., High Demand Season"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product Selection</Label>
            <Input
              id="product"
              placeholder="e.g., Widget A, All Products"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Demand Change (%)</Label>
              <span className="text-sm text-muted-foreground font-medium">
                {demandChange[0] > 0 ? '+' : ''}{demandChange[0]}%
              </span>
            </div>
            <Slider
              value={demandChange}
              onValueChange={setDemandChange}
              min={-50}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust expected demand variation
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Lead Time Change (%)</Label>
              <span className="text-sm text-muted-foreground font-medium">
                {leadTimeChange[0] > 0 ? '+' : ''}{leadTimeChange[0]}%
              </span>
            </div>
            <Slider
              value={leadTimeChange}
              onValueChange={setLeadTimeChange}
              min={-30}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Model supplier delay variations
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Target Service Level (%)</Label>
              <span className="text-sm text-muted-foreground font-medium">
                {serviceLevel[0]}%
              </span>
            </div>
            <Slider
              value={serviceLevel}
              onValueChange={setServiceLevel}
              min={85}
              max={99}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Desired inventory availability
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Cost Reduction Target (%)</Label>
              <span className="text-sm text-muted-foreground font-medium">
                {costReduction[0] > 0 ? '-' : ''}{costReduction[0]}%
              </span>
            </div>
            <Slider
              value={costReduction}
              onValueChange={setCostReduction}
              min={0}
              max={30}
              step={2}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Target holding cost reduction
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreate} className="flex-1">
              <Wand2 className="w-4 h-4 mr-2" />
              Create Scenario
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
