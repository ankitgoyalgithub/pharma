// Distribution node metrics for boAt consumer electronics warehouse network
// Total across all warehouses & channels: ₹82.4Cr revenue, 1,207,560 units

const distributionNodes: Record<string, { size: number; name: string }> = {
  S001: { size: 2350, name: "WH_North — Delhi Hub" },
  S002: { size: 2864, name: "WH_South — Chennai DC" },
  S003: { size: 1712, name: "WH_West — Mumbai Hub" },
  S004: { size: 1759, name: "Amazon FC — Bhiwandi" },
  S005: { size: 4543, name: "Flipkart WH — Bengaluru" },
  S006: { size: 5999, name: "D2C Fulfillment — Pune" },
  S007: { size: 3494, name: "Distributor Hub — Ahmedabad" },
  S008: { size: 2879, name: "Retail Partner — Hyderabad" },
  S009: { size: 3944, name: "Amazon FC — Delhi NCR" },
  S010: { size: 2443, name: "Flipkart WH — Kolkata" },
};

// Calculate total size across all distribution nodes
const totalSize = Object.values(distributionNodes).reduce((sum, node) => sum + node.size, 0);

// Baseline metrics for ALL nodes (Indian consumer electronics market in Crores)
const allNodesRevenue = 96.1; // Crores ₹ — aligned with ABC-XYZ matrix total
const allNodesUnits = 1207560; // Total units

// Calculate metrics for each distribution node based on proportional size
export const getStoreMetrics = (nodeId: string) => {
  if (nodeId === 'all') {
    return {
      revenue: allNodesRevenue,
      revenueFormatted: '82.4',
      units: allNodesUnits,
      unitsFormatted: '1,207,560'
    };
  }

  const node = distributionNodes[nodeId as keyof typeof distributionNodes];
  if (!node) {
    return {
      revenue: allNodesRevenue,
      revenueFormatted: '82.4',
      units: allNodesUnits,
      unitsFormatted: '1,207,560'
    };
  }

  const sizeRatio = node.size / totalSize;
  const nodeRevenue = allNodesRevenue * sizeRatio;
  const nodeUnits = Math.round(allNodesUnits * sizeRatio);

  return {
    revenue: nodeRevenue,
    revenueFormatted: nodeRevenue.toFixed(1),
    units: nodeUnits,
    unitsFormatted: nodeUnits.toLocaleString()
  };
};

// ABC Analysis - Total Revenue Impact (in Crores)
export const getABCRevenueImpact = (nodeId: string) => {
  if (nodeId === 'all') {
    return { formatted: '₹52.8Cr', value: 52.8 };
  }

  const metrics = getStoreMetrics(nodeId);
  const impact = metrics.revenue * 0.641; // 64.1% of node revenue for Class A items
  return {
    formatted: `₹${impact.toFixed(1)}Cr`,
    value: impact
  };
};

// FMR Analysis - Fast Moving Units (high-velocity consumer electronics SKUs)
export const getFMRUnits = (nodeId: string) => {
  if (nodeId === 'all') {
    return { formatted: '89.2K', value: 89200 };
  }

  const metrics = getStoreMetrics(nodeId);
  const fmrUnits = Math.round(metrics.units * 0.0739);
  return {
    formatted: fmrUnits >= 1000 ? `${(fmrUnits / 1000).toFixed(1)}K` : fmrUnits.toString(),
    value: fmrUnits
  };
};

// Chart multipliers for visualization
export const getChartMultiplier = (nodeId: string): number => {
  if (nodeId === 'all') return 1.0;
  
  const node = distributionNodes[nodeId as keyof typeof distributionNodes];
  if (!node) return 1.0;
  
  const avgSize = totalSize / Object.keys(distributionNodes).length;
  return node.size / avgSize;
};
