# 📑 Índice da Documentação

## 📂 Estrutura Organizada

Todos os arquivos de documentação agora estão na pasta `docs/`:

```
docs/
├── README.md                    # Índice da documentação
├── QUICK-START.md              # ⚡ Início rápido (3 comandos)
├── SETUP.md                    # 📋 Setup completo e detalhado
├── DOCKER-SETUP.md             # 🐳 Configuração Docker
├── TESTING-LOGIN.md            # 🔐 Como testar login
├── CHECKLIST.md                # ✅ Checklist de verificação
└── INSTALL-INSTRUCTIONS.md     # 📦 Instruções de instalação
```

## 🎯 Por Onde Começar?

### Novo no Projeto?

1. 📖 Leia [../README.md](../README.md) - Visão geral
2. ⚡ Siga [QUICK-START.md](./QUICK-START.md) - Setup rápido
3. 🔐 Teste [TESTING-LOGIN.md](./TESTING-LOGIN.md) - Login

### Problemas no Setup?

1. ✅ Verifique [CHECKLIST.md](./CHECKLIST.md)
2. 🐳 Consulte [DOCKER-SETUP.md](./DOCKER-SETUP.md)
3. 📋 Veja [SETUP.md](./SETUP.md)

### Deploy em Produção?

1. 📖 Leia [../README.md](../README.md) - Seção Deploy
2. 📋 Siga [SETUP.md](./SETUP.md) - Seção Vercel

## 📚 Guias por Tópico

### Instalação e Setup

- [QUICK-START.md](./QUICK-START.md) - Início rápido
- [SETUP.md](./SETUP.md) - Setup detalhado
- [INSTALL-INSTRUCTIONS.md](./INSTALL-INSTRUCTIONS.md) - Dependências

### Docker

- [DOCKER-SETUP.md](./DOCKER-SETUP.md) - Configuração completa
- [SETUP.md](./SETUP.md#docker) - Seção Docker

### Autenticação

- [TESTING-LOGIN.md](./TESTING-LOGIN.md) - Testar login
- [SETUP.md](./SETUP.md#email) - Configuração de email

### Verificação

- [CHECKLIST.md](./CHECKLIST.md) - Checklist completo
- [DOCKER-SETUP.md](./DOCKER-SETUP.md#verificação) - Verificações Docker

## 🔍 Busca Rápida

### Comandos

```bash
# Ver todos os comandos disponíveis
cat ../package.json | grep "scripts"

# Ver configuração Docker
cat ../docker-compose.yml

# Ver schema do banco
cat ../prisma/schema.prisma
```

### Arquivos Importantes

- `../package.json` - Scripts NPM
- `../docker-compose.yml` - Containers
- `../env.example` - Variáveis de ambiente
- `../prisma/schema.prisma` - Banco de dados
- `../lib/auth.ts` - Configuração NextAuth

## 🎓 Tutoriais

### Tutorial 1: Setup Inicial (5 min)

```bash
pnpm install
cp env.example .env.local
pnpm setup
pnpm dev
```

📖 Detalhes: [QUICK-START.md](./QUICK-START.md)

### Tutorial 2: Testar Login (3 min)

1. Acesse http://localhost:3000/login
2. Digite `demo@example.com`
3. Veja email em http://localhost:8025
4. Clique no link
5. Acesse dashboard!

📖 Detalhes: [TESTING-LOGIN.md](./TESTING-LOGIN.md)

### Tutorial 3: Criar Produto (5 min)

1. Login no dashboard
2. Clique em "Produtos"
3. Clique em "Novo Produto"
4. Preencha informações
5. Adicione links de afiliados
6. Salve!

📖 Detalhes: [../README.md](../README.md#funcionalidades)

## 🆘 FAQ

### Como resetar o banco?

```bash
pnpm docker:reset
pnpm db:push
pnpm db:seed
```

### Como ver os emails?

Abra http://localhost:8025

### Como editar dados do banco?

```bash
pnpm db:studio
```

### Porta 5432 em uso?

```bash
# Parar PostgreSQL local
sudo service postgresql stop
```

### Docker não inicia?

```bash
docker-compose down -v
docker-compose up -d
```

## 📞 Suporte

- **Documentação**: Você está aqui! 📚
- **Issues**: [GitHub Issues](link-para-issues)
- **README**: [../README.md](../README.md)

---

**Encontrou o que procurava? Ótimo! Senão, abra uma issue! 🚀**
