import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface DemandAnalysisChartProps {
  granularity: 'weekly' | 'monthly' | 'quarterly';
  valueMode: 'value' | 'volume';
  classFilter: string;
  locationFilter: string;
}

type GranularityLevel = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export const DemandAnalysisChart = ({ granularity, valueMode, classFilter, locationFilter }: DemandAnalysisChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentGranularity, setCurrentGranularity] = useState<GranularityLevel>('weekly');

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = 320;

    // Generate data based on granularity
    const generateData = () => {
      switch (currentGranularity) {
        case 'daily':
          return Array.from({ length: 84 }, (_, i) => ({
            period: i + 1,
            historical: Math.random() * 50 + 80,
            forecast: Math.random() * 60 + 120,
            optimized: Math.random() * 55 + 115,
            ml: Math.random() * 65 + 125,
          }));
        case 'weekly':
          return [
            { period: 1, historical: 90, forecast: 120, optimized: 115, ml: 125 },
            { period: 2, historical: 95, forecast: 125, optimized: 118, ml: 130 },
            { period: 3, historical: 140, forecast: 210, optimized: 200, ml: 215 },
            { period: 4, historical: 150, forecast: 245, optimized: 235, ml: 250 },
            { period: 5, historical: 160, forecast: 265, optimized: 255, ml: 270 },
            { period: 6, historical: 165, forecast: 280, optimized: 268, ml: 285 },
            { period: 7, historical: 195, forecast: 290, optimized: 280, ml: 295 },
            { period: 8, historical: 130, forecast: 210, optimized: 205, ml: 215 },
            { period: 9, historical: 115, forecast: 160, optimized: 155, ml: 165 },
            { period: 10, historical: 100, forecast: 140, optimized: 135, ml: 145 },
            { period: 11, historical: 5, forecast: 10, optimized: 8, ml: 12 },
            { period: 12, historical: 3, forecast: 5, optimized: 4, ml: 6 },
          ];
        case 'monthly':
          return [
            { period: 1, historical: 380, forecast: 520, optimized: 495, ml: 545 },
            { period: 2, historical: 420, forecast: 580, optimized: 550, ml: 605 },
            { period: 3, historical: 460, forecast: 640, optimized: 610, ml: 665 },
          ];
        case 'quarterly':
          return [
            { period: 1, historical: 1260, forecast: 1740, optimized: 1655, ml: 1815 },
          ];
        default:
          return [];
      }
    };

    const data = generateData();
    
    // Get period label
    const getPeriodLabel = (period: number) => {
      switch (currentGranularity) {
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

    const maxY = d3.max(data, d => Math.max(d.historical, d.forecast, d.optimized, d.ml)) || 400;
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
    const xTickValues = currentGranularity === 'daily' 
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
    const line = (key: 'historical' | 'forecast' | 'optimized' | 'ml') => 
      d3.line<typeof data[0]>()
        .x(d => xScale(d.period))
        .y(d => yScale(d[key]))
        .curve(d3.curveMonotoneX);

    // Define line colors (matching the screenshot)
    const lineStyles = [
      { key: 'ml' as const, color: '#90EE90', width: 2.5 },
      { key: 'optimized' as const, color: '#98D8C8', width: 2.5 },
      { key: 'historical' as const, color: '#228B22', width: 2.5 },
      { key: 'forecast' as const, color: '#4682B4', width: 2.5 },
    ];

    // Draw lines
    lineStyles.forEach(({ key, color, width }) => {
      chartGroup.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr('d', line(key));

      // Add dots with hover tooltip
      chartGroup.selectAll(`.dot-${key}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `dot-${key}`)
        .attr('cx', d => xScale(d.period))
        .attr('cy', d => yScale(d[key]))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', 'white')
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
                    <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
                    <span class="capitalize">${key}:</span>
                    <span class="font-semibold">${d[key].toFixed(1)}</span>
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
    });

  }, [granularity, valueMode, classFilter, locationFilter, currentGranularity]);

  const handleZoomIn = () => {
    const levels: GranularityLevel[] = ['quarterly', 'monthly', 'weekly', 'daily'];
    const currentIndex = levels.indexOf(currentGranularity);
    if (currentIndex < levels.length - 1) {
      setCurrentGranularity(levels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const levels: GranularityLevel[] = ['quarterly', 'monthly', 'weekly', 'daily'];
    const currentIndex = levels.indexOf(currentGranularity);
    if (currentIndex > 0) {
      setCurrentGranularity(levels[currentIndex - 1]);
    }
  };

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleZoomOut}
          disabled={currentGranularity === 'quarterly'}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium px-2 capitalize">{currentGranularity}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleZoomIn}
          disabled={currentGranularity === 'daily'}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef}></svg>
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
