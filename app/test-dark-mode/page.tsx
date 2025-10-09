'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

export default function TestDarkModePage() {
  const [htmlClasses, setHtmlClasses] = useState('')
  const [theme, setTheme] = useState('')

  useEffect(() => {
    // Verificar classes no HTML
    setHtmlClasses(document.documentElement.className)
    setTheme(localStorage.getItem('theme') || 'não definido')
  }, [])

  const toggleDarkManual = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      console.log('☀️ Light mode ativado manualmente')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      console.log('🌙 Dark mode ativado manualmente')
    }
    setHtmlClasses(html.className)
    setTheme(localStorage.getItem('theme') || 'não definido')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🐛 Debug do Dark Mode</CardTitle>
            <CardDescription>
              Página para testar e debugar o sistema de dark mode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-semibold">📊 Status Atual:</p>
              <div className="text-xs font-mono space-y-1">
                <div>Classes no HTML: <code className="bg-accent px-2 py-1 rounded">{htmlClasses || '(vazio)'}</code></div>
                <div>localStorage theme: <code className="bg-accent px-2 py-1 rounded">{theme}</code></div>
                <div>Modo detectado: <code className="bg-accent px-2 py-1 rounded">{htmlClasses.includes('dark') ? '🌙 DARK' : '☀️ LIGHT'}</code></div>
              </div>
            </div>

            {/* Manual Toggle */}
            <div>
              <Label>Toggle Manual (Bypass do Context)</Label>
              <Button onClick={toggleDarkManual} className="w-full mt-2">
                Alternar Modo Manualmente
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Este botão adiciona/remove a classe 'dark' diretamente no HTML
              </p>
            </div>

            {/* Test Components */}
            <div className="space-y-4">
              <Label>Teste de Componentes:</Label>
              
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card de Teste</CardTitle>
                    <CardDescription>Este card deve mudar de cor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">Texto usando text-foreground</p>
                    <p className="text-muted-foreground">Texto usando text-muted-foreground</p>
                  </CardContent>
                </Card>

                <div>
                  <Label>Input de Teste</Label>
                  <Input placeholder="Digite algo..." />
                </div>

                <div className="flex gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
            </div>

            {/* CSS Variables */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">🎨 Variáveis CSS Atuais:</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-background border rounded">
                  <div>--background</div>
                  <div className="w-full h-8 bg-background border mt-1"></div>
                </div>
                <div className="p-2 bg-background border rounded">
                  <div>--foreground</div>
                  <div className="w-full h-8 bg-foreground border mt-1"></div>
                </div>
                <div className="p-2 bg-background border rounded">
                  <div>--card</div>
                  <div className="w-full h-8 bg-card border mt-1"></div>
                </div>
                <div className="p-2 bg-background border rounded">
                  <div>--primary</div>
                  <div className="w-full h-8 bg-primary border mt-1"></div>
                </div>
                <div className="p-2 bg-background border rounded">
                  <div>--muted</div>
                  <div className="w-full h-8 bg-muted border mt-1"></div>
                </div>
                <div className="p-2 bg-background border rounded">
                  <div>--accent</div>
                  <div className="w-full h-8 bg-accent border mt-1"></div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📝 Como Testar:
              </p>
              <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                <li>1. Clique em "Alternar Modo Manualmente"</li>
                <li>2. Observe as mudanças visuais</li>
                <li>3. Verifique o Console (F12) para logs</li>
                <li>4. Verifique se "Classes no HTML" mostra "dark"</li>
                <li>5. Recarregue a página - tema deve persistir</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

