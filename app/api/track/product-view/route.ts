import { productRepo } from '@/lib/repos/product'
import { productViewRepo } from '@/lib/repos/product-view'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const store = url.searchParams.get('store')
  const product = url.searchParams.get('product')

  if (!store || !product) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const prod = await productRepo.findByStoreSlugAndProductSlug(store, product)

    if (!prod) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const utm_source = url.searchParams.get('utm_source') ?? undefined
    const utm_medium = url.searchParams.get('utm_medium') ?? undefined
    const utm_campaign = url.searchParams.get('utm_campaign') ?? undefined

    // Log the product view
    await productViewRepo.create({
      productId: prod.id,
      referer: req.headers.get('referer') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? undefined,
      utm_source,
      utm_medium,
      utm_campaign,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product view tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
