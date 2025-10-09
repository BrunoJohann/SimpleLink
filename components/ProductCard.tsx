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
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={`/loja/${storeSlug}/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Sem imagem</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
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
            {product.price && (
              <span className="font-semibold text-green-600">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          {product._count.clicks > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {product._count.clicks} clique{product._count.clicks !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
