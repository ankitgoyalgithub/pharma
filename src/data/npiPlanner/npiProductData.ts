// ── NPI Product Master Data ──
export interface NPIScenario {
  label: string;
  forecast: number;
  confidenceLow: number;
  confidenceHigh: number;
  confidence: number; // percentage
  buildQty: number;
  rampWeeks: number[];
  channelMix: { amazon: number; flipkart: number; d2c: number; retail: number };
}

export interface PostLaunchWeek {
  week: string;
  planned: number;
  actual: number | null;
  variance: number | null;
}

export interface NPIProduct {
  sku: string;
  product: string;
  type: string;
  category: string;
  featureSet: string;
  asp: number;
  comparableSku: string;
  comparableProduct: string;
  similarity: number;
  readinessScore: number;
  readiness: { inventory: boolean; marketing: boolean; supplier: boolean; listing: boolean };
  successProbability: number;
  successDrivers: string[];
  riskType: string;
  riskReason: string;
  cannibalizationTarget: string | null;
  cannibalizationPct: number;
  priceElasticity: string;
  festivalDependency: string;
  benchmark: { competitor: string; priceGap: number; batteryGap: number; featureEdge: string };
  scenarios: {
    conservative: NPIScenario;
    base: NPIScenario;
    aggressive: NPIScenario;
  };
  postLaunch: PostLaunchWeek[];
  launchStatus: "pre-launch" | "launched" | "monitoring";
  launchDate: string;
  labsRoadmapId: string;
}

export const npiProducts: NPIProduct[] = [
  {
    sku: "NEW-TWS-001", product: "Airdopes Prime 701 ANC", type: "New Launch", category: "Earbuds",
    featureSet: "ANC + ENC, 42dB depth, 10mm drivers, 32hr battery, Bluetooth 5.3, ASAP Charge",
    asp: 2999,
    comparableSku: "SKU_001", comparableProduct: "Airdopes 601", similarity: 84,
    readinessScore: 78, readiness: { inventory: true, marketing: true, supplier: false, listing: true },
    successProbability: 72, successDrivers: ["Similar product success", "Category growth", "Strong online demand"],
    riskType: "Cannibalization", riskReason: "Similar to Airdopes 601, may reduce demand by 18%",
    cannibalizationTarget: "Airdopes 601", cannibalizationPct: 18,
    priceElasticity: "High", festivalDependency: "Medium (Prime Day)",
    benchmark: { competitor: "Noise Buds VS104", priceGap: -8, batteryGap: 20, featureEdge: "ANC + ENC" },
    scenarios: {
      conservative: {
        label: "Conservative", forecast: 12600, confidenceLow: 10800, confidenceHigh: 14400, confidence: 90,
        buildQty: 15000, rampWeeks: [500, 1200, 2000, 2800, 2400, 1800, 1200, 680],
        channelMix: { amazon: 45, flipkart: 20, d2c: 25, retail: 10 }
      },
      base: {
        label: "Base", forecast: 18000, confidenceLow: 15300, confidenceHigh: 20700, confidence: 75,
        buildQty: 22000, rampWeeks: [800, 2400, 3900, 5100, 4800, 4200, 3600, 3200],
        channelMix: { amazon: 40, flipkart: 20, d2c: 30, retail: 10 }
      },
      aggressive: {
        label: "Aggressive", forecast: 26000, confidenceLow: 20800, confidenceHigh: 31200, confidence: 55,
        buildQty: 32000, rampWeeks: [1400, 4200, 6200, 7800, 7200, 6000, 5200, 4400],
        channelMix: { amazon: 35, flipkart: 25, d2c: 30, retail: 10 }
      }
    },
    postLaunch: [
      { week: "W1", planned: 800, actual: 920, variance: 15 },
      { week: "W2", planned: 2400, actual: 2150, variance: -10.4 },
      { week: "W3", planned: 3900, actual: 4100, variance: 5.1 },
      { week: "W4", planned: 5100, actual: null, variance: null },
    ],
    launchStatus: "launched", launchDate: "2025-03-15",
    labsRoadmapId: "RD-2025-001"
  },
  {
    sku: "NEW-HP-002", product: "Rockerz 650 Pro ANC", type: "New Product", category: "Headphones",
    featureSet: "Hybrid ANC, 40mm drivers, 60hr battery, dual pairing, foldable design, Type-C",
    asp: 3999,
    comparableSku: "SKU_021", comparableProduct: "Rockerz 550", similarity: 91,
    readinessScore: 88, readiness: { inventory: true, marketing: true, supplier: true, listing: true },
    successProbability: 85, successDrivers: ["Strong brand recall", "Proven form factor", "ANC upgrade demand"],
    riskType: "Cannibalization", riskReason: "Direct upgrade path from Rockerz 550",
    cannibalizationTarget: "Rockerz 550", cannibalizationPct: 24,
    priceElasticity: "Low", festivalDependency: "Low",
    benchmark: { competitor: "JBL Tune 770NC", priceGap: -15, batteryGap: 10, featureEdge: "40mm drivers" },
    scenarios: {
      conservative: {
        label: "Conservative", forecast: 9000, confidenceLow: 7650, confidenceHigh: 10350, confidence: 92,
        buildQty: 11000, rampWeeks: [400, 1200, 2100, 3000, 2700, 2200, 1800, 1500],
        channelMix: { amazon: 30, flipkart: 20, d2c: 40, retail: 10 }
      },
      base: {
        label: "Base", forecast: 12500, confidenceLow: 10600, confidenceHigh: 14400, confidence: 82,
        buildQty: 15000, rampWeeks: [600, 1800, 3200, 4500, 4100, 3800, 3500, 3100],
        channelMix: { amazon: 35, flipkart: 20, d2c: 35, retail: 10 }
      },
      aggressive: {
        label: "Aggressive", forecast: 18000, confidenceLow: 14400, confidenceHigh: 21600, confidence: 60,
        buildQty: 22000, rampWeeks: [1000, 3000, 5000, 6500, 5800, 5200, 4600, 4000],
        channelMix: { amazon: 30, flipkart: 25, d2c: 30, retail: 15 }
      }
    },
    postLaunch: [
      { week: "W1", planned: 600, actual: 580, variance: -3.3 },
      { week: "W2", planned: 1800, actual: 1950, variance: 8.3 },
      { week: "W3", planned: 3200, actual: null, variance: null },
    ],
    launchStatus: "launched", launchDate: "2025-04-01",
    labsRoadmapId: "RD-2025-002"
  },
  {
    sku: "NEW-SPK-003", product: "PartyPal 500 Speaker", type: "Trending SKU", category: "Speakers",
    featureSet: "80W output, RGB lights, wireless mic, 12hr battery, IPX5, TWS pairing",
    asp: 4999,
    comparableSku: "SKU_029", comparableProduct: "PartyPal 300", similarity: 79,
    readinessScore: 65, readiness: { inventory: true, marketing: false, supplier: false, listing: false },
    successProbability: 68, successDrivers: ["Party speaker segment growth", "Wedding season timing", "Bass-heavy trend"],
    riskType: "Seasonality", riskReason: "Depends heavily on festival & wedding season demand",
    cannibalizationTarget: "PartyPal 300", cannibalizationPct: 12,
    priceElasticity: "Medium", festivalDependency: "High (Diwali/Wedding)",
    benchmark: { competitor: "JBL Flip 6", priceGap: -12, batteryGap: 15, featureEdge: "RGB lights + mic" },
    scenarios: {
      conservative: {
        label: "Conservative", forecast: 6400, confidenceLow: 5440, confidenceHigh: 7360, confidence: 88,
        buildQty: 8000, rampWeeks: [250, 700, 1400, 2500, 3400, 3000, 2500, 2100],
        channelMix: { amazon: 25, flipkart: 15, d2c: 15, retail: 45 }
      },
      base: {
        label: "Base", forecast: 9200, confidenceLow: 7820, confidenceHigh: 10580, confidence: 72,
        buildQty: 11500, rampWeeks: [400, 1100, 2200, 3800, 5200, 4600, 3900, 3400],
        channelMix: { amazon: 30, flipkart: 15, d2c: 20, retail: 35 }
      },
      aggressive: {
        label: "Aggressive", forecast: 14500, confidenceLow: 11600, confidenceHigh: 17400, confidence: 50,
        buildQty: 18000, rampWeeks: [700, 2000, 3800, 6000, 8200, 7200, 6100, 5000],
        channelMix: { amazon: 30, flipkart: 20, d2c: 20, retail: 30 }
      }
    },
    postLaunch: [],
    launchStatus: "pre-launch", launchDate: "2025-06-01",
    labsRoadmapId: "RD-2025-003"
  },
  {
    sku: "RE-NB-004", product: "Rockerz 255 v3 (Re-entry)", type: "Re-entry", category: "Earbuds",
    featureSet: "13.6mm drivers, 40hr battery, ENx tech, ASAP Charge, IPX5, BT 5.3",
    asp: 1299,
    comparableSku: "SKU_005", comparableProduct: "Rockerz 255 v2", similarity: 95,
    readinessScore: 72, readiness: { inventory: false, marketing: true, supplier: false, listing: true },
    successProbability: 82, successDrivers: ["Proven demand history", "Budget segment leader", "Strong reviews"],
    riskType: "Supply", riskReason: "Previous version sold out during BBD — supply ramp critical",
    cannibalizationTarget: null, cannibalizationPct: 0,
    priceElasticity: "High", festivalDependency: "High (BBD/Republic Day)",
    benchmark: { competitor: "Realme Buds Wireless 3", priceGap: -5, batteryGap: -8, featureEdge: "Brand trust" },
    scenarios: {
      conservative: {
        label: "Conservative", forecast: 16000, confidenceLow: 13600, confidenceHigh: 18400, confidence: 92,
        buildQty: 20000, rampWeeks: [1600, 3500, 4800, 5200, 4900, 4000, 3500, 3000],
        channelMix: { amazon: 40, flipkart: 20, d2c: 10, retail: 30 }
      },
      base: {
        label: "Base", forecast: 22000, confidenceLow: 18700, confidenceHigh: 25300, confidence: 80,
        buildQty: 27000, rampWeeks: [2200, 4800, 6500, 7200, 6800, 5500, 4900, 4200],
        channelMix: { amazon: 45, flipkart: 20, d2c: 15, retail: 20 }
      },
      aggressive: {
        label: "Aggressive", forecast: 30000, confidenceLow: 24000, confidenceHigh: 36000, confidence: 58,
        buildQty: 37000, rampWeeks: [3200, 7000, 9200, 10000, 9400, 7500, 6600, 5600],
        channelMix: { amazon: 40, flipkart: 25, d2c: 15, retail: 20 }
      }
    },
    postLaunch: [],
    launchStatus: "pre-launch", launchDate: "2025-07-15",
    labsRoadmapId: "RD-2025-004"
  },
  {
    sku: "BDL-GM-005", product: "Immortal 350 Gaming TWS", type: "New Segment", category: "Earbuds",
    featureSet: "50ms latency, RGB breathing, 11mm drivers, 40hr battery, quad mic ENC, game mode",
    asp: 2499,
    comparableSku: "SKU_018", comparableProduct: "Immortal 121", similarity: 72,
    readinessScore: 58, readiness: { inventory: false, marketing: false, supplier: true, listing: false },
    successProbability: 55, successDrivers: ["Gaming audio growth", "Low latency demand", "Esports partnerships"],
    riskType: "Channel", riskReason: "Gaming niche — heavy online dependency, retail uncertain",
    cannibalizationTarget: "Immortal 121", cannibalizationPct: 8,
    priceElasticity: "Low", festivalDependency: "Medium (Gaming events)",
    benchmark: { competitor: "Redgear Shadow Vox", priceGap: 10, batteryGap: 25, featureEdge: "50ms latency" },
    scenarios: {
      conservative: {
        label: "Conservative", forecast: 5000, confidenceLow: 4250, confidenceHigh: 5750, confidence: 85,
        buildQty: 6500, rampWeeks: [200, 600, 1000, 1600, 1900, 2100, 1900, 1700],
        channelMix: { amazon: 45, flipkart: 25, d2c: 25, retail: 5 }
      },
      base: {
        label: "Base", forecast: 7500, confidenceLow: 6375, confidenceHigh: 8625, confidence: 68,
        buildQty: 9500, rampWeeks: [300, 900, 1600, 2400, 2800, 3100, 2900, 2600],
        channelMix: { amazon: 50, flipkart: 20, d2c: 25, retail: 5 }
      },
      aggressive: {
        label: "Aggressive", forecast: 12000, confidenceLow: 9600, confidenceHigh: 14400, confidence: 45,
        buildQty: 15000, rampWeeks: [600, 1800, 3200, 4500, 5000, 5400, 4800, 4200],
        channelMix: { amazon: 45, flipkart: 25, d2c: 25, retail: 5 }
      }
    },
    postLaunch: [],
    launchStatus: "pre-launch", launchDate: "2025-08-01",
    labsRoadmapId: "RD-2025-005"
  },
];
