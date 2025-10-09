# 🐛 Debug do Sistema de Toast

## ✅ Correções Aplicadas

1. **TOAST_REMOVE_DELAY**: Alterado de 1000000ms para 5000ms (5 segundos)
2. **TOAST_LIMIT**: Alterado de 1 para 5 (permite até 5 toasts simultâneos)
3. **Z-Index**: Aumentado de z-[100] para z-[9999] para garantir visibilidade
4. **Logs de Debug**: Adicionados em `AppearanceForm` e `Toaster`

---

## 🧪 Como Testar

### Teste 1: Página Simples (Isolada)

```
URL: http://localhost:3000/test-toast-simple
```

1. Clique no botão "Clique para Testar Toast"
2. **Resultado Esperado**: Um toast verde deve aparecer no canto superior direito (desktop) ou topo (mobile)
3. Abra o Console (F12) e verifique os logs:
   ```
   🔘 Botão clicado!
   🔘 Toast retornado: { id: "1", dismiss: ƒ, update: ƒ }
   🔔 Toaster renderizado, toasts: 1
   🔔 Renderizando toast: 1 ✅ Teste
   ```

**Se funcionar aqui**: O sistema de toast está OK! ✅  
**Se NÃO funcionar**: Há um problema com a configuração base.

---

### Teste 2: Página de Appearance

```
URL: http://localhost:3000/dashboard/appearance
```

1. Faça uma alteração (ex: mude o nome da loja)
2. Clique em "Salvar Configurações"
3. **Resultado Esperado**: Toast verde "✅ Sucesso!" deve aparecer
4. Verifique o Console:
   ```
   🎉 Chamando toast de sucesso...
   🎉 Toast criado: { id: "1", dismiss: ƒ, update: ƒ }
   🔔 Toaster renderizado, toasts: 1
   🔔 Renderizando toast: 1 ✅ Sucesso!
   ```

---

### Teste 3: Página de Demonstração Completa

```
URL: http://localhost:3000/test-toast
```

1. Teste todos os botões:
   - ✅ Sucesso (verde)
   - ❌ Erro (vermelho)
   - ℹ️ Info (cinza)
   - 🗑️ Com ação (botão "Desfazer")
   - Múltiplos toasts
2. **Resultado Esperado**: Todos os toasts devem aparecer corretamente

---

## 🔍 Troubleshooting

### Problema: Toast não aparece visualmente

#### Verificação 1: Elemento existe no DOM?

1. Abra DevTools (F12) → Elements
2. Procure por: `<ol data-radix-toast-viewport>`
3. **Se NÃO existe**: O Toaster não está sendo renderizado
4. **Se existe**: Continue para Verificação 2

#### Verificação 2: Elemento está visível?

1. No DevTools, inspecione o elemento `<ol data-radix-toast-viewport>`
2. Verifique:
   - `display: flex` (não deve ser `none`)
   - `z-index: 9999` (deve estar visível acima de tudo)
   - `position: fixed` (deve estar fixo na tela)
   - `opacity: 1` (não deve estar transparente)

#### Verificação 3: Toast está sendo criado?

1. Abra Console (F12)
2. Clique em "Salvar Configurações"
3. **Se aparecer**: `🎉 Chamando toast de sucesso...` → Toast está sendo criado ✅
4. **Se NÃO aparecer**: Há um erro antes de chamar o toast

---

### Problema: Toast aparece mas desaparece imediatamente

**Causa**: `TOAST_REMOVE_DELAY` muito baixo  
**Solução**: Já configurado para 5000ms (5 segundos)

Se ainda estiver desaparecendo rápido, aumente em `hooks/use-toast.ts`:

```typescript
const TOAST_REMOVE_DELAY = 10000 // 10 segundos
```

---

### Problema: Toast está atrás de outros elementos

**Causa**: Z-index muito baixo  
**Solução**: Já configurado para `z-[9999]`

Se ainda estiver atrás, verifique se há elementos com z-index maior no CSS.

---

### Problema: Logs aparecem mas toast não renderiza

**Causa Possível**: Problema com animações do Tailwind

**Solução**:

1. Verifique se `tailwindcss-animate` está instalado:
   ```bash
   npm list tailwindcss-animate
   ```
2. Se não estiver, instale:
   ```bash
   npm install tailwindcss-animate
   ```
3. Verifique `tailwind.config.js`:
   ```js
   plugins: [require("tailwindcss-animate")],
   ```

---

## 📊 Checklist de Verificação

- [ ] `<Toaster />` está no `app/layout.tsx`
- [ ] `tailwindcss-animate` está instalado
- [ ] CSS variables estão definidas em `styles/globals.css`
- [ ] `TOAST_REMOVE_DELAY` está configurado (5000ms)
- [ ] Z-index está alto o suficiente (9999)
- [ ] Logs aparecem no Console quando toast é chamado
- [ ] Elemento `<ol data-radix-toast-viewport>` existe no DOM
- [ ] Servidor foi reiniciado após as mudanças

---

## 🎯 Próximos Passos

1. **Teste a página simples**: `/test-toast-simple`
2. **Verifique os logs no Console**
3. **Inspecione o DOM** para ver se o elemento existe
4. **Reporte o resultado**: Diga qual teste funcionou e qual não funcionou

---

## 📝 Informações Técnicas

### Configuração Atual

```typescript
// hooks/use-toast.ts
const TOAST_LIMIT = 5 // Máximo de toasts simultâneos
const TOAST_REMOVE_DELAY = 5000 // 5 segundos antes de remover
```

### Z-Index

```typescript
// components/ui/toast.tsx
z - [9999] // ToastViewport
```

### Posição

- **Desktop**: Canto inferior direito (`sm:bottom-0 sm:right-0`)
- **Mobile**: Topo da tela (`top-0`)

---

## 🆘 Se Nada Funcionar

Se após todos os testes o toast ainda não aparecer:

1. **Limpe o cache do Next.js**:

   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. **Limpe o cache do navegador**:
   - Pressione `Ctrl + Shift + Delete`
   - Limpe cache e cookies
   - Recarregue a página com `Ctrl + F5`

3. **Verifique extensões do navegador**:
   - Desative todas as extensões
   - Teste novamente
   - Algumas extensões bloqueiam popups/overlays

4. **Teste em modo anônimo**:
   - Abra o navegador em modo anônimo
   - Teste novamente
   - Isso elimina interferência de extensões/cache
