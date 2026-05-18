# Guia de Clonagem para Novo Cliente

Este guia permite criar uma nova instância do sistema para outro cliente, com:
- repositório próprio
- banco Supabase próprio
- deploy próprio (Vercel)

Objetivo: isolar código, dados e acessos entre clientes.

## 1) Estratégia recomendada

Para cliente novo, o mais correto é:
1. Criar um novo repositório (privado ou público)
2. Subir o mesmo código-base
3. Criar novo projeto Supabase (banco separado)
4. Aplicar o schema Prisma no banco novo
5. Configurar `DATABASE_URL` no ambiente local e na Vercel
6. Publicar em um link próprio

Isso evita mistura de dados e reduz risco de segurança.

## 2) Pré-requisitos

- Git + SSH no GitHub
- Node.js 20+
- npm
- Conta Supabase
- Conta Vercel (plano gratuito atende)

## 3) Clonar código para novo cliente

### Opção A (novo repo vazio no GitHub)

```bash
# 1. Clone o projeto base
git clone git@github.com:RubensMatos/sistema_estoque.git sistema_estoque_cliente
cd sistema_estoque_cliente

# 2. Remova histórico antigo e inicie novo histórico
rm -rf .git
git init
git branch -M main

# 3. Adicione repo do cliente
git remote add origin git@github.com:<OWNER>/<NOVO_REPO>.git

# 4. Commit inicial
git add .
git commit -m "chore: bootstrap sistema_estoque para novo cliente"
git push -u origin main
```

### Opção B (mantendo histórico)

```bash
git clone git@github.com:RubensMatos/sistema_estoque.git sistema_estoque_cliente
cd sistema_estoque_cliente
git remote remove origin
git remote add origin git@github.com:<OWNER>/<NOVO_REPO>.git
git push -u origin main
```

## 4) Criar banco novo no Supabase

1. Criar novo projeto no Supabase
2. Copiar `DATABASE_URL` do projeto novo
3. Criar `.env` e `.env.local` com a URL nova

Exemplo:

```env
DATABASE_URL="postgresql://postgres:<SENHA_URL_ENCODED>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require"
```

## 5) Aplicar schema no banco novo

```bash
npm install
npx prisma generate
npx prisma db push
```

Isso cria tabelas de:
- usuários/sessões
- clientes
- produtos
- estoque
- vendas/itens

## 6) Rodar localmente

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Acesso:
- http://localhost:3000

## 7) Criar usuário admin inicial (opcional, recomendado)

```bash
node << 'EONODE'
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const email = 'admin@cliente.com';
  const password = 'Admin@123';
  const name = 'Administrador';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('Usuário já existe:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  console.log('Usuário criado:', user.id, email);
})()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
EONODE
```

## 8) Publicar na Vercel (grátis)

1. Importar novo repositório na Vercel
2. Adicionar variável `DATABASE_URL`
3. Deploy

Sugestão de ambientes:
- Production
- Preview
- Development

## 9) Checklist de entrega para cliente

- [ ] Repo do cliente criado
- [ ] Banco Supabase do cliente criado
- [ ] `DATABASE_URL` apontando para banco do cliente
- [ ] Prisma aplicado (`db push`)
- [ ] Admin inicial criado
- [ ] Deploy público funcionando
- [ ] Login validado
- [ ] Cadastro cliente/produto validado
- [ ] Estoque validado
- [ ] Venda com baixa automática validada

## 10) Boas práticas de segurança

- Nunca compartilhar `DATABASE_URL` em canais públicos
- Usar projeto Supabase separado por cliente
- Revogar tokens expostos acidentalmente
- Evitar reaproveitar usuário admin entre clientes
- Se possível, usar repositórios privados por cliente

## 11) Sobre migrações futuras

Quando o projeto evoluir, prefira:

```bash
npx prisma migrate dev --name <nome_da_migracao>
```

Para produção, aplicar migrações versionadas melhora rastreabilidade.
