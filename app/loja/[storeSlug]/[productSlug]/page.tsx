import { MarketplaceButtons } from '@/components/MarketplaceButtons'
import { StoreHeader } from '@/components/StoreHeader'
import { productRepo } from '@/lib/repos/product'
import { serializeProduct } from '@/lib/utils/serialize'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    storeSlug: string
    productSlug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { storeSlug, productSlug } = params

  const productData = await productRepo.findByStoreSlugAndProductSlug(storeSlug, productSlug)
  
  if (!productData) {
    notFound()
  }

  // Serialize to avoid Decimal serialization issues
  const product = serializeProduct(productData)

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={product.store} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/loja/${storeSlug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a loja
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Sem imagem</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              {product.price && (
                <div className="text-2xl font-bold text-green-600 mb-4">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </div>
              )}

              {product.description && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Marketplace Links */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MarketplaceButtons
                links={product.links}
                storeSlug={storeSlug}
                productSlug={productSlug}
              />
            </div>

            {/* Stats */}
            {product._count.clicks > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>{product._count.clicks}</strong> clique{product._count.clicks !== 1 ? 's' : ''} registrado{product._count.clicks !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await productRepo.findByStoreSlugAndProductSlug(params.storeSlug, params.productSlug)
  
  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: `${product.title} - ${product.store.name}`,
    description: product.description || `Confira ${product.title} na loja ${product.store.name}`,
    openGraph: {
      title: product.title,
      description: product.description || `Confira ${product.title} na loja ${product.store.name}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  }
}
