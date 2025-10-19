'use client'

import { AffiliateLink, Product } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { EmptyState } from './EmptyState'
import { ProductCard } from './ProductCard'
import { SearchBar } from './SearchBar'
import { Button } from './ui/button'

interface ProductListProps {
  products: (Omit<Product, 'price'> & {
    price: number | null
    links: AffiliateLink[]
    _count: {
      clicks: number
    }
  })[]
  storeSlug: string
  search: string
  total: number
  pages: number
  currentPage: number
  theme?: any
}

export function ProductList({ 
  products, 
  storeSlug, 
  search, 
  total, 
  pages, 
  currentPage,
  theme
}: ProductListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(search)

  const handleSearch = (value: string) => {
    setSearchValue(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.delete('page') // Reset to first page
    router.push(`/loja/${storeSlug}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/loja/${storeSlug}?${params.toString()}`)
  }

  if (products.length === 0 && !search) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Esta loja ainda não possui produtos cadastrados."
      />
    )
  }

  if (products.length === 0 && search) {
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <SearchBar
            value={searchValue}
            onChange={handleSearch}
            placeholder="Buscar produtos..."
          />
        </div>
        <EmptyState
          title="Nenhum produto encontrado"
          description={`Não encontramos produtos para "${search}". Tente outro termo de busca.`}
          action={{
            label: 'Limpar busca',
            onClick: () => handleSearch('')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <SearchBar
          value={searchValue}
          onChange={handleSearch}
          placeholder="Buscar produtos..."
        />
      </div>

      {/* Results Info */}
      <div className="text-center">
        <p style={{
          color: theme?.preset === 'dim' ? '#d1d5db' : '#6b7280'
        }}>
          {search ? (
            <>
              {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''} para "{search}"
            </>
          ) : (
            <>
              {total} produto{total !== 1 ? 's' : ''} {total !== 1 ? 'disponíveis' : 'disponível'}
            </>
          )}
        </p>
      </div>

      {/* Products Grid/List */}
      <div className={`grid gap-4 ${
        theme?.layout === 'list' ? 'grid-cols-1' : 
        theme?.productSize === 'small' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 
        theme?.productSize === 'large' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeSlug={storeSlug}
            theme={theme}
          />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              let pageNum
              if (pages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= pages - 2) {
                pageNum = pages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  )
}
