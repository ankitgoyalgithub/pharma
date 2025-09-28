import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info, Database, Key, Settings, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectorConfig {
  [key: string]: any;
}

interface ConnectorConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  connector: {
    name: string;
    icon: string;
    connected: boolean;
    description: string;
    category: string;
    capabilities: string[];
    configFields: ConfigField[];
  };
  onSave: (config: ConnectorConfig) => void;
}

interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'boolean' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export const ConnectorConfigDialog: React.FC<ConnectorConfigDialogProps> = ({
  isOpen,
  onClose,
  connector,
  onSave
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConnectorConfig>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [activeTab, setActiveTab] = useState("configuration");

  const handleConfigChange = (fieldName: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API test
    setTimeout(() => {
      const hasRequiredFields = connector.configFields
        .filter(field => field.required)
        .every(field => config[field.name]);
      
      setTestResult(hasRequiredFields ? 'success' : 'error');
      setTesting(false);
      
      toast({
        title: hasRequiredFields ? "Connection Successful" : "Connection Failed",
        description: hasRequiredFields 
          ? "Successfully connected to the service" 
          : "Please fill in all required fields",
        variant: hasRequiredFields ? "default" : "destructive"
      });
    }, 2000);
  };

  const handleSave = () => {
    const requiredFields = connector.configFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !config[field.name]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    onSave(config);
    toast({
      title: "Configuration Saved",
      description: `${connector.name} connector has been configured successfully`,
    });
    onClose();
  };

  const renderConfigField = (field: ConfigField) => {
    const value = config[field.name] ?? field.defaultValue ?? '';

    switch (field.type) {
      case 'text':
      case 'password':
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleConfigChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
            />
            {field.description && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {field.description}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleConfigChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {field.description}
              </p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleConfigChange(field.name, checked)}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleConfigChange(field.name, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {field.description}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden">
              <img src={connector.icon} alt={connector.name} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <DialogTitle className="text-xl">{connector.name} Configuration</DialogTitle>
              <DialogDescription>{connector.description}</DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{connector.category}</Badge>
            {connector.capabilities.map((capability) => (
              <Badge key={capability} variant="outline" className="text-xs">
                {capability}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="authentication" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test & Deploy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Connection Settings
                </CardTitle>
                <CardDescription>
                  Configure the basic connection parameters for {connector.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connector.configFields
                  .filter(field => field.type !== 'password')
                  .map(renderConfigField)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Authentication Credentials
                </CardTitle>
                <CardDescription>
                  Provide authentication details to securely connect to {connector.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connector.configFields
                  .filter(field => field.type === 'password')
                  .map(renderConfigField)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Connection Test
                </CardTitle>
                <CardDescription>
                  Test your configuration before saving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-full"
                  variant="outline"
                >
                  {testing ? "Testing Connection..." : "Test Connection"}
                </Button>
                
                {testResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    testResult === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {testResult === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {testResult === 'success' 
                        ? "Connection test successful! You can now save the configuration."
                        : "Connection test failed. Please check your credentials and settings."
                      }
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
              Test Connection
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};