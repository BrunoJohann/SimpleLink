import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="font-bold text-xl">SimpleLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Crie lojas incríveis para seus{' '}
          <span className="text-blue-600">produtos afiliados</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transforme seus links de afiliados em uma experiência de compra profissional. 
          Rastreie cliques, analise performance e maximize suas vendas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Começar Agora - Grátis
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Ver Demonstração
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para vender mais
          </h2>
          <p className="text-lg text-gray-600">
            Ferramentas profissionais para criar e gerenciar sua loja de afiliados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Loja Personalizada</CardTitle>
              <CardDescription>
                Crie uma loja única com seu próprio domínio e identidade visual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Design responsivo</li>
                <li>• Temas personalizáveis</li>
                <li>• SEO otimizado</li>
                <li>• Carregamento rápido</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rastreamento Avançado</CardTitle>
              <CardDescription>
                Monitore cliques, conversões e performance em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Analytics detalhados</li>
                <li>• Relatórios por marketplace</li>
                <li>• Dados de UTM</li>
                <li>• Exportação de dados</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestão Simplificada</CardTitle>
              <CardDescription>
                Interface intuitiva para gerenciar produtos e links facilmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• CRUD de produtos</li>
                <li>• Links por marketplace</li>
                <li>• Busca e filtros</li>
                <li>• Importação em lote</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Crie sua primeira loja em minutos e comece a vender mais produtos afiliados hoje mesmo.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Começar Grátis Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <span className="font-bold text-xl">SimpleLink</span>
            </div>
            <p className="text-gray-400">
              © 2024 SimpleLink. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
