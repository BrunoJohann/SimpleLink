# 🖼️ Implementação de Upload de Logo

## 🎯 Solução Escolhida: Base64 Otimizado

### Por quê Base64?

**Vantagens para MVP:**

- ✅ Sem configuração extra (S3, Cloudinary, etc)
- ✅ Funciona imediatamente em produção
- ✅ Sem custos adicionais
- ✅ Sem dependências externas
- ✅ Backup automático com o banco
- ✅ Fácil de migrar para S3 depois

**Otimizações Implementadas:**

- ✅ Redimensiona para 200x200px
- ✅ Compressão JPEG com qualidade 80%
- ✅ Limite de 100KB
- ✅ Validação de formato e tamanho
- ✅ Preview em tempo real

## 📊 Comparação de Soluções

| Solução              | Complexidade | Custo        | Produção   | MVP              |
| -------------------- | ------------ | ------------ | ---------- | ---------------- |
| **Base64 otimizado** | ⭐ Baixa     | 💰 Grátis    | ✅ Sim     | ✅ Perfeito      |
| **S3/R2**            | ⭐⭐⭐ Alta  | 💰💰 Pago    | ✅ Sim     | ⚠️ Overkill      |
| **Vercel Blob**      | ⭐⭐ Média   | 💰💰 Pago    | ✅ Sim     | ⚠️ Pago          |
| **Cloudinary**       | ⭐⭐ Média   | 💰 Free tier | ✅ Sim     | ✅ Alternativa   |
| **URL externa**      | ⭐ Baixa     | 💰 Grátis    | ⚠️ Depende | ❌ Não confiável |

## 🛠️ Como Funciona

### 1. Upload no Cliente

```typescript
// components/LogoUpload.tsx
const handleFileSelect = async (file: File) => {
  // 1. Validar formato e tamanho
  const validation = validateImageFile(file)

  // 2. Otimizar imagem (redimensionar + comprimir)
  const optimizedBase64 = await optimizeLogoImage(file, 200, 0.8)

  // 3. Atualizar preview e form
  setPreview(optimizedBase64)
  onLogoChange(optimizedBase64)
}
```

### 2. Otimização Automática

```typescript
// lib/utils/image.ts
export async function optimizeLogoImage(file, maxSize, quality) {
  // 1. Ler arquivo
  // 2. Criar canvas
  // 3. Redimensionar mantendo aspect ratio
  // 4. Comprimir para JPEG
  // 5. Verificar tamanho final
  // 6. Se > 100KB, comprimir mais
  return base64
}
```

### 3. Salvar no Banco

```sql
-- Campo logo no modelo Store
logo String? @db.Text  -- Suporta até ~1MB de texto
```

### 4. Exibir na Loja

```typescript
// components/StoreHeader.tsx
const logoSrc = store.logo || store.owner.image || defaultLogo

<img src={logoSrc} alt={store.name} />
```

## 📏 Especificações Técnicas

### Validação

- **Formatos aceitos**: JPG, PNG, WebP
- **Tamanho máximo do arquivo**: 5MB (antes da otimização)
- **Tamanho final**: ~50-100KB (após otimização)

### Otimização

- **Dimensões**: 200x200px (mantém aspect ratio)
- **Formato de saída**: JPEG
- **Qualidade**: 80% (ajusta automaticamente se necessário)
- **Compressão recursiva**: Até atingir <100KB

### Armazenamento

- **Tipo**: TEXT no PostgreSQL
- **Formato**: data:image/jpeg;base64,/9j/4AAQ...
- **Tamanho médio**: 50-70KB
- **Limite do PostgreSQL**: ~1GB (mais que suficiente)

## 🚀 Aplicar no Banco

### 1. Aplicar migração

```bash
npm run db:push
```

Isso adiciona o campo `logo` na tabela `Store`.

### 2. Testar

1. Vá para `/dashboard/appearance`
2. Clique em "Upload Logo"
3. Selecione uma imagem
4. Veja o preview
5. Salve
6. Visite sua loja pública
7. Logo aparece no header! 🎉

## 🔄 Migração Futura para S3

Se quiser migrar para S3 no futuro:

```typescript
// lib/storage/s3.ts
export async function uploadToS3(file: File) {
  const optimized = await optimizeLogoImage(file, 400, 0.9)
  const blob = base64ToBlob(optimized)

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: blob,
  })

  return publicUrl
}

// Migração dos logos existentes
async function migrateLo gosToS3() {
  const stores = await prisma.store.findMany({
    where: { logo: { not: null } }
  })

  for (const store of stores) {
    const url = await uploadBase64ToS3(store.logo)
    await prisma.store.update({
      where: { id: store.id },
      data: { logo: url }
    })
  }
}
```

## 💡 Alternativas Consideradas

### Opção 1: Vercel Blob (Pago)

```typescript
import { put } from '@vercel/blob'

const blob = await put('logo.jpg', file, {
  access: 'public',
})

store.logo = blob.url
```

**Prós**: Fácil, integrado
**Contras**: Pago, vendor lock-in

### Opção 2: Cloudinary (Free tier)

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('upload_preset', 'your_preset')

const response = await fetch(
  'https://api.cloudinary.com/v1_1/your_cloud/image/upload',
  { method: 'POST', body: formData }
)

store.logo = response.url
```

**Prós**: Free tier generoso, CDN
**Contras**: Configuração extra, dependência externa

### Opção 3: S3/R2 (Pago)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

await s3Client.send(
  new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: `logos/${storeId}.jpg`,
    Body: buffer,
  })
)

store.logo = `https://cdn.example.com/logos/${storeId}.jpg`
```

**Prós**: Escalável, profissional
**Contras**: Complexo, pago, configuração

## ✅ Por Que Base64 é Melhor para MVP

1. **Zero configuração** - Funciona imediatamente
2. **Zero custo** - Sem serviços externos
3. **Zero dependências** - Sem SDKs extras
4. **Backup incluído** - Faz backup do banco = backup das logos
5. **Simples de testar** - Não precisa de credenciais
6. **Fácil de migrar** - Script simples para mover para S3

## 📈 Quando Migrar para S3?

Considere migrar quando:

- [ ] Tiver >1000 lojas
- [ ] Logos ficarem maiores (>200KB)
- [ ] Precisar de CDN global
- [ ] Quiser transformações dinâmicas
- [ ] Banco ficar muito grande (>10GB)

**Para MVP**: Base64 é perfeito! 🎯

## 🔧 Manutenção

### Limpar logos antigas (se necessário):

```sql
-- Ver tamanho total das logos
SELECT
  COUNT(*) as total_stores,
  SUM(LENGTH(logo)) / 1024 / 1024 as total_mb
FROM "Store"
WHERE logo IS NOT NULL;

-- Remover logos de lojas inativas
UPDATE "Store"
SET logo = NULL
WHERE "updatedAt" < NOW() - INTERVAL '6 months';
```

### Monitorar tamanho:

```typescript
// Script de monitoramento
const stores = await prisma.store.findMany({
  where: { logo: { not: null } },
  select: { id: true, logo: true },
})

const totalSize = stores.reduce((sum, store) => {
  return sum + (store.logo?.length || 0)
}, 0)

console.log(`Total logos: ${stores.length}`)
console.log(`Tamanho total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)
```

---

## ✅ Implementação Completa!

**O que foi adicionado:**

1. ✅ Campo `logo` no schema do Prisma
2. ✅ Validação no schema Zod
3. ✅ Componente `LogoUpload` com otimização
4. ✅ Utilitários de processamento de imagem
5. ✅ Preview em tempo real
6. ✅ Exibição no StoreHeader
7. ✅ Fallback para inicial do nome

**Próximo passo:**

```bash
npm run db:push
```

Depois teste em `/dashboard/appearance`! 🎉
