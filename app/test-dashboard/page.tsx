'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function TestDashboardPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Teste de Dashboard (Sem Middleware)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                status === 'authenticated' ? 'bg-green-100 text-green-800' :
                status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>

            <div>
              <strong>Autenticado:</strong>
              <span className="ml-2">{session ? '✅ Sim' : '❌ Não'}</span>
            </div>

            {session?.user && (
              <div className="space-y-2">
                <strong>Dados do Usuário:</strong>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(session.user, null, 2)}
                </pre>
              </div>
            )}

            {!session && status !== 'loading' && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Você não está autenticado!</p>
                <Link href="/login">
                  <Button>Ir para Login</Button>
                </Link>
              </div>
            )}

            {session && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-800 font-semibold">
                    ✅ Autenticação funcionando!
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Se você vê esta mensagem, significa que o NextAuth está funcionando corretamente.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Link href="/dashboard">
                    <Button>Tentar Dashboard Real</Button>
                  </Link>
                  <Link href="/debug-session">
                    <Button variant="outline">Ver Debug</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
