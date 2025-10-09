'use client'

import { LogoUpload } from '@/components/LogoUpload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function TestLogoPage() {
  const [logo, setLogo] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleLogoChange = (base64: string | null) => {
    addLog(`Logo changed: ${base64 ? `${Math.round(base64.length / 1024)}KB` : 'removed'}`)
    setLogo(base64)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Teste de Upload de Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LogoUpload
              currentLogo={logo}
              onLogoChange={handleLogoChange}
            />

            {logo && (
              <div className="space-y-2">
                <strong>Logo Atual:</strong>
                <div className="bg-gray-100 p-4 rounded">
                  <p className="text-sm">Tamanho: {Math.round(logo.length / 1024)}KB</p>
                  <p className="text-sm">Formato: {logo.substring(0, 30)}...</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <strong>Logs:</strong>
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs space-y-1 max-h-64 overflow-auto">
                {logs.length === 0 ? (
                  <p>Aguardando ações...</p>
                ) : (
                  logs.map((log, i) => <p key={i}>{log}</p>)
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
