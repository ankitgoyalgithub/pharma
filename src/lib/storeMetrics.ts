// Store metrics calculation based on actual store sizes from location_master.csv
// Total across all 45 stores: $68M revenue, 1,207,560 units

const storeData = {
  L001: { size: 2350, name: "Pune Store L001" },
  L002: { size: 2864, name: "Mumbai Store L002" },
  L003: { size: 1712, name: "Delhi Store L003" },
  L004: { size: 1759, name: "Kolkata Store L004" },
  L005: { size: 4543, name: "Mumbai Store L005" },
  L006: { size: 5999, name: "Chennai Store L006" },
  L007: { size: 3494, name: "Kolkata Store L007" },
  L008: { size: 2879, name: "Bengaluru Store L008" },
  L009: { size: 3944, name: "Bengaluru Store L009" },
  L010: { size: 2443, name: "Chennai Store L010" },
  L011: { size: 3341, name: "Chennai Store L011" },
  L012: { size: 4259, name: "Pune Store L012" },
  L013: { size: 3679, name: "Chennai Store L013" },
  L014: { size: 2835, name: "Chennai Store L014" },
  L015: { size: 2957, name: "Mumbai Store L015" },
  L016: { size: 4049, name: "Chennai Store L016" },
  L017: { size: 4930, name: "Hyderabad Store L017" },
  L018: { size: 2215, name: "Delhi Store L018" },
  L019: { size: 5811, name: "Chennai Store L019" },
  L020: { size: 5792, name: "Ahmedabad Store L020" },
  L021: { size: 2051, name: "Hyderabad Store L021" },
  L022: { size: 4946, name: "Ahmedabad Store L022" },
  L023: { size: 5200, name: "Hyderabad Store L023" },
  L024: { size: 4698, name: "Chennai Store L024" },
  L025: { size: 5113, name: "Chennai Store L025" },
  L026: { size: 3644, name: "Bengaluru Store L026" },
  L027: { size: 4573, name: "Hyderabad Store L027" },
  L028: { size: 3746, name: "Delhi Store L028" },
  L029: { size: 3974, name: "Delhi Store L029" },
  L030: { size: 1975, name: "Mumbai Store L030" },
  L031: { size: 2825, name: "Chennai Store L031" },
  L032: { size: 1314, name: "Pune Store L032" },
  L033: { size: 4467, name: "Mumbai Store L033" },
  L034: { size: 2716, name: "Delhi Store L034" },
  L035: { size: 1928, name: "Bengaluru Store L035" },
  L036: { size: 4008, name: "Chennai Store L036" },
  L037: { size: 3704, name: "Hyderabad Store L037" },
  L038: { size: 2322, name: "Ahmedabad Store L038" },
  L039: { size: 3343, name: "Ahmedabad Store L039" },
  L040: { size: 5332, name: "Ahmedabad Store L040" },
  L041: { size: 4966, name: "Hyderabad Store L041" },
  L042: { size: 4114, name: "Chennai Store L042" },
  L043: { size: 5152, name: "Mumbai Store L043" },
  L044: { size: 2565, name: "Pune Store L044" },
  L045: { size: 1595, name: "Chennai Store L045" },
};

// Calculate total size across all stores
const totalSize = Object.values(storeData).reduce((sum, store) => sum + store.size, 0);
// Total: 156,627 sqft

// Baseline metrics for ALL stores
const allStoresRevenue = 68.0; // Million $
const allStoresUnits = 1207560; // Total units

// Calculate metrics for each store based on proportional size
export const getStoreMetrics = (storeId: string) => {
  if (storeId === 'all') {
    return {
      revenue: allStoresRevenue,
      revenueFormatted: '68.0',
      units: allStoresUnits,
      unitsFormatted: '1,207,560'
    };
  }

  const store = storeData[storeId as keyof typeof storeData];
  if (!store) {
    return {
      revenue: allStoresRevenue,
      revenueFormatted: '68.0',
      units: allStoresUnits,
      unitsFormatted: '1,207,560'
    };
  }

  // Calculate proportional metrics
  const sizeRatio = store.size / totalSize;
  const storeRevenue = allStoresRevenue * sizeRatio;
  const storeUnits = Math.round(allStoresUnits * sizeRatio);

  return {
    revenue: storeRevenue,
    revenueFormatted: storeRevenue.toFixed(1),
    units: storeUnits,
    unitsFormatted: storeUnits.toLocaleString()
  };
};

// ABC Analysis - Total Revenue Impact
export const getABCRevenueImpact = (storeId: string) => {
  if (storeId === 'all') {
    return { formatted: '$42.3M', value: 42.3 };
  }

  const metrics = getStoreMetrics(storeId);
  const impact = metrics.revenue * 0.622; // 62.2% of store revenue
  return {
    formatted: `$${impact.toFixed(1)}M`,
    value: impact
  };
};

// FMR Analysis - Fast Moving Units
export const getFMRUnits = (storeId: string) => {
  if (storeId === 'all') {
    return { formatted: '89.2K', value: 89200 };
  }

  const metrics = getStoreMetrics(storeId);
  const fmrUnits = Math.round(metrics.units * 0.0739); // 7.39% are fast-moving
  return {
    formatted: fmrUnits >= 1000 ? `${(fmrUnits / 1000).toFixed(1)}K` : fmrUnits.toString(),
    value: fmrUnits
  };
};

// Chart multipliers for visualization
export const getChartMultiplier = (storeId: string): number => {
  if (storeId === 'all') return 1.0;
  
  const store = storeData[storeId as keyof typeof storeData];
  if (!store) return 1.0;
  
  // Return size ratio relative to average store size
  const avgSize = totalSize / Object.keys(storeData).length;
  return store.size / avgSize;
};
