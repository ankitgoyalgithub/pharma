import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartDataPoint {
  period: number;
  periodLabel?: string;
  skuName?: string;
  isProxy?: boolean;
  historical: number | null;
  baseline: number | null;
  enhanced: number | null;
}

interface D3LineChartProps {
  data: ChartDataPoint[];
  width: number;
  height: number;
  showLegend?: boolean;
  baselineLabel?: string;
  enhancedLabel?: string;
  yAxisLabel?: string;
  isNpiMode?: boolean;
}

export const D3LineChart = ({ 
  data, 
  width, 
  height, 
  showLegend = true,
  baselineLabel = 'Baseline Forecast',
  enhancedLabel = 'Enhanced Forecast',
  yAxisLabel = '',
  isNpiMode = false
}: D3LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const legendHeight = showLegend ? 40 : 0;
    const margin = { top: 20, right: 30, bottom: 40 + legendHeight, left: 70 };
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

    // Y-axis label
    if (yAxisLabel) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'hsl(var(--muted-foreground))')
        .style('font-size', '11px')
        .text(yAxisLabel);
    }

    // Line generators
    const lineHistorical = d3.line<ChartDataPoint>()
      .defined(d => d.historical !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.historical!))
      .curve(d3.curveMonotoneX);

    const lineBaseline = d3.line<ChartDataPoint>()
      .defined(d => d.baseline !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.baseline!))
      .curve(d3.curveMonotoneX);

    const lineEnhanced = d3.line<ChartDataPoint>()
      .defined(d => d.enhanced !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.enhanced!))
      .curve(d3.curveMonotoneX);

    // In NPI mode, draw proxy and NPI lines separately with different colors
    if (isNpiMode) {
      const proxyData = data.filter(d => d.historical !== null && d.isProxy);
      const npiHistoryData = data.filter(d => d.historical !== null && !d.isProxy);

      // Proxy SKU line (warning/orange color)
      if (proxyData.length > 0) {
        g.append('path')
          .datum(proxyData)
          .attr('fill', 'none')
          .attr('stroke', 'hsl(var(--warning))')
          .attr('stroke-width', 2)
          .attr('d', lineHistorical);
      }

      // NPI History line (accent color)
      if (npiHistoryData.length > 0) {
        g.append('path')
          .datum(npiHistoryData)
          .attr('fill', 'none')
          .attr('stroke', 'hsl(var(--accent))')
          .attr('stroke-width', 2)
          .attr('d', lineHistorical);
      }
    } else {
      // Standard historical line
      g.append('path')
        .datum(data.filter(d => d.historical !== null))
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--accent))')
        .attr('stroke-width', 2)
        .attr('d', lineHistorical);
    }

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

    // Historical points (for NPI mode, use different colors)
    g.selectAll('.dot-historical')
      .data(data.filter(d => d.historical !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-historical')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.historical!))
      .attr('r', 3)
      .attr('fill', d => isNpiMode && d.isProxy ? 'hsl(var(--warning))' : 'hsl(var(--accent))')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('r', 5);
        const skuLabel = d.skuName ? `<div class="text-xs text-muted-foreground">${d.skuName}</div>` : '';
        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs font-semibold">${d.periodLabel || `Period ${d.period}`}</div>
            ${skuLabel}
            <div class="text-xs">Volume: ${d.historical?.toFixed(1)}</div>
          `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('r', 3);
        tooltip.style('opacity', '0');
      });

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
        const skuLabel = d.skuName ? `<div class="text-xs text-muted-foreground">${d.skuName}</div>` : '';
        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs font-semibold">${d.periodLabel || `Period ${d.period}`}</div>
            ${skuLabel}
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
        const skuLabel = d.skuName ? `<div class="text-xs text-muted-foreground">${d.skuName}</div>` : '';
        tooltip
          .style('opacity', '1')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="text-xs font-semibold">${d.periodLabel || `Period ${d.period}`}</div>
            ${skuLabel}
            <div class="text-xs">${baselineLabel}: ${d.baseline?.toFixed(1)}</div>
          `);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('r', 3);
        tooltip.style('opacity', '0');
      });

    // Legend at bottom
    if (showLegend) {
      const legendData = isNpiMode ? [
        { label: 'Proxy SKU History', color: 'hsl(var(--warning))', dashed: false },
        { label: 'NPI History', color: 'hsl(var(--accent))', dashed: false },
        { label: baselineLabel, color: 'hsl(var(--info))', dashed: true },
        { label: enhancedLabel, color: 'hsl(var(--primary))', dashed: false }
      ] : [
        { label: 'Historical', color: 'hsl(var(--accent))', dashed: false },
        { label: baselineLabel, color: 'hsl(var(--info))', dashed: true },
        { label: enhancedLabel, color: 'hsl(var(--primary))', dashed: false }
      ];

      const legendSpacing = isNpiMode ? 130 : 150;
      const legendStartX = (width - (legendData.length * legendSpacing)) / 2;

      const legend = svg.append('g')
        .attr('transform', `translate(${legendStartX}, ${height - 25})`);

      legendData.forEach((item, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(${i * legendSpacing}, 0)`);

        legendRow.append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', item.color)
          .attr('stroke-width', item.label === enhancedLabel ? 2.5 : 2)
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
