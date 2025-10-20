import { ProductList } from '@/components/ProductList'
import { StoreHeader } from '@/components/StoreHeader'
import { Tracking } from '@/components/Tracking'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface StorePageProps {
  params: {
    storeSlug: string
  }
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { storeSlug } = await params
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams.q || ''
  const page = parseInt(resolvedSearchParams.page || '1')

  const store = await storeRepo.findBySlug(storeSlug)
  if (!store) {
    notFound()
  }

  const { products, total, pages } = await productRepo.findByStoreSlug(storeSlug, {
    search,
    page,
    limit: 12,
  })

  // Serialize products to avoid Decimal serialization issues
  const serializedProducts = serializeProducts(products)

  const theme = store.theme as any

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: theme?.preset === 'dim' ? '#111827' : '#ffffff'
      }}
    >
      <Tracking storeSlug={storeSlug} />
      <StoreHeader store={store} />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Carregando...</div>}>
          <ProductList
            products={serializedProducts}
            storeSlug={storeSlug}
            search={search}
            total={total}
            pages={pages}
            currentPage={page}
            theme={store.theme}
          />
        </Suspense>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params
  const store = await storeRepo.findBySlug(storeSlug)
  
  if (!store) {
    return {
      title: 'Loja não encontrada',
    }
  }

  return {
    title: `${store.name} - ${store.description || 'Loja de produtos'}`,
    description: store.description || `Confira os produtos da loja ${store.name}`,
  }
}
