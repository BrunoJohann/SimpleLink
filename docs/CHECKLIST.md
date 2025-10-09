# ✅ Checklist de Configuração - SimpleLink

Use este checklist para garantir que tudo está configurado corretamente.

## 📦 Instalação Inicial

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Docker instalado e rodando
- [ ] Docker Compose instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)

## 🔧 Configuração

- [ ] Arquivo `.env.local` criado (`cp env.example .env.local`)
- [ ] `DATABASE_URL` configurada corretamente
- [ ] `NEXTAUTH_SECRET` gerado (pode usar: `openssl rand -base64 32`)
- [ ] Containers Docker iniciados (`pnpm docker:up`)
- [ ] PostgreSQL acessível (porta 5432)
- [ ] MailHog acessível (porta 8025)

## 🗄️ Banco de Dados

- [ ] Cliente Prisma gerado (`pnpm db:generate`)
- [ ] Schema aplicado no banco (`pnpm db:push`)
- [ ] Dados de exemplo inseridos (`pnpm db:seed`)
- [ ] Prisma Studio funciona (`pnpm db:studio`)

## 🧪 Testes Básicos

- [ ] Servidor Next.js inicia sem erros (`pnpm dev`)
- [ ] Página inicial carrega (http://localhost:3000)
- [ ] Loja demo acessível (http://localhost:3000/loja/demo-store)
- [ ] Login funciona (http://localhost:3000/login)
- [ ] Email aparece no MailHog (http://localhost:8025)
- [ ] Dashboard acessível após login
- [ ] Pode criar um produto novo
- [ ] Pode editar um produto existente
- [ ] Analytics mostra dados
- [ ] Aparência pode ser customizada

## 🚀 Build de Produção

- [ ] Build completa sem erros (`pnpm build`)
- [ ] Type check passa (`pnpm type-check`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Formato correto (`pnpm format:check`)

## 📊 Verificações do Banco

Execute no Prisma Studio ou psql:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Deve retornar: User, Store, Product, AffiliateLink, ClickEvent, etc.

-- Verificar dados de exemplo
SELECT COUNT(*) FROM "User";      -- Deve ter pelo menos 1
SELECT COUNT(*) FROM "Store";     -- Deve ter pelo menos 1
SELECT COUNT(*) FROM "Product";   -- Deve ter pelo menos 4
```

## 🐳 Verificações Docker

```bash
# Verificar containers rodando
docker-compose ps

# Deve mostrar:
# - simplelink-postgres (Up)
# - simplelink-mailhog (Up)

# Verificar logs
docker-compose logs postgres
docker-compose logs mailhog

# Testar conexão com PostgreSQL
docker exec -it simplelink-postgres psql -U simplelink -d simplelink -c "SELECT version();"
```

## 🔍 Troubleshooting

### Porta 5432 em uso

```bash
# Verificar o que está usando a porta
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Parar PostgreSQL local se necessário
sudo service postgresql stop
```

### Containers não iniciam

```bash
# Limpar tudo e recomeçar
docker-compose down -v
docker-compose up -d --force-recreate
```

### Erro de conexão Prisma

```bash
# Verificar se o container está rodando
docker-compose ps

# Aguardar alguns segundos
sleep 5

# Tentar novamente
pnpm db:push
```

### Build falha

```bash
# Limpar cache
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

## ✨ Tudo Funcionando?

Se todos os itens acima estão marcados, você está pronto para desenvolver! 🎉

### Próximos Passos

1. Explore o código em `app/` e `components/`
2. Customize o tema em `styles/globals.css`
3. Adicione novos recursos
4. Faça deploy na Vercel

### Comandos Úteis para o Dia a Dia

```bash
# Desenvolvimento
pnpm dev                 # Iniciar servidor
pnpm db:studio          # Visualizar banco
pnpm docker:logs        # Ver logs do Docker

# Quando adicionar novos campos no schema
pnpm db:push            # Aplicar mudanças
pnpm db:seed            # Repopular dados

# Antes de commit
pnpm lint:fix           # Corrigir problemas
pnpm format             # Formatar código
pnpm type-check         # Verificar tipos
```

## 📝 Notas

- Mantenha o Docker rodando durante desenvolvimento
- Use Prisma Studio para visualizar/editar dados facilmente
- MailHog captura todos os emails em desenvolvimento
- Execute `pnpm docker:reset` se precisar limpar o banco

---

**Dúvidas?** Consulte [SETUP.md](../../SETUP.md) ou [README.md](../../README.md)
