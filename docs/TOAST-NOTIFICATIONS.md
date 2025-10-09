# 🔔 Sistema de Notificações Toast

## 📋 Visão Geral

Implementamos um sistema de notificações toast (popups) usando **Radix UI Toast** para fornecer feedback visual elegante e não-intrusivo ao usuário.

---

## 🎯 Características

✅ **Notificações Elegantes**: Popups animados que aparecem no canto da tela  
✅ **Variantes de Estilo**: Success (verde), Error (vermelho), Default (cinza)  
✅ **Botão X Visível**: Sempre visível com cores contextuais para cada tipo  
✅ **Gap entre Toasts**: Espaçamento de 8px entre múltiplos toasts  
✅ **Auto-dismiss**: Desaparecem automaticamente após 5 segundos  
✅ **Empilhamento**: Até 5 toasts podem aparecer simultaneamente  
✅ **Acessível**: Totalmente acessível via teclado e screen readers  
✅ **Responsivo**: Funciona perfeitamente em mobile e desktop

---

## 🚀 Como Usar

### 1. Import do Hook

```typescript
import { useToast } from '@/hooks/use-toast'
```

### 2. Usar no Componente

```typescript
'use client'

import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: '✅ Sucesso!',
      description: 'Operação concluída com sucesso!',
    })
  }

  const handleError = () => {
    toast({
      variant: 'destructive',
      title: '❌ Erro',
      description: 'Algo deu errado. Tente novamente.',
    })
  }

  const handleInfo = () => {
    toast({
      title: 'ℹ️ Informação',
      description: 'Esta é uma mensagem informativa.',
    })
  }

  return (
    <div>
      <Button onClick={handleSuccess}>Mostrar Sucesso</Button>
      <Button onClick={handleError}>Mostrar Erro</Button>
      <Button onClick={handleInfo}>Mostrar Info</Button>
    </div>
  )
}
```

---

## 🎨 Variantes Disponíveis

### Success (Verde)

```typescript
toast({
  variant: 'success',
  title: '✅ Sucesso!',
  description: 'Configurações salvas com sucesso!',
})
```

### Destructive/Error (Vermelho Suave)

```typescript
toast({
  variant: 'destructive',
  title: '❌ Erro',
  description: 'Não foi possível salvar as alterações.',
})
```

- Fundo: `bg-red-50` (vermelho muito claro)
- Borda: `border-red-200` (vermelho suave)
- Texto: `text-red-900` (vermelho escuro para contraste)

### Default (Cinza)

```typescript
toast({
  title: 'ℹ️ Informação',
  description: 'Suas alterações foram sincronizadas.',
})
```

---

## 📦 Estrutura de Arquivos

```
components/
├── ui/
│   ├── toast.tsx         # Componente base do Toast
│   └── toaster.tsx       # Provider e renderizador de toasts
hooks/
└── use-toast.ts          # Hook para gerenciar toasts
app/
└── layout.tsx            # Toaster adicionado aqui
```

---

## 🔧 Configuração Técnica

### 1. Dependências

```json
{
  "@radix-ui/react-toast": "^1.x.x",
  "class-variance-authority": "^0.x.x",
  "clsx": "^2.x.x",
  "tailwind-merge": "^2.x.x"
}
```

### 2. Layout Root

O `<Toaster />` está incluído no layout raiz:

```typescript
// app/layout.tsx
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
          <Toaster /> {/* ← Toaster global */}
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## 💡 Exemplos de Uso Real

### Formulário de Aparência

```typescript
// components/AppearanceForm.tsx
const onSubmit = async (data: UpdateStoreInput) => {
  try {
    const response = await fetch(`/api/stores/${store.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar loja')
    }

    toast({
      variant: 'success',
      title: '✅ Sucesso!',
      description: 'Configurações salvas com sucesso!',
    })

    router.refresh()
  } catch (err) {
    toast({
      variant: 'destructive',
      title: '❌ Erro',
      description: err instanceof Error ? err.message : 'Erro inesperado',
    })
  }
}
```

### Upload de Imagem

```typescript
// components/LogoUpload.tsx
const handleFileSelect = async (file: File) => {
  try {
    const optimized = await optimizeLogoImage(file)

    toast({
      variant: 'success',
      title: '✅ Imagem Otimizada',
      description: 'Logo carregada com sucesso!',
    })

    onLogoChange(optimized)
  } catch (err) {
    toast({
      variant: 'destructive',
      title: '❌ Erro no Upload',
      description: 'Não foi possível processar a imagem.',
    })
  }
}
```

---

## 🎭 Customização

### Duração Personalizada

```typescript
toast({
  title: 'Mensagem Rápida',
  description: 'Desaparece em 2 segundos',
  duration: 2000, // milissegundos
})
```

### Com Ação

```typescript
toast({
  title: 'Produto Deletado',
  description: 'O produto foi removido.',
  action: (
    <Button onClick={handleUndo}>
      Desfazer
    </Button>
  ),
})
```

---

## 🌐 Acessibilidade

- ✅ **ARIA Labels**: Totalmente acessível via screen readers
- ✅ **Keyboard Navigation**: Pode ser fechado com `Esc`
- ✅ **Focus Management**: Gerenciamento automático de foco
- ✅ **Swipe to Dismiss**: Em mobile, pode arrastar para fechar

---

## 🔄 Migração de Alerts Inline

### Antes (Alert Inline)

```typescript
const [error, setError] = useState('')
const [success, setSuccess] = useState('')

// No JSX:
{error && <div className="bg-red-50">{error}</div>}
{success && <div className="bg-green-50">{success}</div>}
```

### Depois (Toast)

```typescript
const { toast } = useToast()

// Sem JSX adicional!
toast({ variant: 'destructive', title: '❌ Erro', description: error })
toast({ variant: 'success', title: '✅ Sucesso', description: success })
```

---

## 📊 Benefícios

1. **UX Melhorada**: Notificações não-intrusivas que não bloqueiam a UI
2. **Código Limpo**: Remove estados `error` e `success` do componente
3. **Consistência**: Todas as notificações têm o mesmo estilo
4. **Acessibilidade**: Suporte completo a screen readers
5. **Mobile-Friendly**: Funciona perfeitamente em dispositivos móveis

---

## 🎯 Próximos Passos

- [ ] Migrar outros formulários para usar toast
- [ ] Adicionar toast de loading para operações longas
- [ ] Implementar toast de confirmação antes de ações destrutivas
- [ ] Adicionar sons (opcional) para notificações importantes

---

## 📚 Referências

- [Radix UI Toast Documentation](https://www.radix-ui.com/docs/primitives/components/toast)
- [shadcn/ui Toast Component](https://ui.shadcn.com/docs/components/toast)
