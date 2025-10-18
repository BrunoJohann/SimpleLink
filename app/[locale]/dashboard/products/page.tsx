import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { Edit, Plus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params
  const t = await getTranslations('dashboard.products')
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  const search = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')

  const { products: productsData, total, pages } = await productRepo.findByStoreId(store.id, {
    search,
    page,
    limit: 20,
  })

  const products = serializeProducts(productsData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('description')}
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('newProduct')}
          </Button>
        </Link>
      </div>

      {products.length === 0 && !search ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('noProducts.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('noProducts.description')}
          </p>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('noProducts.createFirst')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              {search ? t('searchResults', { query: search }) : t('allProducts')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('productsFound', { count: total })}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.product')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.marketplace')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.clicks')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.created')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.imageUrl ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.imageUrl}
                              alt={product.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">{t('noImage')}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.price ? t('price', { price: product.price.toFixed(2).replace('.', ',') }) : t('noPrice')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.links.slice(0, 2).map((link) => (
                          <span
                            key={link.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {link.marketplace}
                          </span>
                        ))}
                        {product.links.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{product.links.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.published ? t('status.published') : t('status.draft')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product._count.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {t('pagination.pageOf', { current: page, total: pages })}
                </div>
                <div className="flex space-x-2">
                  {page > 1 && (
                    <Link href={`/dashboard/products?page=${page - 1}${search ? `&q=${search}` : ''}`}>
                      <Button variant="outline" size="sm">
                        {t('pagination.previous')}
                      </Button>
                    </Link>
                  )}
                  {page < pages && (
                    <Link href={`/dashboard/products?page=${page + 1}${search ? `&q=${search}` : ''}`}>
                      <Button variant="outline" size="sm">
                        {t('pagination.next')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
