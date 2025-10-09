import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ProductCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-end space-x-2">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

export function AnalyticsChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

// Public Store Skeletons
export function StoreHeaderSkeleton() {
  return (
    <header className="bg-white border-b shadow-sm animate-pulse">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function PublicProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}

export function PublicProductListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <PublicProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="space-y-4 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg"></div>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-7 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

