# 🔄 Fetch vs Server Actions - Quando Usar Cada Um

## 🎯 Resumo Rápido

### ✅ Usar `fetch` em Client Components (Atual nos Forms)

**Para**: Formulários complexos com validação client-side, múltiplas requisições, controle de loading

### ✅ Usar Server Actions

**Para**: Formulários simples, mutations diretas, progressive enhancement

## 📊 Análise dos Casos Atuais

### Caso 1: ProductForm.tsx

```typescript
const onSubmit = async (data: CreateProductInput) => {
  // 1. Criar/atualizar produto
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  })

  // 2. Atualizar links de afiliados
  const linksResponse = await fetch(`/api/products/${productId}/links`, {
    method: 'PUT',
    body: JSON.stringify(validatedLinks),
  })

  // 3. Redirecionar
  router.push('/dashboard/products')
}
```

#### ✅ **Fetch está CORRETO aqui!**

**Por quê?**

1. **Múltiplas requisições sequenciais** - Cria produto, depois atualiza links
2. **Validação complexa** - React Hook Form + Zod no cliente
3. **Estados intermediários** - Loading, success, error
4. **Controle fino** - Pode cancelar, retry, etc
5. **Feedback imediato** - Mensagens de erro específicas

#### ⚠️ **Server Action seria mais complexo:**

```typescript
// Teria que fazer tudo em uma ação
'use server'
async function createProductWithLinks(formData: FormData) {
  // 1. Parse form data
  // 2. Validar
  // 3. Criar produto
  // 4. Criar links
  // 5. Revalidar
  // Mais difícil de gerenciar estados intermediários
}
```

### Caso 2: AppearanceForm.tsx

```typescript
const onSubmit = async (data: UpdateStoreInput) => {
  const response = await fetch(`/api/stores/${store.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  router.refresh()
}
```

#### ⚠️ **Aqui poderia usar Server Action!**

Este é um caso mais simples onde Server Action seria igualmente bom:

```typescript
// ✅ Alternativa com Server Action
'use server'
async function updateStoreAppearance(storeId: string, data: UpdateStoreInput) {
  await storeRepo.update(storeId, data)
  revalidatePath('/dashboard/appearance')
  return { success: true }
}

// No componente
const onSubmit = async (data: UpdateStoreInput) => {
  const result = await updateStoreAppearance(store.id, data)
  if (result.success) {
    setSuccess('Salvo!')
  }
}
```

**Mas fetch também está OK porque:**

- Já tem a API route criada
- Consistente com outros forms
- Funciona perfeitamente

## 🎓 Quando Usar Cada Abordagem

### ✅ Use `fetch` em Client Components quando:

1. **Formulários complexos com React Hook Form**

   ```typescript
   const { handleSubmit } = useForm()
   const onSubmit = async data => {
     await fetch('/api/endpoint', {
       method: 'POST',
       body: JSON.stringify(data),
     })
   }
   ```

2. **Múltiplas requisições sequenciais**

   ```typescript
   await fetch('/api/step1')
   await fetch('/api/step2')
   await fetch('/api/step3')
   ```

3. **Controle fino de loading/error states**

   ```typescript
   setIsLoading(true)
   try {
     await fetch(...)
     setSuccess('Sucesso!')
   } catch {
     setError('Erro!')
   }
   ```

4. **Validação complexa no cliente**

   ```typescript
   const validated = schema.parse(data)
   await fetch('/api/endpoint', { body: JSON.stringify(validated) })
   ```

5. **Feedback imediato e específico**
   ```typescript
   if (!response.ok) {
     const error = await response.json()
     setError(error.message) // Mensagem específica
   }
   ```

### ✅ Use Server Actions quando:

1. **Formulários simples**

   ```typescript
   <form action={createProduct}>
     <input name="title" />
     <button type="submit">Criar</button>
   </form>
   ```

2. **Progressive enhancement** (funciona sem JS)

   ```typescript
   'use server'
   async function createProduct(formData: FormData) {
     const title = formData.get('title')
     await repo.create({ title })
     redirect('/dashboard')
   }
   ```

3. **Mutations simples e diretas**

   ```typescript
   'use server'
   async function deleteProduct(id: string) {
     await repo.delete(id)
     revalidatePath('/dashboard/products')
   }
   ```

4. **Quando não precisa de estados intermediários**
   ```typescript
   // Sem loading, success, error states
   async function action() {
     await repo.update(...)
     revalidatePath('/')
   }
   ```

## 📋 Decisão para Este Projeto

### ✅ Mantemos `fetch` nos Forms porque:

1. **React Hook Form** - Já usa validação no cliente
2. **Estados complexos** - Loading, success, error, validação
3. **Múltiplas etapas** - Produto + Links em sequência
4. **Feedback rico** - Mensagens específicas de erro
5. **Consistência** - Todos os forms usam o mesmo padrão

### 🔄 Poderia Refatorar para Server Actions?

**Sim**, mas seria mais trabalho e não traria benefícios significativos:

```typescript
// Versão com Server Action (mais código)
'use server'
async function createProductAction(
  data: CreateProductInput,
  links: AffiliateLinkInput[]
) {
  const validated = createProductSchema.parse(data)
  const validatedLinks = updateAffiliateLinksSchema.parse({ links })

  const product = await productRepo.create(validated)
  await productRepo.updateLinks(product.id, validatedLinks)

  revalidatePath('/dashboard/products')
  return { success: true, productId: product.id }
}

// No componente (ainda precisa de estados)
const onSubmit = async (data: CreateProductInput) => {
  setIsLoading(true)
  try {
    const result = await createProductAction(data, links)
    setSuccess('Criado!')
    router.push('/dashboard/products')
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

**Não vale a pena porque:**

- ❌ Mais código
- ❌ Mesma quantidade de estados
- ❌ Sem benefícios de performance
- ❌ Perde tipagem automática da API

## 🎯 Recomendação Final

### Para Este Projeto:

| Componente          | Abordagem Atual  | Recomendação | Motivo                     |
| ------------------- | ---------------- | ------------ | -------------------------- |
| **ProductForm**     | `fetch`          | ✅ Manter    | Complexo, múltiplas etapas |
| **AppearanceForm**  | `fetch`          | ✅ Manter    | Consistência, funciona bem |
| **DashboardHeader** | Context          | ✅ Perfeito  | Dados do servidor          |
| **Buscar dados**    | Server Component | ✅ Perfeito  | Performance                |

### Para Futuros Recursos:

**Use Server Actions para:**

- Botões de ação simples (delete, publish/unpublish)
- Formulários sem validação complexa
- Operações que não precisam feedback detalhado

**Use fetch para:**

- Formulários com React Hook Form
- Validação complexa no cliente
- Múltiplas requisições
- Estados de UI complexos

## 💡 Exemplo Prático: Delete Product

### Com Server Action (✅ Recomendado para delete):

```typescript
'use server'
async function deleteProduct(id: string) {
  await productRepo.delete(id)
  revalidatePath('/dashboard/products')
}

// No componente
<Button onClick={() => deleteProduct(product.id)}>
  Deletar
</Button>
```

### Com fetch (⚠️ Mais verboso):

```typescript
const handleDelete = async () => {
  setIsLoading(true)
  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    router.refresh()
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

## 📖 Recursos

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Hook Form](https://react-hook-form.com/)
- [When to use Server Actions vs API Routes](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#when-to-use-server-actions)

---

## ✅ Conclusão

**O uso de `fetch` nos formulários está CORRETO e é a melhor escolha para este caso!**

- ✅ ProductForm: fetch é perfeito (complexo, múltiplas etapas)
- ✅ AppearanceForm: fetch está OK (consistência)
- ✅ DashboardHeader: Context é perfeito (dados do servidor)

**Não precisa refatorar!** A arquitetura atual é sólida e segue as melhores práticas do Next.js 15. 🚀
