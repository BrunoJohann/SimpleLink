# 🐳 Configuração Docker - SimpleLink

## 📋 Resumo da Configuração

Toda a configuração do banco de dados está **100% pronta** e funcional! ✅

### O que está configurado:

#### 1. **Docker Compose** (`docker-compose.yml`)

- ✅ PostgreSQL 16 Alpine
- ✅ MailHog para emails
- ✅ Volumes persistentes
- ✅ Health checks
- ✅ Portas configuradas

#### 2. **Variáveis de Ambiente** (`env.example`)

- ✅ DATABASE_URL com credenciais do Docker
- ✅ NEXTAUTH_URL e SECRET
- ✅ Email configurado para MailHog
- ✅ Pronto para copiar para `.env.local`

#### 3. **Prisma** (`prisma/schema.prisma`)

- ✅ Schema completo com todos os models
- ✅ Relações configuradas
- ✅ Índices e constraints
- ✅ Seed com dados de exemplo

#### 4. **Scripts NPM** (`package.json`)

- ✅ `pnpm setup` - Setup completo automático
- ✅ `pnpm docker:up` - Iniciar containers
- ✅ `pnpm docker:down` - Parar containers
- ✅ `pnpm docker:logs` - Ver logs
- ✅ `pnpm docker:reset` - Resetar banco

#### 5. **Scripts Bash** (`scripts/`)

- ✅ `setup-db.sh` - Setup interativo
- ✅ `stop-db.sh` - Parar tudo
- ✅ `reset-db.sh` - Resetar com confirmação

## 🚀 Como Usar

### Opção 1: Setup Automático (Mais Fácil)

```bash
# 1. Instalar dependências
pnpm install

# 2. Copiar variáveis de ambiente
cp env.example .env.local

# 3. Setup completo (faz tudo!)
pnpm setup

# 4. Iniciar desenvolvimento
pnpm dev
```

### Opção 2: Passo a Passo

```bash
# 1. Iniciar Docker
pnpm docker:up

# 2. Configurar banco
pnpm db:generate
pnpm db:push
pnpm db:seed

# 3. Desenvolver
pnpm dev
```

### Opção 3: Scripts Bash

```bash
# Setup completo com feedback visual
./scripts/setup-db.sh

# Desenvolver
pnpm dev

# Quando terminar
./scripts/stop-db.sh
```

## 📊 Serviços Disponíveis

| Serviço           | Porta | URL                   | Credenciais                                                               |
| ----------------- | ----- | --------------------- | ------------------------------------------------------------------------- |
| **PostgreSQL**    | 5432  | `localhost:5432`      | user: `simplelink`<br>pass: `simplelink_dev_password`<br>db: `simplelink` |
| **MailHog SMTP**  | 1025  | `localhost:1025`      | -                                                                         |
| **MailHog Web**   | 8025  | http://localhost:8025 | -                                                                         |
| **Next.js**       | 3000  | http://localhost:3000 | -                                                                         |
| **Prisma Studio** | 5555  | http://localhost:5555 | `pnpm db:studio`                                                          |

## 🔍 Verificação Rápida

### 1. Verificar se Docker está rodando

```bash
docker-compose ps
```

Deve mostrar:

```
NAME                    STATUS
simplelink-postgres     Up (healthy)
simplelink-mailhog      Up (healthy)
```

### 2. Verificar conexão com PostgreSQL

```bash
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "\dt"
```

Deve listar as tabelas: User, Store, Product, etc.

### 3. Verificar MailHog

Abra http://localhost:8025 - deve mostrar a interface web.

### 4. Verificar dados de exemplo

```bash
pnpm db:studio
```

Deve abrir o Prisma Studio com dados de exemplo.

## 🛠 Comandos Úteis

### Gerenciar Containers

```bash
# Iniciar
pnpm docker:up

# Parar
pnpm docker:down

# Ver logs em tempo real
pnpm docker:logs

# Resetar tudo (apaga dados!)
pnpm docker:reset

# Ver status
docker-compose ps

# Entrar no container PostgreSQL
docker exec -it simplelink-postgres psql -U simplelink -d simplelink
```

### Gerenciar Banco de Dados

```bash
# Gerar cliente Prisma
pnpm db:generate

# Aplicar schema
pnpm db:push

# Criar migração
pnpm db:migrate

# Abrir Prisma Studio
pnpm db:studio

# Popular com dados
pnpm db:seed
```

### Desenvolvimento

```bash
# Iniciar servidor
pnpm dev

# Build de produção
pnpm build

# Verificar tipos
pnpm type-check

# Lint
pnpm lint
```

## 🔧 Troubleshooting

### Porta 5432 já está em uso

```bash
# Opção 1: Parar PostgreSQL local
sudo service postgresql stop  # Linux
brew services stop postgresql # macOS

# Opção 2: Mudar porta no docker-compose.yml
# Altere "5432:5432" para "5433:5432"
# E atualize DATABASE_URL para usar porta 5433
```

### Containers não iniciam

```bash
# Ver logs de erro
docker-compose logs

# Recriar containers
docker-compose down
docker-compose up -d --force-recreate

# Limpar volumes (apaga dados!)
docker-compose down -v
docker-compose up -d
```

### Erro "database does not exist"

```bash
# Recriar banco
docker-compose down -v
docker-compose up -d
sleep 5
pnpm db:push
```

### Erro de conexão Prisma

```bash
# Verificar se DATABASE_URL está correta no .env.local
cat .env.local | grep DATABASE_URL

# Deve ser:
# DATABASE_URL="postgresql://simplelink:simplelink_dev_password@localhost:5432/simplelink"

# Verificar se container está rodando
docker-compose ps

# Aguardar alguns segundos e tentar novamente
pnpm db:push
```

## 📝 Estrutura de Arquivos Docker

```
.
├── docker-compose.yml          # Configuração dos containers
├── .dockerignore              # Arquivos ignorados no build
├── Dockerfile                 # Build da aplicação (opcional)
├── env.example                # Variáveis de ambiente (com credenciais)
├── scripts/
│   ├── setup-db.sh           # Setup automático
│   ├── stop-db.sh            # Parar containers
│   └── reset-db.sh           # Resetar banco
└── .github/
    └── CHECKLIST.md          # Checklist de verificação
```

## 🎯 Fluxo de Trabalho Diário

### Começar o dia

```bash
# Iniciar containers (se não estiverem rodando)
pnpm docker:up

# Iniciar desenvolvimento
pnpm dev
```

### Durante o desenvolvimento

```bash
# Ver logs do banco em tempo real
pnpm docker:logs

# Visualizar/editar dados
pnpm db:studio

# Aplicar mudanças no schema
pnpm db:push
```

### Terminar o dia

```bash
# Parar servidor Next.js (Ctrl+C)

# Parar containers (opcional - pode deixar rodando)
pnpm docker:down
```

## 🚀 Deploy para Produção

O Docker é apenas para desenvolvimento. Para produção:

1. Use um banco PostgreSQL gerenciado (Neon, Supabase, AWS RDS, etc)
2. Configure as variáveis de ambiente na Vercel
3. Deploy normalmente

```bash
# Build local para testar
pnpm build

# Deploy na Vercel
vercel --prod
```

## ✅ Checklist Final

- [x] Docker Compose configurado
- [x] PostgreSQL rodando
- [x] MailHog rodando
- [x] Variáveis de ambiente configuradas
- [x] Prisma schema aplicado
- [x] Dados de exemplo inseridos
- [x] Scripts NPM funcionando
- [x] Scripts Bash funcionando
- [x] Documentação completa

## 🎉 Tudo Pronto!

A configuração do banco de dados está **100% completa e testada**!

Você pode começar a desenvolver imediatamente com:

```bash
pnpm setup && pnpm dev
```

---

**Dúvidas?** Consulte:

- [SETUP.md](./SETUP.md) - Guia completo de setup
- [TESTING-LOGIN.md](./TESTING-LOGIN.md) - Como testar login
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de verificação
- [README.md](../README.md) - Documentação geral
