import Link from "next/link";

const items = [
  { href: "/vendas", label: "Lançamento de Vendas" },
  { href: "/clientes", label: "Cadastro de Clientes" },
  { href: "/produtos", label: "Cadastro de Produtos" },
  { href: "/estoque", label: "Visualização de Estoque" },
];

export function Sidebar() {
  return (
    <aside className="card h-fit p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Menu</h2>
      <nav className="grid gap-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
