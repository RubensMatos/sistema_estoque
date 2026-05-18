"use client";

import { useRef, useState } from "react";
import { createProductAction, updateProductAction } from "@/app/actions";
import { MoneyInput } from "@/components/money-input";
import { formatBRL } from "@/lib/currency";

type ProductView = { id: number; name: string; price: number };

export function ProductsManager({ products }: { products: ProductView[] }) {
  const createFormRef = useRef<HTMLFormElement>(null);
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <div className="space-y-4">
      <form
        ref={createFormRef}
        action={async (formData) => {
          await createProductAction(formData);
          createFormRef.current?.reset();
          setResetSignal((v) => v + 1);
        }}
        className="card space-y-2 p-4"
      >
        <h2 className="font-semibold">Cadastro de produtos</h2>
        <input name="name" className="input" placeholder="Nome do produto" required />
        <MoneyInput key={`create-price-${resetSignal}`} name="price" defaultValue={0} />
        <button className="btn btn-primary" type="submit">Salvar produto</button>
      </form>

      <div className="card p-4">
        <h3 className="mb-3 font-semibold">Produtos cadastrados</h3>
        <div className="space-y-2">
          {products.map((p) => (
            <form key={p.id} action={updateProductAction} className="rounded-lg border border-slate-200 p-3">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-2 md:grid-cols-2">
                <input name="name" defaultValue={p.name} className="input" required />
                <MoneyInput name="price" defaultValue={p.price} />
              </div>
              <p className="text-muted mt-2 text-sm">Valor atual: {formatBRL(p.price)}</p>
              <div className="mt-2">
                <button className="btn btn-primary" type="submit">Salvar edição</button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
