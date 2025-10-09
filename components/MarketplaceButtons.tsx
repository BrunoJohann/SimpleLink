import { Button } from '@/components/ui/button'
import { AffiliateLink } from '@prisma/client'

interface MarketplaceButtonsProps {
  links: AffiliateLink[]
  storeSlug: string
  productSlug: string
}

export function MarketplaceButtons({ links, storeSlug, productSlug }: MarketplaceButtonsProps) {
  const marketplaceColors: Record<string, string> = {
    amazon: 'bg-yellow-500 hover:bg-yellow-600',
    mercadolivre: 'bg-blue-500 hover:bg-blue-600',
    shopee: 'bg-orange-500 hover:bg-orange-600',
    magazineluiza: 'bg-purple-500 hover:bg-purple-600',
    americanas: 'bg-red-500 hover:bg-red-600',
    submarino: 'bg-green-500 hover:bg-green-600',
    casasbahia: 'bg-blue-600 hover:bg-blue-700',
    extra: 'bg-indigo-500 hover:bg-indigo-600',
  }

  const getMarketplaceDisplayName = (marketplace: string) => {
    const names: Record<string, string> = {
      amazon: 'Amazon',
      mercadolivre: 'Mercado Livre',
      shopee: 'Shopee',
      magazineluiza: 'Magazine Luiza',
      americanas: 'Americanas',
      submarino: 'Submarino',
      casasbahia: 'Casas Bahia',
      extra: 'Extra',
    }
    return names[marketplace.toLowerCase()] || marketplace
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum link disponível para este produto.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Comprar em:</h3>
      <div className="grid gap-3">
        {links.map((link) => (
          <Button
            key={link.id}
            asChild
            className={`text-white font-medium ${
              marketplaceColors[link.marketplace.toLowerCase()] || 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <a
              href={`/api/track/click?store=${storeSlug}&product=${productSlug}&m=${link.marketplace.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              {getMarketplaceDisplayName(link.marketplace)}
              {link.note && (
                <span className="text-xs opacity-90 ml-2">({link.note})</span>
              )}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
