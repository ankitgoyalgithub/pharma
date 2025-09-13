import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Background,
  Controls,
  MarkerType,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Link2, Trash2, Search, Plus } from "lucide-react";
import clsx from "clsx";

// Your UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// -----------------------------
// Dummy Entity & Field Data
// -----------------------------
type Entity = {
  id: string;
  label: string;
  fields: string[];
};

const initialEntities: Entity[] = [
  {
    id: "product",
    label: "Product Master",
    fields: ["product_id", "product_name", "price", "category_id", "supplier_id", "created_date"],
  },
  {
    id: "location",
    label: "Location Master", 
    fields: ["location_id", "location_name", "region", "country", "manager_id"],
  },
  {
    id: "sales",
    label: "Sales History",
    fields: ["sale_id", "product_id", "location_id", "user_id", "qty", "amount", "sale_date"],
  },
  {
    id: "inventory",
    label: "Inventory",
    fields: ["inventory_id", "product_id", "location_id", "stock_qty", "reserved_qty", "last_updated"],
  },
  {
    id: "user",
    label: "User Master",
    fields: ["user_id", "username", "email", "role", "department_id"],
  },
  {
    id: "category",
    label: "Category Master",
    fields: ["category_id", "category_name", "parent_category_id", "description"],
  },
  {
    id: "supplier",
    label: "Supplier Master",
    fields: ["supplier_id", "supplier_name", "contact_email", "country"],
  },
];

const initialLinks = [
  {
    id: "sales-product",
    source: "sales",
    target: "product",
    sourceField: "product_id",
    targetField: "product_id",
  },
  {
    id: "sales-location",
    source: "sales",
    target: "location",
    sourceField: "location_id",
    targetField: "location_id",
  },
  {
    id: "inventory-product",
    source: "inventory", 
    target: "product",
    sourceField: "product_id",
    targetField: "product_id",
  },
  {
    id: "product-category",
    source: "product",
    target: "category", 
    sourceField: "category_id",
    targetField: "category_id",
  },
  {
    id: "sales-user",
    source: "sales",
    target: "user",
    sourceField: "user_id", 
    targetField: "user_id",
  },
];

// Enhanced Column Select Modal
function ColumnSelectModal({
  open,
  sourceEntity,
  targetEntity,
  sourceFields,
  targetFields,
  onSelect,
  onCancel,
}: {
  open: boolean;
  sourceEntity: string;
  targetEntity: string;
  sourceFields: string[];
  targetFields: string[];
  onSelect: (sourceField: string, targetField: string) => void;
  onCancel: () => void;
}) {
  const [sourceField, setSourceField] = useState("");
  const [targetField, setTargetField] = useState("");
  const [relationshipName, setRelationshipName] = useState("");

  useEffect(() => {
    if (sourceFields.length > 0 && targetFields.length > 0) {
      setSourceField(sourceFields[0]);
      setTargetField(targetFields[0]);
      setRelationshipName(`${sourceEntity}_${targetEntity}_lookup`);
    }
  }, [sourceFields, targetFields, sourceEntity, targetEntity]);

  if (!open) return null;

  const handleConnect = () => {
    if (sourceField && targetField) {
      onSelect(sourceField, targetField);
      setRelationshipName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md z-50 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Create Field Lookup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">{sourceEntity}</Badge>
              <div className="text-sm text-muted-foreground">Source Entity</div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-border"></div>
              <Link2 className="h-4 w-4 mx-2 text-muted-foreground" />
              <div className="w-8 h-0.5 bg-border"></div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">{targetEntity}</Badge>
              <div className="text-sm text-muted-foreground">Target Entity</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="relationship-name">Relationship Name</Label>
              <Input
                id="relationship-name"
                value={relationshipName}
                onChange={(e) => setRelationshipName(e.target.value)}
                placeholder="Enter relationship name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Field</Label>
                <Select value={sourceField} onValueChange={setSourceField}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select source field" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card">
                    {sourceFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        <div className="flex items-center gap-2">
                          <Database className="h-3 w-3" />
                          {field}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Field</Label>
                <Select value={targetField} onValueChange={setTargetField}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select target field" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-card">
                    {targetFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        <div className="flex items-center gap-2">
                          <Database className="h-3 w-3" />
                          {field}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={!sourceField || !targetField}
              className="bg-primary hover:bg-primary/90"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Create Lookup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Enhanced Custom Nodes for Entities
const CustomNode = ({ data }: any) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="w-56 text-sm bg-card border-2 border-border shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Add handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'hsl(var(--primary))', border: '2px solid hsl(var(--background))' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'hsl(var(--primary))', border: '2px solid hsl(var(--background))' }}
      />
      
      <div
        className="cursor-pointer px-4 py-3 bg-primary/10 flex justify-between items-center font-semibold border-b border-border"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <span className="text-foreground">{data.label}</span>
        </div>
        <span className="text-primary font-bold">{expanded ? "−" : "+"}</span>
      </div>
      {expanded && (
        <div className="px-4 py-3 max-h-48 overflow-y-auto">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Fields ({data.fields.length})</div>
          {data.fields.map((field: string, index: number) => (
            <div 
              className="flex items-center gap-2 text-muted-foreground mb-2 p-1 rounded hover:bg-muted/50 transition-colors" 
              key={index}
            >
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full flex-shrink-0"></div>
              <span className="text-xs font-mono">{field}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

export default function AddLookupPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialEntities.map((entity, i) => ({
      id: entity.id,
      type: "customNode",
      data: {
        label: entity.label,
        fields: entity.fields,
      },
      position: {
        x: 200 + 300 * Math.cos((2 * Math.PI * i) / initialEntities.length),
        y: 200 + 200 * Math.sin((2 * Math.PI * i) / initialEntities.length),
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialLinks.map((link) => ({
      id: link.id,
      source: link.source,
      target: link.target,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "hsl(var(--primary))",
      },
      style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
      label: `${link.sourceField} → ${link.targetField}`,
      labelStyle: { 
        fill: "hsl(var(--foreground))", 
        fontSize: 11, 
        fontWeight: 500
      },
      labelBgStyle: { 
        fill: "hsl(var(--background))", 
        fillOpacity: 0.9,
        borderRadius: 4, 
        padding: 4,
        stroke: "hsl(var(--border))",
        strokeWidth: 1
      },
    }))
  );

  // Column selector state
  const [pendingConnection, setPendingConnection] = useState<null | {
    source: string;
    target: string;
  }>(null);

  const [activeConnections, setActiveConnections] = useState(initialLinks);

  const handleConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (!source || !target) return;

      const exists = edges.some(
        (e) => e.source === source && e.target === target
      );
      if (exists) {
        toast.error("Connection already exists between these entities");
        return;
      }

      setPendingConnection({ source, target });
    },
    [edges]
  );

  const handleConfirmColumns = (sourceField: string, targetField: string) => {
    if (!pendingConnection) return;
    const id = `${pendingConnection.source}-${pendingConnection.target}`;
    
    // Add to active connections
    const newConnection = {
      id,
      source: pendingConnection.source,
      target: pendingConnection.target,
      sourceField,
      targetField,
    };
    setActiveConnections(prev => [...prev, newConnection]);
    
    setEdges((eds) =>
      addEdge(
        {
          id,
          source: pendingConnection.source,
          target: pendingConnection.target,
          label: `${sourceField} → ${targetField}`,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
          labelStyle: { 
            fill: "hsl(var(--foreground))", 
            fontSize: 11, 
            fontWeight: 500
          },
          labelBgStyle: { 
            fill: "hsl(var(--background))", 
            fillOpacity: 0.9,
            borderRadius: 4, 
            padding: 4,
            stroke: "hsl(var(--border))",
            strokeWidth: 1
          },
        },
        eds
      )
    );
    setPendingConnection(null);
    toast.success(`Connected ${sourceField} to ${targetField}`);
  };

  const handleEdgesDelete = useCallback(
    (toDelete: Edge[]) => {
      setEdges((prev) =>
        prev.filter((e) => !toDelete.find((d) => d.id === e.id))
      );
      setActiveConnections(prev => 
        prev.filter((c) => !toDelete.find((d) => d.id === c.id))
      );
    },
    [setEdges]
  );

  const sourceFields =
    pendingConnection?.source
      ? nodes.find((n) => n.id === pendingConnection.source)?.data.fields ?? []
      : [];

  const targetFields =
    pendingConnection?.target
      ? nodes.find((n) => n.id === pendingConnection.target)?.data.fields ?? []
      : [];

  const filteredConnections = activeConnections.filter(connection =>
    connection.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.sourceField.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.targetField.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 py-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Lookup Relations</h1>
          <p className="text-muted-foreground mt-1">
            Connect entities with referential integrity by creating field-level lookups.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Entity Relationship Diagram
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[70vh]">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={handleConnect}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onEdgesDelete={handleEdgesDelete}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.3}
                    maxZoom={1.5}
                    panOnScroll
                    panOnDrag
                    zoomOnScroll
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    connectionLineStyle={{ stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    className="bg-background"
                  >
                    <MiniMap
                      nodeColor={() => "hsl(var(--muted))"}
                      nodeStrokeColor={() => "hsl(var(--primary))"}
                      className="bg-card border border-border rounded-md"
                    />
                    <Controls 
                      className="bg-card border border-border rounded-md [&>button]:bg-card [&>button]:border-border [&>button]:text-foreground [&>button:hover]:bg-muted [&>button:hover]:text-foreground" 
                      showZoom={true}
                      showFitView={true}
                      showInteractive={true}
                    />
                    <Background 
                      color="hsl(var(--muted-foreground))" 
                      gap={20} 
                      className="opacity-20"
                    />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connections Panel */}
        <div className="space-y-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary" />
                Active Lookups
                <Badge variant="secondary">{activeConnections.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredConnections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No lookup connections found</p>
                    <p className="text-xs mt-1">Drag from one entity to another to create a lookup</p>
                  </div>
                ) : (
                  filteredConnections.map((connection) => (
                    <div key={connection.id} className="p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{connection.source}</Badge>
                          <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                          <Badge variant="outline" className="text-xs">{connection.target}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEdges(prev => prev.filter(e => e.id !== connection.id));
                            setActiveConnections(prev => prev.filter(c => c.id !== connection.id));
                          }}
                          className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono">{connection.sourceField}</span>
                        <span className="mx-1">→</span>
                        <span className="font-mono">{connection.targetField}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Drag from one entity to another to create a lookup relationship</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Select specific fields that should be connected between entities</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Click the trash icon to remove existing connections</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Use the search to filter through your connections</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Column Picker Modal */}
      <ColumnSelectModal
        open={!!pendingConnection}
        sourceEntity={pendingConnection?.source || ""}
        targetEntity={pendingConnection?.target || ""}
        sourceFields={sourceFields}
        targetFields={targetFields}
        onSelect={handleConfirmColumns}
        onCancel={() => setPendingConnection(null)}
      />
    </div>
  );
}
