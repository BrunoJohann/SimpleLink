import { clickRepo } from '@/lib/repos/click'
import { productRepo } from '@/lib/repos/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const store = url.searchParams.get('store')
  const product = url.searchParams.get('product')
  const m = url.searchParams.get('m')?.toLowerCase() || ''

  if (!store || !product || !m) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const prod = await productRepo.findByStoreSlugAndProductSlug(store, product)
    
    if (!prod) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const link = prod.links.find(l => l.marketplace.toLowerCase() === m)
    if (!link) {
      return NextResponse.json({ error: 'Marketplace link not found' }, { status: 404 })
    }

    const utm_source = url.searchParams.get('utm_source') ?? undefined
    const utm_medium = url.searchParams.get('utm_medium') ?? undefined
    const utm_campaign = url.searchParams.get('utm_campaign') ?? undefined

    // Log the click event
    await clickRepo.create({
      productId: prod.id,
      marketplace: m,
      referer: req.headers.get('referer') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? undefined,
      utm_source,
      utm_medium,
      utm_campaign,
    })

    // Build destination URL with UTM parameters
    const dest = new URL(link.url)
    if (utm_source) dest.searchParams.set('utm_source', utm_source)
    if (utm_medium) dest.searchParams.set('utm_medium', utm_medium)
    if (utm_campaign) dest.searchParams.set('utm_campaign', utm_campaign)

    return NextResponse.redirect(dest.toString(), { status: 302 })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
