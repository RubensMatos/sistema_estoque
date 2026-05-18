import Link from "next/link";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  return (
    <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <form action={loginAction} className="card mt-6 space-y-3 p-5">
          <input name="email" type="email" placeholder="E-mail" className="input" required />
          <input name="password" type="password" placeholder="Senha" className="input" required />
          <button type="submit" className="btn btn-primary w-full">Entrar</button>
        </form>
        <p className="text-muted mt-4 text-sm">
          Não possui conta? <Link className="underline" href="/cadastro-usuario">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}
