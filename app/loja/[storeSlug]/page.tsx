import { ProductList } from '@/components/ProductList'
import { StoreHeader } from '@/components/StoreHeader'
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
  const { storeSlug } = params
  const search = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')

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

  return (
    <div className="min-h-screen bg-gray-50">
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
          />
        </Suspense>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { storeSlug: string } }) {
  const store = await storeRepo.findBySlug(params.storeSlug)
  
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
