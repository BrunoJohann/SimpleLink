# 🚀 Guia Rápido de Setup - SimpleLink

Este guia vai te ajudar a configurar o projeto em poucos minutos usando Docker.

## 📋 Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recomendado) ou npm
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## ⚡ Setup Rápido (Recomendado)

### 1. Clone e instale dependências

```bash
# Clone o repositório
git clone <seu-repo>
cd simplelink

# Instale as dependências
pnpm install
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp env.example .env.local
```

O arquivo `.env.local` já vem configurado com as credenciais do Docker! 🎉

### 3. Inicie o ambiente completo

```bash
# Este comando faz tudo de uma vez:
# - Inicia PostgreSQL e MailHog no Docker
# - Gera o cliente Prisma
# - Aplica o schema no banco
# - Popula com dados de exemplo
pnpm setup
```

### 4. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Pronto! Acesse:

- **App**: http://localhost:3000
- **MailHog (emails)**: http://localhost:8025
- **Prisma Studio**: `pnpm db:studio`

## 🐳 Comandos Docker Úteis

```bash
# Iniciar containers
pnpm docker:up

# Parar containers
pnpm docker:down

# Ver logs em tempo real
pnpm docker:logs

# Resetar banco (apaga todos os dados)
pnpm docker:reset

# Ou use os scripts bash:
./scripts/setup-db.sh    # Configurar tudo
./scripts/stop-db.sh     # Parar containers
./scripts/reset-db.sh    # Resetar banco
```

## 📊 Comandos do Banco de Dados

```bash
# Gerar cliente Prisma
pnpm db:generate

# Aplicar mudanças no schema (dev)
pnpm db:push

# Criar migração
pnpm db:migrate

# Abrir Prisma Studio (GUI do banco)
pnpm db:studio

# Popular com dados de exemplo
pnpm db:seed
```

## 🧪 Testando a Aplicação

### Dados de Exemplo

Após executar `pnpm setup` ou `pnpm db:seed`, você terá:

- **Loja Demo**: http://localhost:3000/loja/demo-store
- **Email para login**: `demo@example.com`
- **4 produtos de exemplo** com links de afiliados

### Fluxo de Teste

1. Acesse http://localhost:3000/login
2. Digite `demo@example.com`
3. Vá para http://localhost:8025 (MailHog)
4. Clique no link de login no email
5. Explore o dashboard!

## 🔧 Troubleshooting

### Porta 5432 já está em uso

Se você já tem PostgreSQL rodando localmente:

```bash
# Opção 1: Pare seu PostgreSQL local
sudo service postgresql stop  # Linux
brew services stop postgresql # macOS

# Opção 2: Mude a porta no docker-compose.yml
ports:
  - '5433:5432'  # Usa porta 5433 no host

# E atualize a DATABASE_URL no .env.local
DATABASE_URL="postgresql://simplelink:simplelink_dev_password@localhost:5433/simplelink"
```

### Containers não iniciam

```bash
# Verifique se o Docker está rodando
docker ps

# Veja os logs
docker-compose logs

# Recrie os containers
docker-compose down
docker-compose up -d --force-recreate
```

### Erro de conexão com o banco

```bash
# Verifique se o container está rodando
docker-compose ps

# Aguarde alguns segundos para o PostgreSQL iniciar
# Então tente novamente
pnpm db:push
```

### Limpar tudo e recomeçar

```bash
# Para containers e remove volumes
docker-compose down -v

# Remove node_modules e reinstala
rm -rf node_modules
pnpm install

# Setup completo novamente
pnpm setup
```

## 📧 Configuração de Email

### Desenvolvimento (MailHog)

O MailHog já está configurado no Docker! Todos os emails enviados aparecem em:
http://localhost:8025

### Produção

Para produção, configure um provedor de email real no `.env`:

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-de-app"
EMAIL_FROM="SimpleLink <no-reply@seudominio.com>"
```

## 🚀 Deploy

### Vercel

1. Crie um banco PostgreSQL (Neon, Supabase, etc)
2. Configure as variáveis de ambiente na Vercel
3. Deploy!

```bash
vercel --prod
```

### Variáveis de Ambiente para Produção

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="gere-um-secret-forte-aqui"
EMAIL_SERVER_HOST="smtp.seuservidor.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="seu-usuario"
EMAIL_SERVER_PASSWORD="sua-senha"
EMAIL_FROM="SimpleLink <no-reply@seudominio.com>"
```

## 💡 Dicas

- Use `pnpm db:studio` para visualizar/editar dados
- Use `pnpm docker:logs` para debug em tempo real
- Mantenha o MailHog aberto durante desenvolvimento
- Execute `pnpm db:seed` sempre que precisar de dados novos

## 🆘 Precisa de Ajuda?

- Verifique o [README.md](../README.md) completo
- Veja [TESTING-LOGIN.md](./TESTING-LOGIN.md) para testar autenticação
- Veja [DOCKER-SETUP.md](./DOCKER-SETUP.md) para detalhes do Docker
- Abra uma [issue](link-para-issues)
- Consulte a [documentação do Prisma](https://www.prisma.io/docs)
- Consulte a [documentação do Next.js](https://nextjs.org/docs)

---

**Bom desenvolvimento! 🎉**
