#!/bin/bash

# Script para configurar o banco de dados local com Docker

echo "🐳 Configurando ambiente de desenvolvimento com Docker..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Parar containers existentes (se houver)
echo "🛑 Parando containers existentes..."
docker-compose down

# Iniciar containers
echo "🚀 Iniciando containers..."
docker-compose up -d

# Aguardar o PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 5

# Verificar se os containers estão rodando
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers iniciados com sucesso!"
    echo ""
    echo "📊 PostgreSQL disponível em: localhost:5432"
    echo "   - Usuário: simplelink"
    echo "   - Senha: simplelink_dev_password"
    echo "   - Database: simplelink"
    echo ""
    echo "📧 MailHog disponível em:"
    echo "   - SMTP: localhost:1025"
    echo "   - Web UI: http://localhost:8025"
    echo ""
    echo "🔧 Próximos passos:"
    echo "   1. Copie o arquivo de exemplo: cp env.example .env.local"
    echo "   2. Configure a DATABASE_URL no .env.local:"
    echo "      DATABASE_URL=\"postgresql://simplelink:simplelink_dev_password@localhost:5432/simplelink\""
    echo "   3. Execute: pnpm db:generate"
    echo "   4. Execute: pnpm db:push"
    echo "   5. Execute: pnpm db:seed (opcional)"
    echo "   6. Execute: pnpm dev"
else
    echo "❌ Erro ao iniciar containers. Verifique os logs com: docker-compose logs"
    exit 1
fi
