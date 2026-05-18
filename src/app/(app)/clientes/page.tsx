import { createClientAction, updateClientAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <form action={createClientAction} className="card space-y-2 p-4">
        <h2 className="font-semibold">Cadastro de cliente</h2>
        <input name="name" className="input" placeholder="Nome" required />
        <input name="email" type="email" className="input" placeholder="E-mail" required />
        <input name="phone" className="input" placeholder="Telefone" required />
        <button className="btn btn-primary" type="submit">Salvar cliente</button>
      </form>

      <div className="card p-4">
        <h3 className="mb-3 font-semibold">Clientes cadastrados</h3>
        <div className="space-y-2">
          {clients.map((c) => (
            <form key={c.id} action={updateClientAction} className="rounded-lg border border-slate-200 p-3">
              <input type="hidden" name="id" value={c.id} />
              <div className="grid gap-2 md:grid-cols-3">
                <input name="name" defaultValue={c.name} className="input" required />
                <input name="email" type="email" defaultValue={c.email} className="input" required />
                <input name="phone" defaultValue={c.phone} className="input" required />
              </div>
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
