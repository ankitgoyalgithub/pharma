import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  RotateCcw, 
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const WorkflowMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const workflows = [
    {
      id: 1,
      name: 'Demand+Replenish',
      triggeredBy: 'karthik.v',
      status: 'success',
      startedOn: 'Jul 18, 12:05 PM',
      duration: '4m 12s',
      description: 'Combined demand forecasting and replenishment planning workflow'
    },
    {
      id: 2,
      name: 'AI Forecast Flow',
      triggeredBy: 'ankit.g',
      status: 'running',
      startedOn: 'Jul 19, 01:30 AM',
      duration: '2m 44s',
      description: 'Machine learning based demand forecasting with automated parameters'
    },
    {
      id: 3,
      name: 'Opex Planner',
      triggeredBy: 'admin@acme',
      status: 'failed',
      startedOn: 'Jul 17, 09:14 PM',
      duration: '0m 22s',
      description: 'Operational expenditure planning and optimization workflow'
    },
    {
      id: 4,
      name: 'Production Schedule',
      triggeredBy: 'pooja.r',
      status: 'queued',
      startedOn: 'Jul 19, 02:15 AM',
      duration: '-',
      description: 'Production scheduling optimization workflow'
    },
    {
      id: 5,
      name: 'Inventory Optimization',
      triggeredBy: 'karthik.v',
      status: 'success',
      startedOn: 'Jul 18, 08:30 AM',
      duration: '7m 33s',
      description: 'Multi-location inventory optimization and rebalancing'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      success: 'bg-green-500/10 text-green-500 border-green-500/20',
      running: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20',
      queued: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    return (
      <Badge variant="outline" className={variants[status] || ''}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.triggeredBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflow Monitor</h1>
            <p className="text-muted-foreground">Track Workflow Runs</p>
          </div>
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflows Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Workflow Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Triggered By</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Started On</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkflows.map((workflow) => (
                    <tr key={workflow.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-foreground">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">{workflow.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{workflow.triggeredBy}</td>
                      <td className="py-4 px-4">{getStatusBadge(workflow.status)}</td>
                      <td className="py-4 px-4 text-foreground">{workflow.startedOn}</td>
                      <td className="py-4 px-4 text-foreground">{workflow.duration}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {workflow.status === 'failed' && (
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Play className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">Running</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">2</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">1</div>
                  <div className="text-sm text-muted-foreground">Queued</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowMonitor;