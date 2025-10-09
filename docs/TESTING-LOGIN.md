# 🔐 Guia de Teste - Sistema de Login

## 📋 Pré-requisitos

Antes de testar o login, certifique-se de que:

- ✅ Docker está rodando (`docker-compose ps`)
- ✅ MailHog está acessível em http://localhost:8025
- ✅ Servidor Next.js está rodando (`pnpm dev`)
- ✅ Banco de dados está configurado (`pnpm db:push`)

## 🧪 Testando o Login - Passo a Passo

### Opção 1: Usar Conta Demo (Mais Rápido)

Se você rodou `pnpm db:seed`, já existe uma conta demo:

1. **Acesse a página de login**

   ```
   http://localhost:3000/login
   ```

2. **Digite o email demo**

   ```
   demo@example.com
   ```

3. **Clique em "Enviar Link de Login"**

4. **Abra o MailHog**

   ```
   http://localhost:8025
   ```

5. **Clique no email mais recente**
   - Você verá um email com o assunto "Sign in to SimpleLink"
   - Clique no link "Sign in" dentro do email

6. **Você será redirecionado para o dashboard!** 🎉

### Opção 2: Criar Nova Conta

1. **Acesse a página de login**

   ```
   http://localhost:3000/login
   ```

2. **Digite seu email**

   ```
   seu-email@exemplo.com
   ```

3. **Clique em "Enviar Link de Login"**

4. **Abra o MailHog**

   ```
   http://localhost:8025
   ```

5. **Clique no email recebido**

6. **Clique no link "Sign in"**

7. **Primeira vez?** Uma loja será criada automaticamente para você!

## 📧 Como Funciona o MailHog

### Interface do MailHog

Quando você abre http://localhost:8025, você verá:

```
┌─────────────────────────────────────────┐
│  MailHog - Email Testing Tool           │
├─────────────────────────────────────────┤
│  📧 Inbox (1 message)                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ From: SimpleLink <no-reply@...>   │ │
│  │ To: demo@example.com              │ │
│  │ Subject: Sign in to SimpleLink    │ │
│  │ Date: 2024-01-01 10:00:00         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [View Email] [Delete]                  │
└─────────────────────────────────────────┘
```

### Visualizar o Email

1. Clique no email na lista
2. Você verá o conteúdo HTML do email
3. Procure pelo botão/link "Sign in"
4. Clique nele (abrirá em nova aba)

### Copiar Link Manualmente

Se o link não abrir automaticamente:

1. Clique com botão direito no link "Sign in"
2. Copie o endereço do link
3. Cole no navegador
4. O link tem este formato:
   ```
   http://localhost:3000/api/auth/callback/email?token=...&email=...
   ```

## 🔍 Verificando o Fluxo

### 1. Email Enviado

Após clicar em "Enviar Link de Login", você deve ver:

```
✅ Verifique seu email para o link de login!
```

### 2. Email no MailHog

No MailHog (http://localhost:8025), você verá:

- **From**: SimpleLink <no-reply@localhost>
- **To**: seu-email@exemplo.com
- **Subject**: Sign in to SimpleLink

### 3. Clique no Link

O link do email tem este formato:

```
http://localhost:3000/api/auth/callback/email?token=abc123...&email=demo@example.com
```

### 4. Redirecionamento

Após clicar no link:

- ✅ NextAuth valida o token
- ✅ Cria/atualiza a sessão
- ✅ Redireciona para `/dashboard`

### 5. Dashboard

Você deve ver:

- Nome/email do usuário
- Estatísticas da loja
- Menu lateral com navegação

## 🐛 Troubleshooting

### Email não aparece no MailHog

**Verificar se MailHog está rodando:**

```bash
docker-compose ps
```

Deve mostrar `simplelink-mailhog` com status `Up (healthy)`.

**Verificar logs do MailHog:**

```bash
docker-compose logs mailhog
```

**Verificar variáveis de ambiente:**

```bash
# No arquivo .env.local, deve ter:
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_FROM="SimpleLink <no-reply@localhost>"
```

**Reiniciar MailHog:**

```bash
docker-compose restart mailhog
```

### Link do email não funciona

**Verificar se o link está completo:**

```
http://localhost:3000/api/auth/callback/email?token=...&email=...
```

**Verificar se o servidor Next.js está rodando:**

```bash
# Deve estar rodando em http://localhost:3000
pnpm dev
```

**Verificar NEXTAUTH_URL:**

```bash
# No .env.local deve ter:
NEXTAUTH_URL="http://localhost:3000"
```

### Token expirado

Os tokens de login expiram em 24 horas. Se o link não funcionar:

1. Volte para http://localhost:3000/login
2. Solicite um novo link
3. Use o novo link do MailHog

### Erro "Callback URL Mismatch"

Verifique se o `NEXTAUTH_URL` está correto:

```env
NEXTAUTH_URL="http://localhost:3000"
```

## 🧪 Testando Diferentes Cenários

### Cenário 1: Primeiro Login (Novo Usuário)

```bash
# 1. Use um email novo
novo-usuario@teste.com

# 2. Após login, uma loja será criada automaticamente
# 3. Você será redirecionado para o dashboard
# 4. A loja terá um slug gerado: novo-usuario-1234567890
```

### Cenário 2: Login Existente

```bash
# 1. Use o email demo
demo@example.com

# 2. Você verá a loja existente com produtos
# 3. Dashboard mostrará estatísticas
```

### Cenário 3: Múltiplos Logins

```bash
# Você pode ter múltiplas sessões abertas
# Cada email cria um usuário diferente
# Cada usuário tem sua própria loja
```

## 🔐 Segurança do Magic Link

### Como funciona:

1. **Usuário solicita login** → Email é enviado
2. **Token único é gerado** → Válido por 24h
3. **Token é enviado por email** → Link com token
4. **Usuário clica no link** → Token é validado
5. **Sessão é criada** → Usuário está logado

### Vantagens:

- ✅ Sem senha para lembrar
- ✅ Sem senha para armazenar
- ✅ Mais seguro que senha
- ✅ Fácil para o usuário

## 📊 Verificando no Banco de Dados

### Ver usuários criados:

```bash
# Abrir Prisma Studio
pnpm db:studio

# Ou via SQL
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "SELECT email, name FROM \"User\";"
```

### Ver sessões ativas:

```bash
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "SELECT \"userId\", expires FROM \"Session\";"
```

### Ver tokens de verificação:

```bash
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "SELECT identifier, expires FROM \"VerificationToken\";"
```

## 🎯 Fluxo Completo de Teste

### Teste Completo (5 minutos)

```bash
# 1. Iniciar ambiente
pnpm docker:up
pnpm dev

# 2. Abrir MailHog em uma aba
# http://localhost:8025

# 3. Abrir aplicação em outra aba
# http://localhost:3000/login

# 4. Digitar email e enviar
demo@example.com

# 5. Ir para o MailHog
# Clicar no email recebido

# 6. Clicar no link "Sign in"
# Será redirecionado para /dashboard

# 7. Explorar a aplicação
# - Ver produtos
# - Criar novo produto
# - Ver analytics
# - Customizar aparência
# - Visitar loja pública

# 8. Fazer logout
# Clicar em "Sair" no header

# 9. Testar login novamente
# Repetir processo
```

## 📝 Notas Importantes

### Para Desenvolvimento

- ✅ MailHog captura TODOS os emails
- ✅ Emails NÃO são enviados de verdade
- ✅ Perfeito para testar sem spam
- ✅ Interface visual para debug

### Para Produção

Você precisará configurar um provedor SMTP real:

```env
# Gmail (com senha de app)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-de-app"
EMAIL_FROM="SimpleLink <no-reply@seudominio.com>"

# SendGrid
EMAIL_SERVER="smtp://apikey:SG.xxx@smtp.sendgrid.net:587"

# Resend
EMAIL_SERVER="smtp://resend:re_xxx@smtp.resend.com:587"
```

## 🎬 Vídeo Tutorial (Passo a Passo)

### 1. Preparar Ambiente

```bash
# Terminal 1: Iniciar Docker
pnpm docker:up

# Terminal 2: Iniciar Next.js
pnpm dev
```

### 2. Abrir Abas do Navegador

- Aba 1: http://localhost:3000/login
- Aba 2: http://localhost:8025 (MailHog)

### 3. Fazer Login

1. Na Aba 1, digite `demo@example.com`
2. Clique em "Enviar Link de Login"
3. Vá para Aba 2 (MailHog)
4. Clique no email recebido
5. Clique no link "Sign in" no email
6. Você será redirecionado para o dashboard!

### 4. Explorar

- Criar produtos
- Ver analytics
- Customizar loja
- Visitar loja pública

## 🆘 Precisa de Ajuda?

### Logs úteis:

```bash
# Ver logs do Next.js
# (já aparece no terminal onde rodou pnpm dev)

# Ver logs do MailHog
docker-compose logs mailhog

# Ver logs do PostgreSQL
docker-compose logs postgres

# Ver todos os logs
docker-compose logs -f
```

### Comandos de debug:

```bash
# Verificar se o email foi enviado
# (procure por "Sending email" nos logs do Next.js)

# Verificar tokens no banco
pnpm db:studio
# Vá para VerificationToken

# Resetar tudo
pnpm docker:reset
pnpm db:push
pnpm db:seed
```

## ✅ Checklist de Teste

- [ ] MailHog acessível em http://localhost:8025
- [ ] Next.js rodando em http://localhost:3000
- [ ] Página de login carrega
- [ ] Formulário aceita email
- [ ] Mensagem de sucesso aparece
- [ ] Email aparece no MailHog
- [ ] Link do email funciona
- [ ] Redireciona para dashboard
- [ ] Dashboard mostra dados do usuário
- [ ] Logout funciona
- [ ] Pode fazer login novamente

## 🎉 Tudo Funcionando?

Se todos os itens acima funcionaram, seu sistema de autenticação está **100% operacional**!

Agora você pode:

- Testar com diferentes emails
- Criar múltiplos usuários
- Testar fluxos completos
- Desenvolver novas features

---

**Dica**: Mantenha o MailHog aberto em uma aba separada durante o desenvolvimento para ver os emails em tempo real! 📧

