/**
 * Script para testar a segurança dos tokens de email
 *
 * Uso:
 * npx tsx scripts/test-token-security.ts
 */

import { prisma } from '../lib/prisma'

async function testTokenSecurity() {
  console.log('\n🔐 === TESTE DE SEGURANÇA DE TOKENS ===\n')

  try {
    // 1. Verificar tokens existentes
    console.log('📊 1. Verificando tokens no banco de dados...')
    const tokens = await prisma.verificationToken.findMany({
      orderBy: { expires: 'desc' },
    })

    if (tokens.length === 0) {
      console.log('   ℹ️  Nenhum token encontrado')
      console.log(
        '   💡 Solicite um login em http://localhost:3000/login para criar um token\n'
      )
    } else {
      console.log(`   ✅ ${tokens.length} token(s) encontrado(s)\n`)

      tokens.forEach((token, index) => {
        const now = new Date()
        const isExpired = token.expires < now
        const timeLeft = Math.round(
          (token.expires.getTime() - now.getTime()) / 1000 / 60
        )
        const tokenPreview = token.token.substring(0, 16) + '...'

        console.log(`   Token ${index + 1}:`)
        console.log(`   ├─ Email: ${token.identifier}`)
        console.log(`   ├─ Token: ${tokenPreview}`)
        console.log(`   ├─ Expira: ${token.expires.toLocaleString('pt-BR')}`)
        console.log(`   ├─ Tempo restante: ${timeLeft} minutos`)
        console.log(`   └─ Status: ${isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO'}`)
        console.log()
      })
    }

    // 2. Verificar sessões ativas
    console.log('👤 2. Verificando sessões ativas...')
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { expires: 'desc' },
    })

    if (sessions.length === 0) {
      console.log('   ℹ️  Nenhuma sessão ativa\n')
    } else {
      console.log(`   ✅ ${sessions.length} sessão(ões) ativa(s)\n`)

      sessions.forEach((session, index) => {
        const now = new Date()
        const isExpired = session.expires < now
        const daysLeft = Math.round(
          (session.expires.getTime() - now.getTime()) / 1000 / 60 / 60 / 24
        )

        console.log(`   Sessão ${index + 1}:`)
        console.log(
          `   ├─ Usuário: ${session.user.name || 'Sem nome'} (${session.user.email})`
        )
        console.log(`   ├─ Expira: ${session.expires.toLocaleString('pt-BR')}`)
        console.log(`   ├─ Tempo restante: ${daysLeft} dias`)
        console.log(`   └─ Status: ${isExpired ? '❌ EXPIRADA' : '✅ ATIVA'}`)
        console.log()
      })
    }

    // 3. Estatísticas
    console.log('📈 3. Estatísticas de Segurança:')
    const validTokens = tokens.filter(t => t.expires > new Date()).length
    const expiredTokens = tokens.filter(t => t.expires <= new Date()).length
    const activeSessions = sessions.filter(s => s.expires > new Date()).length

    console.log(`   ├─ Tokens válidos: ${validTokens}`)
    console.log(`   ├─ Tokens expirados: ${expiredTokens}`)
    console.log(`   ├─ Sessões ativas: ${activeSessions}`)
    console.log(`   └─ Total de usuários: ${await prisma.user.count()}`)
    console.log()

    // 4. Recomendações de segurança
    console.log('🛡️  4. Verificação de Segurança:')

    if (validTokens > 5) {
      console.log(
        '   ⚠️  Muitos tokens válidos. Considere limpar tokens antigos.'
      )
    } else {
      console.log('   ✅ Número de tokens válidos está OK')
    }

    if (expiredTokens > 0) {
      console.log(
        `   ⚠️  ${expiredTokens} token(s) expirado(s) no banco. Recomenda-se limpeza.`
      )
      console.log('      Execute: npm run db:studio → Delete tokens expirados')
    } else {
      console.log('   ✅ Nenhum token expirado no banco')
    }

    console.log()

    // 5. Teste de uso único
    console.log('🧪 5. Como Testar Uso Único:')
    console.log('   1. Vá para http://localhost:3000/login')
    console.log('   2. Digite um email e solicite login')
    console.log('   3. Abra http://localhost:8025 (MailHog)')
    console.log('   4. Copie o link do email')
    console.log('   5. Abra o link (primeira vez) → Deve funcionar ✅')
    console.log(
      '   6. Execute este script novamente → Token deve ter sido DELETADO'
    )
    console.log('   7. Tente abrir o link novamente → Deve falhar ❌')
    console.log()

    console.log('✅ === TESTE CONCLUÍDO ===\n')
  } catch (error) {
    console.error('❌ Erro ao executar teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar teste
testTokenSecurity()
