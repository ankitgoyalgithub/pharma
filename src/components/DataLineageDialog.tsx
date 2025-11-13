import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Database, FileText, GitBranch, Package, BarChart3, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataLineageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityTitle: string;
  entityType: 'master' | 'timeseries' | 'featurestore';
}

// Generate lineage data based on entity
const generateLineageData = (entityTitle: string, entityType: string) => {
  const nodes: Node[] = [
    // Source systems (left side)
    {
      id: 'source-1',
      type: 'input',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">ERP System</div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mt-1">Source</Badge>
            </div>
          </div>
        )
      },
      position: { x: 50, y: 50 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--primary) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--primary) / 0.15)'
      },
    },
    {
      id: 'source-2',
      type: 'input',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">CSV Files</div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mt-1">Source</Badge>
            </div>
          </div>
        )
      },
      position: { x: 50, y: 280 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--accent) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--accent) / 0.15)'
      },
    },
    
    // ETL/Transform layer (middle)
    {
      id: 'transform-1',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <GitBranch className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">Data Cleaning</div>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 mt-1">Transform</Badge>
            </div>
          </div>
        )
      },
      position: { x: 350, y: 50 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--secondary) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--secondary) / 0.15)'
      },
    },
    {
      id: 'transform-2',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Package className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">Data Enrichment</div>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 mt-1">Transform</Badge>
            </div>
          </div>
        )
      },
      position: { x: 350, y: 280 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--secondary) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--secondary) / 0.15)'
      },
    },
    
    // Target entity (center)
    {
      id: 'target',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-foreground">{entityTitle}</div>
              <Badge className="text-[10px] px-2 py-0.5 mt-1.5 bg-primary">{entityType}</Badge>
            </div>
          </div>
        )
      },
      position: { x: 650, y: 140 },
      style: { 
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))',
        border: '3px solid hsl(var(--primary) / 0.6)',
        borderRadius: '20px',
        padding: '8px',
        width: '200px',
        boxShadow: '0 8px 24px hsl(var(--primary) / 0.25)'
      },
    },
    
    // Downstream consumers (right side)
    {
      id: 'consumer-1',
      type: 'output',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-success/10">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">Analytics</div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mt-1">Consumer</Badge>
            </div>
          </div>
        )
      },
      position: { x: 950, y: 50 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--success) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--success) / 0.15)'
      },
    },
    {
      id: 'consumer-2',
      type: 'output',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 px-4 py-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">ML Pipeline</div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mt-1">Consumer</Badge>
            </div>
          </div>
        )
      },
      position: { x: 950, y: 280 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--success) / 0.5)',
        borderRadius: '16px',
        padding: '4px',
        width: '160px',
        boxShadow: '0 4px 12px hsl(var(--success) / 0.15)'
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: 'e-source1-transform1',
      source: 'source-1',
      target: 'transform-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    },
    {
      id: 'e-source2-transform2',
      source: 'source-2',
      target: 'transform-2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
    },
    {
      id: 'e-transform1-target',
      source: 'transform-1',
      target: 'target',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    },
    {
      id: 'e-transform2-target',
      source: 'transform-2',
      target: 'target',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
    },
    {
      id: 'e-target-consumer1',
      source: 'target',
      target: 'consumer-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--success))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--success))' },
    },
    {
      id: 'e-target-consumer2',
      source: 'target',
      target: 'consumer-2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--success))', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--success))' },
    },
  ];

  return { nodes, edges };
};

export const DataLineageDialog: React.FC<DataLineageDialogProps> = ({
  open,
  onOpenChange,
  entityTitle,
  entityType,
}) => {
  const { nodes, edges } = useMemo(() => 
    generateLineageData(entityTitle, entityType), 
    [entityTitle, entityType]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitBranch className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div>Data Lineage: {entityTitle}</div>
              <DialogDescription className="text-sm mt-1">
                End-to-end data flow visualization from sources through transformations to consumers
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 border-2 border-border rounded-xl overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.5 }}
            attributionPosition="bottom-right"
            className="bg-transparent"
            minZoom={0.3}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
            }}
          >
            <Background 
              color="hsl(var(--muted-foreground) / 0.3)" 
              gap={20} 
              size={1}
              className="opacity-40"
            />
            <Controls 
              className="bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-lg" 
              showInteractive={false}
            />
            <MiniMap 
              className="bg-card/95 backdrop-blur-sm border-2 border-border shadow-xl rounded-lg"
              nodeColor={(node) => {
                if (node.type === 'input') return 'hsl(var(--primary))';
                if (node.type === 'output') return 'hsl(var(--success))';
                return 'hsl(var(--secondary))';
              }}
              maskColor="hsl(var(--muted) / 0.3)"
              style={{ width: 200, height: 150 }}
            />
          </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
};
