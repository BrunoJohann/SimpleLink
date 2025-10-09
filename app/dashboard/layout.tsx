import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardLayoutClient } from '@/components/DashboardLayoutClient'
import { authOptions } from '@/lib/auth'
import { StoreProvider } from '@/lib/contexts/StoreContext'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <StoreProvider store={{ id: store.id, slug: store.slug, name: store.name }}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <DashboardLayoutClient>
          {children}
        </DashboardLayoutClient>
      </div>
    </StoreProvider>
  )
}
