import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ScenarioComparisonChartProps {
  baselineData: number[];
  scenarioData: number[];
  labels: string[];
  scenarioName: string;
}

export const ScenarioComparisonChart = ({ 
  baselineData, 
  scenarioData, 
  labels,
  scenarioName 
}: ScenarioComparisonChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [renderWidth, setRenderWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      setRenderWidth(Math.max(0, Math.floor(entry.contentRect.width)));
    });
    ro.observe(el);
    setRenderWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || renderWidth === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const containerWidth = renderWidth;
    const containerHeight = 300;
    const margin = { top: 20, right: 120, bottom: 50, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data
    const data = labels.map((label, i) => ({
      label,
      baseline: baselineData[i],
      scenario: scenarioData[i],
      index: i
    }));

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.1);

    const yMax = Math.max(
      d3.max(baselineData) || 0,
      d3.max(scenarioData) || 0
    ) * 1.1;

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0])
      .nice();

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.3);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '11px')
      .style('fill', 'hsl(var(--foreground))');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${(Number(d) / 1000).toFixed(1)}K`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', 'hsl(var(--foreground))');

    // Line generators
    const baselineLine = d3.line<typeof data[0]>()
      .x(d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.baseline))
      .curve(d3.curveMonotoneX);

    const scenarioLine = d3.line<typeof data[0]>()
      .x(d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.scenario))
      .curve(d3.curveMonotoneX);

    // Baseline line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(220, 13%, 69%)')
      .attr('stroke-width', 2)
      .attr('d', baselineLine);

    // Baseline points
    g.selectAll('.baseline-dot')
      .data(data)
      .join('circle')
      .attr('class', 'baseline-dot')
      .attr('cx', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.baseline))
      .attr('r', 3)
      .attr('fill', 'hsl(220, 13%, 69%)')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Scenario line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(262, 83%, 58%)')
      .attr('stroke-width', 3)
      .attr('d', scenarioLine);

    // Scenario points
    g.selectAll('.scenario-dot')
      .data(data)
      .join('circle')
      .attr('class', 'scenario-dot')
      .attr('cx', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.scenario))
      .attr('r', 4)
      .attr('fill', 'hsl(262, 83%, 58%)')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${containerWidth - 110}, 20)`);

    // Baseline legend
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', 'hsl(220, 13%, 69%)')
      .attr('stroke-width', 2);

    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 0)
      .attr('r', 3)
      .attr('fill', 'hsl(220, 13%, 69%)');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'hsl(var(--foreground))')
      .text('Baseline');

    // Scenario legend
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', 'hsl(262, 83%, 58%)')
      .attr('stroke-width', 3);

    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 20)
      .attr('r', 4)
      .attr('fill', 'hsl(262, 83%, 58%)');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 24)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'hsl(var(--foreground))')
      .text('Scenario');

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    const showTooltip = (event: MouseEvent, d: typeof data[0]) => {
      tooltip
        .style('opacity', '1')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .html(`
          <div style="font-weight: 600; margin-bottom: 4px;">${d.label}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span style="color: hsl(220, 13%, 69%);">●</span>
            <span>Baseline: ${(d.baseline / 1000).toFixed(1)}K</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: hsl(262, 83%, 58%);">●</span>
            <span>Scenario: ${(d.scenario / 1000).toFixed(1)}K</span>
          </div>
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid hsl(var(--border)); font-size: 11px; color: hsl(var(--muted-foreground));">
            Delta: ${d.scenario >= d.baseline ? '+' : ''}${((d.scenario - d.baseline) / 1000).toFixed(1)}K
          </div>
        `);
    };

    const hideTooltip = () => {
      tooltip.style('opacity', '0');
    };

    // Add invisible rectangles for better hover detection
    g.selectAll('.hover-rect')
      .data(data)
      .join('rect')
      .attr('class', 'hover-rect')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mousemove', showTooltip as any)
      .on('mouseout', hideTooltip);

  }, [renderWidth, baselineData, scenarioData, labels, scenarioName]);

  return (
    <div ref={containerRef} className="relative w-full h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 text-sm"
        style={{ opacity: 0, transition: 'opacity 0.2s' }}
      />
    </div>
  );
};
