import { StoreHeaderSkeleton, ProductDetailSkeleton } from '@/components/LoadingSkeletons'

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeaderSkeleton />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back button skeleton */}
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Product detail skeleton */}
          <ProductDetailSkeleton />
        </div>
      </main>
    </div>
  )
}

