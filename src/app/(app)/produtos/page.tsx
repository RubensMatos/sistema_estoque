import { ProductsManager } from "@/components/products-manager";
import { prisma } from "@/lib/prisma";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return <ProductsManager products={products.map((p) => ({ id: p.id, name: p.name, price: Number(p.price) }))} />;
}
