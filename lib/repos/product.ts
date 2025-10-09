import { prisma } from '@/lib/prisma'
import {
  CreateProductInput,
  UpdateProductInput,
} from '@/lib/validation/product'

export const productRepo = {
  async findByStoreSlugAndProductSlug(storeSlug: string, productSlug: string) {
    return prisma.product.findFirst({
      where: {
        store: { slug: storeSlug },
        slug: productSlug,
        published: true,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            theme: true,
            owner: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        links: true,
        _count: {
          select: { clicks: true },
        },
      },
    })
  },

  async findByStoreSlug(
    storeSlug: string,
    options?: { search?: string; page?: number; limit?: number }
  ) {
    const { search, page = 1, limit = 12 } = options || {}
    const skip = (page - 1) * limit

    const where = {
      store: { slug: storeSlug },
      published: true,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              theme: true,
            },
          },
          links: true,
          _count: {
            select: { clicks: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }
  },

  async findByStoreId(
    storeId: string,
    options?: { search?: string; page?: number; limit?: number }
  ) {
    const { search, page = 1, limit = 20 } = options || {}
    const skip = (page - 1) * limit

    const where = {
      storeId,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          links: true,
          _count: {
            select: { clicks: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        store: {
          select: { id: true, name: true, slug: true, ownerId: true },
        },
        links: true,
        _count: {
          select: { clicks: true },
        },
      },
    })
  },

  async create(data: CreateProductInput & { storeId: string }) {
    return prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl || null,
        price: data.price ? parseFloat(data.price) : null,
        published: data.published,
        storeId: data.storeId,
      },
    })
  },

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl || null,
        price: data.price ? parseFloat(data.price) : null,
        published: data.published,
      },
    })
  },

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    })
  },

  async updateLinks(
    productId: string,
    links: Array<{ marketplace: string; url: string; note?: string }>
  ) {
    await prisma.affiliateLink.deleteMany({
      where: { productId },
    })

    if (links.length > 0) {
      await prisma.affiliateLink.createMany({
        data: links.map(link => ({
          productId,
          marketplace: link.marketplace,
          url: link.url,
          note: link.note,
        })),
      })
    }
  },

  async isSlugAvailable(slug: string, storeId: string, excludeId?: string) {
    const product = await prisma.product.findUnique({
      where: {
        storeId_slug: { storeId, slug },
      },
      select: { id: true },
    })

    if (!product) return true
    if (excludeId && product.id === excludeId) return true
    return false
  },

  async getAnalytics(storeId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [clicksByDay, topProducts, topMarketplaces] = await Promise.all([
      // Clicks by day
      prisma.clickEvent.groupBy({
        by: ['createdAt'],
        where: {
          product: { storeId },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top products
      prisma.product.findMany({
        where: { storeId },
        include: {
          _count: {
            select: { clicks: true },
          },
        },
        orderBy: { clicks: { _count: 'desc' } },
        take: 10,
      }),

      // Top marketplaces
      prisma.clickEvent.groupBy({
        by: ['marketplace'],
        where: {
          product: { storeId },
          createdAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ])

    return {
      clicksByDay,
      topProducts,
      topMarketplaces,
    }
  },
}
