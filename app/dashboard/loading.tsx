import { DashboardStatsSkeleton, ProductListSkeleton } from '@/components/LoadingSkeletons'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      
      <DashboardStatsSkeleton />
      
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/5 animate-pulse"></div>
        <ProductListSkeleton />
      </div>
    </div>
  )
}

