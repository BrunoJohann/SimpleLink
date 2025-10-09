import { authOptions } from '@/lib/auth'
import { storeRepo } from '@/lib/repos/store'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await storeRepo.findFirstByOwnerId(session.user.id)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: store.id,
      slug: store.slug,
      name: store.name,
    })
  } catch (error) {
    console.error('Error fetching user store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
