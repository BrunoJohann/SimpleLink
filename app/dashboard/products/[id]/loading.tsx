import { FormSkeleton } from '@/components/LoadingSkeletons'
import { Card } from '@/components/ui/card'

export default function ProductEditLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      
      <Card className="p-6">
        <FormSkeleton />
      </Card>
    </div>
  )
}

