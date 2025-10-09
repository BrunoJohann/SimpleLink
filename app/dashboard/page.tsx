import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { serializeProducts } from '@/lib/utils/serialize'
import { Eye, Package, Plus, TrendingUp } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
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
          Olá, {session.user.name || session.user.email}!
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao painel da sua loja "{store.name}"
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts === 0 ? 'Nenhum produto ainda' : `${totalProducts} produtos cadastrados`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques (7 dias)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {totalClicks === 0 ? 'Nenhum clique ainda' : `${totalClicks} cliques registrados`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Top</CardTitle>
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
            <CardTitle className="text-sm font-medium">Loja Ativa</CardTitle>
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
                Ver loja pública
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos Recentes</CardTitle>
            <CardDescription>
              Seus produtos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto ainda
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece criando seu primeiro produto para sua loja.
                </p>
                <Link href="/dashboard/products/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Produto
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
                        {product.links.length} marketplace{product.links.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.published ? 'Publicado' : 'Rascunho'}
                      </span>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/products">
                    <Button variant="outline">Ver todos os produtos</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Cliques dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.clicksByDay.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum clique ainda
                </h3>
                <p className="text-gray-600">
                  Os cliques aparecerão aqui conforme as pessoas visitam seus produtos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.clicksByDay.slice(-5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(day.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="font-medium">{day._count.id} cliques</span>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/analytics">
                    <Button variant="outline">Ver analytics completo</Button>
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
