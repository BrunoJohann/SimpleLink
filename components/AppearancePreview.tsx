'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppearanceStore } from '@/stores/appearanceStore'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AppearancePreview() {
  const { previewStore } = useAppearanceStore()
  const t = useTranslations('dashboard.appearance.form.preview')
  
  if (!previewStore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('loading')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 space-y-4 min-h-[500px] flex items-center justify-center">
            <div className="text-gray-500">{t('loading')}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const store = previewStore
  
  const theme = (store.theme as any) || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          {t('title')}
        </CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="border rounded-lg p-6 space-y-4 min-h-[500px]"
          style={{
            backgroundColor: theme?.preset === 'dim' ? '#1f2937' : '#ffffff',
            color: theme?.preset === 'dim' ? '#f9fafb' : '#111827',
          }}
        >
          {/* Store Header */}
          <div className={`flex items-center space-x-3 pb-4 border-b py-2 ${
            theme?.headerStyle === 'centered' ? 'justify-center' : ''
          }`} style={{
            borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb',
            backgroundColor: 'transparent'
          }}>
            {theme?.showLogo !== false && (
              store.logo ? (
                <img
                  src={store.logo}
                  alt="Logo"
                  className="rounded-lg object-cover border w-12 h-12"
                  style={{
                    borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb'
                  }}
                />
              ) : (
                <div 
                  className="rounded-lg flex items-center justify-center text-white font-bold w-12 h-12"
                  style={{ backgroundColor: theme?.primaryColor || '#3b82f6' }}
                >
                  {(store.name || 'M').charAt(0).toUpperCase()}
                </div>
              )
            )}
            <div>
              <h3 className="font-bold text-lg">{store.name || t('defaultStoreName')}</h3>
              <p className="opacity-75 text-sm">
                {store.description || t('defaultDescription')}
              </p>
            </div>
          </div>
          
          {/* Products Grid/List */}
          <div className={`grid gap-4 ${
            theme?.layout === 'list' ? 'grid-cols-1' : 
            theme?.productSize === 'small' ? 'grid-cols-3' : 
            theme?.productSize === 'large' ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`border rounded-lg ${
                  theme?.layout === 'list' ? 'p-3' :
                  theme?.productSize === 'small' ? 'p-2' : 
                  theme?.productSize === 'large' ? 'p-6' : 'p-4'
                } ${
                  theme?.layout === 'list' ? 'flex items-center space-x-3' : ''
                }`}
                style={{
                  borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb',
                  backgroundColor: theme?.preset === 'dim' ? '#374151' : '#f9fafb',
                }}
              >
                {/* Image - only for list layout */}
                {theme?.layout === 'list' && (
                  <div 
                    className="w-16 h-16 rounded flex-shrink-0"
                    style={{ backgroundColor: theme?.primaryColor || '#3b82f6', opacity: 0.1 }}
                  />
                )}
                
                {/* Content */}
                <div className={`${theme?.layout === 'list' ? 'flex-1' : ''}`}>
                  {/* Image for grid layout */}
                  {theme?.layout !== 'list' && (
                    <div 
                      className={`w-full rounded mb-3 ${
                        theme?.productSize === 'small' ? 'h-16' : 
                        theme?.productSize === 'large' ? 'h-32' : 'h-24'
                      }`}
                      style={{ backgroundColor: theme?.primaryColor || '#3b82f6', opacity: 0.1 }}
                    />
                  )}
                  
                  <h4 className={`font-medium ${
                    theme?.layout === 'list' ? 'text-base' :
                    theme?.productSize === 'small' ? 'text-sm' : 
                    theme?.productSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>{t('productTitle', { number: i })}</h4>
                  
                  {theme?.showDescriptions !== false && (
                    <p className={`opacity-75 ${
                      theme?.layout === 'list' ? 'text-sm' :
                      theme?.productSize === 'small' ? 'text-xs' : 'text-sm'
                    }`}>{t('productDescription')}</p>
                  )}
                  
                  <div className={`${theme?.layout === 'list' ? 'flex items-center justify-between mt-2' : ''}`}>
                    {theme?.showPrices !== false && (
                      <p className={`font-semibold ${
                        theme?.layout === 'list' ? 'text-sm' :
                        theme?.productSize === 'small' ? 'text-xs' : 'text-sm'
                      } ${theme?.layout === 'list' ? 'mt-0' : 'mt-1'}`} 
                         style={{ color: theme?.primaryColor || '#3b82f6' }}>
                        $29.99
                      </p>
                    )}
                    
                    <div 
                      className={`rounded text-white flex items-center justify-center ${
                        theme?.layout === 'list' ? 'w-20 h-6 text-sm' :
                        theme?.productSize === 'small' ? 'w-16 h-5 text-xs' : 
                        theme?.productSize === 'large' ? 'w-24 h-8 text-base' : 'w-20 h-6 text-sm'
                      } ${theme?.layout === 'list' ? 'mt-0' : 'mt-2'}`}
                      style={{ backgroundColor: theme?.primaryColor || '#3b82f6' }}
                    >
                      {t('buyButton')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
