import { prisma } from '@/lib/prisma'
import { CreateStoreInput, UpdateStoreInput } from '@/lib/validation/store'

export const storeRepo = {
  async findById(id: string) {
    return prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })
  },

  async findBySlug(slug: string) {
    return prisma.store.findUnique({
      where: { slug },
      include: {
        owner: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })
  },

  async findByOwnerId(ownerId: string) {
    return prisma.store.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findFirstByOwnerId(ownerId: string) {
    return prisma.store.findFirst({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    })
  },

  async create(data: CreateStoreInput & { ownerId: string }) {
    return prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        theme: data.theme,
        ownerId: data.ownerId,
      },
    })
  },

  async update(id: string, data: UpdateStoreInput) {
    return prisma.store.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        theme: data.theme,
      },
    })
  },

  async delete(id: string) {
    return prisma.store.delete({
      where: { id },
    })
  },

  async isSlugAvailable(slug: string, excludeId?: string) {
    const store = await prisma.store.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!store) return true
    if (excludeId && store.id === excludeId) return true
    return false
  },
}
