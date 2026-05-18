import { adjustStockAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export default async function EstoquePage() {
  const products = await prisma.product.findMany({ include: { stockItem: true }, orderBy: { name: "asc" } });

  return (
    <div className="card p-4">
      <h2 className="font-semibold">Visualização e ajuste de estoque</h2>
      <div className="mt-3 grid gap-3">
        {products.map((product) => (
          <form key={product.id} action={adjustStockAction} className="card grid grid-cols-1 gap-2 p-3 md:grid-cols-4 md:items-center">
            <input type="hidden" name="productId" value={product.id} />
            <div className="md:col-span-2">
              <p className="font-medium">{product.name}</p>
              <p className="text-muted text-sm">R$ {Number(product.price).toFixed(2)}</p>
            </div>
            <input name="quantity" type="number" min="0" defaultValue={product.stockItem?.quantity ?? 0} className="input" required />
            <button className="btn btn-primary" type="submit">Atualizar</button>
          </form>
        ))}
      </div>
    </div>
  );
}
