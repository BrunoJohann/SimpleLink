import { Store } from '@prisma/client'

interface StoreHeaderProps {
  store: Store & {
    owner: {
      id: string
      name: string | null
      image: string | null
    }
  }
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const theme = store.theme as any

  return (
    <header 
      className="bg-white border-b shadow-sm"
      style={{
        backgroundColor: theme?.primaryColor ? `${theme.primaryColor}10` : undefined,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4">
          {store.logo && (
            <img
              src={store.logo}
              alt={store.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            {store.description && (
              <p className="text-lg text-gray-600 mt-2">{store.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              por {store.owner.name || 'Anônimo'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
