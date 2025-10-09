# ⚡ Quick Start - SimpleLink

## 🚀 Começar em 3 Comandos

```bash
pnpm install && cp env.example .env.local && pnpm setup && pnpm dev
```

Pronto! Acesse http://localhost:3000 🎉

---

## 📋 Passo a Passo Detalhado

### 1️⃣ Instalar Dependências

```bash
pnpm install
```

### 2️⃣ Configurar Ambiente

```bash
cp env.example .env.local
```

### 3️⃣ Setup Completo

```bash
pnpm setup
```

Isso vai:

- ✅ Iniciar PostgreSQL no Docker
- ✅ Iniciar MailHog no Docker
- ✅ Gerar cliente Prisma
- ✅ Criar tabelas no banco
- ✅ Inserir dados de exemplo

### 4️⃣ Iniciar Desenvolvimento

```bash
pnpm dev
```

---

## 🌐 URLs Importantes

| Serviço           | URL                                   | Descrição           |
| ----------------- | ------------------------------------- | ------------------- |
| **App**           | http://localhost:3000                 | Aplicação principal |
| **Loja Demo**     | http://localhost:3000/loja/demo-store | Loja de exemplo     |
| **Login**         | http://localhost:3000/login           | Página de login     |
| **Dashboard**     | http://localhost:3000/dashboard       | Painel admin        |
| **MailHog**       | http://localhost:8025                 | Ver emails enviados |
| **Prisma Studio** | `pnpm db:studio`                      | GUI do banco        |

---

## 🔑 Credenciais de Teste

### Login

- **Email**: `demo@example.com`
- **Senha**: Não precisa! Use o link do email no MailHog

### Banco de Dados

- **Host**: localhost:5432
- **User**: simplelink
- **Pass**: simplelink_dev_password
- **DB**: simplelink

---

## 🎯 Comandos Essenciais

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor
pnpm build            # Build de produção

# Docker
pnpm docker:up        # Iniciar containers
pnpm docker:down      # Parar containers
pnpm docker:logs      # Ver logs

# Banco de Dados
pnpm db:studio        # Abrir GUI do banco
pnpm db:push          # Aplicar mudanças no schema
pnpm db:seed          # Inserir dados de exemplo

# Qualidade
pnpm lint             # Verificar código
pnpm type-check       # Verificar tipos
```

---

## 🐛 Problemas Comuns

### Porta 5432 em uso

```bash
# Parar PostgreSQL local
sudo service postgresql stop
```

### Containers não iniciam

```bash
# Recriar containers
docker-compose down -v && docker-compose up -d
```

### Erro de conexão

```bash
# Aguardar alguns segundos e tentar novamente
sleep 5 && pnpm db:push
```

---

## 📚 Documentação Completa

- [SETUP.md](./SETUP.md) - Guia completo de instalação
- [DOCKER-SETUP.md](./DOCKER-SETUP.md) - Detalhes do Docker
- [TESTING-LOGIN.md](./TESTING-LOGIN.md) - Como testar login
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de verificação
- [README.md](../README.md) - Documentação geral

---

## 🎉 Pronto para Começar!

Tudo configurado? Execute:

```bash
pnpm dev
```

E comece a desenvolver! 🚀
