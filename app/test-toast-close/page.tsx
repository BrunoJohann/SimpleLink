'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'

export default function TestToastClosePage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ✖️ Teste do Botão de Fechar Toast
          </h1>
          <p className="text-gray-600 mt-2">
            Agora todos os toasts têm um botão X visível para fechar
          </p>
        </div>

        <div className="grid gap-6">
          {/* Feature Highlights */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">✨ Novas Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span><strong>Botão X sempre visível</strong> - Não precisa mais passar o mouse para ver o botão de fechar</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span><strong>Cores contextuais</strong> - O botão X muda de cor de acordo com o tipo do toast</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span><strong>Gap entre toasts</strong> - Espaçamento de 8px (gap-2) entre múltiplos toasts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span><strong>Hover interativo</strong> - Fundo colorido ao passar o mouse no botão X</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Test Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-900">✅ Sucesso</CardTitle>
                <CardDescription>Botão X verde</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    toast({
                      variant: 'success',
                      title: '✅ Operação Concluída!',
                      description: 'Clique no X para fechar.',
                    })
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Testar Sucesso
                </Button>
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 mb-2"><strong>Botão X:</strong></p>
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-green-100">
                      <X className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Verde ao hover</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-900">❌ Erro</CardTitle>
                <CardDescription>Botão X vermelho</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    toast({
                      variant: 'destructive',
                      title: '❌ Erro Detectado',
                      description: 'Clique no X para fechar.',
                    })
                  }
                  variant="destructive"
                  className="w-full"
                >
                  Testar Erro
                </Button>
                <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-red-700 mb-2"><strong>Botão X:</strong></p>
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-red-100">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-xs text-gray-600">Vermelho ao hover</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">ℹ️ Info</CardTitle>
                <CardDescription>Botão X cinza</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    toast({
                      title: 'ℹ️ Informação',
                      description: 'Clique no X para fechar.',
                    })
                  }
                  variant="outline"
                  className="w-full"
                >
                  Testar Info
                </Button>
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-700 mb-2"><strong>Botão X:</strong></p>
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-gray-100">
                      <X className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-xs text-gray-600">Cinza ao hover</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multiple Toasts Test */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Teste de Múltiplos Toasts (com Gap)</CardTitle>
              <CardDescription>
                Veja o espaçamento de 8px entre os toasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    toast({
                      variant: 'success',
                      title: '✅ Toast 1',
                      description: 'Primeiro toast',
                    })
                    setTimeout(() => {
                      toast({
                        variant: 'destructive',
                        title: '❌ Toast 2',
                        description: 'Segundo toast',
                      })
                    }, 300)
                    setTimeout(() => {
                      toast({
                        title: 'ℹ️ Toast 3',
                        description: 'Terceiro toast',
                      })
                    }, 600)
                  }}
                  className="w-full"
                >
                  Criar 3 Toasts
                </Button>

                <Button
                  onClick={() => {
                    for (let i = 1; i <= 5; i++) {
                      setTimeout(() => {
                        toast({
                          variant: i % 2 === 0 ? 'success' : 'destructive',
                          title: `${i % 2 === 0 ? '✅' : '❌'} Toast ${i}`,
                          description: `Notificação número ${i}`,
                        })
                      }, i * 200)
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Criar 5 Toasts
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Dica:</strong> Observe o espaçamento uniforme entre os toasts.
                  Cada toast tem 8px de distância do próximo (gap-2).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visual Examples */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 Exemplos Visuais do Botão X</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Success */}
                <div className="border-green-200 bg-green-50 rounded-lg p-4 border relative">
                  <button className="absolute right-2 top-2 rounded-md p-1 text-green-600 hover:text-green-900 hover:bg-green-100 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="pr-8">
                    <div className="text-sm font-semibold text-green-900">
                      ✅ Sucesso
                    </div>
                    <div className="text-sm text-green-900 opacity-90 mt-1">
                      Hover no X para ver o efeito
                    </div>
                  </div>
                </div>

                {/* Error */}
                <div className="border-red-200 bg-red-50 rounded-lg p-4 border relative">
                  <button className="absolute right-2 top-2 rounded-md p-1 text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="pr-8">
                    <div className="text-sm font-semibold text-red-900">
                      ❌ Erro
                    </div>
                    <div className="text-sm text-red-900 opacity-90 mt-1">
                      Hover no X para ver o efeito
                    </div>
                  </div>
                </div>

                {/* Default */}
                <div className="border bg-white rounded-lg p-4 border-gray-200 relative">
                  <button className="absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="pr-8">
                    <div className="text-sm font-semibold text-gray-900">
                      ℹ️ Info
                    </div>
                    <div className="text-sm text-gray-600 opacity-90 mt-1">
                      Hover no X para ver o efeito
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Detalhes Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Botão X - Cores por Variante:</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono space-y-1">
                    <div><strong>Success:</strong> text-green-600 hover:text-green-900 hover:bg-green-100</div>
                    <div><strong>Destructive:</strong> text-red-600 hover:text-red-900 hover:bg-red-100</div>
                    <div><strong>Default:</strong> text-gray-500 hover:text-gray-900 hover:bg-gray-100</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Gap entre Toasts:</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono">
                    <div>gap-2 (8px de espaçamento vertical)</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Posição do Botão X:</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono">
                    <div>absolute right-2 top-2 (sempre visível, canto superior direito)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

