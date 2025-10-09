import { Decimal } from '@prisma/client/runtime/library'

/**
 * Serializa objetos Prisma para JSON-safe objects
 * Converte Decimal para number e Date para string
 */
export function serializeProduct<
  T extends { price?: Decimal | null; [key: string]: any },
>(product: T) {
  const serialized = { ...product } as any

  // Convert Decimal to number
  if (product.price !== undefined && product.price !== null) {
    serialized.price = Number(product.price)
  } else {
    serialized.price = null
  }

  return serialized as Omit<T, 'price'> & { price: number | null }
}

export function serializeProducts<
  T extends { price?: Decimal | null; [key: string]: any },
>(products: T[]) {
  return products.map(serializeProduct)
}
