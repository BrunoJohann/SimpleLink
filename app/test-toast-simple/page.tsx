'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function TestToastSimplePage() {
  const { toast } = useToast()

  const handleClick = () => {
    console.log('🔘 Botão clicado!')
    const result = toast({
      variant: 'success',
      title: '✅ Teste',
      description: 'Toast funcionando!',
    })
    console.log('🔘 Toast retornado:', result)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Teste Simples de Toast</h1>
        <Button onClick={handleClick} size="lg">
          Clique para Testar Toast
        </Button>
        <p className="text-sm text-gray-600">
          Abra o Console (F12) para ver os logs
        </p>
      </div>
    </div>
  )
}

