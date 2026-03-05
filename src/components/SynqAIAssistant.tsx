import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, ChevronDown, ChevronUp, BarChart3, TrendingUp, Package, MapPin, Building2, AlertTriangle, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bar, Pie, Line } from "react-chartjs-2";
import ReactMarkdown from "react-markdown";
import { skuData } from "@/data/demandForecasting/skuData";
import { workbookData } from "@/data/demandForecasting/workbookData";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  chart?: {
    type: "bar" | "pie" | "line";
    data: any;
    options?: any;
  };
}

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
    "Compare Amazon vs Flipkart channels",
    "Which location has highest forecast variance?",
    "Show regional revenue breakdown",
  ],
  "Channel Insights": [
    "Which channel generates maximum revenue?",
    "Compare Amazon vs Flipkart performance",
    "D2C channel analysis",
    "Distributor channel performance",
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

// Flatten all questions for display
const allQuestions = Object.values(analyticalQuestions).flat();

// Sample questions shown initially
const sampleQuestions = [
  "Top 5 SKUs by revenue",
  "Best performing region",
  "Channel revenue breakdown",
  "Forecast accuracy summary",
];

// Data-driven response generator
const generateResponse = (query: string): { content: string; chart?: Message["chart"] } => {
  const lowerQuery = query.toLowerCase();

  // SKU with highest accuracy
  if (lowerQuery.includes("highest") && lowerQuery.includes("accuracy")) {
    const bestSku = skuData.reduce((prev, curr) => 
      parseInt(curr.accuracy) > parseInt(prev.accuracy) ? curr : prev
    );
    return {
      content: `📊 **Highest Forecast Accuracy SKU**\n\n**${bestSku.product}** (${bestSku.sku}) has the highest accuracy at **${bestSku.accuracy}**\n\n• Location: ${bestSku.location}\n• Channel: ${bestSku.channel}\n• Forecasted: ${bestSku.forecasted}\n• Actual: ${bestSku.actual}\n• Variance: ${bestSku.variance}`,
      chart: {
        type: "bar",
        data: {
          labels: skuData.map(s => s.sku),
          datasets: [{
            label: "Accuracy %",
            data: skuData.map(s => parseInt(s.accuracy)),
            backgroundColor: skuData.map(s => parseInt(s.accuracy) >= 95 ? "#22c55e" : parseInt(s.accuracy) >= 93 ? "#eab308" : "#ef4444"),
          }]
        },
        options: { indexAxis: 'y', plugins: { legend: { display: false } } }
      }
    };
  }

  // SKU with lowest accuracy
  if (lowerQuery.includes("lowest") && lowerQuery.includes("accuracy")) {
    const worstSku = skuData.reduce((prev, curr) => 
      parseInt(curr.accuracy) < parseInt(prev.accuracy) ? curr : prev
    );
    return {
      content: `⚠️ **Lowest Forecast Accuracy SKU**\n\n**${worstSku.product}** (${worstSku.sku}) needs attention at **${worstSku.accuracy}** accuracy\n\n• Location: ${worstSku.location}\n• Channel: ${worstSku.channel}\n• Variance: ${worstSku.variance}\n\n**Recommendation:** Review demand drivers and external factors affecting this SKU.`,
    };
  }

  // Top 5 SKUs by revenue - improved matching for various phrasings
  if ((lowerQuery.includes("top") && (lowerQuery.includes("sku") || lowerQuery.includes("revenue") || lowerQuery.includes("selling") || lowerQuery.includes("product"))) || 
      (lowerQuery.includes("highest") && (lowerQuery.includes("revenue") || lowerQuery.includes("selling") || lowerQuery.includes("sales"))) ||
      (lowerQuery.includes("best") && (lowerQuery.includes("sku") || lowerQuery.includes("selling") || lowerQuery.includes("product"))) ||
      (lowerQuery.includes("revenue") && lowerQuery.includes("sku")) ||
      (lowerQuery.includes("selling") && lowerQuery.includes("sku"))) {
    const sortedSkus = [...skuData].sort((a, b) => {
      const aVal = parseFloat(a.actual.replace("₹", "").replace("M", ""));
      const bVal = parseFloat(b.actual.replace("₹", "").replace("M", ""));
      return bVal - aVal;
    }).slice(0, 5);

    return {
      content: `🏆 **Top 5 SKUs by Actual Revenue**\n\n${sortedSkus.map((s, i) => `${i + 1}. **${s.product}** - ${s.actual} (${s.accuracy} accuracy)`).join("\n")}`,
      chart: {
        type: "bar",
        data: {
          labels: sortedSkus.map(s => s.sku),
          datasets: [{
            label: "Revenue (₹M)",
            data: sortedSkus.map(s => parseFloat(s.actual.replace("₹", "").replace("M", ""))),
            backgroundColor: ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c084fc"],
          }]
        }
      }
    };
  }

  // Underperforming SKUs
  if (lowerQuery.includes("underperform") || (lowerQuery.includes("negative") && lowerQuery.includes("variance"))) {
    const underperforming = skuData.filter(s => s.variance.startsWith("-"));
    return {
      content: `📉 **Underperforming SKUs (Negative Variance)**\n\n${underperforming.map(s => `• **${s.product}** (${s.sku}): ${s.variance} variance\n  Forecasted: ${s.forecasted} → Actual: ${s.actual}`).join("\n\n")}\n\n**Total underperforming:** ${underperforming.length} out of ${skuData.length} SKUs`,
      chart: {
        type: "bar",
        data: {
          labels: underperforming.map(s => s.sku),
          datasets: [{
            label: "Variance %",
            data: underperforming.map(s => parseFloat(s.variance.replace("%", ""))),
            backgroundColor: "#ef4444",
          }]
        }
      }
    };
  }

  // Overperforming SKUs
  if (lowerQuery.includes("overperform")) {
    const overperforming = skuData.filter(s => s.variance.startsWith("+"));
    return {
      content: `📈 **Overperforming SKUs (Positive Variance)**\n\n${overperforming.map(s => `• **${s.product}** (${s.sku}): ${s.variance} variance\n  Forecasted: ${s.forecasted} → Actual: ${s.actual}`).join("\n\n")}\n\n**Insight:** These SKUs exceeded forecasts - consider increasing safety stock.`,
      chart: {
        type: "bar",
        data: {
          labels: overperforming.map(s => s.sku),
          datasets: [{
            label: "Variance %",
            data: overperforming.map(s => parseFloat(s.variance.replace("%", ""))),
            backgroundColor: "#22c55e",
          }]
        }
      }
    };
  }

  // Best performing region
  if (lowerQuery.includes("region") && (lowerQuery.includes("best") || lowerQuery.includes("performance"))) {
    const regionRevenue: Record<string, number> = {};
    skuData.forEach(s => {
      const region = s.location;
      const revenue = parseFloat(s.actual.replace("₹", "").replace("M", ""));
      regionRevenue[region] = (regionRevenue[region] || 0) + revenue;
    });
    
    const sortedRegions = Object.entries(regionRevenue).sort((a, b) => b[1] - a[1]);
    const bestRegion = sortedRegions[0];

    return {
      content: `🗺️ **Regional Sales Performance**\n\n🥇 **Best Region: ${bestRegion[0]}**\nTotal Revenue: ₹${bestRegion[1].toFixed(1)}M\n\n**All Regions Ranking:**\n${sortedRegions.map((r, i) => `${i + 1}. ${r[0]}: ₹${r[1].toFixed(1)}M`).join("\n")}`,
      chart: {
        type: "pie",
        data: {
          labels: sortedRegions.map(r => r[0].replace(" Distribution Center", "").replace(" Super Stockist", "").replace(" Depot", "")),
          datasets: [{
            data: sortedRegions.map(r => r[1]),
            backgroundColor: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#ec4899"],
          }]
        }
      }
    };
  }

  // Compare Amazon vs Flipkart
  if (lowerQuery.includes("amazon") && lowerQuery.includes("flipkart")) {
    const amazonSkus = skuData.filter(s => s.channel === "Amazon");
    const flipkartSkus = skuData.filter(s => s.channel === "Flipkart");
    
    const amazonRevenue = amazonSkus.reduce((sum, s) => sum + parseFloat(s.actual.replace("₹", "").replace("M", "")), 0);
    const flipkartRevenue = flipkartSkus.reduce((sum, s) => sum + parseFloat(s.actual.replace("₹", "").replace("M", "")), 0);
    
    const amazonAccuracy = amazonSkus.length ? amazonSkus.reduce((sum, s) => sum + parseInt(s.accuracy), 0) / amazonSkus.length : 0;
    const flipkartAccuracy = flipkartSkus.length ? flipkartSkus.reduce((sum, s) => sum + parseInt(s.accuracy), 0) / flipkartSkus.length : 0;

    return {
      content: `⚖️ **Amazon vs Flipkart Comparison**\n\n| Metric | Amazon | Flipkart |\n|--------|--------|----------|\n| Revenue | ₹${amazonRevenue.toFixed(1)}M | ₹${flipkartRevenue.toFixed(1)}M |\n| Avg Accuracy | ${amazonAccuracy.toFixed(1)}% | ${flipkartAccuracy.toFixed(1)}% |\n| SKU Count | ${amazonSkus.length} | ${flipkartSkus.length} |\n\n**Winner:** ${amazonRevenue > flipkartRevenue ? "Amazon" : "Flipkart"} by revenue`,
      chart: {
        type: "bar",
        data: {
          labels: ["Revenue (₹M)", "Avg Accuracy (%)"],
          datasets: [
            { label: "Amazon", data: [amazonRevenue, amazonAccuracy], backgroundColor: "#ff9900" },
            { label: "Flipkart", data: [flipkartRevenue, flipkartAccuracy], backgroundColor: "#047bd5" }
          ]
        }
      }
    };
  }

  // Location with highest variance
  if (lowerQuery.includes("location") && lowerQuery.includes("variance")) {
    const locationVariance: Record<string, number[]> = {};
    skuData.forEach(s => {
      const variance = Math.abs(parseFloat(s.variance.replace("%", "")));
      if (!locationVariance[s.location]) locationVariance[s.location] = [];
      locationVariance[s.location].push(variance);
    });
    
    const avgVariance = Object.entries(locationVariance).map(([loc, vars]) => ({
      location: loc,
      avgVariance: vars.reduce((a, b) => a + b, 0) / vars.length
    })).sort((a, b) => b.avgVariance - a.avgVariance);

    return {
      content: `📊 **Forecast Variance by Location**\n\n⚠️ **Highest Variance:** ${avgVariance[0].location}\nAverage Variance: ${avgVariance[0].avgVariance.toFixed(1)}%\n\n**All Locations:**\n${avgVariance.map((l, i) => `${i + 1}. ${l.location}: ${l.avgVariance.toFixed(1)}%`).join("\n")}`,
      chart: {
        type: "bar",
        data: {
          labels: avgVariance.map(l => l.location.replace(" Distribution Center", "").replace(" Super Stockist", "")),
          datasets: [{
            label: "Avg Variance %",
            data: avgVariance.map(l => l.avgVariance),
            backgroundColor: avgVariance.map(l => l.avgVariance > 6 ? "#ef4444" : l.avgVariance > 4 ? "#eab308" : "#22c55e"),
          }]
        },
        options: { indexAxis: 'y' }
      }
    };
  }

  // Channel revenue
  if (lowerQuery.includes("channel") && (lowerQuery.includes("revenue") || lowerQuery.includes("maximum") || lowerQuery.includes("breakdown"))) {
    const channelRevenue: Record<string, number> = {};
    skuData.forEach(s => {
      const revenue = parseFloat(s.actual.replace("₹", "").replace("M", ""));
      channelRevenue[s.channel] = (channelRevenue[s.channel] || 0) + revenue;
    });
    
    const sortedChannels = Object.entries(channelRevenue).sort((a, b) => b[1] - a[1]);
    const totalRevenue = sortedChannels.reduce((sum, c) => sum + c[1], 0);

    return {
      content: `📦 **Channel Revenue Analysis**\n\n🥇 **Top Channel: ${sortedChannels[0][0]}**\nRevenue: ₹${sortedChannels[0][1].toFixed(1)}M (${((sortedChannels[0][1] / totalRevenue) * 100).toFixed(1)}% share)\n\n**All Channels:**\n${sortedChannels.map((c, i) => `${i + 1}. ${c[0]}: ₹${c[1].toFixed(1)}M (${((c[1] / totalRevenue) * 100).toFixed(1)}%)`).join("\n")}`,
      chart: {
        type: "pie",
        data: {
          labels: sortedChannels.map(c => c[0]),
          datasets: [{
            data: sortedChannels.map(c => c[1]),
            backgroundColor: ["#3b82f6", "#22c55e", "#eab308", "#8b5cf6", "#ef4444"],
          }]
        }
      }
    };
  }

  // D2C analysis
  if (lowerQuery.includes("d2c")) {
    const d2cSkus = skuData.filter(s => s.channel === "D2C");
    const d2cRevenue = d2cSkus.reduce((sum, s) => sum + parseFloat(s.actual.replace("₹", "").replace("M", "")), 0);
    
    return {
      content: `🌐 **D2C Channel Analysis**\n\n${d2cSkus.length > 0 ? d2cSkus.map(s => `• **${s.product}** (${s.sku})\n  Revenue: ${s.actual} | Accuracy: ${s.accuracy} | Variance: ${s.variance}`).join("\n\n") : "No D2C data available"}\n\n**Total D2C Revenue:** ₹${d2cRevenue.toFixed(1)}M\n**Key Insight:** D2C channel shows 42% CAGR growth with 78% higher margins on premium products.`,
    };
  }

  // Distributor analysis
  if (lowerQuery.includes("distributor")) {
    const distSkus = skuData.filter(s => s.channel === "Distributor");
    const distRevenue = distSkus.reduce((sum, s) => sum + parseFloat(s.actual.replace("₹", "").replace("M", "")), 0);
    
    return {
      content: `📦 **Distributor Channel Analysis**\n\n${distSkus.map(s => `• **${s.product}** (${s.sku})\n  Revenue: ${s.actual} | Forecast Variance: ${s.variance}`).join("\n\n")}\n\n**Total Distributor Revenue:** ₹${distRevenue.toFixed(1)}M\n**Note:** Distributor channel serves Tier 2/3 cities with bulk order cycles.`,
    };
  }

  // Overall forecast accuracy
  if (lowerQuery.includes("overall") && lowerQuery.includes("accuracy")) {
    const avgAccuracy = skuData.reduce((sum, s) => sum + parseInt(s.accuracy), 0) / skuData.length;
    const above95 = skuData.filter(s => parseInt(s.accuracy) >= 95).length;
    const below93 = skuData.filter(s => parseInt(s.accuracy) < 93).length;

    return {
      content: `🎯 **Overall Forecast Accuracy Summary**\n\n• **Average Accuracy:** ${avgAccuracy.toFixed(1)}%\n• SKUs ≥95% accuracy: ${above95} (${((above95/skuData.length)*100).toFixed(0)}%)\n• SKUs <93% accuracy: ${below93} (${((below93/skuData.length)*100).toFixed(0)}%)\n\n**Recommendation:** Focus on improving ${below93} SKUs with sub-93% accuracy.`,
      chart: {
        type: "pie",
        data: {
          labels: ["≥95% (Excellent)", "93-95% (Good)", "<93% (Needs Work)"],
          datasets: [{
            data: [above95, skuData.length - above95 - below93, below93],
            backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
          }]
        }
      }
    };
  }

  // Forecast vs Actual comparison
  if (lowerQuery.includes("forecast") && lowerQuery.includes("actual")) {
    return {
      content: `📊 **Forecast vs Actual Comparison**\n\n${skuData.slice(0, 5).map(s => `• **${s.sku}**: Forecast ${s.forecasted} → Actual ${s.actual} (${s.variance})`).join("\n")}\n\n**Summary:**\n• Overforecasted: ${skuData.filter(s => s.variance.startsWith("-")).length} SKUs\n• Underforecasted: ${skuData.filter(s => s.variance.startsWith("+")).length} SKUs`,
      chart: {
        type: "bar",
        data: {
          labels: skuData.map(s => s.sku),
          datasets: [
            { 
              label: "Forecasted (₹M)", 
              data: skuData.map(s => parseFloat(s.forecasted.replace("₹", "").replace("M", ""))),
              backgroundColor: "#3b82f6" 
            },
            { 
              label: "Actual (₹M)", 
              data: skuData.map(s => parseFloat(s.actual.replace("₹", "").replace("M", ""))),
              backgroundColor: "#22c55e" 
            }
          ]
        }
      }
    };
  }

  // Products needing adjustment
  if (lowerQuery.includes("adjustment") || lowerQuery.includes("need") && lowerQuery.includes("forecast")) {
    const needsAdjustment = skuData.filter(s => Math.abs(parseFloat(s.variance.replace("%", ""))) > 5);

    return {
      content: `⚙️ **Products Needing Forecast Adjustment**\n\nSKUs with >5% variance:\n\n${needsAdjustment.map(s => `• **${s.product}** (${s.sku})\n  Current Variance: ${s.variance}\n  Action: ${s.variance.startsWith("-") ? "Reduce forecast by ~" + s.variance.replace("-", "") : "Increase forecast by ~" + s.variance.replace("+", "")}`).join("\n\n")}`,
    };
  }

  // Weekly trend
  if (lowerQuery.includes("weekly") && (lowerQuery.includes("trend") || lowerQuery.includes("sales"))) {
    const weeklyTotals = workbookData.reduce((acc, item) => {
      acc.week1 += item.week1;
      acc.week2 += item.week2;
      acc.week3 += item.week3;
      return acc;
    }, { week1: 0, week2: 0, week3: 0 });

    return {
      content: `📈 **Weekly Sales Trend Analysis**\n\n• Week 1: ${weeklyTotals.week1.toLocaleString()} units\n• Week 2: ${weeklyTotals.week2.toLocaleString()} units\n• Week 3: ${weeklyTotals.week3.toLocaleString()} units\n\n**Trend:** ${weeklyTotals.week3 > weeklyTotals.week1 ? "📈 Upward" : "📉 Downward"} (${(((weeklyTotals.week3 - weeklyTotals.week1) / weeklyTotals.week1) * 100).toFixed(1)}% change)`,
      chart: {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3"],
          datasets: [{
            label: "Total Units Sold",
            data: [weeklyTotals.week1, weeklyTotals.week2, weeklyTotals.week3],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          }]
        }
      }
    };
  }

  // Highest sales week
  if (lowerQuery.includes("week") && lowerQuery.includes("highest")) {
    const weeklyTotals = workbookData.reduce((acc, item) => {
      acc.week1 += item.week1;
      acc.week2 += item.week2;
      acc.week3 += item.week3;
      return acc;
    }, { week1: 0, week2: 0, week3: 0 });

    const highest = Object.entries(weeklyTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      content: `📅 **Highest Sales Week**\n\n🏆 **${highest[0].replace("week", "Week ")}** with **${highest[1].toLocaleString()} units**\n\n**Week-wise Breakdown:**\n• Week 1: ${weeklyTotals.week1.toLocaleString()} units\n• Week 2: ${weeklyTotals.week2.toLocaleString()} units\n• Week 3: ${weeklyTotals.week3.toLocaleString()} units`,
    };
  }

  // Seasonal patterns
  if (lowerQuery.includes("seasonal") || lowerQuery.includes("pattern")) {
    return {
      content: `🌡️ **Seasonal Demand Patterns**\n\n**Q1 (Jan-Mar):** Republic Day & budget season drives 25% spike\n• Earbuds and Speakers demand peaks\n\n**Q2 (Apr-Jun):** Back-to-college & summer gifting\n• Headphones and Wearables up 18%\n\n**Q3 (Jul-Sep):** Prime Day & Great Indian Sale\n• TWS Earbuds surge 45%, Speakers up 30%\n\n**Q4 (Oct-Dec):** Diwali, Big Billion Days, Christmas\n• All categories peak — 38% overall surge`,
      chart: {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { label: "Earbuds", data: [95, 85, 80, 85, 90, 88, 110, 105, 130, 145, 140, 120], borderColor: "#3b82f6", tension: 0.4 },
            { label: "Speakers", data: [80, 75, 78, 82, 85, 80, 95, 90, 115, 130, 125, 110], borderColor: "#22c55e", tension: 0.4 },
            { label: "Headphones", data: [70, 72, 75, 88, 92, 90, 85, 82, 100, 115, 110, 95], borderColor: "#8b5cf6", tension: 0.4 },
          ]
        }
      }
    };
  }

  // Week-over-week growth
  if (lowerQuery.includes("week-over-week") || lowerQuery.includes("wow") || lowerQuery.includes("growth")) {
    const productGrowth = workbookData.map(item => ({
      product: item.product.split(" ").slice(0, 2).join(" "),
      sku: item.sku,
      w1_w2: ((item.week2 - item.week1) / item.week1 * 100).toFixed(1),
      w2_w3: ((item.week3 - item.week2) / item.week2 * 100).toFixed(1),
    }));

    return {
      content: `📊 **Week-over-Week Growth Analysis**\n\n${productGrowth.slice(0, 5).map(p => `• **${p.sku}**: W1→W2: ${p.w1_w2}% | W2→W3: ${p.w2_w3}%`).join("\n")}\n\n**Top Grower:** ${productGrowth.sort((a, b) => parseFloat(b.w2_w3) - parseFloat(a.w2_w3))[0].sku} at ${productGrowth.sort((a, b) => parseFloat(b.w2_w3) - parseFloat(a.w2_w3))[0].w2_w3}% WoW`,
    };
  }

  // Forecast accuracy summary
  if (lowerQuery.includes("accuracy") && lowerQuery.includes("summary")) {
    const avgAccuracy = skuData.reduce((sum, s) => sum + parseInt(s.accuracy), 0) / skuData.length;
    
    return {
      content: `📋 **Forecast Accuracy Summary**\n\n• **Average Accuracy:** ${avgAccuracy.toFixed(1)}%\n• **Best SKU:** ${skuData.reduce((p, c) => parseInt(c.accuracy) > parseInt(p.accuracy) ? c : p).sku} (${skuData.reduce((p, c) => parseInt(c.accuracy) > parseInt(p.accuracy) ? c : p).accuracy})\n• **Worst SKU:** ${skuData.reduce((p, c) => parseInt(c.accuracy) < parseInt(p.accuracy) ? c : p).sku} (${skuData.reduce((p, c) => parseInt(c.accuracy) < parseInt(p.accuracy) ? c : p).accuracy})\n• **Total SKUs Analyzed:** ${skuData.length}`,
      chart: {
        type: "bar",
        data: {
          labels: skuData.map(s => s.sku),
          datasets: [{
            label: "Accuracy %",
            data: skuData.map(s => parseInt(s.accuracy)),
            backgroundColor: skuData.map(s => parseInt(s.accuracy) >= 95 ? "#22c55e" : parseInt(s.accuracy) >= 93 ? "#eab308" : "#ef4444"),
          }]
        }
      }
    };
  }

  // Regional breakdown
  if (lowerQuery.includes("regional") && lowerQuery.includes("breakdown")) {
    const regionData: Record<string, { revenue: number; count: number }> = {};
    skuData.forEach(s => {
      const region = s.location;
      const revenue = parseFloat(s.actual.replace("₹", "").replace("M", ""));
      if (!regionData[region]) regionData[region] = { revenue: 0, count: 0 };
      regionData[region].revenue += revenue;
      regionData[region].count += 1;
    });

    return {
      content: `🗺️ **Regional Revenue Breakdown**\n\n${Object.entries(regionData).map(([region, data]) => `• **${region}**\n  Revenue: ₹${data.revenue.toFixed(1)}M | SKUs: ${data.count}`).join("\n\n")}`,
      chart: {
        type: "pie",
        data: {
          labels: Object.keys(regionData).map(r => r.replace(" Distribution Center", "").replace(" Super Stockist", "")),
          datasets: [{
            data: Object.values(regionData).map(d => d.revenue),
            backgroundColor: ["#3b82f6", "#22c55e", "#eab308", "#8b5cf6", "#ef4444", "#ec4899"],
          }]
        }
      }
    };
  }

  // Default response
  return {
    content: "I can help you analyze the demand forecast data. Try asking about:\n\n• **SKU Performance:** \"Top 5 SKUs by revenue\", \"Highest accuracy SKU\"\n• **Regional:** \"Best performing region\", \"NCR vs West comparison\"\n• **Channels:** \"Channel revenue breakdown\", \"Retail vs Hospital\"\n• **Trends:** \"Weekly sales trend\", \"Seasonal patterns\"\n\nClick on any suggested question below to get started!",
  };
};

export const SynqAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm SynqAI, your demand forecasting analyst. Ask me about SKU performance, regional trends, channel analysis, or forecast accuracy.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Check if demo quota exceeded
    if (quotaExceeded) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Generate data-driven response
    setTimeout(() => {
      // Check if this is the 3rd question (after 2 answered)
      if (newCount > 2) {
        setQuotaExceeded(true);
        const quotaMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "⚠️ **Demo Quota Exceeded**\n\nYou've reached the limit of 2 free questions in this demo session.\n\nTo unlock unlimited AI-powered analytics:\n• Upgrade to Pro plan\n• Contact sales@upsynq.com\n\nThank you for trying SynqAI!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, quotaMessage]);
        return;
      }

      const response = generateResponse(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        chart: response.chart,
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { 
        position: 'bottom' as const,
        labels: { boxWidth: 12, padding: 8, font: { size: 10 } }
      },
    },
    scales: {
      x: { ticks: { font: { size: 9 } } },
      y: { ticks: { font: { size: 9 } } },
    },
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 z-50"
        size="icon"
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      {/* Chat Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <SheetContent side="right" className="w-full sm:w-[520px] flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg">SynqAI</SheetTitle>
                <p className="text-xs text-muted-foreground">Demand Forecasting Analyst</p>
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-muted border border-border"
                    }`}
                  >
                    <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Render chart if present */}
                    {message.chart && (
                      <div className="mt-3 bg-background/50 rounded-lg p-3 h-48">
                        {message.chart.type === "bar" && (
                          <Bar data={message.chart.data} options={{ ...chartOptions, ...message.chart.options }} />
                        )}
                        {message.chart.type === "pie" && (
                          <Pie data={message.chart.data} options={chartOptions} />
                        )}
                        {message.chart.type === "line" && (
                          <Line data={message.chart.data} options={chartOptions} />
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Sample Questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="h-7 text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* All Questions Expandable */}
          <div className="px-4 py-2 border-t border-border bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="w-full justify-between text-xs h-8"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                View all {allQuestions.length} analytical questions
              </span>
              {showAllQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showAllQuestions && (
              <div className="mt-2 max-h-60 overflow-y-auto space-y-3">
                {Object.entries(analyticalQuestions).map(([category, questions]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      {category === "SKU Performance" && <Package className="w-3 h-3" />}
                      {category === "Regional Analysis" && <MapPin className="w-3 h-3" />}
                      {category === "Channel Insights" && <Building2 className="w-3 h-3" />}
                      {category === "Forecast Analysis" && <Target className="w-3 h-3" />}
                      {category === "Trend Analysis" && <TrendingUp className="w-3 h-3" />}
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {questions.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleSendMessage(q);
                            setShowAllQuestions(false);
                          }}
                          className="h-6 text-[10px] px-2"
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-border">
            {quotaExceeded ? (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Demo quota exceeded</p>
                <p className="text-xs text-muted-foreground mt-1">Upgrade to continue using SynqAI</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about SKUs, regions, channels..."
                  className="flex-1 h-11"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  size="icon"
                  className="h-11 w-11"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
