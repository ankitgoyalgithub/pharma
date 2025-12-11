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
  npiSku?: string;
}

// Proxy SKU mapping for NPI forecasting
const npiProxyMapping: Record<string, { proxySku: string; proxyName: string; npiName: string }> = {
  'NPI001': { proxySku: 'SKU006', proxyName: 'Splash Core Chinos', npiName: 'Lee Cooper SS25 Cargo Pants' },
  'NPI002': { proxySku: 'SKU007', proxyName: 'Lee Cooper Denim Jacket', npiName: 'Kappa Retro Bomber Jacket' },
  'NPI003': { proxySku: 'SKU003', proxyName: 'Elle Floral Maxi Dress', npiName: 'Elle Summer Midi Skirt' },
  'NPI004': { proxySku: 'SKU004', proxyName: 'Smiley Graphic Hoodie', npiName: 'Smiley Collab Oversized Tee' },
  'NPI005': { proxySku: 'SKU005', proxyName: 'ICONIC Formal Blazer', npiName: 'ICONIC Wool Blend Coat' },
  'NPI006': { proxySku: 'SKU006', proxyName: 'Splash Core Chinos', npiName: 'Splash Core Linen Shorts' },
  'NPI007': { proxySku: 'SKU001', proxyName: 'Lee Cooper Slim Fit Jeans', npiName: 'Lee Cooper Vintage Wash Jeans' },
  'NPI008': { proxySku: 'SKU008', proxyName: 'Kappa Track Pants', npiName: 'Kappa Performance Joggers' },
  'NPI009': { proxySku: 'SKU009', proxyName: 'Elle Silk Blouse', npiName: 'Elle Embroidered Kaftan' },
  'NPI010': { proxySku: 'SKU005', proxyName: 'ICONIC Formal Blazer', npiName: 'ICONIC Relaxed Fit Trousers' },
};

export const DemandAnalysisChart = ({ granularity, valueMode, classFilter, locationFilter, chartGranularity, storeFilter = 'all', npiSku = 'none' }: DemandAnalysisChartProps) => {
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

  const isNpiMode = npiSku !== 'none' && npiProxyMapping[npiSku];
  const npiInfo = isNpiMode ? npiProxyMapping[npiSku] : null;

  const data = React.useMemo(() => {
    const storeMultiplier = getChartMultiplier(storeFilter);

    // NPI Mode: Show proxy SKU history (W5-W35), NPI history (W36-W52), forecast (W53+)
    if (isNpiMode) {
      const weeklyNpiData = [];
      for (let i = 1; i <= 65; i++) {
        const proxyTrendBase = (82 + (i * 1.1)) * storeMultiplier;
        const npiTrendBase = (78 + (i * 1.3)) * storeMultiplier;
        const seasonality = Math.sin(i / 8) * 10 * storeMultiplier;
        const noise = (Math.random() - 0.5) * 6;
        
        let periodLabel = `W${i}`;
        if (i > 52) periodLabel = `W${i} (F)`;

        if (i >= 5 && i <= 35) {
          // Proxy SKU history (W5-W35)
          weeklyNpiData.push({ 
            period: i, 
            periodLabel, 
            historical: proxyTrendBase + seasonality + noise, 
            baseline: null, 
            enhanced: null 
          });
        } else if (i >= 36 && i <= 52) {
          // NPI SKU history (W36-W52)
          weeklyNpiData.push({ 
            period: i, 
            periodLabel, 
            historical: npiTrendBase + seasonality + noise * 1.2, 
            baseline: null, 
            enhanced: null 
          });
        } else if (i === 53) {
          // Transition point
          const lastValue = npiTrendBase + seasonality + noise;
          weeklyNpiData.push({ 
            period: i, 
            periodLabel, 
            historical: null, 
            baseline: lastValue, 
            enhanced: lastValue 
          });
        } else if (i > 53) {
          // Forecast period
          weeklyNpiData.push({ 
            period: i, 
            periodLabel, 
            historical: null, 
            baseline: npiTrendBase + seasonality + (Math.random() - 0.5) * 5, 
            enhanced: npiTrendBase + seasonality + 10 + (Math.random() - 0.5) * 5 
          });
        }
      }
      return weeklyNpiData.filter(d => d.period >= 5);
    }

    // Standard mode
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
  }, [chartGranularity, storeFilter, npiSku, isNpiMode]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '320px' }}>
      {isNpiMode && npiInfo && (
        <div className="mb-2 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary flex items-center gap-2">
          <span className="font-medium">NPI Mode:</span>
          <span>W5-W35: {npiInfo.proxyName} (Proxy)</span>
          <span className="text-muted-foreground">→</span>
          <span>W36-W52: {npiInfo.npiName} (NPI History)</span>
          <span className="text-muted-foreground">→</span>
          <span>W53+: Forecast</span>
        </div>
      )}
      {renderWidth > 0 && (
        <D3LineChart 
          data={data}
          width={renderWidth}
          height={isNpiMode ? 290 : 320}
          showLegend={true}
          baselineLabel="Baseline Forecast"
          enhancedLabel="Enhanced Forecast"
        />
      )}
    </div>
  );
};
