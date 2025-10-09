# 🔍 Debug Manual de Autenticação

Como o MCP browser-tools não está disponível, vamos fazer o debug manualmente.

## 🎯 Passos para Debugar

### 1️⃣ Verificar Variáveis de Ambiente

Abra o arquivo `.env.local` e confirme:

```env
DATABASE_URL="postgresql://simplelink:simplelink_dev_password@localhost:5432/simplelink"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-in-production"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_FROM="SimpleLink <no-reply@localhost>"
```

⚠️ **IMPORTANTE**: Não pode ter espaços extras ou aspas incorretas!

### 2️⃣ Verificar Página de Debug

Acesse:

```
http://localhost:3000/debug-session
```

**O que você vê?**

- [ ] Status: authenticated ✅
- [ ] Status: unauthenticated ❌
- [ ] Status: loading ⏳

### 3️⃣ Verificar Cookies no Navegador

1. Abra DevTools (F12)
2. Vá para **Application** → **Cookies** → `http://localhost:3000`
3. Procure por cookies do NextAuth:
   - `next-auth.session-token`
   - `__Secure-next-auth.session-token`

**Tem cookies?**

- ✅ Sim → Sessão foi criada
- ❌ Não → Problema na criação da sessão

### 4️⃣ Verificar Network no DevTools

1. Abra DevTools (F12)
2. Vá para **Network**
3. Clique no link do email
4. Observe as requisições:

**Fluxo esperado:**

```
1. GET /api/auth/callback/email?token=...&email=... → 302
2. GET /dashboard → 200
```

**Se aparecer:**

```
1. GET /api/auth/callback/email?token=...&email=... → 302
2. GET /login → 200
```

→ Sessão não foi criada!

### 5️⃣ Verificar Console do Navegador

1. Abra DevTools (F12)
2. Vá para **Console**
3. Clique no link do email
4. Veja se há erros

**Erros comuns:**

- `Failed to fetch`
- `Network error`
- `CORS error`

### 6️⃣ Verificar Logs do Servidor

No terminal onde está rodando `npm run dev`, após clicar no link do email, você deve ver:

**✅ Sucesso:**

```
GET /api/auth/callback/email?token=...&email=... 302
POST /api/auth/session 200
GET /dashboard 200
```

**❌ Problema:**

```
GET /api/auth/callback/email?token=...&email=... 302
GET /login 200
```

### 7️⃣ Verificar Banco de Dados

```bash
# Abrir Prisma Studio
npm run db:studio
```

**Verificar tabelas:**

1. **User** - Deve ter o usuário `demo@example.com`
2. **Session** - Deve ter uma sessão ativa
3. **VerificationToken** - Deve ter o token (antes de clicar no link)

## 🔧 Soluções por Problema

### Problema A: Não tem cookies

**Causa**: Sessão não está sendo criada

**Solução**:

```bash
# 1. Verificar se o banco está acessível
npm run db:studio

# 2. Verificar se as tabelas existem
# Deve ter: User, Session, Account, VerificationToken

# 3. Se não tiver, recriar:
npm run db:push
```

### Problema B: Token inválido

**Causa**: Token expirou ou já foi usado

**Solução**:

```bash
# Limpar tokens antigos
npm run db:studio
# Delete todos os VerificationToken

# Solicitar novo link de login
```

### Problema C: Redireciona para /login

**Causa**: Callback não está criando a sessão

**Solução**:

```bash
# 1. Verificar NEXTAUTH_URL no .env.local
# Deve ser: NEXTAUTH_URL="http://localhost:3000"

# 2. Reiniciar servidor
# Ctrl+C
npm run dev

# 3. Limpar cookies do navegador
# DevTools → Application → Clear site data

# 4. Testar novamente
```

### Problema D: Erro no adapter

**Causa**: PrismaAdapter não está funcionando

**Solução**:

```bash
# 1. Reinstalar dependências
npm install

# 2. Regenerar Prisma Client
npm run db:generate

# 3. Reiniciar servidor
npm run dev
```

## 🧪 Teste Completo de Diagnóstico

Execute este fluxo e me diga em qual passo falha:

### Passo 1: Preparar Ambiente

```bash
# Terminal 1: Verificar Docker
docker-compose ps
# Deve mostrar postgres e mailhog rodando

# Terminal 2: Reiniciar servidor
# Ctrl+C (se estiver rodando)
npm run dev
```

### Passo 2: Limpar Estado

```bash
# No navegador:
# 1. Abra DevTools (F12)
# 2. Application → Clear site data
# 3. Feche e reabra o navegador
```

### Passo 3: Testar Login

```
1. Acesse: http://localhost:3000/login
2. Digite: demo@example.com
3. Clique: Enviar Link de Login
4. Veja mensagem: "Verifique seu email..."
```

**✅ Funcionou até aqui?**

### Passo 4: Verificar Email

```
1. Abra: http://localhost:8025
2. Veja o email na lista
3. Clique no email
4. Veja o conteúdo
5. Copie o link (botão direito → copiar link)
```

**✅ Email chegou?**
**✅ Link está completo?**

### Passo 5: Clicar no Link

```
1. Cole o link no navegador
2. Pressione Enter
3. Observe a URL final
```

**Para onde foi redirecionado?**

- [ ] http://localhost:3000/dashboard ✅
- [ ] http://localhost:3000/login ❌
- [ ] Outro: ******\_\_\_******

### Passo 6: Verificar Sessão

```
Acesse: http://localhost:3000/debug-session
```

**O que aparece?**

- [ ] Status: authenticated ✅
- [ ] Status: unauthenticated ❌
- [ ] Dados do usuário aparecem? \_\_\_

### Passo 7: Verificar Cookies

```
DevTools → Application → Cookies → http://localhost:3000
```

**Tem cookies?**

- [ ] next-auth.session-token ✅
- [ ] Nenhum cookie ❌

### Passo 8: Verificar Banco

```bash
npm run db:studio
```

**Verificar:**

- [ ] Usuário existe na tabela User ✅
- [ ] Sessão existe na tabela Session ✅
- [ ] Token foi removido de VerificationToken ✅

## 📊 Me Diga os Resultados

Por favor, execute os passos acima e me diga:

1. **Em qual passo falhou?**
2. **O que aparece na página de debug?**
3. **Tem cookies no navegador?**
4. **Tem sessão no banco de dados?**
5. **O que aparece nos logs do servidor?**

Com essas informações, posso identificar exatamente o problema! 🔍

## 🆘 Solução Rápida (Se nada funcionar)

```bash
# 1. Parar servidor (Ctrl+C)

# 2. Resetar tudo
npm run docker:reset
rm -rf .next
npm run db:push
npm run db:seed

# 3. Verificar .env.local
cat .env.local

# 4. Reiniciar
npm run dev

# 5. Limpar cookies do navegador
# DevTools → Application → Clear site data

# 6. Testar novamente
```

---

**Aguardo seu feedback sobre os passos acima! 🚀**
