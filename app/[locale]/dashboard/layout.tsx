import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardLayoutClient } from '@/components/DashboardLayoutClient'
import { routing } from '@/i18n/routing'
import { authOptions } from '@/lib/auth'
import { StoreProvider } from '@/lib/contexts/StoreContext'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({
  children,
  params
}: DashboardLayoutProps) {
  const { locale } = await params
  
  // Validar se o idioma é suportado
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Buscar loja do usuário no servidor
  let store = await storeRepo.findFirstByOwnerId(session.user.id)
  
  if (!store) {
    // Criar loja padrão se não existir
    store = await storeRepo.create({
      ownerId: session.user.id,
      name: `${session.user.name || 'Minha'} Loja`,
      slug: `${session.user.email?.split('@')[0] || 'loja'}-${Date.now()}`,
      description: 'Bem-vindo à minha loja de produtos afiliados!',
    })
  }

  // Carregar mensagens para o idioma atual
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <StoreProvider store={{ id: store.id, slug: store.slug, name: store.name }}>
          <div className="min-h-screen bg-background">
            <DashboardHeader />
            <DashboardLayoutClient>
              {children}
            </DashboardLayoutClient>
          </div>
        </StoreProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
