import { prisma } from '@/lib/prisma'

export const productViewRepo = {
  async create(data: {
    productId: string
    referer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    ip?: string
    userAgent?: string
  }) {
    return prisma.productView.create({
      data,
    })
  },

  async getStats(productId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [total, byDay] = await Promise.all([
      // Total views
      prisma.productView.count({
        where: { productId },
      }),

      // Views by day
      prisma.productView.groupBy({
        by: ['createdAt'],
        where: {
          productId,
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    return { total, byDay }
  },

  async getStoreStats(storeId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [total, byDay, topProducts] = await Promise.all([
      // Total views for store
      prisma.productView.count({
        where: {
          product: { storeId },
        },
      }),

      // Views by day for store
      prisma.productView.groupBy({
        by: ['createdAt'],
        where: {
          product: { storeId },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top products by views
      prisma.product.findMany({
        where: { storeId },
        include: {
          _count: {
            select: { views: true },
          },
        },
        orderBy: { views: { _count: 'desc' } },
        take: 10,
      }),
    ])

    return { total, byDay, topProducts }
  },
}
