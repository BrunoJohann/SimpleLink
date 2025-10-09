import { ProductListSkeleton } from '@/components/LoadingSkeletons'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      
      <ProductListSkeleton />
    </div>
  )
}

