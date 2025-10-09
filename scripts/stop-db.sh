#!/bin/bash

# Script para parar os containers Docker

echo "🛑 Parando containers Docker..."

docker-compose down

echo "✅ Containers parados com sucesso!"
echo ""
echo "💡 Para iniciar novamente, execute: ./scripts/setup-db.sh"
echo "💡 Para remover volumes (apagar dados): docker-compose down -v"
