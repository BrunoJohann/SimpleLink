'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react'

export default function TestToastPage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🔔 Sistema de Notificações Toast
          </h1>
          <p className="text-gray-600 mt-2">
            Teste os diferentes tipos de notificações popup
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Success Toasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Sucesso
              </CardTitle>
              <CardDescription>
                Notificações de operações bem-sucedidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: '✅ Salvo com Sucesso!',
                    description: 'Suas configurações foram atualizadas.',
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Configurações Salvas
              </Button>

              <Button
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: '✅ Upload Concluído!',
                    description: 'Imagem otimizada e salva com sucesso.',
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Upload de Imagem
              </Button>

              <Button
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: '✅ Produto Criado!',
                    description: 'Seu produto foi adicionado à loja.',
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Produto Adicionado
              </Button>
            </CardContent>
          </Card>

          {/* Error Toasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                Erro
              </CardTitle>
              <CardDescription>
                Notificações de erros e falhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toast({
                    variant: 'destructive',
                    title: '❌ Erro ao Salvar',
                    description: 'Não foi possível salvar as alterações.',
                  })
                }
                variant="destructive"
                className="w-full"
              >
                Erro de Salvamento
              </Button>

              <Button
                onClick={() =>
                  toast({
                    variant: 'destructive',
                    title: '❌ Upload Falhou',
                    description: 'Arquivo muito grande. Máximo: 5MB.',
                  })
                }
                variant="destructive"
                className="w-full"
              >
                Erro de Upload
              </Button>

              <Button
                onClick={() =>
                  toast({
                    variant: 'destructive',
                    title: '❌ Conexão Perdida',
                    description: 'Verifique sua conexão com a internet.',
                  })
                }
                variant="destructive"
                className="w-full"
              >
                Erro de Conexão
              </Button>
            </CardContent>
          </Card>

          {/* Info Toasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Info className="w-5 h-5 mr-2" />
                Informação
              </CardTitle>
              <CardDescription>
                Notificações informativas gerais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toast({
                    title: 'ℹ️ Sincronizando...',
                    description: 'Suas alterações estão sendo sincronizadas.',
                  })
                }
                variant="outline"
                className="w-full"
              >
                Sincronização
              </Button>

              <Button
                onClick={() =>
                  toast({
                    title: '📧 Email Enviado',
                    description: 'Verifique sua caixa de entrada.',
                  })
                }
                variant="outline"
                className="w-full"
              >
                Email Enviado
              </Button>

              <Button
                onClick={() =>
                  toast({
                    title: '🔄 Atualizando...',
                    description: 'Carregando novos dados.',
                  })
                }
                variant="outline"
                className="w-full"
              >
                Atualizando Dados
              </Button>
            </CardContent>
          </Card>

          {/* Action Toasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Trash2 className="w-5 h-5 mr-2" />
                Com Ação
              </CardTitle>
              <CardDescription>
                Notificações com botões de ação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toast({
                    title: '🗑️ Produto Deletado',
                    description: 'O produto foi removido da loja.',
                    action: (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast({
                            variant: 'success',
                            title: '↩️ Desfeito!',
                            description: 'Produto restaurado.',
                          })
                        }
                      >
                        Desfazer
                      </Button>
                    ),
                  })
                }
                variant="outline"
                className="w-full"
              >
                Deletar com Desfazer
              </Button>

              <Button
                onClick={() => {
                  // Simular múltiplos toasts
                  toast({
                    variant: 'success',
                    title: '✅ Item 1 Processado',
                  })
                  setTimeout(() => {
                    toast({
                      variant: 'success',
                      title: '✅ Item 2 Processado',
                    })
                  }, 500)
                  setTimeout(() => {
                    toast({
                      variant: 'success',
                      title: '✅ Todos Concluídos!',
                    })
                  }, 1000)
                }}
                variant="outline"
                className="w-full"
              >
                Múltiplos Toasts
              </Button>

              <Button
                onClick={() =>
                  toast({
                    title: '⏳ Processando...',
                    description: 'Isso pode levar alguns segundos.',
                    duration: 10000, // 10 segundos
                  })
                }
                variant="outline"
                className="w-full"
              >
                Toast Longo (10s)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Como Funciona
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Os toasts aparecem no canto superior direito (desktop)</li>
                  <li>• No mobile, aparecem no topo da tela</li>
                  <li>• Desaparecem automaticamente após alguns segundos</li>
                  <li>• Podem ser fechados clicando no X</li>
                  <li>• Múltiplos toasts podem aparecer ao mesmo tempo</li>
                  <li>• Totalmente acessíveis via teclado (pressione Esc para fechar)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📝 Exemplo de Código</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useToast } from '@/hooks/use-toast'

export function MyComponent() {
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      
      toast({
        variant: 'success',
        title: '✅ Sucesso!',
        description: 'Dados salvos com sucesso!',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '❌ Erro',
        description: 'Não foi possível salvar.',
      })
    }
  }

  return <Button onClick={handleSave}>Salvar</Button>
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

