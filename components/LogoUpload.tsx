'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { optimizeLogoImage, validateImageFile } from '@/lib/utils/image'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface LogoUploadProps {
  currentLogo?: string | null
  onLogoChange: (base64: string | null) => void
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Atualizar preview quando currentLogo mudar (mostra logo existente ao carregar)
  useEffect(() => {
    setPreview(currentLogo || null)
  }, [currentLogo])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setIsProcessing(true)

    try {
      console.log('📤 Iniciando upload:', file.name, file.type, `${Math.round(file.size / 1024)}KB`)

      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.valid) {
        console.error('❌ Validação falhou:', validation.error)
        setError(validation.error || 'Arquivo inválido')
        setIsProcessing(false)
        return
      }

      console.log('✅ Arquivo válido, otimizando...')

      // Otimizar imagem
      const optimizedBase64 = await optimizeLogoImage(file, 200, 0.8)
      
      // Calcular tamanho
      const sizeInKB = Math.round((optimizedBase64.length * 3) / 4 / 1024)
      console.log(`✅ Logo otimizada: ${sizeInKB}KB`)

      setPreview(optimizedBase64)
      onLogoChange(optimizedBase64)
      console.log('✅ Preview atualizado')
    } catch (err) {
      console.error('❌ Erro ao processar:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onLogoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Label>Logo da Loja</Label>
      
      <div className="flex items-start space-x-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Logo preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processando...' : preview ? 'Trocar Logo' : 'Upload Logo'}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Formatos: JPG, PNG, WebP</p>
            <p>• Tamanho máximo: 5MB</p>
            <p>• Recomendado: 200x200px (quadrado)</p>
            <p>• A imagem será otimizada automaticamente</p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Otimizando imagem...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
