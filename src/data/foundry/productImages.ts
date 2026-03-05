// Product thumbnail images - boAt consumer electronics
import b1 from "@/assets/products/b1.jpg";
import b2 from "@/assets/products/b2.webp";
import b3 from "@/assets/products/b3.webp";
import b4 from "@/assets/products/b4.jpg";
import b5 from "@/assets/products/b5.jpg";
import b6 from "@/assets/products/b6.jpg";
import b7 from "@/assets/products/b7.jpg";
import b8 from "@/assets/products/b8.webp";
import b9 from "@/assets/products/b9.jpg";
import b10 from "@/assets/products/b10.webp";

// Category-based image assignment
const categoryImages: Record<string, string[]> = {
  "Earbuds": [b1, b2, b3, b4],
  "Headphones": [b5, b6],
  "Speakers": [b9, b10],
  "Wearables": [b7, b8],
};

// Deterministic image for a given SKU based on category
export const getProductImage = (sku: string, category: string): string => {
  const images = categoryImages[category] || [b1];
  const skuNum = parseInt(sku.replace("SKU_", ""), 10) || 0;
  return images[skuNum % images.length];
};

// Pre-mapped images for all 50 SKUs
import { productMasterData } from "./productMasterData";

export const productImageMap: Record<string, string> = {};
productMasterData.forEach((p) => {
  productImageMap[p.id] = getProductImage(p.id, p.category);
});
