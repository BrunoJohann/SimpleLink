import { storeRepo } from '@/lib/repos/store'
import { storeVisitRepo } from '@/lib/repos/store-visit'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const storeSlug = url.searchParams.get('store')

  if (!storeSlug) {
    return NextResponse.json(
      { error: 'Missing store parameter' },
      { status: 400 }
    )
  }

  try {
    const store = await storeRepo.findBySlug(storeSlug)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const utm_source = url.searchParams.get('utm_source') ?? undefined
    const utm_medium = url.searchParams.get('utm_medium') ?? undefined
    const utm_campaign = url.searchParams.get('utm_campaign') ?? undefined

    // Log the store visit
    await storeVisitRepo.create({
      storeId: store.id,
      referer: req.headers.get('referer') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? undefined,
      utm_source,
      utm_medium,
      utm_campaign,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Store visit tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
