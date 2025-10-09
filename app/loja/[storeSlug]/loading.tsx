import { StoreHeaderSkeleton, PublicProductListSkeleton } from '@/components/LoadingSkeletons'

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeaderSkeleton />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search bar skeleton */}
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Products grid skeleton */}
          <PublicProductListSkeleton />
        </div>
      </main>
    </div>
  )
}

