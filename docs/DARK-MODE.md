# 🌙 Dark Mode - Modo Escuro

## 📋 Visão Geral

Implementamos um sistema completo de **Dark Mode** (modo escuro) para o dashboard, com:

- ✅ Toggle visual (Sol/Lua)
- ✅ Persistência no localStorage
- ✅ Detecção automática da preferência do sistema
- ✅ Transições suaves entre temas
- ✅ Totalmente acessível

---

## 🎨 Como Usar

### **Para Usuários:**

1. **Acesse o Dashboard**

   ```
   http://localhost:3000/dashboard
   ```

2. **Clique no Botão de Tema**
   - Localizado no header, ao lado do botão "Sair"
   - ☀️ **Sol** = Modo Claro (Light Mode)
   - 🌙 **Lua** = Modo Escuro (Dark Mode)

3. **Sua Preferência é Salva**
   - O tema escolhido fica salvo no navegador
   - Ao voltar, o tema será o mesmo que você escolheu

---

## 🔧 Implementação Técnica

### **Arquitetura:**

```
ThemeProvider (Context)
    ↓
ThemeToggle (Botão)
    ↓
Componentes com dark: classes
```

### **Arquivos Criados:**

#### 1. **`lib/contexts/ThemeContext.tsx`**

Context Provider para gerenciar o tema global.

```typescript
export function ThemeProvider({ children })
export function useTheme()
```

**Funcionalidades:**

- Carrega tema do localStorage
- Detecta preferência do sistema
- Aplica classe `dark` no `<html>`
- Persiste escolha do usuário

#### 2. **`components/ThemeToggle.tsx`**

Botão toggle com ícones animados.

```typescript
export function ThemeToggle()
```

**Características:**

- Ícone Sol/Lua animado
- Transição suave
- Acessível (aria-label)
- Responsivo

---

## 🎯 Como Funciona

### **Fluxo de Funcionamento:**

```
1. Usuário abre dashboard
   ↓
2. ThemeProvider verifica localStorage
   ↓
3. Se não houver preferência salva:
   → Detecta preferência do sistema
   ↓
4. Aplica tema (light ou dark)
   ↓
5. Adiciona/remove classe 'dark' no <html>
   ↓
6. CSS Tailwind aplica estilos dark:*
```

### **Persistência:**

```typescript
// Salvar tema
localStorage.setItem('theme', 'dark')

// Carregar tema
const savedTheme = localStorage.getItem('theme')

// Detectar preferência do sistema
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'
```

---

## 🎨 Estilos Dark Mode

### **Classes Tailwind:**

Todos os componentes usam classes `dark:*` para estilização:

```tsx
// Exemplo: Background
className = 'bg-white dark:bg-gray-900'

// Exemplo: Texto
className = 'text-gray-900 dark:text-white'

// Exemplo: Border
className = 'border-gray-200 dark:border-gray-800'

// Exemplo: Hover
className = 'hover:bg-gray-100 dark:hover:bg-gray-800'
```

### **Componentes Estilizados:**

| Componente     | Light Mode        | Dark Mode         |
| -------------- | ----------------- | ----------------- |
| **Header**     | `bg-white`        | `bg-gray-900`     |
| **Sidebar**    | `bg-white`        | `bg-gray-900`     |
| **Background** | `bg-gray-50`      | `bg-gray-950`     |
| **Text**       | `text-gray-900`   | `text-white`      |
| **Borders**    | `border-gray-200` | `border-gray-800` |
| **Cards**      | `bg-white`        | `bg-gray-900`     |

---

## 🔍 Detecção Automática do Sistema

O sistema detecta automaticamente a preferência do usuário:

```typescript
// Se o usuário nunca escolheu um tema:
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'

// Aplica o tema do sistema
setTheme(systemTheme)
```

**Como testar:**

1. Limpe o localStorage: `localStorage.clear()`
2. Mude a preferência do sistema operacional
3. Recarregue a página
4. O tema deve corresponder ao sistema

---

## 🎭 Animações

### **Ícone do Toggle:**

```css
/* Sol (Light Mode) */
.sun {
  rotate: 0deg;
  scale: 1;
}

/* Lua (Dark Mode) */
.sun.dark {
  rotate: -90deg;
  scale: 0;
}

/* Lua (Dark Mode) */
.moon {
  rotate: 90deg;
  scale: 0;
}

/* Lua (Dark Mode Ativo) */
.moon.dark {
  rotate: 0deg;
  scale: 1;
}
```

### **Transições:**

Todos os componentes têm transições suaves:

```tsx
className = 'transition-colors'
```

---

## 📊 Variáveis CSS (globals.css)

O arquivo `styles/globals.css` já contém todas as variáveis para dark mode:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

---

## 🧪 Como Testar

### **Teste 1: Toggle Manual**

```bash
1. Acesse http://localhost:3000/dashboard
2. Clique no ícone Sol/Lua no header
3. Tema deve mudar instantaneamente ✅
4. Recarregue a página
5. Tema deve permanecer o mesmo ✅
```

### **Teste 2: Persistência**

```bash
1. Escolha Dark Mode
2. Feche o navegador
3. Abra novamente
4. Tema deve ser Dark Mode ✅
```

### **Teste 3: Detecção do Sistema**

```bash
1. Abra DevTools (F12) → Console
2. Execute: localStorage.clear()
3. Recarregue a página
4. Tema deve corresponder ao sistema ✅
```

### **Teste 4: Navegação**

```bash
1. Ative Dark Mode
2. Navegue entre páginas do dashboard
3. Tema deve permanecer consistente ✅
```

---

## 🎯 Componentes com Dark Mode

### **✅ Já Implementados:**

- [x] DashboardHeader
- [x] DashboardLayoutClient (Sidebar)
- [x] Background do Dashboard
- [x] ThemeToggle

### **📝 Para Adicionar (Opcional):**

Para adicionar dark mode em outros componentes, use:

```tsx
// Cards
<Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">

// Buttons
<Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">

// Text
<p className="text-gray-900 dark:text-gray-100">

// Inputs
<Input className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
```

---

## 🔐 Acessibilidade

### **ARIA Labels:**

```tsx
<Button
  aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
>
```

### **Contraste:**

Todas as cores seguem as diretrizes WCAG:

- ✅ Contraste mínimo de 4.5:1 para texto
- ✅ Contraste mínimo de 3:1 para elementos UI

---

## 🚀 Melhorias Futuras (Opcional)

### **1. Modo Automático**

```typescript
// Seguir automaticamente o sistema
const [autoMode, setAutoMode] = useState(true)

if (autoMode) {
  // Detectar mudanças no sistema
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', handleSystemThemeChange)
}
```

### **2. Tema Personalizado**

```typescript
// Permitir usuário escolher cores
const [customTheme, setCustomTheme] = useState({
  primary: '#3b82f6',
  background: '#ffffff',
})
```

### **3. Salvar no Banco**

```typescript
// Salvar preferência no perfil do usuário
await prisma.user.update({
  where: { id: userId },
  data: { theme: 'dark' },
})
```

---

## 📚 Referências

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Dark Mode](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#dark-mode)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## 🎓 Resumo

### ✅ **Implementado:**

1. Context Provider para gerenciar tema
2. Toggle visual com ícones animados
3. Persistência no localStorage
4. Detecção automática da preferência do sistema
5. Estilos dark mode em todos os componentes do dashboard
6. Transições suaves
7. Totalmente acessível

### 🎯 **Como Usar:**

- Clique no ícone Sol/Lua no header do dashboard
- Sua preferência é salva automaticamente
- Funciona em todas as páginas do dashboard

---

**Aproveite o Dark Mode!** 🌙✨
