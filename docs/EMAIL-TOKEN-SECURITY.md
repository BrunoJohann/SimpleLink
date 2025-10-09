# 🔐 Segurança de Tokens de Email - Magic Links

## 📋 Sua Pergunta

> "Sobre o link que eu recebo por email, depois de aberto eu queria que o link não funcionasse mais, é possível? É uma boa prática?"

**Resposta Curta**: ✅ **Sim, é possível e JÁ ESTÁ IMPLEMENTADO!** É uma **excelente prática de segurança**.

---

## ✅ Como Funciona Atualmente (NextAuth)

O NextAuth **já implementa automaticamente** as seguintes proteções:

### 1. **Token de Uso Único** (One-Time Token)

```
✅ Token é DELETADO do banco após o primeiro uso
✅ Link não funciona uma segunda vez
✅ Mesmo que alguém intercepte o email, só pode usar 1 vez
```

### 2. **Expiração de Token**

```
✅ Token expira após um tempo (padrão: 24 horas)
✅ Link antigo não funciona mesmo que não tenha sido usado
✅ Reduz janela de ataque
```

### 3. **Token Criptograficamente Seguro**

```
✅ Token gerado com algoritmo seguro (não é previsível)
✅ 64 caracteres hexadecimais aleatórios
✅ Impossível de adivinhar ou gerar
```

---

## 🔍 Fluxo Detalhado do Token

### Passo 1: Solicitação de Login

```typescript
// Usuário digita email em /login
POST / api / auth / signin / email
Body: {
  email: 'demo@example.com'
}
```

### Passo 2: Criação do Token

```sql
-- NextAuth cria registro na tabela VerificationToken
INSERT INTO "VerificationToken" (
  identifier,  -- Email do usuário
  token,       -- Token aleatório (ex: "52f04054b8f56f082495...")
  expires      -- Data/hora de expiração (agora + 24h)
)
```

### Passo 3: Envio do Email

```
Link gerado:
http://localhost:3000/api/auth/callback/email?
  token=52f04054b8f56f082495...&
  email=demo@example.com
```

### Passo 4: Usuário Clica no Link (Primeira Vez)

```typescript
// NextAuth valida o token
1. Busca token no banco de dados ✅
2. Verifica se não expirou ✅
3. Verifica se o email corresponde ✅
4. Cria/atualiza usuário
5. Cria sessão
6. **DELETA o token do banco** 🔥
7. Redireciona para /dashboard
```

### Passo 5: Tentativa de Usar o Link Novamente ❌

```typescript
// NextAuth tenta validar o token
1. Busca token no banco de dados ❌ (NÃO EXISTE MAIS!)
2. Retorna erro: "Token inválido ou expirado"
3. Redireciona para /login com mensagem de erro
```

---

## 🛡️ Proteções Implementadas

| Proteção                 | Status         | Como Funciona                   |
| ------------------------ | -------------- | ------------------------------- |
| **Uso Único**            | ✅ Ativo       | Token deletado após uso         |
| **Expiração**            | ✅ Ativo       | Token expira em 24h             |
| **Aleatoriedade**        | ✅ Ativo       | Token criptograficamente seguro |
| **Verificação de Email** | ✅ Ativo       | Token vinculado ao email        |
| **HTTPS (Produção)**     | ⚠️ Recomendado | Protege contra interceptação    |

---

## 🔬 Como Verificar que Está Funcionando

### Teste 1: Token de Uso Único

```bash
# 1. Solicite um login
# Vá para http://localhost:3000/login
# Digite: demo@example.com

# 2. Abra MailHog
# http://localhost:8025

# 3. Copie o link do email
# Exemplo: http://localhost:3000/api/auth/callback/email?token=abc123...

# 4. Abra o link (primeira vez)
# ✅ Deve funcionar e redirecionar para /dashboard

# 5. Abra o MESMO link novamente (segunda vez)
# ❌ Deve falhar com erro "Token inválido"
```

### Teste 2: Verificar no Banco de Dados

```bash
# Abrir Prisma Studio
npm run db:studio

# 1. Antes de clicar no link:
# Tabela VerificationToken → Deve ter 1 registro

# 2. Depois de clicar no link:
# Tabela VerificationToken → Registro foi DELETADO ✅
# Tabela Session → Nova sessão foi criada ✅
```

### Teste 3: Token Expirado

```sql
-- Simular token expirado
-- No Prisma Studio, edite o campo 'expires' para uma data passada
UPDATE "VerificationToken"
SET expires = '2020-01-01'
WHERE identifier = 'demo@example.com';

-- Agora tente usar o link
-- ❌ Deve falhar: "Token expirado"
```

---

## 📊 Comparação: Com vs Sem Proteção

### ❌ SEM Proteção (INSEGURO)

```
1. Usuário recebe email com link
2. Clica no link → Faz login ✅
3. Link continua funcionando indefinidamente 🚨
4. Atacante intercepta email → Pode fazer login a qualquer momento 🚨
5. Link vazado em histórico/logs → Acesso permanente 🚨
```

### ✅ COM Proteção (SEGURO) - Implementação Atual

```
1. Usuário recebe email com link
2. Clica no link → Faz login ✅
3. Token é DELETADO imediatamente 🔒
4. Atacante intercepta email → Link já não funciona ✅
5. Link vazado → Inútil após 24h ou primeiro uso ✅
```

---

## 🎯 Boas Práticas Implementadas

### ✅ 1. Token de Uso Único

**Por quê?** Reduz drasticamente a janela de ataque. Mesmo que o email seja interceptado, o atacante só tem uma chance.

### ✅ 2. Expiração Curta (24h)

**Por quê?** Limita o tempo em que um token não usado pode ser explorado.

### ✅ 3. Token Aleatório e Longo

**Por quê?** Impossível de adivinhar. 64 caracteres hex = 2^256 possibilidades.

### ✅ 4. Vinculação ao Email

**Por quê?** Token só funciona para o email específico que o solicitou.

### ✅ 5. Sessão Separada

**Por quê?** Após login, o token não é mais necessário. A sessão é gerenciada separadamente.

---

## 🔧 Configuração Atual

### No Código (`lib/auth.ts`):

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // Configuração do email
      // NextAuth gerencia tokens automaticamente
    }),
  ],
  session: {
    strategy: 'database', // Sessões no banco
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
}
```

### No Banco (`prisma/schema.prisma`):

```prisma
model VerificationToken {
  identifier String   // Email
  token      String   @unique  // Token único
  expires    DateTime // Data de expiração

  @@unique([identifier, token])
}
```

---

## 🚀 Melhorias Opcionais (Avançado)

Se quiser aumentar ainda mais a segurança:

### 1. **Reduzir Tempo de Expiração**

```typescript
// Em lib/auth.ts, adicione:
EmailProvider({
  maxAge: 15 * 60, // 15 minutos ao invés de 24 horas
  // ...
})
```

### 2. **Rate Limiting**

```typescript
// Limitar tentativas de login por IP
// Previne spam de emails
```

### 3. **Notificação de Login**

```typescript
// Enviar email quando alguém faz login
// "Novo login detectado em seu dispositivo"
```

### 4. **IP Whitelisting (Opcional)**

```typescript
// Armazenar IP do primeiro uso do token
// Validar que o mesmo IP está usando
```

### 5. **2FA (Two-Factor Authentication)**

```typescript
// Adicionar código adicional via SMS/App
// Camada extra de segurança
```

---

## 📈 Níveis de Segurança

### Nível 1: Básico (Atual) ✅

- Token de uso único
- Expiração em 24h
- Token aleatório
- **Adequado para**: Maioria das aplicações

### Nível 2: Médio

- Tudo do Nível 1 +
- Expiração em 15 minutos
- Rate limiting
- **Adequado para**: E-commerce, dados sensíveis

### Nível 3: Alto

- Tudo do Nível 2 +
- 2FA obrigatório
- Notificações de login
- IP whitelisting
- **Adequado para**: Bancos, saúde, governo

---

## 🎓 Conclusão

### ✅ Sua Implementação Atual É SEGURA!

O NextAuth já implementa as melhores práticas:

1. ✅ Token de uso único (deletado após uso)
2. ✅ Expiração automática (24h)
3. ✅ Token criptograficamente seguro
4. ✅ Vinculação ao email

### 📝 Recomendações:

1. **Para Desenvolvimento**: ✅ Configuração atual está perfeita
2. **Para Produção**:
   - ✅ Use HTTPS (obrigatório)
   - ✅ Configure NEXTAUTH_SECRET forte
   - ⚠️ Considere reduzir expiração para 15 minutos
   - ⚠️ Adicione rate limiting se esperar alto tráfego

### 🔒 Segurança vs UX:

| Configuração       | Segurança  | UX         |
| ------------------ | ---------- | ---------- |
| 24h de expiração   | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ |
| 15min de expiração | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Uso único          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| 2FA                | ⭐⭐⭐⭐⭐ | ⭐⭐       |

**Sua configuração atual**: Excelente balanço entre segurança e UX! ✅

---

## 🧪 Script de Teste

Crie este arquivo para testar:

```typescript
// scripts/test-token-security.ts
import { prisma } from '@/lib/prisma'

async function testTokenSecurity() {
  console.log('🔍 Verificando tokens no banco...')

  const tokens = await prisma.verificationToken.findMany()

  console.log(`📊 Tokens encontrados: ${tokens.length}`)

  tokens.forEach(token => {
    const now = new Date()
    const isExpired = token.expires < now
    const timeLeft = Math.round(
      (token.expires.getTime() - now.getTime()) / 1000 / 60
    )

    console.log(`
Token: ${token.token.substring(0, 10)}...
Email: ${token.identifier}
Expira em: ${timeLeft} minutos
Status: ${isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO'}
    `)
  })
}

testTokenSecurity()
```

---

## 📚 Referências

- [NextAuth.js Security](https://next-auth.js.org/security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Magic Link Best Practices](https://www.ory.sh/magic-link-authentication/)

---

**Resumo**: Seu sistema já é seguro! O token é de uso único e expira automaticamente. Isso é uma excelente prática de segurança. ✅🔒
