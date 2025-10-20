import { prisma } from '@/lib/prisma'
import { productViewRepo } from './product-view'
import { storeVisitRepo } from './store-visit'

export const analyticsRepo = {
  async getStoreAnalytics(storeId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [storeVisits, productViews, clicks] = await Promise.all([
      // Store visits
      storeVisitRepo.getStats(storeId, days),

      // Product views
      productViewRepo.getStoreStats(storeId, days),

      // Clicks
      prisma.clickEvent.groupBy({
        by: ['createdAt'],
        where: {
          product: { storeId },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    const totalClicks = clicks.reduce((sum, day) => sum + day._count.id, 0)

    return {
      storeVisits: {
        total: storeVisits.total,
        byDay: storeVisits.byDay,
        bySource: storeVisits.bySource,
      },
      productViews: {
        total: productViews.total,
        byDay: productViews.byDay,
        topProducts: productViews.topProducts,
      },
      clicks: {
        total: totalClicks,
        byDay: clicks,
      },
    }
  },
}
