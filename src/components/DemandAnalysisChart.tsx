import React, { useEffect, useRef, useState } from 'react';
import { D3LineChart } from './D3LineChart';
import { getChartMultiplier } from '@/lib/storeMetrics';

interface DemandAnalysisChartProps {
  granularity: 'weekly' | 'monthly' | 'quarterly';
  valueMode: 'value' | 'volume';
  classFilter: string;
  locationFilter: string;
  chartGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  storeFilter?: string;
}

export const DemandAnalysisChart = ({ granularity, valueMode, classFilter, locationFilter, chartGranularity, storeFilter = 'all' }: DemandAnalysisChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const data = React.useMemo(() => {
    const storeMultiplier = getChartMultiplier(storeFilter);

    switch (chartGranularity) {
      case 'daily':
        const dailyData = [];
        for (let i = 1; i <= 455; i++) {
          const trendBase = (80 + (i * 0.15)) * storeMultiplier;
          const seasonality = Math.sin(i / 30) * 8 * storeMultiplier;
          const noise = (Math.random() - 0.5) * 6;
          
          const periodLabel = i <= 365 ? `Day ${i}` : `Day ${i} (F)`;
          
          if (i <= 365) {
            dailyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null });
          } else if (i === 366) {
            const lastValue = trendBase + seasonality + noise;
            dailyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue });
          } else {
            dailyData.push({ period: i, periodLabel, historical: null, baseline: trendBase + seasonality + (Math.random() - 0.5) * 4, enhanced: trendBase + seasonality + 5 + (Math.random() - 0.5) * 4 });
          }
        }
        return dailyData;
      
      case 'weekly':
        const weeklyData = [];
        for (let i = 1; i <= 65; i++) {
          const trendBase = (85 + (i * 1.2)) * storeMultiplier;
          const seasonality = Math.sin(i / 8) * 12 * storeMultiplier;
          const noise = (Math.random() - 0.5) * 8;
          
          const periodLabel = i <= 52 ? `W${i}` : `W${i} (F)`;
          
          if (i <= 52) {
            weeklyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null });
          } else if (i === 53) {
            const lastValue = trendBase + seasonality + noise;
            weeklyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue });
          } else {
            weeklyData.push({ period: i, periodLabel, historical: null, baseline: trendBase + seasonality + (Math.random() - 0.5) * 6, enhanced: trendBase + seasonality + 8 + (Math.random() - 0.5) * 6 });
          }
        }
        return weeklyData;
      
      case 'monthly':
        const monthlyData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 1; i <= 15; i++) {
          const trendBase = (90 + (i * 4)) * storeMultiplier;
          const seasonality = Math.sin(i / 3) * 15 * storeMultiplier;
          const noise = (Math.random() - 0.5) * 10;
          
          const periodLabel = i <= 12 ? monthNames[i - 1] : `${monthNames[(i - 1) % 12]} (F)`;
          
          if (i <= 12) {
            monthlyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null });
          } else if (i === 13) {
            const lastValue = trendBase + seasonality + noise;
            monthlyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue });
          } else {
            monthlyData.push({ period: i, periodLabel, historical: null, baseline: trendBase + seasonality + (Math.random() - 0.5) * 8, enhanced: trendBase + seasonality + 12 + (Math.random() - 0.5) * 8 });
          }
        }
        return monthlyData;
      
      case 'quarterly':
        const quarterlyData = [];
        for (let i = 1; i <= 6; i++) {
          const trendBase = (95 + (i * 12)) * storeMultiplier;
          const seasonality = Math.sin(i / 1.5) * 20 * storeMultiplier;
          const noise = (Math.random() - 0.5) * 12;
          
          const periodLabel = i <= 4 ? `Q${i}` : `Q${i - 4} (F)`;
          
          if (i <= 4) {
            quarterlyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null });
          } else if (i === 5) {
            const lastValue = trendBase + seasonality + noise;
            quarterlyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue });
          } else {
            quarterlyData.push({ period: i, periodLabel, historical: null, baseline: trendBase + seasonality + (Math.random() - 0.5) * 10, enhanced: trendBase + seasonality + 15 + (Math.random() - 0.5) * 10 });
          }
        }
        return quarterlyData;
      
      default:
        return [];
    }
  }, [chartGranularity, storeFilter]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '320px' }}>
      {renderWidth > 0 && (
        <D3LineChart 
          data={data}
          width={renderWidth}
          height={320}
          showLegend={true}
          baselineLabel="Baseline Forecast"
          enhancedLabel="Enhanced Forecast"
        />
      )}
    </div>
  );
};
