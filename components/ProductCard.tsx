import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AffiliateLink, Product } from '@prisma/client'
import Link from 'next/link'

interface ProductCardProps {
  product: Omit<Product, 'price'> & {
    price: number | null
    links: AffiliateLink[]
    _count: {
      clicks: number
    }
  }
  storeSlug: string
  theme?: any
}

export function ProductCard({ product, storeSlug, theme }: ProductCardProps) {
  const isListLayout = theme?.layout === 'list'
  
  return (
    <Card 
      className={`group hover:shadow-lg transition-shadow ${
        isListLayout ? 'flex items-center space-x-3' : ''
      }`}
      style={{
        borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb',
        backgroundColor: theme?.preset === 'dim' ? '#374151' : '#f9fafb',
      }}
    >
      <Link href={`/loja/${storeSlug}/${product.slug}`} className={isListLayout ? 'flex items-center space-x-3 w-full' : ''}>
        {/* Image */}
        <CardHeader className={isListLayout ? 'p-0' : 'p-0'}>
          <div className={`overflow-hidden rounded-lg ${
            isListLayout ? 'w-16 h-16 flex-shrink-0' : 'aspect-square rounded-t-lg'
          }`}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className={`object-cover group-hover:scale-105 transition-transform duration-200 ${
                  isListLayout ? 'w-16 h-16' : 'w-full h-full'
                }`}
              />
            ) : (
              <div className={`bg-gray-200 flex items-center justify-center ${
                isListLayout ? 'w-16 h-16' : 'w-full h-full'
              }`}>
                <span className="text-gray-400 text-sm">Sem imagem</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        {/* Content */}
        <CardContent className={`${isListLayout ? 'flex-1 p-3' : 'p-4'}`}>
          <h3 className={`font-semibold mb-2 line-clamp-2 ${
            isListLayout ? 'text-base' :
            theme?.productSize === 'small' ? 'text-sm' : 
            theme?.productSize === 'large' ? 'text-lg' : 'text-base'
          }`} style={{
            color: theme?.preset === 'dim' ? '#f9fafb' : '#111827'
          }}>
            {product.title}
          </h3>
          
          {theme?.showDescriptions !== false && product.description && (
            <p className={`mb-3 line-clamp-3 ${
              isListLayout ? 'text-sm' :
              theme?.productSize === 'small' ? 'text-xs' : 'text-sm'
            }`} style={{
              color: theme?.preset === 'dim' ? '#d1d5db' : '#6b7280'
            }}>
              {product.description}
            </p>
          )}
          
          <div className={`${isListLayout ? 'flex items-center justify-between mt-2' : 'flex items-center justify-between'}`}>
            <div className="flex flex-wrap gap-1">
              {product.links.slice(0, 3).map((link) => (
                <Badge key={link.id} variant="secondary" className="text-xs">
                  {link.marketplace}
                </Badge>
              ))}
              {product.links.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.links.length - 3}
                </Badge>
              )}
            </div>
            
            {theme?.showPrices !== false && product.price && (
              <span className={`font-semibold ${
                isListLayout ? 'text-sm' :
                theme?.productSize === 'small' ? 'text-xs' : 'text-sm'
              }`} style={{ 
                color: theme?.primaryColor || '#10b981'
              }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          
          {product._count.clicks > 0 && (
            <p className={`text-xs mt-2 ${
              theme?.preset === 'dim' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {product._count.clicks} clique{product._count.clicks !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
