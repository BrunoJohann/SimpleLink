import { FormSkeleton } from '@/components/LoadingSkeletons'
import { Card } from '@/components/ui/card'

export default function AppearanceLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
      
      <Card className="p-6">
        <FormSkeleton />
      </Card>
    </div>
  )
}

