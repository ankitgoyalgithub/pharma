// Store metrics calculation based on actual store sizes from Splash_Stores.xlsx
// Total across all 50 stores: $68M revenue, 1,207,560 units

const storeData = {
  S001: { size: 2350, name: "Dubai Mall" },
  S002: { size: 2864, name: "Mall of Emirates" },
  S003: { size: 1712, name: "Abu Dhabi Mall" },
  S004: { size: 1759, name: "Yas Mall" },
  S005: { size: 4543, name: "Dubai Festival City" },
  S006: { size: 5999, name: "Deira City Centre" },
  S007: { size: 3494, name: "Sharjah City Centre" },
  S008: { size: 2879, name: "Mirdif City Centre" },
  S009: { size: 3944, name: "Ibn Battuta Mall" },
  S010: { size: 2443, name: "Al Wahda Mall" },
  S011: { size: 3341, name: "Marina Mall" },
  S012: { size: 4259, name: "Muscat City Centre" },
  S013: { size: 3679, name: "Bahrain City Centre" },
  S014: { size: 2835, name: "Avenues Kuwait" },
  S015: { size: 2957, name: "The Gate Mall" },
  S016: { size: 4049, name: "360 Mall Kuwait" },
  S017: { size: 4930, name: "Villaggio Mall Qatar" },
  S018: { size: 2215, name: "City Centre Doha" },
  S019: { size: 5811, name: "Mall of Qatar" },
  S020: { size: 5792, name: "Landmark Mall Qatar" },
  S021: { size: 2051, name: "Seef Mall Bahrain" },
  S022: { size: 4946, name: "Dragon Mall" },
  S023: { size: 5200, name: "BurJuman Centre" },
  S024: { size: 4698, name: "Wafi Mall" },
  S025: { size: 5113, name: "Mall of Oman" },
  S026: { size: 3644, name: "Qurum City Centre" },
  S027: { size: 4573, name: "Sahara Centre" },
  S028: { size: 3746, name: "Al Ghurair Centre" },
  S029: { size: 3974, name: "Nakheel Mall" },
  S030: { size: 1975, name: "Town Centre Jumeirah" },
  S031: { size: 2825, name: "Arabian Centre" },
  S032: { size: 1314, name: "Oasis Mall" },
  S033: { size: 4467, name: "Galleria Mall" },
  S034: { size: 2716, name: "Mercato Mall" },
  S035: { size: 1928, name: "Times Square Centre" },
  S036: { size: 4008, name: "Al Hamra Mall RAK" },
  S037: { size: 3704, name: "Fujairah City Centre" },
  S038: { size: 2322, name: "Al Ain Mall" },
  S039: { size: 3343, name: "Bawadi Mall" },
  S040: { size: 5332, name: "Ajman City Centre" },
  S041: { size: 4966, name: "Khorfakkan Mall" },
  S042: { size: 4114, name: "Dalma Mall" },
  S043: { size: 5152, name: "World Trade Centre" },
  S044: { size: 2565, name: "Al Raha Mall" },
  S045: { size: 1595, name: "Khalidiyah Mall" },
  S046: { size: 3200, name: "Al Barsha Mall" },
  S047: { size: 2890, name: "Etihad Mall" },
  S048: { size: 3550, name: "City Walk" },
  S049: { size: 4100, name: "Dubai Hills Mall" },
  S050: { size: 3800, name: "Circle Mall" },
};

// Calculate total size across all stores
const totalSize = Object.values(storeData).reduce((sum, store) => sum + store.size, 0);

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
