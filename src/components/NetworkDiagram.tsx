import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

type EchelonMode = "single" | "multi";

interface NetworkNode {
  id: string;
  label: string;
  kind: "plant" | "dc" | "store";
  x: number;
  y: number;
}

interface NetworkLink {
  source: string;
  target: string;
}

interface NetworkDiagramProps {
  mode: EchelonMode;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ mode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getSingleEchelonData = (): { nodes: NetworkNode[]; links: NetworkLink[] } => ({
    nodes: [
      { id: "plant", label: "Plant", kind: "plant", x: 120, y: 120 },
      { id: "store-a", label: "Store A", kind: "store", x: 420, y: 60 },
      { id: "store-b", label: "Store B", kind: "store", x: 420, y: 120 },
      { id: "store-c", label: "Store C", kind: "store", x: 420, y: 180 },
    ],
    links: [
      { source: "plant", target: "store-a" },
      { source: "plant", target: "store-b" },
      { source: "plant", target: "store-c" },
    ],
  });

  const getMultiEchelonData = (): { nodes: NetworkNode[]; links: NetworkLink[] } => ({
    nodes: [
      { id: "plant", label: "Plant", kind: "plant", x: 120, y: 120 },
      { id: "dc-north", label: "DC North", kind: "dc", x: 360, y: 80 },
      { id: "dc-south", label: "DC South", kind: "dc", x: 360, y: 160 },
      { id: "store-a", label: "Store A", kind: "store", x: 620, y: 40 },
      { id: "store-b", label: "Store B", kind: "store", x: 620, y: 100 },
      { id: "store-c", label: "Store C", kind: "store", x: 620, y: 160 },
      { id: "store-d", label: "Store D", kind: "store", x: 620, y: 220 },
    ],
    links: [
      { source: "plant", target: "dc-north" },
      { source: "plant", target: "dc-south" },
      { source: "dc-north", target: "store-a" },
      { source: "dc-north", target: "store-b" },
      { source: "dc-south", target: "store-c" },
      { source: "dc-south", target: "store-d" },
    ],
  });

  const getNodeColor = (kind: "plant" | "dc" | "store") => {
    switch (kind) {
      case "plant":
        return "#22c55e";
      case "dc":
        return "#3b82f6";
      case "store":
        return "#f59e0b";
      default:
        return "#94a3b8";
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const data = mode === "single" ? getSingleEchelonData() : getMultiEchelonData();
    const width = 800;
    const height = 280;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Create a group for zoom transformation
    const g = svg.append("g");

    // Define arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    // Draw links
    const links = g
      .selectAll(".link")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => {
        const source = data.nodes.find((n) => n.id === d.source);
        return source?.x || 0;
      })
      .attr("y1", (d) => {
        const source = data.nodes.find((n) => n.id === d.source);
        return source?.y || 0;
      })
      .attr("x2", (d) => {
        const target = data.nodes.find((n) => n.id === d.target);
        return target?.x || 0;
      })
      .attr("y2", (d) => {
        const target = data.nodes.find((n) => n.id === d.target);
        return target?.y || 0;
      })
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)")
      .style("opacity", 0.6);

    // Draw nodes
    const nodes = g
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodes
      .append("rect")
      .attr("x", -48)
      .attr("y", -18)
      .attr("width", 96)
      .attr("height", 36)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", (d) => getNodeColor(d.kind))
      .attr("opacity", 0.9)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 1).attr("stroke", "#000").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.9).attr("stroke", "none");
      });

    nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .style("pointer-events", "none")
      .text((d) => d.label);

    // Add capacity labels on links
    links
      .append("title")
      .text((d) => `Flow: ${d.source} → ${d.target}`);

    // Setup zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Set initial zoom
    const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1);
    svg.call(zoom.transform, initialTransform);
  }, [mode]);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
  };

  return (
    <div className="relative">
      <div className="w-full h-[280px] bg-muted rounded-lg border overflow-hidden">
        <svg ref={svgRef} viewBox="0 0 800 280" className="w-full h-full" />
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        <Button size="icon" variant="outline" className="h-7 w-7 bg-background/80" onClick={handleZoomIn}>
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button size="icon" variant="outline" className="h-7 w-7 bg-background/80" onClick={handleZoomOut}>
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-background/80" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Zoom: {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
};
