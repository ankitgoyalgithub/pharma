import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { inventoryLevelsData } from "@/data/foundry/inventoryLevelsData";
import { productMasterData } from "@/data/foundry/productMasterData";
import { locationMasterData } from "@/data/foundry/locationMasterData";

interface InventoryAnalysisChartProps {
  chartGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  valueMode?: 'stock' | 'value';
  productFilter?: string;
  locationFilter?: string;
}

export const InventoryAnalysisChart: React.FC<InventoryAnalysisChartProps> = ({
  chartGranularity,
  valueMode = 'stock',
  productFilter = 'all',
  locationFilter = 'all',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Generate data based on granularity
  const generateData = (granularity: string) => {
    const dataPoints = granularity === 'daily' ? 90 : granularity === 'weekly' ? 52 : granularity === 'monthly' ? 12 : 4;
    const startDate = new Date('2024-01-01');
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date(startDate);
      if (granularity === 'daily') {
        date.setDate(startDate.getDate() + i);
      } else if (granularity === 'weekly') {
        date.setDate(startDate.getDate() + i * 7);
      } else if (granularity === 'monthly') {
        date.setMonth(startDate.getMonth() + i);
      } else {
        date.setMonth(startDate.getMonth() + i * 3);
      }
      
      return {
        date,
        currentStock: 1000 + Math.random() * 500 + Math.sin(i / 5) * 200,
        safetyStock: 800 + Math.random() * 100,
        reorderPoint: 850 + Math.random() * 100,
        maxStock: 1800 + Math.random() * 200,
        reserved: 100 + Math.random() * 50,
      };
    });
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 500 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 100, right: 120, bottom: 60, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = generateData(chartGranularity);

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.maxStock * 1.1) || 2000])
      .nice()
      .range([height, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height)
          .tickFormat(() => "")
      );

    // Area generators
    const safetyStockArea = d3
      .area<any>()
      .x((d) => xScale(d.date))
      .y0(height)
      .y1((d) => yScale(d.safetyStock))
      .curve(d3.curveMonotoneX);

    const reorderArea = d3
      .area<any>()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.safetyStock))
      .y1((d) => yScale(d.reorderPoint))
      .curve(d3.curveMonotoneX);

    const normalArea = d3
      .area<any>()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.reorderPoint))
      .y1((d) => yScale(d.maxStock))
      .curve(d3.curveMonotoneX);

    // Draw areas
    g.append("path")
      .datum(data)
      .attr("fill", "hsl(0, 84%, 60%)")
      .attr("fill-opacity", 0.1)
      .attr("d", safetyStockArea);

    g.append("path")
      .datum(data)
      .attr("fill", "hsl(48, 96%, 53%)")
      .attr("fill-opacity", 0.15)
      .attr("d", reorderArea);

    g.append("path")
      .datum(data)
      .attr("fill", "hsl(142, 76%, 36%)")
      .attr("fill-opacity", 0.15)
      .attr("d", normalArea);

    // Line generator
    const line = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.currentStock))
      .curve(d3.curveMonotoneX);

    // Draw current stock line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "hsl(217, 91%, 60%)")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Draw reference lines
    const avgSafetyStock = d3.mean(data, (d) => d.safetyStock) || 0;
    const avgReorderPoint = d3.mean(data, (d) => d.reorderPoint) || 0;
    const avgMaxStock = d3.mean(data, (d) => d.maxStock) || 0;

    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(avgSafetyStock))
      .attr("y2", yScale(avgSafetyStock))
      .attr("stroke", "hsl(0, 84%, 60%)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.6);

    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(avgReorderPoint))
      .attr("y2", yScale(avgReorderPoint))
      .attr("stroke", "hsl(48, 96%, 53%)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.6);

    // Axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(xScale).tickFormat((d) => {
          const date = d as Date;
          if (chartGranularity === 'daily') return d3.timeFormat("%b %d")(date);
          if (chartGranularity === 'weekly') return d3.timeFormat("%b %d")(date);
          if (chartGranularity === 'monthly') return d3.timeFormat("%b %Y")(date);
          return d3.timeFormat("Q%q %Y")(date);
        })
      );

    xAxis.selectAll("text").style("fill", "hsl(var(--muted-foreground))");
    xAxis.selectAll("line").style("stroke", "hsl(var(--border))");
    xAxis.select("path").style("stroke", "hsl(var(--border))");

    const yAxis = g.append("g").call(d3.axisLeft(yScale).tickFormat((d) => `${d}`));

    yAxis.selectAll("text").style("fill", "hsl(var(--muted-foreground))");
    yAxis.selectAll("line").style("stroke", "hsl(var(--border))");
    yAxis.select("path").style("stroke", "hsl(var(--border))");

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left + 20}, 20)`);

    const legendItems = [
      { label: "Current Stock", color: "hsl(217, 91%, 60%)", type: "line" },
      { label: "Safety Stock Zone", color: "hsl(0, 84%, 60%)", type: "area" },
      { label: "Reorder Zone", color: "hsl(48, 96%, 53%)", type: "area" },
      { label: "Normal Zone", color: "hsl(142, 76%, 36%)", type: "area" },
    ];

    legendItems.forEach((item, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(${i * 160}, 0)`);

      if (item.type === "line") {
        legendItem
          .append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 5)
          .attr("y2", 5)
          .attr("stroke", item.color)
          .attr("stroke-width", 3);
      } else {
        legendItem
          .append("rect")
          .attr("width", 20)
          .attr("height", 10)
          .attr("fill", item.color)
          .attr("fill-opacity", 0.3);
      }

      legendItem
        .append("text")
        .attr("x", 25)
        .attr("y", 10)
        .style("font-size", "12px")
        .style("fill", "hsl(var(--foreground))")
        .text(item.label);
    });

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "hsl(var(--popover))")
      .style("border", "1px solid hsl(var(--border))")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000)
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");

    const focus = g
      .append("g")
      .style("opacity", 0);

    focus
      .append("circle")
      .attr("r", 5)
      .attr("fill", "hsl(217, 91%, 60%)")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    focus
      .append("line")
      .attr("class", "focus-line-y")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    svg
      .append("rect")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = xScale.invert(xPos);
        const bisect = d3.bisector((d: any) => d.date).left;
        const index = bisect(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        const d = x0.getTime() - d0?.date.getTime() > d1?.date.getTime() - x0.getTime() ? d1 : d0;

        if (d) {
          focus.style("opacity", 1);
          focus.attr("transform", `translate(${xScale(d.date)},${yScale(d.currentStock)})`);
          focus.select(".focus-line-y")
            .attr("y1", 0)
            .attr("y2", height - yScale(d.currentStock));

          tooltip
            .style("opacity", 1)
            .html(
              `
              <div style="font-size: 13px; color: hsl(var(--foreground));">
                <div style="font-weight: 600; margin-bottom: 8px; color: hsl(var(--primary));">
                  ${d3.timeFormat("%B %d, %Y")(d.date)}
                </div>
                <div style="display: grid; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; gap: 16px;">
                    <span>Current Stock:</span>
                    <span style="font-weight: 600;">${d.currentStock.toFixed(0)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; gap: 16px;">
                    <span>Safety Stock:</span>
                    <span style="font-weight: 600; color: hsl(0, 84%, 60%);">${d.safetyStock.toFixed(0)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; gap: 16px;">
                    <span>Reorder Point:</span>
                    <span style="font-weight: 600; color: hsl(48, 96%, 53%);">${d.reorderPoint.toFixed(0)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; gap: 16px;">
                    <span>Max Stock:</span>
                    <span style="font-weight: 600; color: hsl(142, 76%, 36%);">${d.maxStock.toFixed(0)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; gap: 16px;">
                    <span>Reserved:</span>
                    <span style="font-weight: 600;">${d.reserved.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              `
            )
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 28}px`);
        }
      })
      .on("mouseout", () => {
        focus.style("opacity", 0);
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [dimensions, chartGranularity, valueMode, productFilter, locationFilter]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};
