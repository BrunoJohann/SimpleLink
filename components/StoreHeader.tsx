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
      className="border-b shadow-sm py-4"
      style={{
        backgroundColor: 'transparent',
        borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb',
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center space-x-4 ${
          theme?.headerStyle === 'centered' ? 'justify-center' : ''
        }`}>
          {theme?.showLogo !== false && store.logo && (
            <img
              src={store.logo}
              alt={store.name}
                className="rounded-lg object-cover border w-12 h-12"
              style={{
                borderColor: theme?.preset === 'dim' ? '#374151' : '#e5e7eb'
              }}
            />
          )}
          <div>
            <h1 className="font-bold text-lg" style={{
              color: theme?.preset === 'dim' ? '#f9fafb' : '#111827'
            }}>
              {store.name}
            </h1>
            {store.description && (
              <p className="opacity-75 text-sm" style={{
                color: theme?.preset === 'dim' ? '#d1d5db' : '#6b7280'
              }}>
                {store.description}
              </p>
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
