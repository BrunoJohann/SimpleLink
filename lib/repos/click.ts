import { prisma } from '@/lib/prisma'

export const clickRepo = {
  async create(data: {
    productId: string
    marketplace: string
    referer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    ip?: string
    userAgent?: string
  }) {
    return prisma.clickEvent.create({
      data,
    })
  },

  async getStats(productId: string) {
    const [total, byMarketplace] = await Promise.all([
      prisma.clickEvent.count({
        where: { productId },
      }),
      prisma.clickEvent.groupBy({
        by: ['marketplace'],
        where: { productId },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ])

    return { total, byMarketplace }
  },
}
