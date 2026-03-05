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
  showRangeForecast?: boolean;
  channelFilter?: string;
}

// Proxy SKU mapping for NPI forecasting - Consumer Electronics
export const npiProxyMapping: Record<string, { proxySku: string; proxyName: string; npiName: string }> = {
  'NEW-TWS-001': { proxySku: 'SKU_001', proxyName: 'Airdopes 601 (Earbuds)', npiName: 'Airdopes Prime 701 ANC' },
  'NEW-HP-002': { proxySku: 'SKU_021', proxyName: 'Rockerz 550 (Headphones)', npiName: 'Rockerz 650 Pro ANC' },
  'NEW-SPK-003': { proxySku: 'SKU_029', proxyName: 'PartyPal 300 (Speakers)', npiName: 'PartyPal 500 Speaker' },
  'RE-NB-004': { proxySku: 'SKU_005', proxyName: 'Rockerz 255 v2 (Earbuds)', npiName: 'Rockerz 255 v3 (Re-entry)' },
  'BDL-GM-005': { proxySku: 'SKU_018', proxyName: 'Immortal 121 (Earbuds)', npiName: 'Immortal 350 Gaming TWS' },
};

export const DemandAnalysisChart = ({ granularity, valueMode, classFilter, locationFilter, chartGranularity, storeFilter = 'all', npiSku = 'none', showRangeForecast = false, channelFilter = 'all' }: DemandAnalysisChartProps) => {
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

  const isNpiMode = npiSku !== 'none' && !!npiProxyMapping[npiSku];
  const npiInfo = isNpiMode ? npiProxyMapping[npiSku] : null;

  const data = React.useMemo(() => {
    const storeMultiplier = getChartMultiplier(storeFilter);
    // Channel filter adjusts demand levels
    const channelMultiplier = channelFilter === 'all' ? 1.0 
      : channelFilter === 'amazon' ? 0.35 
      : channelFilter === 'flipkart' ? 0.25 
      : channelFilter === 'd2c' ? 0.15 
      : channelFilter === 'retail' ? 0.15 
      : channelFilter === 'distributor' ? 0.10 
      : 1.0;
    const totalMultiplier = storeMultiplier * channelMultiplier;
    
    // Helper to calculate range bounds (10-15% variance for range forecast)
    const getRangeBounds = (value: number) => {
      const variance = value * (0.10 + Math.random() * 0.05);
      return { upper: value + variance, lower: value - variance };
    };

    // NPI Mode: Show proxy SKU history (W5-W35), NPI history (W36-W52), forecast (W53+)
    if (isNpiMode && npiInfo) {
      const weeklyNpiData = [];
      for (let i = 1; i <= 65; i++) {
        const proxyTrendBase = (82 + (i * 1.1)) * totalMultiplier;
        const npiTrendBase = (78 + (i * 1.3)) * totalMultiplier;
        const seasonality = Math.sin(i / 8) * 10 * totalMultiplier;
        const noise = (Math.random() - 0.5) * 6;
        
        let periodLabel = `W${i}`;
        if (i > 52) periodLabel = `W${i} (F)`;

        if (i >= 5 && i <= 35) {
          // Proxy SKU history (W5-W35)
          weeklyNpiData.push({ 
            period: i, 
            periodLabel,
            skuName: npiInfo.proxyName,
            isProxy: true,
            historical: proxyTrendBase + seasonality + noise, 
            baseline: null, 
            enhanced: null,
            baselineUpper: null,
            baselineLower: null,
            enhancedUpper: null,
            enhancedLower: null
          });
        } else if (i >= 36 && i <= 52) {
          // NPI SKU history (W36-W52)
          weeklyNpiData.push({ 
            period: i, 
            periodLabel,
            skuName: npiInfo.npiName,
            isProxy: false,
            historical: npiTrendBase + seasonality + noise * 1.2, 
            baseline: null, 
            enhanced: null,
            baselineUpper: null,
            baselineLower: null,
            enhancedUpper: null,
            enhancedLower: null
          });
        } else if (i === 53) {
          // Transition point
          const lastValue = npiTrendBase + seasonality + noise;
          const baselineRange = getRangeBounds(lastValue);
          const enhancedRange = getRangeBounds(lastValue);
          weeklyNpiData.push({ 
            period: i, 
            periodLabel,
            skuName: npiInfo.npiName,
            isProxy: false,
            historical: null, 
            baseline: lastValue, 
            enhanced: lastValue,
            baselineUpper: baselineRange.upper,
            baselineLower: baselineRange.lower,
            enhancedUpper: enhancedRange.upper,
            enhancedLower: enhancedRange.lower
          });
        } else if (i > 53) {
          // Forecast period
          const baselineVal = npiTrendBase + seasonality + (Math.random() - 0.5) * 5;
          const enhancedVal = npiTrendBase + seasonality + 10 + (Math.random() - 0.5) * 5;
          const baselineRange = getRangeBounds(baselineVal);
          const enhancedRange = getRangeBounds(enhancedVal);
          weeklyNpiData.push({ 
            period: i, 
            periodLabel,
            skuName: npiInfo.npiName,
            isProxy: false,
            historical: null, 
            baseline: baselineVal, 
            enhanced: enhancedVal,
            baselineUpper: baselineRange.upper,
            baselineLower: baselineRange.lower,
            enhancedUpper: enhancedRange.upper,
            enhancedLower: enhancedRange.lower
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
            dailyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null, baselineUpper: null, baselineLower: null, enhancedUpper: null, enhancedLower: null });
          } else if (i === 366) {
            const lastValue = trendBase + seasonality + noise;
            const baselineRange = getRangeBounds(lastValue);
            const enhancedRange = getRangeBounds(lastValue);
            dailyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
          } else {
            const baselineVal = trendBase + seasonality + (Math.random() - 0.5) * 4;
            const enhancedVal = trendBase + seasonality + 5 + (Math.random() - 0.5) * 4;
            const baselineRange = getRangeBounds(baselineVal);
            const enhancedRange = getRangeBounds(enhancedVal);
            dailyData.push({ period: i, periodLabel, historical: null, baseline: baselineVal, enhanced: enhancedVal, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
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
            weeklyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null, baselineUpper: null, baselineLower: null, enhancedUpper: null, enhancedLower: null });
          } else if (i === 53) {
            const lastValue = trendBase + seasonality + noise;
            const baselineRange = getRangeBounds(lastValue);
            const enhancedRange = getRangeBounds(lastValue);
            weeklyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
          } else {
            const baselineVal = trendBase + seasonality + (Math.random() - 0.5) * 6;
            const enhancedVal = trendBase + seasonality + 8 + (Math.random() - 0.5) * 6;
            const baselineRange = getRangeBounds(baselineVal);
            const enhancedRange = getRangeBounds(enhancedVal);
            weeklyData.push({ period: i, periodLabel, historical: null, baseline: baselineVal, enhanced: enhancedVal, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
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
            monthlyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null, baselineUpper: null, baselineLower: null, enhancedUpper: null, enhancedLower: null });
          } else if (i === 13) {
            const lastValue = trendBase + seasonality + noise;
            const baselineRange = getRangeBounds(lastValue);
            const enhancedRange = getRangeBounds(lastValue);
            monthlyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
          } else {
            const baselineVal = trendBase + seasonality + (Math.random() - 0.5) * 8;
            const enhancedVal = trendBase + seasonality + 12 + (Math.random() - 0.5) * 8;
            const baselineRange = getRangeBounds(baselineVal);
            const enhancedRange = getRangeBounds(enhancedVal);
            monthlyData.push({ period: i, periodLabel, historical: null, baseline: baselineVal, enhanced: enhancedVal, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
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
            quarterlyData.push({ period: i, periodLabel, historical: trendBase + seasonality + noise, baseline: null, enhanced: null, baselineUpper: null, baselineLower: null, enhancedUpper: null, enhancedLower: null });
          } else if (i === 5) {
            const lastValue = trendBase + seasonality + noise;
            const baselineRange = getRangeBounds(lastValue);
            const enhancedRange = getRangeBounds(lastValue);
            quarterlyData.push({ period: i, periodLabel, historical: null, baseline: lastValue, enhanced: lastValue, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
          } else {
            const baselineVal = trendBase + seasonality + (Math.random() - 0.5) * 10;
            const enhancedVal = trendBase + seasonality + 15 + (Math.random() - 0.5) * 10;
            const baselineRange = getRangeBounds(baselineVal);
            const enhancedRange = getRangeBounds(enhancedVal);
            quarterlyData.push({ period: i, periodLabel, historical: null, baseline: baselineVal, enhanced: enhancedVal, baselineUpper: baselineRange.upper, baselineLower: baselineRange.lower, enhancedUpper: enhancedRange.upper, enhancedLower: enhancedRange.lower });
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
        <div className="mb-2 px-3 py-1.5 bg-muted border border-border rounded-md text-[11px] inline-flex items-center gap-1.5">
          <span className="font-medium text-foreground">NPI:</span>
          <span className="text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">W5-W35: {npiInfo.proxyName}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-blue-900 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">W36-W52: {npiInfo.npiName}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">W53+: Forecast</span>
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
          yAxisLabel="Volume"
          isNpiMode={isNpiMode}
          showRangeForecast={showRangeForecast}
        />
      )}
    </div>
  );
};
