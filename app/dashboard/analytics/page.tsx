import { AnalyticsChart } from '@/components/AnalyticsChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  const analytics = await productRepo.getAnalytics(store.id, 30)

  // Serialize products to avoid Decimal issues
  const topProducts = serializeProducts(analytics.topProducts)

  const totalClicks = analytics.clicksByDay.reduce((sum, day) => sum + day._count.id, 0)
  const totalClicksLast7Days = analytics.clicksByDay
    .filter(day => {
      const dayDate = new Date(day.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return dayDate >= weekAgo
    })
    .reduce((sum, day) => sum + day._count.id, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o desempenho da sua loja
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicksLast7Days}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Com cliques registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cliques por Dia</CardTitle>
            <CardDescription>
              Evolução dos cliques nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.clicksByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Marketplaces</CardTitle>
            <CardDescription>
              Marketplaces com mais cliques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topMarketplaces.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum clique registrado ainda
                </p>
              ) : (
                analytics.topMarketplaces.map((marketplace, index) => (
                  <div key={marketplace.marketplace} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium">{marketplace.marketplace}</span>
                    </div>
                    <span className="text-lg font-semibold">
                      {marketplace._count.id} cliques
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Clicados</CardTitle>
          <CardDescription>
            Produtos com maior engajamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum produto com cliques ainda
            </p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{product.title}</h4>
                      <p className="text-sm text-gray-600">
                        {product._count.clicks} clique{product._count.clicks !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço'}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
