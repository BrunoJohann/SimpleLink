'use client'

import { LogoUpload } from '@/components/LogoUpload'
import { StoreLanguageSelector } from '@/components/StoreLanguageSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateStoreSchema, type UpdateStoreInput } from '@/lib/validation/store'
import { useAppearanceStore } from '@/stores/appearanceStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { Layout, Palette } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface AppearanceFormProps {
  readonly store: Store
}

export function AppearanceForm({ store }: AppearanceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('dashboard.appearance.form')
  const { setPreviewStore, updatePreviewStore } = useAppearanceStore()

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
        headerStyle: theme.headerStyle || 'minimalist',
        productSize: theme.productSize || 'medium',
        showPrices: theme.showPrices !== false,
        showDescriptions: theme.showDescriptions !== false,
        showLogo: theme.showLogo !== false,
      },
    },
  })

  const watchedTheme = watch('theme')
  const watchedValues = watch()

  // Inicializar preview store
  useEffect(() => {
    setPreviewStore(store)
  }, [store, setPreviewStore])

  // Atualizar preview em tempo real
  useEffect(() => {
    updatePreviewStore({
      name: watchedValues.name,
      slug: watchedValues.slug,
      description: watchedValues.description,
      logo: watchedValues.logo,
      theme: watchedValues.theme,
    })
  }, [
    watchedValues.name, 
    watchedValues.slug, 
    watchedValues.description, 
    watchedValues.logo, 
    watchedValues.theme,
    watchedTheme?.primaryColor,
    watchedTheme?.layout,
    watchedTheme?.preset,
    watchedTheme?.headerStyle,
    watchedTheme?.productSize,
    watchedTheme?.showPrices,
    watchedTheme?.showDescriptions,
    watchedTheme?.showLogo,
    updatePreviewStore
  ])

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
        title: t('messages.successTitle'),
        description: t('messages.updateSuccess'),
      })
      console.log('🎉 Toast criado:', toastResult)
      
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err) {
      console.log('❌ Chamando toast de erro...')
      toast({
        variant: 'destructive',
        title: t('messages.errorTitle'),
        description: err instanceof Error ? err.message : t('messages.unexpectedError'),
      })
      console.log('❌ Toast de erro criado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = async (language: string) => {
    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar idioma')
      }

      router.refresh()
    } catch (error) {
      throw error
    }
  }

  const colorPresets = [
    { name: t('colorPresets.blue'), value: '#3b82f6' },
    { name: t('colorPresets.green'), value: '#10b981' },
    { name: t('colorPresets.purple'), value: '#8b5cf6' },
    { name: t('colorPresets.pink'), value: '#ec4899' },
    { name: t('colorPresets.orange'), value: '#f97316' },
    { name: t('colorPresets.red'), value: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('basicInfo.title')}</CardTitle>
            <CardDescription>
              {t('basicInfo.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t('basicInfo.fields.storeName')}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('basicInfo.fields.storeNamePlaceholder')}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">{t('basicInfo.fields.slug')}</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder={t('basicInfo.fields.slugPlaceholder')}
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t('basicInfo.fields.slugUrl', { slug: watch('slug') || 'minha-loja' })}
              </p>
            </div>

            <div>
              <Label htmlFor="description">{t('basicInfo.fields.description')}</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder={t('basicInfo.fields.descriptionPlaceholder')}
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

        {/* Store Language */}
        <StoreLanguageSelector
          currentLanguage={store.language || 'en'}
          onLanguageChange={handleLanguageChange}
        />

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              {t('theme.title')}
            </CardTitle>
            <CardDescription>
              {t('theme.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Presets */}
            <div>
              <Label>{t('theme.priceColor')}</Label>
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
              <Label htmlFor="primaryColor">{t('theme.customPriceColor')}</Label>
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
                {t('theme.layout.title')}
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
                  <span>{t('theme.layout.grid')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="list"
                    checked={watchedTheme?.layout === 'list'}
                    onChange={(e) => setValue('theme.layout', e.target.value as 'list')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.layout.list')}</span>
                </label>
              </div>
            </div>

            {/* Preset */}
            <div>
              <Label>{t('theme.preset.title')}</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="light"
                    checked={watchedTheme?.preset === 'light'}
                    onChange={(e) => setValue('theme.preset', e.target.value as 'light')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.preset.light')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="dim"
                    checked={watchedTheme?.preset === 'dim'}
                    onChange={(e) => setValue('theme.preset', e.target.value as 'dim')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.preset.dark')}</span>
                </label>
              </div>
            </div>

            {/* Header Style */}
            <div>
              <Label>{t('theme.headerStyle.title')}</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="minimalist"
                    checked={watchedTheme?.headerStyle === 'minimalist'}
                    onChange={(e) => setValue('theme.headerStyle', e.target.value as 'minimalist')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.headerStyle.minimalist')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="centered"
                    checked={watchedTheme?.headerStyle === 'centered'}
                    onChange={(e) => setValue('theme.headerStyle', e.target.value as 'centered')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.headerStyle.centered')}</span>
                </label>
              </div>
            </div>

            {/* Product Size */}
            <div>
              <Label>{t('theme.productSize.title')}</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="small"
                    checked={watchedTheme?.productSize === 'small'}
                    onChange={(e) => setValue('theme.productSize', e.target.value as 'small')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.productSize.small')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="medium"
                    checked={watchedTheme?.productSize === 'medium'}
                    onChange={(e) => setValue('theme.productSize', e.target.value as 'medium')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.productSize.medium')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="large"
                    checked={watchedTheme?.productSize === 'large'}
                    onChange={(e) => setValue('theme.productSize', e.target.value as 'large')}
                    className="text-blue-600"
                  />
                  <span>{t('theme.productSize.large')}</span>
                </label>
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <Label>{t('theme.displayOptions.title')}</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedTheme?.showPrices !== false}
                    onChange={(e) => setValue('theme.showPrices', e.target.checked)}
                    className="text-blue-600"
                  />
                  <span>{t('theme.displayOptions.showPrices')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedTheme?.showDescriptions !== false}
                    onChange={(e) => setValue('theme.showDescriptions', e.target.checked)}
                    className="text-blue-600"
                  />
                  <span>{t('theme.displayOptions.showDescriptions')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedTheme?.showLogo !== false}
                    onChange={(e) => setValue('theme.showLogo', e.target.checked)}
                    className="text-blue-600"
                  />
                  <span>{t('theme.displayOptions.showLogo')}</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('buttons.saving') : t('buttons.save')}
          </Button>
        </div>
      </form>
    </div>
  )
}