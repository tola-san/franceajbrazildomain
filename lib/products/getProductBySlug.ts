import path from "path";
import fs from "fs/promises";
import { Product } from "@/types/product";
import { isProductActive } from "@/lib/products/products";

export async function getProductBySlug(
  slug: string,
  locale: string = "en"
): Promise<Product | undefined> {
  const fileName = locale === 'pt-br' ? 'products-br.json' : 'products.json'
  const filePath = path.join(process.cwd(), "public", "api", fileName);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const products: Product[] = JSON.parse(data);
    // An inactive product must not be reachable, even by direct slug lookup.
    const product = products.find((product) => product.slug === slug);
    return product && isProductActive(product) ? product : undefined;
  } catch (error) {
    console.error(`[getProductBySlug] Error loading ${fileName}:`, error);
    return undefined;
  }
}
