import { ReactNode } from "react";
import { logoutAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <main className="w-full px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Estoque</h1>
          <p className="text-muted text-sm">Usuário logado: {user.name}</p>
        </div>
        <form action={logoutAction}>
          <button className="btn card" type="submit">Sair</button>
        </form>
      </header>

      <div className="grid gap-4 lg:gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
