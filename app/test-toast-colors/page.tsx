'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function TestToastColorsPage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎨 Teste de Cores dos Toasts
          </h1>
          <p className="text-gray-600 mt-2">
            Compare os estilos dos toasts de sucesso e erro
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Success Toast */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">✅ Toast de Sucesso</CardTitle>
              <CardDescription className="text-green-700">
                Fundo verde suave e agradável
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-green-800">
                  <strong>Estilo:</strong>
                </p>
                <ul className="text-xs text-green-700 space-y-1 ml-4">
                  <li>• Fundo: <code className="bg-green-100 px-1 rounded">bg-green-50</code></li>
                  <li>• Borda: <code className="bg-green-100 px-1 rounded">border-green-200</code></li>
                  <li>• Texto: <code className="bg-green-100 px-1 rounded">text-green-900</code></li>
                </ul>
              </div>

              <Button
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: '✅ Operação Bem-Sucedida!',
                    description: 'Suas configurações foram salvas com sucesso.',
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Testar Toast de Sucesso
              </Button>

              {/* Preview */}
              <div className="border-2 border-green-300 rounded-lg p-4 bg-white">
                <p className="text-xs text-green-600 mb-2 font-semibold">Preview:</p>
                <div className="border-green-200 bg-green-50 rounded-md p-4 border">
                  <div className="text-sm font-semibold text-green-900">
                    ✅ Operação Bem-Sucedida!
                  </div>
                  <div className="text-sm text-green-900 opacity-90 mt-1">
                    Suas configurações foram salvas com sucesso.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Toast */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">❌ Toast de Erro</CardTitle>
              <CardDescription className="text-red-700">
                Fundo vermelho suave (atualizado!)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-red-800">
                  <strong>Estilo:</strong>
                </p>
                <ul className="text-xs text-red-700 space-y-1 ml-4">
                  <li>• Fundo: <code className="bg-red-100 px-1 rounded">bg-red-50</code></li>
                  <li>• Borda: <code className="bg-red-100 px-1 rounded">border-red-200</code></li>
                  <li>• Texto: <code className="bg-red-100 px-1 rounded">text-red-900</code></li>
                </ul>
              </div>

              <Button
                onClick={() =>
                  toast({
                    variant: 'destructive',
                    title: '❌ Erro ao Processar',
                    description: 'Não foi possível salvar as alterações. Tente novamente.',
                  })
                }
                variant="destructive"
                className="w-full"
              >
                Testar Toast de Erro
              </Button>

              {/* Preview */}
              <div className="border-2 border-red-300 rounded-lg p-4 bg-white">
                <p className="text-xs text-red-600 mb-2 font-semibold">Preview:</p>
                <div className="border-red-200 bg-red-50 rounded-md p-4 border">
                  <div className="text-sm font-semibold text-red-900">
                    ❌ Erro ao Processar
                  </div>
                  <div className="text-sm text-red-900 opacity-90 mt-1">
                    Não foi possível salvar as alterações. Tente novamente.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📊 Comparação de Estilos</CardTitle>
            <CardDescription>
              Ambos os toasts agora usam fundos suaves e agradáveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">✅ Sucesso</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-50 border border-green-200 rounded"></div>
                    <span className="text-gray-600">Fundo suave</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 border-2 border-green-200 rounded"></div>
                    <span className="text-gray-600">Borda delicada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-900 rounded"></div>
                    <span className="text-gray-600">Texto escuro</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-red-900 mb-2">❌ Erro</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-gray-600">Fundo suave</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 border-2 border-red-200 rounded"></div>
                    <span className="text-gray-600">Borda delicada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-red-900 rounded"></div>
                    <span className="text-gray-600">Texto escuro</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Dica:</strong> Os fundos suaves (50) proporcionam melhor legibilidade
                e são menos agressivos visualmente, mantendo a identidade da cor (verde = sucesso, vermelho = erro).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Both */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🎯 Teste Rápido</CardTitle>
            <CardDescription>
              Clique nos botões abaixo para ver os toasts lado a lado
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={() => {
                toast({
                  variant: 'success',
                  title: '✅ Sucesso!',
                  description: 'Operação concluída.',
                })
                setTimeout(() => {
                  toast({
                    variant: 'destructive',
                    title: '❌ Erro!',
                    description: 'Algo deu errado.',
                  })
                }, 500)
              }}
              className="flex-1"
            >
              Testar Ambos
            </Button>

            <Button
              onClick={() => {
                for (let i = 1; i <= 3; i++) {
                  setTimeout(() => {
                    toast({
                      variant: i % 2 === 0 ? 'success' : 'destructive',
                      title: i % 2 === 0 ? '✅ Sucesso!' : '❌ Erro!',
                      description: `Notificação ${i} de 3`,
                    })
                  }, i * 500)
                }
              }}
              variant="outline"
              className="flex-1"
            >
              Testar Múltiplos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

