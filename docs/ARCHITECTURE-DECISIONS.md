# 🏗️ Decisões de Arquitetura

## 📚 Padrões e Abordagens Utilizadas

### 1. Server Components vs Client Components

#### ✅ Abordagem Atual (Recomendada)

**Layout do Dashboard** - Server Component:

```typescript
// app/dashboard/layout.tsx
export default async function DashboardLayout() {
  const session = await getServerSession(authOptions)
  const store = await storeRepo.findFirstByOwnerId(session.user.id)

  return (
    <StoreProvider store={store}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </StoreProvider>
  )
}
```

**Vantagens:**

- ✅ Dados buscados no servidor (mais rápido)
- ✅ Sem loading states desnecessários
- ✅ Sem chamadas fetch extras
- ✅ SEO friendly
- ✅ Melhor performance

**Header** - Client Component com Context:

```typescript
// components/DashboardHeader.tsx
export function DashboardHeader() {
  const { store } = useStore() // Dados vêm do Server Component
  return <header>...</header>
}
```

#### ❌ Abordagem Anterior (Não Recomendada)

```typescript
// Buscar dados no cliente com fetch
useEffect(() => {
  fetch('/api/user/store')
    .then(res => res.json())
    .then(data => setStore(data))
}, [])
```

**Desvantagens:**

- ❌ Requisição extra (waterfall)
- ❌ Loading state necessário
- ❌ Mais lento
- ❌ Mais código

### 2. Compartilhar Dados entre Componentes

#### ✅ React Context (Atual)

```typescript
// Server Component busca dados
const store = await storeRepo.findFirstByOwnerId(userId)

// Passa via Context para Client Components
<StoreProvider store={store}>
  <ClientComponent /> {/* Pode usar useStore() */}
</StoreProvider>
```

**Vantagens:**

- ✅ Dados buscados uma vez no servidor
- ✅ Compartilhados com todos os componentes filhos
- ✅ Sem props drilling
- ✅ Type-safe

#### ❌ Alternativas Não Usadas

**Props Drilling:**

```typescript
<Header store={store} />
<Sidebar store={store} />
<Content store={store} />
```

- ❌ Verboso
- ❌ Difícil de manter

**Fetch em cada componente:**

```typescript
// Cada componente faz seu próprio fetch
useEffect(() => {
  fetch('/api/store')
}, [])
```

- ❌ Múltiplas requisições
- ❌ Lento
- ❌ Desperdício de recursos

### 3. Autenticação e Middleware

#### ✅ Verificação de Cookie (Atual)

```typescript
// middleware.ts
const sessionToken = request.cookies.get('next-auth.session-token')?.value
const isAuth = !!sessionToken
```

**Por quê?**

- ✅ Funciona com `strategy: 'database'`
- ✅ Simples e direto
- ✅ Não precisa descriptografar JWT

#### ❌ JWT Token (Não Funciona)

```typescript
// NÃO FUNCIONA com strategy: 'database'
const token = await getToken({ req: request })
```

**Por quê não?**

- ❌ `getToken` é para `strategy: 'jwt'`
- ❌ Com database strategy, usa cookies de sessão
- ❌ Causava o bug de redirecionamento

### 4. Serialização de Dados

#### ✅ Helper de Serialização (Atual)

```typescript
// lib/utils/serialize.ts
export function serializeProduct(product) {
  return {
    ...product,
    price: product.price ? Number(product.price) : null,
  }
}
```

**Por quê?**

- ✅ Prisma Decimal não é serializável para Client Components
- ✅ Converte para number antes de passar
- ✅ Evita erros de hidratação

#### ❌ Passar Decimal Direto (Erro)

```typescript
// ERRO: Decimal objects are not supported
<ClientComponent product={product} />
```

### 5. Estrutura de Pastas

#### ✅ Feature-based (Atual)

```
app/
  dashboard/
    page.tsx
    layout.tsx
    products/
      page.tsx
      new/page.tsx
      [id]/page.tsx
lib/
  repos/        # Data access layer
  validation/   # Zod schemas
  contexts/     # React contexts
```

**Vantagens:**

- ✅ Organizado por feature
- ✅ Fácil de encontrar código relacionado
- ✅ Escalável

## 🎓 Lições Aprendidas

### 1. Server Components são o Padrão

No Next.js 15 App Router:

- **Padrão**: Server Components
- **Exceção**: Client Components (quando precisa de interatividade)

```typescript
// Server Component (padrão)
export default async function Page() {
  const data = await fetchData() // Busca no servidor
  return <div>{data}</div>
}

// Client Component (quando necessário)
'use client'
export function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={...}>...</button>
}
```

### 2. Buscar Dados no Servidor

**Sempre que possível:**

- ✅ Buscar dados em Server Components
- ✅ Passar para Client Components via props ou context
- ❌ Evitar fetch em useEffect

**Exceções:**

- Dados que mudam frequentemente
- Dados baseados em interação do usuário
- Polling/real-time updates

### 3. NextAuth com Database Strategy

**Importante:**

- `strategy: 'database'` → Usa cookies de sessão
- `strategy: 'jwt'` → Usa JWT tokens
- Middleware deve verificar o tipo correto!

### 4. Hidratação e Extensões

**Problema:**

```
Hydration failed because the server rendered HTML didn't match the client
```

**Causas comuns:**

1. Extensões do navegador (mais comum)
2. `Date.now()` ou `Math.random()`
3. Formatação de data/hora
4. HTML inválido

**Solução:**

```typescript
<html suppressHydrationWarning>
  <body suppressHydrationWarning>
```

## 📊 Comparação de Abordagens

### Buscar Dados da Loja

| Abordagem                      | Performance | Complexidade | Recomendado           |
| ------------------------------ | ----------- | ------------ | --------------------- |
| **Server Component + Context** | ⭐⭐⭐⭐⭐  | ⭐⭐⭐       | ✅ Sim                |
| **Client fetch em useEffect**  | ⭐⭐        | ⭐⭐⭐⭐     | ❌ Não                |
| **Server Action**              | ⭐⭐⭐⭐    | ⭐⭐⭐⭐     | ✅ Alternativa        |
| **Props drilling**             | ⭐⭐⭐⭐⭐  | ⭐           | ⚠️ Para poucos níveis |

### Autenticação no Middleware

| Abordagem                      | Funciona com DB? | Funciona com JWT? | Recomendado          |
| ------------------------------ | ---------------- | ----------------- | -------------------- |
| **Verificar cookie de sessão** | ✅ Sim           | ❌ Não            | ✅ Para DB strategy  |
| **getToken() do JWT**          | ❌ Não           | ✅ Sim            | ✅ Para JWT strategy |
| **withAuth middleware**        | ✅ Sim           | ✅ Sim            | ⚠️ Menos controle    |

## 🎯 Recomendações Gerais

### Para Dados que Mudam Raramente

```typescript
// ✅ Buscar no Server Component
export default async function Page() {
  const data = await repo.getData()
  return <ClientComponent data={data} />
}
```

### Para Dados que Mudam Frequentemente

```typescript
// ✅ Usar SWR ou React Query
'use client'
import useSWR from 'swr'

export function Component() {
  const { data } = useSWR('/api/data', fetcher)
  return <div>{data}</div>
}
```

### Para Ações do Usuário

```typescript
// ✅ Usar Server Actions
'use server'
export async function updateProduct(formData: FormData) {
  const data = await repo.update(...)
  revalidatePath('/dashboard/products')
  return { success: true }
}
```

## 📖 Recursos

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [NextAuth.js Database Strategy](https://next-auth.js.org/configuration/options#session)
- [React Context](https://react.dev/reference/react/useContext)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Resumo**: A abordagem atual (Server Component + Context) é a mais performática e recomendada para Next.js 15! 🚀
