# SimpleLink - Affiliate Product Showcase SaaS

Uma plataforma completa para criar lojas de produtos afiliados com rastreamento de cliques e analytics avançados.

> 📚 **[Ver Documentação Completa](./docs/)** | 🚀 **[Quick Start](./docs/QUICK-START.md)** | 🐳 **[Docker Setup](./docs/DOCKER-SETUP.md)**

## 🚀 Funcionalidades

### Para Usuários

- **Loja Personalizada**: Crie uma loja única com seu próprio domínio e identidade visual
- **Gestão de Produtos**: CRUD completo de produtos com links de afiliados
- **Analytics Detalhados**: Monitore cliques, conversões e performance em tempo real
- **Temas Customizáveis**: Personalize cores, layout e aparência da loja
- **Rastreamento de Cliques**: Sistema robusto de tracking com preservação de UTMs

### Para Visitantes

- **Loja Pública**: Interface limpa e responsiva para visualização de produtos
- **Busca e Filtros**: Encontre produtos facilmente
- **Redirecionamento Inteligente**: Cliques são rastreados antes do redirecionamento
- **SEO Otimizado**: Metadados e sitemap automáticos

## 🛠 Tecnologias

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon/Supabase)
- **Auth**: NextAuth.js (Magic Link)
- **UI**: shadcn/ui, Radix UI
- **Validation**: Zod
- **Charts**: Rechartsnpm u
- **Deploy**: Vercel-ready

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm
- PostgreSQL database
- SMTP server para emails (ou MailHog para desenvolvimento)

## ⚡ Instalação Rápida (com Docker)

### Setup Automático (Recomendado)

```bash
# 1. Clone e instale
git clone <seu-repo>
cd simplelink
pnpm install

# 2. Configure variáveis de ambiente
cp env.example .env.local

# 3. Setup completo (Docker + Banco + Seed)
pnpm setup

# 4. Inicie o servidor
pnpm dev
```

Pronto! Acesse:

- **App**: http://localhost:3000
- **MailHog**: http://localhost:8025
- **Login**: `demo@example.com`

### Setup Manual

Se preferir fazer passo a passo:

```bash
# 1. Instale dependências
pnpm install

# 2. Configure .env.local
cp env.example .env.local
# O arquivo já vem com as credenciais do Docker configuradas!

# 3. Inicie Docker (PostgreSQL + MailHog)
pnpm docker:up

# 4. Configure o banco
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Inicie o servidor
pnpm dev
```

### Sem Docker

Se não quiser usar Docker, configure seu próprio PostgreSQL:

```bash
# 1. Instale PostgreSQL localmente
# 2. Crie um banco: createdb simplelink
# 3. Atualize DATABASE_URL no .env.local
# 4. Execute: pnpm db:push && pnpm db:seed
```

📖 **Guia completo**: Veja [docs/SETUP.md](./docs/SETUP.md) para mais detalhes!

## 📧 Configuração de Email

### Desenvolvimento (Automático com Docker)

O MailHog já está incluído no `docker-compose.yml`! 🎉

```bash
# Já iniciado com pnpm setup ou pnpm docker:up
# Acesse: http://localhost:8025
```

Todos os emails enviados pela aplicação aparecem no MailHog.

### Produção

Configure um provedor SMTP real no `.env`:

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-de-app"
EMAIL_FROM="SimpleLink <no-reply@seudominio.com>"
```

## 🗄 Estrutura do Banco de Dados

### Principais Tabelas

- **Users**: Usuários do sistema
- **Stores**: Lojas de produtos
- **Products**: Produtos com informações básicas
- **AffiliateLinks**: Links de afiliados por marketplace
- **ClickEvents**: Log de cliques com analytics

### Relacionamentos

```
User (1) -> (N) Store (1) -> (N) Product (1) -> (N) AffiliateLink
Product (1) -> (N) ClickEvent
```

## 🎨 Personalização

### Temas

- Cores personalizáveis
- Layouts (Grid/Lista)
- Presets (Claro/Escuro)

### Marketplaces Suportados

- Amazon
- Mercado Livre
- Shopee
- Magazine Luiza
- Americanas
- Submarino
- Casas Bahia
- Extra
- E qualquer outro marketplace

## 📊 Analytics

### Métricas Disponíveis

- Cliques totais
- Cliques por dia
- Top produtos
- Top marketplaces
- Dados de UTM
- Geolocalização (IP)

### Rastreamento

```
Clique -> /api/track/click -> Log Analytics -> Redirecionamento
```

## 🚀 Deploy na Vercel

### 1. Prepare o projeto

```bash
# Build local para testar
pnpm build
```

### 2. Configure as variáveis de ambiente na Vercel

- `DATABASE_URL`: URL do seu banco PostgreSQL
- `NEXTAUTH_URL`: URL da sua aplicação
- `NEXTAUTH_SECRET`: Chave secreta
- `EMAIL_SERVER_*`: Configurações do seu provedor de email

### 3. Deploy

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Configurar banco de dados

```bash
# Aplicar migrações no banco de produção
vercel env pull .env.production
pnpm db:push
```

## 🔧 Scripts Disponíveis

```bash
# Setup e Desenvolvimento
pnpm setup            # Setup completo (Docker + DB + Seed)
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Iniciar servidor de produção

# Docker
pnpm docker:up        # Iniciar containers (PostgreSQL + MailHog)
pnpm docker:down      # Parar containers
pnpm docker:logs      # Ver logs em tempo real
pnpm docker:reset     # Resetar banco (apaga dados)

# Banco de dados
pnpm db:generate      # Gerar cliente Prisma
pnpm db:push          # Aplicar mudanças no schema
pnpm db:migrate       # Criar migração
pnpm db:studio        # Interface visual do banco
pnpm db:seed          # Popular com dados de exemplo

# Qualidade de código
pnpm lint             # Verificar problemas de código
pnpm lint:fix         # Corrigir problemas automaticamente
pnpm format           # Formatar código
pnpm type-check       # Verificar tipos TypeScript
```

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Páginas de marketing
│   ├── dashboard/         # Dashboard protegido
│   ├── loja/             # Loja pública
│   └── api/              # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── ...               # Componentes específicos
├── lib/                  # Utilitários e configurações
│   ├── repos/            # Camada de repositório
│   ├── validation/       # Schemas de validação
│   └── ...               # Configurações
├── prisma/               # Schema e migrações
└── styles/               # Estilos globais
```

## 🧪 Testando a Aplicação

### 1. Dados de Exemplo

```bash
pnpm db:seed
```

### 2. Acessar Demo

- **Loja**: [http://localhost:3000/loja/demo-store](http://localhost:3000/loja/demo-store)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email Demo**: `demo@example.com`

### 3. Testar Fluxo Completo

1. Faça login com `demo@example.com`
2. Acesse o dashboard
3. Crie/edite produtos
4. Visite a loja pública
5. Teste os cliques e analytics

## 🔒 Segurança

- **Autenticação**: NextAuth.js com magic links
- **Autorização**: Middleware de proteção de rotas
- **Validação**: Zod schemas em server e client
- **Sanitização**: Inputs validados e sanitizados
- **Rate Limiting**: Preparado para implementação

## 📈 Performance

- **SSR/SSG**: Renderização otimizada
- **Edge Runtime**: Compatível com Vercel Edge
- **Otimizações**: Imagens, fonts, bundles
- **Caching**: Estratégias de cache implementadas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📚 Documentação

- **[Quick Start](./docs/QUICK-START.md)** - Início rápido em 3 comandos
- **[Setup Completo](./docs/SETUP.md)** - Guia detalhado de instalação
- **[Docker Setup](./docs/DOCKER-SETUP.md)** - Configuração Docker
- **[Testing Login](./docs/TESTING-LOGIN.md)** - Como testar autenticação
- **[Checklist](./docs/CHECKLIST.md)** - Verificação de setup

## 🆘 Suporte

- **Issues**: [GitHub Issues](link-para-issues)
- **Documentação**: Veja pasta [docs/](./docs/)
- **Email**: suporte@simplelink.com

## 🗺 Roadmap

- [ ] Sistema de planos e assinaturas
- [ ] Integração com mais marketplaces
- [ ] API pública para desenvolvedores
- [ ] App mobile
- [ ] Sistema de cupons e descontos
- [ ] Integração com Google Analytics
- [ ] Sistema de avaliações
- [ ] Chat de suporte

---

**Desenvolvido com ❤️ para facilitar o marketing de afiliados**
