import { AnalyticsChart } from '@/components/AnalyticsChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { analyticsRepo } from '@/lib/repos/analytics'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

interface AnalyticsPageProps {
  params: Promise<{ locale: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { locale } = await params
  const t = await getTranslations('dashboard.analytics')
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  const analytics = await analyticsRepo.getStoreAnalytics(store.id, 30)

  // Serialize products to avoid Decimal issues
  const topProducts = serializeProducts(analytics.productViews.topProducts)

  const totalClicks = analytics.clicks.total
  const totalViews = analytics.productViews.total
  const totalVisits = analytics.storeVisits.total

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('description')}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.storeVisits')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              {t('overview.last30Days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.productViews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {t('overview.last30Days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.totalClicks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {t('overview.last30Days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('overview.activeProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('overview.withClicks')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.storeVisits.title')}</CardTitle>
            <CardDescription>
              {t('charts.storeVisits.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.storeVisits.byDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('charts.productViews.title')}</CardTitle>
            <CardDescription>
              {t('charts.productViews.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.productViews.byDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('charts.clicksByDay.title')}</CardTitle>
            <CardDescription>
              {t('charts.clicksByDay.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.clicks.byDay} />
          </CardContent>
        </Card>
      </div>

      {/* Top Marketplaces */}
      <Card>
        <CardHeader>
          <CardTitle>{t('charts.topMarketplaces.title')}</CardTitle>
          <CardDescription>
            {t('charts.topMarketplaces.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.clicks.byDay.length > 0 ? (
            <div className="space-y-2">
              {analytics.clicks.byDay.map((marketplace, index) => (
                <div key={marketplace.createdAt} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{new Date(marketplace.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t('charts.topMarketplaces.clicks', { count: marketplace._count.id })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('charts.topMarketplaces.noClicks')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>{t('topProducts.title')}</CardTitle>
          <CardDescription>
            {t('topProducts.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.price ? 
                          new Intl.NumberFormat(locale, {
                            style: 'currency',
                            currency: locale === 'pt-BR' ? 'BRL' : 'USD'
                          }).format(Number(product.price)) : 
                          t('topProducts.noPrice')
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {t('topProducts.views', { 
                        count: product._count.views || 0,
                        plural: (product._count.views || 0) !== 1 ? 's' : ''
                      })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t('topProducts.clicks', { 
                        count: product._count.clicks || 0,
                        plural: (product._count.clicks || 0) !== 1 ? 's' : ''
                      })}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`topProducts.status.${product.published ? 'published' : 'draft'}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('topProducts.noProducts')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
