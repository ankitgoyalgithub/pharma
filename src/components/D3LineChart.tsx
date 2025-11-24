import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3LineChartProps {
  data: Array<{
    period: number;
    periodLabel?: string;
    historical: number | null;
    baseline: number | null;
    enhanced: number | null;
  }>;
  width: number;
  height: number;
  showLegend?: boolean;
  baselineLabel?: string;
  enhancedLabel?: string;
}

export const D3LineChart = ({ 
  data, 
  width, 
  height, 
  showLegend = true,
  baselineLabel = 'Baseline Forecast',
  enhancedLabel = 'Enhanced Forecast'
}: D3LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 120, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, innerWidth]);

    const allValues = data.flatMap(d => [d.historical, d.baseline, d.enhanced].filter((v): v is number => v !== null));
    const yMin = d3.min(allValues) || 0;
    const yMax = d3.max(allValues) || 100;
    const yScale = d3.scaleLinear()
      .domain([yMin * 0.95, yMax * 1.05])
      .range([innerHeight, 0])
      .nice();

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(12, data.length))
      .tickFormat(d => {
        const index = Math.round(d as number) - 1;
        return data[index]?.periodLabel || `${d}`;
      });

    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `${d}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'hsl(var(--muted-foreground))');

    g.append('g')
      .call(yAxis)
      .attr('color', 'hsl(var(--muted-foreground))');

    // Line generators
    const lineHistorical = d3.line<typeof data[0]>()
      .defined(d => d.historical !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.historical!))
      .curve(d3.curveMonotoneX);

    const lineBaseline = d3.line<typeof data[0]>()
      .defined(d => d.baseline !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.baseline!))
      .curve(d3.curveMonotoneX);

    const lineEnhanced = d3.line<typeof data[0]>()
      .defined(d => d.enhanced !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.enhanced!))
      .curve(d3.curveMonotoneX);

    // Historical line
    g.append('path')
      .datum(data.filter(d => d.historical !== null))
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--accent))')
      .attr('stroke-width', 2)
      .attr('d', lineHistorical);

    // Baseline forecast line
    g.append('path')
      .datum(data.filter(d => d.baseline !== null))
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--info))')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineBaseline);

    // Enhanced forecast line
    g.append('path')
      .datum(data.filter(d => d.enhanced !== null))
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2.5)
      .attr('d', lineEnhanced);

    // Data points with hover
    const tooltip = d3.select(tooltipRef.current);

    // Enhanced forecast points
    g.selectAll('.dot-enhanced')
      .data(data.filter(d => d.enhanced !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-enhanced')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.enhanced!))
      .attr('r', 4)
      .attr('fill', 'hsl(var(--primary))')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('r', 6);
        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs font-semibold">${d.periodLabel || `Period ${d.period}`}</div>
            <div class="text-xs">${enhancedLabel}: ${d.enhanced?.toFixed(1)}</div>
          `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('r', 4);
        tooltip.style('opacity', '0');
      });

    // Baseline forecast points
    g.selectAll('.dot-baseline')
      .data(data.filter(d => d.baseline !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-baseline')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.baseline!))
      .attr('r', 3)
      .attr('fill', 'hsl(var(--info))')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('r', 5);
        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs font-semibold">${d.periodLabel || `Period ${d.period}`}</div>
            <div class="text-xs">${baselineLabel}: ${d.baseline?.toFixed(1)}</div>
          `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('r', 3);
        tooltip.style('opacity', '0');
      });

    // Legend
    if (showLegend) {
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right + 10}, ${margin.top})`);

      const legendData = [
        { label: 'Historical', color: 'hsl(var(--accent))', dashed: false },
        { label: baselineLabel, color: 'hsl(var(--info))', dashed: true },
        { label: enhancedLabel, color: 'hsl(var(--primary))', dashed: false }
      ];

      legendData.forEach((item, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 24})`);

        legendRow.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', item.color)
          .attr('stroke-width', i === 2 ? 2.5 : 2)
          .attr('stroke-dasharray', item.dashed ? '5,5' : '0');

        legendRow.append('text')
          .attr('x', 26)
          .attr('y', 4)
          .attr('fill', 'hsl(var(--foreground))')
          .style('font-size', '11px')
          .text(item.label);
      });
    }

  }, [data, width, height, baselineLabel, enhancedLabel, showLegend]);

  return (
    <>
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          opacity: 0,
          pointerEvents: 'none',
          background: 'hsl(var(--popover))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          padding: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'opacity 0.2s'
        }}
      />
    </>
  );
};
