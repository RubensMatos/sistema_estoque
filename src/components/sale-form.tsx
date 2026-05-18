"use client";

import { useMemo, useState } from "react";
import { createSaleAction } from "@/app/actions";

type ClientItem = { id: number; name: string };
type ProductItem = { id: number; name: string; price: number; stock: number };
type SaleRow = { productId: number; quantity: number };

export function SaleForm({ clients, products }: { clients: ClientItem[]; products: ProductItem[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [rows, setRows] = useState<SaleRow[]>([]);

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const addProduct = () => {
    const id = Number(selectedProductId);
    if (!id) return;
    setRows((prev) => {
      if (prev.some((r) => r.productId === id)) return prev;
      return [...prev, { productId: id, quantity: 1 }];
    });
    setSelectedProductId("");
  };

  const removeRow = (productId: number) => {
    setRows((prev) => prev.filter((r) => r.productId !== productId));
  };

  const changeQty = (productId: number, quantity: number) => {
    const safeQty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
    setRows((prev) => prev.map((r) => (r.productId === productId ? { ...r, quantity: safeQty } : r)));
  };

  const total = useMemo(() => {
    return rows.reduce((acc, row) => {
      const p = productById.get(row.productId);
      if (!p) return acc;
      return acc + p.price * row.quantity;
    }, 0);
  }, [rows, productById]);

  return (
    <form action={createSaleAction} className="mt-3 space-y-3">
      <select name="clientId" className="input" required defaultValue="">
        <option value="" disabled>Selecione o cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>

      <div className="grid gap-2 md:grid-cols-[1fr_auto]">
        <select
          className="input"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Selecione o produto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} | R$ {p.price.toFixed(2)} | Estoque: {p.stock}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary" onClick={addProduct}>Adicionar produto</button>
      </div>

      <div className="card overflow-x-auto p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="py-2">Produto</th>
              <th className="py-2">Valor unit.</th>
              <th className="py-2">Estoque</th>
              <th className="py-2">Quantidade</th>
              <th className="py-2">Subtotal</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = productById.get(row.productId);
              if (!p) return null;
              const subtotal = p.price * row.quantity;

              return (
                <tr key={row.productId} className="border-b border-slate-100">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">R$ {p.price.toFixed(2)}</td>
                  <td className="py-2">{p.stock}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      min={1}
                      max={p.stock > 0 ? p.stock : undefined}
                      value={row.quantity}
                      onChange={(e) => changeQty(row.productId, Number(e.target.value))}
                      className="input max-w-28"
                    />
                    <input type="hidden" name="productId" value={row.productId} />
                    <input type="hidden" name="quantity" value={row.quantity} />
                  </td>
                  <td className="py-2 font-medium">R$ {subtotal.toFixed(2)}</td>
                  <td className="py-2">
                    <button type="button" className="rounded px-2 py-1 text-red-600 hover:bg-red-50" onClick={() => removeRow(row.productId)}>
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && <p className="text-muted py-3">Adicione produtos para montar a venda.</p>}
      </div>

      <div className="card flex items-center justify-between p-3">
        <p className="text-muted">Total da venda</p>
        <p className="text-xl font-bold">R$ {total.toFixed(2)}</p>
      </div>

      <button className="btn btn-primary" type="submit" disabled={rows.length === 0}>Finalizar venda</button>
    </form>
  );
}
