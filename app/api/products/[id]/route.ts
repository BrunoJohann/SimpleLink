import { authOptions } from '@/lib/auth'
import { productRepo } from '@/lib/repos/product'
import { storeRepo } from '@/lib/repos/store'
import { updateProductSchema } from '@/lib/validation/product'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await storeRepo.findFirstByOwnerId(session.user.id)
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const product = await productRepo.findById(params.id)
    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = updateProductSchema.parse(body)

    // Check if slug is available (excluding current product)
    if (validatedData.slug && validatedData.slug !== product.slug) {
      const isSlugAvailable = await productRepo.isSlugAvailable(
        validatedData.slug,
        store.id,
        params.id
      )
      
      if (!isSlugAvailable) {
        return NextResponse.json(
          { error: 'Slug already exists in this store' },
          { status: 400 }
        )
      }
    }

    const updatedProduct = await productRepo.update(params.id, validatedData)

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Product update error:', error)
    
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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await storeRepo.findFirstByOwnerId(session.user.id)
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const product = await productRepo.findById(params.id)
    if (!product || product.storeId !== store.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await productRepo.delete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
