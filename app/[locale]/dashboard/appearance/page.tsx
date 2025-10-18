import { AppearanceForm } from '@/components/AppearanceForm'
import { AppearancePreview } from '@/components/AppearancePreview'
import { authOptions } from '@/lib/auth'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function AppearancePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const store = await storeRepo.findFirstByOwnerId(session.user.id)
  if (!store) {
    redirect('/dashboard')
  }

  const t = await getTranslations('dashboard.appearance')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AppearanceForm store={store} />
        </div>
        
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <AppearancePreview />
          </div>
        </div>
      </div>
    </div>
  )
}
