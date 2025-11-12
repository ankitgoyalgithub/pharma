export interface AssortmentItem {
  sku: string;
  product_name: string;
  category: string;
  brand: string;
  current_stores: number;
  recommended_stores: number;
  action: 'Expand' | 'Maintain' | 'Reduce' | 'Discontinue' | 'Introduce';
  priority: 'High' | 'Medium' | 'Low';
  projected_revenue: number;
  margin_pct: number;
  confidence: number;
}

export const assortmentRecommendations: AssortmentItem[] = [
  {
    sku: 'SKU-A001',
    product_name: 'Premium Denim Jeans',
    category: 'Apparel - Bottoms',
    brand: 'StyleCo',
    current_stores: 45,
    recommended_stores: 68,
    action: 'Expand',
    priority: 'High',
    projected_revenue: 524800,
    margin_pct: 61.1,
    confidence: 94
  },
  {
    sku: 'SKU-A002',
    product_name: 'Cotton T-Shirt Basic',
    category: 'Apparel - Tops',
    brand: 'Essentials',
    current_stores: 82,
    recommended_stores: 82,
    action: 'Maintain',
    priority: 'Medium',
    projected_revenue: 412300,
    margin_pct: 66.0,
    confidence: 91
  },
  {
    sku: 'SKU-A003',
    product_name: 'Athletic Running Shoes',
    category: 'Footwear',
    brand: 'SportPro',
    current_stores: 58,
    recommended_stores: 75,
    action: 'Expand',
    priority: 'High',
    projected_revenue: 682500,
    margin_pct: 60.0,
    confidence: 89
  },
  {
    sku: 'SKU-A015',
    product_name: 'Vintage Graphic Tee',
    category: 'Apparel - Tops',
    brand: 'RetroWear',
    current_stores: 0,
    recommended_stores: 35,
    action: 'Introduce',
    priority: 'High',
    projected_revenue: 245600,
    margin_pct: 68.5,
    confidence: 82
  },
  {
    sku: 'SKU-A089',
    product_name: 'Formal Dress Pants',
    category: 'Apparel - Bottoms',
    brand: 'ClassicFit',
    current_stores: 62,
    recommended_stores: 28,
    action: 'Reduce',
    priority: 'Medium',
    projected_revenue: 156800,
    margin_pct: 58.2,
    confidence: 87
  },
  {
    sku: 'SKU-A124',
    product_name: 'Sequin Evening Clutch',
    category: 'Accessories',
    brand: 'GlamStyle',
    current_stores: 48,
    recommended_stores: 0,
    action: 'Discontinue',
    priority: 'Low',
    projected_revenue: 0,
    margin_pct: 52.1,
    confidence: 95
  }
];
