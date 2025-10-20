import { prisma } from '@/lib/prisma'

export const storeVisitRepo = {
  async create(data: {
    storeId: string
    referer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    ip?: string
    userAgent?: string
  }) {
    return prisma.storeVisit.create({
      data,
    })
  },

  async getStats(storeId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [total, byDay, bySource] = await Promise.all([
      // Total visits
      prisma.storeVisit.count({
        where: { storeId },
      }),

      // Visits by day
      prisma.storeVisit.groupBy({
        by: ['createdAt'],
        where: {
          storeId,
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Visits by UTM source
      prisma.storeVisit.groupBy({
        by: ['utm_source'],
        where: {
          storeId,
          createdAt: { gte: startDate },
          utm_source: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ])

    return { total, byDay, bySource }
  },
}
