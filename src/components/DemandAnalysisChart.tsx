import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DemandAnalysisChartProps {
  granularity: 'weekly' | 'monthly' | 'quarterly';
  valueMode: 'value' | 'volume';
  classFilter: string;
  locationFilter: string;
  chartGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export const DemandAnalysisChart = ({ granularity, valueMode, classFilter, locationFilter, chartGranularity }: DemandAnalysisChartProps) => {
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
    // initialize once
    setRenderWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || renderWidth === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const containerWidth = renderWidth;
    const containerHeight = 320;

    // Generate data based on granularity - split into historical and forecast periods
    const generateData = () => {
      switch (chartGranularity) {
        case 'daily':
          // 42 days historical + 42 days forecast
          const dailyData = [];
          for (let i = 1; i <= 84; i++) {
            const baseValue = 100 + Math.sin(i / 10) * 30;
            if (i <= 42) {
              // Historical period
              dailyData.push({
                period: i,
                historical: baseValue + Math.random() * 10,
                baseline: null,
                enhanced: null,
              });
            } else {
              // Forecast period
              dailyData.push({
                period: i,
                historical: null,
                baseline: baseValue + 10 + Math.random() * 10,
                enhanced: baseValue + 15 + Math.random() * 12,
              });
            }
          }
          return dailyData;
        case 'weekly':
          return [
            { period: 1, historical: 90, baseline: null, enhanced: null },
            { period: 2, historical: 95, baseline: null, enhanced: null },
            { period: 3, historical: 140, baseline: null, enhanced: null },
            { period: 4, historical: 150, baseline: null, enhanced: null },
            { period: 5, historical: 160, baseline: null, enhanced: null },
            { period: 6, historical: 165, baseline: null, enhanced: null },
            { period: 7, historical: 195, baseline: 195, enhanced: 195 }, // Connection point
            { period: 8, historical: null, baseline: 210, enhanced: 220 },
            { period: 9, historical: null, baseline: 160, enhanced: 175 },
            { period: 10, historical: null, baseline: 140, enhanced: 155 },
            { period: 11, historical: null, baseline: 10, enhanced: 15 },
            { period: 12, historical: null, baseline: 5, enhanced: 8 },
          ];
        case 'monthly':
          return [
            { period: 1, historical: 380, baseline: null, enhanced: null },
            { period: 2, historical: 420, baseline: 420, enhanced: 420 }, // Connection point
            { period: 3, historical: null, baseline: 520, enhanced: 560 },
          ];
        case 'quarterly':
          return [
            { period: 1, historical: 1260, baseline: 1260, enhanced: 1260 }, // Connection point
          ];
        default:
          return [];
      }
    };

    const data = generateData();
    
    // Get period label
    const getPeriodLabel = (period: number) => {
      switch (chartGranularity) {
        case 'daily': return `Day ${period}`;
        case 'weekly': return `Week ${period}`;
        case 'monthly': return `Month ${period}`;
        case 'quarterly': return `Q${period}`;
        default: return `${period}`;
      }
    };

    // Chart dimensions
    const topSectionHeight = 120;
    const chartMargin = { top: topSectionHeight + 20, right: 40, bottom: 40, left: 50 };
    const chartWidth = containerWidth - chartMargin.left - chartMargin.right;
    const chartHeight = containerHeight - chartMargin.top - chartMargin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);

    // Get CSS variables for colors
    const getHSLColor = (varName: string) => {
      const hsl = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return `hsl(${hsl})`;
    };

    const successColor = getHSLColor('--success');
    const primaryColor = getHSLColor('--primary');
    const accentColor = getHSLColor('--accent');
    const mutedForeground = getHSLColor('--muted-foreground');
    const borderColor = getHSLColor('--border');
    const foregroundColor = getHSLColor('--foreground');
    const backgroundColor = getHSLColor('--background');

    // Top section - Circular progress and metrics
    const topGroup = svg.append('g');

    // Circular progress (82% Backtested Accuracy)
    const circleRadius = 45;
    const circleX = 80;
    const circleY = 65;
    const progressPercent = 82;

    // Background circle
    topGroup.append('circle')
      .attr('cx', circleX)
      .attr('cy', circleY)
      .attr('r', circleRadius)
      .attr('fill', 'none')
      .attr('stroke', borderColor)
      .attr('stroke-width', 12);

    // Progress arc
    const arc = d3.arc()
      .innerRadius(circleRadius - 6)
      .outerRadius(circleRadius + 6)
      .startAngle(0)
      .endAngle((progressPercent / 100) * 2 * Math.PI);

    topGroup.append('path')
      .attr('d', arc as any)
      .attr('transform', `translate(${circleX}, ${circleY}) rotate(-90)`)
      .attr('fill', successColor);

    // Percentage text - positioned outside circle to the right
    topGroup.append('text')
      .attr('x', circleX + circleRadius + 15)
      .attr('y', circleY - 5)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '48px')
      .attr('font-weight', 'bold')
      .attr('fill', successColor)
      .text(`${progressPercent}%`);

    // "Backtested Accuracy" label - positioned below the percentage
    topGroup.append('text')
      .attr('x', circleX + circleRadius + 15)
      .attr('y', circleY + 20)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '13px')
      .attr('fill', mutedForeground)
      .text('Backtested Accuracy');

    // Right side metrics
    const metricsX = containerWidth - 320;
    
    // Next 12 Weeks Value Projection
    topGroup.append('text')
      .attr('x', metricsX)
      .attr('y', 40)
      .attr('text-anchor', 'start')
      .attr('font-size', '13px')
      .attr('fill', mutedForeground)
      .text('Next 12 Weeks Value Projection');

    topGroup.append('text')
      .attr('x', containerWidth - 20)
      .attr('y', 40)
      .attr('text-anchor', 'end')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', successColor)
      .text('6.8');

    topGroup.append('text')
      .attr('x', containerWidth - 20)
      .attr('y', 58)
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('fill', mutedForeground)
      .text('in M $');

    // Next 12 Weeks Volume Projection
    topGroup.append('text')
      .attr('x', metricsX)
      .attr('y', 85)
      .attr('text-anchor', 'start')
      .attr('font-size', '13px')
      .attr('fill', mutedForeground)
      .text('Next 12 Weeks Volume Projection');

    topGroup.append('text')
      .attr('x', containerWidth - 20)
      .attr('y', 85)
      .attr('text-anchor', 'end')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', successColor)
      .text('120,756');

    topGroup.append('text')
      .attr('x', containerWidth - 20)
      .attr('y', 103)
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('fill', mutedForeground)
      .text('units');

    // Add subtle gradient background
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'chartGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', getHSLColor('--muted'))
      .attr('stop-opacity', 0.4);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', getHSLColor('--background'))
      .attr('stop-opacity', 0.8);

    svg.append('rect')
      .attr('x', 0)
      .attr('y', topSectionHeight)
      .attr('width', containerWidth)
      .attr('height', containerHeight - topSectionHeight)
      .attr('fill', 'url(#chartGradient)');

    // Chart group
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, chartWidth]);

    const maxY = d3.max(data, d => Math.max(
      d.historical || 0, 
      d.baseline || 0, 
      d.enhanced || 0
    )) || 400;
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([chartHeight, 0]);

    // Grid lines
    const yTicks = yScale.ticks(5);
    chartGroup.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', borderColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.7);

    // X axis
    const xTickValues = chartGranularity === 'daily'
      ? data.filter((_, i) => i % 7 === 0).map(d => d.period)
      : data.filter((_, i) => i % 2 === 0).map(d => d.period);
    
    const xAxis = d3.axisBottom(xScale)
      .tickValues(xTickValues)
      .tickFormat(d => getPeriodLabel(d as number));

    chartGroup.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', mutedForeground)
      .attr('font-size', '11px');

    chartGroup.selectAll('.domain, .tick line')
      .attr('stroke', borderColor);

    // Y axis
    const yAxis = d3.axisLeft(yScale)
      .tickValues(yTicks);

    chartGroup.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', mutedForeground)
      .attr('font-size', '11px');

    chartGroup.selectAll('.domain, .tick line')
      .attr('stroke', borderColor);

    // Line generators
    const historicalLine = d3.line<typeof data[0]>()
      .defined(d => d.historical !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.historical!))
      .curve(d3.curveMonotoneX);

    const baselineLine = d3.line<typeof data[0]>()
      .defined(d => d.baseline !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.baseline!))
      .curve(d3.curveMonotoneX);

    const enhancedLine = d3.line<typeof data[0]>()
      .defined(d => d.enhanced !== null)
      .x(d => xScale(d.period))
      .y(d => yScale(d.enhanced!))
      .curve(d3.curveMonotoneX);

    // Draw historical line (solid)
    chartGroup.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryColor)
      .attr('stroke-width', 2.5)
      .attr('d', historicalLine);

    // Draw baseline forecast line (dashed)
    chartGroup.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', baselineLine);

    // Draw enhanced forecast line (dashed)
    chartGroup.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', successColor)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', enhancedLine);

    // Add dots for historical data
    chartGroup.selectAll('.dot-historical')
      .data(data.filter(d => d.historical !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-historical')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.historical!))
      .attr('r', 4)
      .attr('fill', primaryColor)
      .attr('stroke', backgroundColor)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);
        
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(`
              <div class="font-semibold mb-1">${getPeriodLabel(d.period)}</div>
              <div class="text-sm">
                <div class="flex items-center gap-2">
                  <span style="color: ${primaryColor}">●</span>
                  <span>Historical: ${Math.round(d.historical!)}</span>
                </div>
              </div>
            `);
        }
      })
      .on('mousemove', function(event) {
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);
        
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

    // Add dots for baseline forecast
    chartGroup.selectAll('.dot-baseline')
      .data(data.filter(d => d.baseline !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-baseline')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.baseline!))
      .attr('r', 4)
      .attr('fill', accentColor)
      .attr('stroke', backgroundColor)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);
        
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(`
              <div class="font-semibold mb-1">${getPeriodLabel(d.period)}</div>
              <div class="text-sm">
                <div class="flex items-center gap-2">
                  <span style="color: ${accentColor}">●</span>
                  <span>Baseline: ${Math.round(d.baseline!)}</span>
                </div>
              </div>
            `);
        }
      })
      .on('mousemove', function(event) {
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);
        
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

    // Add dots for enhanced forecast
    chartGroup.selectAll('.dot-enhanced')
      .data(data.filter(d => d.enhanced !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot-enhanced')
      .attr('cx', d => xScale(d.period))
      .attr('cy', d => yScale(d.enhanced!))
      .attr('r', 4)
      .attr('fill', successColor)
      .attr('stroke', backgroundColor)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);
        
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
            .html(`
              <div class="font-semibold mb-1">${getPeriodLabel(d.period)}</div>
              <div class="text-sm">
                <div class="flex items-center gap-2">
                  <span style="color: ${successColor}">●</span>
                  <span>Enhanced: ${Math.round(d.enhanced!)}</span>
                </div>
              </div>
            `);
        }
      })
      .on('mousemove', function(event) {
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);
        
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

  }, [granularity, valueMode, classFilter, locationFilter, chartGranularity, renderWidth]);

  return (
    <div className="relative w-full min-w-0">
      <div ref={containerRef} className="w-full min-w-0 overflow-hidden">
        <svg ref={svgRef} className="max-w-full"></svg>
      </div>
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 opacity-0 transition-opacity"
        style={{ maxWidth: '250px' }}
      />
    </div>
  );
};
