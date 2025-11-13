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
import { Database, FileText, GitBranch, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataLineageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityTitle: string;
  entityType: 'master' | 'timeseries' | 'featurestore';
}

// Generate lineage data based on entity
const generateLineageData = (entityTitle: string, entityType: string) => {
  const sanitizedTitle = entityTitle.replace(/\s+/g, '_');
  
  const nodes: Node[] = [
    // Source systems (left side)
    {
      id: 'source-1',
      type: 'input',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold">ERP System</span>
            <Badge variant="secondary" className="text-[10px] px-1">Source</Badge>
          </div>
        )
      },
      position: { x: 0, y: 100 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--primary))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '140px'
      },
    },
    {
      id: 'source-2',
      type: 'input',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <FileText className="h-5 w-5 text-accent" />
            <span className="text-xs font-semibold">CSV Files</span>
            <Badge variant="secondary" className="text-[10px] px-1">Source</Badge>
          </div>
        )
      },
      position: { x: 0, y: 250 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--accent))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '140px'
      },
    },
    
    // ETL/Transform layer (middle)
    {
      id: 'transform-1',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <GitBranch className="h-5 w-5 text-secondary" />
            <span className="text-xs font-semibold">Data Cleaning</span>
            <Badge variant="outline" className="text-[10px] px-1">Transform</Badge>
          </div>
        )
      },
      position: { x: 250, y: 80 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--secondary))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '140px'
      },
    },
    {
      id: 'transform-2',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <Package className="h-5 w-5 text-secondary" />
            <span className="text-xs font-semibold">Data Enrichment</span>
            <Badge variant="outline" className="text-[10px] px-1">Transform</Badge>
          </div>
        )
      },
      position: { x: 250, y: 220 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--secondary))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '140px'
      },
    },
    
    // Target entity (center-right)
    {
      id: 'target',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-2 p-3">
            <Database className="h-6 w-6 text-primary" />
            <div className="text-center">
              <div className="text-sm font-bold">{entityTitle}</div>
              <Badge className="text-[10px] px-1 mt-1">{entityType}</Badge>
            </div>
          </div>
        )
      },
      position: { x: 500, y: 150 },
      style: { 
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))',
        border: '3px solid hsl(var(--primary))',
        borderRadius: '16px',
        padding: '12px',
        minWidth: '180px',
        boxShadow: '0 8px 16px hsl(var(--primary) / 0.2)'
      },
    },
    
    // Downstream consumers (right side)
    {
      id: 'consumer-1',
      type: 'output',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <Database className="h-5 w-5 text-success" />
            <span className="text-xs font-semibold">Analytics Dashboard</span>
            <Badge variant="secondary" className="text-[10px] px-1">Consumer</Badge>
          </div>
        )
      },
      position: { x: 750, y: 80 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--success))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '160px'
      },
    },
    {
      id: 'consumer-2',
      type: 'output',
      data: { 
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <FileText className="h-5 w-5 text-success" />
            <span className="text-xs font-semibold">ML Pipeline</span>
            <Badge variant="secondary" className="text-[10px] px-1">Consumer</Badge>
          </div>
        )
      },
      position: { x: 750, y: 220 },
      style: { 
        background: 'hsl(var(--card))', 
        border: '2px solid hsl(var(--success))',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '160px'
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: 'e-source1-transform1',
      source: 'source-1',
      target: 'transform-1',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    },
    {
      id: 'e-source2-transform2',
      source: 'source-2',
      target: 'transform-2',
      animated: true,
      style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
    },
    {
      id: 'e-transform1-target',
      source: 'transform-1',
      target: 'target',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    },
    {
      id: 'e-transform2-target',
      source: 'transform-2',
      target: 'target',
      animated: true,
      style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--secondary))' },
    },
    {
      id: 'e-target-consumer1',
      source: 'target',
      target: 'consumer-1',
      animated: true,
      style: { stroke: 'hsl(var(--success))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--success))' },
    },
    {
      id: 'e-target-consumer2',
      source: 'target',
      target: 'consumer-2',
      animated: true,
      style: { stroke: 'hsl(var(--success))', strokeWidth: 2 },
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
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Data Lineage: {entityTitle}
          </DialogTitle>
          <DialogDescription>
            Visual representation of data flow from sources to consumers
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 h-full border border-border rounded-lg overflow-hidden bg-gradient-subtle">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            attributionPosition="bottom-left"
            className="bg-gradient-subtle"
          >
            <Background color="hsl(var(--muted-foreground))" gap={16} />
            <Controls className="bg-card border-border" />
            <MiniMap 
              className="bg-card border-border"
              nodeColor={(node) => {
                if (node.type === 'input') return 'hsl(var(--primary))';
                if (node.type === 'output') return 'hsl(var(--success))';
                return 'hsl(var(--secondary))';
              }}
            />
          </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
};
