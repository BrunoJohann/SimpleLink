import { authOptions } from '@/lib/auth'
import { storeRepo } from '@/lib/repos/store'
import { updateStoreSchema } from '@/lib/validation/store'
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

    const store = await storeRepo.findBySlug(params.id)
    if (!store || store.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = updateStoreSchema.parse(body)

    // Check if slug is available (excluding current store)
    if (validatedData.slug && validatedData.slug !== store.slug) {
      const isSlugAvailable = await storeRepo.isSlugAvailable(
        validatedData.slug,
        store.id
      )
      
      if (!isSlugAvailable) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const updatedStore = await storeRepo.update(store.id, validatedData)

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error('Store update error:', error)
    
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
