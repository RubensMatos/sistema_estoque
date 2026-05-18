# Sistema de Estoque (Projeto de Faculdade)

Sistema web para controle de clientes, produtos, estoque e vendas, com baixa automática de estoque após cada venda.

## 1. Visão Geral

Este projeto foi desenvolvido para uso acadêmico, com foco em:
- Organização clara das telas
- Fluxo de vendas viável para operação real
- Regras de estoque confiáveis
- Código simples de manter e evoluir

## 2. Stack e Tecnologias

- Frontend + Backend web: `Next.js 16` (App Router)
- Linguagem: `TypeScript`
- Estilização: `Tailwind CSS`
- Banco de dados: `PostgreSQL (Supabase)`
- ORM: `Prisma`
- Autenticação local: sessão com cookie HTTP-only
- Hash de senha: `bcryptjs`

## 3. Funcionalidades Implementadas

### 3.1 Autenticação
- Cadastro de usuário
- Login
- Logout
- Sessão persistida por cookie seguro para uso local

### 3.2 Clientes
- Cadastro de cliente
- Edição de cliente
- Campos: nome, e-mail, telefone

### 3.3 Produtos
- Cadastro de produto
- Edição de produto
- Campo de valor com máscara monetária BRL (`1.234,56`)
- Limpeza automática dos campos após cadastrar produto

### 3.4 Estoque
- Visualização do estoque por produto
- Edição manual de quantidade por produto

### 3.5 Vendas
- Seleção de cliente via dropdown
- Seleção de produtos via dropdown
- Montagem de grade de itens da venda
- Edição de quantidade por item
- Cálculo de subtotal por item e total da venda em tempo real
- Registro de venda com itens
- Baixa automática de estoque ao finalizar venda

## 4. Estrutura de Telas

### Layout principal
- Sidebar com menu:
  - Lançamento de Vendas
  - Cadastro de Clientes
  - Cadastro de Produtos
  - Visualização de Estoque

### Página principal
- `/` redireciona para `/vendas`

### Rotas da aplicação
- `/login`
- `/cadastro-usuario`
- `/vendas`
- `/clientes`
- `/produtos`
- `/estoque`

## 5. Modelo de Dados (Prisma)

Principais entidades:
- `User`: usuários do sistema
- `Session`: sessão autenticada
- `Client`: clientes
- `Product`: produtos
- `StockItem`: estoque (1:1 com produto)
- `Sale`: cabeçalho da venda
- `SaleItem`: itens da venda

Regra crítica:
- Toda venda grava `Sale` + `SaleItem` e decrementa `StockItem` na mesma transação.

## 6. Padrões de Desenvolvimento

- Server Actions para operações de escrita
- Separação por domínio de tela (`clientes`, `produtos`, `estoque`, `vendas`)
- Componentes reutilizáveis para UI específica (`MoneyInput`, `SaleForm`, `Sidebar`)
- Validação básica de entradas no backend (tipos e limites)
- Revalidação das rotas afetadas após cada alteração (`revalidatePath`)

## 7. Como Rodar Localmente

## Pré-requisitos
- Node.js 20+
- npm
- Acesso ao banco Supabase

## Instalação
```bash
npm install
```

## Variáveis de ambiente
Criar `.env` e `.env.local` com:
```env
DATABASE_URL="postgresql://<usuario>:<senha>@<host>:5432/postgres?sslmode=require"
```

## Prisma
```bash
npx prisma generate
npx prisma db push
```

## Desenvolvimento
```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## Qualidade
```bash
npm run lint
npm run build
```

## 8. Fluxo Operacional Recomendado

1. Cadastrar usuário (primeiro acesso)
2. Login no sistema
3. Cadastrar clientes
4. Cadastrar produtos
5. Ajustar estoque inicial
6. Lançar vendas
7. Conferir baixa automática na tela de estoque

## 9. Testes Funcionais Realizados

Validação funcional executada no banco com script automatizado:
- Criar cliente: OK
- Editar cliente: OK
- Criar produto: OK
- Editar produto: OK
- Ajustar estoque: OK
- Criar venda: OK
- Baixa automática de estoque: OK (`12 -> 9` em teste de venda)

Também executado:
- `npm run lint`: OK
- `npm run build`: OK (com intermitência eventual de conexão Supabase durante coleta de dados)

## 10. Organização de Código (resumo)

- `src/app/actions.ts`: ações de cadastro, edição, estoque e vendas
- `src/app/(app)/layout.tsx`: layout autenticado + sidebar
- `src/app/(app)/vendas/page.tsx`: página de vendas
- `src/components/sale-form.tsx`: grade dinâmica de itens da venda
- `src/components/money-input.tsx`: máscara monetária
- `src/components/products-manager.tsx`: cadastro/edição de produtos
- `prisma/schema.prisma`: modelo do banco

## 11. Observações Acadêmicas

Projeto desenvolvido para estudo e prática de:
- Arquitetura full-stack com Next.js
- Modelagem relacional
- Regras transacionais de estoque
- UI/UX orientada a operação

## 12. Próximas Melhorias (opcional)

- Feedback visual de erro/sucesso nas ações
- Filtro e busca em listagens
- Controle de perfil/permissão por usuário
- Relatórios de vendas por período
- Exportação CSV/PDF

## 13. Guia de Clone para Novos Clientes

Para replicar este sistema para outro cliente (código + banco + deploy), use:

- [docs/CLONE_CLIENTE.md](docs/CLONE_CLIENTE.md)
