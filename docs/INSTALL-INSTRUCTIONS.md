# 📦 Instruções de Instalação - SimpleLink

## ⚠️ Importante: nodemailer foi adicionado!

O `nodemailer` é necessário para o NextAuth enviar emails. Ele já foi adicionado ao `package.json`.

## 🔄 Próximos Passos

### 1. Pare o servidor Next.js (se estiver rodando)

```
Ctrl + C no terminal
```

### 2. Instale as dependências

```bash
npm install
# ou se tiver pnpm instalado:
pnpm install
```

### 3. Reinicie o servidor

```bash
npm run dev
# ou
pnpm dev
```

## ✅ Agora o login deve funcionar!

### Teste o fluxo:

1. **Acesse**: http://localhost:3000/login
2. **Digite**: `demo@example.com` (ou qualquer email)
3. **Clique**: "Enviar Link de Login"
4. **Abra**: http://localhost:8025 (MailHog)
5. **Clique**: No email recebido
6. **Clique**: No link "Sign in"
7. **Pronto**: Você está logado! 🎉

## 📧 Verificar se o email foi enviado

No terminal do Next.js, você deve ver algo como:

```
✓ Compiled /api/auth/signin/email in XXXms
POST /api/auth/signin/email 200 in XXXms
```

**Sem erros de `nodemailer`!**

## 🐛 Se ainda houver problemas

### Limpar cache e reinstalar:

```bash
# Parar servidor (Ctrl+C)

# Limpar node_modules
rm -rf node_modules
rm -rf .next

# Reinstalar
npm install

# Reiniciar
npm run dev
```

### Verificar instalação do nodemailer:

```bash
npm list nodemailer
```

Deve mostrar:

```
nodemailer@6.9.15
```

## 📝 Dependências Adicionadas

- `nodemailer@^6.9.15` - Para enviar emails
- `@types/nodemailer@^6.4.16` - Tipos TypeScript

Essas dependências são essenciais para o funcionamento do sistema de autenticação por email magic link.

---

**Tudo instalado?** Reinicie o servidor e teste o login! 🚀
