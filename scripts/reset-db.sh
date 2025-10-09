#!/bin/bash

# Script para resetar completamente o banco de dados

echo "⚠️  ATENÇÃO: Este script irá apagar TODOS os dados do banco!"
read -p "Tem certeza que deseja continuar? (s/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo "🗑️  Parando containers e removendo volumes..."
docker-compose down -v

echo "🚀 Iniciando containers novamente..."
docker-compose up -d

echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 5

echo "📊 Aplicando schema do Prisma..."
pnpm db:push

echo "🌱 Populando banco com dados de exemplo..."
pnpm db:seed

echo "✅ Banco de dados resetado com sucesso!"
echo ""
echo "🔗 Acesse: http://localhost:3000"
echo "📧 MailHog: http://localhost:8025"
