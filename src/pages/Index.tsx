import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, ChevronUp, BarChart3, TrendingUp, Package, MapPin, ShoppingCart, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { skuData } from '@/data/demandForecasting/skuData';
import { workbookData } from '@/data/demandForecasting/workbookData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Analytical questions organized by category
const analyticalQuestions = {
  "SKU Performance": [
    "Which SKU has the highest forecast accuracy?",
    "Which SKU has the lowest forecast accuracy?",
    "Show me top 5 SKUs by revenue",
    "Which SKUs are underperforming vs forecast?",
    "Which SKUs are overperforming vs forecast?",
  ],
  "Regional Analysis": [
    "Which region has the best sales performance?",
    "Compare NCR vs West distribution centers",
    "Which location has highest forecast variance?",
    "Show regional revenue breakdown",
  ],
  "Channel Insights": [
    "Which channel generates maximum revenue?",
    "Compare Retail vs Hospital pharmacy performance",
    "E-Pharmacy growth analysis",
    "Government tender performance",
  ],
  "Forecast Analysis": [
    "What is the overall forecast accuracy?",
    "Show forecast vs actual comparison",
    "Which products need forecast adjustment?",
    "Identify products with negative variance",
  ],
  "Trend Analysis": [
    "Show weekly sales trend",
    "Which week had highest sales?",
    "Seasonal demand patterns",
    "Week-over-week growth analysis",
  ],
};

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  chart?: {
    type: 'bar' | 'pie' | 'line';
    data: any;
    options?: any;
  };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { size: 10 }, boxWidth: 12 }
    },
    tooltip: {
      animation: false,
    }
  },
  scales: {
    x: { ticks: { font: { size: 9 } } },
    y: { ticks: { font: { size: 9 } } }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { size: 10 }, boxWidth: 12 }
    },
    tooltip: {
      animation: false,
    }
  }
};

const parseRevenue = (rev: string): number => {
  const num = parseFloat(rev.replace('₹', '').replace('M', ''));
  return num;
};

const generateResponse = (query: string): { text: string; chart?: Message['chart'] } => {
  const lowerQuery = query.toLowerCase();
  
  // SKU Performance queries
  if (lowerQuery.includes('highest') && lowerQuery.includes('accuracy')) {
    const sorted = [...skuData].sort((a, b) => parseInt(b.accuracy) - parseInt(a.accuracy));
    const top = sorted[0];
    return {
      text: `**${top.product}** (${top.sku}) has the highest forecast accuracy at **${top.accuracy}**.\n\nLocation: ${top.location}\nChannel: ${top.channel}\nForecasted: ${top.forecasted} | Actual: ${top.actual}`,
      chart: {
        type: 'bar',
        data: {
          labels: sorted.slice(0, 5).map(s => s.sku),
          datasets: [{
            label: 'Accuracy %',
            data: sorted.slice(0, 5).map(s => parseInt(s.accuracy)),
            backgroundColor: ['hsl(142, 76%, 36%)', 'hsl(142, 70%, 45%)', 'hsl(142, 65%, 50%)', 'hsl(142, 60%, 55%)', 'hsl(142, 55%, 60%)'],
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('lowest') && lowerQuery.includes('accuracy')) {
    const sorted = [...skuData].sort((a, b) => parseInt(a.accuracy) - parseInt(b.accuracy));
    const bottom = sorted[0];
    return {
      text: `**${bottom.product}** (${bottom.sku}) has the lowest forecast accuracy at **${bottom.accuracy}**.\n\nThis SKU needs attention for forecast model recalibration.\nVariance: ${bottom.variance}`,
      chart: {
        type: 'bar',
        data: {
          labels: sorted.slice(0, 5).map(s => s.sku),
          datasets: [{
            label: 'Accuracy %',
            data: sorted.slice(0, 5).map(s => parseInt(s.accuracy)),
            backgroundColor: ['hsl(0, 84%, 60%)', 'hsl(25, 95%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(142, 60%, 50%)', 'hsl(142, 70%, 45%)'],
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('top') && lowerQuery.includes('sku') && lowerQuery.includes('revenue')) {
    const sorted = [...skuData].sort((a, b) => parseRevenue(b.actual) - parseRevenue(a.actual));
    return {
      text: `**Top 5 SKUs by Revenue:**\n\n${sorted.slice(0, 5).map((s, i) => `${i + 1}. **${s.product}** - ${s.actual}`).join('\n')}`,
      chart: {
        type: 'bar',
        data: {
          labels: sorted.slice(0, 5).map(s => s.sku),
          datasets: [{
            label: 'Revenue (₹M)',
            data: sorted.slice(0, 5).map(s => parseRevenue(s.actual)),
            backgroundColor: 'hsl(225, 84%, 55%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('underperforming')) {
    const underperformers = skuData.filter(s => s.variance.startsWith('-'));
    return {
      text: `**Underperforming SKUs (Actual < Forecast):**\n\n${underperformers.map(s => `• **${s.sku}**: ${s.product} (${s.variance})`).join('\n')}\n\nThese products need demand driver analysis.`,
      chart: {
        type: 'bar',
        data: {
          labels: underperformers.map(s => s.sku),
          datasets: [{
            label: 'Variance %',
            data: underperformers.map(s => parseFloat(s.variance)),
            backgroundColor: 'hsl(0, 84%, 60%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('overperforming')) {
    const overperformers = skuData.filter(s => s.variance.startsWith('+'));
    return {
      text: `**Overperforming SKUs (Actual > Forecast):**\n\n${overperformers.map(s => `• **${s.sku}**: ${s.product} (${s.variance})`).join('\n')}\n\nThese show higher-than-expected demand.`,
      chart: {
        type: 'bar',
        data: {
          labels: overperformers.map(s => s.sku),
          datasets: [{
            label: 'Variance %',
            data: overperformers.map(s => parseFloat(s.variance)),
            backgroundColor: 'hsl(142, 76%, 36%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  // Regional Analysis
  if (lowerQuery.includes('region') && (lowerQuery.includes('best') || lowerQuery.includes('performance'))) {
    const regionData: Record<string, number> = {};
    skuData.forEach(s => {
      const region = s.location.split(' ')[0];
      regionData[region] = (regionData[region] || 0) + parseRevenue(s.actual);
    });
    const sorted = Object.entries(regionData).sort((a, b) => b[1] - a[1]);
    return {
      text: `**Regional Performance Ranking:**\n\n${sorted.map(([r, v], i) => `${i + 1}. **${r}**: ₹${v.toFixed(1)}M`).join('\n')}\n\n**${sorted[0][0]}** leads with highest actual revenue.`,
      chart: {
        type: 'pie',
        data: {
          labels: sorted.map(([r]) => r),
          datasets: [{
            data: sorted.map(([, v]) => v),
            backgroundColor: ['hsl(225, 84%, 55%)', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 47%)', 'hsl(280, 65%, 55%)'],
          }]
        },
        options: pieOptions
      }
    };
  }
  
  if (lowerQuery.includes('ncr') && lowerQuery.includes('west')) {
    const ncrData = skuData.filter(s => s.location.includes('NCR'));
    const westData = skuData.filter(s => s.location.includes('West'));
    const ncrTotal = ncrData.reduce((sum, s) => sum + parseRevenue(s.actual), 0);
    const westTotal = westData.reduce((sum, s) => sum + parseRevenue(s.actual), 0);
    return {
      text: `**NCR vs West Distribution Center:**\n\n• **NCR**: ₹${ncrTotal.toFixed(1)}M (${ncrData.length} SKUs)\n• **West**: ₹${westTotal.toFixed(1)}M (${westData.length} SKUs)\n\n${ncrTotal > westTotal ? 'NCR' : 'West'} has higher revenue.`,
      chart: {
        type: 'bar',
        data: {
          labels: ['NCR', 'West'],
          datasets: [{
            label: 'Revenue (₹M)',
            data: [ncrTotal, westTotal],
            backgroundColor: ['hsl(225, 84%, 55%)', 'hsl(280, 65%, 55%)'],
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('location') && lowerQuery.includes('variance')) {
    const locationVariance: Record<string, { total: number; count: number }> = {};
    skuData.forEach(s => {
      const loc = s.location;
      if (!locationVariance[loc]) locationVariance[loc] = { total: 0, count: 0 };
      locationVariance[loc].total += Math.abs(parseFloat(s.variance));
      locationVariance[loc].count++;
    });
    const sorted = Object.entries(locationVariance)
      .map(([loc, data]) => ({ loc, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg);
    return {
      text: `**Locations by Forecast Variance:**\n\n${sorted.map((s, i) => `${i + 1}. **${s.loc}**: ${s.avg.toFixed(1)}% avg variance`).join('\n')}\n\n${sorted[0].loc} needs attention.`,
      chart: {
        type: 'bar',
        data: {
          labels: sorted.map(s => s.loc.split(' ').slice(0, 2).join(' ')),
          datasets: [{
            label: 'Avg Variance %',
            data: sorted.map(s => s.avg),
            backgroundColor: 'hsl(45, 93%, 47%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('regional') && lowerQuery.includes('breakdown')) {
    const regionData: Record<string, number> = {};
    skuData.forEach(s => {
      const region = s.location;
      regionData[region] = (regionData[region] || 0) + parseRevenue(s.actual);
    });
    return {
      text: `**Regional Revenue Breakdown:**\n\n${Object.entries(regionData).map(([r, v]) => `• **${r}**: ₹${v.toFixed(1)}M`).join('\n')}`,
      chart: {
        type: 'pie',
        data: {
          labels: Object.keys(regionData).map(r => r.split(' ').slice(0, 2).join(' ')),
          datasets: [{
            data: Object.values(regionData),
            backgroundColor: ['hsl(225, 84%, 55%)', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 47%)', 'hsl(280, 65%, 55%)', 'hsl(0, 84%, 60%)'],
          }]
        },
        options: pieOptions
      }
    };
  }
  
  // Channel Insights
  if (lowerQuery.includes('channel') && (lowerQuery.includes('maximum') || lowerQuery.includes('revenue'))) {
    const channelData: Record<string, number> = {};
    skuData.forEach(s => {
      channelData[s.channel] = (channelData[s.channel] || 0) + parseRevenue(s.actual);
    });
    const sorted = Object.entries(channelData).sort((a, b) => b[1] - a[1]);
    return {
      text: `**Channel Revenue Ranking:**\n\n${sorted.map(([c, v], i) => `${i + 1}. **${c}**: ₹${v.toFixed(1)}M`).join('\n')}\n\n**${sorted[0][0]}** generates maximum revenue.`,
      chart: {
        type: 'pie',
        data: {
          labels: sorted.map(([c]) => c),
          datasets: [{
            data: sorted.map(([, v]) => v),
            backgroundColor: ['hsl(225, 84%, 55%)', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 47%)', 'hsl(280, 65%, 55%)', 'hsl(0, 84%, 60%)'],
          }]
        },
        options: pieOptions
      }
    };
  }
  
  if (lowerQuery.includes('retail') && lowerQuery.includes('hospital')) {
    const retailData = skuData.filter(s => s.channel.includes('Retail'));
    const hospitalData = skuData.filter(s => s.channel.includes('Hospital'));
    const retailTotal = retailData.reduce((sum, s) => sum + parseRevenue(s.actual), 0);
    const hospitalTotal = hospitalData.reduce((sum, s) => sum + parseRevenue(s.actual), 0);
    return {
      text: `**Retail vs Hospital Pharmacy:**\n\n• **Retail Pharmacy**: ₹${retailTotal.toFixed(1)}M (${retailData.length} SKUs)\n• **Hospital Pharmacy**: ₹${hospitalTotal.toFixed(1)}M (${hospitalData.length} SKUs)\n\n${retailTotal > hospitalTotal ? 'Retail' : 'Hospital'} channel dominates.`,
      chart: {
        type: 'bar',
        data: {
          labels: ['Retail Pharmacy', 'Hospital Pharmacy'],
          datasets: [{
            label: 'Revenue (₹M)',
            data: [retailTotal, hospitalTotal],
            backgroundColor: ['hsl(225, 84%, 55%)', 'hsl(142, 76%, 36%)'],
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('e-pharmacy') || lowerQuery.includes('epharmacy')) {
    const ePharmData = skuData.filter(s => s.channel.includes('E-Pharmacy'));
    return {
      text: `**E-Pharmacy Channel Analysis:**\n\n${ePharmData.map(s => `• **${s.product}**\n  Revenue: ${s.actual} | Accuracy: ${s.accuracy}`).join('\n')}\n\nE-Pharmacy showing ${ePharmData[0]?.variance.startsWith('+') ? 'growth' : 'adjustment needed'}.`,
      chart: {
        type: 'bar',
        data: {
          labels: ePharmData.map(s => s.sku),
          datasets: [{
            label: 'Revenue (₹M)',
            data: ePharmData.map(s => parseRevenue(s.actual)),
            backgroundColor: 'hsl(280, 65%, 55%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('government') || lowerQuery.includes('tender')) {
    const govData = skuData.filter(s => s.channel.includes('Government'));
    return {
      text: `**Government Tender Performance:**\n\n${govData.map(s => `• **${s.product}**\n  Revenue: ${s.actual} | Variance: ${s.variance}`).join('\n')}\n\nTender channel requires careful demand planning.`,
      chart: {
        type: 'bar',
        data: {
          labels: govData.map(s => s.sku),
          datasets: [
            { label: 'Forecasted', data: govData.map(s => parseRevenue(s.forecasted)), backgroundColor: 'hsl(225, 84%, 55%)' },
            { label: 'Actual', data: govData.map(s => parseRevenue(s.actual)), backgroundColor: 'hsl(142, 76%, 36%)' }
          ]
        },
        options: chartOptions
      }
    };
  }
  
  // Forecast Analysis
  if (lowerQuery.includes('overall') && lowerQuery.includes('accuracy')) {
    const avgAccuracy = skuData.reduce((sum, s) => sum + parseInt(s.accuracy), 0) / skuData.length;
    return {
      text: `**Overall Forecast Accuracy: ${avgAccuracy.toFixed(1)}%**\n\n• Highest: ${Math.max(...skuData.map(s => parseInt(s.accuracy)))}%\n• Lowest: ${Math.min(...skuData.map(s => parseInt(s.accuracy)))}%\n\nTarget: 95% | Status: ${avgAccuracy >= 95 ? '✅ On Target' : '⚠️ Needs Improvement'}`,
      chart: {
        type: 'bar',
        data: {
          labels: skuData.map(s => s.sku),
          datasets: [{
            label: 'Accuracy %',
            data: skuData.map(s => parseInt(s.accuracy)),
            backgroundColor: skuData.map(s => parseInt(s.accuracy) >= 95 ? 'hsl(142, 76%, 36%)' : 'hsl(45, 93%, 47%)'),
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('forecast') && lowerQuery.includes('actual') && lowerQuery.includes('comparison')) {
    return {
      text: `**Forecast vs Actual Comparison:**\n\n${skuData.map(s => `• **${s.sku}**: Forecast ${s.forecasted} → Actual ${s.actual} (${s.variance})`).join('\n')}`,
      chart: {
        type: 'bar',
        data: {
          labels: skuData.map(s => s.sku),
          datasets: [
            { label: 'Forecasted', data: skuData.map(s => parseRevenue(s.forecasted)), backgroundColor: 'hsl(225, 84%, 55%)' },
            { label: 'Actual', data: skuData.map(s => parseRevenue(s.actual)), backgroundColor: 'hsl(142, 76%, 36%)' }
          ]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('need') && lowerQuery.includes('adjustment')) {
    const needsAdjustment = skuData.filter(s => Math.abs(parseFloat(s.variance)) > 5);
    return {
      text: `**Products Needing Forecast Adjustment (>5% variance):**\n\n${needsAdjustment.map(s => `• **${s.product}** (${s.sku})\n  Variance: ${s.variance} | Current Accuracy: ${s.accuracy}`).join('\n')}\n\n${needsAdjustment.length} products flagged for recalibration.`,
      chart: {
        type: 'bar',
        data: {
          labels: needsAdjustment.map(s => s.sku),
          datasets: [{
            label: 'Variance %',
            data: needsAdjustment.map(s => parseFloat(s.variance)),
            backgroundColor: needsAdjustment.map(s => parseFloat(s.variance) < 0 ? 'hsl(0, 84%, 60%)' : 'hsl(142, 76%, 36%)'),
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('negative') && lowerQuery.includes('variance')) {
    const negativeVariance = skuData.filter(s => s.variance.startsWith('-'));
    return {
      text: `**Products with Negative Variance:**\n\n${negativeVariance.map(s => `• **${s.product}** (${s.sku}): ${s.variance}`).join('\n')}\n\nThese products underperformed vs forecast - investigate demand drivers.`,
      chart: {
        type: 'bar',
        data: {
          labels: negativeVariance.map(s => s.sku),
          datasets: [{
            label: 'Variance %',
            data: negativeVariance.map(s => parseFloat(s.variance)),
            backgroundColor: 'hsl(0, 84%, 60%)',
          }]
        },
        options: chartOptions
      }
    };
  }
  
  // Trend Analysis
  if (lowerQuery.includes('weekly') && lowerQuery.includes('trend')) {
    const weeklyTotals = {
      week1: workbookData.reduce((sum, d) => sum + d.week1, 0),
      week2: workbookData.reduce((sum, d) => sum + d.week2, 0),
      week3: workbookData.reduce((sum, d) => sum + d.week3, 0),
    };
    return {
      text: `**Weekly Sales Trend:**\n\n• Week 1: ${weeklyTotals.week1.toLocaleString()} units\n• Week 2: ${weeklyTotals.week2.toLocaleString()} units\n• Week 3: ${weeklyTotals.week3.toLocaleString()} units\n\nTrend: ${weeklyTotals.week3 > weeklyTotals.week1 ? '📈 Growing' : '📉 Declining'}`,
      chart: {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3'],
          datasets: [{
            label: 'Total Units',
            data: [weeklyTotals.week1, weeklyTotals.week2, weeklyTotals.week3],
            borderColor: 'hsl(225, 84%, 55%)',
            backgroundColor: 'hsla(225, 84%, 55%, 0.1)',
            fill: true,
            tension: 0.3,
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('week') && lowerQuery.includes('highest')) {
    const weeklyTotals = {
      'Week 1': workbookData.reduce((sum, d) => sum + d.week1, 0),
      'Week 2': workbookData.reduce((sum, d) => sum + d.week2, 0),
      'Week 3': workbookData.reduce((sum, d) => sum + d.week3, 0),
    };
    const highest = Object.entries(weeklyTotals).sort((a, b) => b[1] - a[1])[0];
    return {
      text: `**${highest[0]}** had the highest sales with **${highest[1].toLocaleString()} units**.\n\nWeekly breakdown:\n${Object.entries(weeklyTotals).map(([w, v]) => `• ${w}: ${v.toLocaleString()} units`).join('\n')}`,
      chart: {
        type: 'bar',
        data: {
          labels: Object.keys(weeklyTotals),
          datasets: [{
            label: 'Total Units',
            data: Object.values(weeklyTotals),
            backgroundColor: Object.keys(weeklyTotals).map(k => k === highest[0] ? 'hsl(142, 76%, 36%)' : 'hsl(225, 84%, 55%)'),
          }]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('seasonal') || lowerQuery.includes('pattern')) {
    return {
      text: `**Seasonal Demand Patterns:**\n\n• **Peak Season**: Monsoon (Jun-Sep) - Respiratory & GI products surge\n• **High Demand**: Winter (Nov-Feb) - Analgesics & Vitamins\n• **Stable Demand**: Chronic therapies (Diabetes, Cardiac)\n\nKey drivers: Weather, disease outbreaks, promotional campaigns.`,
      chart: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Respiratory',
              data: [80, 75, 70, 65, 70, 95, 120, 130, 110, 85, 80, 85],
              borderColor: 'hsl(225, 84%, 55%)',
              tension: 0.3,
            },
            {
              label: 'GI Products',
              data: [60, 55, 60, 70, 85, 110, 130, 125, 100, 70, 60, 55],
              borderColor: 'hsl(142, 76%, 36%)',
              tension: 0.3,
            },
            {
              label: 'Analgesics',
              data: [100, 95, 80, 70, 65, 60, 65, 70, 75, 85, 100, 110],
              borderColor: 'hsl(45, 93%, 47%)',
              tension: 0.3,
            }
          ]
        },
        options: chartOptions
      }
    };
  }
  
  if (lowerQuery.includes('week-over-week') || lowerQuery.includes('wow') || lowerQuery.includes('growth')) {
    const productGrowth = workbookData.map(d => ({
      sku: d.sku,
      product: d.product,
      w1w2: ((d.week2 - d.week1) / d.week1 * 100).toFixed(1),
      w2w3: ((d.week3 - d.week2) / d.week2 * 100).toFixed(1),
    }));
    return {
      text: `**Week-over-Week Growth Analysis:**\n\n${productGrowth.slice(0, 5).map(p => `• **${p.sku}**: W1→W2: ${p.w1w2}% | W2→W3: ${p.w2w3}%`).join('\n')}\n\nTop grower: ${productGrowth.sort((a, b) => parseFloat(b.w2w3) - parseFloat(a.w2w3))[0].product}`,
      chart: {
        type: 'bar',
        data: {
          labels: productGrowth.slice(0, 5).map(p => p.sku),
          datasets: [
            { label: 'W1→W2 %', data: productGrowth.slice(0, 5).map(p => parseFloat(p.w1w2)), backgroundColor: 'hsl(225, 84%, 55%)' },
            { label: 'W2→W3 %', data: productGrowth.slice(0, 5).map(p => parseFloat(p.w2w3)), backgroundColor: 'hsl(142, 76%, 36%)' }
          ]
        },
        options: chartOptions
      }
    };
  }
  
  // Default response
  return {
    text: `I can help you analyze demand forecasting data. Try asking about:\n\n• SKU performance and accuracy\n• Regional revenue breakdown\n• Channel comparison\n• Forecast vs actual analysis\n• Weekly trends and growth\n\nClick on any question from the categories on the left to get started!`
  };
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm SynqAI, your demand forecasting analyst. Ask me about SKU performance, regional trends, channel analysis, or forecast accuracy. You can click on any question from the categories on the left to get started!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("SKU Performance");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.text,
        timestamp: new Date(),
        chart: response.chart,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleQuestionClick = (question: string) => {
    handleSend(question);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SKU Performance": return <Package className="w-4 h-4" />;
      case "Regional Analysis": return <MapPin className="w-4 h-4" />;
      case "Channel Insights": return <ShoppingCart className="w-4 h-4" />;
      case "Forecast Analysis": return <BarChart3 className="w-4 h-4" />;
      case "Trend Analysis": return <TrendingUp className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Questions */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">SynqAI</h1>
              <p className="text-xs text-muted-foreground">Demand Forecasting Analyst</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-3">
              Click a question to analyze
            </p>
            {Object.entries(analyticalQuestions).map(([category, questions]) => (
              <Collapsible
                key={category}
                open={expandedCategory === category}
                onOpenChange={(open) => setExpandedCategory(open ? category : null)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-auto text-left"
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {questions.length}
                      </Badge>
                      {expandedCategory === category ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {questions.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 pl-9 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">{question}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {Object.values(analyticalQuestions).flat().length} analytical questions available
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-6 bg-card/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium">AI-Powered Demand Analytics</span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-2xl rounded-xl p-4 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => {
                      const boldMatch = line.match(/\*\*(.*?)\*\*/g);
                      if (boldMatch) {
                        const parts = line.split(/\*\*(.*?)\*\*/);
                        return (
                          <p key={i} className="mb-1">
                            {parts.map((part, j) => 
                              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      return <p key={i} className="mb-1">{line}</p>;
                    })}
                  </div>
                  {message.chart && (
                    <div className="mt-4 h-48 bg-background/50 rounded-lg p-3">
                      {message.chart.type === 'bar' && (
                        <Bar data={message.chart.data} options={message.chart.options} />
                      )}
                      {message.chart.type === 'pie' && (
                        <Pie data={message.chart.data} options={message.chart.options} />
                      )}
                      {message.chart.type === 'line' && (
                        <Line data={message.chart.data} options={message.chart.options} />
                      )}
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4 bg-card/30">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SKU performance, regional trends, channels..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
