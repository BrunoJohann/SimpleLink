# 🔧 Troubleshooting - Login e Autenticação

## 🐛 Problema: Link do Email Redireciona para Login

Se ao clicar no link do email você volta para a página de login, siga estes passos:

### 1️⃣ Verificar Sessão

Acesse a página de debug:

```
http://localhost:3000/debug-session
```

Você verá:

- ✅ **Status**: authenticated/unauthenticated/loading
- ✅ **Dados do usuário** (se autenticado)
- ✅ **Sessão completa**

### 2️⃣ Verificar Banco de Dados

```bash
# Abrir Prisma Studio
npm run db:studio

# Verificar tabelas:
# - User: Deve ter seu usuário
# - Session: Deve ter uma sessão ativa
# - VerificationToken: Tokens de login
```

### 3️⃣ Verificar Variáveis de Ambiente

Abra `.env.local` e verifique:

```env
# Deve estar EXATAMENTE assim:
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="qualquer-string-aqui"

# Não pode ter espaços ou aspas extras!
```

### 4️⃣ Gerar NEXTAUTH_SECRET

Se não tiver um secret configurado:

```bash
# Gerar um secret aleatório
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ou use este temporário para desenvolvimento:
NEXTAUTH_SECRET="dev-secret-change-in-production"
```

### 5️⃣ Limpar Sessões e Tokens

```bash
# Via Prisma Studio
npm run db:studio
# Delete todas as entradas de Session e VerificationToken

# Ou via SQL
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "DELETE FROM \"Session\";"
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "DELETE FROM \"VerificationToken\";"
```

### 6️⃣ Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 7️⃣ Testar Novamente

1. Acesse http://localhost:3000/login
2. Digite `demo@example.com`
3. Vá para http://localhost:8025
4. Clique no link do email
5. Verifique http://localhost:3000/debug-session

## 🔍 Diagnóstico Passo a Passo

### Teste 1: Verificar API de Sessão

```bash
# Em outro terminal, enquanto o servidor roda:
curl http://localhost:3000/api/auth/session
```

**Esperado (não autenticado):**

```json
{}
```

**Esperado (autenticado):**

```json
{
  "user": {
    "id": "...",
    "email": "demo@example.com",
    "name": "Demo User"
  },
  "expires": "..."
}
```

### Teste 2: Verificar Callback

Após clicar no link do email, verifique os logs do servidor.

**Deve aparecer:**

```
GET /api/auth/callback/email?token=...&email=... 200
POST /api/auth/session 200
GET /dashboard 200
```

**Se aparecer:**

```
GET /api/auth/callback/email?token=...&email=... 302
GET /login 200
```

→ Há um problema no callback!

### Teste 3: Verificar Cookies

Abra DevTools → Application → Cookies → http://localhost:3000

**Deve ter:**

- `next-auth.session-token` (ou similar)
- `next-auth.callback-url`

**Se não tiver cookies:**

- Problema com o adapter ou sessão
- Verifique se o banco está acessível

## 🛠 Soluções Comuns

### Solução 1: Resetar Tudo

```bash
# Parar servidor (Ctrl+C)

# Limpar cache do Next.js
rm -rf .next

# Resetar banco
npm run docker:reset
npm run db:push
npm run db:seed

# Reiniciar
npm run dev
```

### Solução 2: Verificar Adapter

O adapter do Prisma precisa estar correto. Verifique em `lib/auth.ts`:

```typescript
import { PrismaAdapter } from '@auth/prisma-adapter'

adapter: PrismaAdapter(prisma) as any,
```

### Solução 3: Verificar Schema do Prisma

Execute:

```bash
npm run db:push
```

Deve criar as tabelas:

- Account
- Session
- User
- VerificationToken

### Solução 4: Debug Mode

Ative o debug no NextAuth (já está ativado em desenvolvimento):

```typescript
debug: process.env.NODE_ENV === 'development',
```

Veja os logs detalhados no terminal.

## 📊 Verificações no Banco

### Verificar se o usuário foi criado:

```sql
-- Via Prisma Studio ou psql
SELECT * FROM "User" WHERE email = 'demo@example.com';
```

### Verificar se a sessão foi criada:

```sql
SELECT * FROM "Session" WHERE "userId" = 'seu-user-id';
```

### Verificar tokens:

```sql
SELECT * FROM "VerificationToken" WHERE identifier = 'demo@example.com';
```

## 🎯 Fluxo Correto

```
1. Usuário entra em /login
2. Digita email
3. NextAuth cria VerificationToken
4. Email é enviado via nodemailer
5. Usuário clica no link
6. NextAuth valida token
7. Cria/atualiza User
8. Cria Session
9. Define cookie
10. Redireciona para /dashboard ✅
```

## ⚠️ Problemas Conhecidos

### Problema: Cookies não são salvos

**Causa**: Configuração de domínio incorreta

**Solução**: Verifique `NEXTAUTH_URL`:

```env
# Deve ser exatamente:
NEXTAUTH_URL="http://localhost:3000"

# NÃO use:
# NEXTAUTH_URL="http://127.0.0.1:3000"
# NEXTAUTH_URL="localhost:3000"
```

### Problema: Token inválido

**Causa**: Token expirou ou já foi usado

**Solução**: Solicite novo link de login

### Problema: Sessão não persiste

**Causa**: Banco de dados não está salvando

**Solução**:

```bash
# Verificar conexão
npm run db:studio

# Resetar banco
npm run docker:reset
npm run db:push
```

## 🧪 Teste Definitivo

Execute este fluxo completo:

```bash
# 1. Resetar tudo
npm run docker:reset
npm run db:push
npm run db:seed

# 2. Reiniciar servidor
# Ctrl+C
npm run dev

# 3. Limpar cookies do navegador
# DevTools → Application → Clear site data

# 4. Testar login
# http://localhost:3000/login
# Email: demo@example.com

# 5. Verificar sessão
# http://localhost:3000/debug-session

# 6. Verificar dashboard
# http://localhost:3000/dashboard
```

## 📞 Ainda com Problemas?

### Logs para Compartilhar:

```bash
# Logs do Next.js
# (copie do terminal onde rodou npm run dev)

# Logs do Docker
docker-compose logs postgres
docker-compose logs mailhog

# Estado do banco
npm run db:studio
# Tire screenshot das tabelas User, Session
```

### Informações Úteis:

- Versão do Node: `node --version`
- Versão do Next.js: `npm list next`
- Sistema Operacional: Windows/Mac/Linux
- Navegador usado: Chrome/Firefox/Safari

---

**Com essas verificações, você deve conseguir identificar e resolver o problema! 🚀**
