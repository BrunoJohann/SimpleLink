'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function DebugSessionPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Debug de Sessão</h1>
          <p className="text-gray-600">Verifique o estado da autenticação</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status da Sessão</CardTitle>
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

            {session && (
              <div className="space-y-2">
                <strong>Sessão Completa:</strong>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button variant="outline">Ir para Login</Button>
          </Link>
          {session && (
            <Link href="/dashboard">
              <Button>Ir para Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
