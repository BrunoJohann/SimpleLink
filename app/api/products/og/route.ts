import { productRepo } from '@/lib/repos/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const store = url.searchParams.get('store')
    const product = url.searchParams.get('product')

    if (!store || !product) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const productData = await productRepo.findByStoreSlugAndProductSlug(store, product)
    
    if (!productData) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      title: productData.title,
      description: productData.description,
      imageUrl: productData.imageUrl,
      price: productData.price,
      store: {
        name: productData.store.name,
      },
    })
  } catch (error) {
    console.error('Product OG data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
