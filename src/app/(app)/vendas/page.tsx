import { prisma } from "@/lib/prisma";
import { SaleForm } from "@/components/sale-form";

export default async function VendasPage() {
  const [clients, products, sales] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ include: { stockItem: true }, orderBy: { name: "asc" } }),
    prisma.sale.findMany({ include: { client: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <h2 className="font-semibold">Lançamento de venda</h2>
        <SaleForm
          clients={clients.map((c) => ({ id: c.id, name: c.name }))}
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            stock: p.stockItem?.quantity ?? 0,
          }))}
        />
      </section>

      <section className="card p-4">
        <h2 className="font-semibold">Últimas vendas</h2>
        <div className="mt-3 space-y-3">
          {sales.map((sale) => (
            <div key={sale.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">Venda #{sale.id} - {sale.client.name} - R$ {Number(sale.total).toFixed(2)}</p>
              <ul className="mt-1 text-sm text-neutral-700">
                {sale.items.map((item) => (
                  <li key={item.id}>{item.product.name} x {item.quantity} = R$ {Number(item.totalPrice).toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
