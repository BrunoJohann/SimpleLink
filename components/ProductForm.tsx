'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createProductSchema, updateAffiliateLinksSchema, type AffiliateLinkInput, type CreateProductInput } from '@/lib/validation/product'
import { zodResolver } from '@hookform/resolvers/zod'
import { AffiliateLink, Product } from '@prisma/client'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProductFormProps {
  storeId: string
  product?: Omit<Product, 'price'> & { 
    price: number | null
    links: AffiliateLink[] 
  }
}

export function ProductForm({ storeId, product }: ProductFormProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.products.form')
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<AffiliateLinkInput[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = !!product

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: product ? {
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      price: product.price?.toString() || '',
      published: product.published,
    } : {
      published: true,
    },
  })

  const watchedPublished = watch('published')

  useEffect(() => {
    if (product?.links) {
      setLinks(product.links.map(link => ({
        marketplace: link.marketplace,
        url: link.url,
        note: link.note || '',
      })))
    }
  }, [product])

  const addLink = () => {
    setLinks([...links, { marketplace: '', url: '', note: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: keyof AffiliateLinkInput, value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    setLinks(updatedLinks)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (data: CreateProductInput) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate links
      const validatedLinks = updateAffiliateLinksSchema.parse({ links })

      const productData = {
        ...data,
        price: data.price || undefined,
        imageUrl: data.imageUrl || undefined,
      }

      let productId: string

      if (isEditing && product) {
        // Update existing product
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })

        if (!response.ok) {
          throw new Error(t('messages.updateError'))
        }

        productId = product.id
      } else {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...productData, storeId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('messages.createError'))
        }

        const result = await response.json()
        productId = result.id
      }

      // Update affiliate links
      const linksResponse = await fetch(`/api/products/${productId}/links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedLinks),
      })

      if (!linksResponse.ok) {
        throw new Error(t('messages.linksError'))
      }

      setSuccess(isEditing ? t('messages.updateSuccess') : t('messages.createSuccess'))
      
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('messages.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
          <TabsTrigger value="links">{t('tabs.links')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('basicInfo.title')}</CardTitle>
              <CardDescription>
                {t('basicInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t('basicInfo.fields.title')} *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder={t('basicInfo.fields.titlePlaceholder')}
                  onChange={(e) => {
                    register('title').onChange(e)
                    if (!isEditing) {
                      setValue('slug', generateSlug(e.target.value))
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">{t('basicInfo.fields.slug')} *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder={t('basicInfo.fields.slugPlaceholder')}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('basicInfo.fields.slugUrl', { slug: watch('slug') || t('basicInfo.fields.slugPlaceholder') })}
                </p>
              </div>

              <div>
                <Label htmlFor="description">{t('basicInfo.fields.description')}</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder={t('basicInfo.fields.descriptionPlaceholder')}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="imageUrl">{t('basicInfo.fields.imageUrl')}</Label>
                <Input
                  id="imageUrl"
                  {...register('imageUrl')}
                  placeholder={t('basicInfo.fields.imageUrlPlaceholder')}
                  type="url"
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>
                )}
                {watch('imageUrl') && (
                  <div className="mt-2">
                    <img
                      src={watch('imageUrl')!}
                      alt={t('basicInfo.fields.imagePreview')}
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="price">{t('basicInfo.fields.price')}</Label>
                <Input
                  id="price"
                  {...register('price')}
                  placeholder={t('basicInfo.fields.pricePlaceholder')}
                  type="text"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={watchedPublished}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
                <Label htmlFor="published">{t('basicInfo.fields.published')}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('affiliateLinks.title')}</CardTitle>
              <CardDescription>
                {t('affiliateLinks.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{t('affiliateLinks.linkNumber', { number: index + 1 })}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>{t('affiliateLinks.fields.marketplace')}</Label>
                      <Input
                        placeholder={t('affiliateLinks.fields.marketplacePlaceholder')}
                        value={link.marketplace}
                        onChange={(e) => updateLink(index, 'marketplace', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>{t('affiliateLinks.fields.url')} *</Label>
                      <Input
                        placeholder={t('affiliateLinks.fields.urlPlaceholder')}
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>{t('affiliateLinks.fields.note')}</Label>
                      <Input
                        placeholder={t('affiliateLinks.fields.notePlaceholder')}
                        value={link.note}
                        onChange={(e) => updateLink(index, 'note', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addLink}>
                <Plus className="w-4 h-4 mr-2" />
                {t('affiliateLinks.addLink')}
              </Button>

              {links.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('affiliateLinks.noLinks.title')}</p>
                  <p className="text-sm">{t('affiliateLinks.noLinks.description')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/products')}
        >
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('buttons.saving') : isEditing ? t('buttons.update') : t('buttons.create')}
        </Button>
      </div>
    </form>
  )
}
