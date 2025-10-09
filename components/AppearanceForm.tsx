'use client'

import { LogoUpload } from '@/components/LogoUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateStoreSchema, type UpdateStoreInput } from '@/lib/validation/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { Eye, Layout, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface AppearanceFormProps {
  readonly store: Store
}

export function AppearanceForm({ store }: AppearanceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const theme = (store.theme as any) || {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateStoreInput>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      name: store.name,
      slug: store.slug,
      description: store.description || '',
      logo: store.logo || '',
      theme: {
        primaryColor: theme.primaryColor || '#3b82f6',
        layout: theme.layout || 'grid',
        preset: theme.preset || 'light',
      },
    },
  })

  const watchedTheme = watch('theme')

  const onSubmit = async (data: UpdateStoreInput) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar loja')
      }

      console.log('🎉 Chamando toast de sucesso...')
      const toastResult = toast({
        variant: 'success',
        title: '✅ Sucesso!',
        description: 'Configurações salvas com sucesso!',
      })
      console.log('🎉 Toast criado:', toastResult)
      
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err) {
      console.log('❌ Chamando toast de erro...')
      toast({
        variant: 'destructive',
        title: '❌ Erro',
        description: err instanceof Error ? err.message : 'Erro inesperado ao salvar',
      })
      console.log('❌ Toast de erro criado')
    } finally {
      setIsLoading(false)
    }
  }

  const colorPresets = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Vermelho', value: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configure o nome e descrição da sua loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Loja</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Minha Loja"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug da Loja</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="minha-loja"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                URL: /loja/{watch('slug') || 'minha-loja'}
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Descreva sua loja..."
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <LogoUpload
              currentLogo={watch('logo') || null}
              onLogoChange={(logo) => setValue('logo', logo || '')}
            />
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Tema da Loja
            </CardTitle>
            <CardDescription>
              Personalize as cores e layout da sua loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Presets */}
            <div>
              <Label>Cores Predefinidas</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setValue('theme.primaryColor', preset.value)}
                    className={`w-12 h-12 rounded-lg border-2 ${
                      watchedTheme?.primaryColor === preset.value
                        ? 'border-gray-900'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color */}
            <div>
              <Label htmlFor="primaryColor">Cor Personalizada</Label>
              <div className="flex items-center space-x-3 mt-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={watchedTheme?.primaryColor || '#3b82f6'}
                  onChange={(e) => setValue('theme.primaryColor', e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={watchedTheme?.primaryColor || '#3b82f6'}
                  onChange={(e) => setValue('theme.primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Layout */}
            <div>
              <Label className="flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Layout dos Produtos
              </Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="grid"
                    checked={watchedTheme?.layout === 'grid'}
                    onChange={(e) => setValue('theme.layout', e.target.value as 'grid')}
                    className="text-blue-600"
                  />
                  <span>Grid</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="list"
                    checked={watchedTheme?.layout === 'list'}
                    onChange={(e) => setValue('theme.layout', e.target.value as 'list')}
                    className="text-blue-600"
                  />
                  <span>Lista</span>
                </label>
              </div>
            </div>

            {/* Preset */}
            <div>
              <Label>Tema</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="light"
                    checked={watchedTheme?.preset === 'light'}
                    onChange={(e) => setValue('theme.preset', e.target.value as 'light')}
                    className="text-blue-600"
                  />
                  <span>Claro</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="dim"
                    checked={watchedTheme?.preset === 'dim'}
                    onChange={(e) => setValue('theme.preset', e.target.value as 'dim')}
                    className="text-blue-600"
                  />
                  <span>Escuro</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </CardTitle>
            <CardDescription>
              Como sua loja aparecerá para os visitantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-6 space-y-4"
              style={{
                backgroundColor: watchedTheme?.preset === 'dim' ? '#1f2937' : '#ffffff',
                color: watchedTheme?.preset === 'dim' ? '#f9fafb' : '#111827',
              }}
            >
              <div className="flex items-center space-x-3">
                {watch('logo') ? (
                  <img
                    src={watch('logo') || ''}
                    alt="Logo"
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: watchedTheme?.primaryColor || '#3b82f6' }}
                  >
                    {(watch('name') || 'M').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{watch('name') || 'Minha Loja'}</h3>
                  <p className="text-sm opacity-75">
                    {watch('description') || 'Descrição da loja'}
                  </p>
                </div>
              </div>
              
              <div className={`grid gap-4 ${
                watchedTheme?.layout === 'list' ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className="border rounded-lg p-4"
                    style={{
                      borderColor: watchedTheme?.preset === 'dim' ? '#374151' : '#e5e7eb',
                      backgroundColor: watchedTheme?.preset === 'dim' ? '#374151' : '#f9fafb',
                    }}
                  >
                    <div 
                      className="w-full h-24 rounded mb-3"
                      style={{ backgroundColor: watchedTheme?.primaryColor || '#3b82f6', opacity: 0.1 }}
                    />
                    <h4 className="font-medium">Produto {i}</h4>
                    <p className="text-sm opacity-75">Descrição do produto</p>
                    <div 
                      className="mt-2 w-20 h-6 rounded text-white text-sm flex items-center justify-center"
                      style={{ backgroundColor: watchedTheme?.primaryColor || '#3b82f6' }}
                    >
                      Comprar
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
