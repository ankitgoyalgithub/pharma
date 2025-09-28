import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Users, 
  Plug, 
  Settings as SettingsIcon, 
  Wrench,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Star,
  Award,
  TrendingUp,
  Grid3x3
} from "lucide-react";

import { connectorsData, getConnectorsByCategory, getPopularConnectors, searchConnectors, type Connector } from "@/data/connectors/connectorsData";
import { ConnectorConfigDialog } from "@/components/connectors/ConnectorConfigDialog";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState({
    timezone: "Asia/Kolkata",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    notifications: true,
    autoSave: true,
    dataRetention: "1 year"
  });
  
  const [viewMode, setViewMode] = useState<"form" | "json">("form");
  
  // Integrations marketplace state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [connectorConfigs, setConnectorConfigs] = useState<Record<string, any>>({});
  
  // Filter connectors based on search and category
  const filteredConnectors = (() => {
    let connectors = searchQuery 
      ? searchConnectors(searchQuery)
      : connectorsData;
    
    if (selectedCategory !== "all") {
      connectors = connectors.filter(c => c.category === selectedCategory);
    }
    
    return connectors;
  })();
  
  const categories = getConnectorsByCategory();
  const popularConnectors = getPopularConnectors(3);
  
  const handleConfigureConnector = (connector: Connector) => {
    setSelectedConnector(connector);
    setIsConfigDialogOpen(true);
  };
  
  const handleSaveConnectorConfig = (config: any) => {
    if (selectedConnector) {
      setConnectorConfigs(prev => ({
        ...prev,
        [selectedConnector.id]: config
      }));
      
      // Update connector status to connected
      const connectorIndex = connectorsData.findIndex(c => c.id === selectedConnector.id);
      if (connectorIndex !== -1) {
        connectorsData[connectorIndex].connected = true;
      }
      
      toast({
        title: "Connector Configured",
        description: `${selectedConnector.name} has been successfully configured and connected.`,
      });
    }
  };
  
  const ConnectorCard = ({ connector, variant = "default" }: { connector: Connector; variant?: "default" | "compact" }) => (
    <Card key={connector.id} className={`transition-all hover:shadow-md border ${
      connector.connected ? 'border-green-200 bg-green-50/30' : 'border-border'
    } ${variant === "compact" ? "p-3" : ""}`}>
      <CardContent className={variant === "compact" ? "p-0" : "p-4"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden">
              <img src={connector.icon} alt={connector.name} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{connector.name}</h3>
                {connector.certified && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {connector.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{connector.category}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {connector.popularity}%
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={connector.connected ? "default" : "secondary"} className="text-xs">
              {connector.connected ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {connector.connected ? "Connected" : "Available"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleConfigureConnector(connector)}
              className="text-xs px-2 py-1 h-6"
            >
              {connector.connected ? "Configure" : "Connect"}
            </Button>
          </div>
        </div>
        
        {variant === "default" && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {connector.capabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs px-1 py-0">
                  {capability}
                </Badge>
              ))}
              {connector.capabilities.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{connector.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="configurations" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Configurations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage users, roles, and permissions for your organization.
              </p>
              <Link to="/users">
                <Button>Open User Management</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage pending invitations and user onboarding.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="space-y-6">
            {/* Header with search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Connector Marketplace</h2>
                <p className="text-sm text-muted-foreground">
                  Discover and configure connectors to integrate with your favorite tools
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search connectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(categories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category} ({categories[category].length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewType(prev => prev === "grid" ? "list" : "grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Popular Connectors */}
            {!searchQuery && selectedCategory === "all" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium">Popular Connectors</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {popularConnectors.map((connector) => (
                    <ConnectorCard key={connector.id} connector={connector} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* All Connectors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {searchQuery 
                    ? `Search Results (${filteredConnectors.length})`
                    : selectedCategory === "all" 
                      ? "All Connectors" 
                      : `${selectedCategory} (${filteredConnectors.length})`
                  }
                </h3>
                <div className="text-sm text-muted-foreground">
                  {filteredConnectors.filter(c => c.connected).length} connected
                </div>
              </div>
              
              <div className={viewType === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-3"
              }>
                {filteredConnectors.map((connector) => (
                  <ConnectorCard key={connector.id} connector={connector} />
                ))}
              </div>
              
              {filteredConnectors.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">No connectors found</div>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Dialog */}
          {selectedConnector && (
            <ConnectorConfigDialog
              isOpen={isConfigDialogOpen}
              onClose={() => {
                setIsConfigDialogOpen(false);
                setSelectedConnector(null);
              }}
              connector={selectedConnector}
              onSave={handleSaveConnectorConfig}
            />
          )}
        </TabsContent>

        <TabsContent value="configurations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  System Configurations
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="view-mode" className="text-sm">View:</Label>
                  <Select value={viewMode} onValueChange={(value: "form" | "json") => setViewMode(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "form" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={configurations.timezone} onValueChange={(value) => setConfigurations({...configurations, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={configurations.currency} onValueChange={(value) => setConfigurations({...configurations, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={configurations.dateFormat} onValueChange={(value) => setConfigurations({...configurations, dateFormat: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={configurations.language} onValueChange={(value) => setConfigurations({...configurations, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">Data Retention</Label>
                      <Select value={configurations.dataRetention} onValueChange={(value) => setConfigurations({...configurations, dataRetention: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30 days">30 days</SelectItem>
                          <SelectItem value="90 days">90 days</SelectItem>
                          <SelectItem value="1 year">1 year</SelectItem>
                          <SelectItem value="2 years">2 years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={configurations.notifications}
                        onCheckedChange={(checked) => setConfigurations({...configurations, notifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoSave">Auto Save</Label>
                        <p className="text-sm text-muted-foreground">Automatically save changes while working</p>
                      </div>
                      <Switch
                        id="autoSave"
                        checked={configurations.autoSave}
                        onCheckedChange={(checked) => setConfigurations({...configurations, autoSave: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button>Save Configurations</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <pre className="bg-secondary p-4 rounded-lg text-sm overflow-auto">
{JSON.stringify(configurations, null, 2)}
                  </pre>
                  <Button variant="outline">Import JSON</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;