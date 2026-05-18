import Link from "next/link";
import { registerUserAction } from "@/app/actions";

export default function RegisterPage() {
  return (
    <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold">Cadastro de Usuário</h1>
        <form action={registerUserAction} className="card mt-6 space-y-3 p-5">
          <input name="name" placeholder="Nome" className="input" required />
          <input name="email" type="email" placeholder="E-mail" className="input" required />
          <input name="password" type="password" placeholder="Senha (mínimo 6)" className="input" required />
          <button type="submit" className="btn btn-primary w-full">Criar conta</button>
        </form>
        <p className="text-muted mt-4 text-sm">
          Já possui conta? <Link className="underline" href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
