# 📚 Documentação - SimpleLink

Bem-vindo à documentação completa do SimpleLink!

## 🚀 Começando

### Para Iniciantes

1. **[Quick Start](./QUICK-START.md)** ⚡
   - Comece em 3 comandos
   - Ideal para quem quer testar rapidamente

### Para Setup Completo

2. **[Setup Completo](./SETUP.md)** 📋
   - Guia detalhado passo a passo
   - Troubleshooting completo
   - Configurações avançadas

## 🐳 Docker

3. **[Docker Setup](./DOCKER-SETUP.md)** 🐳
   - Configuração completa do Docker
   - PostgreSQL + MailHog
   - Comandos úteis
   - Troubleshooting Docker

## 🔐 Autenticação

4. **[Testing Login](./TESTING-LOGIN.md)** 🔐
   - Como testar o sistema de login
   - Guia do MailHog
   - Fluxo de autenticação
   - Debug de emails

## ✅ Verificação

5. **[Checklist](./CHECKLIST.md)** ✅
   - Checklist completo de setup
   - Verificações de ambiente
   - Testes básicos
   - Comandos de debug

## 📦 Instalação

6. **[Install Instructions](./INSTALL-INSTRUCTIONS.md)** 📦
   - Instruções de instalação do nodemailer
   - Resolução de problemas comuns

## 📖 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo (índice)
├── QUICK-START.md              # Início rápido
├── SETUP.md                    # Setup completo
├── DOCKER-SETUP.md             # Configuração Docker
├── TESTING-LOGIN.md            # Teste de autenticação
├── CHECKLIST.md                # Checklist de verificação
└── INSTALL-INSTRUCTIONS.md     # Instruções de instalação
```

## 🎯 Fluxo Recomendado

### Primeira Vez?

```
1. QUICK-START.md    → Comece aqui!
2. TESTING-LOGIN.md  → Teste o login
3. SETUP.md          → Entenda os detalhes
```

### Problemas?

```
1. CHECKLIST.md      → Verifique o setup
2. DOCKER-SETUP.md   → Troubleshooting Docker
3. README.md         → Documentação geral
```

### Produção?

```
1. SETUP.md          → Seção de deploy
2. README.md         → Seção de deploy na Vercel
```

## 🔗 Links Úteis

- **[README Principal](../README.md)** - Visão geral do projeto
- **[Prisma Schema](../prisma/schema.prisma)** - Estrutura do banco
- **[Docker Compose](../docker-compose.yml)** - Configuração dos containers
- **[Package.json](../package.json)** - Scripts e dependências

## 🆘 Precisa de Ajuda?

### Por Tópico

- **Setup inicial**: [QUICK-START.md](./QUICK-START.md)
- **Docker não funciona**: [DOCKER-SETUP.md](./DOCKER-SETUP.md)
- **Login não funciona**: [TESTING-LOGIN.md](./TESTING-LOGIN.md)
- **Verificar configuração**: [CHECKLIST.md](./CHECKLIST.md)

### Comandos Rápidos

```bash
# Setup completo
pnpm setup

# Ver status Docker
docker-compose ps

# Ver logs
docker-compose logs -f

# Abrir Prisma Studio
pnpm db:studio

# Resetar banco
pnpm docker:reset
```

## 📝 Contribuindo com a Documentação

Encontrou um erro ou quer melhorar a documentação?

1. Edite o arquivo correspondente
2. Mantenha o formato Markdown
3. Adicione exemplos práticos
4. Teste as instruções
5. Abra um Pull Request

---

**Boa leitura e bom desenvolvimento! 🚀**
