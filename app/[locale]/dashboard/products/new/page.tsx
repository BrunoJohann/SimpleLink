import { ProductForm } from '@/components/ProductForm'
import { authOptions } from '@/lib/auth'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

interface NewProductPageProps {
  params: Promise<{ locale: string }>
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale } = await params
  const t = await getTranslations('dashboard.products.new')
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('description')}
        </p>
      </div>

      <ProductForm storeId={store.id} />
    </div>
  )
}
