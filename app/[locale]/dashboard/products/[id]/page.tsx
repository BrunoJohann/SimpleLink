import { ProductForm } from '@/components/ProductForm'
import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProduct } from '@/lib/utils/serialize'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'

interface EditProductPageProps {
  params: Promise<{ 
    locale: string
    id: string 
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { locale, id } = await params
  const t = await getTranslations('dashboard.products.edit')
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  const productData = await productRepo.findById(id)
  if (!productData || productData.storeId !== store.id) {
    notFound()
  }

  // Serialize to avoid Decimal issues
  const product = serializeProduct(productData)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('description', { productTitle: product.title })}
        </p>
      </div>

      <ProductForm storeId={store.id} product={product} />
    </div>
  )
}
