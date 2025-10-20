import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  })

  // Create a demo store
  const store = await prisma.store.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      ownerId: user.id,
      name: 'Demo Store',
      slug: 'demo-store',
      description: 'Uma loja de demonstração com produtos incríveis',
      language: 'pt-BR',
      theme: {
        primaryColor: '#3b82f6',
        layout: 'grid',
        preset: 'light',
      },
    },
  })

  // Create demo products
  const products = [
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description:
        'O mais avançado iPhone com chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6.7".',
      imageUrl:
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
      price: 7999.0,
      published: true,
    },
    {
      title: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description:
        'Notebook ultraportátil com chip M2, tela Liquid Retina de 13.6" e até 18h de bateria.',
      imageUrl:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      price: 8999.0,
      published: true,
    },
    {
      title: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      description:
        'Fones sem fio com cancelamento ativo de ruído e áudio espacial personalizado.',
      imageUrl:
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
      price: 2199.0,
      published: true,
    },
    {
      title: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      description:
        'Smartwatch com chip S9, GPS e monitoramento de saúde avançado.',
      imageUrl:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      price: 3299.0,
      published: true,
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug: productData.slug,
        },
      },
      update: {},
      create: {
        ...productData,
        storeId: store.id,
      },
    })

    // Create affiliate links for each product
    const marketplaces = [
      { name: 'Amazon', url: 'https://amazon.com.br/dp/example' },
      { name: 'Mercado Livre', url: 'https://mercadolivre.com.br/example' },
      { name: 'Magazine Luiza', url: 'https://magazineluiza.com.br/example' },
    ]

    for (const marketplace of marketplaces) {
      await prisma.affiliateLink.upsert({
        where: {
          productId_marketplace: {
            productId: product.id,
            marketplace: marketplace.name,
          },
        },
        update: {},
        create: {
          productId: product.id,
          marketplace: marketplace.name,
          url: marketplace.url,
          note: 'Frete grátis',
        },
      })
    }
  }

  console.log('Seed completed successfully!')
  console.log(`Demo store available at: /loja/${store.slug}`)
  console.log(`Demo user email: ${user.email}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
