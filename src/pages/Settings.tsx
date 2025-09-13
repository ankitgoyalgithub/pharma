import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Users, 
  Plug, 
  Settings as SettingsIcon, 
  Wrench,
  CheckCircle,
  XCircle
} from "lucide-react";

import salesforceLogo from "@/assets/salesforce-logo.png";
import s3Logo from "@/assets/s3-logo.png";
import slackLogo from "@/assets/slack-logo.png";
import hubspotLogo from "@/assets/hubspot-logo.png";
import zendeskLogo from "@/assets/zendesk-logo.png";
import dynamicsLogo from "@/assets/dynamics-logo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Add SAP logo placeholder
const sapLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN0RDQyIvPgo8dGV4dCB4PSIyMCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TQVA8L3RleHQ+Cjwvc3ZnPgo=";

const integrations = [
  {
    name: "Salesforce",
    icon: salesforceLogo,
    connected: true,
    description: "CRM integration for customer data"
  },
  {
    name: "S3",
    icon: s3Logo,
    connected: true,
    description: "Cloud storage for files and data"
  },
  {
    name: "SAP",
    icon: sapLogo,
    connected: false,
    description: "Enterprise resource planning and ERP"
  },
  {
    name: "Slack",
    icon: slackLogo,
    connected: false,
    description: "Team communication and notifications"
  },
  {
    name: "Hubspot",
    icon: hubspotLogo,
    connected: false,
    description: "Marketing automation and CRM"
  },
  {
    name: "Zendesk",
    icon: zendeskLogo,
    connected: false,
    description: "Customer support and ticketing"
  },
  {
    name: "Microsoft Dynamics",
    icon: dynamicsLogo,
    connected: false,
    description: "Enterprise resource planning"
  }
];

const Settings = () => {
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
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden">
                    <img src={integration.icon} alt={integration.name} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.connected ? "default" : "secondary"}>
                    {integration.connected ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {integration.connected ? "Connected" : "Not Connected"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.connected ? "Configure" : "Connect"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
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