import { ProductForm } from '@/components/ProductForm'
import { authOptions } from '@/lib/auth'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function NewProductPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
        <p className="text-gray-600 mt-2">
          Adicione um novo produto à sua loja
        </p>
      </div>

      <ProductForm storeId={store.id} />
    </div>
  )
}
