import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Play, 
  Edit, 
  Trash2, 
  Copy,
  Calendar,
  Users,
  TrendingUp,
  Radio
} from 'lucide-react';
import { toast } from "sonner";

const Workflows = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });

  const workflows = [
    {
      id: 1,
      name: 'Supply Chain Optimization',
      description: 'End-to-end supply chain planning workflow with demand forecasting and inventory optimization',
      status: 'active',
      lastRun: '2024-07-18 14:30',
      visibility: 'public',
      blocks: 8,
      connections: 12
    },
    {
      id: 2,
      name: 'Financial Planning Pipeline',
      description: 'Integrated financial planning including Capex, Opex, and budget forecasting',
      status: 'draft',
      lastRun: null,
      visibility: 'private',
      blocks: 5,
      connections: 7
    },
    {
      id: 3,
      name: 'Production Scheduling',
      description: 'Automated production planning and scheduling with resource optimization',
      status: 'active',
      lastRun: '2024-07-19 09:15',
      visibility: 'public',
      blocks: 12,
      connections: 18
    }
  ];

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }

    // Create workflow and navigate to builder
    const workflowData = {
      id: Date.now(),
      ...newWorkflow,
      status: 'draft',
      blocks: 0,
      connections: 0
    };

    toast.success("Workflow created successfully");
    setIsCreateDialogOpen(false);
    setNewWorkflow({ name: '', description: '', visibility: 'private' });
    
    // Navigate to workflow builder with the new workflow data
    navigate('/workflow-builder', { state: { workflow: workflowData } });
  };

  const openWorkflow = (workflow) => {
    navigate('/workflow-builder', { state: { workflow } });
  };

  const runWorkflow = (workflow, e) => {
    e.stopPropagation();
    navigate('/workflow-run', { 
      state: { 
        workflowData: workflow,
        workflowName: workflow.name
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Workflows
              </h1>
              <p className="text-muted-foreground mt-2">Create and manage your planning workflows</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/workflow-monitor')}
              >
                <Radio className="h-4 w-4 mr-2" />
                Workflow Monitor
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name">Workflow Name</Label>
                      <Input
                        id="name"
                        value={newWorkflow.name}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter workflow name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newWorkflow.description}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your workflow"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Visibility</Label>
                      <RadioGroup
                        value={newWorkflow.visibility}
                        onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, visibility: value }))}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Private</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Public</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateWorkflow}>
                        Create Workflow
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => openWorkflow(workflow)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                      {workflow.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={workflow.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {workflow.status}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="text-xs"
                      >
                        {workflow.visibility}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {workflow.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {workflow.blocks} blocks
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {workflow.connections} connections
                    </span>
                  </div>
                </div>
                
                {workflow.lastRun && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" />
                    Last run: {workflow.lastRun}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to workflow builder for editing
                      navigate('/workflow-builder', { 
                        state: { 
                          workflow: workflow,
                          isEditing: true
                        }
                      });
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {workflow.status === 'active' && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => runWorkflow(workflow, e)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first workflow'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows;