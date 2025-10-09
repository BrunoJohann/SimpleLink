import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      select: {
        slug: true,
        products: {
          where: { published: true },
          select: { slug: true },
        },
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${stores.map(store => `
  <url>
    <loc>${baseUrl}/loja/${store.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${store.products.map(product => `
  <url>
    <loc>${baseUrl}/loja/${store.slug}/${product.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
