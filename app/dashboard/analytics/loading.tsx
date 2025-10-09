import { AnalyticsChartSkeleton, DashboardStatsSkeleton } from '@/components/LoadingSkeletons'

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      
      <DashboardStatsSkeleton />
      
      <AnalyticsChartSkeleton />
    </div>
  )
}

