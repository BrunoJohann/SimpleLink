import { FormSkeleton } from '@/components/LoadingSkeletons'
import { Card } from '@/components/ui/card'

export default function NewProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      
      <Card className="p-6">
        <FormSkeleton />
      </Card>
    </div>
  )
}

