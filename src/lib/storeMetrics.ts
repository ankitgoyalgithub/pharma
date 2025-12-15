// Distribution node metrics calculation for Indian Pharma distribution network
// Total across all 50 distribution nodes: ₹82.4Cr revenue, 1,207,560 units

const distributionNodes = {
  S001: { size: 2350, name: "Mumbai Central WH" },
  S002: { size: 2864, name: "Delhi North Hub" },
  S003: { size: 1712, name: "Bangalore DC" },
  S004: { size: 1759, name: "Chennai Central" },
  S005: { size: 4543, name: "Hyderabad Pharma Hub" },
  S006: { size: 5999, name: "Kolkata East DC" },
  S007: { size: 3494, name: "Pune West Hub" },
  S008: { size: 2879, name: "Ahmedabad DC" },
  S009: { size: 3944, name: "Jaipur North" },
  S010: { size: 2443, name: "Lucknow Central" },
  S011: { size: 3341, name: "Chandigarh Hub" },
  S012: { size: 4259, name: "Bhopal Central" },
  S013: { size: 3679, name: "Nagpur DC" },
  S014: { size: 2835, name: "Indore West" },
  S015: { size: 2957, name: "Patna East" },
  S016: { size: 4049, name: "Kochi South Hub" },
  S017: { size: 4930, name: "Thiruvananthapuram DC" },
  S018: { size: 2215, name: "Coimbatore" },
  S019: { size: 5811, name: "Vizag East" },
  S020: { size: 5792, name: "Surat West" },
  S021: { size: 2051, name: "Vadodara DC" },
  S022: { size: 4946, name: "Rajkot Hub" },
  S023: { size: 5200, name: "Guwahati Northeast" },
  S024: { size: 4698, name: "Bhubaneswar East" },
  S025: { size: 5113, name: "Ranchi Central" },
  S026: { size: 3644, name: "Raipur DC" },
  S027: { size: 4573, name: "Apollo Hospitals Mumbai" },
  S028: { size: 3746, name: "Fortis Delhi" },
  S029: { size: 3974, name: "Max Healthcare Gurgaon" },
  S030: { size: 1975, name: "Medanta Hospital" },
  S031: { size: 2825, name: "Manipal Hospitals Bangalore" },
  S032: { size: 1314, name: "Narayana Health" },
  S033: { size: 4467, name: "AIIMS Delhi" },
  S034: { size: 2716, name: "CMC Vellore" },
  S035: { size: 1928, name: "Tata Memorial Mumbai" },
  S036: { size: 4008, name: "Lilavati Hospital" },
  S037: { size: 3704, name: "Hinduja Hospital" },
  S038: { size: 2322, name: "Sir Ganga Ram Hospital" },
  S039: { size: 3343, name: "Kokilaben Hospital" },
  S040: { size: 5332, name: "Wockhardt Hospital" },
  S041: { size: 4966, name: "Medplus Retail Chain" },
  S042: { size: 4114, name: "Apollo Pharmacy Network" },
  S043: { size: 5152, name: "Netmeds E-Pharmacy" },
  S044: { size: 2565, name: "1mg Online Pharmacy" },
  S045: { size: 1595, name: "PharmEasy DC" },
  S046: { size: 3200, name: "Tata 1mg Hub" },
  S047: { size: 2890, name: "Wellness Forever" },
  S048: { size: 3550, name: "Frank Ross Pharmacy" },
  S049: { size: 4100, name: "MediBuddy Partner" },
  S050: { size: 3800, name: "Noble Plus Pharmacy" },
};

// Calculate total size across all distribution nodes
const totalSize = Object.values(distributionNodes).reduce((sum, node) => sum + node.size, 0);

// Baseline metrics for ALL distribution nodes (Indian Pharma market in Crores)
const allNodesRevenue = 82.4; // Crores ₹
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

  // Calculate proportional metrics
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
  const impact = metrics.revenue * 0.641; // 64.1% of node revenue for Class A pharma items
  return {
    formatted: `₹${impact.toFixed(1)}Cr`,
    value: impact
  };
};

// FMR Analysis - Fast Moving Units (Pharma critical medications)
export const getFMRUnits = (nodeId: string) => {
  if (nodeId === 'all') {
    return { formatted: '89.2K', value: 89200 };
  }

  const metrics = getStoreMetrics(nodeId);
  const fmrUnits = Math.round(metrics.units * 0.0739); // 7.39% are fast-moving critical medications
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
  
  // Return size ratio relative to average node size
  const avgSize = totalSize / Object.keys(distributionNodes).length;
  return node.size / avgSize;
};
