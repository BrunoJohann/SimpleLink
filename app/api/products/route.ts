import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { createProductSchema } from '@/lib/validation/product'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createProductSchema.parse(body)

    const store = await storeRepo.findFirstByOwnerId(session.user.id)
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Check if slug is available
    const isSlugAvailable = await productRepo.isSlugAvailable(
      validatedData.slug,
      store.id
    )
    
    if (!isSlugAvailable) {
      return NextResponse.json(
        { error: 'Slug already exists in this store' },
        { status: 400 }
      )
    }

    const product = await productRepo.create({
      ...validatedData,
      storeId: store.id,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
