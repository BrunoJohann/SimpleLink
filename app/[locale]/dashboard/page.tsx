import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { Eye, Package, Plus, TrendingUp } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const t = await getTranslations('dashboard')
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get or create store for user
  let store = await storeRepo.findFirstByOwnerId(session.user.id)
  
  if (!store) {
    // Create default store for user
    store = await storeRepo.create({
      ownerId: session.user.id,
      name: `${session.user.name || 'Minha'} Loja`,
      slug: `${session.user.email?.split('@')[0] || 'loja'}-${Date.now()}`,
      description: 'Bem-vindo à minha loja de produtos afiliados!',
    })
  }

  // Get store stats
  const { products: productsData } = await productRepo.findByStoreId(store.id, { limit: 5 })
  const products = serializeProducts(productsData)
  const analytics = await productRepo.getAnalytics(store.id, 7)

  const totalClicks = analytics.clicksByDay.reduce((sum, day) => sum + day._count.id, 0)
  const totalProducts = products.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('welcome', { name: session.user.name || session.user.email })}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('welcomeMessage', { storeName: store.name })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.totalProducts')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts === 0 ? t('stats.noProductsYet') : t('stats.productsRegistered', { count: totalProducts })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.clicks7Days')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {totalClicks === 0 ? t('stats.noClicksYet') : t('stats.clicksRegistered', { count: totalClicks })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.topMarketplace')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.topMarketplaces[0]?._count.id || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.topMarketplaces[0]?.marketplace || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.storeActive')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">✓</div>
            <p className="text-xs text-muted-foreground">
              <Link 
                href={`/loja/${store.slug}`} 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                {t('stats.viewPublicStore')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentProducts.title')}</CardTitle>
            <CardDescription>
              {t('recentProducts.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('recentProducts.noProducts')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('recentProducts.noProductsDescription')}
                </p>
                <Link href="/dashboard/products/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('recentProducts.createProduct')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.title}</h4>
                      <p className="text-sm text-gray-600">
                        {t('recentProducts.marketplaces', { 
                          count: product.links.length,
                          plural: product.links.length !== 1 ? 's' : ''
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.published ? t('recentProducts.published') : t('recentProducts.draft')}
                      </span>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          {t('recentProducts.edit')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/products">
                    <Button variant="outline">{t('recentProducts.viewAll')}</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity.title')}</CardTitle>
            <CardDescription>
              {t('recentActivity.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.clicksByDay.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('recentActivity.noClicks')}
                </h3>
                <p className="text-gray-600">
                  {t('recentActivity.noClicksDescription')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.clicksByDay.slice(-5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(day.createdAt).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US')}
                    </span>
                    <span className="font-medium">{t('recentActivity.clicks', { count: day._count.id })}</span>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/analytics">
                    <Button variant="outline">{t('recentActivity.viewFullAnalytics')}</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
